import api from "../../api";

/* ========= CONTROL DISCIPLINARIO ========= */

export async function listControlDisciplinario(params = {}) {
  const { data } = await api.get("/api/v1/talento/control-disciplinario/", {
    params,
  });
  return data?.items ?? data;
}

export async function getControlDisciplinarioBy(params = {}) {
  const { data } = await api.get("/api/v1/talento/control-disciplinario/", {
    params,
  });
  return data?.items ?? data ?? [];
}

export async function saveControlDisciplinario(payload = {}) {
  const { data } = await api.post(
    "/api/v1/talento/control-disciplinario/",
    payload
  );
  return data;
}

export async function updateControlDisciplinario(payload = {}) {
  const { data } = await api.put(
    "/api/v1/talento/control-disciplinario/",
    payload
  );
  return data;
}

/* ========= EMPLEADOS (por oficina) ========= */

export async function listEmpleados(params = {}) {
  const { data } = await api.get("/api/v1/talento/empleados/", { params });
  return data?.items ?? data ?? [];
}
