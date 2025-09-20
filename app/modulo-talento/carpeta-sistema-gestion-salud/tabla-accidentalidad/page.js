"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import {
  listAccidentalidadRows,
  saveAccidentalidadRow,
} from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/accidentalidadQuota";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await listAccidentalidadRows({ limit: 500 });
        setRows(data);
        //setFilteredRows(data);
        setError("");
      } catch (e) {
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (id, field, value) => {
    const updateRow = row => (row.id === id ? { ...row, [field]: value } : row);

    setRows(prev => prev.map(updateRow));
    setFilteredRows(prev => prev.map(updateRow));

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
  console.log(rows);
  return (
    <main className="pt-4 pb-0 px-12">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Accidentalidad
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input type="text" className="border w-[300px]" />
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
            Buscar
            <IoSearch />
          </button>
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[230px]">
                Tipo de Vinculación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Trabajadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Nº Accidentes de Trabajo
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                At Mortales
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días de Incapacidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Cargados
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                Indicador
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Resultado
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.Año}
                    onChange={e => {
                      handleChange(r.id, "Año", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Mes}
                    onChange={e => {
                      handleChange(r.id, "Mes", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "ENERO",
                      "FEBRERO",
                      "MARZO",
                      "ABRIL",
                      "MAYO",
                      "JUNIO",
                      "JULIO",
                      "AGOSTO",
                      "SEPTIEMBRE",
                      "OCTUBE",
                      "NOVIEMBRE",
                      "DICIEMBRE",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.TipoVinculacion}
                    onChange={e => {
                      handleChange(r.id, "TipoVinculacion", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["Propios", "Contratistas", "Propios y Contratistas"].map(
                      opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.NumeroTrabajadores}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.AccidentesTrabajo}
                    onChange={e => {
                      handleChange(r.id, "AccidentesTrabajo", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.AtMortales}
                    onChange={e => {
                      handleChange(r.id, "AtMortales", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.DiasIncapacidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.DiasCargados}
                    onChange={e => {
                      handleChange(r.id, "DiasCargados", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Indicador}
                    onChange={e => {
                      handleChange(r.id, "Indicador", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["I.S", "I.F", "AT MORTALES"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Resultado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
