import {
  listAscensos,
  getAscenso,
  saveAscenso,
  updateAscenso,
} from "./talentTalentService";


export async function listAscensosRows(params = {}) {
  const raw = await listAscensos(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapAscensoApiToUi);
}
export async function getAscensoRow(params = {}) {
  const r = await getAscenso(params);
  return r ? mapAscensoApiToUi(r) : null;
}
export async function saveAscensoRow(ui = {}) {
  const payload = mapAscensoUiToApi(ui);
  if (ui.isNew) {
    return await saveAscenso(payload);
  }
  try {
    return await updateAscenso(payload);
  } catch (err) {
    if (err?.status === 404) {
      return await saveAscenso(payload);
    }
    throw err;
  }
}


export function mapAscensoApiToUi(a = {}) {
  const periodo = a.periodo ?? a.period ?? null;
  const anio = a.anio ?? a.AÑO ?? (periodo ? new Date(periodo).getFullYear() : undefined);
  const rawMes = a.mes ?? a.MES ?? "";
  const mes = typeof rawMes === "string" ? rawMes.trim().toUpperCase() : rawMes;
  const oficinaCodigo = Number(a.oficina_codigo ?? a["ID-OFICINA"] ?? a.oficina_id ?? 0);
  const cantidad = Number(a.cantidad ?? a.CANTIDAD ?? 0);
  const totalEmpleados = Number(a.total_empleados ?? a["TOTAL EMPLEADOS"] ?? 0);
  const variacionEntrada = a.variacion_pct ?? a["% VARIACIÓN"] ?? null;
  const variacionCalculada =
    totalEmpleados > 0 ? Number(((cantidad * 100) / totalEmpleados).toFixed(2)) : 0;
  const variacionPct = Number.isFinite(Number(variacionEntrada))
    ? Number(Number(variacionEntrada).toFixed?.(2) ?? Number(variacionEntrada).toFixed(2))
    : variacionCalculada;
  const promedioEntrada = a.promedio ?? a.promedio_pct ?? a.PROMEDIO ?? null;
  const promedio = Number.isFinite(Number(promedioEntrada))
    ? Number(Number(promedioEntrada).toFixed?.(2) ?? Number(promedioEntrada).toFixed(2))
    : variacionCalculada;
  const oficinaNombre = a.oficina_nombre ?? a["OFICINA O SUBGERENCIA"] ?? a.oficina ?? "";
  const idBase = `${anio ?? ""}-${mes ?? ""}-${oficinaCodigo || ""}`;
  return {
    id: a.id ?? idBase,
    AÑO: a.anio ?? a.AÑO,
    MES: mes,
    "ID-OFICINA": oficinaCodigo,
    "OFICINA O SUBGERENCIA": oficinaNombre,
    CANTIDAD: cantidad,
    "TOTAL EMPLEADOS": totalEmpleados,
    "% VARIACIÓN": Number.isFinite(variacionPct) ? variacionPct : 0,
    PROMEDIO: promedio,
    observacion: a.observacion ?? a.OBSERVACION ?? "",
    isNew: Boolean(a.isNew ?? false),
  };
}
export function mapAscensoUiToApi(u = {}) {
  const año = Number(u.AÑO ?? u.anio);
  const rawMes = u.MES ?? u.mes;
  const mes = typeof rawMes === "string" ? rawMes.trim().toUpperCase() : rawMes;
  const oficinaCodigo = Number(
    u["ID-OFICINA"] ?? u.oficina_codigo ?? u.oficina_id ?? u.oficinaCodigo
  );
  const cantidad = Number.isFinite(Number(u.CANTIDAD ?? u.cantidad))
    ? Number(u.CANTIDAD ?? u.cantidad)
    : 0;
  const payload = {
    cantidad,
  };
  if (Number.isFinite(año)) {
    payload.anio = año;
  }
  if (mes) {
    payload.mes = mes;
  }
  if (Number.isFinite(oficinaCodigo)) {
    payload.oficina_codigo = oficinaCodigo;
  }
  const observacion = u.observacion ?? u.OBSERVACION;
  if (observacion && `${observacion}`.trim() !== "") {
    payload.observacion = `${observacion}`.trim();
  }
  return {
    ...payload,
  };
}
