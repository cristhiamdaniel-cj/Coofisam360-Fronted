"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import {
  listSatisfaccionQuota,
  saveSatisfaccionQuota,
} from "../../../services/modulo-talento/carpeta-formador-talento/satisfaccionQuota";

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
        const data = await listSatisfaccionQuota({ limit: 500 });
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

  const handleChange = (index, field, value) => {
    // Actualizar rows usando el índice
    setRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });

    // Actualizar editedRows
    setEditedRows(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
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

  const handleAddRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      Año: new Date().getFullYear(),
      Mes: "", // se deja vacío para seleccionar luego
      NumeroFormadoresConRecomendacion: 0,
      TotalFormadores: 0,
      PorcentajeSatisfaccion: 0, // no editable
      Formadores: "", // select editable
      Recomendaciones: "",
      isNew: true, // marca que es editable completamente
    };

    setRows(prev => [newRow, ...prev]); // se añade al inicio
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Satisfacción del Aprendizaje
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <div className="search-bar flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por codigo u oficina"
              className="border w-[300px] px-2 py-1"
            />
          </div>
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
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                # Formadores con Recomendación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total Formadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Satisfacción
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                Formadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[400px]">
                Recomendaciones
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.Año}
                      onChange={e => handleChange(r.id, "Año", e.target.value)}
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.Año
                  )}
                </td>

                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <select
                      value={r.Mes}
                      onChange={e => handleChange(r.id, "Mes", e.target.value)}
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
                        "OCTUBRE",
                        "NOVIEMBRE",
                        "DICIEMBRE",
                      ].map(m => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.Mes
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.NumeroFormadoresConRecomendacion}
                    onChange={e => {
                      handleChange(
                        idx,
                        "NumeroFormadoresConRecomendacion",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.TotalFormadores}
                    onChange={e => {
                      handleChange(idx, "TotalFormadores", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.PorcentajeSatisfaccion}
                      onChange={e =>
                        handleChange(
                          r.id,
                          "PorcentajeSatisfaccion",
                          e.target.value
                        )
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.PorcentajeSatisfaccion
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Formadores} // Cambia r.Area por el campo que estés usando
                    onChange={e => {
                      handleChange(idx, "Formadores", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "Talento y Cultura",
                      "SST",
                      "Riesgos",
                      "Sarlaft",
                      "Auditoria",
                      "Crédito, Comercial, Cartera",
                      "Workmanager",
                      "Comunicaciones",
                      "Ing. Organizacional",
                      "Educación Financiera",
                      "Trabajo Insitucional",
                      "Contabilidad",
                      "Tesoreria",
                      "Tecnología",
                      "Ninguno",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="text"
                    value={r.Recomendaciones}
                    onChange={e => {
                      handleChange(idx, "Recomendaciones", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
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
