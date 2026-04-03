import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ✅ Automatically attach token from localStorage for every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => API.post('/auth/register', data).then(r => r.data);
export const login = (data) => API.post('/auth/login', data).then(r => {
  console.log('Login response:', r.data);
  return r.data;
});

export const uploadFile = (formData) => {
  return API.post('/uploads/upload', formData).then(r => r.data);
};

export const getHistory = () => API.get('/uploads/history').then(r => r.data);
export const getAllUploads = () => API.get('/uploads/all').then(r => r.data);

export const updateUser = (userData) => API.put('/auth/profile', userData).then(r => r.data);
export const changePassword = (passwords) => API.post('/auth/change-password', passwords).then(r => r.data);

export const generateInsights = (id) => API.post(`/ai/generate-insights/${id}`).then(r => r.data);
