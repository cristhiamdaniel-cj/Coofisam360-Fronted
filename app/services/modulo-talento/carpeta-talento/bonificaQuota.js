import { listBonificaciones, getBonificacion, saveBonificacion } from "./talentTalentService";


export async function listBonificacionRows(params = {}) {
  const raw = await listBonificaciones(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapBonificacionApiToUi);
}
export async function getBonificacionRow(params = {}) {
  const r = await getBonificacion(params);
  return r ? mapBonificacionApiToUi(r) : null;
}
export async function saveBonificacionRow(ui = {}) {
  return await saveBonificacion(mapBonificacionUiToApi(ui));
}


export function mapBonificacionApiToUi(a = {}) {
  return {
    AÑO: a.anio ?? a.AÑO,
    MES: a.mes ?? a.MES,
    "CANTIDAD EMPLEADOS": a.cantidadEmpleados ?? a.cantidad_empleados ?? a["CANTIDAD EMPLEADOS"],
    "CANTIDAD BENEFICIADOS": a.cantidadBeneficiados ?? a.cantidad_beneficiados ?? a["CANTIDAD BENEFICIADOS"],
    "% VARIACIÓN": a["% VARIACIÓN"] ?? a.porcentaje,
  };
}
export function mapBonificacionUiToApi(u = {}) {
  return {
    anio: u.AÑO,
    mes: u.MES,
    cantidad_empleados: u["CANTIDAD EMPLEADOS"],
    cantidad_beneficiados: u["CANTIDAD BENEFICIADOS"],
    porcentaje: u["% VARIACIÓN"],
  };
}
