import api from "./api";


/* ========= CONTROL DISCIPLINARIO ========= */

export async function listControlDisciplinario(params = {}) {
  const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getControlDisciplinario(id, params = {}) {
  const { data } = await api.get("/api/v1/talento//", {
    params: { ...params, id },
  });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveControlDisciplinario(payload) {
  const { data } = await api.post("/api/v1/talento//", payload);
  return data;
}
