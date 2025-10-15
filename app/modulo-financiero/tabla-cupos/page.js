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
    if (!query) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(
        r =>
          r.cuenta?.toLowerCase().includes(query) ||
          r.entidadFinanciera?.toLowerCase().includes(query)
      );
      setFilteredRows(filtered);
    }
  }, [search, rows]);

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
            ...merged,
            id: Number(k),
            entidad_financiera: merged.entidadFinanciera,
            fecha_renovado: merged.fechaRenovado,
            cupo_asignado: merged.cupoAsignado,
          };
          await saveCreditQuota(payload);
          ok++;
        } catch (e) {
          console.error(e);
          fail++;
        }
      }
      setEditedRows({});
      const data = await listCreditQuota({ limit: 200 });
      setRows(data);
      setFilteredRows(data);
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
      tasa: "La vigente al desembolso",
      fechaRenovado: new Date().toISOString().split('T')[0], // fecha actual
      isNew: true,
      created_at: new Date().toISOString() // Timestamp para indicador visual
    };

    setRows(prev => [newRow, ...prev]); // agregamos al inicio
    setFilteredRows(prev => [newRow, ...prev]);
  };

  return (
    <main className="pt-12 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-12">
        Cupo Créditos
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
              const isEditing = r.isNew || !!editingRows[idx];
              const isRecentlyCreated = r.isNew; // Solo para filas realmente nuevas
              return (
              <tr key={idx} className={isRecentlyCreated ? "bg-green-50" : ""}>
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
                                  if (!r.entidadFinanciera || !r.cuenta) {
                                    setStatusMsg("Por favor complete todos los campos requeridos (Entidad Financiera, Cuenta)");
                                    setStatusType("error");
                                    return;
                                  }
                                  await saveCreditQuota(r);
                                  setStatusMsg("Cupo de crédito guardado correctamente");
                                  setStatusType("success");
                                  // Recargar datos
                                  const data = await listCreditQuota({ limit: 200 });
                                  setRows(data);
                                  setFilteredRows(data);
                                } else {
                                  // Para filas existentes, guardar cambios
                                  await saveCreditQuota(r);
                                  setStatusMsg("Cambios guardados correctamente");
                                  setStatusType("success");
                                  // Recargar datos
                                  const data = await listCreditQuota({ limit: 200 });
                                  setRows(data);
                                  setFilteredRows(data);
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
                              if (r.isNew) {
                                // Si es nueva y se cancela, eliminar la fila
                                setRows(prev => prev.filter(row => row.id !== r.id));
                                setFilteredRows(prev => prev.filter(row => row.id !== r.id));
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
                  </div>
                </td>
                <td>
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
                </td>

                <td>{r.cuenta}</td>
                <td>{r.entidadFinanciera}</td>

                <td className="text-left flex items-center">
                  $
                  <input
                    type="text"
                    value={r.cupoAsignado ? new Intl.NumberFormat("es-CO").format(r.cupoAsignado) : ""}
                    onChange={e => {
                      // Remover puntos y comas para obtener el número puro
                      const cleanValue = e.target.value.replace(/[.,]/g, '');
                      handleChange(r.id, "cupoAsignado", cleanValue);
                    }}
                    className="px-2 py-1 w-full text-right border ml-1"
                    placeholder="0"
                  />
                </td>

                <td className="num text-right">
                  ${Intl.NumberFormat("es-CO").format(r.cupoEjecutado || 0)}
                </td>
                <td className="num text-right">
                  ${Intl.NumberFormat("es-CO").format(r.disponible || 0)}
                </td>

                <td>
                  <input
                    type="text"
                    value={r.garantia || ""}
                    onChange={e =>
                      handleChange(r.id, "garantia", e.target.value)
                    }
                    className="px-2 py-1 w-full border"
                  />
                </td>

                <td className="num text-right">
                  {(() => {
                    const val = r.porcentajeUtilizacion ?? 0;
                    // Formatear solo decimales, sin separadores de miles
                    return Number(val).toFixed(4) + '%';
                  })()}
                </td>
                <td className="text-center">{r.plazo}</td>
                <td className="text-center">{r.tasa}</td>
              </tr>
            );})}
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
