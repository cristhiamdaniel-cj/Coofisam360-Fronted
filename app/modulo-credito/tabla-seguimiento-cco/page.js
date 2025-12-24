"use client";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listCampanias, createCampania } from "@/app/services/modulo-credito/campaniasService";

const formatNumber = value => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return new Intl.NumberFormat("es-CO").format(num);
};
const formatPercent = value => {
  if (value === null || value === undefined) return "-";
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return `${num.toFixed(2)}%`;
};

export default function SeguimientoCampanias() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    campana: "",
    oficina_id: "",
    anio: "",
    fecha_corte: "",
    valor_desembolsos: "",
    n_operaciones: "",
    recursos_programados: "",
    recursos_disponibles: "",
    pct_avance: "",
    estado: "",
    color_hex: "",
    gap_meta_valor: "",
    gap_meta_pct: "",
    codigo_op: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listCampanias({ limit: 500 });
        setRows(Array.isArray(data) ? data : data?.items || []);
        setPage(1);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando campañas");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(r =>
      (r.campana || "").toLowerCase().includes(term) ||
      (r.estado || "").toLowerCase().includes(term) ||
      String(r.oficinaId || "").toLowerCase().includes(term)
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const gotoPrev = () => setPage(p => Math.max(1, p - 1));
  const gotoNext = () => setPage(p => Math.min(totalPages, p + 1));

  const handleCreate = async () => {
    if (!form.campana || !form.oficina_id || !form.anio || !form.fecha_corte) {
      setError("Campaña, oficina, año y fecha corte son obligatorios");
      return;
    }
    setError("");
    setCreating(true);
    try {
      const num = v => (v === "" || v === null || v === undefined ? null : Number(v));
      await createCampania({
        campana: form.campana,
        oficina_id: form.oficina_id,
        anio: num(form.anio),
        fecha_corte: form.fecha_corte,
        valor_desembolsos: num(form.valor_desembolsos),
        n_operaciones: num(form.n_operaciones),
        recursos_programados: num(form.recursos_programados),
        recursos_disponibles: num(form.recursos_disponibles),
        pct_avance: num(form.pct_avance),
        estado: form.estado,
        color_hex: form.color_hex,
        gap_meta_valor: num(form.gap_meta_valor),
        gap_meta_pct: num(form.gap_meta_pct),
        codigo_op: form.codigo_op,
      });
      setForm({
        campana: "",
        oficina_id: "",
        anio: "",
        fecha_corte: "",
        valor_desembolsos: "",
        n_operaciones: "",
        recursos_programados: "",
        recursos_disponibles: "",
        pct_avance: "",
        estado: "",
        color_hex: "",
        gap_meta_valor: "",
        gap_meta_pct: "",
        codigo_op: "",
      });
      const data = await listCampanias({ limit: 500 });
      setRows(Array.isArray(data) ? data : data?.items || []);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando campaña");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campanias");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "campanias-credito.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Seguimiento de campañas de crédito
      </h1>

      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por campaña, oficina o estado"
            className="border w-[320px] rounded px-3 py-2"
          />
          <button
            type="button"
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={() => setSearch(search.trim())}
          >
            Buscar
            <IoSearch />
          </button>
        </div>
        <div className="flex gap-4">
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleDownload}
            disabled={!filteredRows.length}
          >
            Descargar
            <FiDownload />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <button className="action-button px-3" onClick={gotoPrev} disabled={page === 1}>
              ◀
            </button>
            <span>
              Página {page} / {totalPages}
            </span>
            <button
              className="action-button px-3"
              onClick={gotoNext}
              disabled={page === totalPages}
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-3 bg-gray-50 p-3 rounded">
        <div>
          <label className="text-sm">Campaña*</label>
          <input
            type="text"
            value={form.campana}
            onChange={e => setForm(f => ({ ...f, campana: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Oficina ID*</label>
          <input
            type="number"
            value={form.oficina_id}
            onChange={e => setForm(f => ({ ...f, oficina_id: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Año*</label>
          <input
            type="number"
            value={form.anio}
            onChange={e => setForm(f => ({ ...f, anio: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Fecha corte*</label>
          <input
            type="date"
            value={form.fecha_corte}
            onChange={e => setForm(f => ({ ...f, fecha_corte: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Valor desembolsos</label>
          <input
            type="number"
            value={form.valor_desembolsos}
            onChange={e => setForm(f => ({ ...f, valor_desembolsos: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">N. operaciones</label>
          <input
            type="number"
            value={form.n_operaciones}
            onChange={e => setForm(f => ({ ...f, n_operaciones: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Recursos programados</label>
          <input
            type="number"
            value={form.recursos_programados}
            onChange={e => setForm(f => ({ ...f, recursos_programados: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Recursos disponibles</label>
          <input
            type="number"
            value={form.recursos_disponibles}
            onChange={e => setForm(f => ({ ...f, recursos_disponibles: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">% Avance</label>
          <input
            type="number"
            step="0.01"
            value={form.pct_avance}
            onChange={e => setForm(f => ({ ...f, pct_avance: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Estado</label>
          <input
            type="text"
            value={form.estado}
            onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Color hex</label>
          <input
            type="text"
            value={form.color_hex}
            onChange={e => setForm(f => ({ ...f, color_hex: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Gap meta valor</label>
          <input
            type="number"
            value={form.gap_meta_valor}
            onChange={e => setForm(f => ({ ...f, gap_meta_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Gap meta %</label>
          <input
            type="number"
            step="0.01"
            value={form.gap_meta_pct}
            onChange={e => setForm(f => ({ ...f, gap_meta_pct: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Código OP</label>
          <input
            type="text"
            value={form.codigo_op}
            onChange={e => setForm(f => ({ ...f, codigo_op: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div className="col-span-4 flex items-center justify-end">
          <button className="action-button px-3" onClick={handleCreate} disabled={creating}>
            {creating ? "Guardando..." : "Agregar fila"}
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-3 bg-gray-50 p-3 rounded">
        <div>
          <label className="text-sm">Campaña*</label>
          <input
            type="text"
            value={form.campana}
            onChange={e => setForm(f => ({ ...f, campana: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Oficina ID*</label>
          <input
            type="number"
            value={form.oficina_id}
            onChange={e => setForm(f => ({ ...f, oficina_id: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Año*</label>
          <input
            type="number"
            value={form.anio}
            onChange={e => setForm(f => ({ ...f, anio: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Fecha corte*</label>
          <input
            type="date"
            value={form.fecha_corte}
            onChange={e => setForm(f => ({ ...f, fecha_corte: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div className="flex items-end">
          <button className="action-button px-3" onClick={handleCreate} disabled={creating}>
            {creating ? "Guardando..." : "Agregar fila"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="text-gray-600">Cargando campañas...</div>
      ) : (
        <div className="overflow-auto max-w-full table-container h-[65vh]">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="tabla-header">
                <th className="p-4 border text-center whitespace-nowrap">CAMPANA</th>
                <th className="p-4 border text-center whitespace-nowrap">OFICINA_ID</th>
                <th className="p-4 border text-center whitespace-nowrap">AÑO</th>
                <th className="p-4 border text-center whitespace-nowrap">VALOR_DESEMBOLSOS</th>
                <th className="p-4 border text-center whitespace-nowrap">N_OPERACIONES</th>
                <th className="p-4 border text-center whitespace-nowrap">RECURSOS_PROGRAMADOS</th>
                <th className="p-4 border text-center whitespace-nowrap">RECURSOS_DISPONIBLES</th>
                <th className="p-4 border text-center whitespace-nowrap">% AVANCE</th>
                <th className="p-4 border text-center whitespace-nowrap">ESTADO</th>
                <th className="p-4 border text-center whitespace-nowrap">GAP_META_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">GAP_META_%</th>
                <th className="p-4 border text-center whitespace-nowrap">FECHA_CORTE</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content p-4">
              {paginatedRows.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-left whitespace-nowrap">{r.campana || "-"}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{r.oficinaId || "-"}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{r.anio || "-"}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.valorDesembolsos)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.nOperaciones)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.recursosProgramados)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.recursosDisponibles)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatPercent(r.pctAvance)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{r.estado || "-"}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.gapMetaValor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatPercent(r.gapMetaPct)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{r.fechaCorte || "-"}</td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={12}>
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
