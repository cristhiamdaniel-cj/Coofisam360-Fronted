"use client";
import { use, useEffect, useState } from "react";
import { FaRegSave, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  listIndicators as listIndicatorsQuota,
  saveIndicator as saveIndicatorQuota,
  deleteIndicator as deleteIndicatorQuota,
  getIndicadoresDisponibles,
} from "../../services/modulo-financiero/financialService";

export default function IndicadoresTable() {
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
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info"); // success | error | info
  const [indicadoresDisponibles, setIndicadoresDisponibles] = useState([]);

  // Load data on mount
  useEffect(() => {
    load();
    loadIndicadoresDisponibles();
  }, []);

  const loadIndicadoresDisponibles = async () => {
    try {
      const indicadores = await getIndicadoresDisponibles();
      setIndicadoresDisponibles(indicadores);
    } catch (err) {
      console.error("Error cargando indicadores disponibles:", err);
    }
  };

  function mapRow(r) {
    // Backend devuelve: nombre_indicador, anio, mes, periodo, valor_indicador, dic_anterior, mes_1a, mes_2a, analisis
    const indicador = String(
      r.indicador ?? r.nombre_indicador ?? r.nombre ?? ""
    );
    const alcance = String(r.alcance ?? r.scope ?? "");
    const anio = Number(r.anio ?? r.year ?? 0) || 0;
    const mes = Number(r.mes ?? r.month ?? 0) || 0;
    const periodo = String(r.periodo ?? r.period ?? "");
    const fecha = String(r.fecha ?? r.date ?? "");

    return {
      id: String(r.id ?? r.indicador_id ?? ""),
      indicador,
      alcance,
      anio,
      mes,
      periodo,
      fecha,
      mes2a: toNum(r.mes2a ?? r.mes_2a ?? r.valor_indicador_2),
      mes1a: toNum(r.mes1a ?? r.mes_1a ?? r.valor_indicador_1),
      diciembre1a: toNum(
        r.diciembre1a ?? r.dic_anterior ?? r.anio_menos_1_dic
      ),
      mesActual: toNum(r.mesActual ?? r.valor_indicador),
      analisis: String(r.analisis ?? r.analysis ?? ""),
    };
  }

  async function load() {
    try {
      const data = await listIndicatorsQuota({ limit: 1000 });
      const rows = Array.isArray(data) ? data : data?.items || [];
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

    // Si se cambia el indicador, actualizar automáticamente el alcance
    if (field === 'indicador') {
      const indicadorSeleccionado = indicadoresDisponibles.find(ind => ind.nombre === value);
      if (indicadorSeleccionado) {
        const updateRowWithAlcance = row => (row.id === id ? { ...row, alcance: indicadorSeleccionado.alcance } : row);
        setRows(prev => prev.map(updateRowWithAlcance));
        setFilteredRows(prev => prev.map(updateRowWithAlcance));
        setEditedRows(prev => ({
          ...prev,
          [id]: { ...prev[id], alcance: indicadorSeleccionado.alcance },
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const keys = Object.keys(editedRows);
      let ok = 0, fail = 0;
      for (const k of keys) {
        const row = rows.find(r => String(r.id) === String(k));
        if (!row) continue;
        const merged = { ...row, ...(editedRows[k] || {}) };
        try {
          const payload = {
            nombre_indicador: merged.indicador,
            anio: Number(merged.anio),
            mes: Number(merged.mes),
            periodo: merged.periodo,
            analisis: merged.analisis || "",
          };
          await saveIndicatorQuota(payload);
          ok++;
        } catch (e) {
          console.error(e);
          fail++;
        }
      }
      setEditedRows({});
      await load();
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

  const handleDelete = async (id, indicador, anio, mes) => {
    // Primera confirmación
    const firstConfirm = window.confirm(
      `¿Está seguro que desea eliminar el indicador "${indicador}" del período ${anio}-${mes}?`
    );
    
    if (!firstConfirm) return;
    
    // Segunda confirmación
    const secondConfirm = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Confirma que desea ELIMINAR permanentemente este indicador financiero?`
    );
    
    if (!secondConfirm) return;
    
    try {
      await deleteIndicatorQuota(id);
      setStatusMsg("Indicador financiero eliminado correctamente");
      setStatusType("success");
      // Recargar datos
      await load();
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message || "Error eliminando indicador financiero");
      setStatusType("error");
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
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

  const handleAddRow = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const periodo = `${year}-${String(month).padStart(2, "0")}`;
    const fecha = `${periodo}-01`;
    
    const newRow = {
      id: `new-${Date.now()}`, // id único temporal
      indicador: "",
      anio: year,
      mes: month,
      periodo: periodo,
      fecha: fecha,
      alcance: "",
      mes2a: 0,
      mes1a: 0,
      diciembre1a: 0,
      mesActual: 0,
      analisis: "",
      isNew: true,
      created_at: new Date().toISOString() // Timestamp para indicador visual
    };

    setRows(prev => [newRow, ...prev]); // agregamos al inicio
    setFilteredRows(prev => [newRow, ...prev]);
    setEditingRows(prev => ({ ...prev, [newRow.id]: true })); // Entrar en modo edición automáticamente
  };

  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows.filter(r => {
      const matchesSearch = !query || 
        (r.indicador && r.indicador.toLowerCase().includes(query)) ||
        (r.alcance && r.alcance.toLowerCase().includes(query)) ||
        (r.analisis && r.analisis.toLowerCase().includes(query)) ||
        (r.periodo && r.periodo.toLowerCase().includes(query));

      const matchesYear = !selectedYear || r.anio === Number(selectedYear);
      const matchesMonth = !selectedMonth || r.mes === Number(selectedMonth);

      return matchesSearch && matchesYear && matchesMonth;
    });
    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  function toNum(v) {
    if (v == null) return 0;
    const n = Number(
      String(v)
        .replace(/\./g, "")
        .replace(/,/g, ".")
        .replace(/[^\d.-]/g, "")
    );
    return Number.isFinite(n) ? n : 0;
  }

  if (loading) {
    return <div className="p-12 text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }

  const uniqueYears = [...new Set(rows.map(r => r.anio).filter(Boolean))];
  const uniqueMonths = [...new Set(rows.map(r => r.mes).filter(Boolean))];

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const availableMonths = monthNames
    .map((name, index) => ({ name, number: index + 1 }))
    .filter(m => uniqueMonths.includes(m.number));

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Indicadores Financieros
      </h1>
      <div className="actions-container flex justify-between mb-4">
        {statusMsg && (
          <div className={`px-4 py-2 rounded text-sm ${statusType === 'success' ? 'bg-green-100 text-green-800' : statusType === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {statusMsg}
          </div>
        )}
        <div className="search-bar flex gap-2">
          <IoSearch className="text-xl" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por indicador o alcance"
            className="border w-[300px] px-2 py-1"
          />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="">Todos los años</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="">Todos los meses</option>
            {availableMonths.map(m => (
              <option key={m.number} value={m.number}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 disabled:opacity-50 flex gap-2 items-center justify-center"
            >
              {saving ? "Guardando..." : "Guardar cambios"} <FaRegSave />
            </button>
          )}
          <button
            onClick={handleDownload}
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
          >
            Descargar <FiDownload />
          </button>
          <button
            onClick={handleAddRow}
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
          >
            Añadir fila <FaArrowDownWideShort />
          </button>
        </div>
      </div>

      {/* 🔹 Table */}
      <div className="overflow-auto max-w-full table-container h-[62vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-cupos-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">Acciones</th>
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
              <th className="p-4 border text-center whitespace-nowrap">
                Análisis
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map((r, idx) => { 
              const isEditing = r.isNew || !!editingRows[r.id];
              const isRecentlyCreated = r.isNew; // Solo para filas realmente nuevas
              return (
              <tr key={r.id} className={isRecentlyCreated ? "bg-green-50" : ""}>
                <td className="p-2 border text-center whitespace-nowrap">
                  <div className="flex flex-col gap-2 items-center">
                    {isRecentlyCreated && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        NUEVO
                      </span>
                    )}
                    <div className="flex gap-2 justify-center">
                      {isEditing ? (
                        <>
                          <button
                            onClick={async () => {
                              // Validar antes de guardar
                              if (!r.indicador || !r.anio || !r.mes) {
                                setStatusMsg("Por favor complete todos los campos requeridos (Indicador, Año, Mes)");
                                setStatusType("error");
                                return;
                              }
                              // Guardar automáticamente antes de terminar
                              try {
                                if (r.isNew) {
                                  // Para filas nuevas, validar campos requeridos
                                  if (!r.indicador || !r.anio || !r.mes) {
                                    setStatusMsg("Por favor complete todos los campos requeridos (Indicador, Año, Mes)");
                                    setStatusType("error");
                                    return;
                                  }
                                  await saveIndicatorQuota(r);
                                  setStatusMsg("Indicador financiero guardado correctamente");
                                  setStatusType("success");
                                  // Recargar datos
                                  await load();
                                } else {
                                  // Para filas existentes, guardar cambios
                                  await saveIndicatorQuota(r);
                                  setStatusMsg("Cambios guardados correctamente");
                                  setStatusType("success");
                                  // Recargar datos
                                  await load();
                                }
                              } catch (err) {
                                console.error(err);
                                setStatusMsg(err.message || "Error guardando cambios");
                                setStatusType("error");
                                return;
                              }
                              setEditingRows(prev => ({...prev, [r.id]: false}));
                            }}
                            className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
                            title="Guardar"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => {
                              if (r.isNew) {
                                // Si es nueva y se cancela, eliminar la fila
                                setRows(prev => prev.filter(row => row.id !== r.id));
                                setFilteredRows(prev => prev.filter(row => row.id !== r.id));
                              }
                              setEditingRows(prev => ({...prev, [r.id]: false}));
                            }}
                            className="px-3 py-1 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600"
                            title="Cancelar"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingRows(prev => ({...prev, [r.id]: true}))}
                          className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {!r.isNew && (
                        <button
                          onClick={() => handleDelete(r.id, r.indicador, r.anio, r.mes)}
                          className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                          title="Eliminar indicador financiero"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="border p-2">
                  {isEditing ? (
                    <input
                      type="date"
                      value={r.fecha}
                      onChange={e => {
                        const newDate = e.target.value;
                        const [year, month] = newDate.split('-');
                        const periodo = `${year}-${month}`;
                        handleChange(r.id, "fecha", newDate);
                        handleChange(r.id, "anio", parseInt(year));
                        handleChange(r.id, "mes", parseInt(month));
                        handleChange(r.id, "periodo", periodo);
                      }}
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.fecha
                  )}
                </td>
                <td className="border p-2">
                  {isEditing ? (
                    <select
                      value={r.indicador}
                      onChange={e => handleChange(r.id, "indicador", e.target.value)}
                      className="px-2 py-1 w-full border"
                    >
                      <option value="">Seleccionar indicador</option>
                      {indicadoresDisponibles.map(ind => (
                        <option key={ind.nombre} value={ind.nombre}>
                          {ind.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.indicador
                  )}
                </td>
                <td className="border p-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.alcance}
                      onChange={e => handleChange(r.id, "alcance", e.target.value)}
                      className="px-2 py-1 w-full border"
                      placeholder="Alcance del indicador"
                    />
                  ) : (
                    r.alcance
                  )}
                </td>
                <td className="border p-2">{r.mes2a}%</td>
                <td className="border p-2">{r.mes1a}%</td>
                <td className="border p-2">{r.diciembre1a}%</td>
                <td className="border p-2">
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={r.mesActual}
                      onChange={e => handleChange(r.id, "mesActual", parseFloat(e.target.value) || 0)}
                      className="px-2 py-1 w-full border text-right"
                      placeholder="0.00"
                    />
                  ) : (
                    `${r.mesActual}%`
                  )}
                </td>
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
            );})}
          </tbody>
        </table>
      </div>
    </main>
  );
}