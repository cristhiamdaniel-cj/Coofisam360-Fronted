/**
 *********************************************
 *   Servicio: Ejecución Presupuestal (PUC6)  *
 *********************************************
 * CRUD y carga de archivos para ejecución.
 */
import api from "../api";

// Función para listar registros de ejecución presupuestal
/**
 * +-----------------------------------+
 * | listEjecucionPresupuestal         |
 * |-----------------------------------|
 * | Lista registros con filtros       |
 * +-----------------------------------+
 */
export async function listEjecucionPresupuestal(filters = {}) {
  try {
    const { data } = await api.get("/api/v1/finanzas/ejecucion-presupuestal/", { params: filters });
    return data?.items || data;
  } catch (error) {
    console.error("Error al listar ejecución presupuestal:", error);
    throw error;
  }
}

// Función para guardar registro de ejecución presupuestal
/**
 * +-----------------------------------+
 * | saveEjecucionPresupuestal         |
 * |-----------------------------------|
 * | Crea/actualiza un registro        |
 * +-----------------------------------+
 */
export async function saveEjecucionPresupuestal(data) {
  try {
    const { data: response } = await api.post("/api/v1/finanzas/ejecucion-presupuestal/", data);
    return response;
  } catch (error) {
    console.error("Error al guardar ejecución presupuestal:", error);
    throw error;
  }
}

// Función para eliminar registro de ejecución presupuestal
/* -------------------------------------
 *  Eliminación de registro por id
 * ------------------------------------- */
export async function deleteEjecucionPresupuestal(id) {
  try {
    const { data } = await api.delete(`/api/v1/finanzas/ejecucion-presupuestal/${id}/`);
    return data;
  } catch (error) {
    console.error("Error al eliminar ejecución presupuestal:", error);
    throw error;
  }
}

// Función para cargar (ETL) un archivo de ejecución presupuestal
/* -------------------------------------
 *  Carga de archivo (ETL)              
 * ------------------------------------- */
export async function uploadEjecucionPresupuestal({ file, anio, mes }) {
  const form = new FormData();
  form.append('file', file);
  form.append('anio', String(anio));
  form.append('mes', String(mes));
  const { data } = await api.post('/api/v1/finanzas/ejecucion-presupuestal/upload/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * +-----------------------------------+
 * | listEjecucionFiles                |
 * |-----------------------------------|
 * | Lista archivos por año            |
 * +-----------------------------------+
 */
export async function listEjecucionFiles(year) {
  const params = year ? { year } : {};
  const { data } = await api.get('/api/v1/finanzas/ejecucion-presupuestal/files/', { params });
  return data?.files || [];
}

// Función para formatear números con separadores de miles
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
