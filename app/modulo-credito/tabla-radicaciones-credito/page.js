"use client";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listRadicadosCredito, createRadicacion } from "@/app/services/modulo-credito/creditoService";

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

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    periodo: "",
    oficina_id: "",
    radicados_cantidad: "",
    radicados_valor: "",
    radicados_pct: "",
    aprobados_valor: "",
    aprobados_cantidad: "",
    aprobados_pct: "",
    negados_valor: "",
    negados_cantidad: "",
    negados_pct: "",
    aplazados_valor: "",
    aplazados_cantidad: "",
    aplazados_pct: "",
    sin_decision_valor: "",
    sin_decision_cantidad: "",
    sin_decision_pct: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listRadicadosCredito({ limit: 200 });
        setRows(Array.isArray(data) ? data : data?.items || []);
        setPage(1);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando radicaciones");
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
      (r.periodo || "").toLowerCase().includes(term)
    );
  }, [rows, search]);

  const dataToRender = filteredRows;
  const totalPages = Math.max(1, Math.ceil(dataToRender.length / pageSize));
  const paginatedRows = dataToRender.slice((page - 1) * pageSize, page * pageSize);
  const gotoPrev = () => setPage(p => Math.max(1, p - 1));
  const gotoNext = () => setPage(p => Math.min(totalPages, p + 1));

  const handleCreate = async () => {
    if (!form.periodo) {
      setError("Periodo es obligatorio (YYYY-MM)");
      return;
    }
    if (!form.oficina_id) {
      setError("Oficina es obligatoria");
      return;
    }
    if (!form.radicados_cantidad) {
      setError("Radicados cantidad es obligatorio");
      return;
    }
    setError("");
    setCreating(true);
    try {
      const num = v => (v === "" || v === null || v === undefined ? null : Number(v));
      await createRadicacion({
        periodo: form.periodo,
        oficina_id: form.oficina_id,
        radicados_cantidad: num(form.radicados_cantidad),
        radicados_valor: num(form.radicados_valor),
        radicados_pct: num(form.radicados_pct),
        aprobados_valor: num(form.aprobados_valor),
        aprobados_cantidad: num(form.aprobados_cantidad),
        aprobados_pct: num(form.aprobados_pct),
        negados_valor: num(form.negados_valor),
        negados_cantidad: num(form.negados_cantidad),
        negados_pct: num(form.negados_pct),
        aplazados_valor: num(form.aplazados_valor),
        aplazados_cantidad: num(form.aplazados_cantidad),
        aplazados_pct: num(form.aplazados_pct),
        sin_decision_valor: num(form.sin_decision_valor),
        sin_decision_cantidad: num(form.sin_decision_cantidad),
        sin_decision_pct: num(form.sin_decision_pct),
      });
      setForm({
        periodo: "",
        oficina_id: "",
        radicados_cantidad: "",
        radicados_valor: "",
        radicados_pct: "",
        aprobados_valor: "",
        aprobados_cantidad: "",
        aprobados_pct: "",
        negados_valor: "",
        negados_cantidad: "",
        negados_pct: "",
        aplazados_valor: "",
        aplazados_cantidad: "",
        aplazados_pct: "",
        sin_decision_valor: "",
        sin_decision_cantidad: "",
        sin_decision_pct: "",
      });
      // recarga lista
      const data = await listRadicadosCredito({ limit: 200 });
      setRows(Array.isArray(data) ? data : data?.items || []);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando radicación");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataToRender);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Radicaciones");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "radicaciones-credito.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Radicaciones de Crédito
      </h1>

      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por periodo (YYYY-MM)"
            className="border w-[260px] rounded px-3 py-2"
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
            disabled={!dataToRender.length}
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
          <label className="text-sm">Periodo (YYYY-MM)*</label>
          <input
            type="month"
            value={form.periodo}
            onChange={e => setForm(f => ({ ...f, periodo: e.target.value }))}
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
          <label className="text-sm">Radicados cantidad*</label>
          <input
            type="number"
            value={form.radicados_cantidad}
            onChange={e => setForm(f => ({ ...f, radicados_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Radicados valor</label>
          <input
            type="number"
            value={form.radicados_valor}
            onChange={e => setForm(f => ({ ...f, radicados_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Radicados %</label>
          <input
            type="number"
            value={form.radicados_pct}
            onChange={e => setForm(f => ({ ...f, radicados_pct: e.target.value }))}
            className="border rounded w-full px-2 py-1"
            step="0.01"
          />
        </div>
        <div>
          <label className="text-sm">Aprobados valor</label>
          <input
            type="number"
            value={form.aprobados_valor}
            onChange={e => setForm(f => ({ ...f, aprobados_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Aprobados cantidad</label>
          <input
            type="number"
            value={form.aprobados_cantidad}
            onChange={e => setForm(f => ({ ...f, aprobados_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Aprobados %</label>
          <input
            type="number"
            value={form.aprobados_pct}
            onChange={e => setForm(f => ({ ...f, aprobados_pct: e.target.value }))}
            className="border rounded w-full px-2 py-1"
            step="0.01"
          />
        </div>
        <div>
          <label className="text-sm">Negados valor</label>
          <input
            type="number"
            value={form.negados_valor}
            onChange={e => setForm(f => ({ ...f, negados_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Negados cantidad</label>
          <input
            type="number"
            value={form.negados_cantidad}
            onChange={e => setForm(f => ({ ...f, negados_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Negados %</label>
          <input
            type="number"
            value={form.negados_pct}
            onChange={e => setForm(f => ({ ...f, negados_pct: e.target.value }))}
            className="border rounded w-full px-2 py-1"
            step="0.01"
          />
        </div>
        <div>
          <label className="text-sm">Aplazados valor</label>
          <input
            type="number"
            value={form.aplazados_valor}
            onChange={e => setForm(f => ({ ...f, aplazados_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Aplazados cantidad</label>
          <input
            type="number"
            value={form.aplazados_cantidad}
            onChange={e => setForm(f => ({ ...f, aplazados_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Aplazados %</label>
          <input
            type="number"
            value={form.aplazados_pct}
            onChange={e => setForm(f => ({ ...f, aplazados_pct: e.target.value }))}
            className="border rounded w-full px-2 py-1"
            step="0.01"
          />
        </div>
        <div>
          <label className="text-sm">Sin decisión valor</label>
          <input
            type="number"
            value={form.sin_decision_valor}
            onChange={e => setForm(f => ({ ...f, sin_decision_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Sin decisión cantidad</label>
          <input
            type="number"
            value={form.sin_decision_cantidad}
            onChange={e => setForm(f => ({ ...f, sin_decision_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Sin decisión %</label>
          <input
            type="number"
            value={form.sin_decision_pct}
            onChange={e => setForm(f => ({ ...f, sin_decision_pct: e.target.value }))}
            className="border rounded w-full px-2 py-1"
            step="0.01"
          />
        </div>
        <div className="flex items-end">
          <button
            className="action-button px-3"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? "Guardando..." : "Agregar fila"}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 mb-3">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-gray-600">Cargando radicaciones...</div>
      ) : (
        <div className="overflow-auto max-w-full table-container h-[65vh]">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="tabla-header">
                <th className="p-4 border text-center whitespace-nowrap">
                  PERIODO
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  OFICINA_ID
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  RADICADOS_CANTIDAD
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  RADICADOS_%
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  APROBADOS_VALOR
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  APROBADOS_CANTIDAD
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  APROBADOS_%
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  NEGADOS_VALOR
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  NEGADOS_CANTIDAD
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  NEGADOS_%
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  APLAZADOS_VALOR
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  APLAZADOS_CANTIDAD
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  APLAZADOS_%
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  SIN DECISION_VALOR
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  SIN DECISION_CANTIDAD
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  SIN DECISION_%
                </th>
              </tr>
            </thead>

            <tbody className="tabla-cupos-content p-4">
              {paginatedRows.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {r.periodo || "-"}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {r.oficinaId || "-"}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatNumber(r.radicadosCantidad)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatPercent(r.radicadosPorcentaje)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatNumber(r.aprobadosValor)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatNumber(r.aprobadosCantidad)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatPercent(r.aprobadosPorcentaje)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatNumber(r.negadosValor)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatNumber(r.negadosCantidad)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatPercent(r.negadosPorcentaje)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatNumber(r.aplazadosValor)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatNumber(r.aplazadosCantidad)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatPercent(r.aplazadosPorcentaje)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatNumber(r.sinDecisionValor)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatNumber(r.sinDecisionCantidad)}
                  </td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {formatPercent(r.sinDecisionPorcentaje)}
                  </td>
                </tr>
              ))}
              {!dataToRender.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={15}>
                    No hay radicaciones para mostrar.
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
