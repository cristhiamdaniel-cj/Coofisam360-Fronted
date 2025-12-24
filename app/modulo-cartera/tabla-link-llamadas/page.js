"use client";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listLinkLlamadas, createLinkLlamada } from "@/app/services/modulo-cartera/linkLlamadasService";

const formatNumber = value => {
  const num = Number(value);
  if (!Number.isFinite(num)) return value || "-";
  return new Intl.NumberFormat("es-CO").format(num);
};

export default function LinkLlamadasTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    agencia: "",
    numero_credito_raw: "",
    numero_identificacion: "",
    nombre_asociado: "",
    linea_credito: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listLinkLlamadas({ limit: 2000 });
        const arr = Array.isArray(data) ? data : data?.items || [];
        setRows(arr);
        setFilteredRows(arr);
        setPage(1);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando link de llamadas");
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
    const filtered = rows.filter(r => {
      return (
        (r.numeroIdentificacion || "").toLowerCase().includes(query) ||
        (r.nombreAsociado || "").toLowerCase().includes(query) ||
        (r.usuarioGestor || "").toLowerCase().includes(query) ||
        (r.agencia || "").toLowerCase().includes(query) ||
        (r.numeroCredito || "").toLowerCase().includes(query) ||
        (r.lineaCredito || "").toLowerCase().includes(query)
      );
    });
    setFilteredRows(filtered);
    setPage(1);
  }, [search, rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const gotoPrev = () => setPage(p => Math.max(1, p - 1));
  const gotoNext = () => setPage(p => Math.min(totalPages, p + 1));

  const handleCreate = async () => {
    if (!form.agencia || !form.numero_credito_raw || !form.numero_identificacion || !form.nombre_asociado) {
      setError("Agencia, número crédito, número identificación y nombre son obligatorios");
      return;
    }
    setError("");
    setCreating(true);
    try {
      await createLinkLlamada(form);
      setForm({
        agencia: "",
        numero_credito_raw: "",
        numero_identificacion: "",
        nombre_asociado: "",
        linea_credito: "",
      });
      const data = await listLinkLlamadas({ limit: 2000 });
      const arr = Array.isArray(data) ? data : data?.items || [];
      setRows(arr);
      setFilteredRows(arr);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando link de llamada");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LinkLlamadas");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "link-llamadas.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Link de llamadas
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cédula, nombre, gestor, crédito..."
            className="unified-input w-[320px]"
          />
          <button className="unified-button flex gap-2 items-center justify-center cursor-pointer">
            Buscar
            <IoSearch />
          </button>
        </div>
        <div className="flex gap-4">
          <button
            className="unified-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleDownload}
            disabled={!filteredRows.length}
          >
            Descargar
            <FiDownload />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <button
              className="unified-button px-3"
              onClick={gotoPrev}
              disabled={page === 1}
            >
              ◀
            </button>
            <span>
              Página {page} / {totalPages}
            </span>
            <button
              className="unified-button px-3"
              onClick={gotoNext}
              disabled={page === totalPages}
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-5 gap-3 bg-gray-50 p-3 rounded">
        <div>
          <label className="text-sm">Agencia*</label>
          <input
            type="text"
            value={form.agencia}
            onChange={e => setForm(f => ({ ...f, agencia: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Número de Crédito*</label>
          <input
            type="text"
            value={form.numero_credito_raw}
            onChange={e => setForm(f => ({ ...f, numero_credito_raw: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Número de Identificación*</label>
          <input
            type="text"
            value={form.numero_identificacion}
            onChange={e => setForm(f => ({ ...f, numero_identificacion: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Nombre Asociado*</label>
          <input
            type="text"
            value={form.nombre_asociado}
            onChange={e => setForm(f => ({ ...f, nombre_asociado: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Línea de Crédito</label>
          <input
            type="text"
            value={form.linea_credito}
            onChange={e => setForm(f => ({ ...f, linea_credito: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div className="col-span-5 flex items-center justify-end">
          <button className="unified-button px-4" onClick={handleCreate} disabled={creating}>
            {creating ? "Guardando..." : "Agregar fila"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="text-gray-600">Cargando registros...</div>
      ) : (
        <div className="overflow-auto max-w-full table-container h-[65vh]">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="tabla-header">
                <th className="p-4 border text-center whitespace-nowrap">
                  Agencia
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[220px]">
                  Usuario Gestor
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Número de Identificación
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[260px]">
                  Nombre Asociado
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[240px]">
                  Línea de Crédito
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Número de Crédito
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Saldo Capital
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Periodicidad Capital
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Días Mora
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Calificación Arrastre
                </th>
              </tr>
            </thead>

            <tbody className="tabla-cupos-content p-4">
              {paginatedRows.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {r.agencia}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {r.usuarioGestor || "-"}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {r.numeroIdentificacion}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {r.nombreAsociado}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {r.lineaCredito}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {r.numeroCredito}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {formatNumber(r.saldoCapital)}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {r.periodicidadCapital}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {formatNumber(r.diasMora)}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {r.calificacionArrastre || "-"}
                  </td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={10}>
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
