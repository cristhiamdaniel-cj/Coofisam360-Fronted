import {
  listControlDisciplinario as listRaw,
  getControlDisciplinarioBy as getByRaw,
  saveControlDisciplinario as saveRaw,
  listEmpleados as listEmpleadosRaw,
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

export async function listEmpleadosByOficina(oficinaNombre, cargoNombre) {
  const params = {};
  if (oficinaNombre) params.oficina = String(oficinaNombre).toUpperCase();
  if (cargoNombre) params.cargo = String(cargoNombre).toUpperCase();
  const rows = await listEmpleadosRaw(params);
  return rows.map(r => ({
    id: r.id ?? r.empleado_id,
    nombre: r.nombre,
    oficina_id: r.oficina_id,
    oficina_nombre: r.oficina_nombre,
    cargo_id: r.cargo_id,
    cargo_nombre: r.cargo_nombre,
    fecha_ingreso: r.fecha_ingreso,
    estado_buk: r.estado_buk,
  }));
}

export function mapApiToUi(a = {}) {
  // Mapear nombres reales del backend → claves que usa la tabla
  // Backend (talento_cultura.control_disciplinario) expone campos *_nombre y fechas *_1/_2
  const totalVincDias = num(a.total_vinculacion_dias);
  const dur1 = num(a.duracion_instancia_1);
  const dur2 = num(a.duracion_instancia_2);
  const totalProc = dur1 + dur2;
  const notifDate = a.fecha_notificacion || a.fecha_hechos || a.fecha_conocimiento;
  const notif = notifDate ? new Date(notifDate) : undefined;
  const anio = notif && !isNaN(notif) ? notif.getFullYear() : a.anio ?? undefined;
  const mes = notif && !isNaN(notif) ? notif.getMonth() + 1 : undefined;

  return {
    // Campos usados por el UI (búsqueda y selects)
    trabajador: str(a.trabajador_nombre ?? a.trabajador),
    oficina: str(a.oficina_nombre ?? a.oficina),

    // Resto de columnas (algunas en mayúsculas como las usa la tabla)
    CARGO: str(a.cargo_nombre ?? a.cargo),
    ANTIGÜEDAD: fmtDate(a.antiguedad),
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
    // No existe explícitamente en backend; mostramos duración de instancia 1 si está disponible
    Duracion_Proceso_Inicial: dur1,
    RECURSO: str(a.recurso),
    FECHA_INTERPOSICION_RECURSO: fmtDate(a.fecha_interposicion_recurso),
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: fmtDate(a.fecha_decision_recurso),
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: str(a.decision_recurso),
    Duración_Proceso_x_1_Instancia: dur1,
    // Segunda instancia
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: str(a.decision_recurso_2) || "",
    GRAVEDAD_SEGUNDA_INSTANCIA: str(a.gravedad_2),
    SANCION_SEGUNDA_INSTANCIA: str(a.sancion_2),
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: fmtDate(a.fecha_decision_2),
    Duración_Proceso_x_2_Instancia: dur2,
    // Otros
    TIEMPO_DE_SUSPENSION: str(a.tiempo_suspension),
    ETAPA_DEL_PROCESO: str(a.etapa_proceso),
    ESTADO_DEL_EMPLEADO: str(a.estado_empleado),
    Diferencia_x_Día: num(a.diferencia_dias),
    Total_Vinculación_x_Año_y_Día: totalVincDias
      ? formatYearsOneDecimal(totalVincDias)
      : "",
    Tipo_de_Impacto: str(a.tipo_impacto),
    Duración_total_del_proceso: totalProc,

    // Auxiliares para filtros (no visibles)
    anio: anio,
    mes: mes,
  };
}

export function mapUiToApi(u = {}) {
  // Convertir claves del UI → nombres aceptados por el backend
  const antig = u.ANTIGÜEDAD ?? u.ANTIGUEDAD;
  const year = extractYear(
    u.FECHA_NOTIFICACIÓN ||
      u.FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS ||
      u.FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS
  );
  const payload = {
    anio: year,
    trabajador_nombre: str(u.trabajador ?? u.TRABAJADOR),
    oficina_nombre: str(u.oficina ?? u.OFICINA),
    cargo_nombre: str(u.CARGO ?? u.cargo),
    antiguedad: dateToIso(antig),

    motivo: str(u.MOTIVO),
    fecha_hechos: dateToIso(u.FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS),
    fecha_conocimiento: dateToIso(u.FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS),
    fecha_notificacion: dateToIso(u.FECHA_NOTIFICACIÓN),

    inicio_proceso_dias: num(u.Inicio_de_proceso_x_Día),

    posible_sancion: str(u.POSIBLE_SANCION),
    gravedad_notificada: str(u.GRAVEDAD_NOTIFICADA),

    fecha_descargos: dateToIso(u.FECHA_DESCARGOS),
    fecha_decision_1: dateToIso(u.FECHA_DESICIÓN_PRIMERA_INSTANCIA),
    gravedad_1: str(u.GRAVEDAD_PRIMERA_INSTANCIA),
    sancion_1: str(u.SANCION_PRIMERA_INSTANCIA),

    recurso: str(u.RECURSO),
    fecha_interposicion_recurso: dateToIso(u.FECHA_INTERPOSICION_RECURSO),
    fecha_decision_recurso: dateToIso(
      u.FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA
    ),
    decision_recurso: str(u.DECISIÓN_RECURSO_PRIMERA_INSTANCIA),

    gravedad_2: str(u.GRAVEDAD_SEGUNDA_INSTANCIA),
    sancion_2: str(u.SANCION_SEGUNDA_INSTANCIA),
    fecha_decision_2: dateToIso(u.FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA),

    tiempo_suspension: str(u.TIEMPO_DE_SUSPENSION),
    etapa_proceso: str(u.ETAPA_DEL_PROCESO),
    estado_empleado: str(u.ESTADO_DEL_EMPLEADO),

    tipo_impacto: str(u.Tipo_de_Impacto),
  };
  // Derivar 'anio' del conjunto de fechas cuando sea posible
  const anio =
    yearFrom(u.FECHA_NOTIFICACIÓN) ||
    yearFrom(u.FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS) ||
    yearFrom(u.FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS);
  if (anio) payload.anio = anio;
  // Limpiar null/undefined
  return Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  );
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

function yearFrom(v) {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v)) return v.getFullYear();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return Number(v.slice(6, 10));
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return Number(v.slice(0, 4));
  if (/^\d{2}-\d{2}-\d{4}$/.test(v)) return Number(v.slice(6, 10));
  const d = new Date(v);
  return isNaN(d) ? null : d.getFullYear();
}

function toDdMmYyyy(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

function formatYearsOneDecimal(days) {
  if (!days || days <= 0) return "";
  const years = days / 365;
  // Un decimal y coma como separador
  return years.toFixed(1).replace(".", ",");
}

function extractYear(v) {
  const iso = dateToIso(v);
  if (!iso) return undefined;
  const m = /^([0-9]{4})-/.exec(iso);
  return m ? Number(m[1]) : undefined;
}
