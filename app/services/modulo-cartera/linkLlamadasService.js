import api from "../api";

const toNumber = v => {
  const n = Number(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : v || "";
};

export function mapLinkLlamadaApiToUi(r = {}) {
  return {
    id: r.id ?? `${r.numero_credito || ""}-${r.numero_identificacion || ""}`,
    agencia: r.agencia || "",
    usuarioGestor: r.gestor || "",
    numeroIdentificacion: r.numero_identificacion || "",
    nombreAsociado: r.nombre_asociado || "",
    lineaCredito: r.linea_credito || "",
    numeroCredito: r.numero_credito || "",
    saldoCapital: toNumber(r.saldo_capital_raw),
    periodicidadCapital: r.periodicidad_capital || "",
    diasMora: toNumber(r.dias_mora_raw),
    calificacionArrastre: r.calificacion || "",
    fechaCorte: r.fecha_corte || "",
  };
}

export async function listLinkLlamadas(params = {}) {
  const { data } = await api.get("/api/v1/cartera/link-llamadas/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapLinkLlamadaApiToUi);
}

export async function createLinkLlamada(payload = {}) {
  const { data } = await api.post("/api/v1/cartera/link-llamadas/", payload);
  return data;
}
