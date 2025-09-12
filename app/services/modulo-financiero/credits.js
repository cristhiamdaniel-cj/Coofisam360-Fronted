import api from "../api";

/*========TABLA CATEGORIAS==========*/

export async function listCategories(params = {}) {
  const { data } = await api.get("/api/v1/finanzas//", { params });
  // Backend: { items: [...], count, source }  -> devolvemos items o data
  return data?.items ?? data;
}

export async function getCategory(id, params = {}) {
  const { data } = await api.get("/api/v1/finanzas//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveCategory(payload) {
  const { data } = await api.post("/api/v1/finanzas//", payload);
  return data;
}

/*============TABLA CUPOS=================*/
// Lista Cupos de Crédito desde el backend
export async function listCredits(params = {}) {
  const { data } = await api.get("/api/v1/finanzas/cupos-credito/", { params });
  // El backend responde { items: [...], count, source }
  return data?.items ?? data;
}

// Obtener un cupo por id (usa filtro ?id=)
export async function getCredit(id, params = {}) {
  const { data } = await api.get("/api/v1/finanzas/cupos-credito/", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

// Crear/actualizar cupo (POST); si mandas id, actualiza
export async function saveCredit(payload) {
  const { data } = await api.post("/api/v1/finanzas/cupos-credito/", payload);
  return data;
}

/*===========TABLA INDICADORES==================*/

export async function listIndicators(params = {}) {
  const { data } = await api.get("/api/v1/finanzas//", { params });
  return data?.items ?? data;
}

export async function getIndicator(id, params = {}) {
  const { data } = await api.get("/api/v1/finanzas//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveIndicator(payload) {
  const { data } = await api.post("/api/v1/finanzas//", payload);
  return data;
}
