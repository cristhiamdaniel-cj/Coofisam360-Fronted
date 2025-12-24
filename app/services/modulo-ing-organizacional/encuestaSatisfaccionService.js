import api from "../api";

const formatDateTime = iso => {
  if (!iso) return "";
  // Keep as ISO string; the UI will display raw
  return iso;
};

export function mapEncuestaApiToUi(r = {}) {
  return {
    id: r.id,
    horaInicio: formatDateTime(r.fecha_inicio),
    horaFinalizacion: formatDateTime(r.fecha_fin),
    correoElectronico: r.correo_electronico || "",
    nombre: r.nombre || "",
    oficinaArea: r.oficina_area || "",
    calidadDocumentos: r.calidad_documentos ?? "",
    tiempoSuficiente: r.tiempo_creacion_texto || "",
    claridadComunicacion: r.claridad_comunicacion ?? "",
    abiertaAjustes: r.apertura_ajustes_texto || "",
    velocidadRespuesta: r.rapidez_respuesta ?? "",
    satisfaccionGeneral: r.satisfaccion_general ?? "",
    mejoras: r.comentario_mejora || "",
  };
}

export async function listEncuestaSatisfaccion(params = {}) {
  const { data } = await api.get("/api/v1/ing-org/encuesta-satisfaccion/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapEncuestaApiToUi);
}

export async function createEncuesta(payload = {}) {
  const { data } = await api.post("/api/v1/ing-org/encuesta-satisfaccion/", payload);
  return data;
}
