"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  listIndicatorsQuota,
  saveIndicatorQuota, // ✅ note: correct name
} from "../../services/modulo-financiero/indicatorsQuota";

export default function IndicadoresTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // 🔹 Load data on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await listIndicatorsQuota({ limit: 200 });
        console.log("DATA FROM listIndicatorsQuota", data);
        setRows(data);
        setFilteredRows(data);
        setError("");
      } catch (e) {
        console.error("ERROR LOADING INDICATORS", e.response?.data || e);
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔹 Update state on cell change
  const handleChange = (id, field, value) => {
    const updateRow = row => (row.id === id ? { ...row, [field]: value } : row);

    setRows(prev => prev.map(updateRow));
    setFilteredRows(prev => prev.map(updateRow));

    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // 🔹 Save edited rows to the API
  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedRows).map(async ([id, changes]) => {
        const fullRow = rows.find(r => r.id === Number(id));
        if (!fullRow) return;

        const payload = {
          ...fullRow,
          ...changes,
          id: Number(id),
        };

        await saveIndicatorQuota(payload);
      });

      await Promise.all(updates);

      alert("Cambios guardados correctamente");
      setEditedRows({});
    } catch (err) {
      console.error(err);
      alert("Error guardando cambios");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Download Excel
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Indicadores Financieros"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Indicadores_Financieros.xlsx");
  };

  // 🔹 Filter by search
  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredRows(rows);
    } else {
      const lower = search.toLowerCase();
      setFilteredRows(
        rows.filter(
          r =>
            r.indicador.toLowerCase().includes(lower) ||
            r.alcance.toLowerCase().includes(lower)
        )
      );
    }
  };

  if (loading) return <div className="p-12 text-center">Cargando datos...</div>;
  if (error)
    return <div className="p-12 text-center text-red-500">{error}</div>;

  return (
    <main className="pt-12 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-12">
        Indicadores Financieros
      </h1>

      {/* 🔹 Actions */}
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por indicador o alcance"
            className="border w-[300px] px-2 py-1"
          />
          <button
            onClick={handleSearch}
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
          >
            Buscar
            <IoSearch />
          </button>
        </div>
        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="action-button flex gap-2 items-center justify-center cursor-pointer"
            >
              Guardar cambios <FaRegSave />
            </button>
          )}
          <button
            onClick={handleDownload}
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
          >
            Descargar <FiDownload />
          </button>
        </div>
      </div>

      {/* 🔹 Table */}
      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-cupos-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Fecha
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Indicador
              </th>
              <th className="py-4 px-28 border text-center whitespace-nowrap">
                Alcance
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Mismo mes <br />2 años atrás
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Mismo mes <br />
                año anterior
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Diciembre <br />
                año anterior
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Mes año actual
              </th>
              <th className="py-4 px-28 border text-center whitespace-nowrap">
                Análisis
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="border p-2">{r.fecha}</td>
                <td className="border p-2">{r.indicador}</td>
                <td className="border p-2">{r.alcance}</td>
                <td className="border p-2">{r.mes2a}</td>
                <td className="border p-2">{r.mes1a}</td>
                <td className="border p-2">{r.diciembre1a}</td>
                <td className="border p-2">{r.mesActual}</td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={r.analisis}
                    onChange={e =>
                      handleChange(r.id, "analisis", e.target.value)
                    }
                    className="px-2 py-1 w-full cursor-pointer border"
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
