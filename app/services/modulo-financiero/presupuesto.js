/**
 *********************************************
 *        Servicio: Presupuesto (App)         *
 *********************************************
 * Endpoints de presupuesto-app + utilidades
 * de formato y carga simple.
 */
import api from "../api";

// Nuevo: presupuesto_app
export async function listPresupuestoApp(filters = {}) {
  try {
    const { data } = await api.get("/api/v1/finanzas/presupuesto-app/", { params: filters });
    return data?.items || data;
  } catch (error) {
    console.error("Error al listar presupuesto_app:", error);
    throw error;
  }
}

export async function savePresupuestoApp(data) {
  try {
    const { data: response } = await api.post("/api/v1/finanzas/presupuesto-app/", data);
    return response;
  } catch (error) {
    console.error("Error al guardar presupuesto_app:", error);
    throw error;
  }
}

export async function deletePresupuestoApp({ cuenta, anio, mes }) {
  try {
    const params = { cuenta, year: anio, month: mes };
    const { data } = await api.delete("/api/v1/finanzas/presupuesto-app/", { params });
    return data;
  } catch (error) {
    console.error("Error al eliminar presupuesto_app:", error);
    throw error;
  }
}

// Upload simple (Código, Denominación, Proyectado) para presupuesto
/* -------------------------------------
 *  Carga simple (Código/Denominación/Proyectado)
 * ------------------------------------- */
export async function uploadPresupuestoSimple({ file, anio, mes }) {
  const form = new FormData();
  form.append('file', file);
  form.append('anio', String(anio));
  form.append('mes', String(mes));
  const { data } = await api.post('/api/v1/finanzas/presupuesto/upload-simple/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * +-----------------------------------+
 * | listPresupuestoFiles              |
 * |-----------------------------------|
 * | Lista archivos guardados por año  |
 * +-----------------------------------+
 */
export async function listPresupuestoFiles(year) {
  const params = year ? { year } : {};
  const { data } = await api.get('/api/v1/finanzas/presupuesto/files/', { params });
  return data?.files || [];
}

/**
 * +-----------------------------------+
 * | executePresupuestoFile            |
 * |-----------------------------------|
 * | Ejecuta/ingesta un archivo guardado|
 * +-----------------------------------+
 */
export async function executePresupuestoFile({ rel, anio, mes }) {
  const { data } = await api.post('/api/v1/finanzas/presupuesto/execute-file/', { rel, anio, mes });
  return data;
}

// Función para formatear números con separadores de miles
/* -------------------------------------
 *  Utilidades de formato numérico
 * ------------------------------------- */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || value === '') return '';
  
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

// Función para formatear porcentajes
export function formatPercentage(value, decimals = 2) {
  if (value === null || value === undefined || value === '') return '';
  
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  
  return num.toFixed(decimals) + '%';
}

// Función para parsear números desde strings con formato
export function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  
  // Remover separadores de miles y convertir coma decimal a punto
  const cleanValue = String(value)
    .replace(/\./g, '') // Remover puntos (separadores de miles)
    .replace(/,/g, '.'); // Convertir coma decimal a punto
  
  const num = parseFloat(cleanValue);
  return isNaN(num) ? null : num;
}
