export const MMAP = {
  ENERO:1, FEBRERO:2, MARZO:3, ABRIL:4, MAYO:5, JUNIO:6,
  JULIO:7, AGOSTO:8, SEPTIEMBRE:9, OCTUBRE:10, NOVIEMBRE:11, DICIEMBRE:12,
  Enero:1, Febrero:2, Marzo:3, Abril:4, Mayo:5, Junio:6,
  Julio:7, Agosto:8, Septiembre:9, Octubre:10, Noviembre:11, Diciembre:12,
};

export function toMonthNumber(m) {
  if (m == null) return undefined;
  if (typeof m === "number") return m;
  const s = String(m).trim();
  // Aceptar cadenas numéricas "1".."12"
  if (/^\d{1,2}$/.test(s)) {
    const n = parseInt(s, 10);
    if (n >= 1 && n <= 12) return n;
  }
  return MMAP[s] ?? undefined;
}
export function num(v, d = 0) {
  if (v == null || v === "") return d;
  const n = Number(String(v).replace(/\./g,"").replace(",",".").replace(/[^\d.-]/g,""));
  return Number.isFinite(n) ? n : d;
}
export function str(v) { return (v ?? "").toString(); }

export function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return str(v);
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
export function dateToIso(v) {
  if (!v) return null;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [dd, mm, yyyy] = v.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

export function makeIdAccidentalidad(a) {
  return `${a.Año ?? a.anio}-${a.Mes ?? a.mes}-${(a.TipoVinculacion ?? a.tipo_vinculacion ?? "").toString().replace(/\s+/g,"_")}`;
}
export function makeIdAusentismo(a) {
  return `${a.Año ?? a.anio}-${a.Mes ?? a.mes}`;
}
export function makeIdEnfLab(a) {
  return `${a.anio ?? a.Año}-${a.mes ?? a.Mes}-${a.indicador ?? a.Indicador ?? ""}`;
}
export function makeIdReporteMin(a) {
  return `${a.anio ?? a.Año}`;
}
export function makeIdRestriccion(a) {
  return `${a.anio ?? a.Año}-${a.oficina ?? a.Oficina}-${a.cargo ?? a.Cargo}`;
}
