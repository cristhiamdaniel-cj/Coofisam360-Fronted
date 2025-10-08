"use client";
import { useEffect, useMemo, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { listProgramaRows, saveProgramaRow } from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/programaCapacitacionesQuota";

const DEFAULT_ACTIVIDADES = [
  "Induccion Seguridad y Salud en el Trabajo",
  "Reinduccion Seguridad y Salud en el Trabajo",
  "Seguridad Vial",
  "Entrenamiento brigada de emergencia",
  "Taller técnicas de relajación",
  "Capacitación equidad de género y violencia",
  "Capacitación estrategias de seguridad en entornos públicos",
  "Capacitación acoso sexual ley 2365 de 2024",
  "Capacitación conservación visual",
  "Taller en el manejo de las emociones y del estrés",
  "Capacitacion lesiones osteomusculares",
  "Capacitacion Copasst",
  "Capacitacion Comité Convivencia Laboral",
  "Formacion Lideres Pausas Activas",
  "Capacitacion Riesgos Laborales",
  "Capacitacion Ludica Comité Convivencia Laboral",
  "Capacitacion Habitos y Estilos de Vida Saludable",
  "Capacitacion Brigadas Sistemas de Comando de Incidentes",
  "Formacion habitos de vida saludable",
];

function buildGrid(items = [], defaultYear) {
  const byKey = new Map();
  for (const r of items) {
    const anio = Number(r.anio) || defaultYear || new Date().getFullYear();
    const key = `${anio}|${r.actividad || ''}`;
    if (!byKey.has(key)) {
      const base = {
        _key: key,
        anio,
        actividad: r.actividad || "",
        origActividad: r.actividad || "",
        responsable: r.responsable || "",
        recurso1: r.recursoAdministrativo ? "SI" : "NO",
        recurso2: r.recursoFinanciero ? "SI" : "NO",
        observaciones: r.observaciones || "",
        exists: Array(12).fill(false),
      };
      for (let i = 0; i < 24; i++) base[`col${i}`] = false;
      base._orig = Array(24).fill(false);
      byKey.set(key, base);
    }
    const row = byKey.get(key);
    const m = Math.min(Math.max(Number(r.mes) || 1, 1), 12);
    row.exists[m - 1] = true;
    const p = (Number(r.planeado) || 0) > 0;
    const e = (Number(r.ejecutado) || 0) > 0;
    row[`col${2 * (m - 1)}`] = p;
    row[`col${2 * (m - 1) + 1}`] = e;
    row._orig[2 * (m - 1)] = p;
    row._orig[2 * (m - 1) + 1] = e;
  }
  // Asegurar plantilla: agregar todas las actividades por defecto si faltan
  for (const nombre of DEFAULT_ACTIVIDADES) {
    const key = `${defaultYear || new Date().getFullYear()}|${nombre}`;
    if (!byKey.has(key)) {
      const base = {
        _key: key,
        anio: defaultYear || new Date().getFullYear(),
        actividad: nombre,
        origActividad: nombre,
        responsable: "",
        recurso1: "SI",
        recurso2: "NO",
        observaciones: "",
        exists: Array(12).fill(false),
        isNew: true,
      };
      for (let i = 0; i < 24; i++) base[`col${i}`] = false;
      base._orig = Array(24).fill(false);
      byKey.set(key, base);
    }
  }
  return Array.from(byKey.values()).sort((a, b) => String(a.actividad).localeCompare(String(b.actividad)));
}

export default function GestionesTable() {
  const [actividades, setActividades] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editedRows, setEditedRows] = useState({});
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info");

  useEffect(() => {
    async function load() {
      try {
        const data = await listProgramaRows({ anio: selectedYear, limit: 1000 });
        setActividades(buildGrid(data, selectedYear));
        setEditedRows({});
      } catch (e) {
        setStatusType("error");
        setStatusMsg(e.message || "Error cargando datos");
      }
    }
    load();
  }, [selectedYear]);

  const handleChange = (idx, field, value) => {
    setActividades(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
    setEditedRows(prev => ({ ...prev, [idx]: { ...(prev[idx] || {}), [field]: value } }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const idxs = Object.keys(editedRows).map(k => Number(k));
      let ok = 0, fail = 0;
      for (const i of idxs) {
        const r = actividades[i];
        if (!r || !r.actividad) continue;
        for (let m = 1; m <= 12; m++) {
          const p = Math.max(0, Number(r[`col${2 * (m - 1)}`]) || 0);
          const e = Math.max(0, Number(r[`col${2 * (m - 1) + 1}`]) || 0);
          const exists = !!(r.exists && r.exists[m - 1]);
          const prevP = (r._orig && r._orig[2 * (m - 1)]) || 0;
          const prevE = (r._orig && r._orig[2 * (m - 1) + 1]) || 0;
          const changed = p !== prevP || e !== prevE;
          if (!exists && p === 0 && e === 0) continue;
          if (exists && !changed) continue;
          const body = {
            isNew: !exists,
            anio: selectedYear,
            mes: m,
            actividad: r.actividad || "",
            planeado: p,
            ejecutado: e,
            responsable: r.responsable || "",
            recurso_administrativo: (r.recurso1 || "NO") === "SI",
            recurso_financiero: (r.recurso2 || "NO") === "SI",
            observaciones: r.observaciones || "",
            total_actividades: p,
            actividades_programadas_mes: p,
          };
          if (exists) {
            body.where_anio = selectedYear;
            body.where_mes = m;
            body.where_actividad = r.origActividad || "";
          }
          try {
            await saveProgramaRow(body);
            ok++;
          } catch (err) {
            console.error(err);
            fail++;
          }
        }
      }
      setEditedRows({});
      const fresh = await listProgramaRows({ anio: selectedYear, limit: 1000 });
      setActividades(buildGrid(fresh, selectedYear));
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

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(actividades);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Programa");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "programa_capacitaciones.xlsx");
  };

  // Sincroniza la plantilla completa (12 meses x actividad) en BD con P=0, E=0 cuando falten
  const handleSyncYear = async () => {
    try {
      setSyncing(true);
      // Traer lo que realmente existe en BD (sin plantilla fusionada)
      const raw = await listProgramaRows({ anio: selectedYear, limit: 2000 });
      const exist = new Set(
        raw.map(r => `${Number(r.anio) || selectedYear}|${r.actividad}|${Number(r.mes)}`)
      );
      let created = 0;
      for (const nombre of DEFAULT_ACTIVIDADES) {
        for (let m = 1; m <= 12; m++) {
          const key = `${selectedYear}|${nombre}|${m}`;
          if (!exist.has(key)) {
            try {
              await saveProgramaRow({
                isNew: true,
                anio: selectedYear,
                mes: m,
                actividad: nombre,
                planeado: 0,
                ejecutado: 0,
                responsable: '', // toApi pone 'SIN RESPONSABLE'
                recursoAdministrativo: false,
                recursoFinanciero: false,
                observaciones: '',
                totalActividades: 0,
                actividadesProgramadasMes: 0,
              });
              created++;
            } catch (_) {
              // Ignorar fallos individuales para continuar
            }
          }
        }
      }
      const fresh = await listProgramaRows({ anio: selectedYear, limit: 2000 });
      setActividades(buildGrid(fresh, selectedYear));
      setStatusType('info');
      setStatusMsg(created > 0 ? `Plantilla sincronizada: ${created} celdas creadas.` : 'Plantilla ya estaba completa.');
    } finally {
      setSyncing(false);
    }
  };

  const handleAddRow = () => {
    const newRow = {
      anio: selectedYear,
      actividad: "",
      responsable: "",
      recurso1: "SI",
      recurso2: "NO",
      observaciones: "",
      exists: Array(12).fill(false),
      isNew: true,
    };
    for (let i = 0; i < 24; i++) newRow[`col${i}`] = false;
    setActividades(prev => [newRow, ...prev]);
    setEditedRows(prev => ({ ...prev, 0: { ...newRow } }));
  };

  const months = [
    "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
    "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE",
  ];

  const resumen = useMemo(() => {
    const planeadoMes = Array(12).fill(0);
    const ejecutadoMes = Array(12).fill(0);
    for (const r of actividades) {
      for (let m = 1; m <= 12; m++) {
        const p = Math.max(0, Number(r[`col${2 * (m - 1)}`]) || 0);
        let e = Math.max(0, Number(r[`col${2 * (m - 1) + 1}`]) || 0);
        // Cap ejecutado a planeado para evitar sobreestimación
        if (e > p) e = p;
        planeadoMes[m - 1] += p;
        ejecutadoMes[m - 1] += e;
      }
    }
    const pctMes = planeadoMes.map((p, i) => (p ? Math.round((ejecutadoMes[i] * 100) / p) : 0));
    const totalPlaneado = planeadoMes.reduce((a, b) => a + b, 0);
    const totalEjecutado = ejecutadoMes.reduce((a, b) => a + b, 0);
    const pctAnual = totalPlaneado ? Math.round((totalEjecutado * 100) / totalPlaneado) : 0;
    return { planeadoMes, ejecutadoMes, pctMes, totalPlaneado, totalEjecutado, pctAnual };
  }, [actividades]);

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">Programa de Capacitaciones</h1>
      {statusMsg && (
        <div className={`mb-2 text-sm ${statusType === 'error' ? 'text-red-600' : statusType === 'success' ? 'text-green-700' : 'text-slate-600'}`}>{statusMsg}</div>
      )}
      <div className="actions-container flex justify-end mb-4">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm">Año:</label>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="border rounded p-1">
              {Array.from({ length: 7 }).map((_, i) => { const y = new Date().getFullYear() - 3 + i; return (<option key={y} value={y}>{y}</option>); })}
            </select>
          </div>
          {Object.keys(editedRows).length > 0 && (
            <button onClick={handleSave} disabled={saving} className="action-button flex gap-2 items-center justify-center cursor-pointer">{saving ? 'Guardando...' : 'Guardar cambios'}<FaRegSave /></button>
          )}
          <button onClick={handleSyncYear} disabled={syncing} className="action-button flex gap-2 items-center justify-center cursor-pointer">{syncing ? 'Sincronizando...' : 'Sincronizar plantilla'}</button>
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer" onClick={handleDownload}>Descargar <FiDownload /></button>
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer" onClick={handleAddRow}>Añadir fila <FaArrowDownWideShort /></button>
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th rowSpan="3" className="p-4 border text-center bg-white z-20 min-w-[250px]">ACTIVIDAD</th>
              <th colSpan="24" className="border text-center p-2 bg-white z-20">PROGRAMA DE CAPACITACIONES</th>
              <th rowSpan="3" className="p-4 border text-center bg-white z-20">Responsable(s)</th>
              <th colSpan="2" className="p-4 border text-center min-w-[300px] bg-white z-20">RECURSOS</th>
              <th rowSpan="3" className="p-4 border text-center bg-white z-20">OBSERVACIONES</th>
            </tr>
            <tr>
              {months.map(m => (<th key={m} colSpan="2" className="border text-center p-2 text-[10px] min-w-[80px] text-white bg-white z-20">{m}</th>))}
              <th rowSpan="2" colSpan="1" className="border text-center p-2 min-w-[150px] text-white bg-white z-20">admin</th>
              <th rowSpan="2" colSpan="1" className="border text-center p-2 min-w-[150px] text-white bg-white z-20">finan</th>
            </tr>
            <tr>
              {Array.from({ length: 12 }).map((_, i) => (<><th key={`p-${i}`} className="border text-center p-2 bg-white z-20 text-white">P</th><th key={`e-${i}`} className="border text-center p-2 bg-white z-20 text-white">E</th></>))}
            </tr>
          </thead>
          <tbody className="tabla-cupos-content">
            {actividades.map((r, idx) => (
              <tr key={r._key || `${selectedYear}-${r.actividad}-${idx}`}>
                <td className="p-2 border text-left"><input type="text" value={r.actividad || ''} onChange={e => handleChange(idx, 'actividad', e.target.value)} placeholder="Nueva actividad" className="px-2 py-1 w-full border" /></td>
                {Array.from({ length: 24 }).map((_, i) => (<td key={i} className="p-2 border text-center max-w-[40px]"><input type="checkbox" checked={!!r[`col${i}`]} onChange={e => handleChange(idx, `col${i}`, e.target.checked)} className="mx-auto" /></td>))}
                <td className="p-2 border text-center"><select value={r.responsable || ""} onChange={e => handleChange(idx, "responsable", e.target.value)} className="w-full border px-1 py-1">{"Comité de Convivencia Laboral,Comité de COPASST,Auxiliar SST,ARL,Coordinador Talento y Cultura,Subgerencia de Innovación Empresarial".split(",").map(opt => (<option key={opt} value={opt}>{opt}</option>))}</select></td>
                <td className="p-2 border text-center"><select value={r.recurso1 || "SI"} onChange={e => handleChange(idx, "recurso1", e.target.value)} className="border rounded text-center p-1 w-full">{"SI,NO".split(",").map(opt => (<option key={opt} value={opt}>{opt}</option>))}</select></td>
                <td className="p-2 border text-center"><select value={r.recurso2 || "NO"} onChange={e => handleChange(idx, "recurso2", e.target.value)} className="border rounded text-center p-1 w-full">{"SI,NO".split(",").map(opt => (<option key={opt} value={opt}>{opt}</option>))}</select></td>
                <td className="p-2 border text-center"><input type="text" value={r.observaciones || ""} onChange={e => handleChange(idx, "observaciones", e.target.value)} className="w-full border px-1 py-1" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen mensual */}
      <div className="mt-8">
        <div className="overflow-auto">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="tabla-header">
                <th className="p-3 border text-left whitespace-nowrap">1. CUMPLIMIENTO DEL PROGRAMA</th>
                {months.map(m => (<th key={m} className="p-3 border text-center whitespace-nowrap text-xs">{m.substring(0,3)}</th>))}
                <th className="p-3 border text-center whitespace-nowrap">CUMPLIMIENTO ANUAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border text-left whitespace-nowrap">Actividades Programadas en el Mes</td>
                {resumen.planeadoMes.map((v, i) => (<td key={i} className="p-2 border text-center">{v}</td>))}
                <td className="p-2 border text-center font-semibold">{resumen.totalPlaneado}</td>
              </tr>
              <tr>
                <td className="p-2 border text-left whitespace-nowrap">Actividades Ejecutadas en el Mes</td>
                {resumen.ejecutadoMes.map((v, i) => (<td key={i} className="p-2 border text-center">{v}</td>))}
                <td className="p-2 border text-center font-semibold">{resumen.totalEjecutado}</td>
              </tr>
              <tr>
                <td className="p-2 border text-left whitespace-nowrap">% Ejecución Mensual del Programa</td>
                {resumen.pctMes.map((v, i) => (<td key={i} className="p-2 border text-center">{v}%</td>))}
                <td className="p-2 border text-center font-semibold">{resumen.pctAnual}%</td>
              </tr>
              <tr>
                <td className="p-2 border text-left whitespace-nowrap">% Cumplimiento Meta en el Mes</td>
                {months.map((_, i) => (<td key={i} className="p-2 border text-center">100%</td>))}
                <td className="p-2 border text-center font-semibold">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráficos (similar a Excel) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-3">
          <div className="font-semibold mb-2 text-sm">Seguimiento al Cumplimiento del Programa de Capacitaciones Vigencia</div>
          <LineChart labels={months} values={resumen.pctMes} meta={90} />
        </div>
        <div className="border p-3">
          <div className="font-semibold mb-2 text-sm">% Cumplimiento de Ejecución del Programa (Anual)</div>
          <BarChartTwo a={resumen.pctAnual} b={100} labelA="% Cumplimiento" labelB="% Meta" />
        </div>
      </div>
    </main>
  );
}

function LineChart({ labels = [], values = [], meta = 100, height = 220 }) {
  const width = 560;
  const padL = 40, padR = 16, padT = 14, padB = 26;
  const W = width, H = height;
  const xs = (i) => padL + (i * (W - padL - padR)) / Math.max(1, labels.length - 1);
  const maxY = 110; // escala hasta 110%
  const ys = (v) => padT + (H - padT - padB) * (1 - Math.min(maxY, Math.max(0, v)) / maxY);
  const pathSerie = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v || 0)}`).join(' ');
  const metaArr = labels.map(() => meta);
  const pathMeta = metaArr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      {/* Ejes */}
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#999" strokeWidth="1" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#999" strokeWidth="1" />
      {/* Grid */}
      {[25,50,75,100].map(g => (
        <line key={g} x1={padL} y1={ys(g)} x2={W - padR} y2={ys(g)} stroke="#f2f2f2" />
      ))}
      {/* Etiquetas X */}
      {labels.map((m, i) => (
        <text key={m} x={xs(i)} y={H - 6} fontSize="10" textAnchor="middle" fill="#444">{m.slice(0,3)}</text>
      ))}
      {/* Etiquetas Y */}
      {[0,50,100].map(v => (
        <text key={v} x={padL - 6} y={ys(v) + 3} fontSize="10" textAnchor="end" fill="#444">{v}%</text>
      ))}
      {/* Serie Meta (roja) */}
      <path d={pathMeta} fill="none" stroke="#d62728" strokeWidth="1.5" />
      {labels.map((_, i) => (
        <rect key={`m-${i}`} x={xs(i) - 3} y={ys(meta)} width="6" height="6" fill="#d62728" />
      ))}
      {/* Serie Cumplimiento (verde) */}
      <path d={pathSerie} fill="none" stroke="#2ca02c" strokeWidth="2" />
      {values.map((v, i) => (
        <circle key={`c-${i}`} cx={xs(i)} cy={ys(v)} r="2" fill="#2ca02c" />
      ))}
    </svg>
  );
}

function BarChartTwo({ a = 0, b = 100, labelA = 'A', labelB = 'B', height = 220 }) {
  const width = 560;
  const padL = 40, padR = 16, padT = 14, padB = 26;
  const W = width, H = height;
  const max = Math.max(a, b, 1);
  const y = (v) => padT + (H - padT - padB) * (1 - v / max);
  const barW = 80;
  const xA = padL + (W - padL - padR) * 0.33 - barW/2;
  const xB = padL + (W - padL - padR) * 0.66 - barW/2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#999" strokeWidth="1" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#999" strokeWidth="1" />
      {[0.25,0.5,0.75,1].map(fr => (
        <line key={fr} x1={padL} y1={y(max*fr)} x2={W - padR} y2={y(max*fr)} stroke="#f2f2f2" />
      ))}
      {/* Barras */}
      <rect x={xA} y={y(a)} width={barW} height={H - padB - y(a)} fill="#98df8a" stroke="#2ca02c" />
      <rect x={xB} y={y(b)} width={barW} height={H - padB - y(b)} fill="#ff9896" stroke="#d62728" strokeDasharray="4 2" />
      {/* Etiquetas */}
      <text x={xA + barW/2} y={H - 8} fontSize="12" textAnchor="middle">{labelA}</text>
      <text x={xB + barW/2} y={H - 8} fontSize="12" textAnchor="middle">{labelB}</text>
      <text x={xA + barW/2} y={y(a) - 6} fontSize="12" textAnchor="middle" fill="#333">{a}%</text>
      <text x={xB + barW/2} y={y(b) - 6} fontSize="12" textAnchor="middle" fill="#333">{b}%</text>
    </svg>
  );
}
