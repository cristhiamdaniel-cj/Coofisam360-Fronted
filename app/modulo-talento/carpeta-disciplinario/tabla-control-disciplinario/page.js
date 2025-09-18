"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { FaFileUpload, FaRegFolderOpen } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { TbUpload } from "react-icons/tb";

const initialRows = [
  {
    TRABAJADOR: "CARLOS FERNANDO GONZALEZ",
    OFICINA: "DIRECCIÓN GENERAL",
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
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "19/02/2025",
    GRAVEDAD_PRIMERA_INSTANCIA: "GRAVE",
    SANCION_PRIMERA_INSTANCIA: "SUSPENSION",
    Duracion_Proceso_Inicial: "30",
    RECURSO: "NO",
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
    TRABAJADOR: "FRANCY LUPITA ORTIZ MENDOZA",
    OFICINA: "NEIVA",
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
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "03/02/2025",
    GRAVEDAD_PRIMERA_INSTANCIA: "",
    SANCION_PRIMERA_INSTANCIA: "",
    Duracion_Proceso_Inicial: "7",
    RECURSO: "PROCESO NO CONCLUIDO",
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
    TRABAJADOR: "SEIDY MARCELA ROBAYO CAMACHO",
    OFICINA: "GUADALUPE",
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
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "17/01/2025",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCION",
    Duracion_Proceso_Inicial: "8",
    RECURSO: "NO",
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
    TRABAJADOR: "JOSE EDGAR VARGAS LOSADA",
    OFICINA: "GARZON",
    CARGO: "ASESOR MICROFINANZAS URBANO",
    ANTIGÜEDAD: "25/09/20",
    MOTIVO: "FRAUDE INTERNO",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "09/12/2023",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "22/01/2025",
    FECHA_NOTIFICACIÓN: "07/02/2025",
    Inicio_de_proceso_x_Día: "16",
    POSIBLE_SANCION: "TERMINACION DE CONTRATO",
    GRAVEDAD_NOTIFICADA: "GRAVISIMA",
    FECHA_DESCARGOS: "07/02/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "07/02/2025",
    GRAVEDAD_PRIMERA_INSTANCIA: "GRAVISIMA",
    SANCION_PRIMERA_INSTANCIA: "TERMINACION DE CONTRATO",
    Duracion_Proceso_Inicial: "0",
    RECURSO: "NO",
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
    Diferencia_x_Día: "1170",
    Total_Vinculación_x_Año_y_Día: "3,3",
    Tipo_de_Impacto: "Económico",
    Duración_total_del_proceso: "0",
  },
  {
    TRABAJADOR: "ANA MARIA HERRERA CALDERÓN",
    OFICINA: "GARZON",
    CARGO: "ASESOR COMERCIAL",
    ANTIGÜEDAD: "12/02/23",
    MOTIVO: "OMISIÓN CONTROL DE DESEMBOLSO",
    FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS: "18/01/2025",
    FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS: "22/01/2025",
    FECHA_NOTIFICACIÓN: "27/02/2025",
    Inicio_de_proceso_x_Día: "36",
    POSIBLE_SANCION: "TERMINACION DE CONTRATO",
    GRAVEDAD_NOTIFICADA: "GRAVISIMA",
    FECHA_DESCARGOS: "27/02/2025",
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "27/02/2025",
    GRAVEDAD_PRIMERA_INSTANCIA: "GRAVISIMA",
    SANCION_PRIMERA_INSTANCIA: "TERMINACION DE CONTRATO",
    Duracion_Proceso_Inicial: "0",
    RECURSO: "NO",
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
    Diferencia_x_Día: "706",
    Total_Vinculación_x_Año_y_Día: "2,0",
    Tipo_de_Impacto: "Operacional",
    Duración_total_del_proceso: "0",
  },
  {
    TRABAJADOR: "JOSE ALEXIS PEÑA VALENCIA",
    OFICINA: "GARZON",
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
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "31/03/2025",
    GRAVEDAD_PRIMERA_INSTANCIA: "GRAVE",
    SANCION_PRIMERA_INSTANCIA: "SUSPENSION",
    Duracion_Proceso_Inicial: "26",
    RECURSO: "NO",
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
    TRABAJADOR: "CLAUDIA PATRICIA MONTES RODRIGUEZ",
    OFICINA: "GARZON",
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
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "22/04/2025",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCION",
    Duracion_Proceso_Inicial: "18",
    RECURSO: "NO",
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
    TRABAJADOR: "KAREN DAYANNA CERQUERA CABRERA",
    OFICINA: "GARZON",
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
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "22/04/2025",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCION",
    Duracion_Proceso_Inicial: "18",
    RECURSO: "NO",
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
    TRABAJADOR: "LEIDY YOHANNA GUTIERREZ PERDOMO",
    OFICINA: "GARZON",
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
    FECHA_DESICIÓN_PRIMERA_INSTANCIA: "22/04/2025",
    GRAVEDAD_PRIMERA_INSTANCIA: "LEVE",
    SANCION_PRIMERA_INSTANCIA: "LLAMADO DE ATENCION",
    Duracion_Proceso_Inicial: "14",
    RECURSO: "NO",
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
    Diferencia_x_Día: "1346",
    Total_Vinculación_x_Año_y_Día: "4,3",
    Tipo_de_Impacto: "Económico",
    Duración_total_del_proceso: "14",
  },
];

export default function GestionesTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState([]);

  const handleChange = (id, field, value) => {
    // update rows state immediately
    setRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );

    // mark this row as edited
    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async () => {
    console.log("Saving edits:", editedRows);

    // Example: send to backend
    /*
    await fetch("https://coofisam360.ngrok.io/api/update-records/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedRows),
    });
    */

    // clear edited state after saving
    setEditedRows({});
  };

  const handleDownload = () => {
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Indicadores Financieros"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "cupos.xlsx");
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
    <main className="pt-12 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-12">
        Control Disciplinario
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input type="text" className="border w-[300px]" />
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
            Buscar
            <IoSearch />
          </button>
          <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
            Cargar Reporte
            <TbUpload />
            <input type="file" accept=".xlsx,.csv" className="hidden" />
          </label>
          <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
            Explorar
            <FaRegFolderOpen />
            <input type="file" accept=".xlsx,.csv" className="hidden" />
          </label>
          <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
            Ejecutar
            <FaPlay />
            <input type="file" accept=".xlsx,.csv" className="hidden" />
          </label>
        </div>

        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              className="action-button flex gap-2 items-center justify-center cursor-pointer"
            >
              Guardar cambios
              <FaRegSave />
            </button>
          )}
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleDownload}
          >
            Descargar
            <FiDownload />
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
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
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TRABAJADOR}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.OFICINA}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].OFICINA = e.target.value;
                      setRows(newRows);
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
                  <select
                    value={r.CARGO}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].CARGO = e.target.value;
                      setRows(newRows);
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
                  <select
                    value={r.MOTIVO}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].MOTIVO = e.target.value;
                      setRows(newRows);
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
                  {r.FECHA_EN_QUE_SUCEDIERON_LOS_HECHOS}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.FECHA_DE_CONOCIMIENTO_DE_LOS_HECHOS}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.FECHA_NOTIFICACIÓN}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Inicio_de_proceso_x_Día}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.POSIBLE_SANCION}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.GRAVEDAD_NOTIFICADA}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.FECHA_DESCARGOS}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.FECHA_DESICIÓN_PRIMERA_INSTANCIA}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.GRAVEDAD_PRIMERA_INSTANCIA}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].GRAVEDAD_PRIMERA_INSTANCIA = e.target.value;
                      setRows(newRows);
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
                  <select
                    value={r.SANCION_PRIMERA_INSTANCIA}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].SANCION_PRIMERA_INSTANCIA = e.target.value;
                      setRows(newRows);
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
                  <select
                    value={r.RECURSO}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].RECURSO = e.target.value;
                      setRows(newRows);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "NO INTERPUESTO",
                      "APELACIÓN",
                      "PROCESO NO CONCLUIDO",
                      "REPOSICIÓN",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.FECHA_INTERPOSICION_RECURSO}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.FECHA_DECISIÓN_RECURSO_PRIMERA_INSTANCIA}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.DECISIÓN_RECURSO_PRIMERA_INSTANCIA}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].DECISIÓN_RECURSO_PRIMERA_INSTANCIA =
                        e.target.value;
                      setRows(newRows);
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
                  <select
                    value={r.DECISIÓN_RECURSO_SEGUNDA_INSTANCIA}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].DECISIÓN_RECURSO_SEGUNDA_INSTANCIA =
                        e.target.value;
                      setRows(newRows);
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
                  <select
                    value={r.GRAVEDAD_SEGUNDA_INSTANCIA}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].GRAVEDAD_SEGUNDA_INSTANCIA = e.target.value;
                      setRows(newRows);
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
                  <select
                    value={r.GRAVEDAD_PRIMERA_INSTANCIA}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].GRAVEDAD_PRIMERA_INSTANCIA = e.target.value;
                      setRows(newRows);
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
                  {r.FECHA_DE_DECISIÓN_SEGUNDA_INSTANCIA}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Duración_Proceso_x_2_Instancia}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TIEMPO_DE_SUSPENSION}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.ETAPA_DEL_PROCESO}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].ETAPA_DEL_PROCESO = e.target.value;
                      setRows(newRows);
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
                  <select
                    value={r.ESTADO_DEL_EMPLEADO}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].ESTADO_DEL_EMPLEADO = e.target.value;
                      setRows(newRows);
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
                  <select
                    value={r.Tipo_de_Impacto}
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[idx].Tipo_de_Impacto = e.target.value;
                      setRows(newRows);
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
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
