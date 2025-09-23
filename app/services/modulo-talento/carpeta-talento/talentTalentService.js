import api from "../../api";

/* ===== ASCENSOS ===== */
export async function listAscensos(params = {}) {
  const { data } = await api.get("/api/v1/talento/ascensos/", { params });
  return data?.items ?? data ?? [];
}
export async function getAscenso(params = {}) {
  const { data } = await api.get("/api/v1/talento/ascensos/", { params });
  const items = data?.items ?? [];
  return items[0] ?? null;
}
export async function saveAscenso(payload = {}) {
  const { data } = await api.post("/api/v1/talento/ascensos/", payload);
  return data?.items ?? data ?? [];
}

/* ===== BONIFICACIÓN (anio+mes) ===== */
export async function listBonificaciones(params = {}) {
  const { data } = await api.get("/api/v1/talento/bonos-mensual/", { params });
  return data?.items ?? data ?? [];
}
export async function getBonificacion(params = {}) {
  const { data } = await api.get("/api/v1/talento/bonos-mensual/", { params });
  const items = data?.items ?? [];
  return items[0] ?? null;
}
export async function saveBonificacion(payload = {}) {
  const { data } = await api.post("/api/v1/talento/bonos-mensual/", payload);
  return data?.items ?? data ?? [];
}

/* ===== BONO CUMPLEAÑOS (anio+mes) ===== */
export async function listBonoCumple(params = {}) {
  const { data } = await api.get("/api/v1/talento/bono-cumple/", { params });
  return data?.items ?? data ?? [];
}
export async function getBonoCumple(params = {}) {
  const { data } = await api.get("/api/v1/talento/bono-cumple/", { params });
  const items = data?.items ?? [];
  return items[0] ?? null;
}
export async function saveBonoCumple(payload = {}) {
  const { data } = await api.post("/api/v1/talento/bono-cumple/", payload);
  return data?.items ?? data ?? [];
}

/* ===== CLIMA LABORAL (anio+dimension) ===== */
export async function listClima(params = {}) {
  const { data } = await api.get("/api/v1/talento/clima-laboral/", { params });
  return data?.items ?? data ?? [];
}
export async function getClima(params = {}) {
  const { data } = await api.get("/api/v1/talento/clima-laboral/", { params });
  const items = data?.items ?? [];
  return items[0] ?? null;
}
export async function saveClima(payload = {}) {
  const { data } = await api.post("/api/v1/talento/clima-laboral/", payload);
  return data?.items ?? data ?? [];
}

/* ===== DESEMPEÑO (anio+oficina) ===== */
export async function listDesempeno(params = {}) {
  const { data } = await api.get("/api/v1/talento/desempeno/", { params });
  return data?.items ?? data ?? [];
}
export async function getDesempeno(params = {}) {
  const { data } = await api.get("/api/v1/talento/desempeno/", { params });
  const items = data?.items ?? [];
  return items[0] ?? null;
}
export async function saveDesempeno(payload = {}) {
  const { data } = await api.post("/api/v1/talento/desempeno/", payload);
  return data?.items ?? data ?? [];
}

/* ===== EGRESOS (id) ===== */
export async function listEgresos(params = {}) {
  const { data } = await api.get("/api/v1/talento/egresos/", { params });
  return data?.items ?? data ?? [];
}
export async function getEgreso(params = {}) {
  const { data } = await api.get("/api/v1/talento/egresos/", { params });
  const items = data?.items ?? [];
  return items[0] ?? null;
}
export async function saveEgreso(payload = {}) {
  const { data } = await api.post("/api/v1/talento/egresos/", payload);
  return data?.items ?? data ?? [];
}

/* ===== ROL LÍDER (periodo o anio+mes) ===== */
export async function listRolLider(params = {}) {
  const { data } = await api.get("/api/v1/talento/rol-lider/", { params });
  return data?.items ?? data ?? [];
}
export async function getRolLider(params = {}) {
  const { data } = await api.get("/api/v1/talento/rol-lider/", { params });
  const items = data?.items ?? [];
  return items[0] ?? null;
}
export async function saveRolLider(payload = {}) {
  const { data } = await api.post("/api/v1/talento/rol-lider/", payload);
  return data?.items ?? data ?? [];
}
