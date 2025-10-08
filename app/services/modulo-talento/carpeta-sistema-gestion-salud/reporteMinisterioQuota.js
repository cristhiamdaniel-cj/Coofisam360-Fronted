import {
  listReporteMinisterio as listRaw,
  getReporteMinisterio as getRaw,
  saveReporteMinisterio as saveRaw,
  updateReporteMinisterio as updateRaw,
} from "./talentHealthService";
import { num, str } from "./healthHelpers";

export async function listReporteMinisterioRows(params = {}) {
  const raw = await listRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(fromApi);
}
export async function getReporteMinisterioRow(id, params = {}) {
  const r = await getRaw(id, params);
  return r ? fromApi(r) : null;
}
export async function saveReporteMinisterioRow(uiRow) {
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
    recursos: str(a.recursos),
    gestionIntegral: str(a.gestion_integral),
    gestionSalud: str(a.gestion_salud),
    gestionPeligros: str(a.gestion_peligros),
    gestionAmenazas: str(a.gestion_amenazas),
    verificacion: str(a.verificacion),
    mejoramiento: str(a.mejoramiento),
    porcentaje: str(a.porcentaje),
  };
}
function toApi(u) {
  return {
    id: u.id,
    anio: num(u.anio),
    recursos: str(u.recursos),
    gestion_integral: str(u.gestionIntegral),
    gestion_salud: str(u.gestionSalud),
    gestion_peligros: str(u.gestionPeligros),
    gestion_amenazas: str(u.gestionAmenazas),
    verificacion: str(u.verificacion),
    mejoramiento: str(u.mejoramiento),
    porcentaje: str(u.porcentaje),
  };
}
