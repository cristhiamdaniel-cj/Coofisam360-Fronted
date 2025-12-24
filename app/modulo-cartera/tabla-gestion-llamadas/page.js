"use client";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listGestionLlamadas, createGestionLlamada } from "@/app/services/modulo-cartera/gestionLlamadasService";

const formatNumber = value => {
  const num = Number(value);
  if (!Number.isFinite(num)) return value || "-";
  return new Intl.NumberFormat("es-CO").format(num);
};

export default function GestionLlamadasTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    fecha_corte: "",
    oficina: "",
    gestor: "",
    llamadas_asignadas: "",
    obligaciones_al_dia_llamadas: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listGestionLlamadas({ limit: 1000 });
        const arr = Array.isArray(data) ? data : data?.items || [];
        setRows(arr);
        setFilteredRows(arr);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando gestiones de llamadas");
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
      return;
    }
    const filtered = rows.filter(r =>
      (r.mes || "").toLowerCase().includes(query) ||
      (r.oficina || "").toLowerCase().includes(query) ||
      String(r.llamadasAsignadas || "").toLowerCase().includes(query) ||
      String(r.obligacionesAlDiaLlamadas || "").toLowerCase().includes(query) ||
      (r.gestor || "").toLowerCase().includes(query)
    );
    setFilteredRows(filtered);
  }, [search, rows]);

  const handleCreate = async () => {
    if (!form.fecha_corte || !form.oficina || !form.gestor || !form.llamadas_asignadas || !form.obligaciones_al_dia_llamadas) {
      setError("Fecha corte, oficina, gestor, llamadas asignadas y obligaciones al día (llamadas) son obligatorios");
      return;
    }
    setError("");
    setCreating(true);
    try {
      await createGestionLlamada(form);
      setForm({
        fecha_corte: "",
        oficina: "",
        gestor: "",
        llamadas_asignadas: "",
        obligaciones_al_dia_llamadas: "",
      });
      const data = await listGestionLlamadas({ limit: 1000 });
      const arr = Array.isArray(data) ? data : data?.items || [];
      setRows(arr);
      setFilteredRows(arr);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando gestión de llamada");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GestionLlamadas");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "gestion-llamadas.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Gestión de llamadas
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por mes, oficina, gestor..."
            className="unified-input w-[300px]"
          />
          <button className="unified-button flex gap-2 items-center justify-center">
            Buscar
            <IoSearch />
          </button>
        </div>
        <div className="flex gap-4">
          <button
            className="unified-button flex gap-2 items-center justify-center"
            onClick={handleDownload}
            disabled={!filteredRows.length}
          >
            Descargar
            <FiDownload />
          </button>
        </div>
      </div>

      <div className="mb-4 bg-gray-50 p-3 rounded border">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Agregar fila</h2>
          <span className="text-sm text-gray-600">Campos obligatorios *</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
        <div>
          <label className="text-sm">Fecha corte*</label>
          <input
            type="date"
            value={form.fecha_corte}
            onChange={e => setForm(f => ({ ...f, fecha_corte: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Oficina*</label>
          <input
            type="text"
            value={form.oficina}
            onChange={e => setForm(f => ({ ...f, oficina: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Gestor*</label>
          <input
            type="text"
            value={form.gestor}
            onChange={e => setForm(f => ({ ...f, gestor: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Llamadas asignadas*</label>
          <input
            type="number"
            value={form.llamadas_asignadas}
            onChange={e => setForm(f => ({ ...f, llamadas_asignadas: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Obligaciones al día (llamadas)*</label>
          <input
            type="number"
            value={form.obligaciones_al_dia_llamadas}
            onChange={e => setForm(f => ({ ...f, obligaciones_al_dia_llamadas: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
          <div className="col-span-5 flex items-center justify-end">
          <button className="unified-button px-4" onClick={handleCreate} disabled={creating}>
            {creating ? "Guardando..." : "Agregar fila"}
          </button>
        </div>
      </div>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="text-gray-600">Cargando registros...</div>
      ) : (
        <div className="overflow-auto max-w-full table-container h-[65vh]">
          <table className="table-auto border-collapse w-full">
            <thead className="tabla-header">
              <tr>
                <th className="p-4 border text-center whitespace-nowrap">Mes</th>
                <th className="p-4 border text-center whitespace-nowrap">Año</th>
                <th className="p-4 border text-center whitespace-nowrap">COD_Oficina</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">Oficina</th>
                <th className="p-4 border text-center whitespace-nowrap">Llamadas Asignadas</th>
                <th className="p-4 border text-center whitespace-nowrap">Obligaciones al día (Llamadas)</th>
                <th className="p-4 border text-center whitespace-nowrap">Llamadas Asignadas al día</th>
                <th className="p-4 border text-center whitespace-nowrap">Gestiones Efectuadas Llamadas</th>
                <th className="p-4 border text-center whitespace-nowrap">% Cumplimiento Llamadas</th>
                <th className="p-4 border text-center whitespace-nowrap">Visitas Asignadas</th>
                <th className="p-4 border text-center whitespace-nowrap">Obligaciones al día (Visitas)</th>
                <th className="p-4 border text-center whitespace-nowrap">Visitas Asignadas al día</th>
                <th className="p-4 border text-center whitespace-nowrap">Gestiones Efectuadas Visitas</th>
                <th className="p-4 border text-center whitespace-nowrap">% Cumplimiento Visitas</th>
                <th className="p-4 border text-center whitespace-nowrap">Gestor</th>
                <th className="p-4 border text-center whitespace-nowrap">Fecha corte</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content p-4">
              {filteredRows.map(r => (
                <tr key={r.id}>
                  <td>{r.mes}</td>
                  <td>{r.año}</td>
                  <td>{r.codigoOficina}</td>
                  <td>{r.oficina}</td>
                  <td>{formatNumber(r.llamadasAsignadas)}</td>
                  <td>{formatNumber(r.obligacionesAlDiaLlamadas)}</td>
                  <td>{r.llamadasAsignadasAlDia || "-"}</td>
                  <td>{r.gestionesEfectuadasLlamadas || "-"}</td>
                  <td>{r.cumplimientoLlamadas || "-"}</td>
                  <td>{r.visitasAsignadas || "-"}</td>
                  <td>{r.obligacionesAlDiaVisitas || "-"}</td>
                  <td>{r.visitasAsignadasAlDia || "-"}</td>
                  <td>{r.gestionesEfectuadasVisitas || "-"}</td>
                  <td>{r.cumplimientoVisitas || "-"}</td>
                  <td>{r.gestor || "-"}</td>
                  <td>{r.fechaCorte || "-"}</td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={16}>
                    No hay registros para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
