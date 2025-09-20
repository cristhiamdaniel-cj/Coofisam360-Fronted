import {
  listAusentismo as listRaw,
  getAusentismo as getRaw,
  saveAusentismo as saveRaw,
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
  return await saveRaw(body);
}

function fromApi(r) {
  const ui = {
    id: r.id ?? null,
    Año: r.anio ?? r.year,
    Mes: r.mes_nombre ?? r.mes,
    DiasAusenciaPropios: num(r.dias_ausencia_propios),
    DiasAusenciaContratistas: num(r.dias_ausencia_contratistas),
    TotalDiasIncapacidad: num(r.total_dias_incapacidad),
    DiasLaboralesMes: num(r.dias_laborales_mes),
    NumeroTrabajadores: num(r.numero_trabajadores),
    DiasTrabajoProgramados: num(r.dias_trabajo_programados),
    AusentismoLaboral: str(r.ausentismo_laboral ?? r.ausentismo_pct ?? ""),
  };
  return { ...ui, id: ui.id ?? makeIdAusentismo(ui) };
}

function toApi(u) {
  return {
    anio: num(u.Año),
    mes: toMonthNumber(u.Mes),
    dias_ausencia_propios: num(u.DiasAusenciaPropios),
    dias_ausencia_contratistas: num(u.DiasAusenciaContratistas),
    total_dias_incapacidad: num(u.TotalDiasIncapacidad),
    dias_laborales_mes: num(u.DiasLaboralesMes),
    numero_trabajadores: num(u.NumeroTrabajadores),
    dias_trabajo_programados: num(u.DiasTrabajoProgramados),
    ausentismo_laboral: str(u.AusentismoLaboral),
  };
}
