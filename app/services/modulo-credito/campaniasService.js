import api from "../api";

const toNumber = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function mapCampaniaApiToUi(r = {}) {
  return {
    id: r.id ?? `${r.campana_codigo || ""}-${r.oficina_id || ""}`,
    campana: r.campana_codigo || "",
    oficinaId: r.oficina_id || "",
    anio: r.anio || "",
    valorDesembolsos: toNumber(r.valor_desembolsos),
    nOperaciones: toNumber(r.n_operaciones),
    recursosProgramados: toNumber(r.recursos_programados),
    recursosDisponibles: toNumber(r.recursos_disponibles),
    pctAvance: Number.isFinite(Number(r.pct_avance)) ? Number(r.pct_avance) : null,
    estado: r.estado || "",
    gapMetaValor: toNumber(r.gap_meta_valor),
    gapMetaPct: Number.isFinite(Number(r.gap_meta_pct)) ? Number(r.gap_meta_pct) : null,
    fechaCorte: r.fecha_corte || "",
    codigoOp: r.codigo_op || "",
  };
}

export async function listCampanias(params = {}) {
  const { data } = await api.get("/api/v1/credito/campanias/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapCampaniaApiToUi);
}

export async function createCampania(payload = {}) {
  const { data } = await api.post("/api/v1/credito/campanias/", payload);
  return data;
}
