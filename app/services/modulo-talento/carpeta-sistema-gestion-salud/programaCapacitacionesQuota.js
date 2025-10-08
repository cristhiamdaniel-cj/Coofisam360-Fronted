import {
  listProgramaCapacitaciones as listRaw,
  getProgramaCapacitacion as getRaw,
  saveProgramaCapacitacion as saveRaw,
  updateProgramaCapacitacion as updateRaw,
} from "./talentHealthService";
import { toMonthNumber, num, str } from "./healthHelpers";

export async function listProgramaRows(params = {}) {
  const raw = await listRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(fromApi);
}

export async function getProgramaRow(pk = {}, params = {}) {
  const r = await getRaw(pk, params);
  return r ? fromApi(r) : null;
}

export async function saveProgramaRow(uiRow = {}) {
  const base = toApi(uiRow);
  const extras = Object.fromEntries(
    Object.entries(uiRow || {}).filter(([k]) => k.startsWith("where_"))
  );
  const body = { ...base, ...extras };
  if (uiRow && !uiRow.isNew) {
    try {
      return await updateRaw(body);
    } catch (e) {
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
    _key: `${a.anio}-${a.mes}-${str(a.actividad)}`,
    anio: num(a.anio),
    mes: num(a.mes),
    actividad: str(a.actividad),
    planeado: num(a.planeado),
    ejecutado: num(a.ejecutado),
    responsable: str(a.responsable),
    recursoAdministrativo: !!a.recurso_administrativo,
    recursoFinanciero: !!a.recurso_financiero,
    observaciones: str(a.observaciones),
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
    actividad: str(u.actividad),
    planeado: num(u.planeado),
    ejecutado: num(u.ejecutado),
    // responsable es NOT NULL en BD; coalesce a 'SIN RESPONSABLE' si viene vacío
    responsable: (str(u.responsable) || 'SIN RESPONSABLE'),
    recurso_administrativo: !!u.recursoAdministrativo,
    recurso_financiero: !!u.recursoFinanciero,
    observaciones: str(u.observaciones),
    total_actividades: num(u.totalActividades),
    actividades_programadas_mes: num(u.actividadesProgramadasMes),
  };
  if (u.porcentajeEjecucionMensual != null)
    body.porcentaje_ejecucion_mensual = num(u.porcentajeEjecucionMensual);
  if (u.porcentajeCumplimientoMeta != null)
    body.porcentaje_cumplimiento_meta = num(u.porcentajeCumplimientoMeta);
  return body;
}
