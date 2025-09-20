import api from "../../api";

/* ===================ACCIDENTALIDAD==================== */
export async function listAccidentalidad(params = {}) {
  const { data } = await api.get("/api/v1/talento/accidentalidad/", { params });
  return data?.items ?? data;
}
export async function getAccidentalidad(id, params = {}) {
  const { data } = await api.get("//api/v1/talento/accidentalidad/", {
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

/* ================PLAN DE TRABAJO==================
 */

/* ==================PROGRAMA===================
 */

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
