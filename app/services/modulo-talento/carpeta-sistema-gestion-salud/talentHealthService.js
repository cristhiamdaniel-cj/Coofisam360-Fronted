import api from "../../api";

/* ===================ACCIDENTALIDAD==================== */
export async function listAccidentalidad(params = {}) {
  const { data } = await api.get("/api/v1/talento/accidentalidad/", { params });
  return data?.items ?? data;
}
export async function getAccidentalidad(id, params = {}) {
  const { data } = await api.get("/api/v1/talento/accidentalidad/", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
  /*const { data } = await api.get(`/api/v1/talento//${encodeURIComponent(id)}/`, { params });
  return data*/
}
export async function saveAccidentalidad(payload) {
  const { data } = await api.post("/api/v1/talento/accidentalidad/", payload);
  return data;
}
export async function updateAccidentalidad(payload) {
  const { data } = await api.put("/api/v1/talento/accidentalidad/", payload);
  return data;
}

/* ==================AUSENTISMO=================== */
export async function listAusentismo(params = {}) {
  const { data } = await api.get("/api/v1/talento/ausentismo/", { params });
  return data?.items ?? data;
}
export async function getAusentismo(id, params = {}) {
  const { data } = await api.get("/api/v1/talento/ausentismo/", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
  /*const { data } = await api.get(`/api/v1/talento//${encodeURIComponent(id)}/`, { params });
  return data*/
}
export async function saveAusentismo(payload) {
  const { data } = await api.post("/api/v1/talento/ausentismo/", payload);
  return data;
}
export async function updateAusentismo(payload) {
  const { data } = await api.put("/api/v1/talento/ausentismo/", payload);
  return data;
}

/* ====================ENFERMEDAD LABORAL================= */
export async function listEnfermedadLaboral(params = {}) {
  const { data } = await api.get("/api/v1/talento/enfermedad-laboral/", {
    params,
  });
  return data?.items ?? data;
}
export async function getEnfermedadLaboral(id, params = {}) {
  const { data } = await api.get("/api/v1/talento/enfermedad-laboral/", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;

  /*const { data } = await api.get(`/api/v1/talento//${encodeURIComponent(id)}/`, { params });
  return data;*/
}
export async function saveEnfermedadLaboral(payload) {
  const { data } = await api.post(
    "/api/v1/talento/enfermedad-laboral/",
    payload
  );
  return data;
}
export async function updateEnfermedadLaboral(payload) {
  const { data } = await api.put(
    "/api/v1/talento/enfermedad-laboral/",
    payload
  );
  return data;
}

/* ================PLAN DE TRABAJO==================
 */
export async function listPlanTrabajo(params = {}) {
  const { data } = await api.get("/api/v1/talento/plan-trabajo/", { params });
  return data?.items ?? data;
}
export async function getPlanTrabajo(pk = {}, params = {}) {
  const { anio, mes, ciclo, actividad } = pk || {};
  const { data } = await api.get("/api/v1/talento/plan-trabajo/", {
    params: { ...params, anio, mes, ciclo, actividad },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}
export async function savePlanTrabajo(payload = {}) {
  const { data } = await api.post("/api/v1/talento/plan-trabajo/", payload);
  return data;
}
export async function updatePlanTrabajo(payload = {}) {
  const { data } = await api.put("/api/v1/talento/plan-trabajo/", payload);
  return data;
}

/* ==================PROGRAMA===================
 */
export async function listProgramaCapacitaciones(params = {}) {
  const { data } = await api.get("/api/v1/talento/programa-capacitaciones/", {
    params,
  });
  return data?.items ?? data;
}
export async function getProgramaCapacitacion(pk = {}, params = {}) {
  const { anio, mes, actividad } = pk || {};
  const { data } = await api.get("/api/v1/talento/programa-capacitaciones/", {
    params: { ...params, anio, mes, actividad },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}
export async function saveProgramaCapacitacion(payload = {}) {
  const { data } = await api.post(
    "/api/v1/talento/programa-capacitaciones/",
    payload
  );
  return data;
}
export async function updateProgramaCapacitacion(payload = {}) {
  const { data } = await api.put(
    "/api/v1/talento/programa-capacitaciones/",
    payload
  );
  return data;
}

/* ===============REPORTE AL MINISTERIO=============== */
export async function listReporteMinisterio(params = {}) {
  const { data } = await api.get("/api/v1/talento/reporte-ministerio/", {
    params,
  });
  return data?.items ?? data;
}
export async function getReporteMinisterio(id, params = {}) {
  const { data } = await api.get("/api/v1/talento/reporte-ministerio/", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
  /*const { data } = await api.get(`/api/v1/talento//${encodeURIComponent(id)}/`, { params });
  return data; */
}
export async function saveReporteMinisterio(payload) {
  const { data } = await api.post(
    "/api/v1/talento/reporte-ministerio/",
    payload
  );
  return data;
}
export async function updateReporteMinisterio(payload) {
  const { data } = await api.put(
    "/api/v1/talento/reporte-ministerio/",
    payload
  );
  return data;
}

/* ===============RESTRICCIONES LABORALES=============== */
export async function listRestriccionesLaborales(params = {}) {
  const { data } = await api.get("/api/v1/talento/restricciones-laborales/", {
    params,
  });
  return data?.items ?? data;
}
export async function getRestriccionLaboral(id, params = {}) {
  const { data } = await api.get("/api/v1/talento/restricciones-laborales/", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
  /*const { data } = await api.get(`/api/v1/talento//${encodeURIComponent(id)}/`, { params });
  return data; */
}
export async function saveRestriccionLaboral(payload) {
  const { data } = await api.post(
    "/api/v1/talento/restricciones-laborales/",
    payload
  );
  return data;
}
export async function updateRestriccionLaboral(payload) {
  const res = await api.put(
    "/api/v1/talento/restricciones-laborales/",
    payload
  );
  return res?.data ?? res;
}
export async function deleteRestriccionLaboral(payload = {}) {
  const res = await api.delete("/api/v1/talento/restricciones-laborales/", {
    body: payload,
  });
  return res?.data ?? res;
}
