import api from "./api";


// Radicados de crédito
export async function getRadicadosCredito(params = {}) {
  const { data } = await api.get("/api/v1/ / /", { params });
  return data?.items ?? [];
}

// Seguimiento-cc
export async function getSeguimientoCC(params = {}) {
  const { data } = await api.get("/api/v1/ / /", { params });
  return data?.items ?? [];
}

//  Seguimiento-cco
export async function getSeguimientoCCO(params = {}) {
  const { data } = await api.get("/api/v1/ / /", { params });
  return data?.items ?? [];
}
