"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import {
  listRestriccionesRows,
  saveRestriccionRow,
} from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/restriccionesQuota";

const cargos = [
  "ANALISTA DE CRÉDITO 1",
  "ANALISTA DE RIESGOS",
  "Analista Ingeniería Organizacional",
  "APRENDÍZ ETAPA PRODUCTIVA",
  "ASESOR COMERCIAL AGENCIA 1",
  "ASESOR COMERCIAL AGENCIA 2",
  "ASESOR COMERCIAL AGENCIA 3",
  "ASESOR COMERCIAL AGENCIA 4",
  "ASESOR COMERCIAL CORRESPONSAL SOLIDARIO",
  "ASESOR FINANCIERO RURAL",
  "ASESOR MICROFINANZAS URBANO",
  "ASISTENTE BASE DE DATOS",
  "ASISTENTE CIENCIA DE DATOS",
  "ASISTENTE CONTABILIDAD",
  "AUX. SERV. GENERALES AGENCIA 1",
  "AUX. SERV. GENERALES DIRECCIÓN GENERAL",
  "Auxiliar Comunicaciones",
  "AUXILIAR CONTABILIDAD 2",
  "AUXILIAR DE AUDITORÍA 1",
  "AUXILIAR DE AUDITORÍA 2",
  "AUXILIAR DE CARTERA 1",
  "AUXILIAR DE CARTERA 2",
  "AUXILIAR DE CONTABILIDAD 1",
  "AUXILIAR DE CREDITO 1",
  "AUXILIAR DE CREDITO 2",
  "AUXILIAR DE GESTIÓN DOCUMENTAL",
  "AUXILIAR DE PUBLICIDAD",
  "AUXILIAR DE TALENTO Y CULTURA",
  "AUXILIAR JURIDICO 1",
  "AUXILIAR JURIDICO 2",
  "AUXILIAR OFICIAL DE CUMPLIMIENTO",
  "Auxiliar Seguridad y Salud en el Trabajo",
  "AUXILIAR SOCIAL MEDIA",
  "CAJERO 1 AGENCIA 1",
  "CAJERO 1 AGENCIA 2",
  "CAJERO AGENCIA 3",
  "CAJERO AGENCIA 4",
  "CAJERO AGENCIA 4A",
  "COORDINADOR DE CARTERA",
  "COORDINADOR DE COMUNICACIONES",
  "COORDINADOR DE MERCADEO",
  "COORDINADOR DE TALENTO Y CULTURA",
  "COORDINADOR GESTION DOCUMENTAL",
  "DIRECTOR AGENCIA 1",
  "DIRECTOR AGENCIA 2",
  "DIRECTOR AGENCIA 3",
  "DIRECTOR AGENCIA 4",
  "DIRECTOR AGENCIA 4A",
  "DIRECTOR AUDITORIA INTERNA",
  "DIRECTOR COMERCIAL",
  "DIRECTOR CONTABILIDAD",
  "DIRECTOR CREDITO",
  "DIRECTOR DE RIESGOS",
  "DIRECTOR DE TEGNOLOGIA",
  "DIRECTOR INGENIERIA ORGANIZACIONAL",
  "DIRECTOR JURÍDICO",
  "FORMADOR DE TALENTO Y CULTURA",
  "GERENTE GENERAL",
  "GESTOR COMERCIAL",
  "GESTOR DE CANALES",
  "GESTOR DE CARTERA 1",
  "GESTOR DE CARTERA 2",
  "GESTOR MICROFINANZAS",
  "JEFE OPERACIONES AGENCIA 1",
  "JEFE OPERACIONES AGENCIA 2",
  "JEFE OPERACIONES AGENCIA 3",
  "JEFE OPERACIONES AGENCIA 4",
  "JEFE OPERACIONES AGENCIA 4A",
  "OFICIAL DE CUMPLIMIENTO",
  "PRACTICANTE UNIVERSITARIO",
  "SECRETARIA DE GERENCIA",
  "SUBGERENTE COMERCIAL",
  "SUBGERENTE DE CREDITO Y CARTERA",
  "SUBGERENTE FINANCIERO",
  "SUBGERENTE INNOVACION EMPRESARIAL",
  "SUPERNUMERARIO DE OFICINA",
  "SUPERNUMERARIO MICROFINANZAS",
  "SUPERNUMERARIO MICROFINANZAS 1",
  "TESORERO",
];

const oficinas = [
  "GARZON",
  "GUADALUPE",
  "PITAL",
  "GIGANTE",
  "ACEVEDO",
  "TARQUI",
  "LA PLATA",
  "PITALITO",
  "SUAZA",
  "LA ARGENTINA",
  "NEIVA",
  "RIVERA",
  "HOBO",
  "IQUIRA",
  "SALADOBLANCO",
  "ESPINAL",
  "PLANADAS",
  "CHAPARRAL",
  "FLORENCIA",
  "DIRECCION GENERAL",
];

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingRows, setEditingRows] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [selectedYear, setSelectedYear] = useState();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await listRestriccionesRows({ limit: 500 });
        setRows(data);
        setError("");
      } catch (e) {
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows
      .filter(r => {
        const cargo = (r.cargo || "").toString().toLowerCase();
        const matchesSearch = !query || cargo.includes(query);
        const matchesYear = !selectedYear || r.anio === Number(selectedYear);
        return matchesSearch && matchesYear;
      })
      .sort((a, b) => {
        const aKey = `${a.anio || 0}-${(a.sede || "").toUpperCase()}-${(a.cargo || "").toUpperCase()}`;
        const bKey = `${b.anio || 0}-${(b.sede || "").toUpperCase()}-${(b.cargo || "").toUpperCase()}`;
        return aKey.localeCompare(bKey);
      });
  }, [rows, search, selectedYear]);

  // Obtener años únicos
  const uniqueYears = [...new Set(rows.map(r => r.anio).filter(Boolean))];

  const getRowKey = useCallback(row => {
    if (!row) return "";
    return (
      row._key ||
      `restr-${
        row.id != null && row.id !== undefined
          ? row.id
          : `${row.anio ?? ""}|${(row.sede || "").toUpperCase()}|${(row.cargo || "").toUpperCase()}`
      }`
    );
  }, []);

  const handleChange = useCallback((rowKey, field, value) => {
    setRows(prev =>
      prev.map(row => {
        const key = getRowKey(row);
        if (key !== rowKey) return row;
        const original = {
          origAnio: row.origAnio ?? row.anio,
          origSede: row.origSede ?? row.sede,
          origCargo: row.origCargo ?? row.cargo,
          origPatologia: row.origPatologia ?? row.patologia,
        };
        return { ...row, [field]: value, _key: rowKey, isEdited: true, ...original };
      })
    );

    setEditedRows(prev => ({
      ...prev,
      [rowKey]: { ...prev[rowKey], [field]: value },
    }));
  }, [getRowKey]);

  const handleSave = async () => {
    const keys = Object.keys(editedRows);
    if (!keys.length) return;
    setSaving(true);
    setStatus({ type: "", message: "" });
    let ok = 0;
    let fail = 0;
    for (const key of keys) {
      const row = rows.find(r => getRowKey(r) === key);
      if (!row) continue;
      const payload = {
        ...row,
        ...(editedRows[key] || {}),
      };
      if (row.isNew) {
        payload.isNew = true;
      }
      payload.origAnio = row.origAnio ?? row.anio;
      payload.origSede = row.origSede ?? row.sede;
      payload.origCargo = row.origCargo ?? row.cargo;
      payload.origPatologia = row.origPatologia ?? row.patologia;
      const keyChanged =
        payload.anio !== payload.origAnio ||
        payload.sede !== payload.origSede ||
        payload.cargo !== payload.origCargo ||
        payload.patologia !== payload.origPatologia;
      if (keyChanged) {
        payload.allowPkChange = true;
      }
      try {
        await saveRestriccionRow(payload);
        ok++;
      } catch (e) {
        console.error(e);
        fail++;
      }
    }
    try {
      const fresh = await listRestriccionesRows({ limit: 500 });
      setRows(fresh);
      setEditedRows({});
    } finally {
      setSaving(false);
    }
    if (ok && !fail) {
      setStatus({ type: "success", message: "Cambios guardados correctamente." });
    } else if (ok && fail) {
      setStatus({ type: "warning", message: `${ok} registros guardados, ${fail} con error.` });
    } else {
      setStatus({ type: "error", message: "No se pudieron guardar los cambios." });
    }
  };

  const handleDownload = () => {
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Indicadores Financieros"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "cupos.xlsx");
  };

  // Función para agregar una nueva fila al inicio de la tabla
  const handleAddRow = () => {
    const key = `new-${Date.now()}`;
    const newRow = {
      id: null,
      anio: new Date().getFullYear(),
      sede: oficinas[0] || "",
      cargo: cargos[0] || "",
      patologia: "",
      restricciones: "",
      isNew: true,
      origAnio: null,
      origSede: null,
      origCargo: null,
      origPatologia: null,
    };
    newRow._key = key;
    setRows(prev => [newRow, ...prev]);
    setEditingRows(prev => ({ ...prev, [key]: true }));
    setEditedRows(prev => ({ ...prev, [key]: newRow }));
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Restricciones Laborales
      </h1>
      {status.message && (
        <div
          className={`mb-3 text-sm ${
            status.type === "success"
              ? "text-green-700"
              : status.type === "warning"
              ? "text-amber-600"
              : "text-red-600"
          }`}
        >
          {status.message}
        </div>
      )}
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por Cargo"
            className="border w-[300px] px-2 py-1"
          />
          <select
            value={selectedYear || ""}
            onChange={e => setSelectedYear(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="">Todos los años</option>
            {uniqueYears.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="action-button flex gap-2 items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
              <FaRegSave />
            </button>
          )}
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleDownload}
          >
            Descargar
            <FiDownload />
          </button>
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleAddRow}
          >
            Añadir fila
            <FaArrowDownWideShort />
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th className="p-4 border text-center whitespace-nowrap">Acciones</th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                Sede
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                Cargo
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[500px]">
                Patología
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[500px]">
                Restricciones
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
          {filteredRows.map(r => {
            const rowKey = getRowKey(r);
            const isEditing = r.isNew || !!editingRows[rowKey];
            const sedeValue = r.sede || "";
            const cargoValue = r.cargo || "";
            const hasSedeOption = oficinas.some(opt => opt.toUpperCase() === sedeValue.toUpperCase());
            const hasCargoOption = cargos.some(opt => opt.toUpperCase() === cargoValue.toUpperCase());
            return (
            <tr key={rowKey}>
                <td className="p-2 border text-center whitespace-nowrap">
                <button
                  onClick={() => setEditingRows(prev => ({ ...prev, [rowKey]: !prev[rowKey] }))}
                  className="px-3 py-1 border rounded cursor-pointer"
                >
                  {isEditing ? "Terminar" : "Editar"}
                </button>
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.anio ?? ""}
                      min={1900}
                      max={2100}
                    onChange={e => handleChange(rowKey, "anio", Number(e.target.value))}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    r.anio
                  )}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {isEditing ? (
                  <select
                    value={sedeValue}
                      onChange={e => {
                        handleChange(rowKey, "sede", e.target.value);
                      }}
                      className="border rounded p-1 w-full"
                    >
                      <option value="" disabled>
                        Selecciona sede…
                      </option>
                      {!hasSedeOption && sedeValue && (
                        <option value={sedeValue}>{sedeValue}</option>
                      )}
                      {oficinas.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.sede
                  )}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={cargoValue}
                      onChange={e => {
                        handleChange(rowKey, "cargo", e.target.value);
                      }}
                      className="border rounded p-1 w-full"
                    >
                      <option value="" disabled>
                        Selecciona cargo…
                      </option>
                      {!hasCargoOption && cargoValue && (
                        <option value={cargoValue}>{cargoValue}</option>
                      )}
                      {cargos.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.cargo
                  )}
                </td>
                <td className="p-2 border text-center ">
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.patologia ?? ""}
                      onChange={e => {
                        handleChange(rowKey, "patologia", e.target.value);
                      }}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    r.patologia
                  )}
                </td>
                <td className="p-2 border text-center ">
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.restricciones ?? ""}
                      onChange={e => {
                        handleChange(rowKey, "restricciones", e.target.value);
                      }}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    r.restricciones
                  )}
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </main>
  );
}
