"use client";
import { useEffect, useMemo, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaArrowDownWideShort } from "react-icons/fa6";
import {
  listPlanTrabajoRows,
  savePlanTrabajoRow,
} from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/planTrabajoQuota";

// Construye una fila agregada de 12 meses x (P,E) desde registros mensuales
function buildGrid(items = []) {
  const byKey = new Map();
  for (const r of items) {
    const anio = Number(r.anio) || new Date().getFullYear();
    // Clave estable solo por anio+ciclo+actividad para evitar duplicar filas por cambios menores en responsable/recursos
    const key = `${anio}|${r.ciclo || ""}|${r.actividad || ""}`;
    if (!byKey.has(key)) {
      const base = {
        anio,
        ciclo: r.ciclo || "",
        actividad: r.actividad || "",
        // Guardar originales para poder usar where_* si cambian
        origCiclo: r.ciclo || "",
        origActividad: r.actividad || "",
        responsable: r.responsable || "",
        recurso1: r.recursoAdministrativo ? "SI" : "NO",
        recurso2: r.recursoFinanciero ? "SI" : "NO",
        exists: Array(12).fill(false),
      };
      for (let i = 0; i < 24; i++) base[`col${i}`] = false;
      // mantén copia de origen para detectar cambios
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
  return Array.from(byKey.values());
}

export default function GestionesTable() {
  const [actividades, setActividades] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editedRows, setEditedRows] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info");

  useEffect(() => {
    async function load() {
      try {
        const data = await listPlanTrabajoRows({
          anio: selectedYear,
          limit: 1000,
        });
        setActividades(buildGrid(data));
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
    setEditedRows(prev => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const idxs = Object.keys(editedRows).map(k => Number(k));
      let ok = 0,
        fail = 0;
      for (const i of idxs) {
        const r = actividades[i];
        // Validar PK mínima a nivel de fila
        if (!r || !r.ciclo || !r.actividad) {
          continue; // saltar filas incompletas
        }
        for (let m = 1; m <= 12; m++) {
          const pBool = !!r[`col${2 * (m - 1)}`];
          const eBool = !!r[`col${2 * (m - 1) + 1}`];
          const p = pBool ? 1 : 0;
          const e = eBool ? 1 : 0;
          const exists = !!(r.exists && r.exists[m - 1]);
          const changed =
            !r._orig ||
            r._orig[2 * (m - 1)] !== pBool ||
            r._orig[2 * (m - 1) + 1] !== eBool;
          if (!exists && !p && !e) continue; // no crear registros vacíos
          if (exists && !changed) continue; // no actualizar si no cambió
          const body = {
            isNew: !exists,
            anio: selectedYear,
            mes: m,
            ciclo: r.ciclo || "",
            actividad: r.actividad || "",
            planeado: p,
            ejecutado: e,
            responsable: r.responsable || "",
            recurso_administrativo: (r.recurso1 || "NO") === "SI",
            recurso_financiero: (r.recurso2 || "NO") === "SI",
            total_actividades: 0,
            actividades_programadas_mes: p,
          };
          // Para evitar 404 por diferencias sutiles (espacios, mayúsculas),
          // si el mes existe mandamos siempre where_* con los valores originales
          if (exists) {
            body.where_anio = selectedYear;
            body.where_mes = m;
            body.where_ciclo = r.origCiclo || "";
            body.where_actividad = r.origActividad || "";
          }
          try {
            await savePlanTrabajoRow(body);
            ok++;
          } catch (err) {
            console.error(err);
            fail++;
          }
        }
      }
      setEditedRows({});
      const fresh = await listPlanTrabajoRows({
        anio: selectedYear,
        limit: 1000,
      });
      setActividades(buildGrid(fresh));
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "PlanTrabajo");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "plan_trabajo.xlsx");
  };

  const handleAddRow = () => {
    const newRow = {
      anio: selectedYear,
      ciclo: "",
      actividad: "",
      responsable: "",
      recurso1: "SI",
      recurso2: "NO",
      exists: Array(12).fill(false),
      isNew: true,
    };
    for (let i = 0; i < 24; i++) newRow[`col${i}`] = false;
    setActividades(prev => [newRow, ...prev]);
    setEditedRows(prev => ({ ...prev, 0: { ...newRow } }));
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Plan de Trabajo Anual
      </h1>
      {statusMsg && (
        <div
          className={`mb-2 text-sm ${
            statusType === "error"
              ? "text-red-600"
              : statusType === "success"
              ? "text-green-700"
              : "text-slate-600"
          }`}
        >
          {statusMsg}
        </div>
      )}
      <div className="actions-container flex justify-end mb-4">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm">Año:</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="border rounded p-1"
            >
              {Array.from({ length: 7 }).map((_, i) => {
                const y = new Date().getFullYear() - 3 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="action-button flex gap-2 items-center justify-center cursor-pointer"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
              <FaRegSave />
            </button>
          )}
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleDownload}
          >
            Descargar <FiDownload />
          </button>
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleAddRow}
          >
            Añadir fila <FaArrowDownWideShort />
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-plan-trabajo-header">
            <tr>
              <th
                rowSpan="3"
                className="p-4 border text-center bg-white z-20 min-w-[150px]"
              >
                Ciclo
              </th>
              <th
                rowSpan="3"
                className="p-4 border text-center bg-white z-20 min-w-[300px]"
              >
                Actividad
              </th>
              <th colSpan="24" className="border text-center p-2 bg-white z-20">
                CRONOGRAMA VIGENCIA
              </th>
              <th rowSpan="3" className="p-4 border text-center bg-white z-20">
                Responsable(s)
              </th>
              <th
                colSpan="2"
                className="p-4 border text-center min-w-[300px] bg-white z-20"
              >
                Recursos
              </th>
            </tr>
            <tr>
              {[
                "ENERO",
                "FEBRERO",
                "MARZO",
                "ABRIL",
                "MAYO",
                "JUNIO",
                "JULIO",
                "AGOSTO",
                "SEPTIEMBRE",
                "OCTUBRE",
                "NOVIEMBRE",
                "DICIEMBRE",
              ].map(m => (
                <th
                  colSpan="2"
                  className="border text-center p-2 text-[10px] min-w-[80px] text-white  bg-white z-20"
                  key={m}
                >
                  {m}
                </th>
              ))}
              <th
                rowSpan="2"
                colSpan="1"
                className="border text-center p-2 min-w-[150px] bg-white text-white z-20"
              >
                admin
              </th>
              <th
                rowSpan="2"
                colSpan="1"
                className="border text-center p-2 min-w-[150px] bg-white text-white z-20"
              >
                finan
              </th>
            </tr>
            <tr>
              {Array.from({ length: 12 }).map((_, i) => (
                <>
                  <th
                    key={`p-${i}`}
                    className="border text-center p-2 bg-white z-20 text-white"
                  >
                    P
                  </th>
                  <th
                    key={`e-${i}`}
                    className="border text-center p-2 bg-white z-20 text-white"
                  >
                    E
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody className="tabla-cupos-content">
            {actividades.map((actividad, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-center min-w-[150px]">
                  <select
                    value={actividad.ciclo || ""}
                    onChange={e => handleChange(idx, "ciclo", e.target.value)}
                    className="px-2 py-1 w-full border"
                  >
                    <option value="">Seleccionar ciclo</option>
                    <option value="I Planear">I Planear</option>
                    <option value="P">P</option>
                    <option value="II Hacer">II Hacer</option>
                    <option value="H">H</option>
                    <option value="III Verificar">III Verificar</option>
                    <option value="V">V</option>
                    <option value="IV Actuar">IV Actuar</option>
                    <option value="A">A</option>
                  </select>
                </td>
                <td className="p-2 border text-left min-w-[300px]">
                  <input
                    type="text"
                    value={actividad.actividad || actividad.nombre || ""}
                    onChange={e =>
                      handleChange(idx, "actividad", e.target.value)
                    }
                    placeholder="Nueva actividad"
                    className="px-2 py-1 w-full border"
                  />
                </td>
                {Array.from({ length: 24 }).map((_, i) => (
                  <td key={i} className="p-2 border text-center max-w-[40px]">
                    <input
                      type="checkbox"
                      checked={!!actividad[`col${i}`]}
                      onChange={e =>
                        handleChange(idx, `col${i}`, e.target.checked)
                      }
                      className="mx-auto"
                    />
                  </td>
                ))}
                <td className="p-2 border text-center">
                  <select
                    value={actividad.responsable || ""}
                    onChange={e =>
                      handleChange(idx, "responsable", e.target.value)
                    }
                    className="w-full border px-1 py-1"
                  >
                    {[
                      "Comité de Convivencia Laboral",
                      "Comité de COPASST",
                      "Auxiliar SST",
                      "ARL",
                      "Coordinador Talento y Cultura",
                      "Subgerencia de Innovación Empresarial",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={actividad.recurso1 || "SI"}
                    onChange={e =>
                      handleChange(idx, "recurso1", e.target.value)
                    }
                    className="border rounded text-center p-1 w-full"
                  >
                    {["SI", "NO"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={actividad.recurso2 || "NO"}
                    onChange={e =>
                      handleChange(idx, "recurso2", e.target.value)
                    }
                    className="border rounded text-center p-1 w-full"
                  >
                    {["SI", "NO"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen mensual y cumplimiento anual */}
      <SummaryPanel actividades={actividades} />
    </main>
  );
}

function SummaryPanel({ actividades = [] }) {
  const months = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];

  const resumen = useMemo(() => {
    const planeadoMes = Array(12).fill(0);
    const ejecutadoMes = Array(12).fill(0);
    for (const r of actividades) {
      for (let m = 1; m <= 12; m++) {
        const p = r[`col${2 * (m - 1)}`] ? 1 : 0;
        const e = r[`col${2 * (m - 1) + 1}`] ? 1 : 0;
        planeadoMes[m - 1] += p;
        ejecutadoMes[m - 1] += e;
      }
    }
    const pctMes = planeadoMes.map((p, i) => {
      const e = ejecutadoMes[i];
      if (!p) return 0;
      return Math.round((e * 100) / p);
    });
    const totalPlaneado = planeadoMes.reduce((a, b) => a + b, 0);
    const totalEjecutado = ejecutadoMes.reduce((a, b) => a + b, 0);
    const pctAnual = totalPlaneado
      ? Math.round((totalEjecutado * 100) / totalPlaneado)
      : 0;
    return {
      planeadoMes,
      ejecutadoMes,
      pctMes,
      totalPlaneado,
      totalEjecutado,
      pctAnual,
    };
  }, [actividades]);

  return (
    <div className="mt-8">
      <div className="overflow-auto">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th className="p-3 border text-left whitespace-nowrap">
                1. CUMPLIMIENTO DEL PROGRAMA
              </th>
              {months.map(m => (
                <th
                  key={m}
                  className="p-3 border text-center whitespace-nowrap text-xs"
                >
                  {m.substring(0, 3)}
                </th>
              ))}
              <th className="p-3 border text-center whitespace-nowrap">
                CUMPLIMIENTO ANUAL
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border text-left whitespace-nowrap">
                Actividades Programadas en el Mes
              </td>
              {resumen.planeadoMes.map((v, i) => (
                <td key={i} className="p-2 border text-center">
                  {v}
                </td>
              ))}
              <td className="p-2 border text-center font-semibold">
                {resumen.totalPlaneado}
              </td>
            </tr>
            <tr>
              <td className="p-2 border text-left whitespace-nowrap">
                Actividades Ejecutadas en el Mes
              </td>
              {resumen.ejecutadoMes.map((v, i) => (
                <td key={i} className="p-2 border text-center">
                  {v}
                </td>
              ))}
              <td className="p-2 border text-center font-semibold">
                {resumen.totalEjecutado}
              </td>
            </tr>
            <tr>
              <td className="p-2 border text-left whitespace-nowrap">
                % Ejecución Mensual del Programa
              </td>
              {resumen.pctMes.map((v, i) => (
                <td key={i} className="p-2 border text-center">
                  {v}%
                </td>
              ))}
              <td className="p-2 border text-center font-semibold">
                {resumen.pctAnual}%
              </td>
            </tr>
            <tr>
              <td className="p-2 border text-left whitespace-nowrap">
                % Cumplimiento Meta en el Mes
              </td>
              {months.map((_, i) => (
                <td key={i} className="p-2 border text-center">
                  100%
                </td>
              ))}
              <td className="p-2 border text-center font-semibold">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bloque de totales anual programado/ejecutado */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border p-4">
          <div className="text-sm text-slate-600">Programado (anual)</div>
          <div className="text-3xl font-semibold">{resumen.totalPlaneado}</div>
        </div>
        <div className="border p-4">
          <div className="text-sm text-slate-600">Ejecutado (anual)</div>
          <div className="text-3xl font-semibold">{resumen.totalEjecutado}</div>
        </div>
        <div className="border p-4">
          <div className="text-sm text-slate-600">Cumplimiento anual</div>
          <div className="text-3xl font-semibold">{resumen.pctAnual}%</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-3">
          <div className="font-semibold mb-2 text-sm">
            Seguimiento al Cumplimiento del plan de Trabajo del SGSST Vigencia
          </div>
          <LineChart labels={months} values={resumen.pctMes} />
        </div>
        <div className="border p-3">
          <div className="font-semibold mb-2 text-sm">
            Programado vs Ejecutado (anual)
          </div>
          <BarChartTwo
            a={resumen.totalEjecutado}
            b={resumen.totalPlaneado}
            labelA="Ejecutado"
            labelB="Programado"
          />
        </div>
      </div>
    </div>
  );
}

function LineChart({ labels = [], values = [], height = 220 }) {
  const width = 560;
  const padL = 40,
    padR = 16,
    padT = 14,
    padB = 26;
  const W = width,
    H = height;
  const xs = i =>
    padL + (i * (W - padL - padR)) / Math.max(1, labels.length - 1);
  const maxY = 110; // escala a 0..110%
  const ys = v =>
    padT + (H - padT - padB) * (1 - Math.min(maxY, Math.max(0, v)) / maxY);
  const pathD = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${ys(v || 0)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      {/* Ejes */}
      <line
        x1={padL}
        y1={H - padB}
        x2={W - padR}
        y2={H - padB}
        stroke="#999"
        strokeWidth="1"
      />
      <line
        x1={padL}
        y1={padT}
        x2={padL}
        y2={H - padB}
        stroke="#999"
        strokeWidth="1"
      />
      {/* Línea 100% */}
      <line
        x1={padL}
        y1={ys(100)}
        x2={W - padR}
        y2={ys(100)}
        stroke="#ddd"
        strokeDasharray="4 4"
      />
      {/* Grid ligera */}
      {[25, 50, 75].map(g => (
        <line
          key={g}
          x1={padL}
          y1={ys(g)}
          x2={W - padR}
          y2={ys(g)}
          stroke="#f2f2f2"
        />
      ))}
      {/* Etiquetas X */}
      {labels.map((m, i) => (
        <text
          key={m}
          x={xs(i)}
          y={H - 6}
          fontSize="10"
          textAnchor="middle"
          fill="#444"
        >
          {m.slice(0, 3)}
        </text>
      ))}
      {/* Etiquetas Y 0/50/100 */}
      {[0, 50, 100].map(v => (
        <text
          key={v}
          x={padL - 6}
          y={ys(v) + 3}
          fontSize="10"
          textAnchor="end"
          fill="#444"
        >
          {v}%
        </text>
      ))}
      {/* Serie */}
      <path d={pathD} fill="none" stroke="#2ca02c" strokeWidth="2" />
      {values.map((v, i) => (
        <g key={i}>
          <rect
            x={xs(i) - 3}
            y={ys(v) - 3}
            width="6"
            height="6"
            fill="#d62728"
          />
          <circle cx={xs(i)} cy={ys(v)} r="2" fill="#2ca02c" />
        </g>
      ))}
    </svg>
  );
}

function BarChartTwo({
  a = 0,
  b = 0,
  labelA = "A",
  labelB = "B",
  height = 220,
}) {
  const width = 560;
  const padL = 40,
    padR = 16,
    padT = 14,
    padB = 26;
  const W = width,
    H = height;
  const max = Math.max(a, b, 1);
  const y = v => padT + (H - padT - padB) * (1 - v / max);
  const barW = 80;
  const xA = padL + (W - padL - padR) * 0.33 - barW / 2;
  const xB = padL + (W - padL - padR) * 0.66 - barW / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      <line
        x1={padL}
        y1={H - padB}
        x2={W - padR}
        y2={H - padB}
        stroke="#999"
        strokeWidth="1"
      />
      <line
        x1={padL}
        y1={padT}
        x2={padL}
        y2={H - padB}
        stroke="#999"
        strokeWidth="1"
      />
      {[0.25, 0.5, 0.75, 1].map(fr => (
        <line
          key={fr}
          x1={padL}
          y1={y(max * fr)}
          x2={W - padR}
          y2={y(max * fr)}
          stroke="#f2f2f2"
        />
      ))}
      {/* Barras */}
      <rect
        x={xA}
        y={y(a)}
        width={barW}
        height={H - padB - y(a)}
        fill="#1f77b4"
        opacity="0.8"
      />
      <rect
        x={xB}
        y={y(b)}
        width={barW}
        height={H - padB - y(b)}
        fill="#ff9896"
        stroke="#d62728"
        strokeDasharray="4 2"
        opacity="0.7"
      />
      {/* Etiquetas */}
      <text x={xA + barW / 2} y={H - 8} fontSize="12" textAnchor="middle">
        {labelA}
      </text>
      <text x={xB + barW / 2} y={H - 8} fontSize="12" textAnchor="middle">
        {labelB}
      </text>
      <text
        x={xA + barW / 2}
        y={y(a) - 6}
        fontSize="12"
        textAnchor="middle"
        fill="#333"
      >
        {a}
      </text>
      <text
        x={xB + barW / 2}
        y={y(b) - 6}
        fontSize="12"
        textAnchor="middle"
        fill="#333"
      >
        {b}
      </text>
    </svg>
  );
}
