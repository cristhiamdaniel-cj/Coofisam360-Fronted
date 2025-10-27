/**
 *********************************************
 *   Pantalla: Tabla de Indicadores            *
 *********************************************
 * Edición/descarga y CRUD de indicadores con
 * comparativas de períodos.
 */
"use client";
import { use, useEffect, useState } from "react";
import { FaRegSave, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* -------------------------------------
 *  Funciones de servicio utilizadas
 * ------------------------------------- */
import {
  listIndicators as listIndicatorsQuota,
  saveIndicator as saveIndicatorQuota,
  deleteIndicator,
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

  // Función para cargar indicadores disponibles
  async function loadIndicadoresDisponibles() {
    try {
      const indicadores = await getIndicadoresDisponibles();
      setIndicadoresDisponibles(indicadores);
    } catch (error) {
      console.error("Error cargando indicadores disponibles:", error);
      // Fallback con indicadores básicos
      setIndicadoresDisponibles([
        "Liquidez General",
        "Liquidez Corriente", 
        "Capital de Trabajo",
        "Endeudamiento Total",
        "Rentabilidad del Patrimonio",
        "Rentabilidad de los Activos",
        "Margen de Utilidad",
        "Rotación de Cartera",
        "Rotación de Inventarios",
        "Rotación de Activos"
      ]);
    }
  }

  // Utilidad: intentar reparar problemas comunes de codificación (mojibake)
  function fixEncoding(str) {
    try {
      if (!str) return "";
      const s = String(str);
      // Heurística: si contiene caracteres típicos de mojibake (Ã, Â, �)
      if (/[ÃÂ�]/.test(s)) {
        // Reconstruir bytes latin1 y decodificar como UTF-8
        const bytes = new Uint8Array([...s].map((c) => c.charCodeAt(0) & 0xff));
        const decoded = new TextDecoder("utf-8").decode(bytes);
        // Si el decodificado se ve razonable (aparecen tildes), úsalo
        if (/[áéíóúñÁÉÍÓÚÑ]/.test(decoded)) return decoded;
      }
      return s;
    } catch (_) {
      return String(str || "");
    }
  }

  /***************************************
   *       Bloque de lógica principal     *
   ***************************************/
  // Utilidad: parsear números con formatos es/en ("1.234,56" | "1234.56" | "1,234.56")
  function parseLocaleNumber(value) {
    if (value == null || value === "") return 0;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    let s = String(value).trim();
    // Quitar espacios duros o no separadores
    s = s.replace(/[\s\u00A0]/g, "");

    const hasDot = s.includes(".");
    const hasComma = s.includes(",");

    if (hasDot && hasComma) {
      // Decidir cuál es decimal por la última aparición
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
        // Formato es: miles con punto, decimal con coma -> 1.234,56
        s = s.replace(/\./g, "").replace(/,/g, ".");
      } else {
        // Formato es: miles con coma, decimal con punto -> 1,234.56
        s = s.replace(/,/g, "");
      }
    } else if (hasComma && !hasDot) {
      // Solo coma -> usar como decimal
      s = s.replace(/,/g, ".");
    } else {
      // Solo punto o ni uno -> dejar tal cual, pero quitar separadores de miles repetidos
      const parts = s.split(".");
      if (parts.length > 2) {
        // Hay múltiples puntos, mantener el último como decimal
        const decimal = parts.pop();
        s = parts.join("") + "." + decimal;
      }
    }

    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }

  // Formatear porcentajes con 2 decimales, estilo es-CO
  const nfPct = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  function formatPercent(n) {
    const num = typeof n === "number" ? n : parseLocaleNumber(n);
    return `${nfPct.format(num)}%`;
  }

  /* -------------------------------------
   *  Función para mapear filas del API
   * ------------------------------------- */
  function mapRow(r) {
    // Backend devuelve: nombre_indicador, anio, mes, periodo, valor_indicador, dic_anterior, mes_1a, mes_2a, analisis
    const indicador = String(
      r.indicador ?? r.nombre_indicador ?? r.nombre ?? ""
    );
    const anio = Number(r.anio ?? 0) || undefined;
    const mes = Number(r.mes ?? 0) || undefined;
    const periodo =
      r.periodo ||
      (anio && mes ? `${anio}-${String(mes).padStart(2, "0")}` : undefined);
    const fecha = periodo ? `${periodo}-01` : r.fecha || "";
    const baseId = `${indicador}|${periodo || ""}`;
    const toNum = (v) => parseLocaleNumber(v);
    return {
      id: baseId,
      _baseId: baseId,
      indicador: fixEncoding(indicador),
      anio,
      mes,
      periodo,
      fecha,
      alcance: fixEncoding(
        String(r.alcance ?? r.descripcion ?? r.scope ?? "")
      ),
      mes2a: toNum(r.mes2a ?? r.mes_2a),
      mes1a: toNum(r.mes1a ?? r.mes_1a),
      diciembre1a: toNum(
        r.diciembre1a ??
          r.dic_anterior ??
          r.anio_menos_1_dic ??
          r.mes_de_diciembre_fijo
      ),
      mesActual: toNum(r.mesActual ?? r.valor_indicador),
      analisis: fixEncoding(String(r.analisis ?? r.analysis ?? "")),
    };
  }

  /**
   * +-----------------------------------+
   * |        Función de inicio          |
   * |-----------------------------------|
   * | Carga inicial de indicadores      |
   * +-----------------------------------+
   */
  async function load() {
    try {
      const data = await listIndicatorsQuota({ limit: 1000 });
      const rows = Array.isArray(data) ? data : data?.items || [];
      const mapped = rows.map(mapRow);
      // Asegurar keys únicas para React aun si hay duplicados en (indicador, periodo)
      const counter = Object.create(null);
      const withUniqueIds = mapped.map((row) => {
        const key = row._baseId;
        counter[key] = (counter[key] || 0) + 1;
        const uniqueId = counter[key] === 1 ? key : `${key}#${counter[key]}`;
        return { ...row, id: uniqueId };
      });
      setRows(withUniqueIds);
      setFilteredRows(withUniqueIds);
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

        // Enviamos todos los campos relevantes para persistir en finanzas.indicadores_comparativa
        const payload = {
          nombre_indicador: fullRow.indicador,
          indicador: fullRow.indicador,
          anio: Number(fullRow.anio),
          mes: Number(fullRow.mes),
          periodo: fullRow.periodo,
          alcance: changes.alcance ?? fullRow.alcance,
          mesActual: changes.mesActual ?? fullRow.mesActual,
          diciembre1a: changes.diciembre1a ?? fullRow.diciembre1a,
          mes1a: changes.mes1a ?? fullRow.mes1a,
          mes2a: changes.mes2a ?? fullRow.mes2a,
          analisis: (changes.analisis ?? fullRow.analisis) || "",
        };

        await saveIndicatorQuota(payload);
      });

      await Promise.all(updates);

      setStatusMsg("Cambios guardados correctamente");
      setStatusType("success");

      setEditedRows({});
      load(); // ✅ reload data after saving
    } catch (err) {
      console.error(err);
      setStatusMsg("Error guardando cambios");
      setStatusType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRow = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const periodo = `${year}-${String(month).padStart(2, "0")}`;
    
    const newRow = {
      id: `new-${Date.now()}`, // id único temporal
      indicador: "",
      anio: year,
      mes: month,
      periodo: periodo,
      fecha: `${periodo}-01`,
      alcance: "",
      mes2a: 0,
      mes1a: 0,
      diciembre1a: 0,
      mesActual: 0,
      analisis: "",
      isNew: true
    };

    setRows(prev => [newRow, ...prev]); // agregamos al inicio
    setFilteredRows(prev => [newRow, ...prev]);
    setEditingRows(prev => ({ ...prev, [newRow.id]: true })); // Entrar en modo edición automáticamente
  };

  const handleDelete = async (row) => {
    // Primera confirmación
    const firstConfirm = window.confirm(
      `¿Está seguro que desea eliminar el indicador "${row.indicador}" del período ${row.anio}-${row.mes}?`
    );
    
    if (!firstConfirm) return;
    
    // Segunda confirmación
    const secondConfirm = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Confirma que desea ELIMINAR permanentemente este indicador financiero?`
    );
    
    if (!secondConfirm) return;
    
    try {
      await deleteIndicator(row.indicador, row.anio, row.mes);
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

  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows.filter(r => {
      const matchesSearch =
        !query ||
        r.indicador.toLowerCase().includes(query) ||
        r.alcance.toLowerCase().includes(query);

      const matchesYear = !selectedYear || r.anio === Number(selectedYear);
      const matchesMonth = !selectedMonth || r.mes === Number(selectedMonth);

      return matchesSearch && matchesYear && matchesMonth;
    });
    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  if (loading) return <div className="p-12 text-center">Cargando datos...</div>;
  if (error)
    return <div className="p-12 text-center text-red-500">{error}</div>;

  const uniqueYears = [...new Set(rows.map(r => r.anio).filter(Boolean))];
  const uniqueMonths = [...new Set(rows.map(r => r.mes).filter(Boolean))];

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const availableMonths = monthNames
    .map((name, index) => ({ name, number: index + 1 }))
    .filter(m => uniqueMonths.includes(m.number));

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Indicadores Financieros
      </h1>

      {/* 🔹 Actions */}
      <div className="actions-container flex justify-between mb-4">
        {statusMsg && (
          <div className={`px-4 py-2 rounded text-sm ${statusType === 'success' ? 'bg-green-100 text-green-800' : statusType === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {statusMsg}
          </div>
        )}
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por indicador o alcance"
            className="unified-input w-[300px]"
          />
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
              className="unified-button flex gap-2 items-center justify-center"
            >
              Guardar cambios <FaRegSave />
            </button>
          )}
          <button
            onClick={handleDownload}
            className="unified-button flex gap-2 items-center justify-center"
          >
            Descargar <FiDownload />
          </button>
          <button
            onClick={handleAddRow}
            className="unified-button flex gap-2 items-center justify-center"
          >
            Agregar Fila <FaArrowDownWideShort />
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                Análisis
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => { 
              const isEditing = r.isNew || !!editingRows[r.id];
              const isRecentlyCreated = r.isNew;
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
                              try {
                                if (r.isNew) {
                                  // Para filas nuevas, validar campos requeridos
                                  if (!r.indicador || !r.anio || !r.mes) {
                                    setStatusMsg("Por favor complete todos los campos requeridos (Indicador, Año, Mes)");
                                    setStatusType("error");
                                    return;
                                  }
                                  await saveIndicatorQuota({
                                    nombre_indicador: r.indicador,
                                    indicador: r.indicador,
                                    anio: Number(r.anio),
                                    mes: Number(r.mes),
                                    periodo: r.periodo,
                                    alcance: r.alcance,
                                    mesActual: r.mesActual,
                                    diciembre1a: r.diciembre1a,
                                    mes1a: r.mes1a,
                                    mes2a: r.mes2a,
                                    analisis: r.analisis || "",
                                  });
                                  setStatusMsg("Indicador financiero guardado correctamente");
                                  setStatusType("success");
                                  // Recargar datos
                                  await load();
                                } else {
                                  // Para filas existentes, guardar cambios
                                  await saveIndicatorQuota({
                                    nombre_indicador: r.indicador,
                                    indicador: r.indicador,
                                    anio: Number(r.anio),
                                    mes: Number(r.mes),
                                    periodo: r.periodo,
                                    alcance: r.alcance,
                                    mesActual: r.mesActual,
                                    diciembre1a: r.diciembre1a,
                                    mes1a: r.mes1a,
                                    mes2a: r.mes2a,
                                    analisis: r.analisis || "",
                                  });
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
                        <>
                          <button
                            onClick={() => setEditingRows(prev => ({...prev, [r.id]: true}))}
                            className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          {!r.isNew && (
                            <button
                              onClick={() => handleDelete(r)}
                              className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </td>
                <td className="border p-2">
                  {isEditing && r.isNew ? (
                    <input
                      type="text"
                      value={r.fecha}
                      onChange={e => handleChange(r.id, "fecha", e.target.value)}
                      className="px-2 py-1 w-full border text-center"
                      placeholder="YYYY-MM-DD"
                    />
                  ) : (
                    r.fecha
                  )}
                </td>
                <td className="border p-2">
                  {isEditing && r.isNew ? (
                    <select
                      value={r.indicador}
                      onChange={e => handleChange(r.id, "indicador", e.target.value)}
                      className="px-2 py-1 w-full border"
                    >
                      <option value="">Seleccionar indicador</option>
                      {indicadoresDisponibles.map(indicador => (
                        <option key={indicador} value={indicador}>
                          {indicador}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.indicador
                  )}
                </td>
                <td className="border p-2">
                  {isEditing && r.isNew ? (
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
                <td className="border p-2 text-right">
                  {isEditing && r.isNew ? (
                    <input
                      type="number"
                      step="0.01"
                      value={r.mes2a || ''}
                      onChange={e => handleChange(r.id, "mes2a", parseFloat(e.target.value) || 0)}
                      className="px-2 py-1 w-full border text-right"
                      placeholder="0.00"
                    />
                  ) : (
                    formatPercent(r.mes2a)
                  )}
                </td>
                <td className="border p-2 text-right">
                  {isEditing && r.isNew ? (
                    <input
                      type="number"
                      step="0.01"
                      value={r.mes1a || ''}
                      onChange={e => handleChange(r.id, "mes1a", parseFloat(e.target.value) || 0)}
                      className="px-2 py-1 w-full border text-right"
                      placeholder="0.00"
                    />
                  ) : (
                    formatPercent(r.mes1a)
                  )}
                </td>
                <td className="border p-2 text-right">
                  {isEditing && r.isNew ? (
                    <input
                      type="number"
                      step="0.01"
                      value={r.diciembre1a || ''}
                      onChange={e => handleChange(r.id, "diciembre1a", parseFloat(e.target.value) || 0)}
                      className="px-2 py-1 w-full border text-right"
                      placeholder="0.00"
                    />
                  ) : (
                    formatPercent(r.diciembre1a)
                  )}
                </td>
                <td className="border p-2 text-right">
                  {isEditing && r.isNew ? (
                    <input
                      type="number"
                      step="0.01"
                      value={r.mesActual || ''}
                      onChange={e => handleChange(r.id, "mesActual", parseFloat(e.target.value) || 0)}
                      className="px-2 py-1 w-full border text-right"
                      placeholder="0.00"
                    />
                  ) : (
                    formatPercent(r.mesActual)
                  )}
                </td>
                <td className="border p-2">
                  {isEditing ? (
                    <textarea
                      value={r.analisis}
                      onChange={e => handleChange(r.id, "analisis", e.target.value)}
                      className="w-full p-2 border rounded resize-none"
                      rows={3}
                      placeholder="Ingrese análisis..."
                    />
                  ) : (
                    <div className="w-full p-2 whitespace-pre-wrap">
                      {fixEncoding(editedRows[r.id]?.analisis ?? r.analisis) || ""}
                    </div>
                  )}
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </main>
  );
}
