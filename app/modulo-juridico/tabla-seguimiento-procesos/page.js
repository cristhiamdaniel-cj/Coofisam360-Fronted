"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
// Format: 16/02/2018 -> 2018-02-16
const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Helper function to convert date input to date string
// Format: 2018-02-16 -> 16/02/2018
const fromDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// Helper function to parse money value
const parseMoney = (value) => {
  if (!value) return "";
  return value.toString().replace(/\$|\.| /g, "").trim();
};

// Initial data
const initialRows = [
  {
    id: 1,
    numeroRadicado: "41298310500120180000800",
    demandante: "Henry Arturo Carvajal Rojas y Nelsy Rojas Cuenca",
    demandado: "Cooperativa De Ahorro y Crédito San Miguel - COOFISAM",
    calidad: "Demandado",
    abogadoResponsable: "Ambrocio López Meléndez",
    numeroContactoAbogado: "",
    correoElectronicoAbogado: "",
    cuantia: "12840000",
    tipoProceso: "Laboral",
    claseProceso: "Ordinario laboral",
    tipoDespachoJudicialPrimeraInstancia: "Juzgado Laboral del Circuito",
    numeracionJuzgado: "1",
    jurisdiccionPrimeraInstancia: "Ordinaria",
    municipioPrimeraInstancia: "Garzón",
    departamentoPrimeraInstancia: "Huila",
    autoAdmisorioPrimeraInstancia: "16/02/2018",
    fechaDecisionPrimeraInstancia: "11/07/2018",
    decisionPrimeraInstancia: "Concede Total las Pretensiones",
    huboRecursoPrimeraInstancia: "Si",
    tipoRecursoPrimeraInstancia: "Apelación",
    quienInterpusoPrimeraInstancia: "Demandado",
    autoAdmisorioSegundaInstancia: "24/07/2018",
    tipoDespachoJudicialSegundaInstancia: "Tribunal Superior de Distrito Judicial",
    especialidadSegundaInstancia: "Sala Civil - Familia – Laboral",
    municipioSegundaInstancia: "Neiva",
    departamentoSegundaInstancia: "Huila",
    fechaDecisionSegundaInstancia: "",
    decisionSegundaInstancia: "",
    huboRecursoSegundaInstancia: "",
    quienInterpusoSegundaInstancia: "",
    tipoRecursoExtraordinario: "",
    tipoDespachoExtraordinario: "",
    fechaAutoAdmisorioRecursoExtraordinario: "",
    fechaDecisionRecursoExtraordinario: "",
    decisionRecursoExtraordinario: "",
    fechaEjecutoriaProcesoFinal: "",
    tiempoTotalProceso: "-120",
    valorRepresentacion: "",
    tipoReconocimiento: "",
    valorReconocimiento: "",
    estadoActual: "Activo – En trámite",
    etapaActual: "Segunda instancia",
    ultimaActuacion: "14/02/2023",
    tipoActuacion: "Interposición de recurso de apelación",
    observaciones: "",
  },
  {
    id: 2,
    numeroRadicado: "41001333300220180024600",
    demandante: "Gloria Maritza Cáceres Caballero, Daniel Humberto Salgado Cáceres, Humberto Salgado y Yohan Sebastián Salgado Cáceres",
    demandado: "Cooperativa De Ahorro y Crédito San Miguel - COOFISAM",
    calidad: "Tercero interesado",
    abogadoResponsable: "Andrés Sandino",
    numeroContactoAbogado: "",
    correoElectronicoAbogado: "",
    cuantia: "503305937",
    tipoProceso: "Administrativo / Contencioso administrativo",
    claseProceso: "Reparación directa",
    tipoDespachoJudicialPrimeraInstancia: "Juzgado Administrativo",
    numeracionJuzgado: "2",
    jurisdiccionPrimeraInstancia: "Ordinaria",
    municipioPrimeraInstancia: "Neiva",
    departamentoPrimeraInstancia: "Huila",
    autoAdmisorioPrimeraInstancia: "24/07/2018",
    fechaDecisionPrimeraInstancia: "12/04/2021",
    decisionPrimeraInstancia: "Niega",
    huboRecursoPrimeraInstancia: "Si",
    tipoRecursoPrimeraInstancia: "Apelación",
    quienInterpusoPrimeraInstancia: "Demandante",
    autoAdmisorioSegundaInstancia: "28/09/2021",
    tipoDespachoJudicialSegundaInstancia: "Tribunal Administrativo",
    especialidadSegundaInstancia: "Sin Sección",
    municipioSegundaInstancia: "Neiva",
    departamentoSegundaInstancia: "Huila",
    fechaDecisionSegundaInstancia: "",
    decisionSegundaInstancia: "",
    huboRecursoSegundaInstancia: "",
    quienInterpusoSegundaInstancia: "",
    tipoRecursoExtraordinario: "",
    tipoDespachoExtraordinario: "",
    fechaAutoAdmisorioRecursoExtraordinario: "",
    fechaDecisionRecursoExtraordinario: "",
    decisionRecursoExtraordinario: "",
    fechaEjecutoriaProcesoFinal: "",
    tiempoTotalProceso: "-120",
    valorRepresentacion: "",
    tipoReconocimiento: "",
    valorReconocimiento: "",
    estadoActual: "Activo – En trámite",
    etapaActual: "Segunda instancia",
    ultimaActuacion: "20/09/2023",
    tipoActuacion: "Solicitud de pruebas",
    observaciones: "",
  },
  {
    id: 3,
    numeroRadicado: "41001333300520170027200",
    demandante: "Dioselina Sarrias Vargas, Edwin Gerardo Benavides Sarrias, Fernando Vargas Castro, Gerardo Benavides Gutierrez, Maira Alexandra Leal Cruz, Marleny Zamora Bedoya, Melida Olarte, Nelson Reyes Osma Nelson Reyes Osma y Yadira Fernanda Reyes Zamora",
    demandado: "Cooperativa De Ahorro y Crédito San Miguel - COOFISAM",
    calidad: "Tercero interesado",
    abogadoResponsable: "Andrés Sandino",
    numeroContactoAbogado: "",
    correoElectronicoAbogado: "",
    cuantia: "1103667952",
    tipoProceso: "Administrativo / Contencioso administrativo",
    claseProceso: "Reparación directa",
    tipoDespachoJudicialPrimeraInstancia: "Juzgado Administrativo",
    numeracionJuzgado: "5",
    jurisdiccionPrimeraInstancia: "Ordinaria",
    municipioPrimeraInstancia: "Neiva",
    departamentoPrimeraInstancia: "Huila",
    autoAdmisorioPrimeraInstancia: "12/10/2017",
    fechaDecisionPrimeraInstancia: "30/07/2024",
    decisionPrimeraInstancia: "Niega",
    huboRecursoPrimeraInstancia: "Si",
    tipoRecursoPrimeraInstancia: "Apelación",
    quienInterpusoPrimeraInstancia: "Demandante",
    autoAdmisorioSegundaInstancia: "12/02/2025",
    tipoDespachoJudicialSegundaInstancia: "Tribunal Administrativo",
    especialidadSegundaInstancia: "Sin Sección",
    municipioSegundaInstancia: "Neiva",
    departamentoSegundaInstancia: "Huila",
    fechaDecisionSegundaInstancia: "",
    decisionSegundaInstancia: "",
    huboRecursoSegundaInstancia: "",
    quienInterpusoSegundaInstancia: "",
    tipoRecursoExtraordinario: "",
    tipoDespachoExtraordinario: "",
    fechaAutoAdmisorioRecursoExtraordinario: "",
    fechaDecisionRecursoExtraordinario: "",
    decisionRecursoExtraordinario: "",
    fechaEjecutoriaProcesoFinal: "",
    tiempoTotalProceso: "-120",
    valorRepresentacion: "",
    tipoReconocimiento: "",
    valorReconocimiento: "",
    estadoActual: "Activo – En trámite",
    etapaActual: "Segunda instancia",
    ultimaActuacion: "27/04/2022",
    tipoActuacion: "Presentación de alegatos de conclusión",
    observaciones: "",
  },
  {
    id: 4,
    numeroRadicado: "41001310500120240049400",
    demandante: "Nataly Tatiana Lozano Rey",
    demandado: "Cooperativa De Ahorro y Crédito San Miguel - COOFISAM",
    calidad: "Demandado",
    abogadoResponsable: "Piloneta Alvarez S.A",
    numeroContactoAbogado: "",
    correoElectronicoAbogado: "",
    cuantia: "34819410",
    tipoProceso: "Laboral",
    claseProceso: "Ordinario laboral",
    tipoDespachoJudicialPrimeraInstancia: "Juzgado Laboral del Circuito",
    numeracionJuzgado: "1",
    jurisdiccionPrimeraInstancia: "Ordinaria",
    municipioPrimeraInstancia: "Neiva",
    departamentoPrimeraInstancia: "Huila",
    autoAdmisorioPrimeraInstancia: "16/01/2025",
    fechaDecisionPrimeraInstancia: "26/08/2024",
    decisionPrimeraInstancia: "Concede Total las Pretensiones",
    huboRecursoPrimeraInstancia: "Si",
    tipoRecursoPrimeraInstancia: "Apelación",
    quienInterpusoPrimeraInstancia: "Demandado",
    autoAdmisorioSegundaInstancia: "11/09/2025",
    tipoDespachoJudicialSegundaInstancia: "Tribunal Superior de Distrito Judicial",
    especialidadSegundaInstancia: "Sala Civil - Familia – Laboral",
    municipioSegundaInstancia: "Neiva",
    departamentoSegundaInstancia: "Huila",
    fechaDecisionSegundaInstancia: "",
    decisionSegundaInstancia: "",
    huboRecursoSegundaInstancia: "",
    quienInterpusoSegundaInstancia: "",
    tipoRecursoExtraordinario: "",
    tipoDespachoExtraordinario: "",
    fechaAutoAdmisorioRecursoExtraordinario: "",
    fechaDecisionRecursoExtraordinario: "",
    decisionRecursoExtraordinario: "",
    fechaEjecutoriaProcesoFinal: "",
    tiempoTotalProceso: "-127",
    valorRepresentacion: "14235000",
    tipoReconocimiento: "",
    valorReconocimiento: "",
    estadoActual: "Activo – En trámite",
    etapaActual: "Segunda instancia",
    ultimaActuacion: "26/08/2025",
    tipoActuacion: "Presentación de alegatos de conclusión",
    observaciones: "",
  },
];

// Options for dropdowns
const demandadoOptions = [
  "Cooperativa De Ahorro y Crédito San Miguel - COOFISAM",
  "",
];

const calidadOptions = [
  "Demandado",
  "Demandante",
  "Tercero interesado",
  "",
];

const tipoProcesoOptions = [
  "Laboral",
  "Administrativo / Contencioso administrativo",
  "Civil",
  "Penal",
  "Comercial",
  "",
];

const claseProcesoOptions = [
  "Ordinario laboral",
  "Reparación directa",
  "Ejecutivo",
  "Verbal",
  "Sumario",
  "",
];

const tipoDespachoJudicialPrimeraInstanciaOptions = [
  "Juzgado Laboral del Circuito",
  "Juzgado Administrativo",
  "Juzgado Civil del Circuito",
  "Juzgado Penal del Circuito",
  "Juzgado de Familia",
  "",
];

const jurisdiccionPrimeraInstanciaOptions = [
  "Ordinaria",
  "Contencioso administrativo",
  "Laboral",
  "",
];

const municipioPrimeraInstanciaOptions = [
  "Garzón",
  "Neiva",
  "Bogotá D.C.",
  "",
];

const departamentoPrimeraInstanciaOptions = [
  "Huila",
  "Cundinamarca",
  "Antioquia",
  "",
];

const decisionPrimeraInstanciaOptions = [
  "Concede Total las Pretensiones",
  "Niega",
  "Concede Parcial las Pretensiones",
  "",
];

const huboRecursoPrimeraInstanciaOptions = ["Si", "No", ""];

const tipoRecursoPrimeraInstanciaOptions = [
  "Apelación",
  "Reposición",
  "Queja",
  "",
];

const quienInterpusoPrimeraInstanciaOptions = [
  "Demandado",
  "Demandante",
  "Tercero",
  "",
];

const tipoDespachoJudicialSegundaInstanciaOptions = [
  "Tribunal Superior de Distrito Judicial",
  "Tribunal Administrativo",
  "Corte Suprema de Justicia",
  "",
];

const especialidadSegundaInstanciaOptions = [
  "Sala Civil - Familia – Laboral",
  "Sin Sección",
  "Sala Penal",
  "",
];

const municipioSegundaInstanciaOptions = [
  "Neiva",
  "Bogotá D.C.",
  "",
];

const departamentoSegundaInstanciaOptions = [
  "Huila",
  "Cundinamarca",
  "",
];

const decisionSegundaInstanciaOptions = [
  "Confirma",
  "Revoca",
  "Modifica",
  "",
];

const huboRecursoSegundaInstanciaOptions = ["Si", "No", ""];

const quienInterpusoSegundaInstanciaOptions = [
  "Demandado",
  "Demandante",
  "Tercero",
  "",
];

const tipoRecursoExtraordinarioOptions = [
  "Casoación",
  "Revisión",
  "",
];

const tipoDespachoExtraordinarioOptions = [
  "Corte Suprema de Justicia",
  "Consejo de Estado",
  "",
];

const decisionRecursoExtraordinarioOptions = [
  "Confirma",
  "Revoca",
  "Modifica",
  "",
];

const tipoReconocimientoOptions = [
  "Total",
  "Parcial",
  "Ninguno",
  "",
];

const estadoActualOptions = [
  "Activo – En trámite",
  "Finalizado",
  "Archivado",
  "Suspendido",
  "",
];

const etapaActualOptions = [
  "Primera instancia",
  "Segunda instancia",
  "Recurso extraordinario",
  "Ejecución",
  "",
];

const tipoActuacionOptions = [
  "Interposición de recurso de apelación",
  "Solicitud de pruebas",
  "Presentación de alegatos de conclusión",
  "Notificación",
  "Audiencia",
  "",
];

export default function SeguimientoProcesosTable() {
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

  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows(prev => [
      ...prev,
      {
        id: newId,
        numeroRadicado: "",
        demandante: "",
        demandado: "",
        calidad: "",
        abogadoResponsable: "",
        numeroContactoAbogado: "",
        correoElectronicoAbogado: "",
        cuantia: "",
        tipoProceso: "",
        claseProceso: "",
        tipoDespachoJudicialPrimeraInstancia: "",
        numeracionJuzgado: "",
        jurisdiccionPrimeraInstancia: "",
        municipioPrimeraInstancia: "",
        departamentoPrimeraInstancia: "",
        autoAdmisorioPrimeraInstancia: "",
        fechaDecisionPrimeraInstancia: "",
        decisionPrimeraInstancia: "",
        huboRecursoPrimeraInstancia: "",
        tipoRecursoPrimeraInstancia: "",
        quienInterpusoPrimeraInstancia: "",
        autoAdmisorioSegundaInstancia: "",
        tipoDespachoJudicialSegundaInstancia: "",
        especialidadSegundaInstancia: "",
        municipioSegundaInstancia: "",
        departamentoSegundaInstancia: "",
        fechaDecisionSegundaInstancia: "",
        decisionSegundaInstancia: "",
        huboRecursoSegundaInstancia: "",
        quienInterpusoSegundaInstancia: "",
        tipoRecursoExtraordinario: "",
        tipoDespachoExtraordinario: "",
        fechaAutoAdmisorioRecursoExtraordinario: "",
        fechaDecisionRecursoExtraordinario: "",
        decisionRecursoExtraordinario: "",
        fechaEjecutoriaProcesoFinal: "",
        tiempoTotalProceso: "",
        valorRepresentacion: "",
        tipoReconocimiento: "",
        valorReconocimiento: "",
        estadoActual: "",
        etapaActual: "",
        ultimaActuacion: "",
        tipoActuacion: "",
        observaciones: "",
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
      "Seguimiento Procesos"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "seguimiento-procesos.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.numeroRadicado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.demandante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.demandado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.abogadoResponsable?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Seguimiento de Procesos
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por radicado, demandante, demandado o abogado"
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
                NÚMERO DE RADICADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DEMANDANTE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DEMANDADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">CALIDAD</th>
              <th className="p-4 border text-center whitespace-nowrap">
                ABOGADO RESPONSABLE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NUMERO CONTACTO ABOGADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CORREO ELECTRONICO ABOGADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CUANTIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO PROCESO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CLASE PROCESO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE DESPACHO JUDICIAL PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NUMERACIÓN DE JUZGADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                JURISDICCIÓN PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MUNICIPIO PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DEPARTAMENTO PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                AUTO ADMISORIO PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DECISIÓN PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DECISIÓN PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ¿HUBO RECURSO? PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE RECURSO PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ¿QUIÉN LO INTERPUSO? PRIMERA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                AUTO ADMISORIO SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE DESPACHO JUDICIAL SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESPECIALIDAD SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MUNICIPIO SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DEPARTAMENTO SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DECISIÓN SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DECISIÓN SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ¿HUBO RECURSO? SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ¿QUIÉN LO INTERPUSO? SEGUNDA INSTANCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE RECURSO EXTRAORDINARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE DESPACHO EXTRAORDINARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA AUTO ADMISORIO RECURSO EXTRAORDINARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DECISIÓN RECURSO EXTRAORDINARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DECISIÓN RECURSO EXTRAORDINARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE EJECUTORIA PROCESO FINAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIEMPO TOTAL DEL PROCESO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR DE REPRESENTACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE RECONOCIMIENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR RECONOCIMIENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO ACTUAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ETAPA ACTUAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ULTIMA ACTUACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE ACTUACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                OBSERVACIONES
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.numeroRadicado}
                    onChange={e =>
                      handleChange(r.id, "numeroRadicado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Número de radicado"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.demandante}
                    onChange={e =>
                      handleChange(r.id, "demandante", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Demandante"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.demandado}
                    onChange={e =>
                      handleChange(r.id, "demandado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {demandadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.calidad}
                    onChange={e => handleChange(r.id, "calidad", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {calidadOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.abogadoResponsable}
                    onChange={e =>
                      handleChange(r.id, "abogadoResponsable", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Abogado responsable"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.numeroContactoAbogado}
                    onChange={e =>
                      handleChange(r.id, "numeroContactoAbogado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Número contacto"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="email"
                    value={r.correoElectronicoAbogado}
                    onChange={e =>
                      handleChange(r.id, "correoElectronicoAbogado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Correo electrónico"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.cuantia}
                    onChange={e =>
                      handleChange(r.id, "cuantia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Cuantía"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoProceso}
                    onChange={e =>
                      handleChange(r.id, "tipoProceso", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoProcesoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.claseProceso}
                    onChange={e =>
                      handleChange(r.id, "claseProceso", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {claseProcesoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoDespachoJudicialPrimeraInstancia}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "tipoDespachoJudicialPrimeraInstancia",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoDespachoJudicialPrimeraInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.numeracionJuzgado}
                    onChange={e =>
                      handleChange(r.id, "numeracionJuzgado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Número"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.jurisdiccionPrimeraInstancia}
                    onChange={e =>
                      handleChange(r.id, "jurisdiccionPrimeraInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {jurisdiccionPrimeraInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.municipioPrimeraInstancia}
                    onChange={e =>
                      handleChange(r.id, "municipioPrimeraInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {municipioPrimeraInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.departamentoPrimeraInstancia}
                    onChange={e =>
                      handleChange(r.id, "departamentoPrimeraInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {departamentoPrimeraInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.autoAdmisorioPrimeraInstancia)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "autoAdmisorioPrimeraInstancia",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaDecisionPrimeraInstancia)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaDecisionPrimeraInstancia",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.decisionPrimeraInstancia}
                    onChange={e =>
                      handleChange(r.id, "decisionPrimeraInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {decisionPrimeraInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.huboRecursoPrimeraInstancia}
                    onChange={e =>
                      handleChange(r.id, "huboRecursoPrimeraInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {huboRecursoPrimeraInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoRecursoPrimeraInstancia}
                    onChange={e =>
                      handleChange(r.id, "tipoRecursoPrimeraInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoRecursoPrimeraInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.quienInterpusoPrimeraInstancia}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "quienInterpusoPrimeraInstancia",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {quienInterpusoPrimeraInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.autoAdmisorioSegundaInstancia)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "autoAdmisorioSegundaInstancia",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoDespachoJudicialSegundaInstancia}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "tipoDespachoJudicialSegundaInstancia",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoDespachoJudicialSegundaInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.especialidadSegundaInstancia}
                    onChange={e =>
                      handleChange(r.id, "especialidadSegundaInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {especialidadSegundaInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.municipioSegundaInstancia}
                    onChange={e =>
                      handleChange(r.id, "municipioSegundaInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {municipioSegundaInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.departamentoSegundaInstancia}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "departamentoSegundaInstancia",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {departamentoSegundaInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaDecisionSegundaInstancia)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaDecisionSegundaInstancia",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.decisionSegundaInstancia}
                    onChange={e =>
                      handleChange(r.id, "decisionSegundaInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {decisionSegundaInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.huboRecursoSegundaInstancia}
                    onChange={e =>
                      handleChange(r.id, "huboRecursoSegundaInstancia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {huboRecursoSegundaInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.quienInterpusoSegundaInstancia}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "quienInterpusoSegundaInstancia",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {quienInterpusoSegundaInstanciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoRecursoExtraordinario}
                    onChange={e =>
                      handleChange(r.id, "tipoRecursoExtraordinario", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoRecursoExtraordinarioOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoDespachoExtraordinario}
                    onChange={e =>
                      handleChange(r.id, "tipoDespachoExtraordinario", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoDespachoExtraordinarioOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaAutoAdmisorioRecursoExtraordinario)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaAutoAdmisorioRecursoExtraordinario",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaDecisionRecursoExtraordinario)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaDecisionRecursoExtraordinario",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.decisionRecursoExtraordinario}
                    onChange={e =>
                      handleChange(r.id, "decisionRecursoExtraordinario", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {decisionRecursoExtraordinarioOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaEjecutoriaProcesoFinal)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaEjecutoriaProcesoFinal",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.tiempoTotalProceso}
                    onChange={e =>
                      handleChange(r.id, "tiempoTotalProceso", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Días"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.valorRepresentacion}
                    onChange={e =>
                      handleChange(r.id, "valorRepresentacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Valor"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoReconocimiento}
                    onChange={e =>
                      handleChange(r.id, "tipoReconocimiento", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoReconocimientoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.valorReconocimiento}
                    onChange={e =>
                      handleChange(r.id, "valorReconocimiento", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Valor"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estadoActual}
                    onChange={e =>
                      handleChange(r.id, "estadoActual", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoActualOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.etapaActual}
                    onChange={e =>
                      handleChange(r.id, "etapaActual", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {etapaActualOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.ultimaActuacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "ultimaActuacion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoActuacion}
                    onChange={e =>
                      handleChange(r.id, "tipoActuacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoActuacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <textarea
                    value={r.observaciones}
                    onChange={e =>
                      handleChange(r.id, "observaciones", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm resize-none"
                    placeholder="Observaciones"
                    rows="2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}



