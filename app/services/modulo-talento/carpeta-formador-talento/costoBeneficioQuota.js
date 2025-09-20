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
export async function saveCostoBeneficioQuota(payload) {
  return await saveCostoBeneficioRaw(payload);
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
    anio: num(r.Año),
    mes: r.Mes,
    total_gastos: r.TotalGastosTransferencia,
    trabajadores_capacitados: num(r.TrabajadoresCapacitados),
    costo_por_trabajador: r.CostoPorTrabajador,
    modalidad: r.Modalidad ?? "",
    rentabilidad: r.Rentabilidad ?? "",
  };
}
