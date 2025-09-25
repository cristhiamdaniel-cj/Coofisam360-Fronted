import {
  listCostoBeneficio as listCostoBeneficioRaw,
  getCostoBeneficio as getCostoBeneficioRaw,
  saveCostoBeneficio as saveCostoBeneficioRaw,
} from "./talentTrainerService";
import {
  toMonthNumber,
  moneyToNumber,
  num,
  fmtMoneyCOP,
} from "./talentHelpers";
import { v4 as uuidv4 } from "uuid";

export async function listCostoBeneficioQuota(params = {}) {
  const raw = await listCostoBeneficioRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapFromApi);
}
export async function getCostoBeneficioQuota(id, params = {}) {
  const r = await getCostoBeneficioRaw(id, params);
  return r ? mapFromApi(r) : null;
}
export async function saveCostoBeneficioQuota(uiPayload) {
  console.log(">>> UI Payload recibido:", uiPayload);
  // Por ahora enviar directamente sin mapeo para debug
  return await saveCostoBeneficioRaw(uiPayload);
}

function mapFromApi(r) {
  return {
    id: r.id ?? r.row_id ?? uuidv4(),
    Año: r.anio ?? r.year,
    Mes: r.mes_nombre ?? r.mes ?? r.month_name,
    TotalGastosTransferencia: r.total_gastos,
    TrabajadoresCapacitados: num(r.trabajadores_capacitados ?? r.n_capacitados),
    CostoPorTrabajador: r.costo_por_trabajador,
    Modalidad: r.modalidad ?? "",
    Rentabilidad: r.rentabilidad ?? "",
  };
}

function mapToApi(r) {
  return {
    id: r.id,
    anio: Number(r.Año) || 0,
    mes: r.Mes,
    total_gastos: Number(r.TotalGastosTransferencia) || 0,
    trabajadores_capacitados: Number(r.TrabajadoresCapacitados) || 0,
    costo_por_trabajador: Number(r.CostoPorTrabajador) || 0,
    modalidad: r.Modalidad ?? "",
    rentabilidad: r.Rentabilidad ?? "",
  };
}
