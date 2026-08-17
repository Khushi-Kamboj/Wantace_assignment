export default function QuestionField({ question, value, onChange, error }) {
  const inputId = `question-${question.key}`;
  if (!question.active) return null;
  if (question.type === 'number') {
    const hint = [question.min !== undefined && `Minimum ${question.min}`, question.max !== undefined && `maximum ${question.max}`, question.unit].filter(Boolean).join(' · ');
    return <div className="question-field"><label htmlFor={inputId}>{question.label}{question.required && <span aria-hidden="true"> *</span>}</label>{hint && <p className="field-hint" id={`${inputId}-hint`}>{hint}</p>}<input id={inputId} type="number" inputMode="decimal" min={question.min} max={question.max} value={value ?? ''} onChange={(event) => onChange(question.key, event.target.value === '' ? '' : Number(event.target.value))} aria-describedby={`${inputId}-hint`} aria-invalid={Boolean(error)} className={error ? 'has-error' : ''} placeholder={question.unit ? `Enter ${question.unit}` : 'Enter a value'} />{error && <p className="field-error" role="alert">{error}</p>}</div>;
  }
  if (question.type === 'select') return <fieldset className="question-field" aria-invalid={Boolean(error)}><legend>{question.label}{question.required && <span aria-hidden="true"> *</span>}</legend><div className="option-grid">{(question.options || []).map((option) => <label className={`option-card ${value === option.value ? 'selected' : ''}`} key={option.value}><input type="radio" name={question.key} value={option.value} checked={value === option.value} onChange={() => onChange(question.key, option.value)} /><span>{option.label}</span><span className="radio-dot" aria-hidden="true" /></label>)}</div>{error && <p className="field-error" role="alert">{error}</p>}</fieldset>;
  return null;
}
