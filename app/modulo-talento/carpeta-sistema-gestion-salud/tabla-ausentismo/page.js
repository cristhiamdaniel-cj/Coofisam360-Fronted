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
  listAusentismoRows,
  saveAusentismoRow,
} from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/ausentismoQuota";
import { FaArrowDownWideShort } from "react-icons/fa6";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info");

  useEffect(() => {
    async function load() {
      try {
        const data = await listAusentismoRows({ limit: 500 });
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
    // Convertir a número si es campo numérico

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
    try {
      setSaving(true);
      const idxs = Object.keys(editedRows).map(k => Number(k));
      let ok = 0, fail = 0;
      for (const i of idxs) {
        const merged = { ...rows[i], ...(editedRows[i] || {}) };
        try {
          await saveAusentismoRow(merged);
          ok++;
        } catch (e) {
          console.error(e);
          fail++;
        }
      }
      setEditedRows({});
      const data = await listAusentismoRows({ limit: 500 });
      setRows(data);
      if (fail === 0 && ok > 0) {
        setStatusType("success");
        setStatusMsg("Información guardada correctamente.");
      } else if (ok > 0 && fail > 0) {
        setStatusType("info");
        setStatusMsg(`Guardado parcial: ${ok} ok, ${fail} con error.`);
      } else if (fail > 0) {
        setStatusType("error");
        setStatusMsg("Ocurrió un error guardando los cambios.");
      }
    } finally {
      setSaving(false);
    }
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
      id: `new-${Date.now()}`, // id único temporal
      Año: new Date().getFullYear(),
      Mes: "ENERO",
      DiasAusenciaPropios: 0,
      DiasAusenciaContratistas: 0,
      TotalDiasIncapacidad: 0, // solo lectura
      DiasLaboralesMes: 0, // solo lectura
      NumeroTrabajadores: 0, // solo lectura
      DiasTrabajoProgramados: 0, // solo lectura
      AusentismoLaboral: 0, // solo lectura
      isNew: true,
    };

    setRows(prev => [newRow, ...prev]); // agregamos al inicio de la tabla
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Ausentismo
      </h1>
      <div className="actions-container flex justify-between mb-4">
        {statusMsg && (
          <div className={`px-4 py-2 rounded text-sm ${statusType === 'success' ? 'bg-green-100 text-green-800' : statusType === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {statusMsg}
          </div>
        )}
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
              disabled={saving}
              className="action-button flex gap-2 items-center justify-center cursor-pointer"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
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
              <th className="p-4 border text-center whitespace-nowrap">Acciones</th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Ausencia Propios
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Ausencia Contratistas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total Días Incapacidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Laborales Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Trabajadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Trabajo Programados
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Ausentismo Laboral
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map((r, idx) => { const isEditing = r.isNew || !!editingRows[idx]; return (
              <tr key={idx}>
                <td className="p-2 border text-center whitespace-nowrap">
                  <button onClick={() => setEditingRows(prev => ({...prev, [idx]: !prev[idx]}))} className="px-3 py-1 border rounded cursor-pointer">{isEditing ? "Terminar" : "Editar"}</button>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.Año}
                      onChange={e => handleChange(idx, "Año", e.target.value)}
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.Año
                  )}
                </td>

                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={r.Mes}
                      onChange={e => handleChange(idx, "Mes", e.target.value)}
                      className="border rounded p-1 w-full"
                    >
                      {[
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
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
                    value={r.DiasAusenciaPropios}
                    onChange={e => {
                      handleChange(idx, "DiasAusenciaPropios", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.DiasAusenciaContratistas}
                    onChange={e => {
                      handleChange(
                        idx,
                        "DiasAusenciaContratistas",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TotalDiasIncapacidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.DiasLaboralesMes}
                      onChange={e =>
                        handleChange(idx, "DiasLaboralesMes", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.DiasLaboralesMes
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.NumeroTrabajadores}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.DiasTrabajoProgramados}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.AusentismoLaboral ? (
                    <span className="font-medium">
                      {parseFloat(r.AusentismoLaboral).toLocaleString('es-CO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </main>
  );
}
