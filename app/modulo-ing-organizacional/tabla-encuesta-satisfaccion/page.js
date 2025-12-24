"use client";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listEncuestaSatisfaccion, createEncuesta } from "@/app/services/modulo-ing-organizacional/encuestaSatisfaccionService";

export default function EncuestaSatisfaccionTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    correo_electronico: "",
    nombre: "",
    oficina_area: "",
    calidad_documentos: "",
    claridad_comunicacion: "",
    rapidez_respuesta: "",
    satisfaccion_general: "",
    tiempo_creacion_texto: "",
    apertura_ajustes_texto: "",
    comentario_mejora: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listEncuestaSatisfaccion({ limit: 2000 });
        const arr = Array.isArray(data) ? data : data?.items || [];
        setRows(arr);
        setFilteredRows(arr);
        setPage(1);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando encuestas");
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
        (r.correoElectronico || "").toLowerCase().includes(q) ||
        (r.nombre || "").toLowerCase().includes(q) ||
        (r.oficinaArea || "").toLowerCase().includes(q)
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
    if (!form.fecha_inicio || !form.correo_electronico || !form.nombre || !form.oficina_area) {
      setError("Fecha inicio, correo, nombre y oficina/área son obligatorios");
      return;
    }
    setError("");
    setCreating(true);
    try {
      await createEncuesta(form);
      setForm({
        fecha_inicio: "",
        fecha_fin: "",
        correo_electronico: "",
        nombre: "",
        oficina_area: "",
        calidad_documentos: "",
        claridad_comunicacion: "",
        rapidez_respuesta: "",
        satisfaccion_general: "",
        tiempo_creacion_texto: "",
        apertura_ajustes_texto: "",
        comentario_mejora: "",
      });
      const data = await listEncuestaSatisfaccion({ limit: 2000 });
      const arr = Array.isArray(data) ? data : data?.items || [];
      setRows(arr);
      setFilteredRows(arr);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando encuesta");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EncuestaSatisfaccion");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "encuesta-satisfaccion.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">Encuesta de satisfacción</h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por correo, nombre u oficina"
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
          <label className="text-sm">Fecha inicio*</label>
          <input
            type="datetime-local"
            value={form.fecha_inicio}
            onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Fecha fin</label>
          <input
            type="datetime-local"
            value={form.fecha_fin}
            onChange={e => setForm(f => ({ ...f, fecha_fin: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Correo electrónico*</label>
          <input
            type="email"
            value={form.correo_electronico}
            onChange={e => setForm(f => ({ ...f, correo_electronico: e.target.value }))}
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
          <label className="text-sm">Oficina/Área*</label>
          <input
            type="text"
            value={form.oficina_area}
            onChange={e => setForm(f => ({ ...f, oficina_area: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Calidad documentos</label>
          <input
            type="number"
            value={form.calidad_documentos}
            onChange={e => setForm(f => ({ ...f, calidad_documentos: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Claridad comunicación</label>
          <input
            type="number"
            value={form.claridad_comunicacion}
            onChange={e => setForm(f => ({ ...f, claridad_comunicacion: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Rapidez respuesta</label>
          <input
            type="number"
            value={form.rapidez_respuesta}
            onChange={e => setForm(f => ({ ...f, rapidez_respuesta: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Satisfacción general</label>
          <input
            type="number"
            value={form.satisfaccion_general}
            onChange={e => setForm(f => ({ ...f, satisfaccion_general: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Tiempo suficiente</label>
          <input
            type="text"
            value={form.tiempo_creacion_texto}
            onChange={e => setForm(f => ({ ...f, tiempo_creacion_texto: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Abierta a ajustes</label>
          <input
            type="text"
            value={form.apertura_ajustes_texto}
            onChange={e => setForm(f => ({ ...f, apertura_ajustes_texto: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Mejoras</label>
          <input
            type="text"
            value={form.comentario_mejora}
            onChange={e => setForm(f => ({ ...f, comentario_mejora: e.target.value }))}
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
                <th className="p-4 border text-center whitespace-nowrap">Hora inicio</th>
                <th className="p-4 border text-center whitespace-nowrap">Hora finalización</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                  Correo electrónico
                </th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[220px]">Nombre</th>
                <th className="p-4 border text-center whitespace-nowrap">Oficina/Área</th>
                <th className="p-4 border text-center whitespace-nowrap">Calidad documentos</th>
                <th className="p-4 border text-center whitespace-nowrap">Tiempo suficiente</th>
                <th className="p-4 border text-center whitespace-nowrap">Claridad comunicación</th>
                <th className="p-4 border text-center whitespace-nowrap">Abierta a ajustes</th>
                <th className="p-4 border text-center whitespace-nowrap">Velocidad respuesta</th>
                <th className="p-4 border text-center whitespace-nowrap">Satisfacción general</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[240px]">Mejoras</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content p-4">
              {paginatedRows.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-center whitespace-nowrap">{r.horaInicio}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.horaFinalizacion}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.correoElectronico}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.nombre}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.oficinaArea}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.calidadDocumentos}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.tiempoSuficiente}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.claridadComunicacion}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.abiertaAjustes}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.velocidadRespuesta}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.satisfaccionGeneral}</td>
                  <td className="p-2 border text-center whitespace-nowrap">{r.mejoras}</td>
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
