import { listCredits as listCreditsRaw, getCredit as getCreditRaw } from './credits.js';

export async function listCreditQuota(params = {}) {
  const raw = await listCreditsRaw(params);
  const rows = Array.isArray(raw) ? raw : (raw?.data || []);
  return rows.map(mapCreditRow);
}

export async function getCreditQuota(id, params = {}) {
  const r = await getCreditRaw(id, params);
  return mapCreditRow(r);
}

function mapCreditRow(r) {
  const asignado   = num(r.cupo_asignado ?? r.assigned_amount);
  const ejecutado  = num(r.cupo_ejecutado ?? r.executed_amount);
  const disponible = num(r.disponible ?? r.available_amount ?? (asignado - ejecutado));
  const utilPct    = percent(r.utilizacion ?? r.utilization_pct ?? (asignado ? (ejecutado / asignado) * 100 : 0));

  return {
    fechaRenovado: fmtDate(r.fecha_renovado ?? r.renewed_at),
    cuenta: str(r.cuenta ?? r.account ?? r.account_number),
    entidadFinanciera: str(r.entidad_financiera ?? r.bank ?? r.bank_name),
    cupoAsignado: asignado,
    cupoEjecutado: ejecutado,
    disponible,
    garantia: str(r.garantia ?? r.guarantee),
    porcentajeUtilizacion: utilPct,
    plazo: str(r.plazo ?? r.term ?? ''),
  };
}

function num(v){ 
    if(v==null) return 0; 
    const n = Number(String(v).replace(/\./g,'').replace(/,/g,'.')); 
    return Number.isFinite(n)? n : 0; }

function percent(v){
     const n = num(v);
     return n<=1 ? Math.round(n*100) : Math.round(n); }

function str(v){
     return (v ?? '').toString(); }

function fmtDate(v){
  if(!v) return '';
  const d = new Date(v);
  if(Number.isNaN(d.getTime())) return str(v);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
