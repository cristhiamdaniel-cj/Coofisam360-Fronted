import api from "../api";

const toNumber = v => {
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : v;
};

export function mapLlamadaApiToUi(r = {}) {
  return {
    id: r.id ?? `${r.numero_credito || ""}-${r.numero_identificacion || ""}`,
    agencia: r.agencia || "",
    numeroCredito: r.numero_credito || "",
    lineaCredito: r.linea_credito || "",
    numeroIdentificacion: r.numero_identificacion || "",
    nombreAsociado: r.nombre_asociado || "",
    saldoCapital: toNumber(r.saldo_capital_raw),
    diasMora: toNumber(r.dias_mora_raw),
    periodicidadCapital: r.periodicidad_capital || "",
    tipoGarantia: r.tipo_garantia || "",
    celular: r.celular || "",
    estado: r.estado || "",
    gestor: r.gestor || "",
    fechaGestion: r.fecha_gestion_raw || "",
    fechaAcuerdo: r.fecha_acuerdo_raw || "",
    gestionTitular: r.gestion_titular || "",
    gestionCodeudor: r.gestion_codeudor || "",
    novedadGestion: r.novedad_gestion || "",
    programarVisita: r.programar_visita || "",
    gestorApoya: r.gestor_apoya || "",
    calificacion: r.calificacion || "",
    fechaCorte: r.fecha_corte || "",
  };
}

export async function listAsignacionLlamadas(params = {}) {
  const { data } = await api.get("/api/v1/cartera/asignacion-llamadas/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapLlamadaApiToUi);
}

export async function createAsignacionLlamada(payload = {}) {
  const { data } = await api.post("/api/v1/cartera/asignacion-llamadas/", payload);
  return data;
}
