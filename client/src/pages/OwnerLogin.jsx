import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getErrorMessage, loginOwner } from '../services/api';

export default function OwnerLogin() {
  const [form, setForm] = useState({ username: '', password: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  if (localStorage.getItem('northline_owner_token')) return <Navigate to="/owner" replace />;
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(''); try { const response = await loginOwner(form); localStorage.setItem('northline_owner_token', response.token); navigate('/owner'); } catch (err) { setError(getErrorMessage(err, 'Unable to sign in.')); } finally { setLoading(false); } };
  return <main className="auth-page"><Link className="brand" to="/"><span className="brand-mark">N</span><span>Northline</span></Link><form className="auth-card" onSubmit={submit}><p className="eyebrow">Owner access</p><h1>Welcome back</h1><p className="form-description">Sign in to view your estimate requests.</p><div className="question-field"><label htmlFor="username">Username</label><input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" required /></div><div className="question-field"><label htmlFor="password">Password</label><input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required /></div>{error && <p className="request-error" role="alert">{error}</p>}<button className="button button-primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form></main>;
}
