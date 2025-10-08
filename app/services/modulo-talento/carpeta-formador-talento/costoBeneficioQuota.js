import {
  listCostoBeneficio as listCostoBeneficioRaw,
  getCostoBeneficio as getCostoBeneficioRaw,
  saveCostoBeneficio as saveCostoBeneficioRaw,
  updateCostoBeneficio as updateCostoBeneficioRaw,
} from "./talentTrainerService";
import {
  toMonthNumber,
  moneyToNumber,
  num,
  fmtMoneyCOP,
} from "./talentHelpers";
// Evitar dependencia a 'uuid'; usar crypto.randomUUID si existe
function genId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (_) {}
  return `id_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

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
export async function updateCostoBeneficioQuota(payload) {
  return await updateCostoBeneficioRaw(payload);
}

function mapFromApi(r) {
  return {
    id: r.id ?? r.row_id ?? genId(),
    Año: r.anio ?? r.year,
    Mes: r.mes_nombre ?? r.mes ?? r.month_name,
    TotalGastosTransferencia: r.total_gastos,
    TrabajadoresCapacitados: num(
      r.trabajadores_cap ?? r.trabajadores_capacitados ?? r.n_capacitados
    ),
    CostoPorTrabajador: r.costo_por_trabajador,
    // Mostrar en UI normalizado, pero conservar el valor exacto para PK en PUT
    Modalidad: (r.modalidad ?? "").toString().toUpperCase(),
    ModalidadPk: (r.modalidad ?? "").toString(),
    Rentabilidad: (r.rentabilidad ?? "").toString().toUpperCase(),
    Grupo: r.grupo ?? 1,
  };
}

function mapToApi(r) {
  return {
    id: r.id,
    anio: num(r.Año),
    mes: r.Mes,
    total_gastos: r.TotalGastosTransferencia,
    trabajadores_cap: num(r.TrabajadoresCapacitados),
    costo_por_trabajador: r.CostoPorTrabajador,
    // Para PUT usar el valor original de la PK si existe
    modalidad: (r.ModalidadPk ?? r.Modalidad ?? "").toString(),
    rentabilidad: (r.Rentabilidad ?? "").toString().toUpperCase(),
    grupo: r.Grupo ?? 1,
  };
}
