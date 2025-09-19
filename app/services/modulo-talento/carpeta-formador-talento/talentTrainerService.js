import api from "../api";

/* ===================COSTO  BENEFICIO===================== */
export async function listCostoBeneficio(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  // Alternativa:
  // const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getCostoBeneficio(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...(params || {}), id },
  });
  // Alternativa:
  // const { data } = await api.get(`/api/v1/talento//${id}/`, { params });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveCostoBeneficio(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  // Alternativa:
  // const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

/* ===================FORMACIÓN Y PARTICIPACIÓN===================== */
export async function listFormaciones(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  // Alternativa:
  // const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getFormacion(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...(params || {}), id },
  });
  // Alternativa:
  // const { data } = await api.get(`/api/v1/talento//${id}/`, { params });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveFormacion(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  // Alternativa:
  // const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

/* ===================SATISFACCIÓN DEL APRENDIZAJE=================== */
export async function listSatisfaccionAprendizaje(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  // Alternativa:
  // const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getSatisfaccionAprendizaje(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...(params || {}), id },
  });
  // Alternativa:
  // const { data } = await api.get(`/api/v1/talento//${id}/`, { params });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveSatisfaccionAprendizaje(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  // Alternativa:
  // const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

/* =============TRANSFERENCIA DEL CONOCIMIENTO================ */
export async function listTransferenciaConocimiento(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  // Alternativa:
  // const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getTransferenciaConocimiento(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...(params || {}), id },
  });
  // Alternativa:
  // const { data } = await api.get(`/api/v1/talento//${id}/`, { params });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveTransferenciaConocimiento(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  // Alternativa:
  // const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

/* ====================CONTROL DISCIPLINARIO================== */
export async function listControlDisciplinario(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  // Alternativa:
  // const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getControlDisciplinario(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...(params || {}), id },
  });
  // Alternativa:
  // const { data } = await api.get(`/api/v1/talento//${id}/`, { params });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveControlDisciplinario(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  // Alternativa:
  // const { data } = await api.post("/api/v1//", payload);
  return data;
}
