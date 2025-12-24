/**
 *********************************************
 *        Servicio: Finanzas (API base)       *
 *********************************************
 * Capa de acceso a endpoints del backend
 * para el módulo financiero.
 */
import api from "../api";

/*========TABLA CATEGORIAS==========*/

/* ======== CATEGORÍAS (OFICINAS) ======== */
/* -------------------------------------
 *  Bloque de lógica principal
 *  CRUD de oficinas (categorías)
 * ------------------------------------- */
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
/**
 * +-----------------------------------+
 * | listCredits                       |
 * |-----------------------------------|
 * | Lista cupos de crédito            |
 * +-----------------------------------+
 */
export async function listCredits(params = {}) {
  const { data } = await api.get("/api/v1/finanzas/cupos-credito/", { params });
  return data?.items ?? data;
}

// getCredit: removido por no tener consumidores en el frontend actual

/**
 * +-----------------------------------+
 * | saveCredit                        |
 * |-----------------------------------|
 * | Crea/actualiza cupo de crédito    |
 * +-----------------------------------+
 */
export async function saveCredit(payload = {}) {
  const { data } = await api.post("/api/v1/finanzas/cupos-credito/", payload);
  return data;
}

/* ======== INDICADORES · COMPARATIVA ======== */
/* -------------------------------------
 *  Bloque de lógica principal
 *  Indicadores con comparativas
 * ------------------------------------- */
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

/**
 * +-----------------------------------+
 * | saveIndicator                     |
 * |-----------------------------------|
 * | Crea/actualiza indicador + texto  |
 * | de análisis                       |
 * +-----------------------------------+
 */
export async function saveIndicator(payload = {}) {
  const y = Number(payload.anio), m = Number(payload.mes);
  const body = {
    // identificadores
    nombre_indicador: payload.nombre_indicador || payload.indicador,
    indicador: payload.indicador || payload.nombre_indicador,
    anio: y,
    mes: m,
    periodo: payload.periodo || `${y}-${String(m).padStart(2, "0")}`,
    // descripciones y valores
    alcance: payload.alcance,
    mesActual: payload.mesActual,
    mes_actual: payload.mes_actual,
    diciembre1a: payload.diciembre1a,
    anio_pasado_diciembre: payload.anio_pasado_diciembre,
    mes1a: payload.mes1a,
    mismo_mes_1_anio: payload.mismo_mes_1_anio,
    mes2a: payload.mes2a,
    mismo_mes_2_anio: payload.mismo_mes_2_anio,
    analisis: payload.analisis ?? "",
  };
  // Si llega id y se desea update explícito, usar PUT; de lo contrario POST
  const method = payload.id ? 'put' : 'post';
  const { data } = await api[method]("/api/v1/indicadores/comparativa/", body);
  return data;
}

/* -------------------------------------
 *  Eliminación de indicador financiero
 * ------------------------------------- */
export async function deleteIndicator(indicador, anio, mes) {
  const params = { indicador, year: anio, month: mes };
  const { data } = await api.delete("/api/v1/indicadores/comparativa/", { params });
  return data;
}

/* -------------------------------------
 *  Catálogo de indicadores disponibles
 * ------------------------------------- */
export async function getIndicadoresDisponibles() {
  const { data } = await api.get("/api/v1/indicadores/disponibles/");
  return data?.indicadores || data?.items || data || [];
}
