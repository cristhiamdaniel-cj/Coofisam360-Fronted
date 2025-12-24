/**
 *********************************************
 *   Pantalla: Presupuesto (App)               *
 *********************************************
 * Edición, carga simple y ejecución de archivos.
 */
"use client";
import { useEffect, useState } from "react";
import {
  listPresupuestoApp as listPresupuesto,
  savePresupuestoApp as savePresupuesto,
  deletePresupuestoApp,
  formatNumber,
  formatPercentage,
  parseNumber,
  uploadPresupuestoSimple,
  listPresupuestoFiles,
  executePresupuestoFile,
} from "../../services/modulo-financiero/presupuesto";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegSave, FaFileDownload, FaEdit, FaTrash, FaCheck, FaTimes, FaRegFolderOpen, FaPlay } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { TbUpload } from "react-icons/tb";
import { FaArrowDownWideShort } from "react-icons/fa6";

export default function PresupuestoTable() {
  /***************************************
   *       Bloque de lógica principal     *
   ***************************************/
  // Modal simple para explorar archivos
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
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState("todos");
  const [selectedMonth, setSelectedMonth] = useState("todos");
  const [selectedDenom, setSelectedDenom] = useState("");
  const [editingRows, setEditingRows] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info");
  // ETL simple (Código, Denominación, Proyectado)
  const [etlYear, setEtlYear] = useState(new Date().getFullYear());
  const [etlMonth, setEtlMonth] = useState(new Date().getMonth() + 1);
  const [etlFile, setEtlFile] = useState(null);
  const [etlUploading, setEtlUploading] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [etlModalOpen, setEtlModalOpen] = useState(false);
  const [filesByYear, setFilesByYear] = useState([]);
  const [etlSelectedRel, setEtlSelectedRel] = useState("");

  // Load data on mount and when filters change
  useEffect(() => {
    load();
  }, [selectedYear, selectedMonth]);

  /* -------------------------------------
   *  Mapear filas desde API
   * ------------------------------------- */
  function mapRow(r) {
    console.log("Mapeando fila:", JSON.stringify(r, null, 2));
    // Endpoint presupuesto-completo devuelve: cuenta, nombre_cuenta, anio, mes,
    // presupuesto, historico, proyectado, diferencia, porcentaje
    const historico = parseNumber(r.historico ?? r.monto_historico ?? null);
    // D = Proyectado: priorizar columna específica de BD y el alias del endpoint
    // 1) r.proyectado (alias en presupuesto-completo)
    // 2) r.monto_proyectado (columna en tabla)
    // 3) r.presupuesto (si no hay proyectado específico)
    const proyectado = parseNumber(r.proyectado ?? r.monto_proyectado ?? r.presupuesto ?? null);
    // Excel: [B] VS [A] = Histórico VS Proyectado
    // F = B - A (Histórico - Proyectado)
    const diff = (historico ?? 0) - (proyectado ?? 0);
    // G = (B - A) / A * 100  (denominador: Proyectado)
    const pct = proyectado ? (diff / proyectado) * 100 : 0;

    const y = Number(r.anio ?? 0) || 0;
    const m = Number(r.mes ?? 0) || 0;

    const mapped = {
      id: String(r.id ?? `${r.cuenta || ""}-${y}-${m}`),
      codigo: String(r.cuenta ?? ""),
      nombre: String(r.nombre_cuenta ?? r.denominacion ?? ""),
      anio: y,
      mes: m,
      // Mostrar en tabla: valorActual = Proyectado (A), valorAnterior = Histórico (B)
      valorActual: proyectado ?? 0,
      valorAnterior: historico ?? 0,
      // Forzar lógica Excel: usar siempre (B-A) y (B-A)/A
      diferencia: diff,
      porcentaje: pct,
      created_at: String(r.created_at ?? ""),
    };
    console.log("Fila mapeada:", JSON.stringify(mapped, null, 2));
    return mapped;
  }

  /**
   * +-----------------------------------+
   * |        Función de inicio          |
   * |-----------------------------------|
   * | Carga dataset y normaliza filas   |
   * +-----------------------------------+
   */
  async function load() {
    try {
      console.log("Cargando datos de presupuesto...");
      console.log("Filtros:", { anio: selectedYear, mes: selectedMonth });
      
      // Traer dataset amplio para el año seleccionado, sin filtrar por mes,
      // para que el selector de meses y la búsqueda vean lo recién creado.
      const filters = { limit: 5000 };
      if (selectedYear !== "todos") {
        filters.year = Number(selectedYear);  // Backend espera 'year'
      }
      
      console.log("Filtros aplicados:", filters);
      const data = await listPresupuesto(filters);
      console.log("=== RESPUESTA COMPLETA DEL BACKEND ===");
      console.log("Datos recibidos:", JSON.stringify(data, null, 2));
      console.log("Tipo de datos:", typeof data);
      console.log("Es array:", Array.isArray(data));
      console.log("Tiene items:", data?.items ? "SÍ" : "NO");
      console.log("Items length:", data?.items?.length || "N/A");
      console.log("Keys del objeto:", data ? Object.keys(data) : "N/A");
      
      const rows = Array.isArray(data) ? data : data?.items || [];
      console.log("Filas procesadas:", rows.length);
      console.log("Primera fila:", rows[0] ? JSON.stringify(rows[0], null, 2) : "N/A");
      
      // Si no hay datos, crear datos de prueba
      let finalRows = rows;
      if (rows.length === 0) {
        console.log("No hay datos del backend, creando datos de prueba...");
        finalRows = [
          {
            id: "test-1",
            codigo: "110505",
            nombre: "Caja General",
            anio: 2025,
            mes: 1,
            valor_anterior: 50000000,  // Histórico (B)
            valor_actual: 45000000,    // Proyectado (A)
            diferencia: 45000000 - 50000000, // D - E
            porcentaje: ((45000000 - 50000000) / 45000000) * 100,
            created_at: new Date().toISOString()
          },
          {
            id: "test-2", 
            codigo: "111005",
            nombre: "Bancos",
            anio: 2025,
            mes: 2,
            valor_anterior: 220000000, // E
            valor_actual: 200000000,   // D
            diferencia: 200000000 - 220000000,
            porcentaje: ((200000000 - 220000000)/200000000) * 100,
            created_at: new Date().toISOString()
          },
          {
            id: "test-3",
            codigo: "130505",
            nombre: "Cuentas por Cobrar",
            anio: 2024,
            mes: 12,
            valor_anterior: 160000000, // E
            valor_actual: 150000000,   // D
            diferencia: 150000000 - 160000000,
            porcentaje: ((150000000 - 160000000)/150000000) * 100,
            created_at: new Date().toISOString()
          }
        ];
      }
      
      const mapped = finalRows.map(mapRow);
      console.log("Filas mapeadas:", mapped.length);
      console.log("Primera fila mapeada:", mapped[0] ? JSON.stringify(mapped[0], null, 2) : "N/A");
      setRows(mapped);
      setFilteredRows(mapped);
      setError("");
    } catch (e) {
      console.error("ERROR LOADING PRESUPUESTO", e);
      setError(e.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

  // Live search + filtro por período (Año/Mes)
  // Evitar reordenar mientras se edita para que la fila no "salte".
  useEffect(() => {
    const query = search.trim().toLowerCase();
    const y = selectedYear === "todos" ? null : Number(selectedYear);
    const m = selectedMonth === "todos" ? null : Number(selectedMonth);
    let filtered = rows
      .filter(r => {
        // Siempre mostrar filas nuevas aunque no coincidan con filtros
        if (r && r.isNew) return true;
        const matchesSearch =
          !query ||
          r.codigo.toLowerCase().includes(query) ||
          r.nombre.toLowerCase().includes(query);
        const matchesYear = y == null || Number(r.anio) === y;
        const matchesMonth = m == null || Number(r.mes) === m;
        const matchesDenom = !selectedDenom || r.nombre === selectedDenom;
        return matchesSearch && matchesYear && matchesMonth && matchesDenom;
      });

    // Solo ordenar cuando no hay filas en edición
    const isEditingAnything = Object.keys(editingRows || {}).length > 0;
    if (!isEditingAnything) {
      filtered = filtered.sort((a, b) => Number(a.codigo) - Number(b.codigo));
    }

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth, selectedDenom, editingRows]);

  // Hook fijo: si el mes seleccionado no existe para el año elegido, resetearlo
  useEffect(() => {
    const y = selectedYear === "todos" ? null : Number(selectedYear);
    if (y == null) return;
    const avail = new Set(rows.filter(r => Number(r.anio) === y).map(r => Number(r.mes)));
    if (selectedMonth !== "todos" && !avail.has(Number(selectedMonth))) {
      setSelectedMonth("todos");
    }
  }, [selectedYear, rows, selectedMonth]);

  const handleChange = (id, field, value) => {
    if (!id) return;
    
    setRows(prev => {
      if (!prev || !Array.isArray(prev)) return prev;
      return prev.map(row => {
        if (!row || row.id !== id) return row;
        return { ...row, [field]: value };
      });
    });
    
    setFilteredRows(prev => {
      if (!prev || !Array.isArray(prev)) return prev;
      return prev.map(row => {
        if (!row || row.id !== id) return row;
        return { ...row, [field]: value };
      });
    });
    
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

        const payload = {
          cuenta: fullRow.codigo,
          anio: Number(fullRow.anio),
          mes: Number(fullRow.mes),
          // D = Proyectado (editable)
          proyectado: fullRow.valorActual,
          // Nombre/denominación opcional
          denominacion: fullRow.nombre,
          // E = Histórico (si se suministra)
          historico: fullRow.valorAnterior,
        };

        await savePresupuesto(payload);
      });

      await Promise.all(updates);
      setStatusMsg("Cambios guardados correctamente");
      setStatusType("success");
      setEditedRows({});
      await load();
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message || "Error guardando cambios");
      setStatusType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, codigo, nombre) => {
    const firstConfirm = window.confirm(
      `¿Está seguro que desea eliminar el registro "${codigo} - ${nombre}"?`
    );
    if (!firstConfirm) return;
    const secondConfirm = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Confirma que desea ELIMINAR permanentemente este registro?`
    );
    if (!secondConfirm) return;
    try {
      const row = rows.find(r => String(r.id) === String(id));
      if (!row) return;
      await deletePresupuestoApp({ cuenta: row.codigo, anio: row.anio, mes: row.mes });
      setStatusMsg("Registro eliminado correctamente");
      setStatusType("success");
      await load();
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message || "Error eliminando registro");
      setStatusType("error");
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      codigo: "",
      nombre: "",
      anio: selectedYear === "todos" ? new Date().getFullYear() : Number(selectedYear),
      mes: selectedMonth === "todos" ? new Date().getMonth() + 1 : Number(selectedMonth),
      valorAnterior: 0,
      valorActual: 0,
      diferencia: 0,
      porcentaje: 0,
      isNew: true,
    };
    setRows(prev => [newRow, ...prev]);
    setFilteredRows(prev => [newRow, ...prev]);
    setEditingRows(prev => ({ ...prev, [newRow.id]: true }));
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Presupuesto");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Presupuesto_${selectedYear}_${selectedMonth}.xlsx`);
  };

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
      const aoa = [headers.map(h => h.header), ...rows.map(r => headers.map(h => r[h.key]))];
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'Plantilla_Presupuesto_Simple.xlsx');
    } catch (e) {
      console.error(e);
      setStatusType('error');
      setStatusMsg('No se pudo generar la plantilla');
    }
  };

  const handleUpload = async (fileOverride) => {
    const selectedFile = fileOverride || etlFile;
    if (!selectedFile) {
      setStatusType('error');
      setStatusMsg('Seleccione un archivo para cargar');
      return;
    }
    if (!etlYear || !etlMonth) {
      setStatusType('error');
      setStatusMsg('Seleccione año y mes para la carga');
      return;
    }
    try {
      setEtlUploading(true);
      const res = await uploadPresupuestoSimple({ file: selectedFile, anio: etlYear, mes: etlMonth });
      const imported = res?.imported ?? 0;
      const errors = res?.errors || [];
      const savedRel = res?.saved_rel ? ` (guardado: ${res.saved_rel})` : '';
      setStatusType(errors.length ? 'info' : 'success');
      setStatusMsg(`Archivo guardado. Importados: ${imported}${errors.length ? `, errores: ${errors.length}` : ''}${savedRel}`);
      setEtlFile(null);
      setSelectedYear(String(etlYear));
      setSelectedMonth(String(etlMonth));
      await load();
      // Abrir explorador en el año de carga para verificar que quedó guardado
      await openExplorer(etlYear);
    } catch (e) {
      console.error(e);
      setStatusType('error');
      setStatusMsg(e?.response?.data?.error || e.message || 'Error al cargar archivo');
    } finally {
      setEtlUploading(false);
    }
  };

  const openExplorer = async (yearOverride) => {
    try {
      const y = (typeof yearOverride === 'number' && !Number.isNaN(yearOverride))
        ? yearOverride
        : (selectedYear === 'todos' ? undefined : Number(selectedYear));
      const files = await listPresupuestoFiles(y);
      const normalized = normalizeFileGroups(files);
      setFilesByYear(groupFilesByDetectedYear(normalized));
      setExplorerOpen(true);
    } catch (e) {
      setStatusType('error');
      setStatusMsg(e?.response?.data?.error || e.message || 'Error cargando archivos');
    }
  };

  const openEtlModal = async () => {
    try {
      const year = selectedYear === 'todos' ? etlYear : Number(selectedYear);
      setEtlYear(year);
      const files = await listPresupuestoFiles(year);
      const normalized = normalizeFileGroups(files);
      const grouped = groupFilesByDetectedYear(normalized);
      setFilesByYear(grouped);
      // preseleccionar primero si existe
      const first = grouped?.[0]?.files?.[0]?.rel || "";
      setEtlSelectedRel(first);
      setEtlModalOpen(true);
    } catch (e) {
      setStatusType('error');
      setStatusMsg(e?.response?.data?.error || e.message || 'Error cargando archivos');
    }
  };

  const runExecute = async () => {
    if (!etlSelectedRel) {
      setStatusType('error');
      setStatusMsg('Seleccione un archivo');
      return;
    }
    try {
      setSaving(true);
      // Siempre usar los valores del modal (etlYear/etlMonth),
      // para evitar que los filtros de la vista sobrescriban la selección del usuario
      const y = Number(etlYear);
      const m = Number(etlMonth);
      const res = await executePresupuestoFile({ rel: etlSelectedRel, anio: y, mes: m });
      setStatusType('success');
      setStatusMsg(`Ejecutado: ${res?.imported ?? 0} filas para ${y}-${String(m).padStart(2,'0')}`);
      setEtlModalOpen(false);
      // Ajustar filtros a lo ejecutado para que se vea inmediatamente
      setSelectedYear(String(y));
      setSelectedMonth(String(m));
      await load();
    } catch (e) {
      setStatusType('error');
      setStatusMsg(e?.response?.data?.error || e.message || 'Error ejecutando archivo');
    } finally {
      setSaving(false);
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
      // Usa API delete con body JSON { path: rel }
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
      // refrescar lista
      await openExplorer();
    } catch (e) {
      setStatusType('error');
      setStatusMsg(e.message || 'Error eliminando archivo');
    }
  };

  const buildFilePresentation = ({ name, original_name, rel, year, created_at }) => {
    const rawName = (original_name || name || (rel ? rel.split('/').pop() : '') || 'Archivo.xlsx').trim();
    const normalized = rawName.replace(/\s+/g, '_');

    const dateMatch = normalized.match(/(20\d{2})[_-]?(0[1-9]|1[0-2])?/);
    const detectedYear = year || (dateMatch ? Number(dateMatch[1]) : undefined);
    const detectedMonth = dateMatch && dateMatch[2] ? Number(dateMatch[2]) : undefined;

    let fallbackYear;
    if (!detectedYear && created_at) {
      const createdDate = new Date(created_at);
      if (!Number.isNaN(createdDate.getTime())) {
        fallbackYear = createdDate.getFullYear();
      }
    }

    return {
      displayName: rawName,
      detectedYear: detectedYear || fallbackYear,
      detectedMonth,
    };
  };

  // Función para obtener el nombre del mes
  const getMonthName = (monthNumber) => {
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return monthNames[monthNumber - 1] || "";
  };

  // Función para formatear el período
  const getPeriodText = () => {
    if (selectedYear === "todos" || selectedMonth === "todos") {
      return "Período";
    }
    const monthName = getMonthName(Number(selectedMonth));
    return `${monthName.toLowerCase()}-${selectedYear}`;
  };

  if (loading) {
    return <div className="p-12 text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }

  // Meses disponibles según el año seleccionado (helper)
  const getAvailableMonths = () => {
    if (selectedYear === "todos") {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    }
    const y = Number(selectedYear);
    const set = new Set(rows.filter(r => Number(r.anio) === y).map(r => Number(r.mes)));
    const arr = Array.from(set).sort((a, b) => a - b);
    return arr.length ? arr : [];
  };

  // Denominaciones disponibles para selector
  const availableDenoms = Array.from(
    new Set(rows.map(r => r.nombre).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, 'es'));

  const normalizeFileGroups = (groups) => {
    if (!Array.isArray(groups)) return [];
    return groups.map(group => {
      const year = group?.year;
      const files = Array.isArray(group?.files)
        ? group.files.map(file => {
            const presentation = buildFilePresentation({ ...file, year });
            return {
              ...file,
              friendlyName: presentation.displayName,
              detectedYear: presentation.detectedYear,
              detectedMonth: presentation.detectedMonth,
            };
          })
        : [];
      return { ...group, year, files };
    });
  };

  const groupFilesByDetectedYear = (groups) => {
    const byYear = new Map();
    groups.forEach(group => {
      const fallbackYear = group.year;
      group.files.forEach(file => {
        const detectedYear = file.detectedYear || fallbackYear;
        const targetYear = detectedYear || fallbackYear || 'Otros';
        if (!byYear.has(targetYear)) {
          byYear.set(targetYear, []);
        }
        byYear.get(targetYear).push(file);
      });
    });

    // Convertir a array ordenado descendentemente por año numérico (Otros al final)
    const sorted = Array.from(byYear.entries())
      .sort((a, b) => {
        const aYear = typeof a[0] === 'number' ? a[0] : -Infinity;
        const bYear = typeof b[0] === 'number' ? b[0] : -Infinity;
        return bYear - aYear;
      })
      .map(([year, files]) => ({
        year,
        files: files.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName, 'es')),
      }));

    return sorted;
  };

              return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Ejecución Presupuestal
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

          {/* Debug info removido para producción */}

      {/* Botones estilo ETL (chips), como el ETL general */}
  <div className="actions-container flex gap-4 pb-2">
        {/* Cargar Proyectado */}
        <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
          {etlFile ? (etlFile.name.length > 28 ? etlFile.name.slice(0, 25) + '…' : etlFile.name) : 'Cargar Proyectado'}
          <TbUpload />
          <input
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={async e => {
              const f = e.target.files?.[0] || null;
              if (!f) return;
              setEtlFile(f);
              // Ejecutar carga inmediatamente (igual al ETL de balances)
              await handleUpload(f);
            }}
          />
        </label>
        {/* Ejecutar carga usando año/mes seleccionados en filtros (o fallback del estado ETL) */}
        <button
          onClick={openEtlModal}
          disabled={etlUploading}
          className="action-button flex gap-2 items-center justify-center cursor-pointer disabled:opacity-50"
          title="Ejecutar carga de Proyectado"
        >
          {etlUploading ? 'Cargando…' : 'Ejecutar'} <FaPlay />
        </button>
    {/* Descargar Plantilla */}
    <button
      onClick={handleDownloadTemplate}
      className="action-button flex gap-2 items-center justify-center cursor-pointer"
    >
      Descargar plantilla <FaFileDownload />
    </button>
    {/* Explorar (ver archivos por año) */}
    <button
      onClick={openExplorer}
      className="action-button flex gap-2 items-center justify-center cursor-pointer"
    >
      Explorar <FaRegFolderOpen />
    </button>
  </div>

  {/* Modal listado de archivos por año */}
  <Modal open={explorerOpen} onClose={() => setExplorerOpen(false)} title="Archivos de Presupuesto (por año)" width={820} height={560}>
    {filesByYear && filesByYear.length ? (
      <div className="space-y-4">
        {filesByYear.map(group => (
          <div key={group.year} className="border rounded p-3">
            <div className="font-semibold mb-2 flex items-center justify-between">
              <span>{group.year === 'Otros' ? 'Sin año detectado' : `Año ${group.year}`}</span>
              <span className="text-xs text-gray-500">{group.files.length} archivo(s)</span>
            </div>
            {(group.files || []).length ? (
              <ul className="space-y-2">
                {group.files.map((f, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 py-1">
                    <div className="flex flex-col">
                      <span className="font-medium">{f.friendlyName}</span>
                      <span className="text-xs text-gray-500">Original: {f.name}</span>
                    </div>
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

  {/* Modal ETL para ejecutar archivo guardado */}
  <Modal open={etlModalOpen} onClose={() => setEtlModalOpen(false)} title="ETL · Presupuesto" width={860} height={420}>
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap items-center">
        <label className="flex items-center gap-2 font-semibold">Año
          <input type="number" className="unified-input w-28" value={etlYear}
            onChange={e => setEtlYear(parseInt(e.target.value)||etlYear)} min="2000" max="2100" />
        </label>
        <label className="flex items-center gap-2 font-semibold">Mes
          <select className="unified-input w-40" value={etlMonth} onChange={e => setEtlMonth(parseInt(e.target.value))}>
            {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((name, idx) => (
              <option key={idx+1} value={idx+1}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        {filesByYear && filesByYear.length ? (
          <>
            {filesByYear.map(group => (
              <div key={group.year} className="mb-2">
                <div className="font-semibold">Año {group.year}</div>
                <select className="unified-input w-full" value={etlSelectedRel} onChange={e => setEtlSelectedRel(e.target.value)}>
                  {(group.files||[]).map((f, idx) => (
                    <option key={idx} value={f.rel}>{f.friendlyName}</option>
                  ))}
                </select>
              </div>
            ))}
          </>
        ) : (
          <div className="text-gray-500">No hay archivos. Use "Cargar Proyectado" primero.</div>
        )}
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={runExecute} className="action-button">Ejecutar</button>
      </div>
    </div>
  </Modal>

      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex pt-4 gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por código o denominación"
            className="unified-input w-[300px]"
          />
          {/* Filtro por Denominación */}
          <select
            value={selectedDenom}
            onChange={e => setSelectedDenom(e.target.value)}
            className="unified-select max-w-[420px]">
            <option value="">Todas las denominaciones</option>
            {availableDenoms.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="unified-select"
          >
            <option value="todos">Todos los años</option>
            {Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => (
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
            <option value="todos">Todos los meses</option>
            {(selectedYear === "todos" ? Array.from({ length: 12 }, (_, i) => i + 1) : getAvailableMonths())
              .map((m) => (
                <option key={m} value={m}>
                  {getMonthName(m)}
                </option>
              ))}
          </select>
        </div>

        <div className="flex gap-4">
            <button
            onClick={handleAddRow}
            className="unified-button flex gap-2 items-center justify-center bg-green-600 hover:bg-green-700"
          >
            Agregar Fila
            <FaArrowDownWideShort />
            </button>
          {/* Botón global de Guardar cambios removido; se guarda por fila */}
          <button
            onClick={handleDownload}
            className="unified-button flex gap-2 items-center justify-center"
          >
            Descargar
            <FaFileDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-compuesta-header">
            <tr>
              <th rowSpan="2" className="p-4 border text-center whitespace-nowrap">
                Acciones
              </th>
              <th rowSpan="2" className="p-4 border text-center whitespace-nowrap">
                Código
              </th>
              <th rowSpan="2" className="p-4 border text-center whitespace-nowrap">
                Denominación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                {getPeriodText()} Proyectado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                {getPeriodText()} Histórico
              </th>
              <th colSpan="2" className="p-4 border text-center whitespace-nowrap">
                {getPeriodText()} Proyectado VS {getPeriodText()} Histórico
              </th>
            </tr>
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">
                Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap">%</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {(() => {
              console.log("Renderizando tabla - filteredRows:", filteredRows.length);
              console.log("Primera fila a renderizar:", filteredRows[0] ? JSON.stringify(filteredRows[0], null, 2) : "N/A");
              return filteredRows && filteredRows.length > 0 ? filteredRows.map((row, index) => {
                if (!row) {
                  console.log("Fila inválida en índice:", index, row);
                  return null;
                }
                // Usar el índice como ID si el ID está vacío
                const rowId = row.id || `row-${index}`;
                const isEditing = row.isNew || !!editingRows[rowId];
                const isRecentlyCreated = row.isNew;
                const uniqueKey = rowId;
                return (
                  <tr key={uniqueKey} className={isRecentlyCreated ? "bg-green-50" : ""}>
                  <td className="p-2 border text-center">
                    <div className="flex gap-2 justify-center">
                      {isEditing ? (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                // Validación mínima
                                if (!row.codigo || !row.nombre) {
                                  setStatusMsg("Por favor complete Código y Denominación antes de guardar");
                                  setStatusType("error");
                                  return;
                                }

                                // Solicitar Año/Mes cuando se guarda (pop-up)
                                const defYear = row.anio || (selectedYear !== "todos" ? Number(selectedYear) : new Date().getFullYear());
                                const yInput = window.prompt("Año del registro (YYYY)", String(defYear));
                                if (yInput === null) return; // cancelado
                                const y = parseInt(yInput, 10);
                                if (!y || y < 2000 || y > 2100) {
                                  setStatusMsg("Año inválido");
                                  setStatusType("error");
                                  return;
                                }
                                const defMonth = row.mes || (selectedMonth !== "todos" ? Number(selectedMonth) : (new Date().getMonth() + 1));
                                const mInput = window.prompt("Mes del registro (1-12)", String(defMonth));
                                if (mInput === null) return;
                                const m = parseInt(mInput, 10);
                                if (!m || m < 1 || m > 12) {
                                  setStatusMsg("Mes inválido");
                                  setStatusType("error");
                                  return;
                                }

                                const payload = {
                                  cuenta: row.codigo,
                                  anio: y,
                                  mes: m,
                                  proyectado: row.valorActual || 0,
                                  historico: row.valorAnterior || 0,
                                  denominacion: row.nombre || "",
                                };

                                await savePresupuesto(payload);
                                // Ajustar filtros al período guardado para mostrarlo de una
                                setSelectedYear(String(y));
                                setSelectedMonth(String(m));
                                setStatusMsg(row.isNew ? "Registro guardado correctamente" : "Cambios guardados correctamente");
                                setStatusType("success");
                                await load();
                                setEditingRows(prev => ({ ...prev, [rowId]: false }));
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
                                setRows(prev => prev.filter(r => (r.id || `row-${prev.indexOf(r)}`) !== rowId));
                                setFilteredRows(prev => prev.filter(r => (r.id || `row-${prev.indexOf(r)}`) !== rowId));
                              }
                              setEditingRows(prev => ({...prev, [rowId]: false}));
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
                            onClick={() => setEditingRows(prev => ({...prev, [rowId]: true}))}
                            className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          {!row.isNew && (
                            <button
                              onClick={() => handleDelete(rowId, row.codigo, row.nombre)}
                              className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="border p-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.codigo}
                        onChange={e => handleChange(rowId, "codigo", e.target.value)}
                        className="px-2 py-1 w-full border"
                        placeholder="Código"
                      />
                    ) : (
                      row.codigo
                    )}
                  </td>
                  <td className="border p-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.nombre}
                        onChange={e => handleChange(rowId, "nombre", e.target.value)}
                        className="px-2 py-1 w-full border"
                        placeholder="Denominación"
                      />
                    ) : (
                      row.nombre
                    )}
                  </td>
                  {/* A: Proyectado (valorActual) */}
                  <td className="border p-2 text-right">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.valorActual || ''}
                        onChange={e => handleChange(rowId, "valorActual", parseNumber(e.target.value))}
                        className="px-2 py-1 w-full border text-right"
                        placeholder="0.00"
                      />
                    ) : (
                      formatNumber(row.valorActual)
                    )}
                  </td>
                  {/* B: Histórico (valorAnterior) */}
                  <td className="border p-2 text-right">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.valorAnterior || ''}
                        onChange={e => handleChange(rowId, "valorAnterior", parseNumber(e.target.value))}
                        className="px-2 py-1 w-full border text-right"
                        placeholder="0.00"
                      />
                    ) : (
                      formatNumber(row.valorAnterior)
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {formatNumber(row.diferencia)}
                  </td>
                  <td className="border p-2 text-right">
                    {formatPercentage(row.porcentaje)}
                </td>
              </tr>
              );
            }) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No hay datos disponibles para el período seleccionado
                </td>
            </tr>
            );
            })()}
          </tbody>
        </table>
      </div>
    </main>
  );
}
