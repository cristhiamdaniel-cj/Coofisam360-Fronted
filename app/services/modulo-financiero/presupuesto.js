import api from "../api";

// Función para listar registros de presupuesto
export async function listPresupuesto(filters = {}) {
  try {
    const { data } = await api.get("/api/v1/finanzas/presupuesto/", { params: filters });
    return data?.items || data;
  } catch (error) {
    console.error("Error al listar presupuesto:", error);
    throw error;
  }
}

// Función para listar presupuesto completo con datos históricos y comparaciones
export async function listPresupuestoCompleto(filters = {}) {
  try {
    const { data } = await api.get("/api/v1/finanzas/presupuesto-completo/", { params: filters });
    return data?.items || data;
  } catch (error) {
    console.error("Error al listar presupuesto completo:", error);
    throw error;
  }
}

// Función para guardar registro de presupuesto
export async function savePresupuesto(data) {
  try {
    const { data: response } = await api.post("/api/v1/finanzas/presupuesto/", data);
    return response;
  } catch (error) {
    console.error("Error al guardar presupuesto:", error);
    throw error;
  }
}

// Función para guardar registro de presupuesto usando el endpoint completo
export async function savePresupuestoCompleto(data) {
  try {
    const { data: response } = await api.post("/api/v1/finanzas/presupuesto-completo/", data);
    return response;
  } catch (error) {
    console.error("Error al guardar presupuesto completo:", error);
    throw error;
  }
}

// Función para eliminar registro de presupuesto
export async function deletePresupuesto(id) {
  try {
    const { data } = await api.delete(`/api/v1/finanzas/presupuesto/${id}/`);
    return data;
  } catch (error) {
    console.error("Error al eliminar presupuesto:", error);
    throw error;
  }
}

// Función para obtener cuentas disponibles
export async function getCuentasDisponibles() {
  try {
    const { data } = await api.get("/api/v1/finanzas/cuentas-disponibles/");
    return data?.cuentas || [];
  } catch (error) {
    console.error("Error al obtener cuentas disponibles:", error);
    throw error;
  }
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