import {
  listControlDisciplinario as listRaw,
  getControlDisciplinarioBy as getByRaw,
  saveControlDisciplinario as saveRaw,
} from "../carpeta-disciplinario/talentDisciplineService";

export async function listControlRows(params = {}) {
  const raw = await listRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapApiToUi);
}

export async function getControlRowsBy(params = {}) {
  const raw = await getByRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapApiToUi);
}

export async function saveControlRow(uiRow = {}) {
  const body = mapUiToApi(uiRow);
  return await saveRaw(body);
}

export function mapApiToUi(a = {}) {
  return {
    TRABAJADOR: str(a.trabajador),
    OFICINA: str(a.oficina_nombre),
    CARGO: str(a.cargo_nombre),
    ANTIGÜEDAD: str(a.antiguedad),

    MOTIVO: str(a.motivo),
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: fmtDate(a.fecha_hechos),
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: fmtDate(a.fecha_conocimiento),
    FECHA_NOTIFICACIÓN: fmtDate(a.fecha_notificacion),

    Inicio_de_proceso_x_Día: num(a.inicio_proceso_dias),

    POSIBLE_SANCION: str(a.posible_sancion),
    GRAVEDAD_NOTIFICADA: str(a.gravedad_notificada),

    FECHA_DESCARGOS: fmtDate(a.fecha_descargos),
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: fmtDate(a.fecha_decision_1),
    GRAVEDAD_PRIMERA_INSTANCIA: str(a.gravedad_1),
    SANCION_PRIMERA_INSTANCIA: str(a.sancion_1),
    Duracion_Proceso_Inicial: num(a.duracion_inicial_dias),

    RECURSO: str(a.recurso),
    FECHA_INTERPOSICION_RECURSO: fmtDate(a.fecha_interposicion_recurso),
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: fmtDate(a.fecha_decision_recurso),
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: str(a.decision_recurso),
    Duración_Proceso_x_1_Instancia: num(a.duracion_1inst_dias),

    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: str(a.decision_recurso_2inst),
    GRAVEDAD_SEGUNDA_INSTANCIA: str(a.gravedad_2),
    SANCION_SEGUNDA_INSTANCIA: str(a.sancion_2),
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: fmtDate(a.fecha_decision_2),
    Duración_Proceso_x_2_Instancia: num(a.duracion_2inst_dias),

    TIEMPO_DE_SUSPENSION: str(a.tiempo_suspension),
    ETAPA_DEL_PROCESO: str(a.etapa_proceso),
    ESTADO_DEL_EMPLEADO: str(a.estado_empleado),

    Diferencia_x_Día: num(a.diferencia_dias),
    Total_Vinculación_x_Año_y_Día: str(a.total_vinculacion),
    Tipo_de_Impacto: str(a.tipo_impacto),
    Duración_total_del_proceso: num(
      a.duracion_total_del_proceso ?? a.duracion_total_proceso
    ),
  };
}

export function mapUiToApi(u = {}) {
  return {
    trabajador: str(u.TRABAJADOR),
    oficina: str(u.OFICINA),
    cargo: str(u.CARGO),
    antiguedad: str(u.ANTIGÜEDAD ?? u.ANTIGUEDAD),

    motivo: str(u.MOTIVO),
    fecha_hechos: dateToIso(u.FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS),
    fecha_conocimiento: dateToIso(u.FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS),
    fecha_notificacion: dateToIso(u.FECHA_NOTIFICACIÓN),

    inicio_proceso_dias: num(u.Inicio_de_proceso_x_Día),

    posible_sancion: str(u.POSIBLE_SANCION),
    gravedad_notificada: str(u.GRAVEDAD_NOTIFICADA),

    fecha_descargos: dateToIso(u.FECHA_DESCARGOS),
    fecha_decision_1inst: dateToIso(u.FECHA_DESICIÓN_PRIMERA_INSTANCIA),
    gravedad_1inst: str(u.GRAVEDAD_PRIMERA_INSTANCIA),
    sancion_1inst: str(u.SANCION_PRIMERA_INSTANCIA),
    duracion_inicial_dias: num(u.Duracion_Proceso_Inicial),

    recurso: str(u.RECURSO),
    fecha_interposicion_recurso: dateToIso(u.FECHA_INTERPOSICION_RECURSO),
    fecha_decision_recurso_1inst: dateToIso(
      u.FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA
    ),
    decision_recurso_1inst: str(u.DECISIÓN_RECURSO_PRIMERA_INSTANCIA),
    duracion_1inst_dias: num(u.Duración_Proceso_x_1_Instancia),
    decision_recurso_2inst: str(u.DECISIÓN_RECURSO_SEGUNDA_INSTANCIA),
    gravedad_2inst: str(u.GRAVEDAD_SEGUNDA_INSTANCIA),
    sancion_2inst: str(u.SANCION_SEGUNDA_INSTANCIA),
    fecha_decision_2inst: dateToIso(u.FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA),
    duracion_2inst_dias: num(u.Duración_Proceso_x_2_Instancia),

    tiempo_suspension: str(u.TIEMPO_DE_SUSPENSION),
    etapa_proceso: str(u.ETAPA_DEL_PROCESO),
    estado_empleado: str(u.ESTADO_DEL_EMPLEADO),

    diferencia_dias: num(u.Diferencia_x_Día),
    total_vinculacion: str(u.Total_Vinculación_x_Año_y_Día),
    tipo_impacto: str(u.Tipo_de_Impacto),
    duracion_total_proceso: num(u.Duración_total_del_proceso),
  };
}

function str(v) {
  return (v ?? "").toString();
}

function num(v) {
  if (v == null || v === "") return 0;
  const n = Number(
    String(v)
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.-]/g, "")
  );
  return Number.isFinite(n) ? n : 0;
}

function fmtDate(v) {
  if (!v) return "";
  if (v instanceof Date && !isNaN(v)) return toDdMmYyyy(v);
  if (typeof v === "string") {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return v;
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      const [yyyy, mm, dd] = v.split("-");
      return `${dd}/${mm}/${yyyy}`;
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(v)) {
      const [mm, dd, yyyy] = v.split("-");
      return `${dd}/${mm}/${yyyy}`;
    }
  }
  const d = new Date(v);
  return isNaN(d) ? String(v) : toDdMmYyyy(d);
}

function dateToIso(v) {
  if (!v) return null;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [dd, mm, yyyy] = v.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  if (/^\d{2}-\d{2}-\d{4}$/.test(v)) {
    const [mm, dd, yyyy] = v.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  const d = new Date(v);
  if (isNaN(d)) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toDdMmYyyy(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
