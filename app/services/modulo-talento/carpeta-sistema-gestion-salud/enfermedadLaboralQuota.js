import {
  listEnfermedadLaboral as listRaw,
  getEnfermedadLaboral as getRaw,
  saveEnfermedadLaboral as saveRaw,
  updateEnfermedadLaboral as updateRaw,
} from "./talentHealthService";
import { toMonthNumber, num, str } from "./healthHelpers";

export async function listEnfermedadLaboralRows(params = {}) {
  const raw = await listRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(fromApi);
}
export async function getEnfermedadLaboralRow(id, params = {}) {
  const r = await getRaw(id, params);
  return r ? fromApi(r) : null;
}
export async function saveEnfermedadLaboralRow(uiRow) {
  const body = toApi(uiRow);
  if (uiRow && !uiRow.isNew) {
    return await updateRaw(body);
  }
  return await saveRaw(body);
}

function fromApi(a) {
  return {
    id: a.id ?? a.row_id,
    anio: a.anio,
    mes: a.mes_nombre ?? a.mes,
    casosAntiguosEL: num(a.casos_antiguos ?? a.casos_antiguos_el),
    numeroTrabajadoresAnio: num(a.numero_trabajadores_anio),
    casosNuevosEL: num(a.casos_nuevos ?? a.casos_nuevos_el),
    constante: str(a.constante),
    indicador: str(a.indicador),
    resultado: str(a.resultado),
    codigoCIE10: str(a.codigo_cie10),
    // Preferir 'clasificacion_internacional' (alias del API); fallback a 'clasificacion_cie'
    clasificacionCIE: str(a.clasificacion_internacional ?? a.clasificacion_cie),
    clasificacionEnfermedadLaboral: str(a.clasificacion_enfermedad ?? a.clasificacion_enfermedad_laboral),
  };
}
function toApi(u) {
  const body = {
    anio: num(u.anio),
    mes: toMonthNumber(u.mes),
    // Usa alias que el backend mapea a las columnas con espacios
    casos_antiguos: num(u.casosAntiguosEL),
    casos_nuevos: num(u.casosNuevosEL),
    // constante es fija (100.000) en BD: no enviar
    indicador: str(u.indicador || 'P-EL'),
    // resultado lo calcula la BD según indicador
    codigo_cie10: str(u.codigoCIE10),
    clasificacion_internacional: str(u.clasificacionCIE),
    clasificacion_enfermedad: str(u.clasificacionEnfermedadLaboral),
  };
  // Enviar id solo si es numérico (evita 'new-...')
  if (u.id != null && /^\d+$/.test(String(u.id))) body.id = Number(u.id);
  return body;
}
