"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  // Format: 07/12/2022 -> 2022-12-07
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

// Helper function to convert date input to date string
const fromDateInput = (dateStr) => {
  if (!dateStr) return "";
  // Format: 2022-12-07 -> 07/12/2022
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// Initial data
const initialRows = [
  {
    id: 1,
    estrategias: "Crédito y Cartera",
    gestion: "Gestión Crédito",
    tipoDocumento: "Documento Soporte",
    procesos: "Tipos de crédito - agro",
    nombreDocumento: "Recomendaciones para el Cálculo Agropecuario",
    codigo: "DSCR-03",
    ultimaActualizacion: "07/12/2022",
    version: "1",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 2,
    estrategias: "Crédito y Cartera",
    gestion: "Gestión Crédito",
    tipoDocumento: "Documento Soporte",
    procesos: "Convenios",
    nombreDocumento: "Aplicación de descuentos de créditos de libranza",
    codigo: "DSCR-01",
    ultimaActualizacion: "23/09/2020",
    version: "1",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 3,
    estrategias: "Crédito y Cartera",
    gestion: "Gestión Crédito",
    tipoDocumento: "Documento Soporte",
    procesos: "Gestion de credito",
    nombreDocumento: "Información Complementaria del MACR-12",
    codigo: "DSCR-02",
    ultimaActualizacion: "27/06/2025",
    version: "7",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 4,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Compensación y Beneficios",
    nombreDocumento: "Legalización gastos de viaje",
    codigo: "FOAD-01",
    ultimaActualizacion: "06/04/2021",
    version: "4",
    actualizado: "100%",
    conservacion: "Preimpreso",
    intranet: "SI",
  },
  {
    id: 5,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Gestion Documental",
    nombreDocumento: "Acta de inventario documentos",
    codigo: "FOAD-02",
    ultimaActualizacion: "29/03/2022",
    version: "2",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 6,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Compras",
    nombreDocumento: "Solicitud EPP",
    codigo: "FOAD-03",
    ultimaActualizacion: "06/04/2021",
    version: "1",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 7,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Desvinculacion trabajador",
    nombreDocumento: "Acta de entrega del puesto de trabajo",
    codigo: "FOAD-04",
    ultimaActualizacion: "23/05/2022",
    version: "3",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 8,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Administración de personal",
    nombreDocumento: "Control de asistencia interno",
    codigo: "FOAD-05",
    ultimaActualizacion: "25/08/2023",
    version: "1",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 9,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Selección",
    nombreDocumento: "Solicitud de servicio",
    codigo: "FOAD-06",
    ultimaActualizacion: "08/02/2021",
    version: "1",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 10,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Selección",
    nombreDocumento: "Acta de inicio para contratistas",
    codigo: "FOAD-07",
    ultimaActualizacion: "20/02/2025",
    version: "2",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 11,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Compensación y Beneficios",
    nombreDocumento: "Autorización Horas Extras",
    codigo: "FOAD-08",
    ultimaActualizacion: "25/11/2019",
    version: "2",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 12,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Desvinculacion trabajador",
    nombreDocumento: "Acta de terminación",
    codigo: "FOAD-09",
    ultimaActualizacion: "20/02/2025",
    version: "2",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 13,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Selección",
    nombreDocumento: "Formato entrevista",
    codigo: "FOAD-10",
    ultimaActualizacion: "02/02/2023",
    version: "3",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 14,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Selección",
    nombreDocumento: "Entrevista de Selección",
    codigo: "FOAD-11",
    ultimaActualizacion: "08/05/2019",
    version: "3",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 15,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Selección",
    nombreDocumento: "Verificación referencias personales y laborales",
    codigo: "FOAD-12",
    ultimaActualizacion: "24/07/2018",
    version: "2",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 16,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Selección",
    nombreDocumento: "Formato visita domiciliaria",
    codigo: "FOAD-13",
    ultimaActualizacion: "24/07/2018",
    version: "2",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 17,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Selección",
    nombreDocumento: "Informe de resultados",
    codigo: "FOAD-14",
    ultimaActualizacion: "23/12/2024",
    version: "3",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 18,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Administración de personal",
    nombreDocumento: "Entrega de dotación y/o elementos de protección personal",
    codigo: "FOAD-15",
    ultimaActualizacion: "12/12/2023",
    version: "6",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 19,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Compras",
    nombreDocumento: "Solicitud elementos de aseo",
    codigo: "FOAD-18",
    ultimaActualizacion: "06/04/2021",
    version: "1",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 20,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Compensación y Beneficios",
    nombreDocumento: "Descuentos Empleados por Nómina",
    codigo: "FOAD-19",
    ultimaActualizacion: "19/06/2019",
    version: "2",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 21,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Administración de personal",
    nombreDocumento: "Hoja de vida empleados",
    codigo: "FOAD-21",
    ultimaActualizacion: "06/06/2023",
    version: "2",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 22,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Talento y Cultura",
    tipoDocumento: "Formato",
    procesos: "Protección de datos",
    nombreDocumento: "Acuerdo de confidenciabilidad",
    codigo: "FOTH-02",
    ultimaActualizacion: "30/09/2023",
    version: "1",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 23,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Protección de datos",
    nombreDocumento: "Aviso Zona Videovigilada",
    codigo: "FOAD-24",
    ultimaActualizacion: "02/08/2023",
    version: "2",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 24,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Protección de datos",
    nombreDocumento: "Autorizacion Tratamiento de Datos Personales.",
    codigo: "FOAD-26",
    ultimaActualizacion: "15/03/2025",
    version: "3",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 25,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Compras",
    nombreDocumento: "Orden de Compras y Servicios",
    codigo: "FOAD-28",
    ultimaActualizacion: "20/05/2022",
    version: "5",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 26,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Selección",
    nombreDocumento: "Autorización de convocatoria",
    codigo: "FOAD-29",
    ultimaActualizacion: "15/02/2021",
    version: "1",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 27,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Compras",
    nombreDocumento: "Solicitud de papelería",
    codigo: "FOAD-31",
    ultimaActualizacion: "16/03/2021",
    version: "2",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 28,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Gestion Documental",
    nombreDocumento: "Hoja Membreteada",
    codigo: "FOAD-32",
    ultimaActualizacion: "21/08/2024",
    version: "4",
    actualizado: "100%",
    conservacion: "Digital-Preimpreso",
    intranet: "SI",
  },
  {
    id: 29,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Gestion de desempeño",
    nombreDocumento: "Plan de Mejora",
    codigo: "FOAD-33",
    ultimaActualizacion: "11/02/2019",
    version: "3",
    actualizado: "100%",
    conservacion: "Impreso",
    intranet: "SI",
  },
  {
    id: 30,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Activos fijos",
    nombreDocumento: "Acta de entrega de equipos",
    codigo: "FOAD-37",
    ultimaActualizacion: "17/05/2018",
    version: "1",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 31,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Desarrollo organizacional",
    nombreDocumento: "Estructuración de proyectos",
    codigo: "FOAD-38",
    ultimaActualizacion: "19/10/2021",
    version: "2",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
  {
    id: 32,
    estrategias: "Innovación Empresarial",
    gestion: "Gestión Innovación Empresarial",
    tipoDocumento: "Formato",
    procesos: "Gestion Documental",
    nombreDocumento: "Acta de reunión",
    codigo: "FOAD-42",
    ultimaActualizacion: "28/01/2019",
    version: "1",
    actualizado: "100",
    conservacion: "Digital",
    intranet: "Si",
  },
];

// Options for dropdowns
const estrategiasOptions = [
  "Crédito y Cartera",
  "Innovación Empresarial",
  "Gerencia",
  "Comercial",
  "Financiera",
];

const gestionOptions = [
  "Gestión Crédito",
  "Gestión Innovación Empresarial",
  "Gestión Talento y Cultura",
  "Gestión Auditoria Interna",
  "Gestión Cartera",
  "Gestión Comunicaciones",
  "Gestión Comercial",
  "Gestión Contabilidad",
  "Gestión Documental",
  "Gestión Gerencial",
  "Gestión Ingeniería Organizacional",
  "Gestión Oficial de Cumplimiento",
  "Gestión Riesgos",
  "Gestión Tesorería",
  "Gestión Juridica",
  "Gestión Financiera",
  "Gestión Tecnologia",
  "Organos de administracion y vigilancia",
];

const tipoDocumentoOptions = [
  "Documento Soporte",
  "Formato",
  "Guía",
  "Plan",
  "Instructivo",
  "Procedimiento",
  "Manual",
  "Politica",
  "Reglamento",
  "Acuerdo",
  "Resolucion",
];

const procesosOptions = [
  "Tipos de crédito - agro",
  "Convenios",
  "Gestion de credito",
  "Compensación y Beneficios",
  "Gestion Documental",
  "Compras",
  "Desvinculacion trabajador",
  "Administración de personal",
  "Selección",
  "Protección de datos",
  "Gestion de desempeño",
  "Activos fijos",
  "Desarrollo organizacional",
  "Gestion administrativa",
  "Seguridad fisica",
  "Auditoria interna",
  "Gestion de cartera",
  "Cobro jurídico",
  "Gestión de cobranza",
  "Exclusión de asociados",
  "Comunicaciones internas",
];

const versionOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const actualizadoOptions = ["100", "50", "por eliminar"];

const conservacionOptions = [
  "Digital",
  "Preimpreso",
  "Impreso",
  "Digital-Preimpreso",
  "Digital-Impreso",
];

const intranetOptions = ["Si", "No"];

export default function ListadoMaestrosTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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
      "Listado Maestros"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "listado-maestros.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.nombreDocumento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.procesos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.estrategias?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Listado de Maestros
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, código, proceso o estrategia"
            className="unified-input w-[300px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="unified-button flex gap-2 items-center justify-center">
            Buscar
            <IoSearch />
          </button>
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
            <FiDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">ID</th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTRATEGIAS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                GESTIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DOCUMENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                PROCESOS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRE DEL DOCUMENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CÓDIGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ÚLTIMA ACTUALIZACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VERSIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ACTUALIZADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CONSERVACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                INTRANET
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estrategias}
                    onChange={e =>
                      handleChange(r.id, "estrategias", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estrategiasOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.gestion}
                    onChange={e =>
                      handleChange(r.id, "gestion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {gestionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoDocumento}
                    onChange={e =>
                      handleChange(r.id, "tipoDocumento", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoDocumentoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.procesos}
                    onChange={e =>
                      handleChange(r.id, "procesos", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {procesosOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nombreDocumento}
                    onChange={e =>
                      handleChange(r.id, "nombreDocumento", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Nombre del documento"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.codigo}
                    onChange={e =>
                      handleChange(r.id, "codigo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Código"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.ultimaActualizacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "ultimaActualizacion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.version}
                    onChange={e =>
                      handleChange(r.id, "version", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {versionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.actualizado}
                    onChange={e =>
                      handleChange(r.id, "actualizado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {actualizadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.conservacion}
                    onChange={e =>
                      handleChange(r.id, "conservacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {conservacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.intranet}
                    onChange={e =>
                      handleChange(r.id, "intranet", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {intranetOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
