"use client";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listGestiones, createGestion } from "@/app/services/modulo-cartera/gestionesService";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    tipo: "",
    comentario: "",
    nro_producto: "",
    cedula: "",
    nombre: "",
    usuario_gestion: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listGestiones({ limit: 2000 });
        const arr = Array.isArray(data) ? data : data?.items || [];
        setRows(arr);
        setFilteredRows(arr);
        setPage(1);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando gestiones");
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
        (r.tipo || "").toLowerCase().includes(q) ||
        (r.fechaGestion || "").toLowerCase().includes(q) ||
        (r.comentario || "").toLowerCase().includes(q) ||
        (r.nroProducto || "").toLowerCase().includes(q) ||
        (r.cedula || "").toLowerCase().includes(q) ||
        (r.nombre || "").toLowerCase().includes(q) ||
        (r.usuarioGestion || "").toLowerCase().includes(q) ||
        (r.oficina || "").toLowerCase().includes(q) ||
        (r.gestionValidada || "").toLowerCase().includes(q)
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
    if (!form.tipo || !form.comentario || !form.nro_producto || !form.cedula || !form.nombre || !form.usuario_gestion) {
      setError("Tipo, comentario, nro producto, cédula, nombre y usuario gestión son obligatorios");
      return;
    }
    setError("");
    setCreating(true);
    try {
      await createGestion(form);
      setForm({
        tipo: "",
        comentario: "",
        nro_producto: "",
        cedula: "",
        nombre: "",
        usuario_gestion: "",
      });
      const data = await listGestiones({ limit: 2000 });
      const items = Array.isArray(data) ? data : data?.items || [];
      setRows(items);
      setFilteredRows(items);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando gestión");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gestiones");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "gestiones.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">Gestiones</h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cédula, nombre, comentario, oficina..."
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

      <div className="mb-4 grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded">
        <div>
          <label className="text-sm">Tipo*</label>
          <input
            type="text"
            value={form.tipo}
            onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Comentario*</label>
          <input
            type="text"
            value={form.comentario}
            onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Nro. Producto*</label>
          <input
            type="text"
            value={form.nro_producto}
            onChange={e => setForm(f => ({ ...f, nro_producto: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Cédula*</label>
          <input
            type="text"
            value={form.cedula}
            onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))}
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
          <label className="text-sm">Usuario gestión*</label>
          <input
            type="text"
            value={form.usuario_gestion}
            onChange={e => setForm(f => ({ ...f, usuario_gestion: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div className="col-span-3 flex items-center justify-end">
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
                <th className="p-4 border text-center whitespace-nowrap">Tipo</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[140px]">
                  Fecha gestión
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[260px]">
                  Comentario
                </th>
                <th className="p-4 border text-center whitespace-nowrap">Nro. Producto</th>
                <th className="p-4 border text-center whitespace-nowrap">Cédula</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[220px]">Nombre</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[140px]">
                  Usuario gestión
                </th>
                <th className="p-4 border text-center whitespace-nowrap">Oficina</th>
                <th className="p-4 border text-center whitespace-nowrap">Gestión validada</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content p-4">
              {paginatedRows.map(row => (
                <tr key={row.id}>
                  <td className="p-2 border text-center">{row.tipo}</td>
                  <td className="p-2 border text-center">{row.fechaGestion}</td>
                  <td className="p-2 border text-center">{row.comentario}</td>
                  <td className="p-2 border text-center">{row.nroProducto}</td>
                  <td className="p-2 border text-center">{row.cedula}</td>
                  <td className="p-2 border text-center">{row.nombre}</td>
                  <td className="p-2 border text-center">{row.usuarioGestion}</td>
                  <td className="p-2 border text-center">{row.oficina}</td>
                  <td className="p-2 border text-center">{row.gestionValidada}</td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={9}>
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
