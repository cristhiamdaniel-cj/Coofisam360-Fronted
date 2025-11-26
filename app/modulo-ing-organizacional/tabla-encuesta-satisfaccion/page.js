"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to datetime-local format
const toDateTimeLocal = (dateStr) => {
  if (!dateStr) return "";
  // Format: 19/12/2024 14:16 -> 2024-12-19T14:16
  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("/");
  return `${year}-${month}-${day}T${timePart}`;
};

// Helper function to convert datetime-local to date string
const fromDateTimeLocal = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  // Format: 2024-12-19T14:16 -> 19/12/2024 14:16
  const [datePart, timePart] = dateTimeStr.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year} ${timePart}`;
};

// JSON data structure for satisfaction survey
const initialRows = [
  {
    id: 1,
    horaInicio: "19/12/2024 14:16",
    horaFinalizacion: "19/12/2024 14:17",
    correoElectronico: "cajeropitalito01@coofisam.com",
    nombre: "Lida Sofia Mosquera Mosquera",
    oficinaArea: "PITALITO",
    calidadDocumentos: "5",
    tiempoSuficiente: "Generalmente es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "N/A",
  },
  {
    id: 3,
    horaInicio: "19/12/2024 14:16",
    horaFinalizacion: "19/12/2024 14:17",
    correoElectronico: "cajerochaparral01@coofisam.com",
    nombre: "Victor Alfonso Rodriguez",
    oficinaArea: "CHAPARRAL",
    calidadDocumentos: "5",
    tiempoSuficiente: "Si, siempre es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "todo ok",
  },
  {
    id: 4,
    horaInicio: "19/12/2024 14:17",
    horaFinalizacion: "19/12/2024 14:18",
    correoElectronico: "gestorcartera@coofisam.com",
    nombre: "Daniela Yineth Suarez Llanos",
    oficinaArea: "Cartera",
    calidadDocumentos: "5",
    tiempoSuficiente: "Si, siempre es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Generalmente",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "no",
  },
  {
    id: 5,
    horaInicio: "19/12/2024 14:17",
    horaFinalizacion: "19/12/2024 14:19",
    correoElectronico: "gestiondocumental@coofisam.com",
    nombre: "Daniela Sierra Fierro",
    oficinaArea: "Gestion Documental",
    calidadDocumentos: "5",
    tiempoSuficiente: "A veces es suficiente",
    claridadComunicacion: "4",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "3",
    satisfaccionGeneral: "4",
    mejoras: "Tiempos de respuesta",
  },
  {
    id: 6,
    horaInicio: "19/12/2024 14:17",
    horaFinalizacion: "19/12/2024 14:19",
    correoElectronico: "subgerenciafinanciera@coofisam.com",
    nombre: "Claudia Patricia Fernandez Cediel",
    oficinaArea: "Financiera",
    calidadDocumentos: "5",
    tiempoSuficiente: "Generalmente es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "4",
    satisfaccionGeneral: "4",
    mejoras: "Lograr abarcar el seguimiento de todos los procesos de las diferentes áreas ya sea nuevo documento o actualizaciones.",
  },
  {
    id: 7,
    horaInicio: "19/12/2024 14:17",
    horaFinalizacion: "19/12/2024 14:22",
    correoElectronico: "directorespinal@coofisam.com",
    nombre: "Diana Marcela Gomez Rojas",
    oficinaArea: "Oficina Espinal",
    calidadDocumentos: "5",
    tiempoSuficiente: "Si, siempre es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "ninguna",
  },
  {
    id: 8,
    horaInicio: "19/12/2024 14:18",
    horaFinalizacion: "19/12/2024 14:22",
    correoElectronico: "gestorcartera01@coofisam.com",
    nombre: "Yeimy Carolina Galindo Paladines",
    oficinaArea: "crédito y cartera.",
    calidadDocumentos: "5",
    tiempoSuficiente: "Generalmente es suficiente",
    claridadComunicacion: "4",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "me siento bien con el área en el momento no tengo una sugerencia en el momento.",
  },
  {
    id: 9,
    horaInicio: "19/12/2024 14:21",
    horaFinalizacion: "19/12/2024 14:22",
    correoElectronico: "jefeoperacionesneiva@coofisam.com",
    nombre: "Nataly Tatiana Lozano Rey",
    oficinaArea: "NEIVA",
    calidadDocumentos: "3",
    tiempoSuficiente: "Generalmente es suficiente",
    claridadComunicacion: "4",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "La redacción a los procedimientos que publican.",
  },
  {
    id: 10,
    horaInicio: "19/12/2024 14:20",
    horaFinalizacion: "19/12/2024 14:23",
    correoElectronico: "auxiliarcarteragarzon02@coofisam.com",
    nombre: "Neira Fernanda Artunduaga Vargas",
    oficinaArea: "Agencia Garzón",
    calidadDocumentos: "4",
    tiempoSuficiente: "Si, siempre es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "El formato de paz y salvo, considero que el parágrafo debe ir con letra mas pequeña ya que se han presentado inconvenientes con asociados por este detalle",
  },
  {
    id: 11,
    horaInicio: "19/12/2024 14:23",
    horaFinalizacion: "19/12/2024 14:25",
    correoElectronico: "jefeoperacionesespinal@coofisam.com",
    nombre: "Judy Carolina Olave Lozano",
    oficinaArea: "JEFE OPERACIONES",
    calidadDocumentos: "5",
    tiempoSuficiente: "Si, siempre es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Generalmente",
    velocidadRespuesta: "4",
    satisfaccionGeneral: "4",
    mejoras: "Estan creando soluciones para mejorar los procesos, mil gracias.",
  },
  {
    id: 12,
    horaInicio: "19/12/2024 14:20",
    horaFinalizacion: "19/12/2024 14:25",
    correoElectronico: "cajeroacevedo01@coofisam.com",
    nombre: "Juan David Cueltan Barrera",
    oficinaArea: "Acevedo",
    calidadDocumentos: "5",
    tiempoSuficiente: "Generalmente es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Generalmente",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "En mi caso ninguna",
  },
  {
    id: 13,
    horaInicio: "19/12/2024 14:24",
    horaFinalizacion: "19/12/2024 14:26",
    correoElectronico: "auxiliarcredito03@coofisam.com",
    nombre: "Liseth Alejandra Carmona Melgar",
    oficinaArea: "AREA DE CREDITO",
    calidadDocumentos: "4",
    tiempoSuficiente: "Si, siempre es suficiente",
    claridadComunicacion: "4",
    abiertaAjustes: "A veces",
    velocidadRespuesta: "4",
    satisfaccionGeneral: "4",
    mejoras: "La distribución de la información ya que hay varios compañeros a los que no les llegan los correos que envían",
  },
  {
    id: 14,
    horaInicio: "19/12/2024 14:23",
    horaFinalizacion: "19/12/2024 14:26",
    correoElectronico: "gestorcartera05@coofisam.com",
    nombre: "Ingrid Julieth Navarro Garzon",
    oficinaArea: "Subgerencia de crédito y cartera - Cartera",
    calidadDocumentos: "5",
    tiempoSuficiente: "Si, siempre es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "Por el momento no.",
  },
  {
    id: 15,
    horaInicio: "19/12/2024 14:25",
    horaFinalizacion: "19/12/2024 14:27",
    correoElectronico: "gestorcartera06@coofisam.com",
    nombre: "Leidy Camila Garcia Mendez",
    oficinaArea: "Crédito Y Cartera",
    calidadDocumentos: "5",
    tiempoSuficiente: "Si, siempre es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "Sin novedad.",
  },
  {
    id: 16,
    horaInicio: "19/12/2024 14:24",
    horaFinalizacion: "19/12/2024 14:28",
    correoElectronico: "directorsuaza@coofisam.com",
    nombre: "Astrid Talero Cuellar",
    oficinaArea: "SUAZA",
    calidadDocumentos: "5",
    tiempoSuficiente: "Generalmente es suficiente",
    claridadComunicacion: "4",
    abiertaAjustes: "Generalmente",
    velocidadRespuesta: "4",
    satisfaccionGeneral: "5",
    mejoras: "Revisar documentos y procesos para actualizar y aclarar de acuerdo con las solicitudes que presentan las oficinas y que ellos validan",
  },
  {
    id: 17,
    horaInicio: "19/12/2024 14:26",
    horaFinalizacion: "19/12/2024 14:28",
    correoElectronico: "cajeroflorencia01@coofisam.com",
    nombre: "Jein Claros Romero",
    oficinaArea: "FLORENCIA",
    calidadDocumentos: "4",
    tiempoSuficiente: "Generalmente es suficiente",
    claridadComunicacion: "4",
    abiertaAjustes: "Generalmente",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "Los formularios del cupo rotativo tienen espacios muy pequeños",
  },
  {
    id: 18,
    horaInicio: "19/12/2024 14:23",
    horaFinalizacion: "19/12/2024 14:29",
    correoElectronico: "cajeroneiva02@coofisam.com",
    nombre: "Maria Alejandra Motta Escobar",
    oficinaArea: "NEIVA",
    calidadDocumentos: "5",
    tiempoSuficiente: "Generalmente es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "A veces",
    velocidadRespuesta: "4",
    satisfaccionGeneral: "4",
    mejoras: "mejor redacción",
  },
  {
    id: 19,
    horaInicio: "19/12/2024 14:18",
    horaFinalizacion: "19/12/2024 14:29",
    correoElectronico: "juridico01@coofisam.com",
    nombre: "Estella Andrea Gonzalez Elizalde",
    oficinaArea: "Administrativa",
    calidadDocumentos: "3",
    tiempoSuficiente: "A veces es suficiente",
    claridadComunicacion: "4",
    abiertaAjustes: "Rara vez",
    velocidadRespuesta: "4",
    satisfaccionGeneral: "4",
    mejoras: "Exigir más compromiso por las áreas para la apropiación de los procesos, informando novedades de actualización, de igual forma, garantizar que los procesos van acorde a las normas de Colombia.",
  },
  {
    id: 20,
    horaInicio: "19/12/2024 14:30",
    horaFinalizacion: "19/12/2024 14:33",
    correoElectronico: "jefeoperacionesiquira@coofisam.com",
    nombre: "Luisa Fernanda Cedeño Villegas",
    oficinaArea: "COMERCIAL",
    calidadDocumentos: "5",
    tiempoSuficiente: "Si, siempre es suficiente",
    claridadComunicacion: "5",
    abiertaAjustes: "Siempre",
    velocidadRespuesta: "5",
    satisfaccionGeneral: "5",
    mejoras: "Todo muy bien!",
  },
  {
    id: 21,
    horaInicio: "19/12/2024 14:22",
    horaFinalizacion: "19/12/2024 14:34",
    correoElectronico: "cajeroneiva01@coofisam.com",
    nombre: "Lucy del Socorro Diaz Ariza",
    oficinaArea: "NEIVA",
    calidadDocumentos: "4",
    tiempoSuficiente: "Generalmente es suficiente",
    claridadComunicacion: "4",
    abiertaAjustes: "A veces",
    velocidadRespuesta: "4",
    satisfaccionGeneral: "5",
    mejoras: "Unificar algunos procedimientos.",
  },
  {
    id: 22,
    horaInicio: "19/12/2024 14:30",
    horaFinalizacion: "19/12/2024 14:35",
    correoElectronico: "asistentesistemas03@coofisam.com",
    nombre: "Jorge Eduardo Plazas Diaz",
    oficinaArea: "Área Ciencia de Datos",
    calidadDocumentos: "4",
    tiempoSuficiente: "A veces es suficiente",
    claridadComunicacion: "4",
    abiertaAjustes: "A veces",
    velocidadRespuesta: "4",
    satisfaccionGeneral: "4",
    mejoras: "Actualización de la base de datos de la cooperativa, con el fin de darle un mejor análisis y toma decisiones.",
  },
];

// Options for dropdowns
const oficinasAreas = [
  "PITALITO",
  "CHAPARRAL",
  "Cartera",
  "Gestion Documental",
  "Financiera",
  "Oficina Espinal",
  "crédito y cartera.",
  "NEIVA",
  "Agencia Garzón",
  "JEFE OPERACIONES",
  "Acevedo",
  "AREA DE CREDITO",
  "Subgerencia de crédito y cartera - Cartera",
  "Crédito Y Cartera",
  "SUAZA",
  "FLORENCIA",
  "Administrativa",
  "COMERCIAL",
  "Área Ciencia de Datos",
];

const calificaciones = ["1", "2", "3", "4", "5"];

const tiempoSuficienteOptions = [
  "Si, siempre es suficiente",
  "Generalmente es suficiente",
  "A veces es suficiente",
];

const abiertaAjustesOptions = ["Siempre", "Generalmente", "A veces", "Rara vez"];

export default function EncuestaSatisfaccionTable() {
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
      "Encuesta Satisfaccion"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "encuesta-satisfaccion.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.correoElectronico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.oficinaArea?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Encuesta de Satisfacción
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o oficina"
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
                HORA DE INICIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                HORA DE FINALIZACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CORREO ELECTRÓNICO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">NOMBRE</th>
              <th className="p-4 border text-center whitespace-nowrap">
                OFICINA O ÁREA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CALIDAD DOCUMENTOS (1-5)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIEMPO SUFICIENTE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CLARIDAD COMUNICACIÓN (1-5)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ABIERTA A AJUSTES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VELOCIDAD RESPUESTA (1-5)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                SATISFACCIÓN GENERAL (1-5)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MEJORAS SUGERIDAS
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-left">
                  <input
                    type="datetime-local"
                    value={toDateTimeLocal(r.horaInicio)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "horaInicio",
                        fromDateTimeLocal(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="datetime-local"
                    value={toDateTimeLocal(r.horaFinalizacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "horaFinalizacion",
                        fromDateTimeLocal(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="email"
                    value={r.correoElectronico}
                    onChange={e =>
                      handleChange(r.id, "correoElectronico", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="correo@coofisam.com"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nombre}
                    onChange={e => handleChange(r.id, "nombre", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Nombre completo"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.oficinaArea}
                    onChange={e =>
                      handleChange(r.id, "oficinaArea", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar oficina/área</option>
                    {oficinasAreas.map(oficina => (
                      <option key={oficina} value={oficina}>
                        {oficina}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.calidadDocumentos}
                    onChange={e =>
                      handleChange(r.id, "calidadDocumentos", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {calificaciones.map(cal => (
                      <option key={cal} value={cal}>
                        {cal}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tiempoSuficiente}
                    onChange={e =>
                      handleChange(r.id, "tiempoSuficiente", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tiempoSuficienteOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.claridadComunicacion}
                    onChange={e =>
                      handleChange(r.id, "claridadComunicacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {calificaciones.map(cal => (
                      <option key={cal} value={cal}>
                        {cal}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.abiertaAjustes}
                    onChange={e =>
                      handleChange(r.id, "abiertaAjustes", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {abiertaAjustesOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.velocidadRespuesta}
                    onChange={e =>
                      handleChange(r.id, "velocidadRespuesta", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {calificaciones.map(cal => (
                      <option key={cal} value={cal}>
                        {cal}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.satisfaccionGeneral}
                    onChange={e =>
                      handleChange(r.id, "satisfaccionGeneral", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {calificaciones.map(cal => (
                      <option key={cal} value={cal}>
                        {cal}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.mejoras}
                    onChange={e => handleChange(r.id, "mejoras", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Ingrese sugerencias de mejora"
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
