"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  listIndicators as listIndicatorsQuota,
  saveIndicator as saveIndicatorQuota,
} from "../../services/modulo-financiero/financialService";

export default function IndicadoresTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // Load data on mount
  useEffect(() => {
    load();
  }, []);

  function mapRow(r){
    // Backend devuelve: nombre_indicador, anio, mes, periodo, valor_indicador, dic_anterior, mes_1a, mes_2a, analisis
    const indicador = String(r.indicador ?? r.nombre_indicador ?? r.nombre ?? "");
    const anio = Number(r.anio ?? 0) || undefined;
    const mes = Number(r.mes ?? 0) || undefined;
    const periodo = r.periodo || (anio && mes ? `${anio}-${String(mes).padStart(2,'0')}` : undefined);
    const fecha = periodo ? `${periodo}-01` : (r.fecha || "");
    const id = `${indicador}|${periodo || ''}`;
    const toNum = (v)=>{
      if(v==null || v==='') return 0;
      const n = Number(String(v).replace(/\./g,'').replace(/,/g,'.'));
      return Number.isFinite(n)? n : 0;
    };
    return {
      id,
      indicador,
      anio,
      mes,
      periodo,
      fecha,
      alcance: String(r.alcance ?? r.descripcion ?? r.scope ?? ''),
      mes2a: toNum(r.mes2a ?? r.mes_2a),
      mes1a: toNum(r.mes1a ?? r.mes_1a),
      diciembre1a: toNum(r.diciembre1a ?? r.dic_anterior ?? r.anio_menos_1_dic ?? r.mes_de_diciembre_fijo),
      mesActual: toNum(r.mesActual ?? r.valor_indicador),
      analisis: String(r.analisis ?? r.analysis ?? ''),
    };
  }

  async function load() {
    try {
      const data = await listIndicatorsQuota({ limit: 200 });
      const rows = Array.isArray(data) ? data : (data?.items || []);
      const mapped = rows.map(mapRow);
      setRows(mapped);
      setFilteredRows(mapped);
      setError("");
    } catch (e) {
      console.error("ERROR LOADING INDICATORS", e.response?.data || e);
      setError(e.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

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
    setSaving(true);
    try {
      const updates = Object.entries(editedRows).map(async ([id, changes]) => {
        const fullRow = rows.find(r => String(r.id) === String(id));
        if (!fullRow) return;

        // Backend espera: nombre_indicador, anio, mes, periodo (YYYY-MM, opcional), analisis
        const payload = {
          nombre_indicador: fullRow.indicador,
          anio: Number(fullRow.anio),
          mes: Number(fullRow.mes),
          periodo: fullRow.periodo,
          analisis: (changes.analisis ?? fullRow.analisis) || '',
        };

        await saveIndicatorQuota(payload);
      });

      await Promise.all(updates);

      alert("Cambios guardados correctamente");

      setEditedRows({});
      load(); // ✅ reload data after saving
    } catch (err) {
      console.error(err);
      alert("Error guardando cambios");
    } finally {
      setSaving(false);
    }
  };

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

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(
        r =>
          r.indicador.toLowerCase().includes(query) ||
          r.alcance.toLowerCase().includes(query)
      );
      setFilteredRows(filtered);
    }
  }, [search, rows]);

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
            placeholder="Buscar por codigo u oficina"
            className="border w-[300px] px-2 py-1"
          />
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
