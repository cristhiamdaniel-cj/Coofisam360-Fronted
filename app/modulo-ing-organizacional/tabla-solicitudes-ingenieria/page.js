"use client";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listSolicitudesIngenieria, createSolicitudIngenieria } from "@/app/services/modulo-ing-organizacional/solicitudesIngenieriaService";

export default function SolicitudesIngenieriaTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    radicado: "",
    gestion: "",
    estado: "",
    creado_por: "",
    tipo_solicitud: "",
    asignado_a: "",
    fecha_solicitud: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listSolicitudesIngenieria({ limit: 2000 });
        const arr = Array.isArray(data) ? data : data?.items || [];
        setRows(arr);
        setFilteredRows(arr);
        setPage(1);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando solicitudes");
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
        (r.radicado || "").toString().toLowerCase().includes(q) ||
        (r.gestion || "").toLowerCase().includes(q) ||
        (r.descripcionSolicitud || "").toLowerCase().includes(q) ||
        (r.estado || "").toLowerCase().includes(q) ||
        (r.creadoPor || "").toLowerCase().includes(q) ||
        (r.tipoSolicitud || "").toLowerCase().includes(q) ||
        (r.asignadoA || "").toLowerCase().includes(q)
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
    if (!form.radicado || !form.gestion || !form.estado || !form.creado_por || !form.tipo_solicitud || !form.asignado_a || !form.fecha_solicitud) {
      setError("Radicado, gestión, estado, creado por, tipo solicitud, asignado a y fecha solicitud son obligatorios");
      return;
    }
    setError("");
    setCreating(true);
    try {
      await createSolicitudIngenieria(form);
      setForm({
        radicado: "",
        gestion: "",
        estado: "",
        creado_por: "",
        tipo_solicitud: "",
        asignado_a: "",
        fecha_solicitud: "",
      });
      const data = await listSolicitudesIngenieria({ limit: 2000 });
      const arr = Array.isArray(data) ? data : data?.items || [];
      setRows(arr);
      setFilteredRows(arr);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando solicitud");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SolicitudesIng");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "solicitudes-ingenieria.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Solicitudes de ingeniería
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por radicado, gestión, estado..."
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
          <label className="text-sm">Radicado*</label>
          <input
            type="text"
            value={form.radicado}
            onChange={e => setForm(f => ({ ...f, radicado: e.target.value }))}
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
          <label className="text-sm">Estado*</label>
          <input
            type="text"
            value={form.estado}
            onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Creado por*</label>
          <input
            type="text"
            value={form.creado_por}
            onChange={e => setForm(f => ({ ...f, creado_por: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Tipo solicitud*</label>
          <input
            type="text"
            value={form.tipo_solicitud}
            onChange={e => setForm(f => ({ ...f, tipo_solicitud: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Asignado a*</label>
          <input
            type="text"
            value={form.asignado_a}
            onChange={e => setForm(f => ({ ...f, asignado_a: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Fecha solicitud*</label>
          <input
            type="date"
            value={form.fecha_solicitud}
            onChange={e => setForm(f => ({ ...f, fecha_solicitud: e.target.value }))}
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
                <th className="p-4 border text-center whitespace-nowrap">Radicado</th>
                <th className="p-4 border text-center whitespace-nowrap">Mes</th>
                <th className="p-4 border text-center whitespace-nowrap">Gestión</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[280px]">
                  Descripción solicitud
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">Avance</th>
                <th className="p-4 border text-center whitespace-nowrap">Estado</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                  Creado por
                </th>
                <th className="p-4 border text-center whitespace-nowrap">Tipo de solicitud</th>
                <th className="p-4 border text-center whitespace-nowrap">Asignado a</th>
                <th className="p-4 border text-center whitespace-nowrap">Fecha solicitud</th>
                <th className="p-4 border text-center whitespace-nowrap">En curso</th>
                <th className="p-4 border text-center whitespace-nowrap">Revisión</th>
                <th className="p-4 border text-center whitespace-nowrap">En ajustes</th>
                <th className="p-4 border text-center whitespace-nowrap">En aprobación</th>
                <th className="p-4 border text-center whitespace-nowrap">Completado</th>
                <th className="p-4 border text-center whitespace-nowrap">Adjunto</th>
                <th className="p-4 border text-center whitespace-nowrap">Columna1</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content p-4">
              {paginatedRows.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-center">{r.radicado}</td>
                  <td className="p-2 border text-center">{r.mes}</td>
                  <td className="p-2 border text-center">{r.gestion}</td>
                  <td className="p-2 border text-center">{r.descripcionSolicitud}</td>
                  <td className="p-2 border text-center">{r.avance}</td>
                  <td className="p-2 border text-center">{r.estado}</td>
                  <td className="p-2 border text-center">{r.creadoPor}</td>
                  <td className="p-2 border text-center">{r.tipoSolicitud}</td>
                  <td className="p-2 border text-center">{r.asignadoA}</td>
                  <td className="p-2 border text-center">{r.fechaSolicitud}</td>
                  <td className="p-2 border text-center">{r.enCurso}</td>
                  <td className="p-2 border text-center">{r.revision}</td>
                  <td className="p-2 border text-center">{r.enAjustes}</td>
                  <td className="p-2 border text-center">{r.enAprobacion}</td>
                  <td className="p-2 border text-center">{r.completado}</td>
                  <td className="p-2 border text-center">{r.adjunto}</td>
                  <td className="p-2 border text-center">{r.columna1}</td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={17}>
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
