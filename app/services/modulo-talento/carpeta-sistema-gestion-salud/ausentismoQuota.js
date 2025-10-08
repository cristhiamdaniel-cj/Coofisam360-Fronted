import {
  listAusentismo as listRaw,
  getAusentismo as getRaw,
  saveAusentismo as saveRaw,
  updateAusentismo as updateRaw,
} from "./talentHealthService";
import { num, str, toMonthNumber, makeIdAusentismo } from "./healthHelpers";

export async function listAusentismoRows(params = {}) {
  const raw = await listRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(fromApi);
}

export async function getAusentismoRow(id, params = {}) {
  const r = await getRaw(id, params);
  return r ? fromApi(r) : null;
}

export async function saveAusentismoRow(uiRow) {
  const body = toApi(uiRow);
  // Si no es nuevo, hacemos PUT usando la PK (anio, mes)
  if (uiRow && !uiRow.isNew) {
    return await updateRaw(body);
  }
  return await saveRaw(body);
}

function fromApi(r) {
  const ui = {
    id: r.id ?? null,
    Año: r.anio ?? r.year,
    Mes: r.mes_nombre ?? r.mes,
    // El API expone dias_propios/dias_contratistas (alias en SELECT)
    DiasAusenciaPropios: num(r.dias_propios ?? r.dias_ausencia_propios),
    DiasAusenciaContratistas: num(r.dias_contratistas ?? r.dias_ausencia_contratistas),
    TotalDiasIncapacidad: num(r.total_dias_incapacidad),
    // El API devuelve dias_laborales (alias); mantenemos fallback por compatibilidad
    DiasLaboralesMes: num(r.dias_laborales ?? r.dias_laborales_mes),
    NumeroTrabajadores: num(r.numero_trabajadores),
    // El API devuelve numero_dias_programados; mantenemos fallback
    DiasTrabajoProgramados: num(r.numero_dias_programados ?? r.dias_trabajo_programados),
    AusentismoLaboral: str(r.ausentismo_laboral ?? r.ausentismo_pct ?? ""),
  };
  return { ...ui, id: ui.id ?? makeIdAusentismo(ui) };
}

function toApi(u) {
  // Enviamos solo los campos capturados; el resto los calcula la BD por trigger
  return {
    anio: num(u.Año),
    mes: toMonthNumber(u.Mes),
    dias_ausencia_propios: num(u.DiasAusenciaPropios),
    dias_ausencia_contratistas: num(u.DiasAusenciaContratistas),
    // Permitimos sobrescribir días laborales si el usuario lo define
    dias_laborales_mes: num(u.DiasLaboralesMes),
  };
}
