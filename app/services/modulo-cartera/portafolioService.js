import api from "./api";

/* ========== ASIGNACIÓN DE LLAMADAS ========== */
export async function listAsignacionLlamadas(params = {}) {
  const { data } = await api.get("/api/v1/ / /", { params });
  return data?.items ?? data;
}

export async function getAsignacionLlamada(id, params = {}) {
  const { data } = await api.get("/api/v1/ / /", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveAsignacionLlamada(payload) {
  const { data } = await api.post("/api/v1/ / /", payload);
  return data;
}

/* ========== GESTIÓN DE LLAMADAS (resumen) ========== */
export async function listGestionLlamadas(params = {}) {
  const { data } = await api.get("/api/v1/ / /", { params });
  return data?.items ?? data;
}

export async function getGestionLlamada(id, params = {}) {
  const { data } = await api.get("/api/v1/ / /", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveGestionLlamada(payload) {
  const { data } = await api.post("/api/v1/ / /", payload);
  return data;
}

/* ========== GESTIONES (detalle) ========== */
export async function listGestiones(params = {}) {
  const { data } = await api.get("/api/v1/ / /", { params });
  return data?.items ?? data;
}

export async function getGestion(id, params = {}) {
  const { data } = await api.get("/api/v1/ / /", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveGestion(payload) {
  const { data } = await api.post("/api/v1/ / /", payload);
  return data;
}

/* ========== LINK LLAMADAS ========== */
export async function listLinkLlamadas(params = {}) {
  const { data } = await api.get("/api/v1/ / /", { params });
  return data?.items ?? data;
}

export async function getLinkLlamada(id, params = {}) {
  const { data } = await api.get("/api/v1/ / /", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveLinkLlamada(payload) {
  const { data } = await api.post("/api/v1/ / /", payload);
  return data;
}

/* ========== LINK VISITAS ========== */
export async function listLinkVisitas(params = {}) {
  const { data } = await api.get("/api/v1/ / /", { params });
  return data?.items ?? data;
}

export async function getLinkVisita(id, params = {}) {
  const { data } = await api.get("/api/v1/ / /", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveLinkVisita(payload) {
  const { data } = await api.post("/api/v1/ / /", payload);
  return data;
}

/* ========== SEGUIMIENTO CAMPAÑAS ========== */
export async function listSeguimientoCampanas(params = {}) {
  const { data } = await api.get("/api/v1/ / /", { params });
  return data?.items ?? data;
}

export async function getSeguimientoCampana(id, params = {}) {
  const { data } = await api.get("/api/v1/ / /", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveSeguimientoCampana(payload) {
  const { data } = await api.post("/api/v1/ / /", payload);
  return data;
}
