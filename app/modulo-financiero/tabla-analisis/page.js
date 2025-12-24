/**
 *********************************************
 *   Pantalla: Análisis Explicativo            *
 *********************************************
 * CRUD de textos explicativos por panel/mes.
 */
"use client";
import { useEffect, useRef, useState } from "react";
import {
  listAnalisisExplicativo,
  saveAnalisisExplicativo,
  updateAnalisisExplicativo,
  deleteAnalisisExplicativo,
} from "../../services/modulo-financiero/analisisExplicativo";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegSave, FaFileDownload, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const initialRows = [];

export default function CategoriasTable() {
  /***************************************
   *       Bloque de lógica principal     *
   ***************************************/
  const [rows, setRows] = useState(initialRows);
  const [filteredRows, setFilteredRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [editingRows, setEditingRows] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("");
  const tableContainerRef = useRef(null);

  async function loadData() {
    setLoading(true);
    try {
      const data = await listAnalisisExplicativo({ limit: 900 });

      // Sort by id numerically
      const sorted = [...data].sort(
        (a, b) => Number(a.id) - Number(b.id)
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
  }, []);

  const handleChange = (id, field, value) => {
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
  };

  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      anio: new Date().getFullYear(),
      mes: "Enero",
      categoria: "",
      subcategoria: "",
      descripcion: "",
      isNew: true,
    };
    // Agregar al inicio para que quede visible arriba
    setRows(prev => [newRow, ...(prev || [])]);
    setFilteredRows(prev => [newRow, ...(prev || [])]);
    setEditingRows(prev => ({ ...(prev || {}), [newRow.id]: true }));
    // Llevar el scroll del contenedor al inicio para que se vea la nueva fila
    requestAnimationFrame(() => {
      if (tableContainerRef.current) {
        try { tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' }); } catch { tableContainerRef.current.scrollTop = 0; }
      }
    });
  };

  const handleDelete = async (id, categoria, subcategoria) => {
    if (window.confirm(`¿Está seguro de eliminar el análisis de ${categoria} - ${subcategoria}?`)) {
      try {
        await deleteAnalisisExplicativo(id);
        setStatusMsg("Análisis eliminado correctamente");
        setStatusType("success");
        await loadData();
      } catch (err) {
        setStatusMsg(err.message || "Error eliminando análisis");
        setStatusType("error");
      }
    }
  };

  // Live search (reactive as you type)
  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows
      .filter(r => {
        if (r && r.isNew) return true;
        const matchesSearch =
          !query ||
          r.categoria.toLowerCase().includes(query) ||
          r.subcategoria.toLowerCase().includes(query) ||
          r.descripcion.toLowerCase().includes(query);

        // Only apply year/month filters if they are set in the filter dropdowns
        // Don't filter based on individual row values
        const matchesYear = !selectedYear || r.anio === Number(selectedYear);
        const matchesMonth = !selectedMonth || r.mes === selectedMonth;

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => {
        // Siempre priorizar filas nuevas arriba
        const aNew = Boolean(a && a.isNew);
        const bNew = Boolean(b && b.isNew);
        if (aNew !== bNew) return aNew ? -1 : 1;
        // Luego ordenar por año descendente y mes descendente (más reciente primero)
        if (a.anio !== b.anio) return b.anio - a.anio;
        const monthOrder = [
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
        return monthOrder.indexOf(b.mes) - monthOrder.indexOf(a.mes);
      });

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  /*
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
          // No enviar fecha si no se edita explícitamente en formato ISO (YYYY-MM-DD)
          // fecha: (changes.fecha ?? fullRow.fecha) || undefined,
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

  if (loading) {
    return <div className="p-12 text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }
    */

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Análisis Explicativo");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Analisis_Explicativo.xlsx");
  };

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

  const availableMonths = monthNames.filter(name =>
    uniqueMonths.includes(name)
  );

  // Dropdown options
  const yearOptions = Array.from({ length: 11 }, (_, i) => 2025 + i); // 2025-2035
  const panelOptions = [
    "Activos",
    "Pasivos",
    "Patrimonio",
    "Ingresos",
    "Gastos",
    "Costos",
  ];
  const titleOptions = [
    "Comportamiento de los Activos",
    "Comportamiento de la Cartera de Crédito",
    "Obligaciones Financieras",
    "Comportamento del Pasivo",
    "Comportamiento de Excedentes",
    "Análisis de Ingresos",
    "Análisis de Gastos",
    "Análisis de Costos",
  ];


  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Análisis Explicativo
      </h1>

      {/* Status Message */}
      {statusMsg && (
        <div className={`mb-4 p-3 rounded ${
          statusType === "success" 
            ? "bg-green-100 text-green-700 border border-green-300" 
            : "bg-red-100 text-red-700 border border-red-300"
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
            placeholder="Buscar por categoría, subcategoría o descripción"
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
            className="border-2 border-red-700 text-red-700 px-2 py-1 "
          >
            <option value="">Todos los meses</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAddRow}
            className="unified-button flex gap-2 items-center justify-center"
          >
            Agregar Fila
            <FaRegSave />
          </button>
          <button
            className="unified-button flex gap-2 items-center justify-center"
            onClick={handleDownload}
          >
            Descargar
            <FaFileDownload />
          </button>
        </div>
      </div>

      <div ref={tableContainerRef} className="overflow-x-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-cupos-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap ">Acciones</th>
              <th className="p-4 border text-center whitespace-nowrap ">AÑO</th>
              <th className="p-4 border text-center whitespace-nowrap ">MES</th>
              <th className="p-4 border text-center whitespace-nowrap ">PANEL</th>
              <th className="p-4 border text-center whitespace-nowrap ">TITULO</th>
              <th className="p-4 border text-center whitespace-nowrap ">TEXTO: ANÁLISIS EXPLICATIVO</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(row => (
              <tr key={row.id}>
                {/* Acciones primero */}
                <td className="p-2 border text-center">
                  {editingRows[row.id] || row.isNew ? (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={async () => {
                        try {
                          if (row.isNew) {
                            if (!row.anio || !row.mes || !row.categoria || !row.subcategoria) {
                              setStatusMsg("Por favor complete Año, Mes, Panel y Título");
                              setStatusType("error");
                              return;
                            }
                            await saveAnalisisExplicativo(row);
                            const data = await listAnalisisExplicativo({ limit: 200 });
                            setRows(data); setFilteredRows(data);
                            setStatusMsg("Análisis guardado correctamente");
                            setStatusType("success");
                          } else {
                            await updateAnalisisExplicativo(row.id, row);
                            const data = await listAnalisisExplicativo({ limit: 200 });
                            setRows(data); setFilteredRows(data);
                            setStatusMsg("Cambios guardados correctamente");
                            setStatusType("success");
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
                      onClick={() => setEditingRows(prev => ({...prev, [row.id]: false}))}
                      className="px-3 py-1 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600"
                      title="Cancelar"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  ) : (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setEditingRows(prev => ({...prev, [row.id]: true}))}
                      className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id, row.categoria, row.subcategoria)}
                      className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                      title="Eliminar análisis"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  )}
                </td>
                <td className="p-4 border text-center">
                  {editingRows[row.id] || row.isNew ? (
                  <select
                    value={row.anio || ""}
                    onChange={e =>
                      handleChange(row.id, "anio", parseInt(e.target.value))
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar año</option>
                    {yearOptions.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  ) : (
                    row.anio
                  )}
                </td>
                <td className="p-4 border text-center">
                  {editingRows[row.id] || row.isNew ? (
                  <select
                    value={row.mes || ""}
                    onChange={e => handleChange(row.id, "mes", e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar mes</option>
                    {monthNames.map(month => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  ) : (
                    row.mes
                  )}
                </td>
                <td className="p-4 border text-center">
                  {editingRows[row.id] || row.isNew ? (
                  <select
                    value={row.categoria || ""}
                    onChange={e =>
                      handleChange(row.id, "categoria", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar panel</option>
                    {panelOptions.map(panel => (
                      <option key={panel} value={panel}>
                        {panel}
                      </option>
                    ))}
                  </select>
                  ) : (
                    row.categoria
                  )}
                </td>
                <td className="p-4 border text-center">
                  {editingRows[row.id] || row.isNew ? (
                  <select
                    value={row.subcategoria || ""}
                    onChange={e =>
                      handleChange(row.id, "subcategoria", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar título</option>
                    {titleOptions.map(title => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  ) : (
                    row.subcategoria
                  )}
                </td>
                <td className="p-4 border text-left max-w-md">
                  {editingRows[row.id] || row.isNew ? (
                  <textarea
                    value={row.descripcion || ""}
                    onChange={e =>
                      handleChange(row.id, "descripcion", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded min-h-[100px]"
                    rows={4}
                  />
                  ) : (
                    <div className="whitespace-pre-wrap">{row.descripcion}</div>
                  )}
                </td>
                {/* Acciones moved to first column; trailing cell removed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
