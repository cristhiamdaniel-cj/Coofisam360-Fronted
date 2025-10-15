"use client";
import { useEffect, useState } from "react";
import {
  listPresupuesto,
  listPresupuestoCompleto,
  savePresupuesto,
  savePresupuestoCompleto,
  deletePresupuesto,
  formatNumber,
  formatPercentage,
  parseNumber,
  getCuentasDisponibles,
} from "../../services/modulo-financiero/presupuesto";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegSave, FaFileDownload, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function PresupuestoTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [cuentasDisponibles, setCuentasDisponibles] = useState([]);

  // Función para cargar cuentas disponibles
  async function loadCuentasDisponibles() {
    try {
      const cuentas = await getCuentasDisponibles();
      setCuentasDisponibles(cuentas);
    } catch (error) {
      console.error("Error cargando cuentas disponibles:", error);
    }
  }

  // Función para cargar datos desde la API
  async function loadData() {
    setLoading(true);
    try {
      const filters = {};
      if (selectedYear) filters.year = selectedYear;
      if (selectedMonth) filters.month = parseInt(selectedMonth);
      
      const data = await listPresupuestoCompleto({ ...filters, limit: 10000 });
      
      // Transformar datos para el formato esperado
      const transformedData = data.map(item => ({
        id: `${item.cuenta}_${item.anio}_${item.mes}`,
        codigo: item.cuenta,
        nombre: item.nombre_cuenta,
        anio: parseInt(item.anio),
        mes: parseInt(item.mes),
        proyectado: item.proyectado || item.presupuesto || 0,
        historico: item.historico || 0,
        diferencia: item.diferencia || 0,
        porcentaje: item.porcentaje || 0,
        escenario: item.escenario || '',
        denominacion: item.nombre_cuenta || '',
        created_at: item.created_at || new Date().toISOString(),
        isNew: false
      }));

      // Separar filas nuevas de las existentes
      const newRows = rows.filter(r => r.isNew);
      const existingRows = [...transformedData];
      
      // Ordenar solo las filas existentes por código
      const sortedExisting = existingRows.sort((a, b) => {
        const codeA = parseInt(a.codigo) || 0;
        const codeB = parseInt(b.codigo) || 0;
        return codeA - codeB;
      });
      
      // Mantener filas nuevas al principio
      const finalRows = [...newRows, ...sortedExisting];

      setRows(finalRows);
      setFilteredRows(finalRows);
      setError("");
    } catch (e) {
      setError(e.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    loadCuentasDisponibles();
  }, []);

  // Función para obtener el nombre de la cuenta por código
  function getNombreCuenta(codigo) {
    const cuenta = cuentasDisponibles.find(c => c.cuenta === codigo);
    return cuenta ? cuenta.nombre : '';
  }

  // Live search (reactive as you type)
  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows
      .filter(r => {
        const matchesSearch =
          !query ||
          r.codigo.toLowerCase().includes(query) ||
          r.nombre.toLowerCase().includes(query);

        return matchesSearch;
      })
      .sort((a, b) => {
        // Mantener filas nuevas al principio
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        
        // Ordenar por código solo si no son filas nuevas
        if (!a.isNew && !b.isNew) {
          const codeA = parseInt(a.codigo) || 0;
          const codeB = parseInt(b.codigo) || 0;
          return codeA - codeB;
        }
        
        return 0;
      });

    setFilteredRows(filtered);
  }, [search, rows]);

  // Función para manejar cambios en los campos
  const handleChange = (id, field, value) => {
    const updates = { [field]: value };
    
    // Si se cambia el código, auto-completar el nombre
    if (field === 'codigo') {
      const nombreCuenta = getNombreCuenta(value);
      if (nombreCuenta) {
        updates.nombre = nombreCuenta;
      }
    }
    
    setRows(prev =>
      prev.map(row => (row.id === id ? { ...row, ...updates } : row))
    );
    setFilteredRows(prev =>
      prev.map(row => (row.id === id ? { ...row, ...updates } : row))
    );
    setEditingRows(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }));
  };

  // Función para añadir nueva fila
  const handleAddRow = () => {
    const newId = `new_${Date.now()}`;
    const newRow = {
      id: newId,
      codigo: "",
      nombre: "",
      anio: parseInt(selectedYear),
      mes: parseInt(selectedMonth),
      proyectado: 0,
      historico: 0,
      created_at: new Date().toISOString(),
      isNew: true
    };

    setRows(prev => [newRow, ...prev]);
    setFilteredRows(prev => [newRow, ...prev]);
    setEditingRows(prev => ({ ...prev, [newId]: {} }));
  };

  // Función para guardar cambios
  const handleSave = async (id) => {
    setSaving(true);
    try {
      const row = rows.find(r => r.id === id);
      if (!row) return;

      const changes = editingRows[id] || {};
      
      // Validar campos requeridos para nuevas filas
      if (row.isNew) {
        if (!changes.codigo || !changes.nombre) {
          setStatusMessage("Código y nombre son campos requeridos");
          setStatusType("error");
          setTimeout(() => setStatusMessage(""), 3000);
          return;
        }
      }

      const payload = {
        cuenta: changes.codigo || row.codigo,
        anio: row.anio,
        mes: row.mes,
        presupuesto: parseNumber(changes.proyectado) || row.proyectado,
        denominacion: changes.denominacion || row.denominacion || row.nombre,
        monto_historico: parseNumber(changes.historico) || row.historico,
        monto_proyectado: parseNumber(changes.proyectado) || row.proyectado,
        escenario: changes.escenario || row.escenario || ''
      };

      await savePresupuestoCompleto(payload);
      
      setStatusMessage("Datos guardados correctamente");
      setStatusType("success");
      setTimeout(() => setStatusMessage(""), 3000);
      
      setEditingRows(prev => {
        const newEditing = { ...prev };
        delete newEditing[id];
        return newEditing;
      });
      
      // Si es una fila nueva, recargar datos para obtener el registro con ID correcto
      if (row.isNew) {
        await loadData();
      } else {
        // Si es una fila existente, solo marcar como no nueva
        setRows(prev =>
          prev.map(r => r.id === id ? { ...r, isNew: false } : r)
        );
        setFilteredRows(prev =>
          prev.map(r => r.id === id ? { ...r, isNew: false } : r)
        );
      }
      
    } catch (err) {
      console.error(err);
      setStatusMessage(err.message || "Error guardando cambios");
      setStatusType("error");
      setTimeout(() => setStatusMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Función para eliminar fila
  const handleDelete = async (id) => {
    const row = rows.find(r => r.id === id);
    if (!row) return;

    const confirmMessage = row.isNew 
      ? "¿Está seguro de que desea eliminar esta fila?"
      : "¿Está seguro de que desea eliminar esta fila? Esta acción no se puede deshacer.";

    if (!confirm(confirmMessage)) return;

    if (!confirm("¿Confirma la eliminación?")) return;

    try {
      if (!row.isNew) {
        // Si no es nueva, eliminar de la base de datos
        await deletePresupuesto(id);
      }

      setRows(prev => prev.filter(r => r.id !== id));
      setFilteredRows(prev => prev.filter(r => r.id !== id));
      setEditingRows(prev => {
        const newEditing = { ...prev };
        delete newEditing[id];
        return newEditing;
      });

      setStatusMessage("Fila eliminada correctamente");
      setStatusType("success");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage(err.message || "Error eliminando fila");
      setStatusType("error");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  // Función para iniciar edición
  const handleEdit = (id) => {
    setEditingRows(prev => ({ ...prev, [id]: {} }));
  };

  // Función para cancelar edición
  const handleCancel = (id) => {
    const row = rows.find(r => r.id === id);
    if (row && row.isNew) {
      // Si es nueva y se cancela, eliminar la fila
      setRows(prev => prev.filter(r => r.id !== id));
      setFilteredRows(prev => prev.filter(r => r.id !== id));
    }
    setEditingRows(prev => {
      const newEditing = { ...prev };
      delete newEditing[id];
      return newEditing;
    });
  };

  // Función para verificar si una fila es recién creada
  const isRecentlyCreated = (row) => {
    return row.isNew;
  };

  if (loading) {
    return <div className="p-12 text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }

  // Función para descargar Excel
  const handleDownload = () => {
    const exportData = filteredRows.map(row => {
      const diferencia = row.diferencia !== undefined ? row.diferencia : (row.proyectado - row.historico);
      const porcentaje = row.porcentaje !== undefined ? row.porcentaje : (row.proyectado === 0 ? 0 : (diferencia / row.proyectado) * 100);
      
      return {
        "Código": row.codigo,
        "Denominación": row.nombre,
        "Año": row.anio,
        "Mes": row.mes,
        "Proyectado": row.proyectado,
        "Histórico": row.historico,
        "Diferencia": diferencia,
        "Porcentaje": porcentaje,
        "Escenario": row.escenario || '',
        "Fecha Creación": row.created_at
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Presupuesto");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Presupuesto_${selectedYear}_${selectedMonth}.xlsx`);
  };

  // Generar opciones de años y meses
  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Presupuesto
      </h1>
      
      {/* Mensaje de estado */}
      {statusMessage && (
        <div className={`mb-4 px-4 py-2 rounded text-sm ${
          statusType === "success" 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {statusMessage}
        </div>
      )}

      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por código u oficina"
            className="border w-[300px] px-2 py-1"
          />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="border px-2 py-1"
          >
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(parseInt(e.target.value))}
            className="border px-2 py-1"
          >
            {monthNames.map((name, index) => (
              <option key={index + 1} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAddRow}
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
          >
            Añadir fila
            <FaPlus />
          </button>
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleDownload}
          >
            Descargar
            <FaFileDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-presupuesto-header">
            <tr>
              <th
                rowSpan="2"
                className="p-4 border text-center whitespace-nowrap bg-red-800 text-white"
              >
                Código
              </th>
              <th
                rowSpan="2"
                className="p-4 border text-center whitespace-nowrap bg-red-800 text-white"
              >
                Denominación
              </th>
              <th className="p-4 border text-center whitespace-nowrap bg-red-800 text-white">
                {monthNames[parseInt(selectedMonth) - 1]}-{selectedYear} Proyectado
              </th>
              <th className="p-4 border text-center whitespace-nowrap bg-red-800 text-white">
                {monthNames[parseInt(selectedMonth) - 1]}-{selectedYear} Histórico
              </th>
              <th
                colSpan="2"
                className="p-4 border text-center whitespace-nowrap bg-red-800 text-white"
              >
                {monthNames[parseInt(selectedMonth) - 1]}-{selectedYear} Proyectado VS {monthNames[parseInt(selectedMonth) - 1]}-{selectedYear} Histórico
              </th>
              <th
                rowSpan="2"
                className="p-4 border text-center whitespace-nowrap bg-red-800 text-white"
              >
                Acciones
              </th>
            </tr>
            <tr>
              <th className="p-4 border text-center whitespace-nowrap bg-red-800 text-white">
                Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap bg-red-800 text-white">
                Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap bg-red-800 text-white">
                Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap bg-red-800 text-white">%</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content">
            {filteredRows.map(row => {
              const isEditing = editingRows[row.id];
              const isNew = isRecentlyCreated(row);
              // Usar los valores calculados del backend si están disponibles, sino calcular en el frontend
              const diferencia = row.diferencia !== undefined ? row.diferencia : (row.proyectado - row.historico);
              const porcentaje = row.porcentaje !== undefined ? row.porcentaje : (row.proyectado === 0 ? 0 : (diferencia / row.proyectado) * 100);

              return (
                <tr key={row.id} className={isNew ? "bg-green-50" : ""}>
                  <td className="p-2 border text-center">
                    {isEditing ? (
                      <select
                        value={editingRows[row.id]?.codigo ?? row.codigo}
                        onChange={e => handleChange(row.id, "codigo", e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="">Seleccionar código</option>
                        {cuentasDisponibles.map(cuenta => (
                          <option key={cuenta.cuenta} value={cuenta.cuenta}>
                            {cuenta.cuenta} - {cuenta.nombre}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-mono">{row.codigo}</span>
                    )}
                    {isNew && (
                      <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                        NUEVO
                      </span>
                    )}
                  </td>
                  <td className="p-2 border text-left">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingRows[row.id]?.nombre ?? row.nombre}
                        onChange={e => handleChange(row.id, "nombre", e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-gray-50"
                        placeholder="Denominación (se auto-completa)"
                        readOnly
                      />
                    ) : (
                      row.nombre
                    )}
                  </td>
                  <td className="p-2 border text-right">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingRows[row.id]?.proyectado ?? row.proyectado}
                        onChange={e => handleChange(row.id, "proyectado", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-right"
                        placeholder="0"
                      />
                    ) : (
                      `$ ${formatNumber(row.proyectado)}`
                    )}
                  </td>
                  <td className="p-2 border text-right">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingRows[row.id]?.historico ?? row.historico}
                        onChange={e => handleChange(row.id, "historico", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-right"
                        placeholder="0"
                      />
                    ) : (
                      `$ ${formatNumber(row.historico)}`
                    )}
                  </td>
                  <td className="p-2 border text-right">
                    $ {formatNumber(diferencia)}
                  </td>
                  <td className="p-2 border text-right">
                    {formatPercentage(porcentaje)}
                  </td>
                  <td className="p-2 border text-center">
                    <div className="flex gap-2 justify-center">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(row.id)}
                            disabled={saving}
                            className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 disabled:opacity-50"
                            title="Guardar"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleCancel(row.id)}
                            className="px-3 py-1 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600"
                            title="Cancelar"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(row.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
