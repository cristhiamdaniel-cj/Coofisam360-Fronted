"use client";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { listAsignacionLlamadas, createAsignacionLlamada } from "@/app/services/modulo-cartera/asignacionLlamadasService";

const formatNumber = value => {
  const num = Number(value);
  if (!Number.isFinite(num)) return value || "-";
  return new Intl.NumberFormat("es-CO").format(num);
};

export default function AsignacionLlamadasTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    agencia: "",
    numero_credito_raw: "",
    linea_credito: "",
    numero_identificacion: "",
    nombre_asociado: "",
    saldo_capital_raw: "",
    dias_mora_raw: "",
    periodicidad_capital: "",
    tipo_garantia: "",
    celular: "",
    estado: "",
    gestor: "",
    fecha_gestion_raw: "",
    fecha_acuerdo_raw: "",
    gestion_titular: "",
    gestion_codeudor: "",
    novedad_gestion: "",
    programar_visita: "",
    gestor_apoya: "",
    calificacion: "",
    fecha_corte: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await listAsignacionLlamadas({ limit: 1000 });
        const arr = Array.isArray(data) ? data : data?.items || [];
        setRows(arr);
        setFilteredRows(arr);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error cargando llamadas");
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
        (r.gestor || "").toLowerCase().includes(query) ||
        (r.estado || "").toLowerCase().includes(query) ||
        (r.agencia || "").toLowerCase().includes(query) ||
        (r.numeroCredito || "").toLowerCase().includes(query)
      );
    });
    setFilteredRows(filtered);
  }, [search, rows]);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AsignacionLlamadas");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "asignacion-llamadas.xlsx");
  };

  const handleCreate = async () => {
    const req = ["agencia", "numero_credito_raw", "linea_credito", "numero_identificacion", "nombre_asociado"];
    const missing = req.filter(k => !form[k]);
    if (missing.length) {
      setError(`Faltan obligatorios: ${missing.join(", ")}`);
      return;
    }
    setError("");
    setCreating(true);
    try {
      await createAsignacionLlamada(form);
      setForm({
        agencia: "",
        numero_credito_raw: "",
        linea_credito: "",
        numero_identificacion: "",
        nombre_asociado: "",
        saldo_capital_raw: "",
        dias_mora_raw: "",
        periodicidad_capital: "",
        tipo_garantia: "",
        celular: "",
        estado: "",
        gestor: "",
        fecha_gestion_raw: "",
        fecha_acuerdo_raw: "",
        gestion_titular: "",
        gestion_codeudor: "",
        novedad_gestion: "",
        programar_visita: "",
        gestor_apoya: "",
        calificacion: "",
        fecha_corte: "",
      });
      const data = await listAsignacionLlamadas({ limit: 1000 });
      const arr = Array.isArray(data) ? data : data?.items || [];
      setRows(arr);
      setFilteredRows(arr);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error creando llamada");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Asignación de llamadas
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cédula, nombre, gestor..."
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
        <div className="grid grid-cols-4 gap-3">
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
          <label className="text-sm">Línea de Crédito*</label>
          <input
            type="text"
            value={form.linea_credito}
            onChange={e => setForm(f => ({ ...f, linea_credito: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Número Identificación*</label>
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
          <label className="text-sm">Saldo Capital</label>
          <input
            type="text"
            value={form.saldo_capital_raw}
            onChange={e => setForm(f => ({ ...f, saldo_capital_raw: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Días Mora</label>
          <input
            type="text"
            value={form.dias_mora_raw}
            onChange={e => setForm(f => ({ ...f, dias_mora_raw: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Periodicidad Capital</label>
          <input
            type="text"
            value={form.periodicidad_capital}
            onChange={e => setForm(f => ({ ...f, periodicidad_capital: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Tipo Garantía</label>
          <input
            type="text"
            value={form.tipo_garantia}
            onChange={e => setForm(f => ({ ...f, tipo_garantia: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Celular</label>
          <input
            type="text"
            value={form.celular}
            onChange={e => setForm(f => ({ ...f, celular: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Estado</label>
          <input
            type="text"
            value={form.estado}
            onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Gestor</label>
          <input
            type="text"
            value={form.gestor}
            onChange={e => setForm(f => ({ ...f, gestor: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Fecha Gestión</label>
          <input
            type="text"
            value={form.fecha_gestion_raw}
            onChange={e => setForm(f => ({ ...f, fecha_gestion_raw: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Fecha Acuerdo</label>
          <input
            type="text"
            value={form.fecha_acuerdo_raw}
            onChange={e => setForm(f => ({ ...f, fecha_acuerdo_raw: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Gestión Titular</label>
          <input
            type="text"
            value={form.gestion_titular}
            onChange={e => setForm(f => ({ ...f, gestion_titular: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Gestión Codeudor</label>
          <input
            type="text"
            value={form.gestion_codeudor}
            onChange={e => setForm(f => ({ ...f, gestion_codeudor: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Novedad Gestión</label>
          <input
            type="text"
            value={form.novedad_gestion}
            onChange={e => setForm(f => ({ ...f, novedad_gestion: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Programar Visita</label>
          <input
            type="text"
            value={form.programar_visita}
            onChange={e => setForm(f => ({ ...f, programar_visita: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Gestor Apoya</label>
          <input
            type="text"
            value={form.gestor_apoya}
            onChange={e => setForm(f => ({ ...f, gestor_apoya: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Calificación</label>
          <input
            type="text"
            value={form.calificacion}
            onChange={e => setForm(f => ({ ...f, calificacion: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
        <div>
          <label className="text-sm">Fecha corte</label>
          <input
            type="date"
            value={form.fecha_corte}
            onChange={e => setForm(f => ({ ...f, fecha_corte: e.target.value }))}
            className="unified-input w-full"
          />
        </div>
          <div className="col-span-4 flex items-center justify-end">
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
                <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">Agencia</th>
                <th className="p-4 border text-center whitespace-nowrap">Número de Crédito</th>
                <th className="p-4 border text-center whitespace-nowrap">Línea de Crédito</th>
                <th className="p-4 border text-center whitespace-nowrap">Número de Identificación</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[220px]">Nombre Asociado</th>
                <th className="p-4 border text-center whitespace-nowrap">Saldo Capital</th>
                <th className="p-4 border text-center whitespace-nowrap">Días Mora</th>
                <th className="p-4 border text-center whitespace-nowrap">Periodicidad Capital</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[220px]">Tipo Garantía</th>
                <th className="p-4 border text-center whitespace-nowrap">Celular</th>
                <th className="p-4 border text-center whitespace-nowrap">Estado</th>
                <th className="p-4 border text-center whitespace-nowrap min-w-[160px]">Gestor</th>
                <th className="p-4 border text-center whitespace-nowrap">Fecha Gestión</th>
                <th className="p-4 border text-center whitespace-nowrap">Fecha Acuerdo</th>
                <th className="p-4 border text-center whitespace-nowrap">Gestión Titular</th>
                <th className="p-4 border text-center whitespace-nowrap">Gestión Codeudor</th>
                <th className="p-4 border text-center whitespace-nowrap">Novedad Gestión</th>
                <th className="p-4 border text-center whitespace-nowrap">Programar Visita</th>
                <th className="p-4 border text-center whitespace-nowrap">Gestor Apoya</th>
                <th className="p-4 border text-center whitespace-nowrap">Calificación</th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content p-4">
              {filteredRows.map(r => (
                <tr key={r.id}>
                  <td>{r.agencia}</td>
                  <td>{r.numeroCredito}</td>
                  <td>{r.lineaCredito}</td>
                  <td>{r.numeroIdentificacion}</td>
                  <td>{r.nombreAsociado}</td>
                  <td>{formatNumber(r.saldoCapital)}</td>
                  <td>{formatNumber(r.diasMora)}</td>
                  <td>{r.periodicidadCapital}</td>
                  <td>{r.tipoGarantia}</td>
                  <td>{r.celular}</td>
                <td>{r.estado}</td>
                <td>{r.gestor}</td>
                <td>{r.fechaGestion}</td>
                <td>{r.fechaAcuerdo}</td>
                <td>{r.gestionTitular}</td>
                <td>{r.gestionCodeudor}</td>
                <td>{r.novedadGestion}</td>
                <td>{r.programarVisita}</td>
                <td>{r.gestorApoya}</td>
                <td>{r.calificacion}</td>
              </tr>
            ))}
              {!filteredRows.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={20}>
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
