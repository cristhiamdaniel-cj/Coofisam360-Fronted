import {
  listPlanTrabajo as listRaw,
  getPlanTrabajo as getRaw,
  savePlanTrabajo as saveRaw,
  updatePlanTrabajo as updateRaw,
} from "./talentHealthService";
import { toMonthNumber, num, str } from "./healthHelpers";

export async function listPlanTrabajoRows(params = {}) {
  const raw = await listRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(fromApi);
}

export async function getPlanTrabajoRow(pk = {}, params = {}) {
  const r = await getRaw(pk, params);
  return r ? fromApi(r) : null;
}

export async function savePlanTrabajoRow(uiRow = {}) {
  const base = toApi(uiRow);
  // Preservar overrides de PK para cambios de clave (where_*)
  const extras = Object.fromEntries(
    Object.entries(uiRow || {}).filter(([k]) => k.startsWith("where_"))
  );
  const body = { ...base, ...extras };
  if (uiRow && !uiRow.isNew) {
    try {
      return await updateRaw(body);
    } catch (e) {
      // Si no se encontró, intentamos crear (idempotencia por PK compuesta)
      if (e && e.status === 404) {
        return await saveRaw(body);
      }
      throw e;
    }
  }
  return await saveRaw(body);
}

function fromApi(a = {}) {
  return {
    // Clave compuesta (no hay id numérico); útil para keys en UI
    _key: `${a.anio}-${a.mes}-${str(a.ciclo)}-${str(a.actividad)}`,
    anio: num(a.anio),
    mes: num(a.mes),
    ciclo: str(a.ciclo),
    actividad: str(a.actividad),
    planeado: num(a.planeado),
    ejecutado: num(a.ejecutado),
    responsable: str(a.responsable),
    recursoAdministrativo: !!a.recurso_administrativo,
    recursoFinanciero: !!a.recurso_financiero,
    totalActividades: num(a.total_actividades),
    actividadesProgramadasMes: num(a.actividades_programadas_mes),
    porcentajeEjecucionMensual: num(a.porcentaje_ejecucion_mensual, 0),
    porcentajeCumplimientoMeta: num(a.porcentaje_cumplimiento_meta, 0),
  };
}

function toApi(u = {}) {
  const body = {
    anio: num(u.anio),
    mes: toMonthNumber(u.mes),
    ciclo: str(u.ciclo),
    actividad: str(u.actividad),
    planeado: num(u.planeado),
    ejecutado: num(u.ejecutado),
    responsable: str(u.responsable),
    recurso_administrativo: !!u.recursoAdministrativo,
    recurso_financiero: !!u.recursoFinanciero,
    total_actividades: num(u.totalActividades),
    actividades_programadas_mes: num(u.actividadesProgramadasMes),
  };
  // Campos opcionales
  if (u.porcentajeEjecucionMensual != null)
    body.porcentaje_ejecucion_mensual = num(u.porcentajeEjecucionMensual);
  if (u.porcentajeCumplimientoMeta != null)
    body.porcentaje_cumplimiento_meta = num(u.porcentajeCumplimientoMeta);
  return body;
}
