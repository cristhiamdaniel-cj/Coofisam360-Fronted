import { listRolLider, getRolLider, saveRolLider } from "./talentTalentService";


export async function listRolLiderRows(params = {}) {
  const raw = await listRolLider(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapRolLiderApiToUi);
}
export async function getRolLiderRow(params = {}) {
  const r = await getRolLider(params);
  return r ? mapRolLiderApiToUi(r) : null;
}
export async function saveRolLiderRow(ui = {}) {
  return await saveRolLider(mapRolLiderUiToApi(ui));
}


export function mapRolLiderApiToUi(a = {}) {
  return {
    AÑO: a.anio ?? a.AÑO,
    MES: a.mes ?? a.MES,
    "LIDER MUJER": a.liderMujer ?? a.lider_mujer ?? a["LIDER MUJER"],
    "LIDER HOMBRE": a.liderHombre ?? a.lider_hombre ?? a["LIDER HOMBRE"],
    "LIDER OTRO": a.liderOtro ?? a.lider_otro ?? a["LIDER OTRO"],
    "TOTAL EMPLEADOS": a.total_empleados ?? a["TOTAL EMPLEADOS"],
    "% LIDER MUJER": a["% LIDER MUJER"] ?? a.pct_lider_mujer,
    "% LIDER HOMBRE": a["% LIDER HOMBRE"] ?? a.pct_lider_hombre,
    "% LIDER OTRO": a["% LIDER OTRO"] ?? a.pct_lider_otro,
  };
}
export function mapRolLiderUiToApi(u = {}) {
  return {
    anio: u.AÑO,
    mes: u.MES,
    lider_mujer: u["LIDER MUJER"],
    lider_hombre: u["LIDER HOMBRE"],
    lider_otro: u["LIDER OTRO"],
    total_empleados: u["TOTAL EMPLEADOS"],
    pct_lider_mujer: u["% LIDER MUJER"],
    pct_lider_hombre: u["% LIDER HOMBRE"],
    pct_lider_otro: u["% LIDER OTRO"],
  };
}
