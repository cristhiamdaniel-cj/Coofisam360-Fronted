"use client";
import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  listBonificacionRows,
  saveBonificacionRow,
} from "@/app/services/modulo-talento/carpeta-talento/bonificaQuota";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [editingRows, setEditingRows] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const data = await listBonificacionRows({ limit: 240 });
        setRows(Array.isArray(data) ? data : data?.items || []);
        setError("");
      } catch (e) {
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  useEffect(() => {
    const q = search.trim().toLowerCase();
    const filtered = (rows || [])
      .filter(r => {
        const matchesSearch =
          !q || String(r.MES || "").toLowerCase().includes(q);
        const matchesYear = !selectedYear || r.AÑO === Number(selectedYear);
        const matchesMonth =
          !selectedMonth || String(r.MES || "").toUpperCase() === selectedMonth.toUpperCase();
        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => (Number(a.AÑO) - Number(b.AÑO)) || monthNames.indexOf(a.MES) - monthNames.indexOf(b.MES));
    setFilteredRows(filtered);
  }, [rows, search, selectedYear, selectedMonth]);

  const uniqueYears = useMemo(
    () => [...new Set((rows || []).map(r => r.AÑO).filter(Boolean))],
    [rows]
  );
  const uniqueMonths = useMemo(
    () => [...new Set((rows || []).map(r => r.MES && r.MES.toUpperCase()).filter(Boolean))],
    [rows]
  );
  const availableMonths = monthNames.filter(m => uniqueMonths.includes(m));

  const handleChange = (id, field, value) => {
    setRows(prev => prev.map(r => (String(r.id) === String(id) ? { ...r, [field]: value } : r)));
    setFilteredRows(prev => prev.map(r => (String(r.id) === String(id) ? { ...r, [field]: value } : r)));
    setEditedRows(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
  };

  const handleSave = async () => {
    try {
      const ids = Object.keys(editedRows || {});
      for (const id of ids) {
        const row = rows.find(r => String(r.id) === String(id));
        if (!row) continue;
        await saveBonificacionRow(row);
      }
      setEditedRows({});
      const data = await listBonificacionRows({ limit: 240 });
      setRows(Array.isArray(data) ? data : data?.items || []);
      alert("Cambios guardados correctamente ✅");
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios ❌");
    }
  };

  const handleSaveSingle = async rowId => {
    try {
      const row = rows.find(r => String(r.id) === String(rowId));
      if (!row) return;
      await saveBonificacionRow(row);
      setEditingRows(prev => ({ ...prev, [rowId]: false }));
      setEditedRows(prev => {
        const n = { ...prev };
        delete n[rowId];
        return n;
      });
      const data = await listBonificacionRows({ limit: 240 });
      setRows(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      console.error(err);
      alert("Error al guardar el registro");
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      AÑO: new Date().getFullYear(),
      MES: "ENERO",
      "CANTIDAD EMPLEADOS": 0,
      "CANTIDAD BENEFICIADOS": 0,
      "% VARIACIÓN": 0,
      isNew: true,
    };
    setRows(prev => [newRow, ...prev]);
    setFilteredRows(prev => [newRow, ...prev]);
    setEditingRows(prev => ({ ...prev, [newRow.id]: true }));
    setEditedRows(prev => ({ ...prev, [newRow.id]: newRow }));
  };

  const handleDownload = () => {
    const dataToExport = filteredRows.length > 0 ? filteredRows : rows;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bonificación");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    const fileName = filteredRows.length > 0 && filteredRows.length < rows.length
      ? `bonificacion-filtrado-${filteredRows.length}-registros.xlsx`
      : "bonificacion-completo.xlsx";
    saveAs(data, fileName);
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">Bonificación</h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por mes"
            className="unified-input w-[300px]"
          />
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="unified-select">
            <option value="">Todos los años</option>
            {uniqueYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="unified-select">
            <option value="">Todos los meses</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
              title="Guardar cambios"
            >
              <FaCheck />
            </button>
          )}
          <button className="unified-button flex gap-2 items-center justify-center" onClick={handleDownload}>
            Descargar <FiDownload />
          </button>
          <button className="unified-button flex gap-2 items-center justify-center" onClick={handleAddRow}>
            Añadir fila
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th className="p-4 border text-center">Acciones</th>
              <th className="p-4 border text-center">Año</th>
              <th className="p-4 border text-center">Mes</th>
              <th className="p-4 border text-center">Cantidad Empleados</th>
              <th className="p-4 border text-center">Cantidad Beneficiados</th>
              <th className="p-4 border text-center">% Variación</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content">
            {filteredRows.map(row => {
              const isEditing = row.isNew || !!editingRows[row.id];
              return (
                <tr key={row.id}>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSaveSingle(row.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
                          title="Guardar"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => setEditingRows(prev => ({ ...prev, [row.id]: false }))}
                          className="px-3 py-1 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600"
                          title="Cancelar"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingRows(prev => ({ ...prev, [row.id]: true }))}
                        className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </td>
                  <td className="p-2 border text-center">{row.AÑO}</td>
                  <td className="p-2 border text-center">
                    {isEditing ? (
                      <select value={row.MES} onChange={e => handleChange(row.id, "MES", e.target.value)} className="border rounded p-1">
                        {monthNames.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    ) : (
                      row.MES
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    {isEditing ? (
                      <input type="number" value={row["CANTIDAD EMPLEADOS"] ?? 0} onChange={e => handleChange(row.id, "CANTIDAD EMPLEADOS", e.target.value)} className="border rounded p-1 w-24 text-center" />
                    ) : (
                      row["CANTIDAD EMPLEADOS"]
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    {isEditing ? (
                      <input type="number" value={row["CANTIDAD BENEFICIADOS"] ?? 0} onChange={e => handleChange(row.id, "CANTIDAD BENEFICIADOS", e.target.value)} className="border rounded p-1 w-24 text-center" />
                    ) : (
                      row["CANTIDAD BENEFICIADOS"]
                    )}
                  </td>
                  <td className="p-2 border text-center">{row["% VARIACIÓN"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
