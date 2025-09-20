import { listAscensos, getAscenso, saveAscenso } from "./talentTalentService";


export async function listAscensosRows(params = {}) {
  const raw = await listAscensos(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapAscensoApiToUi);
}
export async function getAscensoRow(params = {}) {
  const r = await getAscenso(params);
  return r ? mapAscensoApiToUi(r) : null;
}
export async function saveAscensoRow(ui = {}) {
  return await saveAscenso(mapAscensoUiToApi(ui));
}


export function mapAscensoApiToUi(a = {}) {
  return {
    AÑO: a.anio ?? a.AÑO,
    MES: a.mes ?? a.MES,
    "ID-OFICINA": a.oficina_codigo ?? a["ID-OFICINA"] ?? a.oficina_id,
    "OFICINA O SUBGERENCIA": a.oficina_nombre ?? a["OFICINA O SUBGERENCIA"] ?? a.oficina ?? a.subgerencia,
    CANTIDAD: a.cantidad ?? a.CANTIDAD,
    "TOTAL EMPLEADOS": a["TOTAL EMPLEADOS"] ?? a.total_empleados,
    "% VARIACIÓN": a["% VARIACIÓN"] ?? a.variacion_pct,
    PROMEDIO: a.PROMEDIO ?? a.promedio ?? a.promedio_pct,
  };
}
export function mapAscensoUiToApi(u = {}) {
  return {
    anio: u.AÑO,
    mes: u.MES, 
    oficina_codigo: u["ID-OFICINA"],
    cantidad: u.CANTIDAD,
    total_empleados: u["TOTAL EMPLEADOS"],
    variacion_pct: u["% VARIACIÓN"],
    promedio: u.PROMEDIO,
  };
}
