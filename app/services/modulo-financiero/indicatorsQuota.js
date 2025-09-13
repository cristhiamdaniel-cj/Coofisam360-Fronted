import {
  listIndicators as listIndicatorsRaw,
  getIndicator as getIndicatorRaw,
  saveIndicator as saveIndicatorRaw,
} from "../modulo-financiero/financialService";

export async function listIndicatorsQuota(params = {}) {
  const raw = await listIndicatorsRaw(params);
  console.log("RAW API RESPONSE", raw);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapIndicatorRow);
}

export async function getIndicatorQuota(id, params = {}) {
  const r = await getIndicatorRaw(id, params);
  return r ? mapIndicatorRow(r) : null;
}

export async function saveIndicatorQuota(payload) {
  // ✅ map to backend expected keys
  const r = await saveIndicatorRaw(payload);
  return r;
}

function mapIndicatorRow(r) {
  return {
    id: r.id ?? r.indicador_id,
    fecha: fmtDate(r.fecha ?? r.date),
    indicador: str(r.indicador ?? r.nombre ?? r.name),
    alcance: str(r.alcance ?? r.descripcion ?? r.scope),
    mes2a: str(r.mes2a ?? r.mes_2a ?? r.same_month_2y_ago ?? ""),
    mes1a: str(r.mes1a ?? r.mes_1a ?? r.same_month_1y_ago ?? ""),
    diciembre1a: str(r.diciembre1a ?? r.diciembre_1a ?? r.dec_last_year ?? ""),
    mesActual: str(r.mesActual ?? r.mes_actual ?? r.current_month ?? ""),
    analisis: str(r.analisis ?? r.analysis ?? ""),
  };
}

function str(v) {
  return (v ?? "").toString();
}

function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return str(v);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}
