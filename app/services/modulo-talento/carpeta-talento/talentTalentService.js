import api from "../api";

/* =================ASCENSOS==================== */

export async function listAscensos(params = {}) {

  const { data } = await api.get("/api/v1/talento//", { params });
  const rows = data?.items ?? data ?? [];
  return rows.map(mapAscensoRow);
}

export async function getAscenso(idOrKey, params = {}) {

  if (typeof idOrKey === "object") {
    const { anio, mes, oficinaId } = idOrKey;
    const { data } = await api.get("/api/v1/talento//", {
      params: { ...params, anio, mes, oficina_id: oficinaId },
    });
    const items = data?.items ?? [];
    return items[0] ? mapAscensoRow(items[0]) : null;
  }
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...params, id: idOrKey },
  });
  const items = data?.items ?? [];
  return items[0] ? mapAscensoRow(items[0]) : null;
}

export async function saveAscenso(payload) {

  const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

function mapAscensoRow(r) {
  return {
    id: r.id ?? `${r.AÑO ?? r.anio}-${r.MES ?? r.mes}-${r["ID-OFICINA"] ?? r.oficina_id}`,
    anio: num(r.AÑO ?? r.anio),
    mes: str(r.MES ?? r.mes),
    oficinaId: num(r["ID-OFICINA"] ?? r.oficina_id),
    oficina: str(r["OFICINA O SUBGERENCIA"] ?? r.oficina ?? r.subgerencia),
    cantidad: num(r.CANTIDAD ?? r.cantidad),
    totalEmpleados: num(r["TOTAL EMPLEADOS"] ?? r.total_empleados),
    variacionPct: percent(r["% VARIACIÓN"] ?? r.variacion_pct),
    promedioPct: percent(r.PROMEDIO ?? r.promedio_pct),
  };
}

/* ==============BONIFICACIÓN (anual)================ */

export async function listBonificaciones(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  const rows = data?.items ?? data ?? [];
  return rows.map(mapBonificacionRow);
}

export async function getBonificacion(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] ? mapBonificacionRow(items[0]) : null;
}

export async function saveBonificacion(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

function mapBonificacionRow(r) {
  return {
    id: r.id ?? `${r.AÑO ?? r.anio}-${r.MES ?? r.mes}`,
    anio: num(r.AÑO ?? r.anio),
    mes: str(r.MES ?? r.mes),
    cantidadEmpleados: num(r["CANTIDAD EMPLEADOS"] ?? r.cantidad_empleados),
    cantidadBeneficiados: num(r["CANTIDAD BENEFICIADOS"] ?? r.cantidad_beneficiados),
    variacionPct: percent(r["% VARIACIÓN"] ?? r.variacion_pct),
  };
}

/* =============BONO CUMPLEAÑOS (mensual)================ */

export async function listBonosCumpleanos(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  const rows = data?.items ?? data ?? [];
  return rows.map(mapBonoCumpleRow);
}

export async function getBonoCumpleanos(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] ? mapBonoCumpleRow(items[0]) : null;
}

export async function saveBonoCumpleanos(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

function mapBonoCumpleRow(r) {
  return {
    id: r.id ?? `${r.AÑO ?? r.anio}-${r.MES ?? r.mes}`,
    anio: num(r.AÑO ?? r.anio),
    mes: str(r.MES ?? r.mes),
    cantidadEmpleados: num(r["CANTIDAD EMPLEADOS"] ?? r.cantidad_empleados),
    cantidadBeneficiados: num(r["CANTIDAD BENEFICIADOS"] ?? r.cantidad_beneficiados),
    valorBono: num(r["VALOR BONO"] ?? r.valor_bono),
    totalBono: num(r["TOTAL BONO"] ?? r.total_bono),
    variacionPct: percent(r["% VARIACIÓN"] ?? r.variacion_pct),
  };
}

/* =============CLIMA LABORAL=============== */

export async function listClimaLaboral(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  const rows = data?.items ?? data ?? [];
  return rows.map(mapClimaRow);
}

export async function getClimaLaboral(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] ? mapClimaRow(items[0]) : null;
}

export async function saveClimaLaboral(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

function mapClimaRow(r) {
  return {
    id: r.id ?? `${r.DIMENSION ?? r.dimension}-${r.AÑO ?? r.anio}`,
    dimension: str(r.DIMENSION ?? r.dimension),
    cumplimientoPct: percent(r["% DE CUMPLIMIENTO"] ?? r.cumplimiento_pct),
    anio: num(r.AÑO ?? r.anio),
  };
}

/* ============DESEMPEÑO (por oficina)================= */

export async function listDesempeno(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  const rows = data?.items ?? data ?? [];
  return rows.map(mapDesempenoRow);
}

export async function getDesempeno(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] ? mapDesempenoRow(items[0]) : null;
}

export async function saveDesempeno(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

function mapDesempenoRow(r) {
  return {
    id: r.id ?? `${r["OFICINA O SUBGERENCIA"] ?? r.oficina}-${r.AÑO ?? r.anio}`,
    oficina: str(r["OFICINA O SUBGERENCIA"] ?? r.oficina ?? r.subgerencia),
    desempenoPct: percent(r["% DESEMPEÑO"] ?? r.desempeno_pct),
    anio: num(r.AÑO ?? r.anio),
  };
}

/* ============EGRESOS (por oficina/mes)=========== */

export async function listEgresos(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  const rows = data?.items ?? data ?? [];
  return rows.map(mapEgresoRow);
}

export async function getEgreso(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] ? mapEgresoRow(items[0]) : null;
}

export async function saveEgreso(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

function mapEgresoRow(r) {
  return {
    id: r.id ?? `${r.AÑO ?? r.anio}-${r.MES ?? r.mes}-${r.OFICINA ?? r.oficina}-${r.CARGO ?? r.cargo ?? ""}`,
    anio: num(r.AÑO ?? r.anio),
    mes: str(r.MES ?? r.mes),
    oficina: str(r.OFICINA ?? r.oficina),
    cargo: str(r.CARGO ?? r.cargo),
    cantidad: str(r.CANTIDAD ?? r.cantidad),
    motivo: str(r.MOTIVO ?? r.motivo),
  };
}

/* ============ROL LÍDER============== */

export async function listRolLider(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  const rows = data?.items ?? data ?? [];
  return rows.map(mapRolLiderRow);
}

export async function getRolLider(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] ? mapRolLiderRow(items[0]) : null;
}

export async function saveRolLider(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}

function mapRolLiderRow(r) {
  return {
    id: r.id ?? `${r.AÑO ?? r.anio}-${r.MES ?? r.mes}`,
    anio: num(r.AÑO ?? r.anio),
    mes: str(r.MES ?? r.mes),
    liderMujer: num(r["LIDER MUJER"] ?? r.lider_mujer),
    liderHombre: num(r["LIDER HOMBRE"] ?? r.lider_hombre),
    liderOtro: num(r["LIDER OTRO"] ?? r.lider_otro),
    totalEmpleados: num(r["TOTAL EMPLEADOS"] ?? r.total_empleados),
    pctLiderMujer: percent(r["% LIDER MUJER"] ?? r.pct_lider_mujer),
    pctLiderHombre: percent(r["% LIDER HOMBRE"] ?? r.pct_lider_hombre),
    pctLiderOtro: percent(r["% LIDER OTRO"] ?? r.pct_lider_otro),
  };
}


function str(v) {
  return (v ?? "").toString();
}
function num(v) {
  if (v == null) return 0;
  const s = String(v).replace(/[%$]/g, "").replace(/\s/g, "");
  const n = Number(s.replace(/\./g, "").replace(/,/g, ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function percent(v) {
  return num(v);
}
