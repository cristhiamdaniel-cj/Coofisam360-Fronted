"use client";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listCampaniasOficina, createCampaniaOficina } from "@/app/services/modulo-credito/campaniasOficinaService";

const formatNumber = value => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return new Intl.NumberFormat("es-CO").format(num);
};

export default function SeguimientoCampaniasOficina() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    campana: "",
    campana_label: "",
    segmento: "",
    oficina_id: "",
    anio: "",
    fecha_corte: "",
    total_valor: "",
    total_cantidad: "",
    cch_valor: "",
    cch_cantidad: "",
    c_viv_valor: "",
    c_viv_cantidad: "",
    c_tc_valor: "",
    c_tc_cantidad: "",
    c_libcigg_valor: "",
    c_libcigg_cantidad: "",
    c_monto_valor: "",
    c_monto_cantidad: "",
    c_ccart_valor: "",
    c_ccart_cantidad: "",
    fng_emp255_valor: "",
    fng_emp255_cantidad: "",
    fng_emp285_valor: "",
    fng_emp285_cantidad: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listCampaniasOficina({ limit: 500 });
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
      String(r.oficinaId || "").toLowerCase().includes(term) ||
      (r.segmento || "").toLowerCase().includes(term)
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
      await createCampaniaOficina({
        campana: form.campana,
        campana_label: form.campana_label,
        segmento: form.segmento,
        oficina_id: form.oficina_id,
        anio: num(form.anio),
        fecha_corte: form.fecha_corte,
        total_valor: num(form.total_valor),
        total_cantidad: num(form.total_cantidad),
        cch_valor: num(form.cch_valor),
        cch_cantidad: num(form.cch_cantidad),
        c_viv_valor: num(form.c_viv_valor),
        c_viv_cantidad: num(form.c_viv_cantidad),
        c_tc_valor: num(form.c_tc_valor),
        c_tc_cantidad: num(form.c_tc_cantidad),
        c_libcigg_valor: num(form.c_libcigg_valor),
        c_libcigg_cantidad: num(form.c_libcigg_cantidad),
        c_monto_valor: num(form.c_monto_valor),
        c_monto_cantidad: num(form.c_monto_cantidad),
        c_ccart_valor: num(form.c_ccart_valor),
        c_ccart_cantidad: num(form.c_ccart_cantidad),
        fng_emp255_valor: num(form.fng_emp255_valor),
        fng_emp255_cantidad: num(form.fng_emp255_cantidad),
        fng_emp285_valor: num(form.fng_emp285_valor),
        fng_emp285_cantidad: num(form.fng_emp285_cantidad),
      });
      setForm({
        campana: "",
        campana_label: "",
        segmento: "",
        oficina_id: "",
        anio: "",
        fecha_corte: "",
        total_valor: "",
        total_cantidad: "",
        cch_valor: "",
        cch_cantidad: "",
        c_viv_valor: "",
        c_viv_cantidad: "",
        c_tc_valor: "",
        c_tc_cantidad: "",
        c_libcigg_valor: "",
        c_libcigg_cantidad: "",
        c_monto_valor: "",
        c_monto_cantidad: "",
        c_ccart_valor: "",
        c_ccart_cantidad: "",
        fng_emp255_valor: "",
        fng_emp255_cantidad: "",
        fng_emp285_valor: "",
        fng_emp285_cantidad: "",
      });
      const data = await listCampaniasOficina({ limit: 500 });
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "CampaniasOficina");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "campanias-oficina.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Seguimiento de campañas de crédito x oficinas
      </h1>

      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por campaña, oficina o segmento"
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
          <label className="text-sm">Campaña label</label>
          <input
            type="text"
            value={form.campana_label}
            onChange={e => setForm(f => ({ ...f, campana_label: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Segmento</label>
          <input
            type="text"
            value={form.segmento}
            onChange={e => setForm(f => ({ ...f, segmento: e.target.value }))}
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
          <label className="text-sm">Total valor</label>
          <input
            type="number"
            value={form.total_valor}
            onChange={e => setForm(f => ({ ...f, total_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Total cantidad</label>
          <input
            type="number"
            value={form.total_cantidad}
            onChange={e => setForm(f => ({ ...f, total_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">CCH valor</label>
          <input
            type="number"
            value={form.cch_valor}
            onChange={e => setForm(f => ({ ...f, cch_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">CCH cantidad</label>
          <input
            type="number"
            value={form.cch_cantidad}
            onChange={e => setForm(f => ({ ...f, cch_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_VIV valor</label>
          <input
            type="number"
            value={form.c_viv_valor}
            onChange={e => setForm(f => ({ ...f, c_viv_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_VIV cantidad</label>
          <input
            type="number"
            value={form.c_viv_cantidad}
            onChange={e => setForm(f => ({ ...f, c_viv_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_TC valor</label>
          <input
            type="number"
            value={form.c_tc_valor}
            onChange={e => setForm(f => ({ ...f, c_tc_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_TC cantidad</label>
          <input
            type="number"
            value={form.c_tc_cantidad}
            onChange={e => setForm(f => ({ ...f, c_tc_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_LIBCIGG valor</label>
          <input
            type="number"
            value={form.c_libcigg_valor}
            onChange={e => setForm(f => ({ ...f, c_libcigg_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_LIBCIGG cantidad</label>
          <input
            type="number"
            value={form.c_libcigg_cantidad}
            onChange={e => setForm(f => ({ ...f, c_libcigg_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_MONTO valor</label>
          <input
            type="number"
            value={form.c_monto_valor}
            onChange={e => setForm(f => ({ ...f, c_monto_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_MONTO cantidad</label>
          <input
            type="number"
            value={form.c_monto_cantidad}
            onChange={e => setForm(f => ({ ...f, c_monto_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_CCART valor</label>
          <input
            type="number"
            value={form.c_ccart_valor}
            onChange={e => setForm(f => ({ ...f, c_ccart_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">C_CCART cantidad</label>
          <input
            type="number"
            value={form.c_ccart_cantidad}
            onChange={e => setForm(f => ({ ...f, c_ccart_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">FNG_EMP255 valor</label>
          <input
            type="number"
            value={form.fng_emp255_valor}
            onChange={e => setForm(f => ({ ...f, fng_emp255_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">FNG_EMP255 cantidad</label>
          <input
            type="number"
            value={form.fng_emp255_cantidad}
            onChange={e => setForm(f => ({ ...f, fng_emp255_cantidad: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">FNG_EMP285 valor</label>
          <input
            type="number"
            value={form.fng_emp285_valor}
            onChange={e => setForm(f => ({ ...f, fng_emp285_valor: e.target.value }))}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">FNG_EMP285 cantidad</label>
          <input
            type="number"
            value={form.fng_emp285_cantidad}
            onChange={e => setForm(f => ({ ...f, fng_emp285_cantidad: e.target.value }))}
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
                <th className="p-4 border text-center whitespace-nowrap">AÑO</th>
                <th className="p-4 border text-center whitespace-nowrap">OFICINA_ID</th>
                <th className="p-4 border text-center whitespace-nowrap">SEGMENTO</th>
                <th className="p-4 border text-center whitespace-nowrap">TOTAL_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">TOTAL_CANTIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">CCH_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">CCH_CANTIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">C_VIV_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">C_VIV_CANTIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">C_TC_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">C_TC_CANTIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">C_LIBCIGG_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">C_LIBCIGG_CANTIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">C_MONTO_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">C_MONTO_CANTIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">C_CCART_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">C_CCART_CANTIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">FNG_EMP255_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">FNG_EMP255_CANTIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">FNG_EMP285_VALOR</th>
                <th className="p-4 border text-center whitespace-nowrap">FNG_EMP285_CANTIDAD</th>
                <th className="p-4 border text-center whitespace-nowrap">FECHA_CORTE</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content p-4">
              {paginatedRows.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-left whitespace-nowrap">{r.campana || "-"}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{r.anio || "-"}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{r.oficinaId || "-"}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{r.segmento || "-"}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.totalValor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.totalCantidad)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cchValor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cchCantidad)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cVivValor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cVivCantidad)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cTcValor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cTcCantidad)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cLibciggValor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cLibciggCantidad)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cMontoValor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cMontoCantidad)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cCcartValor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.cCcartCantidad)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.fngEmp255Valor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.fngEmp255Cantidad)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.fngEmp285Valor)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">{formatNumber(r.fngEmp285Cantidad)}</td>
                  <td className="p-2 border text-left whitespace-nowrap">
                    {r.fechaCorte || "-"}
                  </td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={22}>
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
