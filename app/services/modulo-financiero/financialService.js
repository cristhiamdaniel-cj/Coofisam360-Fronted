import api from "../api";

/*========TABLA CATEGORIAS==========*/

/* ======== CATEGORÍAS (OFICINAS) ======== */
export async function listCategories(params = {}) {
  const { data } = await api.get("/api/v1/finanzas/oficinas/", { params });
  return data?.items ?? data;
}

export async function getCategory(codigo, params = {}) {
  // Soporta year/month para traer el periodo deseado. Si no, trae el último.
  const { data } = await api.get(
    `/api/v1/finanzas/oficinas/${encodeURIComponent(codigo)}/`,
    { params }
  );
  return data;
}

export async function saveCategory(payload = {}) {
  // Requiere: { codigo, anio, mes } y opcionales: nombre, fecha, asociados, entidades, poblacion
  const { data } = await api.post("/api/v1/finanzas/oficinas/", payload);
  return data;
}

/* ======== CUPOS CRÉDITO ======== */
export async function listCredits(params = {}) {
  const { data } = await api.get("/api/v1/finanzas/cupos-credito/", { params });
  return data?.items ?? data;
}

export async function getCredit(id, params = {}) {
  const { data } = await api.get("/api/v1/finanzas/cupos-credito/", {
    params: { ...(params || {}), id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveCredit(payload = {}) {
  const { data } = await api.post("/api/v1/finanzas/cupos-credito/", payload);
  return data;
}

/* ======== INDICADORES · COMPARATIVA ======== */
export async function listIndicators(params = {}) {
  const { data } = await api.get("/api/v1/indicadores/comparativa/", {
    params,
  });
  return data?.items ?? data;
}

export async function getIndicator(indicador, params = {}) {
  // Pide por nombre + year + month
  const { year, month, ...rest } = params || {};
  const { data } = await api.get("/api/v1/indicadores/comparativa/", {
    params: { ...rest, year, month, indicador },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveIndicator({
  indicador,
  nombre_indicador,
  anio,
  mes,
  periodo,
  analisis,
}) {
  const y = Number(anio),
    m = Number(mes);
  const body = {
    nombre_indicador: nombre_indicador || indicador,
    anio: y,
    mes: m,
    periodo: periodo || `${y}-${String(m).padStart(2, "0")}`,
    analisis: analisis ?? "",
  };
  const { data } = await api.post("/api/v1/indicadores/comparativa/", body);
  return data;
}

// Función para eliminar indicador financiero
export async function deleteIndicator(indicador, anio, mes) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8060";
    const response = await fetch(`${API_BASE_URL}/api/v1/indicadores/comparativa/?indicador=${encodeURIComponent(indicador)}&year=${anio}&month=${mes}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar indicador financiero:", error);
    throw error;
  }
}

// Función para obtener indicadores disponibles
export async function getIndicadoresDisponibles() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8060";
    const response = await fetch(`${API_BASE_URL}/api/v1/indicadores/disponibles/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.indicadores || [];
  } catch (error) {
    console.error("Error al obtener indicadores disponibles:", error);
    throw error;
  }
}
