"use client";
import { useEffect, useState } from "react";
import {
  listCreditQuota,
  saveCreditQuota,
  deleteCreditQuota,
} from "../../services/modulo-financiero/creditQuota";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegSave, FaFileDownload, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaArrowDownWideShort } from "react-icons/fa6";

export default function CuposTable() {
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
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await listCreditQuota({ limit: 200 });
        setRows(data);
        setFilteredRows(data);
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
    let filtered = rows;

    // Filtro por búsqueda de texto
    if (query) {
      filtered = filtered.filter(
        r =>
          r.cuenta?.toLowerCase().includes(query) ||
          r.entidadFinanciera?.toLowerCase().includes(query)
      );
    }

    // Filtro por año
    if (filterYear) {
      filtered = filtered.filter(r => {
        if (!r.fechaRenovadoRaw) return false;
        const date = new Date(r.fechaRenovadoRaw);
        return date.getFullYear().toString() === filterYear;
      });
    }

    // Filtro por mes
    if (filterMonth) {
      filtered = filtered.filter(r => {
        if (!r.fechaRenovadoRaw) return false;
        const date = new Date(r.fechaRenovadoRaw);
        return (date.getMonth() + 1).toString() === filterMonth;
      });
    }

    setFilteredRows(filtered);
  }, [search, rows, filterYear, filterMonth]);

  const handleChange = (id, field, value) => {
    const updateRow = row => (row.id === id ? { ...row, [field]: value } : row);

    setRows(prev => prev.map(updateRow));
    setFilteredRows(prev => prev.map(updateRow));

    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
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
      if (r.fechaRenovadoRaw) {
        const year = new Date(r.fechaRenovadoRaw).getFullYear();
        years.add(year);
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
        const fullRow = rows.find(r => r.id === Number(id));
        if (!fullRow) return;

        const payload = {
          id: Number(id),
          entidad_financiera: changes.entidadFinanciera || fullRow.entidadFinanciera,
          cuenta: changes.cuenta || fullRow.cuenta,
          fecha_renovado: changes.fechaRenovado || fullRow.fechaRenovado,
          cupo_asignado: changes.cupoAsignado || fullRow.cupoAsignado,
          cupo_ejecutado: changes.cupoEjecutado || fullRow.cupoEjecutado,
          garantia: changes.garantia || fullRow.garantia,
          plazo: changes.plazo || fullRow.plazo,
          tasa: changes.tasa || fullRow.tasa,
        };

        await saveCreditQuota(payload);
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

  const handleDelete = async (id, entidadFinanciera, cuenta) => {
    // Primera confirmación
    const firstConfirm = window.confirm(
      `¿Está seguro que desea eliminar el cupo de crédito de "${entidadFinanciera} - ${cuenta}"?`
    );
    
    if (!firstConfirm) return;
    
    // Segunda confirmación
    const secondConfirm = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Confirma que desea ELIMINAR permanentemente este cupo de crédito?`
    );
    
    if (!secondConfirm) return;
    
    try {
      await deleteCreditQuota(id);
      setStatusMsg("Cupo de crédito eliminado correctamente");
      setStatusType("success");
      // Recargar datos
      const data = await listCreditQuota({ limit: 200 });
      setRows(data);
      setFilteredRows(data);
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message || "Error eliminando cupo de crédito");
      setStatusType("error");
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`, // id único temporal
      entidadFinanciera: "",
      cuenta: "",
      cupoAsignado: 0,
      cupoEjecutado: 0,
      disponible: 0,
      garantia: "",
      porcentajeUtilizacion: 0,
      plazo: "",
      tasa: "",
      fechaRenovado: "",
      isNew: true, // Marcar como nueva fila
    };
    setRows(prev => [...prev, newRow]);
    setFilteredRows(prev => [...prev, newRow]);
    setEditingRows(prev => ({...prev, [newRow.id]: true})); // Entrar en modo edición automáticamente
  };

  if (loading) {
    return <div className="p-12 text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }

  const handleDownload = () => {
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cupos Credito");

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Cupos_Credito.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Cupo Créditos
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
              disabled={saving}
              className="unified-button flex gap-2 items-center justify-center disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
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
          <thead className="tabla-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">Acciones</th>
              <th className="p-4 border text-center whitespace-nowrap">
                Fecha Renovado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cuenta
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Entidad Financiera
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Cupo Asignado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cupo Ejecutado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Disponible
              </th>
              <th className="p-4 border text-center  min-w-[250px]">
                Garantía
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Utilización
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Plazo/Meses
              </th>
              <th className="p-4 border text-center whitespace-nowrap">Tasa</th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map((r, idx) => { 
              const isEditing = r.isNew || !!editingRows[r.id];
              const isRecentlyCreated = r.isNew; // Solo para filas realmente nuevas
              return (
                <tr key={r.id || idx} className={isRecentlyCreated ? "bg-green-50" : ""}>
                {/* Acciones primero */}
                <td className="p-2 border text-center">
                  <div className="flex gap-2 justify-center">
                    {isEditing ? (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              if (r.isNew) {
                                // Para filas nuevas, validar campos requeridos
                                if (!r.entidadFinanciera || !r.cuenta || !r.cupoAsignado) {
                                  setStatusMsg("Por favor complete todos los campos requeridos (Entidad Financiera, Cuenta, Cupo Asignado)");
                                  setStatusType("error");
                                  return;
                                }
                                const payload = {
                                  entidad_financiera: r.entidadFinanciera,
                                  cuenta: r.cuenta,
                                  fecha_renovado: r.fechaRenovado,
                                  cupo_asignado: r.cupoAsignado,
                                  cupo_ejecutado: r.cupoEjecutado,
                                  garantia: r.garantia,
                                  plazo: r.plazo,
                                  tasa: r.tasa,
                                };
                                await saveCreditQuota(payload);
                                setStatusMsg("Cupo de crédito guardado correctamente");
                                setStatusType("success");
                                // Recargar datos
                                const data = await listCreditQuota({ limit: 200 });
                                setRows(data);
                                setFilteredRows(data);
                              } else {
                                // Para filas existentes, guardar cambios
                                const payload = {
                                  id: r.id,
                                  entidad_financiera: r.entidadFinanciera,
                                  cuenta: r.cuenta,
                                  fecha_renovado: r.fechaRenovado,
                                  cupo_asignado: r.cupoAsignado,
                                  cupo_ejecutado: r.cupoEjecutado,
                                  garantia: r.garantia,
                                  plazo: r.plazo,
                                  tasa: r.tasa,
                                };
                                await saveCreditQuota(payload);
                                setStatusMsg("Cambios guardados correctamente");
                                setStatusType("success");
                                // Recargar datos
                                const data = await listCreditQuota({ limit: 200 });
                                setRows(data);
                                setFilteredRows(data);
                              }
                              setEditingRows(prev => ({...prev, [r.id]: false}));
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
                            onClick={() => handleDelete(r.id, r.entidadFinanciera, r.cuenta)}
                            className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                            title="Eliminar cupo de crédito"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>

                {/* Fecha Renovado */}
                <td>
                  {isEditing ? (
                    <input
                      type="date"
                      value={
                        r.fechaRenovado
                          ? r.fechaRenovado.split("/").reverse().join("-")
                          : ""
                      }
                      onChange={e =>
                        handleChange(
                          r.id,
                          "fechaRenovado",
                          // Convert back to dd/mm/yyyy so it stays consistent with the rest of your code
                          e.target.value.split("-").reverse().join("/")
                        )
                      }
                      className="px-2 py-1 w-full cursor-pointer border"
                    />
                  ) : (
                    r.fechaRenovado || ""
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.cuenta || ""}
                      onChange={e =>
                        handleChange(r.id, "cuenta", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.cuenta || ""
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.entidadFinanciera || ""}
                      onChange={e =>
                        handleChange(r.id, "entidadFinanciera", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.entidadFinanciera || ""
                  )}
                </td>

                <td className="num text-right">
                  {isEditing ? (
                    <div className="flex items-center">
                      $
                      <input
                        type="text"
                        value={r.cupoAsignado ? Intl.NumberFormat("es-CO").format(r.cupoAsignado) : ""}
                        onChange={e => {
                          const numericValue = e.target.value.replace(/[^\d]/g, '');
                          handleChange(r.id, "cupoAsignado", numericValue);
                        }}
                        className="px-2 py-1 w-full text-right border ml-1"
                        placeholder="0"
                      />
                    </div>
                  ) : (
                    `$${Intl.NumberFormat("es-CO").format(r.cupoAsignado || 0)}`
                  )}
                </td>

                <td className="num text-right">
                  {isEditing ? (
                    <div className="flex items-center">
                      $
                      <input
                        type="text"
                        value={r.cupoEjecutado ? Intl.NumberFormat("es-CO").format(r.cupoEjecutado) : ""}
                        onChange={e => {
                          const numericValue = e.target.value.replace(/[^\d]/g, '');
                          handleChange(r.id, "cupoEjecutado", numericValue);
                        }}
                        className="px-2 py-1 w-full text-right border ml-1"
                        placeholder="0"
                      />
                    </div>
                  ) : (
                    `$${Intl.NumberFormat("es-CO").format(r.cupoEjecutado || 0)}`
                  )}
                </td>
                <td className="num text-right">
                  ${Intl.NumberFormat("es-CO").format(r.disponible || 0)}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.garantia || ""}
                      onChange={e =>
                        handleChange(r.id, "garantia", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.garantia || ""
                  )}
                </td>

                <td className="num text-right">
                  {Intl.NumberFormat("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(r.porcentajeUtilizacion) || 0)}%
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.plazo || ""}
                      onChange={e =>
                        handleChange(r.id, "plazo", e.target.value)
                      }
                      className="px-2 py-1 w-full border text-center"
                    />
                  ) : (
                    r.plazo || ""
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={r.tasa || ""}
                        onChange={e =>
                          handleChange(r.id, "tasa", e.target.value)
                        }
                        className="px-2 py-1 w-full border text-center"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                      <span className="ml-1 text-sm text-gray-500">%</span>
                    </div>
                  ) : (
                    r.tasa ? `${r.tasa}%` : ""
                  )}
                </td>
                {/* Acciones movidas al inicio: celda original eliminada */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function toInputDateValue(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${yy}-${mm}-${dd}`;
}

/*
function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
  */

/*<td>
                  <input
                    type="date"
                    value={r.fecharenovado}
                    onChange={e => handleChange(r.id, "fecha", e.target.value)}
                    className="px-2 py-1 w-full cursor-pointer"
                  />
</td>*/
