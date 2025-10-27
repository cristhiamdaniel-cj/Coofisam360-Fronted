import {
  listFormaciones as listFormacionesRaw,
  getFormacion as getFormacionRaw,
  saveFormacion as saveFormacionRaw,
  updateFormacion as updateFormacionRaw,
} from "./talentTrainerService";
import { toMonthNumber, num } from "./talentHelpers";

export async function listFormacionQuota(params = {}) {
  const raw = await listFormacionesRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(mapFromApi);
}
export async function getFormacionQuota(id, params = {}) {
  const r = await getFormacionRaw(id, params);
  return r ? mapFromApi(r) : null;
}
export async function saveFormacionQuota(payload) {
  return await saveFormacionRaw(mapToApi(payload));
}
export async function updateFormacionQuota(payload) {
  return await updateFormacionRaw(mapToApi(payload));
}

function mapFromApi(r) {
  // Extraer año y mes del periodo
  const periodo = new Date(r.periodo);
  const anio = periodo.getFullYear();
  const mes = periodo.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
  
  return {
    id: r.id, // Usar el ID autoincremental del backend
    Año: anio,
    Mes: mes,
    CantidadTrabajadores: num(r.cant_trab_participaron),
    Oficina: r.oficina_dependencia ?? "",
    Puesto: r.rol ?? "ADMINISTRATIVO", // Valor por defecto si está vacío
    TemaFormacion: r.tema_formacion ?? "",
    TipoFormacion: r.tipo_formacion ?? "",
    TotalParticipantes: num(r.total_participantes),
    TotalTrabajadores: num(r.total_trabajadores), // Campo correcto de la tabla snapshot
    PorcentajeParticipacion: num(r.pct_participacion) || 0,
    NumeroVecesFormado: num(r.veces_formado),
    Calificacion: num(r.calificacion),
    Grupo: num(r.grupo),
    // Campos adicionales para el backend
    periodo: r.periodo,
    oficina_dependencia: r.oficina_dependencia,
    rol_norm: r.rol_norm,
    tema_formacion: r.tema_formacion,
    tipo_formacion: r.tipo_formacion,
  };
}

function mapToApi(r) {
  // Crear el periodo como fecha (primer día del mes)
  const anio = num(r.Año);
  const mes = toMonthNumber(r.Mes);
  
  // Validar que anio y mes sean válidos
  if (!anio || !mes || isNaN(anio) || isNaN(mes) || anio < 1900 || anio > 2100 || mes < 1 || mes > 12) {
    console.error("Valores inválidos para crear fecha:", { anio, mes, Año: r.Año, Mes: r.Mes });
    throw new Error(`Valores inválidos para crear fecha: Año=${r.Año}, Mes=${r.Mes}`);
  }
  
  const periodo = new Date(anio, mes - 1, 1).toISOString().split('T')[0];
  
  return {
    // Incluir id solo si es un ID numérico (no para registros nuevos)
    ...(r.id && !r.id.toString().startsWith('new_') && { id: parseInt(r.id) }),
    periodo: periodo,
    oficina_dependencia: r.Oficina ?? "",
    rol_norm: r.Puesto ?? "ADMINISTRATIVO", // Valor por defecto si está vacío
    tema_formacion: r.TemaFormacion ?? "",
    tipo_formacion: r.TipoFormacion ?? "",
    cant_trab_participaron: num(r.CantidadTrabajadores),
    total_participantes: num(r.TotalParticipantes),
    total_trabajadores: num(r.TotalTrabajadores), // Agregar el total de trabajadores
    pct_participacion: num(r.PorcentajeParticipacion), // Agregar el porcentaje calculado
    veces_formado: num(r.NumeroVecesFormado),
    calificacion: num(r.Calificacion),
    // grupo no se envía porque no existe en fyc_formacion_snapshot
  };
}
