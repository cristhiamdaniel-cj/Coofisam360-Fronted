"use client";
import { useEffect, useState } from "react";
import {
  listControlRows,
  saveControlRow,
  deleteControlRow,
  listEmpleadosByOficina,
} from "../../../services/modulo-talento/carpeta-disciplinario/controlDiscipline";
import { IoSearch } from "react-icons/io5";
import { FaRegSave, FaFileDownload, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { TbUpload } from "react-icons/tb";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const initialRows = [
  {
    trabajador: "CARLOS FERNANDO GONZALEZ",
    oficina: "DIRECCIÓN GENERAL",
    CARGO: "SUBGERENTE COMERCIAL",
    ANTIGÜEDAD: "02/12/20",
    MOTIVO: "INCUMPLIMIENTO MANUAL DE FUNCIONES",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "26/11/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "13/01/2025",
    FECHA_NOTIFICACIÓN: "20/01/2025",
    Inicio_de_proceso_x_Día: "7",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "23/01/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "19/02/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "GRAVE",
    SANCION_PRIMERA_INSTANCIA: "SUSPENSION",
    Duracion_Proceso_Inicial: "30",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "4 DÍAS",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "1455",
    Total_Vinculación_x_Año_y_Día: "4,0",
    Tipo_de_Impacto: "Operacional",
    Duración_total_del_proceso: "30",
  },
  {
    trabajador: "FRANCY LUPITA ORTIZ MENDOZA",
    oficina: "NEIVA",
    CARGO: "ASESOR MICROFINANZAS URBANO",
    ANTIGÜEDAD: "04/09/23",
    MOTIVO: "INCUMPLIMIENTO JORNADA LABORAL",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "04/01/2025",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "08/01/2025",
    FECHA_NOTIFICACIÓN: "27/01/2025",
    Inicio_de_proceso_x_Día: "19",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "03/02/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "",
    SANCION_PRIMERA_INSTANCIA: "",
    Duracion_Proceso_Inicial: "7",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "RETIRADO",
    Diferencia_x_Día: "488",
    Total_Vinculación_x_Año_y_Día: "1,4",
    Tipo_de_Impacto: "Operacional",
    Duración_total_del_proceso: "7",
  },
  {
    trabajador: "SEIDY MARCELA ROBAYO CAMACHO",
    oficina: "GUADALUPE",
    CARGO: "ASESOR COMERCIAL",
    ANTIGÜEDAD: "04/04/22",
    MOTIVO: "INCUMPLIMIENTO JORNADA LABORAL",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "07/01/2025",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "08/01/2025",
    FECHA_NOTIFICACIÓN: "09/01/2025",
    Inicio_de_proceso_x_Día: "1",
    POSIBLE_SANCION: "LLAMADO DE ATENCIÓN",
    GRAVEDAD_NOTIFICADA: "LEVE",
    FECHA_DESCARGOS: "13/01/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "17/01/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCION",
    Duracion_Proceso_Inicial: "8",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "1009",
    Total_Vinculación_x_Año_y_Día: "2,8",
    Tipo_de_Impacto: "Operacional",
    Duración_total_del_proceso: "8",
  },
  {
    trabajador: "JOSE ALEXIS PEÑA VALENCIA",
    oficina: "GARZON",
    CARGO: "JEFE DE OPERACIONES",
    ANTIGÜEDAD: "01/04/18",
    MOTIVO: "OMISIÓN CONTROL DE DESEMBOLSO",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "18/01/2025",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "13/02/2025",
    FECHA_NOTIFICACIÓN: "05/03/2025",
    Inicio_de_proceso_x_Día: "20",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "06/03/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "31/03/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "GRAVE",
    SANCION_PRIMERA_INSTANCIA: "SUSPENSION",
    Duracion_Proceso_Inicial: "26",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "6 DÍAS",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "2484",
    Total_Vinculación_x_Año_y_Día: "6,9",
    Tipo_de_Impacto: "Económico",
    Duración_total_del_proceso: "26",
  },
  {
    trabajador: "CLAUDIA PATRICIA MONTES RODRIGUEZ",
    oficina: "GARZON",
    CARGO: "ASESOR COMERCIAL",
    ANTIGÜEDAD: "25/07/18",
    MOTIVO: "OMISIÓN CONTROL DE DESEMBOLSO",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "14/08/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "03/03/2025",
    FECHA_NOTIFICACIÓN: "04/04/2025",
    Inicio_de_proceso_x_Día: "32",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "07/04/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "22/04/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCION",
    Duracion_Proceso_Inicial: "18",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "2212",
    Total_Vinculación_x_Año_y_Día: "6,1",
    Tipo_de_Impacto: "Económico",
    Duración_total_del_proceso: "18",
  },
  {
    trabajador: "KAREN DAYANNA CERQUERA CABRERA",
    oficina: "GARZON",
    CARGO: "ASESOR MICROFINANZAS URBANO",
    ANTIGÜEDAD: "11/01/23",
    MOTIVO: "OMISIÓN VALIDACIÓN DE IDENTIDAD",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "07/01/2025",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "24/01/2025",
    FECHA_NOTIFICACIÓN: "04/04/2025",
    Inicio_de_proceso_x_Día: "70",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "07/04/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "22/04/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCION",
    Duracion_Proceso_Inicial: "18",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "727",
    Total_Vinculación_x_Año_y_Día: "2,0",
    Tipo_de_Impacto: "Operacional",
    Duración_total_del_proceso: "18",
  },
  {
    trabajador: "LEIDY YOHANNA GUTIERREZ PERDOMO",
    oficina: "GARZON",
    CARGO: "ASESOR COMERCIAL",
    ANTIGÜEDAD: "04/01/21",
    MOTIVO: "OMISIÓN CONTROL DE DESEMBOLSO",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "14/08/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "25/01/2025",
    FECHA_NOTIFICACIÓN: "04/04/2025",
    Inicio_de_proceso_x_Día: "69",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "08/04/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "22/04/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCION",
    Duracion_Proceso_Inicial: "18",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "1318",
    Total_Vinculación_x_Año_y_Día: "3,7",
    Tipo_de_Impacto: "Económico",
    Duración_total_del_proceso: "18",
  },
  {
    trabajador: "EDNA XIMENA FAJARDO PARRA",
    oficina: "GIGANTE",
    CARGO: "ASESOR COMERCIAL",
    ANTIGÜEDAD: "26/09/22",
    MOTIVO: "OMISIÓN EN VALIDACIÓN DE CONSIGNACIONES BANCARIAS",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "24/08/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "16/09/2024",
    FECHA_NOTIFICACIÓN: "04/04/2025",
    Inicio_de_proceso_x_Día: "200",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "04/04/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "22/04/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCIÓN",
    Duracion_Proceso_Inicial: "18",
    RECURSO: "APELACIÓN",
    FECHA_INTERPOSICION_RECURSO: "25/01/2025",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "CONFIRMA",
    GRAVEDAD_SEGUNDA_INSTANCIA: "LEVE",
    SANCION_SEGUNDA_INSTANCIA: "LLAMADO DE ATENCIÓN",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "29/04/2025",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "698",
    Total_Vinculación_x_Año_y_Día: "1,9",
    Tipo_de_Impacto: "Económico",
    Duración_total_del_proceso: "18",
  },
  {
    trabajador: "CARLOS FERNANDO GONZALEZ",
    oficina: "DIRECCIÓN GENERAL",
    CARGO: "SUBGERENTE COMERCIAL",
    ANTIGÜEDAD: "02/12/20",
    MOTIVO: "CONFLICTO DE INTERES",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "01/10/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "23/10/2024",
    FECHA_NOTIFICACIÓN: "20/01/2025",
    Inicio_de_proceso_x_Día: "89",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "23/01/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "19/02/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "GRAVE",
    SANCION_PRIMERA_INSTANCIA: "SUSPENSION",
    Duracion_Proceso_Inicial: "30",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "4 DÍAS",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "1399",
    Total_Vinculación_x_Año_y_Día: "3,9",
    Tipo_de_Impacto: "Legal",
    Duración_total_del_proceso: "30",
  },
  {
    trabajador: "FRANCY YANIXA JIMENEZ TRUJILLO",
    oficina: "NEIVA",
    CARGO: "ASESOR MICROFINANZAS URBANO",
    ANTIGÜEDAD: "21/02/23",
    MOTIVO: "INDEBIDO PROCESOS DE VINCULACIÓN",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "12/11/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "02/12/2024",
    FECHA_NOTIFICACIÓN: "15/04/2025",
    Inicio_de_proceso_x_Día: "134",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "22/04/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "30/04/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCIÓN",
    Duracion_Proceso_Inicial: "15",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "630",
    Total_Vinculación_x_Año_y_Día: "1,8",
    Tipo_de_Impacto: "Operacional",
    Duración_total_del_proceso: "15",
  },
  {
    trabajador: "MARIA ALEJANDRA MOTTA ESCOBAR",
    oficina: "NEIVA",
    CARGO: "ASESOR COMERCIAL",
    ANTIGÜEDAD: "01/02/13",
    MOTIVO: "INDEBIDO PROCESOS DE VINCULACIÓN",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "02/08/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "02/12/2024",
    FECHA_NOTIFICACIÓN: "04/03/2025",
    Inicio_de_proceso_x_Día: "92",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "07/03/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "15/04/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "",
    SANCION_PRIMERA_INSTANCIA: "EXONERADA",
    Duracion_Proceso_Inicial: "42",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "4200",
    Total_Vinculación_x_Año_y_Día: "11,7",
    Tipo_de_Impacto: "Operacional",
    Duración_total_del_proceso: "42",
  },
  {
    trabajador: "YOLANDA CASTELLANOS CAMARGO",
    oficina: "NEIVA",
    CARGO: "ASESOR COMERCIAL",
    ANTIGÜEDAD: "05/02/15",
    MOTIVO: "INDEBIDO PROCESOS DE VINCULACIÓN",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "06/08/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "02/12/2024",
    FECHA_NOTIFICACIÓN: "04/03/2025",
    Inicio_de_proceso_x_Día: "92",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "07/03/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "29/04/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCIÓN",
    Duracion_Proceso_Inicial: "40",
    RECURSO: "APELACIÓN",
    FECHA_INTERPOSICION_RECURSO: "10/04/2025",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "20/04/2025",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "CONFIRMA",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "3600",
    Total_Vinculación_x_Año_y_Día: "10,0",
    Tipo_de_Impacto: "Operacional",
    Duración_total_del_proceso: "40",
  },
  {
    trabajador: "JOSE PABLO MONTOYA",
    oficina: "GARZON",
    CARGO: "ASESOR MICROFINANZAS RURAL",
    ANTIGÜEDAD: "20/06/18",
    MOTIVO: "OMISIÓN CONTROL DE DESEMBOLSO",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "14/08/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "25/01/2025",
    FECHA_NOTIFICACIÓN: "04/04/2025",
    Inicio_de_proceso_x_Día: "69",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "08/04/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "22/04/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCIÓN",
    Duracion_Proceso_Inicial: "18",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "1318",
    Total_Vinculación_x_Año_y_Día: "3,7",
    Tipo_de_Impacto: "Económico",
    Duración_total_del_proceso: "18",
  },
  {
    trabajador: "LINA MARCELA PÉREZ GARCÍA",
    oficina: "GARZON",
    CARGO: "ASESOR COMERCIAL",
    ANTIGÜEDAD: "10/01/20",
    MOTIVO: "OMISIÓN CONTROL DE DESEMBOLSO",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "14/08/2024",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "25/01/2025",
    FECHA_NOTIFICACIÓN: "04/04/2025",
    Inicio_de_proceso_x_Día: "69",
    POSIBLE_SANCION: "SUSPENSION",
    GRAVEDAD_NOTIFICADA: "GRAVE",
    FECHA_DESCARGOS: "08/04/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "22/04/25",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCIÓN",
    Duracion_Proceso_Inicial: "18",
    RECURSO: "NO INTERPUESTO",
    FECHA_INTERPOSICION_RECURSO: "",
    FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
    Duración_Proceso_x_1_Instancia: "0",
    DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
    GRAVEDAD_SEGUNDA_INSTANCIA: "",
    SANCION_SEGUNDA_INSTANCIA: "",
    FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
    Duración_Proceso_x_2_Instancia: "0",
    TIEMPO_DE_SUSPENSION: "",
    ETAPA_DEL_PROCESO: "TERMINADO",
    ESTADO_DEL_EMPLEADO: "ACTIVO",
    Diferencia_x_Día: "1318",
    Total_Vinculación_x_Año_y_Día: "3,7",
    Tipo_de_Impacto: "Económico",
    Duración_total_del_proceso: "18",
  },
];

export default function GestionesTable() {
  const [rows, setRows] = useState(initialRows);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [editingRows, setEditingRows] = useState({});

  // Opciones para los dropdowns
  const opcionesPosibleSancion = [
    "", "LLAMADO DE ATENCIÓN", "SUSPENSION", "TERMINACIÓN", "NO APLICA"
  ];
  
  const opcionesGravedad = [
    "", "LEVE", "GRAVE", "GRAVISIMA"
  ];

  const toIso = v => {
    if (!v) return "";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
      const [dd, mm, yyyy] = v.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }
    return v;
  };

  const toggleEdit = idx => {
    setEditingRows(prev => ({ ...prev, [idx]: !prev[idx] }));
  };
  const [empleadosCache, setEmpleadosCache] = useState({}); // { OFICINA|CARGO: [empleados] }

  useEffect(() => {
    async function load() {
      try {
        const data = await listControlRows();
        setRows(data);
        //setFilteredRows(data);
        setError("");
        // Nota: evitamos prefetch masivo de empleados para no saturar la BD.
        // Se cargan bajo demanda cuando el usuario edita la fila.
      } catch (e) {
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function ensureEmpleados(oficinaNombre, cargoNombre) {
    const keyOfi = (oficinaNombre || "").toString().toUpperCase();
    const keyCar = (cargoNombre || "").toString().toUpperCase();
    if (!keyOfi) return;
    const cacheKey = `${keyOfi}|${keyCar || '*'}`;
    if (empleadosCache[cacheKey]) return;
    try {
      const lista = await listEmpleadosByOficina(keyOfi, keyCar || undefined);
      setEmpleadosCache(prev => ({ ...prev, [cacheKey]: lista }));
    } catch (e) {
      // silencioso; evitamos romper la UI
    }
  }

  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows
      .filter(r => {
        const matchesSearch =
          !query ||
          (r.oficina || "").toLowerCase().includes(query) ||
          (r.trabajador || "").toLowerCase().includes(query);

        const matchesYear = !selectedYear || r.anio === Number(selectedYear);
        const matchesMonth = !selectedMonth || r.mes === Number(selectedMonth);

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => (Number(a.codigo) || 0) - (Number(b.codigo) || 0));

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  const uniqueYears = [...new Set(rows.map(r => r.anio).filter(Boolean))];
  const uniqueMonths = [...new Set(rows.map(r => r.mes).filter(Boolean))];

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const availableMonths = monthNames
    .map((name, index) => ({ name, number: index + 1 }))
    .filter(m => uniqueMonths.includes(m.number));

  const handleChange = (index, field, value) => {
    setRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });

    setEditedRows(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
    }));
  };

  function formatIsoToDdMmYyyy(v) {
    if (!v) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      const [yyyy, mm, dd] = String(v).split("-");
      return `${dd}/${mm}/${yyyy}`;
    }
    const d = new Date(v);
    if (isNaN(d)) return String(v);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }

  const handleSave = async () => {
    try {
      // Normaliza claves de editedRows a índices de la tabla
      const keys = Object.keys(editedRows || {});
      const indices = Array.from(
        new Set(
          keys
            .map(k => {
              const n = Number(k);
              if (Number.isInteger(n)) return n;
              const pos = rows.findIndex(r => String(r.id) === k);
              return pos;
            })
            .filter(i => i >= 0)
        )
      );
      for (const idx of indices) {
        const finalRow = rows[idx];
        await saveControlRow(finalRow);
      }
      setEditedRows({});
      alert("Cambios guardados correctamente");
    } catch (err) {
      console.error("Error guardando cambios:", err);
      alert("Error al guardar cambios");
    }
  };

  const handleSaveSingle = async (idx) => {
    try {
      const finalRow = rows[idx];
      const result = await saveControlRow(finalRow);
      
      // Marcar como guardado y cerrar edición
      setEditedRows(prev => {
        const newEdited = { ...prev };
        delete newEdited[idx];
        return newEdited;
      });
      setEditingRows(prev => ({ ...prev, [idx]: false }));
      
      alert("Registro guardado correctamente");
    } catch (err) {
      console.error("Error guardando registro:", err);
      alert(`Error al guardar el registro: ${err.message}`);
    }
  };

  const handleDelete = async (id, trabajador, motivo) => {
    if (!id || !/^\d+$/.test(String(id))) {
      alert("No se puede eliminar un registro nuevo o sin ID válido");
      return;
    }
    
    const confirmMessage = `¿Está seguro de eliminar el proceso disciplinario de ${trabajador} por ${motivo}?`;
    if (!confirm(confirmMessage)) return;

    try {
      await deleteControlRow(id);
      setRows(prev => prev.filter(r => r.id !== id));
      setFilteredRows(prev => prev.filter(r => r.id !== id));
      alert("Registro eliminado correctamente");
    } catch (err) {
      console.error("Error eliminando registro:", err);
      alert("Error al eliminar el registro");
    }
  };

  const handleDownload = () => {
    // Usar filteredRows para respetar los filtros aplicados
    const dataToExport = filteredRows.length > 0 ? filteredRows : rows;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Control Disciplinario");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    
    // Nombre del archivo basado en si hay filtros aplicados
    const fileName = filteredRows.length > 0 && filteredRows.length < rows.length 
      ? `control-disciplinario-filtrado-${filteredRows.length}-registros.xlsx`
      : "control-disciplinario-completo.xlsx";
    
    saveAs(data, fileName);
  };

  const handleAddRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      trabajador: "",
      oficina: "",
      CARGO: "",
      ANTIGÜEDAD: "",
      MOTIVO: "",
      FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "",
      FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "",
      FECHA_NOTIFICACIÓN: "",
      Inicio_de_proceso_x_Día: "",
      POSIBLE_SANCION: "",
      GRAVEDAD_NOTIFICADA: "",
      FECHA_DESCARGOS: "",
      FECHA_DESICIÓN_PRIMERA_INSTANCIA: "",
      GRAVEDAD_PRIMERA_INSTANCIA: "",
      SANCION_PRIMERA_INSTANCIA: "",
      Duracion_Proceso_Inicial: "",
      RECURSO: "",
      FECHA_INTERPOSICION_RECURSO: "",
      FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
      DECISIÓN_RECURSO_PRIMERA_INSTANCIA: "",
      Duración_Proceso_x_1_Instancia: "",
      DECISIÓN_RECURSO_SEGUNDA_INSTANCIA: "",
      GRAVEDAD_SEGUNDA_INSTANCIA: "",
      SANCION_SEGUNDA_INSTANCIA: "",
      FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA: "",
      Duración_Proceso_x_2_Instancia: "",
      TIEMPO_DE_SUSPENSION: "",
      ETAPA_DEL_PROCESO: "",
      ESTADO_DEL_EMPLEADO: "",
      Diferencia_x_Día: "",
      Total_Vinculación_x_Año_y_Día: "",
      Tipo_de_Impacto: "",
      Duración_total_del_proceso: "",
      isNew: true,
    };

    setRows(prev => [newRow, ...prev]);
    setFilteredRows(prev => [newRow, ...prev]);

    // opcional: marcarla como editada inmediatamente
    setEditedRows(prev => ({
      ...prev,
      [newRow.id]: newRow,
    }));
  };

  const motivos = [
    "ADULTERACIÓN CONSULTA EN CENTRALES DE RIESGOS E INCUMPLIMIENTO PROCESO DE TRÁMITES DE SOLICITUDES DE CRÉDITOS",
    "ADULTERACION Y ENTREGA DE CONTRATOS DE COMPRAVENTA FALSOS PARA TRAMITES DE CRÉDITOS",
    "ALTERACION DE DOCUMENTOS DE CRÉDITO",
    "APROPIACIÓN DE DINERO",
    "AUTORIZACION DE USUARIOS A TERCEROS",
    "COBRO DE CERTIFICADOS DE LIBERTAD Y TRADICION",
    "CONFLICTO DE INTERES",
    "ENTREGA DE INFORMACIÓN CONFIDENCIAL A TERCERO",
    "ENTREGA DE INFORMACIÓN CONFIDENCIAL A TERCERO Y OMISIÓN EN VALIDACIÓN DE CONSIGNACIONES BANCARIAS",
    "ESTADO DE EMBRIAGUEZ",
    "FALSIFICACION DE INCAPACIDAD MÉDICA",
    "FRAUDE INTERNO",
    "INASISTENCIA LABORAL INJUSTIFICADA",
    "INCORRECTO CONTROL DE ARQUEO",
    "INCORRECTO TRAMITE DE VERIFICACION DE IDENTIDAD DE ASOCIADO",
    "INCUMPLIMIENTO DEL DESEMPEÑO DE LAS FUNCIONES DEL CARGO",
    "INCUMPLIMIENTO E IRREGULARIDAD EN LA ENTREGA DE RECIBOS PROVISIONALES",
    "INCUMPLIMIENTO EN APLICACIÓN Y CONTROL DE PROCESOS DE CRÉDITOS",
    "INCUMPLIMIENTO JORNADA LABORAL",
    "INCUMPLIMIENTO MANUAL DE FUNCIONES",
    "INCUMPLIMIENTO PROCESO DE RETIRO DINERO DE CAJA",
    "INDEBIDA APLICACIÓN DE TRANSACCIÓN",
    "INDEBIDA CANCELACIÓN DE CRÉDITO",
    "INDEBIDA RECOLECCION EN SOLICITUD DE CRÉDITO",
    "INDEBIDA VERIFICACIÓN DE IDENTIDAD PARA TRANSACCIÓN",
    "INDEBIDO CONTROL DE CANCELACIÓN DE CRÉDITO",
    "INDEBIDO CONTROL DE DESEMBOLSO",
    "INDEBIDO CONTROL DE PROCESO DE ARQUEO DE CAJA",
    "INDEBIDO CONTROL DE PROCESOS DE VINCULACIÓN",
    "INDEBIDO PROCESO DE APLICACIÓN DE CONSIGNACIONES BANCARIAS",
    "INDEBIDO PROCESO DE ARQUEO DE CAJA",
    "INDEBIDO PROCESO DE ARQUEO DE CAJA - AFECTACIÓN CUENTA CONTABLE",
    "INDEBIDO PROCESO DE SOLICITUD DE PERMISO LABORAL",
    "INDEBIDO PROCESO DE TRÁMITE DE SOLICITUDES DE CRÉDITO",
    "INDEBIDO PROCESOS DE VINCULACIÓN",
    "INDEBIDO TRÁMITE DE SOLICITUD DE CRÉDITO",
    "IRRESPETO A SUS SUPERIORES Y COMPAÑEROS",
    "OMISIÓN CONTROL DE DESEMBOLSO",
    "OMISIÓN EN VALIDACIÓN DE CONSIGNACIONES BANCARIAS",
    "OMISIÓN VALIDACIÓN DE IDENTIDAD",
    "UTILIZACIÓN DE DINERO FALTANTE PARA CUADRE DE CAJA",
    "UTILIZACIÓN DE USUARIOS DE TERCEROS",
  ];

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Control Disciplinario
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por trabajador u oficina"
            className="unified-input w-[300px]"
          />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="unified-select"
          >
            <option value="">Todos los años</option>
            {uniqueYears.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="unified-select"
          >
            <option value="">Todos los meses</option>
            {availableMonths.map(m => (
              <option key={m.number} value={m.number}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              className="unified-button flex gap-2 items-center justify-center"
            >
              Guardar cambios
              <FaRegSave />
            </button>
          )}
          <button
            className="unified-button flex gap-2 items-center justify-center"
            onClick={handleDownload}
          >
            Descargar
            <FaFileDownload />
          </button>
          <button
            className="unified-button flex gap-2 items-center justify-center"
            onClick={handleAddRow}
          >
            Añadir fila
            <FaArrowDownWideShort />
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th className="p-4 border text-center whitespace-nowrap">ACCIONES</th>
              <th className="p-4 border text-center whitespace-nowrap">
                TRABAJADOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                OFICINA
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                CARGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ANTIGÜEDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[550px]">
                MOTIVO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA EN QUE SUCEDIERON LOS HECHOS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE CONOCIMIENTO DE LOS HECHOS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA NOTIFICACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap uppercase">
                Inicio de proceso x Día
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                POSIBLE SANCION
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                GRAVEDAD NOTIFICADA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DESCARGOS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DESICIÓN PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                GRAVEDAD PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                SANCION PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap uppercase">
                Duracion Proceso Inicial
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                RECURSO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA INTERPOSICION RECURSO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DECISIÓN RECURSO PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DECISIÓN RECURSO PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Duración Proceso x 1 Instancia
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DECISIÓN RECURSO SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                GRAVEDAD SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                SANCION SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE DECISIÓN SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap uppercase">
                Duración Proceso x 2 Instancia
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIEMPO DE SUSPENSION
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ETAPA DEL PROCESO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO DEL EMPLEADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap uppercase">
                Diferencia x Día
              </th>
              <th className="p-4 border text-center whitespace-nowrap uppercase">
                Total Vinculación x Año y Día
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px] uppercase">
                Tipo de Impacto
              </th>
              <th className="p-4 border text-center whitespace-nowrap uppercase">
                Duración total del proceso
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map((r, idx) => { const isEditing = r.isNew || !!editingRows[idx]; return (
              <tr key={idx}>
                <td className="p-2 border text-center whitespace-nowrap">
                  <div className="flex gap-2 justify-center">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingRows(prev => ({...prev, [idx]: true}))}
                          className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        {!r.isNew && r.id && /^\d+$/.test(String(r.id)) && (
                          <button
                            onClick={() => handleDelete(r.id, r.trabajador, r.MOTIVO)}
                            className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                            title="Eliminar proceso disciplinario"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSaveSingle(idx)}
                          className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
                          title="Guardar cambios"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => setEditingRows(prev => ({...prev, [idx]: false}))}
                          className="px-3 py-1 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600"
                          title="Cancelar edición"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-2 border text-left whitespace-nowrap min-w-[240px]">
                  {(() => {
                    if (!isEditing) {
                      return r.trabajador || "";
                    }
                    const ofiKey = (r.oficina || "").toString().toUpperCase();
                    const carKey = (r.CARGO || "").toString().toUpperCase();
                    const cacheExact = `${ofiKey}|${carKey || '*'}`;
                    const cacheOfiOnly = `${ofiKey}|*`;
                    const lista = empleadosCache[cacheExact] || empleadosCache[cacheOfiOnly] || [];
                    if (ofiKey && !empleadosCache[cacheOfiOnly]) {
                      ensureEmpleados(ofiKey);
                    }
                    if (ofiKey && carKey && !empleadosCache[cacheExact]) {
                      ensureEmpleados(ofiKey, carKey);
                    }
                    if (ofiKey) {
                      return (
                        <select disabled={!isEditing}
                          value={r.trabajador || ""}
                          onChange={e => {
                            const nombre = e.target.value;
                            const emp = lista.find(x => x.nombre === nombre);
                            handleChange(idx, "trabajador", nombre);
                            if (emp) {
                              handleChange(idx, "CARGO", emp.cargo_nombre || "");
                              handleChange(idx, "ANTIGÜEDAD", formatIsoToDdMmYyyy(emp.fecha_ingreso));
                              if (emp.oficina_nombre && emp.oficina_nombre !== r.oficina) {
                                handleChange(idx, "oficina", emp.oficina_nombre);
                              }
                              if (emp.estado_buk) {
                                handleChange(idx, "ESTADO_DEL_EMPLEADO", String(emp.estado_buk).toUpperCase());
                              }
                            }
                          }}
                          className="border rounded p-1 w-full"
                        >
                          <option value="">Seleccione empleado…</option>
                          {/* Mostrar el valor actual si no está en la lista */}
                          {r.trabajador && !lista.some(x => x.nombre === r.trabajador) && (
                            <option value={r.trabajador}>{r.trabajador}</option>
                          )}
                          {lista.map(emp => (
                            <option key={emp.id || emp.nombre} value={emp.nombre}>
                              {emp.nombre}
                            </option>
                          ))}
                        </select>
                      );
                    }
                    return r.trabajador || "";
                  })()}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.oficina}
                    onChange={e => {
                      const val = e.target.value;
                      handleChange(idx, "oficina", val);
                      ensureEmpleados(val);
                      ensureEmpleados(val, r.CARGO);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "GARZON",
                      "GUADALUPE",
                      "EL PITAL",
                      "GIGANTE",
                      "ACEVEDO",
                      "TARQUI",
                      "LA PLATA",
                      "PITALITO",
                      "SUAZA",
                      "LA ARGENTINA",
                      "NEIVA",
                      "RIVERA",
                      "HOBO",
                      "IQUIRA",
                      "SALADOBLANCO",
                      "ESPINAL",
                      "PLANADAS",
                      "CHAPARRAL",
                      "FLORENCIA",
                      "DIRECCIÓN GENERAL",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.CARGO}
                    onChange={e => {
                      const val = e.target.value;
                      handleChange(idx, "CARGO", val);
                      ensureEmpleados(r.oficina, val);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "ASESOR COMERCIAL",
                      "ASESOR COMERCIAL CORRESPONSAL SOLIDARIO",
                      "ASESOR FINANCIERO RURAL",
                      "ASESOR MICROFINANZAS URBANO",
                      "AUXILIAR CARTERA",
                      "AUXILIAR DE OFICINA",
                      "CAJERO",
                      "DIRECTOR DE OFICINA",
                      "DIRECTOR OFICINA",
                      "JEFE DE OPERACIONES",
                      "SUBGERENTE COMERCIAL",
                      "SUPERNUMERARIO",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.ANTIGÜEDAD}
                </td>
                <td className="p-2 border text-left ">
                  <select disabled={!isEditing}
                    value={r.MOTIVO}
                    onChange={e => {
                      handleChange(idx, "MOTIVO", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {motivos.map((m, index) => (
                      <option key={index} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="date"
                      value={toIso(r.FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS)}
                      onChange={e =>
                        handleChange(idx, "FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS", e.target.value)
                      }
                      className="border rounded p-1"
                    />
                  ) : (
                    r.FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="date"
                      value={toIso(r.FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS)}
                      onChange={e =>
                        handleChange(idx, "FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS", e.target.value)
                      }
                      className="border rounded p-1"
                    />
                  ) : (
                    r.FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="date"
                      value={toIso(r.FECHA_NOTIFICACIÓN)}
                      onChange={e =>
                        handleChange(idx, "FECHA_NOTIFICACIÓN", e.target.value)
                      }
                      className="border rounded p-1"
                    />
                  ) : (
                    r.FECHA_NOTIFICACIÓN
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Inicio_de_proceso_x_Día}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={r.POSIBLE_SANCION || ""}
                      onChange={e =>
                        handleChange(idx, "POSIBLE_SANCION", e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    >
                      {opcionesPosibleSancion.map(opcion => (
                        <option key={opcion} value={opcion}>
                          {opcion || "Seleccionar..."}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.POSIBLE_SANCION
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={r.GRAVEDAD_NOTIFICADA || ""}
                      onChange={e =>
                        handleChange(idx, "GRAVEDAD_NOTIFICADA", e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    >
                      {opcionesGravedad.map(opcion => (
                        <option key={opcion} value={opcion}>
                          {opcion || "Seleccionar..."}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.GRAVEDAD_NOTIFICADA
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="date"
                      value={toIso(r.FECHA_DESCARGOS)}
                      onChange={e =>
                        handleChange(idx, "FECHA_DESCARGOS", e.target.value)
                      }
                      className="border rounded p-1"
                    />
                  ) : (
                    r.FECHA_DESCARGOS
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="date"
                      value={toIso(r.FECHA_DESICIÓN_PRIMERA_INSTANCIA)}
                      onChange={e =>
                        handleChange(
                          idx,
                          "FECHA_DESICIÓN_PRIMERA_INSTANCIA",
                          e.target.value
                        )
                      }
                      className="border rounded p-1"
                    />
                  ) : (
                    r.FECHA_DESICIÓN_PRIMERA_INSTANCIA
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.GRAVEDAD_PRIMERA_INSTANCIA}
                    onChange={e => {
                      handleChange(
                        idx,
                        "GRAVEDAD_PRIMERA_INSTANCIA",
                        e.target.value
                      );
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["GRAVE", "LEVE", "GRAVISIMA"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.SANCION_PRIMERA_INSTANCIA}
                    onChange={e => {
                      handleChange(
                        idx,
                        "SANCION_PRIMERA_INSTANCIA",
                        e.target.value
                      );
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "SUSPENSION",
                      "NO APLICA",
                      "LLAMADO DE ATENCIÓN",
                      "TERMINACION DE CONTRATO",
                      "ARCHIVADO",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Duracion_Proceso_Inicial}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.RECURSO}
                    onChange={e => {
                      handleChange(idx, "RECURSO", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "NO INTERPUESTO",
                      "APELACIÓN",
                      "REPOSICIÓN",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="date"
                      value={toIso(r.FECHA_INTERPOSICION_RECURSO)}
                      onChange={e =>
                        handleChange(
                          idx,
                          "FECHA_INTERPOSICION_RECURSO",
                          e.target.value
                        )
                      }
                      className="border rounded p-1"
                    />
                  ) : (
                    r.FECHA_INTERPOSICION_RECURSO
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="date"
                      value={toIso(r.FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA)}
                      onChange={e =>
                        handleChange(
                          idx,
                          "FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA",
                          e.target.value
                        )
                      }
                      className="border rounded p-1"
                    />
                  ) : (
                    r.FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.DECISIÓN_RECURSO_PRIMERA_INSTANCIA}
                    onChange={e => {
                      handleChange(
                        idx,
                        "DECISIÓN_RECURSO_PRIMERA_INSTANCIA",
                        e.target.value
                      );
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["CONFIRMA", "MODIFICA", "REVOCA"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Duración_Proceso_x_1_Instancia}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.DECISIÓN_RECURSO_SEGUNDA_INSTANCIA}
                    onChange={e => {
                      handleChange(
                        idx,
                        "DECISIÓN_RECURSO_SEGUNDA_INSTANCIA",
                        e.target.value
                      );
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["CONFIRMA", "MODIFICA", "REVOCA"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.GRAVEDAD_SEGUNDA_INSTANCIA}
                    onChange={e => {
                      handleChange(
                        idx,
                        "GRAVEDAD_SEGUNDA_INSTANCIA",
                        e.target.value
                      );
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["GRAVE", "LEVE", "GRAVISIMA"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.GRAVEDAD_PRIMERA_INSTANCIA}
                    onChange={e => {
                      handleChange(
                        idx,
                        "GRAVEDAD_PRIMERA_INSTANCIA",
                        e.target.value
                      );
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["GRAVE", "LEVE", "GRAVISIMA"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="date"
                      value={toIso(r.FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA)}
                      onChange={e =>
                        handleChange(
                          idx,
                          "FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA",
                          e.target.value
                        )
                      }
                      className="border rounded p-1"
                    />
                  ) : (
                    r.FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Duración_Proceso_x_2_Instancia}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.TIEMPO_DE_SUSPENSION || ""}
                      onChange={e =>
                        handleChange(idx, "TIEMPO_DE_SUSPENSION", e.target.value)
                      }
                      placeholder="Ej: 4 DÍAS"
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    r.TIEMPO_DE_SUSPENSION
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.ETAPA_DEL_PROCESO}
                    onChange={e => {
                      handleChange(idx, "ETAPA_DEL_PROCESO", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["TERMINADO", "EN PROCESO"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.ESTADO_DEL_EMPLEADO}
                    onChange={e => {
                      handleChange(idx, "ESTADO_DEL_EMPLEADO", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["RETIRADO", "ACTIVO", "RENUNCIA"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Diferencia_x_Día}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Total_Vinculación_x_Año_y_Día}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.Tipo_de_Impacto}
                    onChange={e => {
                      handleChange(idx, "Tipo_de_Impacto", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "LEGAL",
                      "ECONÓMICO",
                      "REPUTACIONAL",
                      "OPERACIONAL",
                      "SIN IMPACTO",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Duración_total_del_proceso}
                </td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
