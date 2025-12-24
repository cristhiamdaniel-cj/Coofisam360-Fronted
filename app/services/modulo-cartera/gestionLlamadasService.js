import api from "../api";

const toNumber = v => {
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : v;
};

export function mapGestionApiToUi(r = {}) {
  const fecha = r.fecha_corte || "";
  const parts = fecha ? String(fecha).split("-") : [];
  const year = parts[0];
  const monthNum = parts[1] ? Number(parts[1]) : null;
  const meses = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];
  const mesNombre = monthNum ? meses[Math.max(1, monthNum) - 1] : "";

  return {
    id: r.id,
    mes: mesNombre,
    año: year,
    codigoOficina: "", // no disponible en la tabla
    oficina: r.oficina || "",
    llamadasAsignadas: toNumber(r.llamadas_asignadas),
    obligacionesAlDiaLlamadas: toNumber(r.obligaciones_al_dia_llamadas),
    llamadasAsignadasAlDia: "", // no disponible
    gestionesEfectuadasLlamadas: "", // no disponible
    cumplimientoLlamadas: "", // no disponible
    visitasAsignadas: "", // no disponible
    obligacionesAlDiaVisitas: "", // no disponible
    visitasAsignadasAlDia: "", // no disponible
    gestionesEfectuadasVisitas: "", // no disponible
    cumplimientoVisitas: "", // no disponible
    gestor: r.gestor || "",
    fechaCorte: fecha,
  };
}

export async function listGestionLlamadas(params = {}) {
  const { data } = await api.get("/api/v1/cartera/gestion-llamadas/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapGestionApiToUi);
}

export async function createGestionLlamada(payload = {}) {
  const body = {
    fecha_corte: payload.fecha_corte,
    oficina: payload.oficina,
    gestor: payload.gestor,
    llamadas_asignadas: payload.llamadas_asignadas,
    obligaciones_al_dia_llamadas: payload.obligaciones_al_dia_llamadas,
  };
  const { data } = await api.post("/api/v1/cartera/gestion-llamadas/", body);
  return data;
}
