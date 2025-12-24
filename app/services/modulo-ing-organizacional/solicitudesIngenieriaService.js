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

export function mapSolicitudApiToUi(r = {}) {
  return {
    id: r.id,
    radicado: r.radicado || "",
    mes: r.mes || "",
    gestion: r.gestion || "",
    descripcionSolicitud: r.descripcion || "",
    avance: r.avance || "",
    estado: r.estado || "",
    creadoPor: r.creado_por || "",
    tipoSolicitud: r.tipo_solicitud || "",
    asignadoA: r.asignado_a || "",
    fechaSolicitud: formatDate(r.fecha_solicitud),
    enCurso: formatDate(r.fecha_en_curso),
    revision: formatDate(r.fecha_revision),
    enAjustes: formatDate(r.fecha_en_ajustes),
    enAprobacion: formatDate(r.fecha_en_aprobacion),
    completado: formatDate(r.fecha_completado),
    adjunto: r.tiene_doc_adjunto === true ? "Si" : r.tiene_doc_adjunto === false ? "No" : "",
    columna1: "",
  };
}

export async function listSolicitudesIngenieria(params = {}) {
  const { data } = await api.get("/api/v1/ing-org/solicitudes/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapSolicitudApiToUi);
}

export async function createSolicitudIngenieria(payload = {}) {
  const { data } = await api.post("/api/v1/ing-org/solicitudes/", payload);
  return data;
}
