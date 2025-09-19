import {
  listRestriccionesLaborales as listRaw,
  getRestriccionLaboral as getRaw,
  saveRestriccionLaboral as saveRaw,
} from "./talentHealthService";
import { num, str } from "./healthHelpers";

export async function listRestriccionesRows(params = {}) {
  const raw = await listRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(fromApi);
}
export async function getRestriccionRow(id, params = {}) {
  const r = await getRaw(id, params);
  return r ? fromApi(r) : null;
}
export async function saveRestriccionRow(uiRow) {
  return await saveRaw(toApi(uiRow));
}

function fromApi(a) {
  return {
    id: a.id ?? a.row_id,
    anio: a.anio,
    oficina: str(a.oficina),
    cargo: str(a.cargo),
    patologia: str(a.patologia),
    restricciones: str(a.restricciones),
  };
}
function toApi(u) {
  return {
    id: u.id,
    anio: num(u.anio),
    oficina: str(u.oficina),
    cargo: str(u.cargo),
    patologia: str(u.patologia),
    restricciones: str(u.restricciones),
  };
}
