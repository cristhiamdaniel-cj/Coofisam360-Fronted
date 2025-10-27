/**
 *********************************************
 *     Servicio: Categorías de Oficinas       *
 *********************************************
 * Adaptadores de datos para tablas del UI.
 */
import {
  listCategories as listCategoriesRaw,
  getCategory as getCategoryRaw,
  saveCategory as saveCategoryRaw,
} from "../modulo-financiero/financialService";

/* -------------------------------------
 *  Función utilitaria
 *  Obtener catálogo de oficinas
 * ------------------------------------- */
export async function getOficinasDisponibles() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8060";
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn("No hay token de autenticación, usando datos de prueba");
      return getOficinasPrueba();
    }
    
    const response = await fetch(`${API_BASE_URL}/api/v1/finanzas/oficinas-disponibles/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn(`Error ${response.status}: ${response.statusText}, usando datos de prueba`);
      return getOficinasPrueba();
    }
    
    const data = await response.json();
    return data.oficinas || [];
  } catch (error) {
    console.error("Error al obtener oficinas disponibles:", error);
    console.warn("Usando datos de prueba como fallback");
    return getOficinasPrueba();
  }
}

function getOficinasPrueba() {
  return [
    { codigo: "1", nombre: "Garzón" },
    { codigo: "2", nombre: "Pitalito" },
    { codigo: "3", nombre: "Neiva" },
    { codigo: "4", nombre: "Gigante" },
    { codigo: "7", nombre: "La Plata" },
    { codigo: "10", nombre: "La Argentina" },
    { codigo: "11", nombre: "Neiva" },
    { codigo: "18", nombre: "Chaparral" }
  ];
}

export async function listCategoriesQuota(params = {}) {
  const raw = await listCategoriesRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapCategoryRow);
}

export async function getCategoryQuota(id, params = {}) {
  const r = await getCategoryRaw(id, params);
  return r ? mapCategoryRow(r) : null;
}

/**
 * +-----------------------------------+
 * | saveCategoryQuota                 |
 * |-----------------------------------|
 * | Crea/actualiza registro de oficina|
 * +-----------------------------------+
 */
export async function saveCategoryQuota(payload) {
  return await saveCategoryRaw(payload);
}

/* -------------------------------------
 *  Eliminar categoría de oficina
 * ------------------------------------- */
export async function deleteCategoryQuota(codigo, anio, mes) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8060";
    const response = await fetch(`${API_BASE_URL}/api/v1/finanzas/oficinas/${codigo}/?year=${anio}&month=${mes}`, {
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
    console.error("Error al eliminar categoría de oficina:", error);
    throw error;
  }
}

/**
 * +-----------------------------------+
 * | mapCategoryRow                    |
 * |-----------------------------------|
 * | Normaliza y formatea una fila     |
 * +-----------------------------------+
 */
function mapCategoryRow(r) {
  console.log("Mapeando fila:", r); // Debug
  const fixEncoding = (str) => {
    try {
      if (!str) return "";
      const s = String(str);
      if (/[ÃÂ�]/.test(s)) {
        const bytes = new Uint8Array([...s].map((c) => c.charCodeAt(0) & 0xff));
        const decoded = new TextDecoder("utf-8").decode(bytes);
        if (/[áéíóúñÁÉÍÓÚÑ]/.test(decoded)) return decoded;
      }
      return s;
    } catch (_) {
      return String(str || "");
    }
  };
  return {
    id: String(r.id ?? r.categoria_id ?? r.id_categoria ?? ""), // forzar string
    codigo: str(r.codigo ?? r.codigo_oficina ?? r.office_code ?? r.cod),
    nombre: fixEncoding(str(r.nombre ?? r.nombre_oficina ?? r.office_name)),
    fecha: fmtDate(r.fecha ?? r.fecha_apertura ?? r.opened_at),
    ctaPuc14: formatNumeric(
      r.ctaPuc14 ?? r.saldo_c14 ?? r.saldoC14 ?? r.cta_puc_14 ?? r.puc14 ?? r.account_14
    ),
    ctaPuc21: formatNumeric(
      r.ctaPuc21 ?? r.saldo_c21 ?? r.saldoC21 ?? r.cta_puc_21 ?? r.puc21 ?? r.account_21
    ),
    asociados: num(r.asociados ?? r.num_asociados ?? r.members ?? 0),
    entidades: num(r.entidades ?? r.entidades_financieras ?? r.banks ?? 0),
    poblacion: num(r.poblacion ?? r.population ?? 0),
    // necesarios para POST:
    anio: Number(r.anio ?? r.year ?? 0) || 0,
    mes: Number(r.mes ?? r.month ?? 0) || 0,
  };
}
function num(v) {
  if (v == null) return 0;
  const n = Number(
    String(v)
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.-]/g, "")
  );
  return Number.isFinite(n) ? n : 0;
}

function str(v) {
  return (v ?? "").toString();
}

function formatNumeric(v) {
  if (v == null || v === "") return "";
  const n = num(v);
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return str(v);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
