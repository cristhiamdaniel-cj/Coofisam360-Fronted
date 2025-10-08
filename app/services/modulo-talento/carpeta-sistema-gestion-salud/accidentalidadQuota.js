import {
  listAccidentalidad as listRaw,
  getAccidentalidad as getRaw,
  saveAccidentalidad as saveRaw,
  updateAccidentalidad as updateRaw,
} from "./talentHealthService";
import { num, str, toMonthNumber, makeIdAccidentalidad } from "./healthHelpers";

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
  if (uiRow && (uiRow.id && !String(uiRow.id).startsWith("new-")) && !uiRow.isNew) {
    return await updateRaw(body);
  }
  return await saveRaw(body);
}

function fromApi(r) {
  const ui = {
    id: r.id ?? null,
    Año: r.anio ?? r.year ?? "",
    Mes: (r.mes_nombre ?? r.mes ?? "").toString().toUpperCase(),
    TipoVinculacion: str(r.tipo_vinculacion ?? r.tipo),
    NumeroTrabajadores: num(r.numero_trabajadores ?? r.trabajadores),
    NumeroTrabajadoresPropios: num(r.numero_trabajadores_propios),
    NumeroTrabajadoresContratistas: num(r.numero_trabajadores_contratistas),
    AccidentesTrabajo: num(r.numero_accidentes ?? r.accidentes_trabajo ?? r.at),
    AtMortales: num(r.accidentes_mortales ?? r.at_mortales ?? r.mortales),
    DiasIncapacidad: num(r.dias_incapacidad ?? r.incapacidad_dias),
    DiasCargados: num(r.dias_cargados ?? r.cargados_dias),
    Indicador: str(r.indicador ?? ""),
    Resultado: str(r.resultado ?? r.result ?? ""),
  };
  return { ...ui, id: ui.id ?? makeIdAccidentalidad(ui) };
}

function toApi(u) {
  const body = {
    anio: num(u.Año),
    // Backend espera texto en mayúsculas (ENERO, ...)
    mes: String(u.Mes || "").toUpperCase(),
    tipo_vinculacion: str(u.TipoVinculacion),
    accidentes_trabajo: num(u.AccidentesTrabajo),
    at_mortales: num(u.AtMortales),
    dias_incapacidad: num(u.DiasIncapacidad),
    dias_cargados: num(u.DiasCargados),
    indicador: str(u.Indicador),
    resultado: str(u.Resultado),
  };
  if (u.id != null && /^\d+$/.test(String(u.id))) body.id = Number(u.id);
  return body;
}
