/**
 *********************************************
 *   Pantalla: Categorías de Oficinas          *
 *********************************************
 * Gestión de categorías por oficina y período.
 */
"use client";
import { useEffect, useState } from "react";
import {
  listCategoriesQuota,
  saveCategoryQuota,
  deleteCategoryQuota,
  getOficinasDisponibles,
  getCategoryQuota,
} from "../../services/modulo-financiero/categoriesQuota";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegSave, FaFileDownload, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaArrowDownWideShort } from "react-icons/fa6";

export default function CategoriasTable() {
  /***************************************
   *       Bloque de lógica principal     *
   ***************************************/
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info"); // success | error | info
  const [oficinasDisponibles, setOficinasDisponibles] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const data = await listCategoriesQuota({ limit: 900 });

      // Sort by codigo numerically
      const sorted = [...data].sort(
        (a, b) => Number(a.codigo) - Number(b.codigo)
      );

      setRows(sorted);
      setFilteredRows(sorted);
      setError("");
    } catch (e) {
      setError(e.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    loadOficinasDisponibles();
  }, []);

  /* -------------------------------------
   *  Cargar catálogo de oficinas
   * ------------------------------------- */
  async function loadOficinasDisponibles() {
    try {
      const oficinas = await getOficinasDisponibles();
      console.log("Oficinas cargadas:", oficinas); // Debug
      setOficinasDisponibles(oficinas);
    } catch (error) {
      console.error("Error cargando oficinas disponibles:", error);
      setStatusMsg("Error cargando oficinas disponibles");
      setStatusType("error");
    }
  }

  // Formateadores numéricos
  const nfMoney = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  function parseLocaleNumber(value) {
    if (value == null || value === "") return 0;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    let s = String(value).trim();
    s = s.replace(/[\s\u00A0]/g, "");
    const hasDot = s.includes(".");
    const hasComma = s.includes(",");
    if (hasDot && hasComma) {
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
        s = s.replace(/\./g, "").replace(/,/g, ".");
      } else {
        s = s.replace(/,/g, "");
      }
    } else if (hasComma && !hasDot) {
      s = s.replace(/,/g, ".");
    } else {
      const parts = s.split(".");
      if (parts.length > 2) {
        const decimal = parts.pop();
        s = parts.join("") + "." + decimal;
      }
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  function toNumber(val) {
    return parseLocaleNumber(val);
  }
  function formatMoney(val) {
    return nfMoney.format(toNumber(val));
  }

  // Reparar mojibake (UTF-8 leído como latin1) para tildes
  function fixEncoding(str) {
    try {
      if (!str) return "";
      const s = String(str);
      if (/[ÃÂ�]/.test(s)) {
        const bytes = new Uint8Array([...s].map((c) => c.charCodeAt(0) & 0xff));
        const decoded = new TextDecoder("utf-8").decode(bytes);
        if (/[áéíóúñÁÉÍÓÚÑ]/.test(decoded)) return decoded;
      }
      return s;
    } catch (_) {
      return String(str || "");
    }
  }

  function getErrorMessage(err) {
    try {
      if (!err) return "Error desconocido";
      if (typeof err === "string") return err;
      if (err.message) return err.message;
      if (err.data && (err.data.message || err.data.error)) return err.data.message || err.data.error;
      if (err.status && err.statusText) return `${err.status} ${err.statusText}`;
      return JSON.stringify(err);
    } catch (_) {
      return "Error desconocido";
    }
  }

  // Calcula el periodo inmediatamente anterior (YYYY, M)
  function getPrevPeriod(year, month) {
    const y = Number(year);
    const m = Number(month);
    if (!y || !m) return { prevYear: undefined, prevMonth: undefined };
    const prevMonth = m === 1 ? 12 : m - 1;
    const prevYear = m === 1 ? y - 1 : y;
    return { prevYear, prevMonth };
  }

  // Intenta prellenar entidades y población usando el mes anterior de la misma oficina
  async function prefillFromPrevious(rowId, overrides = {}) {
    try {
      const row = (rows || []).find(r => String(r.id) === String(rowId));
      if (!row) return;
      const codigo = overrides.codigo ?? row.codigo;
      const year = overrides.anio ?? row.anio;
      const month = overrides.mes ?? row.mes;
      if (!codigo || !year || !month) return;

      // Solo prellenar si están en 0/undefined para no sobrescribir ediciones
      const needEnt = !row.entidades || Number(row.entidades) === 0;
      const needPob = !row.poblacion || Number(row.poblacion) === 0;
      const needAsoc = !row.asociados || Number(row.asociados) === 0;
      if (!needEnt && !needPob && !needAsoc) return;

      const { prevYear, prevMonth } = getPrevPeriod(year, month);
      if (!prevYear || !prevMonth) return;

      const prev = await getCategoryQuota(codigo, { year: prevYear, month: prevMonth });
      if (!prev) return;

      if (needEnt && typeof prev.entidades !== "undefined") {
        handleChange(rowId, "entidades", prev.entidades);
      }
      if (needPob && typeof prev.poblacion !== "undefined") {
        handleChange(rowId, "poblacion", prev.poblacion);
      }
      if (needAsoc && typeof prev.asociados !== "undefined") {
        handleChange(rowId, "asociados", prev.asociados);
      }
      setStatusMsg(`Valores prellenados desde ${prevYear}-${String(prevMonth).padStart(2, "0")} para la oficina ${codigo}`);
      setStatusType("success");
    } catch (err) {
      console.warn("Error prellenando mes anterior:", err);
      setStatusMsg(getErrorMessage(err) || "No fue posible prellenar desde el mes anterior");
      setStatusType("error");
    }
  }

  // Live search (reactive as you type)
  useEffect(() => {
    const query = search.trim().toLowerCase();
    let filtered = rows;

    // Filtro por búsqueda de texto
    if (query) {
      filtered = filtered.filter(r => (r?.isNew) ||
        r.codigo?.toLowerCase().includes(query) ||
        r.nombre?.toLowerCase().includes(query)
      );
    }

    // Filtro por año
    if (filterYear) {
      filtered = filtered.filter(r => (r?.isNew) || r.anio === Number(filterYear));
    }

    // Filtro por mes
    if (filterMonth) {
      filtered = filtered.filter(r => (r?.isNew) || r.mes === Number(filterMonth));
    }

    // Ordenar por: nuevas primero, luego por código numérico. Copiar para no mutar rows.
    filtered = [...filtered].sort((a, b) => {
      const aNew = !!a.isNew;
      const bNew = !!b.isNew;
      if (aNew && !bNew) return -1;
      if (!aNew && bNew) return 1;
      return Number(a.codigo) - Number(b.codigo);
    });

    setFilteredRows(filtered);
  }, [search, rows, filterYear, filterMonth]);

  const handleChange = (id, field, value) => {
    console.log("handleChange - id:", id, "field:", field, "value:", value); // Debug
    setRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
    setFilteredRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));

    // Si se está agregando una fila y cambia año/mes/oficina, intentar prellenar desde mes anterior
    try {
      const rowBefore = (rows || []).find(r => String(r.id) === String(id));
      if (rowBefore?.isNew && ["anio", "mes", "codigo", "nombre"].includes(field)) {
        const codigo = field === "codigo" ? value : rowBefore?.codigo;
        const anio = field === "anio" ? value : rowBefore?.anio;
        const mes = field === "mes" ? value : rowBefore?.mes;
        if (codigo && anio && mes) {
          prefillFromPrevious(id, { codigo, anio, mes });
        }
      }
    } catch (e) {
      console.warn("No se pudo prellenar automáticamente:", e);
    }
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearch("");
    setFilterYear("");
    setFilterMonth("");
  };

  // Obtener años disponibles (desde el año más antiguo en los datos hasta el año actual)
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = new Set();
    
    // Agregar años de los datos
    rows.forEach(r => {
      if (r.anio) {
        years.add(r.anio);
      }
    });
    
    // Agregar años desde el más antiguo hasta el actual
    if (years.size > 0) {
      const minYear = Math.min(...Array.from(years));
      for (let year = minYear; year <= currentYear; year++) {
        years.add(year);
      }
    } else {
      // Si no hay datos, mostrar últimos 5 años
      for (let year = currentYear - 4; year <= currentYear; year++) {
        years.add(year);
      }
    }
    
    return Array.from(years).sort((a, b) => b - a); // Orden descendente
  };

  // Obtener todos los meses (1-12)
  const getAllMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedRows).map(async ([id, changes]) => {
        // id es string; no lo conviertas a número
        const fullRow = rows.find(r => String(r.id) === String(id));
        if (!fullRow) return; // nada que guardar

        const payload = {
          codigo: fullRow.codigo,
          anio: Number(fullRow.anio),
          mes: Number(fullRow.mes),
          nombre: (changes.nombre ?? fullRow.nombre) || undefined,
          // Enviar fecha de apertura si está disponible (backend normaliza formato)
          fecha: (changes.fecha ?? fullRow.fecha) || undefined,
          asociados: Number(changes.asociados ?? fullRow.asociados),
          entidades: Number(changes.entidades ?? fullRow.entidades),
          poblacion: Number(changes.poblacion ?? fullRow.poblacion),
        };

        await saveCategoryQuota(payload);
      });

      await Promise.all(updates);
      alert("Cambios guardados correctamente");
      setEditedRows({});
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, codigo, nombre, anio, mes) => {
    // Primera confirmación
    const firstConfirm = window.confirm(
      `¿Está seguro que desea eliminar la categoría de oficina "${codigo} - ${nombre}" del período ${anio}-${mes}?`
    );
    
    if (!firstConfirm) return;
    
    // Segunda confirmación
    const secondConfirm = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Confirma que desea ELIMINAR permanentemente esta categoría de oficina?`
    );
    
    if (!secondConfirm) return;
    
    try {
      await deleteCategoryQuota(codigo, anio, mes);
      setStatusMsg("Categoría de oficina eliminada correctamente");
      setStatusType("success");
      // Recargar datos
      await loadData();
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message || "Error eliminando categoría de oficina");
      setStatusType("error");
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`, // id único temporal
      codigo: "",
      nombre: "",
      anio: filterYear || new Date().getFullYear(),
      mes: filterMonth || new Date().getMonth() + 1,
      asociados: 0,
      fecha: "",
      entidades: 0,
      poblacion: 0,
      ctaPuc14: "0", // Campo calculado, no editable
      ctaPuc21: "0", // Campo calculado, no editable
      isNew: true, // Marcar como nueva fila
    };
    // Agregar al inicio para que la nueva fila quede arriba
    setRows(prev => [newRow, ...(prev || [])]);
    setFilteredRows(prev => [newRow, ...(prev || [])]);
    setEditingRows(prev => ({ ...(prev || {}), [newRow.id]: true })); // Entrar en modo edición automáticamente
  };

  const handleOficinaChange = (rowId, oficinaNombre) => {
    console.log("handleOficinaChange - rowId:", rowId, "oficinaNombre:", oficinaNombre); // Debug
    const oficina = oficinasDisponibles.find(o => o.nombre === oficinaNombre);
    console.log("oficina encontrada:", oficina); // Debug
    if (oficina) {
      console.log("Actualizando codigo a:", oficina.codigo, "nombre a:", oficina.nombre); // Debug
      handleChange(rowId, "codigo", oficina.codigo);
      handleChange(rowId, "nombre", oficina.nombre);
      // Traer fecha de apertura (constante por oficina) al crear fila nueva
      const rowNow0 = (rows || []).find(r => String(r.id) === String(rowId));
      if (rowNow0?.isNew) {
        (async () => {
          try {
            const ultimaCategoria = await getCategoryQuota(oficina.codigo);
            if (ultimaCategoria?.fecha) {
              handleChange(rowId, "fecha", ultimaCategoria.fecha);
            }
          } catch (e) {
            console.warn("No se pudo obtener la fecha de apertura de la oficina:", e);
          }
        })();
      }
      // Intentar prellenar con el mes anterior si ya hay año/mes en la fila
      const rowNow = (rows || []).find(r => String(r.id) === String(rowId));
      const y = rowNow?.anio;
      const m = rowNow?.mes;
      if (y && m) {
        prefillFromPrevious(rowId, { codigo: oficina.codigo, anio: y, mes: m });
      }
    }
  };

  if (loading) {
    return <div className="p-12 text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categoria de Oficinas");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Categoria_Oficinas.xlsx");
  };


  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Categorias Oficinas
      </h1>

      {statusMsg && (
        <div className={`mb-4 p-3 rounded ${
          statusType === "success" ? "bg-green-100 text-green-800" :
          statusType === "error" ? "bg-red-100 text-red-800" :
          "bg-blue-100 text-blue-800"
        }`}>
          {statusMsg}
        </div>
      )}

      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por codigo u oficina"
            className="unified-input w-[300px]"
          />
          
          {/* Filtro por Año */}
          <select
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            className="unified-input w-[120px]"
          >
            <option value="">Todos los años</option>
            {getAvailableYears().map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Filtro por Mes */}
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="unified-input w-[140px]"
          >
            <option value="">Todos los meses</option>
            {getAllMonths().map(month => (
              <option key={month} value={month}>
                {monthNames[month - 1]}
              </option>
            ))}
          </select>

          {/* Botón para limpiar filtros */}
          {(search || filterYear || filterMonth) && (
            <button
              onClick={clearFilters}
              className="unified-button bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded"
              title="Limpiar filtros"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAddRow}
            className="unified-button flex gap-2 items-center justify-center bg-green-600 hover:bg-green-700"
          >
            Agregar Fila
            <FaArrowDownWideShort />
          </button>
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
            <FaFileDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-cupos-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">Acciones</th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Codigo Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Nombre Oficina
              </th>

              <th className="p-4 border text-center whitespace-nowrap ">
                Cartera de Crédito <br /> PUC 14
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Depósitos <br /> PUC 21
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[140px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Asociados
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Fecha de Apertura
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Entidades Financieras
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[220px]">
                Población
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map((row, idx) => { 
              const isEditing = row.isNew || !!editingRows[row.id];
              const isRecentlyCreated = row.isNew; // Solo para filas realmente nuevas
              return (
                <tr key={row.id} className={isRecentlyCreated ? "bg-green-50" : ""}>
                {/* Acciones primero */}
                <td className="p-2 border text-center">
                  <div className="flex gap-2 justify-center">
                    {isEditing ? (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              if (row.isNew) {
                                // Para filas nuevas, validar campos requeridos
                                if (!row.codigo || !row.nombre || !row.anio || !row.mes) {
                                  setStatusMsg("Por favor complete todos los campos requeridos (Código, Nombre, Año, Mes)");
                                  setStatusType("error");
                                  return;
                                }

                                // Prefill automático desde mes anterior si entidades/población están vacíos o en 0
                                const { prevYear, prevMonth } = getPrevPeriod(row.anio, row.mes);
                                let prev = null;
                                try {
                                  if (prevYear && prevMonth) {
                                    prev = await getCategoryQuota(row.codigo, { year: prevYear, month: prevMonth });
                                  }
                                } catch (e) {
                                  console.warn("No se pudo consultar el mes anterior:", e);
                                }

                                const needEnt = !row.entidades || Number(row.entidades) === 0;
                                const needPob = !row.poblacion || Number(row.poblacion) === 0;

                                const payload = {
                                  codigo: row.codigo,
                                  anio: Number(row.anio),
                                  mes: Number(row.mes),
                                  nombre: row.nombre,
                                  asociados: Number(row.asociados || 0),
                                  fecha: row.fecha || undefined, // backend normaliza
                                  entidades: Number(
                                    needEnt ? (prev?.entidades ?? row.entidades ?? 0) : row.entidades
                                  ),
                                  poblacion: Number(
                                    needPob ? (prev?.poblacion ?? row.poblacion ?? 0) : row.poblacion
                                  ),
                                };

                                await saveCategoryQuota(payload);
                                setStatusMsg("Categoría de oficina guardada correctamente");
                                setStatusType("success");
                                // Recargar datos
                                await loadData();
                              } else {
                                // Para filas existentes, guardar cambios
                                await saveCategoryQuota(row);
                                setStatusMsg("Cambios guardados correctamente");
                                setStatusType("success");
                                // Recargar datos
                                await loadData();
                              }
                              setEditingRows(prev => ({...prev, [row.id]: false}));
                            } catch (err) {
                              console.error(err);
                              setStatusMsg(err.message || "Error guardando cambios");
                              setStatusType("error");
                            }
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
                          title="Guardar"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => {
                            if (row.isNew) {
                              // Si es nueva y se cancela, eliminar la fila
                              setRows(prev => prev.filter(r => r.id !== row.id));
                              setFilteredRows(prev => prev.filter(r => r.id !== row.id));
                            }
                            setEditingRows(prev => ({...prev, [row.id]: false}));
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
                          onClick={async () => {
                            setEditingRows(prev => ({...prev, [row.id]: true}));
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        {/** Botón de "Mes anterior" eliminado: ahora el prellenado es automático en filas nuevas */}
                        {!row.isNew && (
                          <button
                            onClick={() => handleDelete(row.id, row.codigo, row.nombre, row.anio, row.mes)}
                            className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                            title="Eliminar categoría de oficina"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>

                {/* Código */}
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.codigo}
                      readOnly
                      className="px-3 py-2 w-full border bg-gray-50 text-gray-600 rounded text-sm"
                      placeholder="Se llena automáticamente al seleccionar oficina"
                    />
                  ) : (
                    row.codigo
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      value={row.nombre}
                      onChange={e => handleOficinaChange(row.id, e.target.value)}
                      className="px-3 py-2 w-full border rounded text-sm min-w-[200px]"
                    >
                      <option value="">Seleccionar oficina</option>
                      {oficinasDisponibles.map(oficina => (
                        <option key={oficina.codigo} value={oficina.nombre}>
                          {fixEncoding(oficina.nombre)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    fixEncoding(row.nombre)
                  )}
                </td>
                <td className="num text-right">{formatMoney(row.ctaPuc14)}</td>
                <td className="num text-right">{formatMoney(row.ctaPuc21)}</td>
                <td>
                  {isEditing && row.isNew ? (
                    <input
                      type="number"
                      value={row.anio}
                      onChange={e =>
                        handleChange(row.id, "anio", e.target.value)
                      }
                      className="px-3 py-2 w-full text-center border rounded min-w-[120px]"
                      placeholder="2025"
                      min="2000"
                      max="2100"
                    />
                  ) : (
                    <span className="inline-block min-w-[120px] text-center">{row.anio}</span>
                  )}
                </td>
                <td>
                  {isEditing && row.isNew ? (
                    <select
                      value={row.mes}
                      onChange={e =>
                        handleChange(row.id, "mes", e.target.value)
                      }
                      className="px-3 py-2 w-full border rounded min-w-[140px]"
                    >
                      <option value="">Seleccionar mes</option>
                      <option value="1">Enero</option>
                      <option value="2">Febrero</option>
                      <option value="3">Marzo</option>
                      <option value="4">Abril</option>
                      <option value="5">Mayo</option>
                      <option value="6">Junio</option>
                      <option value="7">Julio</option>
                      <option value="8">Agosto</option>
                      <option value="9">Septiembre</option>
                      <option value="10">Octubre</option>
                      <option value="11">Noviembre</option>
                      <option value="12">Diciembre</option>
                    </select>
                  ) : (
                    <span className="inline-block min-w-[140px] text-center">{row.mes}</span>
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={row.asociados}
                      onChange={e =>
                        handleChange(row.id, "asociados", e.target.value)
                      }
                      className="px-2 py-1 w-full text-right border"
                      placeholder="0"
                      min="0"
                    />
                  ) : (
                    row.asociados
                  )}
                </td>
                <td>
                  {/* Fecha de apertura: no editable, constante por oficina */}
                  {row.fecha || ""}
                </td>
                <td className="num text-right">
                  {isEditing ? (
                    <input
                      type="number"
                      value={row.entidades}
                      onChange={e =>
                        handleChange(row.id, "entidades", e.target.value)
                      }
                      className="px-2 py-1 w-full text-right border"
                      placeholder="0"
                      min="0"
                    />
                  ) : (
                    Intl.NumberFormat("es-CO").format(row.entidades || 0)
                  )}
                </td>
                <td className="num text-right">
                  {isEditing ? (
                    <input
                      type="number"
                      value={row.poblacion}
                      onChange={e =>
                        handleChange(row.id, "poblacion", e.target.value)
                      }
                      className="px-2 py-1 w-full text-right border"
                      placeholder="0"
                      min="0"
                    />
                  ) : (
                    Intl.NumberFormat("es-CO").format(row.poblacion || 0)
                  )}
                </td>
                {/* Acciones movidas al inicio: celda original eliminada */}
                </tr>
              );
            })}

            {/*records.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.amount}</td>
              <td>{r.description}</td>
            </tr>
          ))*/}
          </tbody>
        </table>
      </div>
    </main>
  );
}
