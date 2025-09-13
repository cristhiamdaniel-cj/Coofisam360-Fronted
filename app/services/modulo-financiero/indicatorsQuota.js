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
  const r = await saveIndicatorRaw(payload);
  return r;
}

function mapIndicatorRow(r) {
  return {
    id: r.id ?? r.indicador_id,
    fecha: fmtDate(r.fecha ?? r.date),
    indicador: str(r.indicador ?? r.nombre ?? r.name),
    alcance: str(r.alcance ?? r.descripcion ?? r.scope),

    mes2a: str(
      r.mes2a ?? r.mes_2a ?? r.mismo_mes_2_anios ?? r.same_month_2y_ago ?? ""
    ),
    mes1a: str(
      r.mes1a ??
        r.mes_1a ??
        r.mismo_mes_anio_anterior ??
        r.same_month_1y_ago ??
        ""
    ),
    diciembre1a: str(
      r.diciembre1a ??
        r.diciembre_1a ??
        r.dic_anio_anterior ??
        r.dec_last_year ??
        ""
    ),
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
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
