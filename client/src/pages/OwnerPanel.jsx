import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminConfig, getErrorMessage, getLeads, updateAdminConfig } from '../services/api';

const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });
const money = (amount, code = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(amount);
const numericFields = [
  ['rate_per_sqft', 'Material rate / sq ft'],
  ['multiplier', 'Multiplier'],
  ['tear_off_per_sqft', 'Tear-off rate / sq ft']
];
const modifierFields = [
  ['waste_factor', 'Waste factor'],
  ['permit_flat_fee', 'Permit flat fee'],
  ['range_spread_pct', 'Estimate range spread (%)']
];
const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const numberOrUndefined = (value) => (value === '' ? undefined : Number(value));

export default function OwnerPanel() {
  const [leads, setLeads] = useState([]);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('northline_owner_token');

  const handleRequestError = (err, fallback) => {
    setError(getErrorMessage(err, fallback));
    if (err.response?.status === 401) {
      localStorage.removeItem('northline_owner_token');
      navigate('/owner/login');
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([getLeads(token), getAdminConfig(token)])
      .then(([leadData, configData]) => { if (!cancelled) { setLeads(leadData); setConfig(configData); } })
      .catch((err) => { if (!cancelled) handleRequestError(err, 'Unable to load owner data.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  // The token is read from storage at mount; navigation is the only reactive dependency.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const changeQuestion = (questionIndex, field, value) => {
    setConfig((current) => ({ ...current, questions: current.questions.map((question, index) => index === questionIndex ? { ...question, [field]: value } : question) }));
  };

  const changeOption = (questionIndex, optionIndex, field, value) => {
    setConfig((current) => ({ ...current, questions: current.questions.map((question, index) => index !== questionIndex ? question : { ...question, options: question.options.map((option, optionPosition) => optionPosition === optionIndex ? { ...option, [field]: value } : option) }) }));
  };

  const changeModifier = (field, value) => setConfig((current) => ({ ...current, modifiers: { ...current.modifiers, [field]: value } }));

  const saveConfig = async (event) => {
    event.preventDefault();
    setSaving(true); setError(''); setMessage('');
    try {
      await updateAdminConfig(token, config);
      const refreshed = await getAdminConfig(token);
      setConfig(refreshed);
      setMessage(`Configuration saved successfully. You are now viewing version ${refreshed.config_version}.`);
    } catch (err) {
      handleRequestError(err, 'Unable to save the configuration. Please review your changes and try again.');
    } finally { setSaving(false); }
  };

  const logout = () => { localStorage.removeItem('northline_owner_token'); navigate('/owner/login'); };

  return <main className="owner-page">
    <header className="owner-header"><Link className="brand" to="/"><span className="brand-mark">N</span><span>{config?.business?.name || 'Northline'}</span></Link><button className="text-button" onClick={logout}>Sign out</button></header>
    <section className="owner-content">
      <div className="owner-title"><div><p className="eyebrow">Owner panel</p><h1>Business dashboard</h1><p>Manage your estimator settings and review incoming project requests.</p></div>{config && <span className="version-badge">Configuration v{config.config_version}</span>}</div>
      {loading ? <div className="empty-panel"><div className="spinner" /><p>Loading owner workspace…</p></div> : error && !config ? <div className="empty-panel"><p className="request-error">{error}</p></div> : <>
        <form className="config-panel" onSubmit={saveConfig}>
          <div className="panel-heading"><div><h2>Estimator configuration</h2><p>Edit project questions, pricing inputs, and global estimate modifiers.</p></div><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : 'Save configuration'}</button></div>
          <div className="config-content">
            <section className="modifier-section"><h3>Global modifiers</h3><div className="modifier-grid">{modifierFields.map(([field, label]) => <NumericInput key={field} label={label} value={config.modifiers?.[field]} onChange={(value) => changeModifier(field, value)} />)}</div></section>
            <section><h3>Estimator questions</h3><p className="section-description">All questions are shown, including those currently hidden from customers.</p><div className="config-question-list">{config.questions.map((question, questionIndex) => <QuestionEditor key={question._id || question.key} question={question} questionIndex={questionIndex} onQuestionChange={changeQuestion} onOptionChange={changeOption} />)}</div></section>
          </div>
          <div className="config-footer">{error && <p className="request-error" role="alert">{error}</p>}{message && <p className="success-message" role="status">{message}</p>}<button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : 'Save configuration'}</button></div>
        </form>
        <section className="leads-panel"><div className="panel-heading"><div><h2>Captured leads</h2><p>Project requests submitted through the estimator.</p></div><span>{leads.length} total</span></div>{leads.length ? <div className="lead-list">{leads.map((lead) => <article className="lead-card" key={lead._id}><div className="lead-main"><div><h3>{lead.name}</h3><a href={`tel:${lead.phone}`}>{lead.phone}</a>{lead.email && <a href={`mailto:${lead.email}`}>{lead.email}</a>}</div><div className="lead-estimate"><span>Estimate</span><strong>{money(lead.estimate_low, config.business?.currency)}–{money(lead.estimate_high, config.business?.currency)}</strong></div></div><div className="answer-list">{Object.entries(lead.answers || {}).map(([key, value]) => <span key={key}><b>{config.questions.find((question) => question.key === key)?.label || key}:</b> {String(value)}</span>)}</div><footer>Received {lead.createdAt ? date.format(new Date(lead.createdAt)) : '—'} · Config v{lead.config_version}</footer></article>)}</div> : <div className="empty-panel">No estimate requests yet.</div>}</section>
      </>}
    </section>
  </main>;
}

function QuestionEditor({ question, questionIndex, onQuestionChange, onOptionChange }) {
  return <article className="config-question">
    <div className="config-question-heading"><div><span className="question-key">{question.key}</span><h4>{question.type === 'number' ? 'Number question' : 'Selection question'}</h4></div><label className="toggle-label"><input type="checkbox" checked={Boolean(question.active)} onChange={(event) => onQuestionChange(questionIndex, 'active', event.target.checked)} /><span className="toggle" aria-hidden="true" />{question.active ? 'Enabled' : 'Disabled'}</label></div>
    <div className="question-edit-grid"><TextInput label="Customer-facing label" value={question.label} onChange={(value) => onQuestionChange(questionIndex, 'label', value)} />{question.type === 'number' && <><NumericInput label="Minimum value" value={question.min} onChange={(value) => onQuestionChange(questionIndex, 'min', value)} /><NumericInput label="Maximum value" value={question.max} onChange={(value) => onQuestionChange(questionIndex, 'max', value)} /></>}</div>
    {question.type === 'select' && <div className="option-editor"><h5>Options and pricing</h5>{question.options.map((option, optionIndex) => <div className="option-edit-row" key={option._id || `${option.value}-${optionIndex}`}><TextInput label="Option label" value={option.label} onChange={(value) => onOptionChange(questionIndex, optionIndex, 'label', value)} /><TextInput label="Option value" value={option.value} onChange={(value) => onOptionChange(questionIndex, optionIndex, 'value', value)} />{numericFields.filter(([field]) => owns(option, field)).map(([field, label]) => <NumericInput key={field} label={label} value={option[field]} onChange={(value) => onOptionChange(questionIndex, optionIndex, field, value)} />)}</div>)}</div>}
  </article>;
}

function TextInput({ label, value, onChange }) { return <label className="editor-field"><span>{label}</span><input value={value ?? ''} onChange={(event) => onChange(event.target.value)} /></label>; }
function NumericInput({ label, value, onChange }) { return <label className="editor-field"><span>{label}</span><input type="number" step="any" value={value ?? ''} onChange={(event) => onChange(numberOrUndefined(event.target.value))} /></label>; }
