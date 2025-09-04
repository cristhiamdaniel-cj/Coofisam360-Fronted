import api from './api.js';

export async function listCredits(params = {}) {
  const { data } = await api.get('/credits', { params });
  return data;
}

export async function getCredit(id, params = {}) {
  const { data } = await api.get(`/credits/${id}`, { params });
  return data;
}

