import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`
});

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => error.response?.data?.message || fallback;
export const getPublicConfig = async () => (await api.get('/config')).data.data;
export const createEstimate = async (payload) => (await api.post('/estimate', payload)).data.data;
export const loginOwner = async (credentials) => (await api.post('/auth/login', credentials)).data;
export const getLeads = async (token) => (await api.get('/admin/leads', { headers: { Authorization: `Bearer ${token}` } })).data.data;
export const getAdminConfig = async (token) => (await api.get('/admin/config', { headers: { Authorization: `Bearer ${token}` } })).data.data;
export const updateAdminConfig = async (token, config) => (await api.put('/admin/config', {
  business: config.business,
  questions: config.questions,
  modifiers: config.modifiers
}, { headers: { Authorization: `Bearer ${token}` } })).data;
export default api;
