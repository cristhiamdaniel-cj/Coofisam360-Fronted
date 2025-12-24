import api from "../api";

const toNumber = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function mapCampaniaApiToUi(r = {}) {
  return {
    id: r.id ?? `${r.campana_codigo || ""}-${r.oficina_id || ""}`,
    campana: r.campana_codigo || r.campania_label || "",
    anio: r.anio,
    oficinaId: r.oficina_id,
    segmento: r.segmento || "",
    totalValor: toNumber(r.total_valor),
    totalCantidad: toNumber(r.total_cantidad),
    cchValor: toNumber(r.cch_valor),
    cchCantidad: toNumber(r.cch_cantidad),
    cVivValor: toNumber(r.c_viv_valor),
    cVivCantidad: toNumber(r.c_viv_cantidad),
    cTcValor: toNumber(r.c_tc_valor),
    cTcCantidad: toNumber(r.c_tc_cantidad),
    cLibciggValor: toNumber(r.c_libcigg_valor),
    cLibciggCantidad: toNumber(r.c_libcigg_cantidad),
    cMontoValor: toNumber(r.c_monto_valor),
    cMontoCantidad: toNumber(r.c_monto_cantidad),
    cCcartValor: toNumber(r.c_ccart_valor),
    cCcartCantidad: toNumber(r.c_ccart_cantidad),
    fngEmp255Valor: toNumber(r.fng_emp255_valor),
    fngEmp255Cantidad: toNumber(r.fng_emp255_cantidad),
    fngEmp285Valor: toNumber(r.fng_emp285_valor),
    fngEmp285Cantidad: toNumber(r.fng_emp285_cantidad),
    fechaCorte: r.fecha_corte || "",
  };
}

export async function listCampaniasOficina(params = {}) {
  const { data } = await api.get("/api/v1/credito/campanias-oficina/", { params });
  const items = data?.items ?? data ?? [];
  return items.map(mapCampaniaApiToUi);
}

export async function createCampaniaOficina(payload = {}) {
  const { data } = await api.post("/api/v1/credito/campanias-oficina/", payload);
  return data;
}
