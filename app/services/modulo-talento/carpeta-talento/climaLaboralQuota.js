import { listClima, getClima, saveClima } from "./talentTalentService";


export async function listClimaRows(params = {}) {
  const raw = await listClima(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapClimaApiToUi);
}
export async function getClimaRow(params = {}) {
  const r = await getClima(params);
  return r ? mapClimaApiToUi(r) : null;
}
export async function saveClimaRow(ui = {}) {
  return await saveClima(mapClimaUiToApi(ui));
}


export function mapClimaApiToUi(a = {}) {
  return {
    DIMENSION: a.dimension ?? a.DIMENSION,
    "% DE CUMPLIMIENTO": a["% DE CUMPLIMIENTO"] ?? a.cumplimiento_pct,
    AÑO: a.anio ?? a.AÑO,
  };
}
export function mapClimaUiToApi(u = {}) {
  return {
    dimension: u.DIMENSION,
    anio: u.AÑO,
    cumplimiento_pct: u["% DE CUMPLIMIENTO"],
  };
}
