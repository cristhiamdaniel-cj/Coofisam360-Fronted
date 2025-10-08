import { listDesempeno, getDesempeno, saveDesempeno } from "./talentTalentService";


export async function listDesempenoRows(params = {}) {
  const raw = await listDesempeno(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapDesempenoApiToUi);
}
export async function getDesempenoRow(params = {}) {
  const r = await getDesempeno(params);
  return r ? mapDesempenoApiToUi(r) : null;
}
export async function saveDesempenoRow(ui = {}) {
  return await saveDesempeno(mapDesempenoUiToApi(ui));
}


export function mapDesempenoApiToUi(a = {}) {
  return {
    "OFICINA O SUBGERENCIA": a.oficina ?? a.subgerencia ?? a["OFICINA O SUBGERENCIA"],
    "% DESEMPEÑO": a["% DESEMPEÑO"] ?? a.desempeno_pct,
    AÑO: a.anio ?? a.AÑO,
  };
}
export function mapDesempenoUiToApi(u = {}) {
  return {
    anio: u.AÑO,
    oficina: u["OFICINA O SUBGERENCIA"],
    // Backend espera 'porcentaje'
    porcentaje: u["% DESEMPEÑO"],
  };
}
