import api from "../../api";

/* ========= CONTROL DISCIPLINARIO ========= */

export async function listControlDisciplinario(params = {}) {
  const { data } = await api.get("/api/v1/talento/control-disciplinario", {
    params,
  });
  return data?.items ?? data;
}

export async function getControlDisciplinario(id, params = {}) {
  const { data } = await api.get(
    `/api/v1/talento/control-disciplinario/${id}`,
    { params }
  );
  return data?.items?.[0] ?? data ?? null;
}

export async function saveControlDisciplinario(payload) {
  const { data } = await api.post(
    "/api/v1/talento/control-disciplinario",
    payload
  );
  return data;
}
