/**
 *********************************************
 *        Servicio: Cupos de Crédito          *
 *********************************************
 * Adaptadores y normalización para la UI.
 */
import {
  listCredits as listCreditsRaw,
  saveCredit as saveCreditRaw,
} from "../modulo-financiero/financialService";

/**
 * +-----------------------------------+
 * | listCreditQuota                   |
 * |-----------------------------------|
 * | Lista cupos y normaliza columnas  |
 * +-----------------------------------+
 */
export async function listCreditQuota(params = {}) {
  const raw = await listCreditsRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.data || [];
  return rows.map(mapCreditRow);
}

// getCreditQuota: removido porque no existe uso actual en el frontend

/**
 * +-----------------------------------+
 * | saveCreditQuota                   |
 * |-----------------------------------|
 * | Crea/actualiza registro de cupo   |
 * +-----------------------------------+
 */
export async function saveCreditQuota(payload) {
  // payload: { entidad_financiera, cuenta, fecha_renovado, cupo_asignado, ... }
  const r = await saveCreditRaw(payload);
  return r;
}

/* -------------------------------------
 *  Eliminar cupo de crédito
 * ------------------------------------- */
export async function deleteCreditQuota(id) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8060";
    const response = await fetch(`${API_BASE_URL}/api/v1/finanzas/cupos-credito/?id=${id}`, {
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
    console.error("Error al eliminar cupo de crédito:", error);
    throw error;
  }
}

/**
 * +-----------------------------------+
 * | mapCreditRow                      |
 * |-----------------------------------|
 * | Normaliza una fila de cupos       |
 * +-----------------------------------+
 */
function mapCreditRow(r) {
  const asignado = num(r.cupo_asignado ?? r.assigned_amount);
  const ejecutado = num(r.cupo_ejecutado ?? r.executed_amount);
  const disponible = num(
    r.disponible ?? r.available_amount ?? asignado - ejecutado
  );
  const utilPct = percent(
    r.utilizacion ??
      r.utilizacion_pct ??
      r.porcentaje_utilizacion ??
      0
  );

  return {
    id: r.id ?? r.cupo_id,
    fechaRenovado: fmtDate(r.fecha_renovado ?? r.renewed_at),
    fechaRenovadoRaw: r.fecha_renovado ?? r.renewed_at,
    cuenta: str(r.cuenta ?? r.account ?? r.account_number),
    entidadFinanciera: str(r.entidad_financiera ?? r.bank ?? r.bank_name),
    cupoAsignado: asignado,
    cupoEjecutado: ejecutado,
    disponible,
    garantia: str(r.garantia ?? r.guarantee ?? ""),
    porcentajeUtilizacion: utilPct,
    plazo: str(
      r.plazo ? (r.plazo.includes('meses') ? r.plazo : `${r.plazo} meses`) : 
      (r.plazo_meses ? `${r.plazo_meses} meses` : "") ?? r.term ?? ""
    ),
    tasa: str(r.tasa ?? r.tasa_pct ?? ""),
  };
}

function num(v) {
  if (v == null) return 0;
  // Solo remover comas, no puntos (para preservar decimales)
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function percent(v) {
  const n = num(v);
  // El valor ya viene formateado de la base de datos
  return n;
}

function str(v) {
  return (v ?? "").toString();
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
