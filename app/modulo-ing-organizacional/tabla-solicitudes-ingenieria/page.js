"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
const toDateInput = dateStr => {
  if (!dateStr) return "";
  // Format: 02/01/2025 -> 2025-01-02
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

// Helper function to convert date input to date string
const fromDateInput = dateStr => {
  if (!dateStr) return "";
  // Format: 2025-01-02 -> 02/01/2025
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// Initial data
const initialRows = [
  {
    id: 1,
    radicado: "1167",
    mes: "ENE",
    gestion: "Administrativa",
    descripcionSolicitud: "Inducción al persona nuevo y ascensos.",
    avance: "",
    estado: "Completado",
    creadoPor: "Ferney  Camacho Manjarres",
    tipoSolicitud: "Apoyo áreas",
    asignadoA: "Ferney",
    fechaSolicitud: "02/01/2025",
    enCurso: "20/01/2025",
    revision: "09/01/2025",
    enAjustes: "09/01/2025",
    enAprobacion: "09/01/2025",
    completado: "09/01/2025",
    adjunto: "",
    columna1: "18",
  },
  {
    id: 2,
    radicado: "1169",
    mes: "ENE",
    gestion: "Gerencia General",
    descripcionSolicitud:
      "Buenas tardes, me permito remitir solcitud de acuerdo a  las siguientes especificaciones:\nACUERDO 01 Secretaria LUZ DARY DELGADO CERQUERA Presidente MARIA BELLANED POLANCO POLANCO Aprobado por unanimidad acta Nro.894-01 18 de enero 2025 sesión extraordinaria.",
    avance: "",
    estado: "Completado",
    creadoPor: "Vianey Trejos Murcia",
    tipoSolicitud: "Documentos",
    asignadoA: "Ferney",
    fechaSolicitud: "20/01/2025",
    enCurso: "20/01/2025",
    revision: "21/01/2025",
    enAjustes: "21/01/2025",
    enAprobacion: "21/01/2025",
    completado: "21/01/2025",
    adjunto: "",
    columna1: "1",
  },
  {
    id: 3,
    radicado: "1170",
    mes: "ENE",
    gestion: "Gerencia General",
    descripcionSolicitud:
      "Publicar documentos aprobados por el Consejo de Administración el 18 de enero del 2025.  GUAV-02 Guía para la Recepción y Preselección de las Propuestas de Revisoría Fiscal a Presentar a la Asamblea General de Delegados",
    avance: "",
    estado: "Completado",
    creadoPor: "Ferney  Camacho Manjarres",
    tipoSolicitud: "Documentos",
    asignadoA: "Ferney",
    fechaSolicitud: "20/01/2025",
    enCurso: "20/01/2025",
    revision: "20/01/2025",
    enAjustes: "20/01/2025",
    enAprobacion: "21/01/2025",
    completado: "21/01/2025",
    adjunto: "",
    columna1: "0",
  },
  {
    id: 4,
    radicado: "1171",
    mes: "ENE",
    gestion: "Auditoría Interna",
    descripcionSolicitud:
      "Buenas tardes, me permito solicitar el favor de crear flujo en workmanager para notificacion de los informes de las auditorias. Gracias",
    avance: "",
    estado: "Completado",
    creadoPor: "Daniela Sanchez Bustos",
    tipoSolicitud: "Documentos",
    asignadoA: "Ferney",
    fechaSolicitud: "23/01/2025",
    enCurso: "23/01/2025",
    revision: "03/02/2025",
    enAjustes: "04/02/2025",
    enAprobacion: "25/02/2025",
    completado: "25/02/2025",
    adjunto: "",
    columna1: "0",
  },
  {
    id: 5,
    radicado: "1172",
    mes: "ENE",
    gestion: "Financiera",
    descripcionSolicitud: "Adecuación circular",
    avance: "",
    estado: "Completado",
    creadoPor: "Luz Angela Martínez Agudelo",
    tipoSolicitud: "Circulares",
    asignadoA: "Luz Angela",
    fechaSolicitud: "23/01/2025",
    enCurso: "23/01/2025",
    revision: "",
    enAjustes: "",
    enAprobacion: "23/01/2025",
    completado: "23/01/2025",
    adjunto: "",
    columna1: "1",
  },
  {
    id: 6,
    radicado: "1173",
    mes: "ENE",
    gestion: "Auditoría Interna",
    descripcionSolicitud:
      'Solicitamos en los siguientes formatos de Auditoria, el cambio del campo "Unidad Auditable" por "Actividad Bajo Revisión": \nFOAI-01 Acta Reunión Cierre de Auditoría\nFOAI-04 Acta Reunión Apertura de Auditoría\nFOAI-03 Informe de Auditoría Interna\nFOAI-07 Plan de Acción Auditoría Interna\n\n- Solicitamos la creación de un instructivo para el Desarrollo de la Auditoria Interna, el cual se elaboro en borrador y se adjunta a la presente solicitud. \n- Solicitamos la actualización del procedimiento PRAI-01 Auditoría Interna, al cual se le hicieron las modificaciones en borrador y se adjunta a la presente solicitud.\n\nSobre flujo de WorkManager solicitado, se realizaron las pruebas y confirmamos que cumple con las condiciones que requerimos. \n\nGracias.',
    avance:
      "Se envio documentos a revisión por parte de Director de AI y auxiliar.  pendiente de correo para pasar a aprobacion.",
    estado: "Completado",
    creadoPor: "Daniela Sanchez Bustos",
    tipoSolicitud: "Documentos",
    asignadoA: "Ferney",
    fechaSolicitud: "25/01/2025",
    enCurso: "25/01/2025",
    revision: "10/02/2025",
    enAjustes: "13/02/2025",
    enAprobacion: "14/02/2025",
    completado: "15/02/2025",
    adjunto: "",
    columna1: "0",
  },
  {
    id: 7,
    radicado: "1174",
    mes: "ENE",
    gestion: "Financiera",
    descripcionSolicitud: "Gastos de viaje",
    avance: "",
    estado: "Completado",
    creadoPor: "Luz Angela Martínez Agudelo",
    tipoSolicitud: "Circulares",
    asignadoA: "Luz Angela",
    fechaSolicitud: "28/01/2025",
    enCurso: "28/01/2025",
    revision: "",
    enAjustes: "",
    enAprobacion: "",
    completado: "28/01/2025",
    adjunto: "",
    columna1: "0",
  },
  {
    id: 8,
    radicado: "1175",
    mes: "ENE",
    gestion: "Credito y cartera",
    descripcionSolicitud:
      "Para publicación dos circulares: campaña paz y salvo y puntualidad",
    avance: "",
    estado: "Completado",
    creadoPor: "Luz Angela Martínez Agudelo",
    tipoSolicitud: "Circulares",
    asignadoA: "Luz Angela",
    fechaSolicitud: "29/01/2025",
    enCurso: "29/01/2025",
    revision: "",
    enAjustes: "",
    enAprobacion: "",
    completado: "29/01/2025",
    adjunto: "",
    columna1: "0",
  },
  {
    id: 9,
    radicado: "1176",
    mes: "ENE",
    gestion: "Riesgos",
    descripcionSolicitud:
      "Cordial saludo, comedidamente solicito por favor realizar la debida actualización documental al modulo de tesorería donde para otros recaudos ( convenios) no se exige el diligenciamiento del código, que solo en la transacción se busque el numero de convenio en el item de producto para poder continuar con el proceso, sin necesidad de diligenciar los dos campos , el codigo y el espacio donde se buscar el convenio.\nEsta ampliación se socializo con el Ing Ferney Camacho. Manual opertivo de caja 7.2\nSe realiza este requerimiento por el aumento de los errores operativos donde se solicita al dueño de la cuenta autorizar retiros por error en la consignación, cuando el cajero se equivoca al diligenciar los dos campos.",
    avance: "se ajusto el mate-01",
    estado: "Revisión",
    creadoPor: "Jeisson Javier Cediel Peña",
    tipoSolicitud: "Documentos",
    asignadoA: "Luz Angela",
    fechaSolicitud: "29/01/2025",
    enCurso: "29/01/2025",
    revision: "19/05/2025",
    enAjustes: "",
    enAprobacion: "",
    completado: "",
    adjunto: "",
    columna1: "1",
  },
  {
    id: 10,
    radicado: "1177",
    mes: "ENE",
    gestion: "Administrativa",
    descripcionSolicitud:
      "Implementar política de teletrabajo, muchas gracias.",
    avance: "",
    estado: "Completado",
    creadoPor: "Estella Andrea Gonzalez Elizalde",
    tipoSolicitud: "Documentos",
    asignadoA: "Luz Angela",
    fechaSolicitud: "30/01/2025",
    enCurso: "30/01/2025",
    revision: "",
    enAjustes: "",
    enAprobacion: "31/01/2025",
    completado: "04/02/2025",
    adjunto: "",
    columna1: "1",
  },
];

// Options for dropdowns
const radicadoOptions = [
  "1167",
  "1169",
  "1170",
  "1171",
  "1172",
  "1173",
  "1174",
  "1175",
  "1176",
  "1177",
];

const mesOptions = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

const gestionOptions = [
  "Administrativa",
  "Gerencia General",
  "Auditoría Interna",
  "Financiera",
  "Credito y cartera",
  "Riesgos",
];

const estadoOptions = [
  "Completado",
  "Revisión",
  "En Curso",
  "En Ajustes",
  "En Aprobación",
  "Pendiente",
];

const creadoPorOptions = [
  "Ferney  Camacho Manjarres",
  "Vianey Trejos Murcia",
  "Daniela Sanchez Bustos",
  "Luz Angela Martínez Agudelo",
  "Jeisson Javier Cediel Peña",
  "Estella Andrea Gonzalez Elizalde",
];

const tipoSolicitudOptions = ["Apoyo áreas", "Documentos", "Circulares"];

const asignadoAOptions = ["Ferney", "Luz Angela"];

export default function SolicitudesIngenieriaTable() {
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes Ingenieria");

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "solicitudes-ingenieria.xlsx");
  };

  const handleFileUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      handleChange(id, "adjunto", fileName);
    }
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.radicado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.descripcionSolicitud
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      row.gestion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.creadoPor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Solicitudes de Ingeniería
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por radicado, descripción, gestión o creado por"
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
                RADICADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                MES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                GESTIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DESCRIPCIÓN DE LA SOLICITUD
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                AVANCE
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                ESTADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CREADO POR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE SOLICITUD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ASIGNADO A
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE SOLICITUD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                EN CURSO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                REVISIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                EN AJUSTES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                EN APROBACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                COMPLETADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ADJUNTO
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
                    value={r.radicado}
                    onChange={e =>
                      handleChange(r.id, "radicado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Radicado"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.mes}
                    onChange={e => handleChange(r.id, "mes", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {mesOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.gestion}
                    onChange={e =>
                      handleChange(r.id, "gestion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Gestión"
                  />
                </td>
                <td className="p-2 border text-left">
                  <textarea
                    value={r.descripcionSolicitud}
                    onChange={e =>
                      handleChange(r.id, "descripcionSolicitud", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm resize-none"
                    placeholder="Descripción de la solicitud"
                    rows={2}
                  />
                </td>
                <td className="p-2 border text-left">
                  <textarea
                    value={r.avance}
                    onChange={e => handleChange(r.id, "avance", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm resize-none"
                    placeholder="Avance (automatizado por Office 365)"
                    rows={2}
                  />
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.estado}
                    onChange={e => handleChange(r.id, "estado", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.creadoPor}
                    onChange={e =>
                      handleChange(r.id, "creadoPor", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {creadoPorOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoSolicitud}
                    onChange={e =>
                      handleChange(r.id, "tipoSolicitud", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoSolicitudOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.asignadoA}
                    onChange={e =>
                      handleChange(r.id, "asignadoA", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {asignadoAOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaSolicitud)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaSolicitud",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.enCurso)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "enCurso",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.revision)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "revision",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.enAjustes)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "enAjustes",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.enAprobacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "enAprobacion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.completado)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "completado",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <div className="flex flex-col gap-1">
                    {r.adjunto && (
                      <span className="text-xs text-gray-600">{r.adjunto}</span>
                    )}
                    <label className="cursor-pointer text-xs text-blue-600 hover:text-blue-800">
                      {r.adjunto ? "Cambiar archivo" : "Subir archivo"}
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={e => handleFileUpload(r.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
