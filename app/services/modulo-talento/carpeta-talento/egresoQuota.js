import { listEgresos, getEgreso, saveEgreso } from "./talentTalentService";


export async function listEgresoRows(params = {}) {
  const raw = await listEgresos(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapEgresoApiToUi);
}
export async function getEgresoRow(params = {}) {
  const r = await getEgreso(params);
  return r ? mapEgresoApiToUi(r) : null;
}
export async function saveEgresoRow(ui = {}) {
  return await saveEgreso(mapEgresoUiToApi(ui));
}


export function mapEgresoApiToUi(a = {}) {
  return {
    AÑO: a.anio ?? a.AÑO,
    MES: a.mes ?? a.MES,
    OFICINA: a.oficina ?? a.OFICINA,
    CARGO: a.cargo ?? a.CARGO,
    CANTIDAD: a.cantidad ?? a.CANTIDAD,
    MOTIVO: a.motivo ?? a.MOTIVO,
  };
}
export function mapEgresoUiToApi(u = {}) {
  return {
    anio: u.AÑO,
    mes: u.MES,
    oficina: u.OFICINA,
    cargo: u.CARGO,
    cantidad: u.CANTIDAD,
    motivo: u.MOTIVO,
  };
}
