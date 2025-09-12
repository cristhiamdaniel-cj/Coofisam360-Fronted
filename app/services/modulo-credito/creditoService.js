import api from "./api";


// Radicados de crédito
export async function listRadicadosCredito(params = {}) {
  const { data } = await api.get("/api/v1/credito//", { params });
  return data?.items ?? data;
}
export async function getRadicadoCredito(id, params = {}) {
  const { data } = await api.get("/api/v1/credito//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}
export async function saveRadicadoCredito(payload) {
  const { data } = await api.post("/api/v1/credito//", payload);
  return data;
}

// Seguimiento-cc
export async function listSeguimientoCC(params = {}) {
  const { data } = await api.get("/api/v1/credito//", { params });
  return data?.items ?? data;
}
export async function getSeguimientoCCById(id, params = {}) {
  const { data } = await api.get("/api/v1/credito//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}
export async function saveSeguimientoCC(payload) {
  const { data } = await api.post("/api/v1/credito//", payload);
  return data;
}

//  Seguimiento-cco
export async function listSeguimientoCCO(params = {}) {
  const { data } = await api.get("/api/v1/credito//", { params });
  return data?.items ?? data;
}
export async function getSeguimientoCCOById(id, params = {}) {
  const { data } = await api.get("/api/v1/credito//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}
export async function saveSeguimientoCCO(payload) {
  const { data } = await api.post("/api/v1/credito//", payload);
  return data;
}
/*

export const getRadicadosCredito = listRadicadosCredito;
export const getSeguimientoCC    = listSeguimientoCC;
export const getSeguimientoCCO   = listSeguimientoCCO;

*/




