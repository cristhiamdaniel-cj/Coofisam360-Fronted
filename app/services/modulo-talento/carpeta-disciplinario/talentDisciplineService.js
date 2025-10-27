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
  const { id, ...data } = payload;
  if (!id) {
    throw new Error("ID es requerido para actualizar un registro");
  }
  console.log("🚀 ENVIANDO PUT request:", { id, data });
  try {
    const { data: response } = await api.put(
      `/api/v1/talento/control-disciplinario/${id}/`,
      data
    );
    console.log("✅ RESPUESTA EXITOSA:", response);
    return response;
  } catch (error) {
    console.log("❌ ERROR EN PUT:", error);
    throw error;
  }
}

export async function deleteControlDisciplinario(id) {
  const { data } = await api.delete(
    `/api/v1/talento/control-disciplinario/${id}/`
  );
  return data;
}

/* ========= EMPLEADOS (por oficina) ========= */

export async function listEmpleados(params = {}) {
  const { data } = await api.get("/api/v1/talento/empleados/", { params });
  return data?.items ?? data ?? [];
}
