import api from "../api";

const toNumber = v => {
  const n = Number(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : v || "";
};

export function mapLinkVisitaApiToUi(r = {}) {
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
    // La tabla no tiene calificacion; usamos dias_actualizados si llega.
    calificacionArrastre: r.dias_actualizados || "",
    fechaCorte: r.fecha_corte || "",
  };
}

export async function listLinkVisitas(params = {}) {
  const { data } = await api.get("/api/v1/cartera/link-visitas/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapLinkVisitaApiToUi);
}

export async function createLinkVisita(payload = {}) {
  const { data } = await api.post("/api/v1/cartera/link-visitas/", payload);
  return data;
}
