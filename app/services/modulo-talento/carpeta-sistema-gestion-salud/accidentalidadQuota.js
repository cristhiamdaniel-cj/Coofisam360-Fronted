import {
  listAccidentalidad as listRaw,
  getAccidentalidad as getRaw,
  saveAccidentalidad as saveRaw,
} from "./talentHealthService";
import {
  num,
  str,
  toMonthNumber,
  fmtDate,
  dateToIso,
  makeIdAccidentalidad,
} from "./healthHelpers";

export async function listAccidentalidadRows(params = {}) {
  const raw = await listRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(fromApi);
}
export async function getAccidentalidadRow(id, params = {}) {
  const r = await getRaw(id, params);
  return r ? fromApi(r) : null;
}
export async function saveAccidentalidadRow(uiRow) {
  const body = toApi(uiRow);
  if (uiRow?.id) return await updateRaw(uiRow.id, body);
  return await saveRaw(body);
}

function fromApi(r) {
  const ui = {
    id: r.id ?? null,
    Año: r.anio ?? r.year ?? "",
    Mes: (r.mes_nombre ?? r.mes ?? "").toString().toUpperCase(),
    TipoVinculacion: str(r.tipo_vinculacion ?? r.tipo),
    NumeroTrabajadores: num(r.numero_trabajadores ?? r.trabajadores),
    AccidentesTrabajo: num(r.accidentes_trabajo ?? r.at),
    AtMortales: num(r.at_mortales ?? r.mortales),
    DiasIncapacidad: num(r.dias_incapacidad ?? r.incapacidad_dias),
    DiasCargados: num(r.dias_cargados ?? r.cargados_dias),
    Indicador: str(r.indicador ?? ""),
    Resultado: str(r.resultado ?? r.result ?? ""),
  };
  return { ...ui, id: ui.id ?? makeIdAccidentalidad(ui) };
}
function toApi(u) {
  return {
    id: u.id,
    anio: num(u.Año),
    mes: toMonthNumber(u.Mes),
    tipo_vinculacion: str(u.TipoVinculacion),
    numero_trabajadores: num(u.NumeroTrabajadores),
    accidentes_trabajo: num(u.AccidentesTrabajo),
    at_mortales: num(u.AtMortales),
    dias_incapacidad: num(u.DiasIncapacidad),
    dias_cargados: num(u.DiasCargados),
    indicador: str(u.Indicador),
    resultado: str(u.Resultado),
  };
}
