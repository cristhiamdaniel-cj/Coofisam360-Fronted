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
    setSaving(true);
    try {
      console.log(">>> editedRows:", editedRows);

      const updates = Object.entries(editedRows).map(async ([id, changes]) => {
        console.log(">>> Iterando row:", id, changes);

        const fullRow = rows.find(r => String(r.id) === String(id));
        if (!fullRow) {
          console.warn("⚠️ No se encontró la fila con id:", id);
          return;
        }

        const payload = {
          id: fullRow.id,
          anio: Number(fullRow.Año),
          mes: Number(fullRow.Mes),
          dias_ausencia_propios: Number(
            changes.DiasAusenciaPropios ?? fullRow.DiasAusenciaPropios
          ) || 0,
          dias_ausencia_contratistas: Number(
            changes.DiasAusenciaContratistas ?? fullRow.DiasAusenciaContratistas
          ) || 0,
          total_dias_incapacidad: Number(fullRow.TotalDiasIncapacidad) || 0,
          dias_laborales_mes: Number(fullRow.DiasLaboralesMes) || 0,
          numero_trabajadores: Number(fullRow.NumeroTrabajadores) || 0,
          dias_trabajo_programados: Number(fullRow.DiasTrabajoProgramados) || 0,
          ausentismo_laboral: Number(fullRow.AusentismoLaboral) || 0,
        };

        console.log(">>> Payload enviado al backend:", payload);

        await saveAusentismoRow(payload);
      });

      await Promise.all(updates);

      alert("Cambios guardados correctamente ✅");
      setEditedRows({});
    } catch (err) {
      console.error("Error guardando cambios:", err);
      alert("Error guardando cambios ❌");
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
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
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
                  {r.isNew ? (
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
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.TotalDiasIncapacidad}
                      onChange={e =>
                        handleChange(
                          idx,
                          "TotalDiasIncapacidad",
                          e.target.value
                        )
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.TotalDiasIncapacidad
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.DiasLaboralesMes}
                      onChange={e =>
                        handleChange(idx, "DioasLaboralesMes", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.DiasLaboralesMes
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.NumeroTrabajadores}
                      onChange={e =>
                        handleChange(idx, "NumeroTrabajadores", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.NumeroTrabajadores
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.DiasTrabajoProgramados}
                      onChange={e =>
                        handleChange(
                          idx,
                          "DiasTrabajoProgramados",
                          e.target.value
                        )
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.DiasTrabajoProgramados
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.AusentismoLaboral}
                      onChange={e =>
                        handleChange(idx, "AusentismoLaboral", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.AusentismoLaboral
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
