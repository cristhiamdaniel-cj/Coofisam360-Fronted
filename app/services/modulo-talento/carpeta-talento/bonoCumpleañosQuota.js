import { listBonoCumple, getBonoCumple, saveBonoCumple } from "./talentTalentService";


export async function listBonoCumpleRows(params = {}) {
  const raw = await listBonoCumple(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapBonoCumpleApiToUi);
}
export async function getBonoCumpleRow(params = {}) {
  const r = await getBonoCumple(params);
  return r ? mapBonoCumpleApiToUi(r) : null;
}
export async function saveBonoCumpleRow(ui = {}) {
  return await saveBonoCumple(mapBonoCumpleUiToApi(ui));
}


export function mapBonoCumpleApiToUi(a = {}) {
  return {
    AÑO: a.anio ?? a.AÑO,
    MES: a.mes ?? a.MES,
    "CANTIDAD EMPLEADOS": a.cantidadEmpleados ?? a.cantidad_empleados ?? a["CANTIDAD EMPLEADOS"],
    "CANTIDAD BENEFICIADOS": a.cantidadBeneficiados ?? a.cantidad_beneficiados ?? a["CANTIDAD BENEFICIADOS"],
    "VALOR BONO": a.valorBono ?? a.valor_bono ?? a["VALOR BONO"],
    "TOTAL BONO": a.totalBono ?? a.total_bono ?? a["TOTAL BONO"],
    "% VARIACIÓN": a["% VARIACIÓN"] ?? a.porcentaje,
  };
}
export function mapBonoCumpleUiToApi(u = {}) {
  return {
    anio: u.AÑO,
    mes: u.MES,
    cantidad_empleados: u["CANTIDAD EMPLEADOS"],
    cantidad_beneficiados: u["CANTIDAD BENEFICIADOS"],
    valor_bono: u["VALOR BONO"],
    total_bono: u["TOTAL BONO"],
    porcentaje: u["% VARIACIÓN"],
  };
}
