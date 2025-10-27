/**
 *********************************************
 *   Pantalla: Ejecución Presupuestal (PUC6)   *
 *********************************************
 * Gestión de ejecución, carga y manejo de archivos.
 */
"use client";
import { useEffect, useState } from "react";
import { FaRegSave, FaRegFolderOpen, FaPlay } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { TbUpload } from "react-icons/tb";
import { FaArrowDownWideShort } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  listEjecucionPresupuestal,
  saveEjecucionPresupuestal,
  deleteEjecucionPresupuestal,
  formatNumber,
  formatPercentage,
  parseNumber,
  uploadEjecucionPresupuestal,
  listEjecucionFiles,
} from "../../services/modulo-financiero/ejecucionPresupuestal";

export default function EjecucionPresupuestalTable() {
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
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [editingRows, setEditingRows] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info"); // success | error | info
  // ETL upload state
  const [etlYear, setEtlYear] = useState(new Date().getFullYear());
  const [etlMonth, setEtlMonth] = useState(new Date().getMonth() + 1);
  const [etlFile, setEtlFile] = useState(null);
  const [etlUploading, setEtlUploading] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [filesByYear, setFilesByYear] = useState([]);

  const handleDownloadTemplate = () => {
    try {
      const headers = [
        { header: 'Código', key: 'codigo' },
        { header: 'Denominación', key: 'denominacion' },
        { header: 'Proyectado', key: 'proyectado' },
      ];
      const rows = [
        { codigo: '110505', denominacion: 'CAJA GENERAL', proyectado: 0 },
      ];
      // Build worksheet using AOA to ensure header names
      const aoa = [headers.map(h => h.header), ...rows.map(r => headers.map(h => r[h.key]))];
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'Plantilla_Ejecucion_Presupuestal.xlsx');
    } catch (e) {
      console.error(e);
      setStatusType('error');
      setStatusMsg('No se pudo generar la plantilla');
    }
  };

  // Load data on mount
  useEffect(() => {
    load();
  }, []);

  /* -------------------------------------
   *  Mapear filas desde API
   * ------------------------------------- */
  function mapRow(r) {
    return {
      id: String(r.id ?? ""),
      anio: Number(r.anio ?? 0) || 0,
      mes: Number(r.mes ?? 0) || 0,
      codigo_puc6: String(r.codigo_puc6 ?? ""),
      nombre_rubro: String(r.nombre_rubro ?? ""),
      proyectado: parseNumber(r.proyectado),
      historico: parseNumber(r.historico),
      diff_abs: parseNumber(r.diff_abs),
      diff_pct: parseNumber(r.diff_pct),
      periodo: String(r.periodo ?? ""),
      created_at: String(r.created_at ?? ""),
    };
  }

  /**
   * +-----------------------------------+
   * |        Función de inicio          |
   * |-----------------------------------|
   * | Carga inicial de ejecución        |
   * +-----------------------------------+
   */
  async function load() {
    try {
      console.log("Iniciando carga de datos...");
      // Cargar todos los datos sin filtros
      const data = await listEjecucionPresupuestal({ limit: 1000 });
      console.log("Datos recibidos:", data);
      const rows = Array.isArray(data) ? data : data?.items || [];
      console.log("Filas procesadas:", rows.length);
      const mapped = rows.map(mapRow);
      setRows(mapped);
      setFilteredRows(mapped);
      setError("");
      
      // Establecer año y mes por defecto si hay datos
      if (mapped.length > 0) {
        setSelectedYear(2025);
        setSelectedMonth(8);
      }
      console.log("Carga completada exitosamente");
    } catch (e) {
      console.error("ERROR LOADING EJECUCION PRESUPUESTAL", e);
      console.error("Error response:", e.response?.data);
      console.error("Error status:", e.response?.status);
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

  const handleUpload = async () => {
    if (!etlFile) {
      setStatusType('error');
      setStatusMsg('Seleccione un archivo para cargar');
      return;
    }
    const y = selectedYear || etlYear;
    const m = selectedMonth || etlMonth;
    if (!y || !m) {
      setStatusType('error');
      setStatusMsg('Seleccione año y mes para la carga');
      return;
    }
    try {
      setEtlUploading(true);
      const res = await uploadEjecucionPresupuestal({ file: etlFile, anio: y, mes: m });
      const imported = res?.imported ?? res?.saved ?? 0;
      const errors = res?.errors || [];
      setStatusType(errors.length ? 'info' : 'success');
      setStatusMsg(`Importados: ${imported}${errors.length ? `, errores: ${errors.length}` : ''}`);
      setEtlFile(null);
      // recargar datos al período subido
      setSelectedYear(String(y));
      setSelectedMonth(String(m));
      await load();
      // Abrir explorador para verificar que quedó guardado
      await openExplorer();
    } catch (e) {
      console.error(e);
      setStatusType('error');
      setStatusMsg(e?.response?.data?.error || e.message || 'Error al cargar archivo');
    } finally {
      setEtlUploading(false);
    }
  };

  // Modal simple
  function Modal({ open, onClose, title, children, width = 720, height = 520 }) {
    if (!open) return null;
    return (
      <div className="modal-tablero-control fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center">
        <div className="bg-white rounded-[20px] flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.2)]" style={{ width, maxWidth: '96vw', height, maxHeight: '90vh' }}>
          <div className="px-3.5 py-2.5 border-b rounded-t-[20px] border-[#e6e6e6] flex items-center justify-between bg-[#780000] text-[#fff1f2]">
            <h3 style={{ margin: 0, fontWeight: 700 }}>{title}</h3>
            <button onClick={onClose} className="cursor-pointer">✖</button>
          </div>
          <div style={{ padding: 12, overflow: 'auto', flex: 1 }}>{children}</div>
        </div>
      </div>
    );
  }

  const openExplorer = async () => {
    try {
      const y = selectedYear || undefined;
      const list = await listEjecucionFiles(y);
      setFilesByYear(list);
      setExplorerOpen(true);
    } catch (e) {
      setStatusType('error');
      setStatusMsg(e?.response?.data?.error || e.message || 'Error cargando archivos');
    }
  };

  const downloadRel = async rel => {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || '';
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
      const url = `${base}/api/v1/finanzas/download/?path=${encodeURIComponent(rel)}`;
      const res = await fetch(url, { headers: token ? { Authorization: `Token ${token}` } : {} });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = rel.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      setStatusType('error');
      setStatusMsg(e.message || 'Error descargando archivo');
    }
  };

  const deleteRel = async rel => {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || '';
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
      const url = `${base}/api/v1/finanzas/delete/`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: JSON.stringify({ path: rel })
      });
      if (!res.ok) throw new Error(await res.text());
      setStatusType('success');
      setStatusMsg('Archivo eliminado correctamente');
      // Refrescar lista
      await openExplorer();
    } catch (e) {
      setStatusType('error');
      setStatusMsg(e.message || 'Error eliminando archivo');
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
            anio: Number(merged.anio),
            mes: Number(merged.mes),
            codigo_puc6: merged.codigo_puc6,
            nombre_rubro: merged.nombre_rubro,
            proyectado: merged.proyectado,
            historico: merged.historico,
          };
          await saveEjecucionPresupuestal(payload);
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

  const handleDelete = async (id, codigo_puc6, nombre_rubro, anio, mes) => {
    // Primera confirmación
    const firstConfirm = window.confirm(
      `¿Está seguro que desea eliminar el registro "${codigo_puc6} - ${nombre_rubro}" del período ${anio}-${mes}?`
    );
    
    if (!firstConfirm) return;
    
    // Segunda confirmación
    const secondConfirm = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Confirma que desea ELIMINAR permanentemente este registro de ejecución presupuestal?`
    );
    
    if (!secondConfirm) return;
    
    try {
      await deleteEjecucionPresupuestal(id);
      setStatusMsg("Registro de ejecución presupuestal eliminado correctamente");
      setStatusType("success");
      // Recargar datos
      await load();
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message || "Error eliminando registro de ejecución presupuestal");
      setStatusType("error");
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Ejecucion Presupuestal"
    );
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Ejecucion_Presupuestal_PUC_6d.xlsx");
  };

  const handleAddRow = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const periodo = `${year}-${String(month).padStart(2, "0")}`;
    
    const newRow = {
      id: `new-${Date.now()}`, // id único temporal
      anio: year,
      mes: month,
      codigo_puc6: "",
      nombre_rubro: "",
      proyectado: null,
      historico: null,
      diff_abs: null,
      diff_pct: null,
      periodo: periodo,
      created_at: new Date().toISOString(),
      isNew: true
    };

    setRows(prev => [newRow, ...prev]); // agregamos al inicio
    setFilteredRows(prev => [newRow, ...prev]);
    setEditingRows(prev => ({ ...prev, [newRow.id]: true })); // Entrar en modo edición automáticamente
  };

  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows.filter(r => {
      const matchesSearch =
        !query ||
        r.codigo_puc6.toLowerCase().includes(query) ||
        r.nombre_rubro.toLowerCase().includes(query);

      const matchesYear = !selectedYear || r.anio === Number(selectedYear);
      const matchesMonth = !selectedMonth || r.mes === Number(selectedMonth);

      return matchesSearch && matchesYear && matchesMonth;
    });
    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

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
        Ejecución Presupuestal (PUC 6 dígitos)
      </h1>

      {/* Acciones ETL estilo chips (como ETL general) */}
      <div className="actions-container flex gap-4 pb-2">
        <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
          {etlFile ? (etlFile.name.length > 28 ? etlFile.name.slice(0, 25) + '…' : etlFile.name) : 'Cargar Proyectado'}
          <TbUpload />
          <input
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={e => setEtlFile(e.target.files?.[0]||null)}
          />
        </label>
        <button
          onClick={handleUpload}
          disabled={etlUploading}
          className="action-button flex gap-2 items-center justify-center cursor-pointer disabled:opacity-50"
        >
          {etlUploading ? 'Cargando…' : 'Ejecutar'} <FaPlay />
        </button>
        <button
          onClick={handleDownloadTemplate}
          className="action-button flex gap-2 items-center justify-center cursor-pointer"
        >
          Descargar plantilla <FiDownload />
        </button>
    <button
      onClick={openExplorer}
      className="action-button flex gap-2 items-center justify-center cursor-pointer"
    >
      Explorar <FaRegFolderOpen />
    </button>
  </div>

  <Modal open={explorerOpen} onClose={() => setExplorerOpen(false)} title="Archivos (por año)" width={820} height={560}>
    {filesByYear && filesByYear.length ? (
      <div className="space-y-4">
        {filesByYear.map(group => (
          <div key={group.year} className="border rounded p-3">
            <div className="font-semibold mb-2">Año {group.year}</div>
            {(group.files || []).length ? (
              <ul className="list-disc pl-5">
                {group.files.map((f, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 py-1">
                    <span>{f.name}</span>
                    <div className="flex gap-2">
                      <button className="action-button px-3 py-1" onClick={() => downloadRel(f.rel)}>Descargar</button>
                      <button className="action-button px-3 py-1" onClick={() => deleteRel(f.rel)}>Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">Sin archivos</div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-500">No hay archivos disponibles</div>
    )}
  </Modal>
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
            placeholder="Buscar por código PUC o nombre del rubro"
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
              className="action-button flex gap-2 items-center justify-center cursor-pointer disabled:opacity-50"
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[80px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                Código PUC
              </th>
              <th className="py-4 px-28 border text-center whitespace-nowrap">
                Nombre del Rubro
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                [A] Proyectado
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                [B] Histórico
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                [B] vs [A] (Absoluto)
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                [B] vs [A] (%)
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
                      <button 
                        onClick={async () => {
                          if (isEditing) {
                            // Guardar automáticamente antes de terminar
                            try {
                              if (r.isNew) {
                                // Para filas nuevas, validar campos requeridos
                                if (!r.codigo_puc6 || !r.nombre_rubro || !r.anio || !r.mes) {
                                  setStatusMsg("Por favor complete todos los campos requeridos (Código PUC, Nombre del Rubro, Año, Mes)");
                                  setStatusType("error");
                                  return;
                                }
                                // Validar código PUC de 6 dígitos
                                if (r.codigo_puc6.length !== 6 || !/^\d{6}$/.test(r.codigo_puc6)) {
                                  setStatusMsg("El código PUC debe tener exactamente 6 dígitos");
                                  setStatusType("error");
                                  return;
                                }
                                await saveEjecucionPresupuestal(r);
                                setStatusMsg("Registro de ejecución presupuestal guardado correctamente");
                                setStatusType("success");
                                // Recargar datos
                                await load();
                              } else {
                                // Para filas existentes, guardar cambios
                                await saveEjecucionPresupuestal(r);
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
                          }
                          setEditingRows(prev => ({...prev, [r.id]: !prev[r.id]}));
                        }} 
                        className="px-3 py-1 border rounded cursor-pointer"
                      >
                        {isEditing ? "Terminar" : "Editar"}
                      </button>
                      {!r.isNew && (
                        <button
                          onClick={() => handleDelete(r.id, r.codigo_puc6, r.nombre_rubro, r.anio, r.mes)}
                          className="px-3 py-1 border rounded cursor-pointer bg-red-50 text-red-700 hover:bg-red-100"
                          title="Eliminar registro de ejecución presupuestal"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="border p-2">
                  {isEditing ? (
                    <input
                      type="number"
                      min="2020"
                      max="2030"
                      value={r.anio}
                      onChange={e => handleChange(r.id, "anio", parseInt(e.target.value) || 0)}
                      className="px-2 py-1 w-full border text-center"
                    />
                  ) : (
                    r.anio
                  )}
                </td>
                <td className="border p-2">
                  {isEditing ? (
                    <select
                      value={r.mes}
                      onChange={e => handleChange(r.id, "mes", parseInt(e.target.value))}
                      className="px-2 py-1 w-full border"
                    >
                      {monthNames.map((name, index) => (
                        <option key={index + 1} value={index + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    monthNames[r.mes - 1] || r.mes
                  )}
                </td>
                <td className="border p-2">
                  {isEditing ? (
                    <input
                      type="text"
                      maxLength="6"
                      value={r.codigo_puc6}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, ''); // Solo números
                        if (value.length <= 6) {
                          handleChange(r.id, "codigo_puc6", value);
                        }
                      }}
                      className="px-2 py-1 w-full border text-center"
                      placeholder="000000"
                    />
                  ) : (
                    r.codigo_puc6
                  )}
                </td>
                <td className="border p-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.nombre_rubro}
                      onChange={e => handleChange(r.id, "nombre_rubro", e.target.value)}
                      className="px-2 py-1 w-full border"
                      placeholder="Nombre del rubro"
                    />
                  ) : (
                    r.nombre_rubro
                  )}
                </td>
                <td className="border p-2 text-right">
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.proyectado || ''}
                      onChange={e => handleChange(r.id, "proyectado", parseNumber(e.target.value))}
                      className="px-2 py-1 w-full border text-right"
                      placeholder="0.00"
                    />
                  ) : (
                    formatNumber(r.proyectado)
                  )}
                </td>
                <td className="border p-2 text-right">
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.historico || ''}
                      onChange={e => handleChange(r.id, "historico", parseNumber(e.target.value))}
                      className="px-2 py-1 w-full border text-right"
                      placeholder="0.00"
                    />
                  ) : (
                    formatNumber(r.historico)
                  )}
                </td>
                <td className="border p-2 text-right">
                  {formatNumber(r.diff_abs)}
                </td>
                <td className="border p-2 text-right">
                  {formatPercentage(r.diff_pct)}
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </main>
  );
}
