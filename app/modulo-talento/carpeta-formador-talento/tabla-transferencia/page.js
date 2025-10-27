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
  listTransferenciaQuota,
  saveTransferenciaQuota,
  updateTransferenciaQuota,
} from "../../../services/modulo-talento/carpeta-formador-talento/transferenciaQuota";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toMonthNumber } from "@/app/services/modulo-talento/carpeta-formador-talento/talentHelpers";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [editingRows, setEditingRows] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const data = await listTransferenciaQuota({ limit: 500 });
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

  useEffect(() => {
    const query = search.trim().toLowerCase();

    const filtered = rows
      .filter(r => {
        const matchesSearch =
          !query || r.Formadores.toLowerCase().includes(query);

        const matchesYear = !selectedYear || r.Año === Number(selectedYear);

        // Ahora comparamos el mes como string en mayúscula
        const matchesMonth =
          !selectedMonth || r.Mes.toUpperCase() === selectedMonth.toUpperCase();

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => Number(a.codigo) - Number(b.codigo));

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  // Obtener años únicos
  const uniqueYears = [...new Set(rows.map(r => r.Año).filter(Boolean))];

  // Obtener meses únicos en mayúscula
  const uniqueMonths = [
    ...new Set(rows.map(r => r.Mes && r.Mes.toUpperCase()).filter(Boolean)),
  ];

  // Mantener el orden original de los meses
  const monthNames = [
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
  ];

  const availableMonths = monthNames.filter(m => uniqueMonths.includes(m));

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
    // Usar filteredRows para respetar los filtros aplicados
    const dataToExport = filteredRows.length > 0 ? filteredRows : rows;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transferencia del Conocimiento");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    
    // Nombre del archivo basado en si hay filtros aplicados
    const fileName = filteredRows.length > 0 && filteredRows.length < rows.length 
      ? `transferencia-conocimiento-filtrado-${filteredRows.length}-registros.xlsx`
      : "transferencia-conocimiento-completo.xlsx";
    
    saveAs(data, fileName);
  };

  const handleSaveSingle = async (idx) => {
    try {
      const finalRow = rows[idx];
      const payload = {
        id: Number(finalRow.id) || undefined,
        periodo: `${finalRow.Año}-${String(toMonthNumber(finalRow.Mes)).padStart(2, '0')}-01`,
        comprension: Number(finalRow.Comprension) || 0,
        retencion: Number(finalRow.RetencionConocimiento) || 0,
        valoracion_desempeno: Number(finalRow.ValoracionDesempeno) || 0,
        satisfaccion: Number(finalRow.SatisfaccionTrabajador) || 0,
        valoracion_jefe_inmediato: 0, // Campo no presente en UI
        practica: Number(finalRow.Practica) || 0,
        total: Number(finalRow.Total) || 0,
        efectividad: Number(finalRow.EfectividadTransferencia) || 0,
      };

      if (finalRow.isNew) {
        await saveTransferenciaQuota(payload);
      } else {
        await updateTransferenciaQuota(payload);
      }

      // Cerrar modo edición
      setEditingRows(prev => ({ ...prev, [finalRow.id]: false }));
      setEditedRows(prev => {
        const newEdited = { ...prev };
        delete newEdited[finalRow.id];
        return newEdited;
      });

      // Recargar datos
      const data = await listTransferenciaQuota({ limit: 500 });
      setRows(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      console.error("Error guardando registro:", err);
      alert(`Error al guardar el registro: ${err.message}`);
    }
  };

  const handleDelete = async (idx) => {
    const row = rows[idx];
    if (!row.id || row.isNew) {
      // Si es una fila nueva, solo la removemos del estado
      setRows(prev => prev.filter((_, i) => i !== idx));
      setFilteredRows(prev => prev.filter((_, i) => i !== idx));
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar este registro?`)) {
      try {
        // TODO: Implementar deleteTransferenciaQuota cuando esté disponible en el backend
        alert("Función de eliminar pendiente de implementar en el backend");
      } catch (err) {
        console.error("Error eliminando registro:", err);
        alert("Error al eliminar el registro");
      }
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      Año: new Date().getFullYear(),
      Mes: "", // editable, se selecciona luego
      Comprension: 0,
      Practica: 0,
      RetencionConocimiento: 0,
      ValoracionDesempeno: 0,
      SatisfaccionTrabajador: 0,
      Total: 0, // calculado
      EfectividadTransferencia: 0, // calculado
      isNew: true,
    };

    setRows(prev => [newRow, ...prev]);
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Transferencia del Conocimiento
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="unified-select"
          >
            <option value="">Todos los años</option>
            {uniqueYears.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="unified-select"
          >
            <option value="">Todos los meses</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>
                {m}
                {/* Opcional: mostrar capitalizado */}
              </option>
            ))}
          </select>
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
          <button
            className="unified-button flex gap-2 items-center justify-center"
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[160px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Comprensión
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Práctica
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Retención del Conocimiento
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Valoración Desempeño
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Satisfacción del Trabajador
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                Total
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Efectividad Transferencia
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map((r, idx) => {
              const isEditing = r.isNew || !!editingRows[r.id];
              return (
              <tr key={idx}>
                <td className="p-2 border text-center whitespace-nowrap">
                  {isEditing ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleSaveSingle(idx)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                        title="Guardar cambios"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => setEditingRows(prev => ({ ...prev, [r.id]: false }))}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                        title="Cancelar edición"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setEditingRows(prev => ({ ...prev, [r.id]: true }))}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        title="Editar registro"
                      >
                        <FaEdit />
                      </button>
                      {!r.isNew && (
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Eliminar registro"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  )}
                </td>
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
                    step={0.1}
                    value={r.Comprension}
                    onChange={e => {
                      handleChange(idx, "Comprension", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    step={0.1}
                    value={r.Practica}
                    onChange={e => {
                      handleChange(idx, "Practica", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    step={0.1}
                    value={r.RetencionConocimiento}
                    onChange={e => {
                      handleChange(
                        idx,
                        "RetencionConocimiento",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    step={0.1}
                    value={r.ValoracionDesempeno}
                    onChange={e => {
                      handleChange(
                        idx,
                        "ValoracionesDesempeno",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    step={0.1}
                    value={r.SatisfaccionTrabajador}
                    onChange={e => {
                      handleChange(
                        idx,
                        "SatisfaccionTrabajador",
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
                      value={r.Total}
                      onChange={e => handleChange(idx, "Total", e.target.value)}
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.Total
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.EfectividadTransferencia}
                      onChange={e =>
                        handleChange(
                          idx,
                          "EfectividadTransferencia",
                          e.target.value
                        )
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.EfectividadTransferencia
                  )}
                </td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
