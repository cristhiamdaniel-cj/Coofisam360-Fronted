"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
// Format: 05/06/2024 -> 2024-06-05
const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Helper function to convert date input to date string
// Format: 2024-06-05 -> 05/06/2024
const fromDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// Helper function to parse money value
const parseMoney = (value) => {
  if (!value || value === "$ -") return "";
  return value.toString().replace(/\$|\.| /g, "").trim();
};

// Helper function to format money value
const formatMoney = (value) => {
  if (!value) return "";
  return `$ ${parseInt(value).toLocaleString("es-CO")}`;
};

// Initial data
const initialRows = [
  {
    id: 1,
    montoAprobado: "12160000",
    montoPagado: "12160000",
    fechaPago: "05/06/2024",
    tiempoDeteccionPago: "138",
    tiempoTotalProceso: "222",
    totalRecibidoAfectado: "3900000",
    tipoAccion: "Penal",
    tipoEntidad: "Fiscalía General de la Nación",
    huboAfectacionInterna: "Si",
    tipoAfectacionInterna: "Afectación Financiera",
    huboAccionesDisciplinarias: "Si",
    seAjustaronProcesosInternos: "Si",
    huboAcuerdoDevolucion: "Si",
    seCumplioAcuerdo: "No",
    montoDevuelto: "",
    estadoTramite: "Pagado",
    procesoInternoAfectado: "Subgerencia Financiera",
    nombreCausante: "María Juliana Yustre Barrios",
    observaciones: "",
  },
  {
    id: 2,
    montoAprobado: "",
    montoPagado: "0",
    fechaPago: "",
    tiempoDeteccionPago: "-44927",
    tiempoTotalProceso: "-44745",
    totalRecibidoAfectado: "46392975",
    tipoAccion: "Administrativa",
    tipoEntidad: "Aseguradora contratada",
    huboAfectacionInterna: "Si",
    tipoAfectacionInterna: "Afectación Estratégica",
    huboAccionesDisciplinarias: "No",
    seAjustaronProcesosInternos: "Si",
    huboAcuerdoDevolucion: "No",
    seCumplioAcuerdo: "No",
    montoDevuelto: "",
    estadoTramite: "Rechazado",
    procesoInternoAfectado: "Subgerencia Innovación Empresarial",
    nombreCausante: "Surtiaseo del Caquetá LTDA",
    observaciones: "",
  },
  {
    id: 3,
    montoAprobado: "7374000",
    montoPagado: "7374000",
    fechaPago: "",
    tiempoDeteccionPago: "-45469",
    tiempoTotalProceso: "-45414",
    totalRecibidoAfectado: "2626000",
    tipoAccion: "Penal",
    tipoEntidad: "Fiscalía General de la Nación",
    huboAfectacionInterna: "Si",
    tipoAfectacionInterna: "Afectación Financiera",
    huboAccionesDisciplinarias: "No",
    seAjustaronProcesosInternos: "No",
    huboAcuerdoDevolucion: "No",
    seCumplioAcuerdo: "No",
    montoDevuelto: "",
    estadoTramite: "Pagado",
    procesoInternoAfectado: "Subgerencia Comercial",
    nombreCausante: "Viviana Muñoz Ordoñez",
    observaciones: "",
  },
  {
    id: 4,
    montoAprobado: "32000000",
    montoPagado: "32000000",
    fechaPago: "15/04/2025",
    tiempoDeteccionPago: "211",
    tiempoTotalProceso: "324",
    totalRecibidoAfectado: "8000000",
    tipoAccion: "Penal",
    tipoEntidad: "Fiscalía General de la Nación",
    huboAfectacionInterna: "Si",
    tipoAfectacionInterna: "Afectación Financiera",
    huboAccionesDisciplinarias: "Si",
    seAjustaronProcesosInternos: "Si",
    huboAcuerdoDevolucion: "No",
    seCumplioAcuerdo: "No",
    montoDevuelto: "",
    estadoTramite: "Pagado",
    procesoInternoAfectado: "Subgerencia Financiera",
    nombreCausante: "Carlos Andrés Perez Arismendy",
    observaciones: "",
  },
  {
    id: 5,
    montoAprobado: "26629419",
    montoPagado: "26629419",
    fechaPago: "08/09/2025",
    tiempoDeteccionPago: "227",
    tiempoTotalProceso: "453",
    totalRecibidoAfectado: "62000",
    tipoAccion: "Penal",
    tipoEntidad: "Fiscalía General de la Nación",
    huboAfectacionInterna: "Si",
    tipoAfectacionInterna: "Afectación Financiera",
    huboAccionesDisciplinarias: "Si",
    seAjustaronProcesosInternos: "Si",
    huboAcuerdoDevolucion: "Si",
    seCumplioAcuerdo: "No",
    montoDevuelto: "5632000",
    estadoTramite: "Pagado",
    procesoInternoAfectado: "Subgerencia Comercial",
    nombreCausante: "Jose Edgar Vargas Losada",
    observaciones: "",
  },
];

// Options for dropdowns
const tipoAccionOptions = ["Penal", "Administrativa", "Civil", "Laboral", ""];

const tipoEntidadOptions = [
  "Fiscalía General de la Nación",
  "Aseguradora contratada",
  "Superintendencia Financiera",
  "Superintendencia de Industria y Comercio",
  "Procuraduría General de la Nación",
  "Contraloría General de la República",
  "",
];

const huboAfectacionInternaOptions = ["Si", "No", ""];

const tipoAfectacionInternaOptions = [
  "Afectación Operativa",
  "Afectación Financiera",
  "Afectación Estratégica",
  "Afectación Legal y Regulatoria",
  "Afectación Humana y Organizacional",
  "Afectación en la Gestión de Riesgos",
  "",
];

const huboAccionesDisciplinariasOptions = ["Si", "No", ""];

const seAjustaronProcesosInternosOptions = ["Si", "No", ""];

const huboAcuerdoDevolucionOptions = ["Si", "No", ""];

const seCumplioAcuerdoOptions = ["Si", "No", ""];

const estadoTramiteOptions = [
  "Enviado a la aseguradora",
  "En revisión por la aseguradora",
  "Información adicional solicitada",
  "Documentación incompleta",
  "En espera de respuesta",
  "Aprobado",
  "Rechazado",
  "En proceso de pago",
  "Pagado",
  "Cerrado",
  "Reclamación anulada",
  "Reclamación reabierta",
  "Escalado a instancia superior",
  "En conciliación",
  "En auditoría interna",
  "En trámite judicial (si aplica)",
  "",
];

const procesoInternoAfectadoOptions = [
  "Gerencia General",
  "Subgerencia Innovación Empresarial",
  "Subgerencia Financiera",
  "Subgerencia Comercial",
  "Subgerencia Crédito y Cartera",
  "",
];

export default function ReclamacionesTable() {
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
        montoAprobado: "",
        montoPagado: "",
        fechaPago: "",
        tiempoDeteccionPago: "",
        tiempoTotalProceso: "",
        totalRecibidoAfectado: "",
        tipoAccion: "",
        tipoEntidad: "",
        huboAfectacionInterna: "",
        tipoAfectacionInterna: "",
        huboAccionesDisciplinarias: "",
        seAjustaronProcesosInternos: "",
        huboAcuerdoDevolucion: "",
        seCumplioAcuerdo: "",
        montoDevuelto: "",
        estadoTramite: "",
        procesoInternoAfectado: "",
        nombreCausante: "",
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
      "Reclamaciones"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "reclamaciones.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.nombreCausante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.tipoAccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.tipoEntidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.procesoInternoAfectado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Reclamaciones
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por causante, tipo de acción, entidad o proceso afectado"
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
                MONTO APROBADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MONTO PAGADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE PAGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIEMPO ENTRE LA DETECCIÓN HASTA LA FECHA DE PAGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIEMPO TOTAL DEL PROCESO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TOTAL RECIBIDO/TOTAL AFECTADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE ACCIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE ENTIDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ¿HUBO AFECTACIÓN INTERNA?
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE AFECTACIÓN INTERNA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ¿HUBO ACCIONES DISCIPLINARIAS?
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ¿SE AJUSTARON PROCESOS INTERNOS?
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ¿HUBO ACUERDO DE DEVOLUCIÓN?
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ¿SE CUMPLIÓ EL ACUERDO?
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MONTO DEVUELTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO DEL TRÁMITE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                PROCESO INTERNO AFECTADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRE DE EL CAUSANTE
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
                    type="number"
                    value={r.montoAprobado}
                    onChange={e =>
                      handleChange(r.id, "montoAprobado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Monto aprobado"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.montoPagado}
                    onChange={e =>
                      handleChange(r.id, "montoPagado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Monto pagado"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaPago)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaPago",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.tiempoDeteccionPago}
                    onChange={e =>
                      handleChange(r.id, "tiempoDeteccionPago", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Días"
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
                    value={r.totalRecibidoAfectado}
                    onChange={e =>
                      handleChange(r.id, "totalRecibidoAfectado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Total"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoAccion}
                    onChange={e =>
                      handleChange(r.id, "tipoAccion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoAccionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoEntidad}
                    onChange={e =>
                      handleChange(r.id, "tipoEntidad", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoEntidadOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.huboAfectacionInterna}
                    onChange={e =>
                      handleChange(r.id, "huboAfectacionInterna", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {huboAfectacionInternaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoAfectacionInterna}
                    onChange={e =>
                      handleChange(r.id, "tipoAfectacionInterna", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoAfectacionInternaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.huboAccionesDisciplinarias}
                    onChange={e =>
                      handleChange(r.id, "huboAccionesDisciplinarias", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {huboAccionesDisciplinariasOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.seAjustaronProcesosInternos}
                    onChange={e =>
                      handleChange(r.id, "seAjustaronProcesosInternos", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {seAjustaronProcesosInternosOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.huboAcuerdoDevolucion}
                    onChange={e =>
                      handleChange(r.id, "huboAcuerdoDevolucion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {huboAcuerdoDevolucionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.seCumplioAcuerdo}
                    onChange={e =>
                      handleChange(r.id, "seCumplioAcuerdo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {seCumplioAcuerdoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.montoDevuelto}
                    onChange={e =>
                      handleChange(r.id, "montoDevuelto", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Monto devuelto"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estadoTramite}
                    onChange={e =>
                      handleChange(r.id, "estadoTramite", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoTramiteOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.procesoInternoAfectado}
                    onChange={e =>
                      handleChange(r.id, "procesoInternoAfectado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {procesoInternoAfectadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nombreCausante}
                    onChange={e =>
                      handleChange(r.id, "nombreCausante", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Nombre del causante"
                  />
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



