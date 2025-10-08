import {
  listFormaciones as listFormacionesRaw,
  getFormacion as getFormacionRaw,
  saveFormacion as saveFormacionRaw,
  updateFormacion as updateFormacionRaw,
} from "./talentTrainerService";
import { toMonthNumber, num } from "./talentHelpers";

export async function listFormacionQuota(params = {}) {
  const raw = await listFormacionesRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapFromApi);
}
export async function getFormacionQuota(id, params = {}) {
  const r = await getFormacionRaw(id, params);
  return r ? mapFromApi(r) : null;
}
export async function saveFormacionQuota(payload) {
  return await saveFormacionRaw(mapToApi(payload));
}
export async function updateFormacionQuota(payload) {
  return await updateFormacionRaw(mapToApi(payload));
}

function mapFromApi(r) {
  return {
    id: r.id ?? r.formacion_id,
    Año: r.anio ?? r.year,
    Mes: r.mes_nombre ?? r.mes,
    CantidadTrabajadores: num(r.cantidad_trabajadores ?? r.n_trabajadores),
    Oficina: r.oficina ?? r.dependencia ?? "",
    Roles: r.roles ?? "",
    TemaFormacion: r.tema ?? r.tema_formacion ?? "",
    TipoFormacion: r.tipo ?? r.tipo_formacion ?? "",
    TotalParticipantes: num(r.total_participantes ?? r.participantes),
    TotalTrabajadores: num(r.total_trabajadores ?? r.dotacion),
    PorcentajeParticipacion:
      r.porcentaje_participacion ?? r.participacion_pct ?? "",
    NumeroVecesFormado: num(r.veces_formado ?? r.cantidad_eventos ?? 0),
    Calificacion: num(r.calificacion ?? r.rating ?? 0),
  };
}

function mapToApi(r) {
  return {
    id: r.id,
    anio: num(r.Año),
    mes: toMonthNumber(r.Mes),
    // Nombre esperado por backend: 'cant_trab_participaron'
    cant_trab_participaron: num(r.CantidadTrabajadores),
    oficina: r.Oficina ?? "",
    roles: r.Roles ?? "",
    tema_formacion: r.TemaFormacion ?? "",
    tipo_formacion: r.TipoFormacion ?? "",
    total_participantes: num(r.TotalParticipantes),
    total_trabajadores: num(r.TotalTrabajadores),
    porcentaje_participacion: String(r.PorcentajeParticipacion ?? ""),
    veces_formado: num(r.NumeroVecesFormado),
    calificacion: num(r.Calificacion),
    // PK compuesta requiere grupo; por defecto 1 si no se edita
    grupo: num(r.Grupo) || 1,
  };
}
