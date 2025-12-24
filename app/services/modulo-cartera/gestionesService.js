import api from "../api";

export function mapGestionApiToUi(r = {}) {
  return {
    id: r.id,
    tipo: r.tipo || "",
    fechaGestion: r.fecha_gestion || "",
    comentario: r.comentario || "",
    nroProducto: r.nro_producto || "",
    cedula: r.cedula || "",
    nombre: r.nombre || "",
    usuarioGestion: r.usuario_gestion || r.gestor || "",
    oficina: r.oficina || "",
    gestionValidada: r.gestion_validada || "",
  };
}

export async function listGestiones(params = {}) {
  const { data } = await api.get("/api/v1/cartera/gestiones/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapGestionApiToUi);
}

export async function createGestion(payload = {}) {
  const { data } = await api.post("/api/v1/cartera/gestiones/", payload);
  return data;
}
