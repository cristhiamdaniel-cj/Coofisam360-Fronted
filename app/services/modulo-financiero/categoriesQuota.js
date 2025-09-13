import {
  listCategories as listCategoriesRaw,
  getCategory as getCategoryRaw,
  saveCategory as saveCategoryRaw,
} from "../modulo-financiero/financialService";

export async function listCategoriesQuota(params = {}) {
  const raw = await listCategoriesRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapCategoryRow);
}

export async function getCategoryQuota(id, params = {}) {
  const r = await getCategoryRaw(id, params);
  return r ? mapCategoryRow(r) : null;
}

export async function saveCategoryQuota(payload) {
  return await saveCategoryRaw(payload);
}

function mapCategoryRow(r) {
  return {
    id: String(r.id ?? r.categoria_id ?? r.id_categoria ?? ""), // forzar string
    codigo: str(r.codigo ?? r.codigo_oficina ?? r.office_code ?? r.cod),
    nombre: str(r.nombre ?? r.nombre_oficina ?? r.office_name),
    fecha: fmtDate(r.fecha ?? r.fecha_apertura ?? r.opened_at),
    ctaPuc14: str(r.cta_puc_14 ?? r.puc14 ?? r.account_14 ?? ""),
    ctaPuc21: str(r.cta_puc_21 ?? r.puc21 ?? r.account_21 ?? ""),
    asociados: num(r.asociados ?? r.num_asociados ?? r.members ?? 0),
    entidades: num(r.entidades ?? r.entidades_financieras ?? r.banks ?? 0),
    poblacion: num(r.poblacion ?? r.population ?? 0),
    // necesarios para POST:
    anio: Number(r.anio ?? r.year ?? 0) || 0,
    mes: Number(r.mes ?? r.month ?? 0) || 0,
  };
}
function num(v) {
  if (v == null) return 0;
  const n = Number(
    String(v)
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.-]/g, "")
  );
  return Number.isFinite(n) ? n : 0;
}

function str(v) {
  return (v ?? "").toString();
}

function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return str(v);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
