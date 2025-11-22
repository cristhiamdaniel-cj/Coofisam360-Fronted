"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Initial data
const initialRows = [
  {
    id: 1,
    codigoRiesgo: "1",
    descripcionRiesgo: "Inicio de procesos ejecutivos con  posible sanción por parte del ente regulador debido a que se envían respuestas extemporáneas o por fuera de los términos legales a requerimientos de autoridades y/o PQRS desde la Gerencia General.",
    gestion: "Gestión Gerencial",
    factorRiesgo: "5. Acontecimientos Externos",
    categoriaRiesgoNivel1: "4 Asociados o Clientes",
    impactoReputacional: "Si",
    impactoLegal: "No",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Director Juridico",
    impactoResidual: "Menor",
    valorIR: "2",
    probabilidadResidual: "Improbable",
    valorPR: "2",
    valorRiesgoResidual: "4",
    severidadRiesgoResidual: "Bajo",
  },
  {
    id: 2,
    codigoRiesgo: "2",
    descripcionRiesgo: "Sanción  por parte del ente de regulación y control al representante legal debido al incumplimiento de sus responsabilidades transversales a los procesos y normas debido a que no se reporta dentro del informe presentado al consejo de administración los apartes relacionados con los sistemas de administración de riesgo vigentes en Coofisam.",
    gestion: "Gestión Gerencial",
    factorRiesgo: "2. Procesos",
    categoriaRiesgoNivel1: "7 Ejecución y administración de procesos",
    impactoReputacional: "No",
    impactoLegal: "Si",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Gerencia General",
    impactoResidual: "Bajo",
    valorIR: "1",
    probabilidadResidual: "Inusual",
    valorPR: "1",
    valorRiesgoResidual: "1",
    severidadRiesgoResidual: "Bajo",
  },
  {
    id: 3,
    codigoRiesgo: "3",
    descripcionRiesgo: "Sanciones impuestas por parte del ente de regulación y control , por las modificaciones realizadas a los  informes emitido por el Core Bancario por parte de las areas encargadas debido a que el software presenta inconsistencias de información respecto a los datos y calculos relacionados con el cierre.",
    gestion: "Gestión Financiera",
    factorRiesgo: "3. Tecnología",
    categoriaRiesgoNivel1: "7 Ejecución y administración de procesos",
    impactoReputacional: "Si",
    impactoLegal: "Si",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Director Contabilidad",
    impactoResidual: "Menor",
    valorIR: "2",
    probabilidadResidual: "Inusual",
    valorPR: "1",
    valorRiesgoResidual: "2",
    severidadRiesgoResidual: "Bajo",
  },
  {
    id: 4,
    codigoRiesgo: "4",
    descripcionRiesgo: "Sanciones por parte del ente de regulación y control a los integrantes del consejo de administración de Coofisam,  debido al desconocimiento en temas normativos aplicados al sector solidario, respecto a la ejecución de sus funciones.",
    gestion: "Gestión Gerencial",
    factorRiesgo: "5. Acontecimientos Externos",
    categoriaRiesgoNivel1: "7 Ejecución y administración de procesos",
    impactoReputacional: "No",
    impactoLegal: "Si",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Gerencia General",
    impactoResidual: "Bajo",
    valorIR: "1",
    probabilidadResidual: "Improbable",
    valorPR: "2",
    valorRiesgoResidual: "2",
    severidadRiesgoResidual: "Bajo",
  },
  {
    id: 5,
    codigoRiesgo: "5",
    descripcionRiesgo: "Sanciones  para Coofisam por parte del ente de regulación y control debido a que no se actualiza el reporte ante centrales de riesgo de manera oportuna al presentar inconsistencias en la emisión del contenido del informe ante la central de riesgos.",
    gestion: "Gestión Crédito y Cartera",
    factorRiesgo: "3. Tecnología",
    categoriaRiesgoNivel1: "7 Ejecución y administración de procesos",
    impactoReputacional: "Si",
    impactoLegal: "Si",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Subgerencia Crédito y Cartera",
    impactoResidual: "Bajo",
    valorIR: "1",
    probabilidadResidual: "Improbable",
    valorPR: "2",
    valorRiesgoResidual: "2",
    severidadRiesgoResidual: "Bajo",
  },
  {
    id: 6,
    codigoRiesgo: "6",
    descripcionRiesgo: "Sanciones para Coofisam por parte del Ente de regulación y control , por omisión de reportes y/o seguimientos al SIAR debido  a la ausencia de personal en el área de riesgos para ejecutar las funciones del cargo  en ausencia del titular.",
    gestion: "Gestión Gerencial",
    factorRiesgo: "1. Personas",
    categoriaRiesgoNivel1: "3 Relaciones laborales",
    impactoReputacional: "No",
    impactoLegal: "Si",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Director Riesgos",
    impactoResidual: "Moderado",
    valorIR: "3",
    probabilidadResidual: "Inusual",
    valorPR: "1",
    valorRiesgoResidual: "3",
    severidadRiesgoResidual: "Moderado",
  },
  {
    id: 7,
    codigoRiesgo: "7",
    descripcionRiesgo: "Sanciones para Coofisam por parte del Ente de regulación y control por el  envío de  información privilegiada de asociados a terceros   ,  debido al acceso pleno a la data base por parte de empleados del aréa de riesgos y la posterior venta de este insumo a bandas criminales.",
    gestion: "Gestión Innovación Empresarial",
    factorRiesgo: "3. Tecnología",
    categoriaRiesgoNivel1: "1 Fraude Interno",
    impactoReputacional: "Si",
    impactoLegal: "Si",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Director Riesgos",
    impactoResidual: "Menor",
    valorIR: "2",
    probabilidadResidual: "Inusual",
    valorPR: "1",
    valorRiesgoResidual: "2",
    severidadRiesgoResidual: "Bajo",
  },
  {
    id: 8,
    codigoRiesgo: "8",
    descripcionRiesgo: "Pérdida de los recursos financieros por incumplimiento de la entrega de bienes y servicios debido a la falta de liquidez por parte del proveedor,  por omisión o descuido de la Subgerencia Administrativa en la verificación de requisitos de contratación.",
    gestion: "Gestión Innovación Empresarial",
    factorRiesgo: "1. Personas",
    categoriaRiesgoNivel1: "2 Fraude Externo",
    impactoReputacional: "No",
    impactoLegal: "Si",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Subgerente de innovacion empresarial",
    impactoResidual: "Moderado",
    valorIR: "3",
    probabilidadResidual: "Inusual",
    valorPR: "1",
    valorRiesgoResidual: "3",
    severidadRiesgoResidual: "Moderado",
  },
  {
    id: 9,
    codigoRiesgo: "9",
    descripcionRiesgo: "Pérdida de la reputación y sanciones por contratación de proveedores personas naturales o juridicas vinculadas en listas restrictivas, por omisión o descuido de la Subgerencia Administrativa en la verificación de requisitos de contratación.",
    gestion: "Gestión Innovación Empresarial",
    factorRiesgo: "5. Acontecimientos Externos",
    categoriaRiesgoNivel1: "7 Ejecución y administración de procesos",
    impactoReputacional: "Si",
    impactoLegal: "Si",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Subgerente de innovacion empresarial",
    impactoResidual: "Bajo",
    valorIR: "1",
    probabilidadResidual: "Inusual",
    valorPR: "1",
    valorRiesgoResidual: "1",
    severidadRiesgoResidual: "Bajo",
  },
  {
    id: 10,
    codigoRiesgo: "10",
    descripcionRiesgo: "Incremento del gasto por la recompra de bienes o servicios para Coofisam debido a la falta de liquidez por parte de los proveedores,  por omisión o descuido de la Subgerencia Administrativa en el cumplimiento de pólizas.",
    gestion: "Gestión Innovación Empresarial",
    factorRiesgo: "1. Personas",
    categoriaRiesgoNivel1: "4 Asociados o Clientes",
    impactoReputacional: "Si",
    impactoLegal: "No",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Subgerente de innovacion empresarial",
    impactoResidual: "Moderado",
    valorIR: "3",
    probabilidadResidual: "Inusual",
    valorPR: "1",
    valorRiesgoResidual: "3",
    severidadRiesgoResidual: "Moderado",
  },
  {
    id: 11,
    codigoRiesgo: "11",
    descripcionRiesgo: "Incremento del gasto por el pago de demandas debido a la  aplicación de sanciones no justificadas hacia los empleados de Coofisam.",
    gestion: "Gestión Innovación Empresarial",
    factorRiesgo: "1. Personas",
    categoriaRiesgoNivel1: "3 Relaciones laborales",
    impactoReputacional: "No",
    impactoLegal: "Si",
    impactoEconomico: "Si",
    impactoVidasHumanas: "No",
    responsableRiesgo: "Subgerente de innovacion empresarial",
    impactoResidual: "Bajo",
    valorIR: "1",
    probabilidadResidual: "Improbable",
    valorPR: "2",
    valorRiesgoResidual: "2",
    severidadRiesgoResidual: "Bajo",
  },
];

// Options for dropdowns
const gestionOptions = [
  "Gestión Gerencial",
  "Gestión Financiera",
  "Gestión Crédito y Cartera",
  "Gestión Innovación Empresarial",
  "",
];

const factorRiesgoOptions = [
  "1. Personas",
  "2. Procesos",
  "3. Tecnología",
  "5. Acontecimientos Externos",
  "",
];

const categoriaRiesgoNivel1Options = [
  "1 Fraude Interno",
  "2 Fraude Externo",
  "3 Relaciones laborales",
  "4 Asociados o Clientes",
  "7 Ejecución y administración de procesos",
  "",
];

const impactoReputacionalOptions = ["Si", "No", ""];

const impactoLegalOptions = ["Si", "No", ""];

const impactoEconomicoOptions = ["Si", "No", ""];

const impactoVidasHumanasOptions = ["Si", "No", ""];

const responsableRiesgoOptions = [
  "Director Juridico",
  "Gerencia General",
  "Director Contabilidad",
  "Subgerencia Crédito y Cartera",
  "Director Riesgos",
  "Subgerente de innovacion empresarial",
  "",
];

const impactoResidualOptions = ["Menor", "Bajo", "Moderado", "Alto", "Crítico", ""];

const probabilidadResidualOptions = [
  "Improbable",
  "Inusual",
  "Posible",
  "Probable",
  "Casi cierto",
  "",
];

const severidadRiesgoResidualOptions = [
  "Bajo",
  "Moderado",
  "Alto",
  "Crítico",
  "",
];

export default function EfectividadSiarTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("efectividad");

  const handleChange = (id, field, value) => {
    // Calculate valorRiesgoResidual if valorIR or valorPR changes
    if (field === "valorIR" || field === "valorPR") {
      const row = rows.find(r => r.id === id);
      const valorIR = field === "valorIR" ? value : row.valorIR;
      const valorPR = field === "valorPR" ? value : row.valorPR;
      const valorRiesgoResidual = valorIR && valorPR ? (parseInt(valorIR) * parseInt(valorPR)).toString() : "";
      
      setRows(prev =>
        prev.map(row => {
          if (row.id === id) {
            const updated = { ...row, [field]: value, valorRiesgoResidual };
            return updated;
          }
          return row;
        })
      );
    } else {
      setRows(prev =>
        prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
      );
    }

    // mark this row as edited
    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows(prev => [
      ...prev,
      {
        id: newId,
        codigoRiesgo: "",
        descripcionRiesgo: "",
        gestion: "",
        factorRiesgo: "",
        categoriaRiesgoNivel1: "",
        impactoReputacional: "",
        impactoLegal: "",
        impactoEconomico: "",
        impactoVidasHumanas: "",
        responsableRiesgo: "",
        impactoResidual: "",
        valorIR: "",
        probabilidadResidual: "",
        valorPR: "",
        valorRiesgoResidual: "",
        severidadRiesgoResidual: "",
      },
    ]);
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
      "Efectividad SIAR"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "efectividad-siar.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.codigoRiesgo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.descripcionRiesgo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.gestion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.responsableRiesgo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tabla de Medición de Probabilidad
  const probabilidadData = [
    {
      escala: "5",
      posibilidad: "Casi Certeza",
      probabilidadMatematica: "Se espera que ocurra en la mayoría de las circunstancias.",
      frecuencia: "Mayor al 80%",
      frecuenciaDetalle: "El evento puede ocurrir cada 5 operaciones",
    },
    {
      escala: "4",
      posibilidad: "Probable",
      probabilidadMatematica: "Probablemente ocurrirá en la mayoría de las circunstancias.",
      frecuencia: "Entre el 60% y el 80%",
      frecuenciaDetalle: "El evento puede ocurrir cada 20 Operaciones",
    },
    {
      escala: "3",
      posibilidad: "Posible",
      probabilidadMatematica: "Podría ocurrir en algún momento.",
      frecuencia: "entre el 40% y el 60%",
      frecuenciaDetalle: "El evento puede ocurrir cada 50 operaciones",
    },
    {
      escala: "2",
      posibilidad: "Improbable",
      probabilidadMatematica: "Es difícil que ocurra.",
      frecuencia: "Entre el 20 y el 40%",
      frecuenciaDetalle: "El evento puede ocurrir cada 100 operaciones",
    },
    {
      escala: "1",
      posibilidad: "Inusual",
      probabilidadMatematica: "Puede ocurrir sólo en circunstancias excepcionales.",
      frecuencia: "Menor al 20%",
      frecuenciaDetalle: "El evento puede ocurrir cada 1000 Operaciones",
    },
  ];

  // Tabla de Medición de Impacto
  const impactoData = [
    {
      escala: "5",
      criterio: "Catastrófico",
      descripcion: "Perjuicios que generan importantes problemas de funcionamiento, pérdidas financieras, legales y de reputación.",
      reputacional: "Efecto publicitario sostenido a nivel país, pérdida de asociados en gran escala, intervención y sanciones de organismo regulador, implicación directa para el consejo de administración y Gerencia.",
      financiero: "Pérdidas superiores 500 SMMLV",
      legal: "Sanciones para Coofisam, directivos, asociados y administradores implicando el cierre o pagos de altas indemnizaciones a terceros afectando el patrimonio. Procesos penales a directivos, asociados y administradores.",
      vidasHumanas: "Lesiones o muerte de empleados o terceras partes.",
    },
    {
      escala: "4",
      criterio: "Mayor",
      descripcion: "Perjuicios extensivos que generan pérdida en la capacidad de producción y que generan riesgos asociados importantes.",
      reputacional: "Efecto publicitario sostenido parcial a nivel país, serias pérdidas de asociados, requerimiento formal o investigación organismo regulatorio, implicación de Gerencia.",
      financiero: "Pérdidas >300 - 500 SMMLV",
      legal: "Sanciones mayores a Coofisam y empleados. Procesos penales en contra de empleados.",
      vidasHumanas: "Hospitalización e incapacidad de tres (3) a seis (6) meses de empleados o terceras partes.",
    },
    {
      escala: "3",
      criterio: "Moderado",
      descripcion: "Perjuicios que se controlan localmente y/o con asistencia externa y que pueden generar riesgos asociados.",
      reputacional: "Efecto publicitario en el país limitado, gran incremento en reclamos de asociados, alguna pérdida de asociados, requerimiento informal de organismo regulador, posible implicación de la Gerencia.",
      financiero: "Pérdidas >80 - 300 SMMLV",
      legal: "Sanciones moderadas a Coofisam y/o empleados. Requerimientos de ente de supervisión con acciones correctivas inmediatas.",
      vidasHumanas: "Tratamiento médico de mediano impacto a empleados o terceras partes.",
    },
    {
      escala: "2",
      criterio: "Menor",
      descripcion: "Pocos perjuicios que se controlan, local e inmediatamente.",
      reputacional: "Efecto publicitario local o en la industria limitado, incremento en reclamos de asociados, posible cierre de cuentas.",
      financiero: "Pérdidas >10 - 80 SMMLV",
      legal: "Llamadas de atención por parte del ente de Supervisión y reporte de incidentes menores al ente de Supervisión.",
      vidasHumanas: "Incapacidad de algunos días de empleados o terceras partes.",
    },
    {
      escala: "1",
      criterio: "Bajo",
      descripcion: "No genera perjuicios.",
      reputacional: "Sin efecto publicitario, incremento en reclamos de Asociados",
      financiero: "Pérdidas de hasta 10 SMMLV",
      legal: "Sin reportes al ente de Supervisión.",
      vidasHumanas: "No requiere tratamiento médico.",
    },
  ];

  // Escala de Perfil de Riesgo
  const perfilRiesgoData = [
    {
      perfil: "BAJO",
      desde: "0%",
      hasta: "<= 16%",
      cuadrante: "Verde",
    },
    {
      perfil: "MODERADO",
      desde: "> 16%",
      hasta: "<= 36%",
      cuadrante: "Amarillo",
    },
    {
      perfil: "ALTO",
      desde: "> 36%",
      hasta: "<= 64%",
      cuadrante: "Naranja",
    },
    {
      perfil: "EXTREMO",
      desde: "> 64%",
      hasta: "100%",
      cuadrante: "Rojo",
    },
  ];

  const getCuadranteColor = (cuadrante) => {
    switch (cuadrante) {
      case "Verde":
        return "bg-green-200";
      case "Amarillo":
        return "bg-yellow-200";
      case "Naranja":
        return "bg-orange-200";
      case "Rojo":
        return "bg-red-200";
      default:
        return "";
    }
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Efectividad SIAR
      </h1>
      
      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab("efectividad")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "efectividad"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Efectividad SIAR
        </button>
        <button
          onClick={() => setActiveTab("probabilidad")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "probabilidad"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Medición de Probabilidad
        </button>
        <button
          onClick={() => setActiveTab("impacto")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "impacto"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Medición de Impacto
        </button>
        <button
          onClick={() => setActiveTab("perfil")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "perfil"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Escala de Perfil de Riesgo
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "efectividad" && (
        <>
          <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por código, descripción, gestión o responsable"
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
          <button
            onClick={handleAddRow}
            className="unified-button flex gap-2 items-center justify-center"
          >
            Agregar Fila
          </button>
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
                CÓDIGO DEL RIESGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DESCRIPCIÓN DEL RIESGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">GESTIÓN</th>
              <th className="p-4 border text-center whitespace-nowrap">
                FACTOR DE RIESGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CATEGORÍA DE RIESGO NIVEL 1
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                IMPACTO REPUTACIONAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                IMPACTO LEGAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                IMPACTO ECONÓMICO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                IMPACTO VIDAS HUMANAS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                RESPONSABLE DEL RIESGO (CARGO)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                IMPACTO RESIDUAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR I-R
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                PROBABILIDAD RESIDUAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR P-R
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR RIESGO RESIDUAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                SEVERIDAD DEL RIESGO RESIDUAL
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    value={r.codigoRiesgo}
                    onChange={e =>
                      handleChange(r.id, "codigoRiesgo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Código"
                  />
                </td>
                <td className="p-2 border text-left">
                  <textarea
                    value={r.descripcionRiesgo}
                    onChange={e =>
                      handleChange(r.id, "descripcionRiesgo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm resize-none"
                    placeholder="Descripción del riesgo"
                    rows="3"
                  />
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
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.factorRiesgo}
                    onChange={e =>
                      handleChange(r.id, "factorRiesgo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {factorRiesgoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.categoriaRiesgoNivel1}
                    onChange={e =>
                      handleChange(r.id, "categoriaRiesgoNivel1", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {categoriaRiesgoNivel1Options.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.impactoReputacional}
                    onChange={e =>
                      handleChange(r.id, "impactoReputacional", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {impactoReputacionalOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.impactoLegal}
                    onChange={e =>
                      handleChange(r.id, "impactoLegal", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {impactoLegalOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.impactoEconomico}
                    onChange={e =>
                      handleChange(r.id, "impactoEconomico", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {impactoEconomicoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.impactoVidasHumanas}
                    onChange={e =>
                      handleChange(r.id, "impactoVidasHumanas", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {impactoVidasHumanasOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.responsableRiesgo}
                    onChange={e =>
                      handleChange(r.id, "responsableRiesgo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {responsableRiesgoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.impactoResidual}
                    onChange={e =>
                      handleChange(r.id, "impactoResidual", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {impactoResidualOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.valorIR}
                    onChange={e =>
                      handleChange(r.id, "valorIR", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="I-R"
                    min="1"
                    max="5"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.probabilidadResidual}
                    onChange={e =>
                      handleChange(r.id, "probabilidadResidual", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {probabilidadResidualOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.valorPR}
                    onChange={e =>
                      handleChange(r.id, "valorPR", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="P-R"
                    min="1"
                    max="5"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    value={r.valorRiesgoResidual}
                    readOnly
                    className="w-full border-none outline-none bg-transparent text-sm text-center bg-gray-100"
                    placeholder="Calculado (I-R × P-R)"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.severidadRiesgoResidual}
                    onChange={e =>
                      handleChange(r.id, "severidadRiesgoResidual", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {severidadRiesgoResidualOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}

      {activeTab === "probabilidad" && (
        <div className="overflow-x-auto max-w-full table-container h-[65vh]">
          <h2 className="text-2xl font-semibold mb-4">TABLA DE MEDICIÓN DE LA PROBABILIDAD</h2>
          <table className="table-auto border-collapse w-full">
            <thead className="tabla-header">
              <tr>
                <th className="p-4 border text-center whitespace-nowrap">ESCALA</th>
                <th className="p-4 border text-center whitespace-nowrap">POSIBILIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">PROBABILIDAD MATEMÁTICA</th>
                <th className="p-4 border text-center whitespace-nowrap">FRECUENCIA</th>
                <th className="p-4 border text-center whitespace-nowrap">DETALLE FRECUENCIA</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content">
              {probabilidadData.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-3 border text-center font-semibold">{row.escala}</td>
                  <td className="p-3 border text-left">{row.posibilidad}</td>
                  <td className="p-3 border text-left">{row.probabilidadMatematica}</td>
                  <td className="p-3 border text-center">{row.frecuencia}</td>
                  <td className="p-3 border text-left">{row.frecuenciaDetalle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "impacto" && (
        <div className="overflow-x-auto max-w-full table-container h-[65vh]">
          <h2 className="text-2xl font-semibold mb-4">TABLA DE MEDICIÓN DE IMPACTO</h2>
          <table className="table-auto border-collapse w-full">
            <thead className="tabla-header">
              <tr>
                <th className="p-4 border text-center whitespace-nowrap">ESCALA</th>
                <th className="p-4 border text-center whitespace-nowrap">CRITERIO SUPERSOLIDARIA</th>
                <th className="p-4 border text-center whitespace-nowrap">DESCRIPCIÓN</th>
                <th className="p-4 border text-center whitespace-nowrap">REPUTACIONAL</th>
                <th className="p-4 border text-center whitespace-nowrap">FINANCIERO</th>
                <th className="p-4 border text-center whitespace-nowrap">LEGAL</th>
                <th className="p-4 border text-center whitespace-nowrap">VIDAS HUMANAS</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content">
              {impactoData.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-3 border text-center font-semibold">{row.escala}</td>
                  <td className="p-3 border text-left font-semibold">{row.criterio}</td>
                  <td className="p-3 border text-left text-sm">{row.descripcion}</td>
                  <td className="p-3 border text-left text-sm">{row.reputacional}</td>
                  <td className="p-3 border text-left text-sm">{row.financiero}</td>
                  <td className="p-3 border text-left text-sm">{row.legal}</td>
                  <td className="p-3 border text-left text-sm">{row.vidasHumanas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "perfil" && (
        <div className="overflow-x-auto max-w-full table-container h-[65vh]">
          <h2 className="text-2xl font-semibold mb-4">ESCALA DE PERFIL DE RIESGO</h2>
          <table className="table-auto border-collapse w-full">
            <thead className="tabla-header">
              <tr>
                <th className="p-4 border text-center whitespace-nowrap">PERFIL DE RIESGO</th>
                <th className="p-4 border text-center whitespace-nowrap">DESDE</th>
                <th className="p-4 border text-center whitespace-nowrap">HASTA</th>
                <th className="p-4 border text-center whitespace-nowrap">CUADRANTE</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content">
              {perfilRiesgoData.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-3 border text-center font-semibold">{row.perfil}</td>
                  <td className="p-3 border text-center">{row.desde}</td>
                  <td className="p-3 border text-center">{row.hasta}</td>
                  <td className={`p-3 border text-center font-semibold ${getCuadranteColor(row.cuadrante)}`}>
                    {row.cuadrante}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

