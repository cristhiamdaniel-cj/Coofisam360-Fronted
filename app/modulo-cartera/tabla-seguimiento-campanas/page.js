"use client";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listSeguimientoCampanas, createSeguimientoCampana } from "@/app/services/modulo-cartera/seguimientoCampanasService";

const formatNumber = value => {
  const num = Number(value);
  if (!Number.isFinite(num)) return value || "-";
  return new Intl.NumberFormat("es-CO").format(num);
};

export default function SeguimientoCampanasTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    pagare_virtualcop_raw: "",
    cedula_raw: "",
    nombre: "",
    estado_obligacion: "",
    oficina: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listSeguimientoCampanas({ limit: 2000 });
        const arr = Array.isArray(data) ? data : data?.items || [];
        setRows(arr);
        setFilteredRows(arr);
        setPage(1);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando seguimiento de campañas");
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
        (r.oficina || "").toString().toLowerCase().includes(query) ||
        (r.pagareVirtualCop || "").toString().toLowerCase().includes(query) ||
        (r.pagareOpa || "").toString().toLowerCase().includes(query) ||
        (r.cedula || "").toLowerCase().includes(query) ||
        (r.nombre || "").toLowerCase().includes(query) ||
        (r.estadoObligacion || "").toLowerCase().includes(query) ||
        (r.novedad || "").toLowerCase().includes(query) ||
        (r.gestor || "").toLowerCase().includes(query) ||
        (r.abogado || "").toLowerCase().includes(query)
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
    if (!form.pagare_virtualcop_raw || !form.cedula_raw || !form.nombre || !form.estado_obligacion) {
      setError("Pagaré, cédula, nombre y estado de la obligación son obligatorios");
      return;
    }
    setError("");
    setCreating(true);
    try {
      await createSeguimientoCampana(form);
      setForm({
        pagare_virtualcop_raw: "",
        cedula_raw: "",
        nombre: "",
        estado_obligacion: "",
        oficina: "",
      });
      const data = await listSeguimientoCampanas({ limit: 2000 });
      const arr = Array.isArray(data) ? data : data?.items || [];
      setRows(arr);
      setFilteredRows(arr);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando registro");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SeguimientoCampanas");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "seguimiento-campanas.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Seguimiento de campañas
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por oficina, cédula, nombre, gestor..."
            className="unified-input w-[320px]"
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
          <div className="flex items-center gap-2 text-sm">
            <button className="unified-button px-3" onClick={gotoPrev} disabled={page === 1}>
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
          <label className="text-sm">Pagaré VirtualCop*</label>
          <input
            type="text"
            value={form.pagare_virtualcop_raw}
            onChange={e => setForm(f => ({ ...f, pagare_virtualcop_raw: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Cédula*</label>
          <input
            type="text"
            value={form.cedula_raw}
            onChange={e => setForm(f => ({ ...f, cedula_raw: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Nombre*</label>
          <input
            type="text"
            value={form.nombre}
            onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Estado obligación*</label>
          <input
            type="text"
            value={form.estado_obligacion}
            onChange={e => setForm(f => ({ ...f, estado_obligacion: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Oficina</label>
          <input
            type="text"
            value={form.oficina}
            onChange={e => setForm(f => ({ ...f, oficina: e.target.value }))}
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
            <thead className="tabla-header">
              <tr>
                <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                  Oficina
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Pagaré VirtualCop
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Pagaré OPA
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                  Cédula
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                  Nombre
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Saldo a Capital
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Capital Condonado
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Estado de la Obligación
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                  Novedad
                </th>
                <th className="p-4 border text-center whitespace-nowrap">
                  Fecha
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                  Gestor
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                  Honorarios
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                  Abogado
                </th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content p-4">
              {paginatedRows.map(row => (
                <tr key={row.id}>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.oficina}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.pagareVirtualCop}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.pagareOpa}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.cedula}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.nombre}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {formatNumber(row.saldoCapital)}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {formatNumber(row.capitalCondonado)}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.estadoObligacion}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.novedad}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.fecha}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.gestor}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {formatNumber(row.honorarios)}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row.abogado}
                  </td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={13}>
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
