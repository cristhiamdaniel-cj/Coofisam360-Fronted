"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// JSON data structure for communication bulletin
const initialRows = [
  {
    id: 1,
    mes: "OCTUBRE",
    año: "2025",
    tematica: "PLANEACION ESTRATEGICA",
    canalUtilizado: "WhatsApp",
    impacto: "Visibilizar la proyeccion institucional del año 2026 - 2028",
    numeroEdiciones: 1,
    numeroVisualizaciones: 200,
    observaciones: ""
  },
  {
    id: 2,
    mes: "NOVIEMBRE",
    año: "2025",
    tematica: "",
    canalUtilizado: "",
    impacto: "",
    numeroEdiciones: "",
    numeroVisualizaciones: "",
    observaciones: ""
  },
  {
    id: 3,
    mes: "DICIEMBRE",
    año: "2025",
    tematica: "",
    canalUtilizado: "",
    impacto: "",
    numeroEdiciones: "",
    numeroVisualizaciones: "",
    observaciones: ""
  },
  {
    id: 4,
    mes: "SEPTIEMBRE",
    año: "2025",
    tematica: "",
    canalUtilizado: "",
    impacto: "",
    numeroEdiciones: "",
    numeroVisualizaciones: "",
    observaciones: ""
  }
];

// Options for dropdowns
const meses = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

const años = ["2025", "2026", "2027", "2028", "2029"];

const canalesUtilizados = [
  "Correo electrónico",
  "WhatsApp Business",
  "Redes sociales internas",
  "Boletines digitales",
  "Reuniones presenciales",
  "Charlas / capacitaciones",
  "Volantes / afiches",
  "Eventos internos (ferias, lanzamientos, celebraciones)",
  "Transmisiones en vivo / streaming",
  "Encuestas interactivas",
  "Comunicaciones por líderes o voceros"
];

export default function ComunicacionBoletinTable() {
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
      "Comunicacion Boletin"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "comunicacion-boletin.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Comunicación Interna Boletin
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input 
            type="text" 
            placeholder="Buscar por temática o canal"
            className="unified-input w-[300px]" 
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[400px]">
                MES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">AÑO</th>
              <th className="p-4 border text-center whitespace-nowrap">
                TEMÁTICA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CANAL UTILIZADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                IMPACTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NÚMERO DE EDICIONES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NÚMERO DE VISUALIZACIONES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                OBSERVACIONES
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-left">
                  <select
                    value={r.mes}
                    onChange={(e) => handleChange(r.id, 'mes', e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar mes</option>
                    {meses.map(mes => (
                      <option key={mes} value={mes}>{mes}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.año}
                    onChange={(e) => handleChange(r.id, 'año', e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar año</option>
                    {años.map(año => (
                      <option key={año} value={año}>{año}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.tematica}
                    onChange={(e) => handleChange(r.id, 'tematica', e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Ingrese temática"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.canalUtilizado}
                    onChange={(e) => handleChange(r.id, 'canalUtilizado', e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar canal</option>
                    {canalesUtilizados.map(canal => (
                      <option key={canal} value={canal}>{canal}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.impacto}
                    onChange={(e) => handleChange(r.id, 'impacto', e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Ingrese impacto"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.numeroEdiciones}
                    onChange={(e) => handleChange(r.id, 'numeroEdiciones', e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.numeroVisualizaciones}
                    onChange={(e) => handleChange(r.id, 'numeroVisualizaciones', e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.observaciones}
                    onChange={(e) => handleChange(r.id, 'observaciones', e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Ingrese observaciones"
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
