import axios from 'axios';

const BASE_URL  = process.env.BUK_BASE_URL || 'https://coofisam.buk.co/api/v1';
const TOKEN     = process.env.BUK_TOKEN || '';
const AUTH_TYPE = process.env.BUK_AUTH_TYPE || 'bearer';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  if (TOKEN) {
    if (AUTH_TYPE === 'bearer') config.headers.Authorization = `Bearer ${TOKEN}`;
    else config.headers['X-API-KEY'] = TOKEN;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status  = err?.response?.status;
    const message = err?.response?.data?.message || err?.message || 'API error';
    return Promise.reject({ status, message, data: err?.response?.data });
  }
);

export default api;
