export const MMAP = {
  ENERO:1, FEBRERO:2, MARZO:3, ABRIL:4, MAYO:5, JUNIO:6,
  JULIO:7, AGOSTO:8, SEPTIEMBRE:9, OCTUBRE:10, NOVIEMBRE:11, DICIEMBRE:12,
  Enero:1, Febrero:2, Marzo:3, Abril:4, Mayo:5, Junio:6,
  Julio:7, Agosto:8, Septiembre:9, Octubre:10, Noviembre:11, Diciembre:12,
};

export function toMonthNumber(m) {
  if (m == null) return undefined;
  if (typeof m === "number") return m;
  return MMAP[String(m).trim()] ?? undefined;
}

export function moneyToNumber(v) {
  if (v == null || v === "-" || v === "$-") return 0;
  const s = String(v).replace(/\./g, "").replace(/[$\s]/g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export function num(v, d = 0) {
  if (v == null || v === "") return d;
  // Solo reemplazar comas por puntos, no remover puntos decimales
  const s = String(v).replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : d;
}

export function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function fmtMoneyCOP(n) {
  if (n == null) return "$-";
  return `$${new Intl.NumberFormat("es-CO").format(n)}`;
}
