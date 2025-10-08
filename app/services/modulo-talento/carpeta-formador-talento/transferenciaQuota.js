import {
  listTransferenciaConocimiento as listTransferenciaRaw,
  getTransferenciaConocimiento as getTransferenciaRaw,
  saveTransferenciaConocimiento as saveTransferenciaRaw,
  updateTransferenciaConocimiento as updateTransferenciaRaw,
} from "./talentTrainerService";
import { toMonthNumber, num } from "./talentHelpers";

export async function listTransferenciaQuota(params = {}) {
  const raw = await listTransferenciaRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapFromApi);
}
export async function getTransferenciaQuota(id, params = {}) {
  const r = await getTransferenciaRaw(id, params);
  return r ? mapFromApi(r) : null;
}
export async function saveTransferenciaQuota(payload) {
  return await saveTransferenciaRaw(mapToApi(payload));
}
export async function updateTransferenciaQuota(payload) {
  return await updateTransferenciaRaw(mapToApi(payload));
}

function mapFromApi(r) {
  const totalFallback =
    num(r.comprension) +
    num(r.practica) +
    num(r.retencion ?? r.retencion_conocimiento) +
    num(r.valoracion_desempeno ?? r.evaluation) +
    num(r.satisfaccion ?? r.satisfaccion_trabajador);

  return {
    id: r.id ?? r.transferencia_id,
    Año: r.anio ?? r.year,
    Mes: r.mes_nombre ?? r.mes,
    Comprension: num(r.comprension ?? r.comprehension),
    Practica: num(r.practica ?? r.practice),
    RetencionConocimiento: num(r.retencion ?? r.retencion_conocimiento),
    ValoracionDesempeno: num(r.valoracion_desempeno ?? r.evaluation),
    SatisfaccionTrabajador: num(r.satisfaccion ?? r.satisfaccion_trabajador),
    Total: num(r.total ?? totalFallback),
    EfectividadTransferencia: num(r.efectividad ?? r.efectividad_transferencia),
  };
}

function mapToApi(r) {
  return {
    id: r.id,
    anio: num(r.Año),
    mes: toMonthNumber(r.Mes),
    comprension: num(r.Comprension),
    practica: num(r.Practica),
    // Nombres aceptados por backend
    retencion: num(r.RetencionConocimiento),
    valoracion_desempeno: num(r.ValoracionDesempeno),
    satisfaccion: num(r.SatisfaccionTrabajador),
    total: num(r.Total),
    efectividad: num(r.EfectividadTransferencia),
  };
}
