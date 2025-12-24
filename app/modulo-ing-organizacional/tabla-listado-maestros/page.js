"use client";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listDocumentos, createDocumento } from "@/app/services/modulo-ing-organizacional/listadoMaestrosService";

export default function ListadoMaestrosTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    estrategia: "",
    gestion: "",
    tipo_documento: "",
    proceso: "",
    nombre_documento: "",
    codigo: "",
    fecha_ultima_actualizacion: "",
    version: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listDocumentos({ limit: 2000 });
        const arr = Array.isArray(data) ? data : data?.items || [];
        setRows(arr);
        setFilteredRows(arr);
        setPage(1);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando documentos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFilteredRows(rows);
      return;
    }
    const filtered = rows.filter(r => {
      return (
        (r.estrategias || "").toLowerCase().includes(q) ||
        (r.gestion || "").toLowerCase().includes(q) ||
        (r.tipoDocumento || "").toLowerCase().includes(q) ||
        (r.procesos || "").toLowerCase().includes(q) ||
        (r.nombreDocumento || "").toLowerCase().includes(q) ||
        (r.codigo || "").toLowerCase().includes(q)
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
    if (
      !form.estrategia ||
      !form.gestion ||
      !form.tipo_documento ||
      !form.proceso ||
      !form.nombre_documento ||
      !form.codigo ||
      !form.fecha_ultima_actualizacion ||
      !form.version
    ) {
      setError("Completa los campos obligatorios (*)");
      return;
    }
    setError("");
    setCreating(true);
    try {
      await createDocumento(form);
      setForm({
        estrategia: "",
        gestion: "",
        tipo_documento: "",
        proceso: "",
        nombre_documento: "",
        codigo: "",
        fecha_ultima_actualizacion: "",
        version: "",
      });
      const data = await listDocumentos({ limit: 2000 });
      const arr = Array.isArray(data) ? data : data?.items || [];
      setRows(arr);
      setFilteredRows(arr);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando documento");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ListadoMaestros");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "listado-maestros.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">Listado de maestros</h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por código, nombre, proceso..."
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

      <div className="mb-4 grid grid-cols-4 gap-3 bg-gray-50 p-3 rounded">
        <div>
          <label className="text-sm">Estrategia*</label>
          <input
            type="text"
            value={form.estrategia}
            onChange={e => setForm(f => ({ ...f, estrategia: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Gestión*</label>
          <input
            type="text"
            value={form.gestion}
            onChange={e => setForm(f => ({ ...f, gestion: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Tipo documento*</label>
          <input
            type="text"
            value={form.tipo_documento}
            onChange={e => setForm(f => ({ ...f, tipo_documento: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Procesos*</label>
          <input
            type="text"
            value={form.proceso}
            onChange={e => setForm(f => ({ ...f, proceso: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Nombre documento*</label>
          <input
            type="text"
            value={form.nombre_documento}
            onChange={e => setForm(f => ({ ...f, nombre_documento: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Código*</label>
          <input
            type="text"
            value={form.codigo}
            onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Fecha última actualización*</label>
          <input
            type="date"
            value={form.fecha_ultima_actualizacion}
            onChange={e => setForm(f => ({ ...f, fecha_ultima_actualizacion: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Versión*</label>
          <input
            type="number"
            value={form.version}
            onChange={e => setForm(f => ({ ...f, version: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div className="col-span-4 flex items-center justify-end">
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
                <th className="p-4 border text-center whitespace-nowrap">Estrategias</th>
                <th className="p-4 border text-center whitespace-nowrap">Gestión</th>
                <th className="p-4 border text-center whitespace-nowrap">Tipo documento</th>
                <th className="p-4 border text-center whitespace-nowrap">Procesos</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[240px]">
                  Nombre documento
                </th>
                <th className="p-4 border text-center whitespace-nowrap">Código</th>
                <th className="p-4 border text-center whitespace-nowrap">Última actualización</th>
                <th className="p-4 border text-center whitespace-nowrap">Versión</th>
                <th className="p-4 border text-center whitespace-nowrap">Actualizado</th>
                <th className="p-4 border text-center whitespace-nowrap">Conservación</th>
                <th className="p-4 border text-center whitespace-nowrap">Intranet</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content p-4">
              {paginatedRows.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-center">{r.estrategias}</td>
                  <td className="p-2 border text-center">{r.gestion}</td>
                  <td className="p-2 border text-center">{r.tipoDocumento}</td>
                  <td className="p-2 border text-center">{r.procesos}</td>
                  <td className="p-2 border text-center">{r.nombreDocumento}</td>
                  <td className="p-2 border text-center">{r.codigo}</td>
                  <td className="p-2 border text-center">{r.ultimaActualizacion}</td>
                  <td className="p-2 border text-center">{r.version}</td>
                  <td className="p-2 border text-center">{r.actualizado}</td>
                  <td className="p-2 border text-center">{r.conservacion}</td>
                  <td className="p-2 border text-center">{r.intranet}</td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={11}>
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
