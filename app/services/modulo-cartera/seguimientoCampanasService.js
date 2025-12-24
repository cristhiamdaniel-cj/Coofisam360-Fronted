import api from "../api";

const toNumber = v => {
  const n = Number(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : v || "";
};

export function mapSeguimientoApiToUi(r = {}) {
  return {
    id: r.id,
    oficina: r.oficina || "",
    pagareVirtualCop: r.pagare_virtualcop_raw || "",
    pagareOpa: r.pagare_opa_raw || "",
    cedula: r.cedula_raw || "",
    nombre: r.nombre || "",
    saldoCapital: toNumber(r.saldo_capital_raw),
    capitalCondonado: toNumber(r.capital_condonado_raw),
    estadoObligacion: r.estado_obligacion || "",
    novedad: r.novedad || "",
    fecha: r.fecha_raw || "",
    gestor: r.gestor || "",
    honorarios: toNumber(r.honorarios_raw),
    abogado: r.abogado || "",
    fuenteArchivo: r.fuente_archivo || "",
    fechaCarga: r.fecha_carga || "",
  };
}

export async function listSeguimientoCampanas(params = {}) {
  const { data } = await api.get("/api/v1/cartera/seguimiento-campanas/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapSeguimientoApiToUi);
}

export async function createSeguimientoCampana(payload = {}) {
  const { data } = await api.post("/api/v1/cartera/seguimiento-campanas/", payload);
  return data;
}
