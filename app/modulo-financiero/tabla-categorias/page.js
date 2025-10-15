"use client";
import { useEffect, useState } from "react";
import {
  listCategoriesQuota,
  saveCategoryQuota,
  deleteCategoryQuota,
  getOficinasDisponibles,
} from "../../services/modulo-financiero/categoriesQuota";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegSave, FaFileDownload, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaArrowDownWideShort } from "react-icons/fa6";

export default function CategoriasTable() {
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
  const [oficinasDisponibles, setOficinasDisponibles] = useState([]);

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

  async function loadOficinasDisponibles() {
    try {
      const oficinas = await getOficinasDisponibles();
      console.log("Oficinas cargadas:", oficinas); // Debug
      setOficinasDisponibles(oficinas);
    } catch (err) {
      console.error("Error cargando oficinas disponibles:", err);
      setStatusMsg("Error cargando oficinas disponibles: " + err.message);
      setStatusType("error");
    }
  }

  // Live search (reactive as you type)
  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows
      .filter(r => {
        const matchesSearch =
          !query ||
          r.indicador.toLowerCase().includes(query) ||
          r.alcance.toLowerCase().includes(query);

        const matchesYear = !selectedYear || r.anio === Number(selectedYear);
        const matchesMonth = !selectedMonth || r.mes === Number(selectedMonth);

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => Number(a.codigo) - Number(b.codigo));

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

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
            codigo: merged.codigo,
            anio: Number(merged.anio),
            mes: Number(merged.mes),
            nombre: merged.nombre || undefined,
            asociados: Number(merged.asociados),
            entidades: Number(merged.entidades),
            poblacion: Number(merged.poblacion),
          };
          await saveCategoryQuota(payload);
          ok++;
        } catch (e) {
          console.error(e);
          fail++;
        }
      }
      setEditedRows({});
      await loadData();
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

  const handleAddRow = () => {
    const currentDate = new Date();
    const newRow = {
      id: `new-${Date.now()}`, // id único temporal
      codigo: "",
      nombre: "",
      fecha: "", // Fecha de apertura (histórica)
      ctaPuc14: 0,
      ctaPuc21: 0,
      asociados: 0,
      entidades: 0,
      poblacion: 0,
      anio: currentDate.getFullYear(), // Año de consulta
      mes: currentDate.getMonth() + 1, // Mes de consulta
      isNew: true,
      created_at: new Date().toISOString() // Timestamp para indicador visual
    };

    setRows(prev => [newRow, ...prev]); // agregamos al inicio
    setFilteredRows(prev => [newRow, ...prev]);
    setEditingRows(prev => ({ ...prev, [newRow.id]: true })); // Entrar en modo edición automáticamente
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

  const availableMonths = monthNames
    .map((name, index) => ({ name, number: index + 1 }))
    .filter(m => uniqueMonths.includes(m.number));

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Categorias Oficinas
      </h1>
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
            placeholder="Buscar por codigo u oficina"
            className="border w-[300px] px-2 py-1"
          />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="border px-2 py-1"
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
              className="action-button flex gap-2 items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
              <FaRegSave />
            </button>
          )}
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleDownload}
          >
            Descargar
            <FaFileDownload />
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
                Cta PUC 14
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Cta PUC 21
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Asociados
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Año Consulta
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Mes Consulta
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
              const isEditing = row.isNew || !!editingRows[idx];
              const isRecentlyCreated = row.isNew; // Solo para filas realmente nuevas
              return (
              <tr key={row.id} className={isRecentlyCreated ? "bg-green-50" : ""}>
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
                                if (row.isNew) {
                                  // Para filas nuevas, validar campos requeridos
                                  if (!row.codigo || !row.nombre || !row.anio || !row.mes) {
                                    setStatusMsg("Por favor complete todos los campos requeridos (Oficina, Año, Mes)");
                                    setStatusType("error");
                                    return;
                                  }
                                  await saveCategoryQuota(row);
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
                                setEditingRows(prev => ({...prev, [idx]: false}));
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
                              setEditingRows(prev => ({...prev, [idx]: false}));
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
                            onClick={() => setEditingRows(prev => ({...prev, [idx]: true}))}
                            className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
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
                  </div>
                </td>
                <td>
                  {isEditing && row.isNew ? (
                    <select
                      value={row.codigo}
                      onChange={async (e) => {
                        const selectedOficina = oficinasDisponibles.find(o => o.codigo === e.target.value);
                        handleChange(row.id, "codigo", e.target.value);
                        if (selectedOficina) {
                          handleChange(row.id, "nombre", selectedOficina.nombre);
                          // Cargar datos existentes de la oficina si los hay
                          try {
                            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8060";
                            const response = await fetch(`${API_BASE_URL}/api/v1/finanzas/oficinas/${selectedOficina.codigo}/?year=${row.anio}&month=${row.mes}`, {
                              headers: {
                                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                                'Content-Type': 'application/json',
                              },
                            });
                            if (response.ok) {
                              const data = await response.json();
                              if (data && data.length > 0) {
                                const oficinaData = data[0];
                                handleChange(row.id, "asociados", oficinaData.asociados || 0);
                                handleChange(row.id, "entidades", oficinaData.entidades || 0);
                                handleChange(row.id, "poblacion", oficinaData.poblacion || 0);
                                handleChange(row.id, "fecha", oficinaData.fecha || "");
                              }
                            }
                          } catch (err) {
                            console.log("No hay datos previos para esta oficina");
                          }
                        }
                      }}
                      className="px-2 py-1 w-full border"
                    >
                      <option value="">Seleccionar oficina</option>
                      {oficinasDisponibles.map(oficina => (
                        <option key={oficina.codigo} value={oficina.codigo}>
                          {oficina.codigo} - {oficina.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.codigo
                  )}
                </td>
                <td>
                  {isEditing && row.isNew ? (
                    <input
                      type="text"
                      value={row.nombre}
                      onChange={e => handleChange(row.id, "nombre", e.target.value)}
                      className="px-2 py-1 w-full border"
                      placeholder="Nombre de la oficina"
                    />
                  ) : (
                    row.nombre
                  )}
                </td>
                <td>${row.ctaPuc14}</td>
                <td>${row.ctaPuc21}</td>
                <td>
                  {isEditing && row.isNew ? (
                    <input
                      type="number"
                      value={row.asociados}
                      onChange={e => handleChange(row.id, "asociados", e.target.value)}
                      className="px-2 py-1 w-full text-right border"
                      placeholder="0"
                    />
                  ) : (
                    row.asociados
                  )}
                </td>
                <td>
                  {isEditing && row.isNew ? (
                    <select
                      value={row.anio}
                      onChange={e => handleChange(row.id, "anio", parseInt(e.target.value))}
                      className="px-2 py-1 border text-sm w-full"
                    >
                      <option value="">Año</option>
                      {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  ) : (
                    row.anio
                  )}
                </td>
                <td>
                  {isEditing && row.isNew ? (
                    <select
                      value={row.mes}
                      onChange={e => handleChange(row.id, "mes", parseInt(e.target.value))}
                      className="px-2 py-1 border text-sm w-full"
                    >
                      <option value="">Mes</option>
                      {monthNames.map((name, index) => (
                        <option key={index + 1} value={index + 1}>{name}</option>
                      ))}
                    </select>
                  ) : (
                    monthNames[row.mes - 1] || row.mes
                  )}
                </td>
                <td>
                  {isEditing && row.isNew ? (
                    <input
                      type="date"
                      value={row.fecha}
                      onChange={e => handleChange(row.id, "fecha", e.target.value)}
                      className="px-2 py-1 w-full border"
                      placeholder="Fecha de apertura"
                    />
                  ) : (
                    row.fecha
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    value={row.entidades}
                    onChange={e =>
                      handleChange(row.id, "entidades", e.target.value)
                    }
                    className="px-2 py-1 w-full text-right border"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.poblacion}
                    onChange={e =>
                      handleChange(row.id, "poblacion", e.target.value)
                    }
                    className="px-2 py-1 w-full text-right border"
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
