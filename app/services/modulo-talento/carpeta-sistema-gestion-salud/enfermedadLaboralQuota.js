import {
  listEnfermedadLaboral as listRaw,
  getEnfermedadLaboral as getRaw,
  saveEnfermedadLaboral as saveRaw,
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
  return await saveRaw(toApi(uiRow));
}

function fromApi(a) {
  return {
    id: a.id ?? a.row_id,
    anio: a.anio,
    mes: a.mes_nombre ?? a.mes,
    casosAntiguosEL: num(a.casos_antiguos_el),
    numeroTrabajadoresAnio: num(a.numero_trabajadores_anio),
    casosNuevosEL: num(a.casos_nuevos_el),
    constante: str(a.constante),
    indicador: str(a.indicador),
    resultado: str(a.resultado),
    codigoCIE10: str(a.codigo_cie10),
    clasificacionCIE: str(a.clasificacion_cie),
    clasificacionEnfermedadLaboral: str(a.clasificacion_enfermedad_laboral),
  };
}
function toApi(u) {
  return {
    id: u.id,
    anio: num(u.anio),
    mes: toMonthNumber(u.mes),
    casos_antiguos_el: num(u.casosAntiguosEL),
    numero_trabajadores_anio: num(u.numeroTrabajadoresAnio),
    casos_nuevos_el: num(u.casosNuevosEL),
    constante: str(u.constante),
    indicador: str(u.indicador),
    resultado: str(u.resultado),
    codigo_cie10: str(u.codigoCIE10),
    clasificacion_cie: str(u.clasificacionCIE),
    clasificacion_enfermedad_laboral: str(u.clasificacionEnfermedadLaboral),
  };
}
