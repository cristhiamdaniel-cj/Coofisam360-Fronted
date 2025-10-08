import {
  listSatisfaccionAprendizaje as listSatisfaccionRaw,
  getSatisfaccionAprendizaje as getSatisfaccionRaw,
  saveSatisfaccionAprendizaje as saveSatisfaccionRaw,
  updateSatisfaccionAprendizaje as updateSatisfaccionRaw,
} from "./talentTrainerService";
import { toMonthNumber, num } from "./talentHelpers";

export async function listSatisfaccionQuota(params = {}) {
  const raw = await listSatisfaccionRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapFromApi);
}
export async function getSatisfaccionQuota(id, params = {}) {
  const r = await getSatisfaccionRaw(id, params);
  return r ? mapFromApi(r) : null;
}
export async function saveSatisfaccionQuota(payload) {
  return await saveSatisfaccionRaw(mapToApi(payload));
}
export async function updateSatisfaccionQuota(payload) {
  return await updateSatisfaccionRaw(mapToApi(payload));
}

function mapFromApi(r) {
  return {
    id: r.id ?? r.satisfaccion_id,
    Año: r.anio ?? r.year,
    Mes: r.mes_nombre ?? r.mes,
    NumeroFormadoresConRecomendacion: num(
      r.formadores_con_recomendacion ?? r.n_formadores_rec
    ),
    TotalFormadores: num(r.total_formadores ?? r.formadores_total),
    PorcentajeSatisfaccion:
      r.satisfaccion_pct ?? r.porcentaje_satisfaccion ?? "",
    Formadores: r.formadores ?? "",
    Recomendaciones: r.recomendaciones ?? r.recos ?? "",
  };
}

function mapToApi(r) {
  return {
    id: r.id,
    anio: num(r.Año),
    mes: toMonthNumber(r.Mes),
    // Nombres aceptados por backend
    n_formadores_recomendacion: num(r.NumeroFormadoresConRecomendacion),
    total_formadores: num(r.TotalFormadores),
    pct_satisfaccion: String(r.PorcentajeSatisfaccion ?? ""),
    formadores_o_area: r.Formadores ?? "",
    recomendacion: r.Recomendaciones ?? "",
  };
}
