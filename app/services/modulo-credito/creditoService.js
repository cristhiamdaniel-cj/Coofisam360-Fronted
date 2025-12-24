import api from "../api";

const toNumber = value => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const toPercent = value => {
  const num = Number(value);
  return Number.isFinite(num) ? Number(num) : null;
};

export function mapRadicacionApiToUi(r = {}) {
  const year = r.anio ?? r.year;
  const month = r.mes ?? r.month;
  const periodoFromDates = r.periodo_ini ? String(r.periodo_ini).slice(0, 7) : "";
  const periodo =
    r.periodo ||
    (year && month ? `${year}-${String(month).padStart(2, "0")}` : null) ||
    periodoFromDates ||
    "";
  const safeId = r.id || periodo || `${year || "0"}-${month || "00"}`;

  return {
    id: safeId,
    periodo,
    oficinaId: r.oficina_id,
    radicadosValor: toNumber(r.rad_valor ?? r.radicados_valor),
    radicadosCantidad: toNumber(r.rad_cantidad ?? r.radicados_cantidad),
    radicadosPorcentaje: toPercent(r.rad_pct ?? r.radicados_pct),
    aprobadosValor: toNumber(r.apr_valor ?? r.aprobados_valor),
    aprobadosCantidad: toNumber(r.apr_cantidad ?? r.aprobados_cantidad),
    aprobadosPorcentaje: toPercent(r.apr_pct ?? r.aprobados_pct),
    negadosValor: toNumber(r.neg_valor ?? r.negados_valor),
    negadosCantidad: toNumber(r.neg_cantidad ?? r.negados_cantidad),
    negadosPorcentaje: toPercent(r.neg_pct ?? r.negados_pct),
    aplazadosValor: toNumber(r.apl_valor ?? r.aplazados_valor),
    aplazadosCantidad: toNumber(r.apl_cantidad ?? r.aplazados_cantidad),
    aplazadosPorcentaje: toPercent(r.apl_pct ?? r.aplazados_pct),
    sinDecisionValor: toNumber(r.sde_valor ?? r.sin_decision_valor),
    sinDecisionCantidad: toNumber(r.sde_cantidad ?? r.sin_decision_cantidad),
    sinDecisionPorcentaje: toPercent(r.sde_pct ?? r.sin_decision_pct),
    totalValorPeriodo: toNumber(r.total_valor_periodo ?? r.total_valor),
    totalCantidadPeriodo: toNumber(r.total_cant_periodo ?? r.total_cantidad),
  };
}

export async function listRadicadosCredito(params = {}) {
  const { data } = await api.get("/api/v1/credito/radicaciones/", { params });
  const rows = data?.items ?? data ?? [];
  return rows.map(mapRadicacionApiToUi);
}

export async function createRadicacion(payload = {}) {
  const { data } = await api.post("/api/v1/credito/radicaciones/", payload);
  return data;
}
