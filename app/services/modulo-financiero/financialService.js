import api from "../api";

/*========TABLA CATEGORIAS==========*/

export async function listCategories(params = {}) {
  const { data } = await api.get("/api/v1/finanzas/oficinas/", { params });
  // Backend: { items: [...], count, source }  -> devolvemos items o data
  return data?.items ?? data;
}

export async function getCategory(id, params = {}) {
  const { data } = await api.get("/api/v1/finanzas/oficinas/<codigo>/", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveCategory(payload) {
  const { id, ...rest } = payload;

  // Map frontend fields back to backend fields
  const backendPayload = {
    codigo: rest.codigo,
    nombre: rest.nombre,
    fecha_apertura: rest.fecha,
    cta_puc_14: rest.ctaPuc14,
    cta_puc_21: rest.ctaPuc21,
    asociados: rest.asociados,
    entidades_financieras: rest.entidades,
    poblacion: rest.poblacion,
  };

  // If has ID -> update (PUT), else create (POST)
  if (id) {
    const { data } = await api.put(
      `/api/v1/finanzas/oficinas/${id}/`,
      backendPayload
    );
    return data;
  } else {
    const { data } = await api.post(
      `/api/v1/finanzas/oficinas/`,
      backendPayload
    );
    return data;
  }
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
  const { data } = await api.get("/api/v1/indicadores/comparativa/", {
    params,
  });
  return data?.items ?? data;
}

export async function getIndicator(id, params = {}) {
  const { data } = await api.get("/api/v1/indicadores/comparativa/", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveIndicator(payload) {
  const { data } = await api.post("/api/v1/indicadores/comparativa/", payload);
  return data;
}
