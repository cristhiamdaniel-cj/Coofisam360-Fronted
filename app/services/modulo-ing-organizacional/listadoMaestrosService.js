import api from "../api";

const formatDate = iso => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${year}-${month}-${day}`;
};

export function mapDocumentoApiToUi(r = {}) {
  return {
    id: r.id,
    estrategias: r.estrategia || "",
    gestion: r.gestion || "",
    tipoDocumento: r.tipo_documento || "",
    procesos: r.proceso || "",
    nombreDocumento: r.nombre_documento || "",
    codigo: r.codigo || "",
    ultimaActualizacion: formatDate(r.fecha_ultima_actualizacion),
    version: r.version ?? "",
    actualizado: r.porcentaje_actualizado ?? r.estado_actualizacion ?? "",
    conservacion: r.tipo_conservacion || "",
    intranet: r.publicado_intranet === true ? "Si" : r.publicado_intranet === false ? "No" : "",
  };
}

export async function listDocumentos(params = {}) {
  const { data } = await api.get("/api/v1/ing-org/documentos/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapDocumentoApiToUi);
}

export async function createDocumento(payload = {}) {
  const { data } = await api.post("/api/v1/ing-org/documentos/", payload);
  return data;
}
