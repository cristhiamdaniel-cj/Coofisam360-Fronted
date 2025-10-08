"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import {
  listEnfermedadLaboralRows,
  saveEnfermedadLaboralRow,
} from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/enfermedadLaboralQuota";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info");

  useEffect(() => {
    async function load() {
      try {
        const data = await listEnfermedadLaboralRows({ limit: 500 });
        setRows(data);
        //setFilteredRows(data);
        setError("");
      } catch (e) {
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (idx, field, value) => {
    setRows(prev =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

    setEditedRows(prev => ({
      ...prev,
      [idx]: { ...prev[idx], [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const idxs = Object.keys(editedRows).map(k => Number(k));
      let ok = 0, fail = 0;
      for (const i of idxs) {
        const merged = { ...rows[i], ...(editedRows[i] || {}) };
        try {
          await saveEnfermedadLaboralRow(merged);
          ok++;
        } catch (e) {
          console.error(e);
          fail++;
        }
      }
      setEditedRows({});
      const data = await listEnfermedadLaboralRows({ limit: 500 });
      setRows(data);
      if (fail === 0 && ok > 0) {
        setStatusType("success");
        setStatusMsg("Información guardada correctamente.");
      } else if (ok > 0 && fail > 0) {
        setStatusType("info");
        setStatusMsg(`Guardado parcial: ${ok} ok, ${fail} con error.`);
      } else if (fail > 0) {
        setStatusType("error");
        setStatusMsg("Ocurrió un error guardando los cambios.");
      }
    } finally {
      setSaving(false);
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

  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      anio: new Date().getFullYear(),
      mes: "ENERO",
      casosAntiguosEL: 0,
      numeroTrabajadoresAnio: 0,
      casosNuevosEL: 0,
      constante: 0,
      indicador: "P-EL",
      resultado: 0,
      codigoCIE10: "",
      clasificacionCIE: "",
      clasificacionEnfermedadLaboral: "",
      isNew: true,
    };

    setRows(prev => [newRow, ...prev]);
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Enfermedad Laboral
      </h1>
      <div className="actions-container flex justify-between mb-4">
        {statusMsg && (
          <div className={`px-4 py-2 rounded text-sm ${statusType === 'success' ? 'bg-green-100 text-green-800' : statusType === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {statusMsg}
          </div>
        )}
        <div className="search-bar flex gap-2">
          <div className="search-bar flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por codigo u oficina"
              className="border w-[300px] px-2 py-1"
            />
          </div>
        </div>
        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="action-button flex gap-2 items-center justify-center cursor-pointer"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Casos Antiguos de EL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                N° Trabajadores en el Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Casos Nuevos de EL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Constante
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Indicador
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Resultado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Código CIE-10
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Clasificación Internacional de Enfermedades
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Clasificación Enfermedad Laboral
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map((row, idx) => { const isEditing = row.isNew || !!editingRows[idx]; return (
              <tr key={idx}>
                <td className="p-2 border text-center whitespace-nowrap">
                  <button onClick={() => setEditingRows(prev => ({...prev, [idx]: !prev[idx]}))} className="px-3 py-1 border rounded cursor-pointer">{isEditing ? "Terminar" : "Editar"}</button>
                </td>
                {/* Año */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={row.anio}
                      onChange={e => handleChange(idx, "anio", e.target.value)}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    row.anio
                  )}
                </td>

                {/* Mes */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={row.mes}
                      onChange={e => handleChange(idx, "mes", e.target.value)}
                      className="border rounded p-1 w-full"
                    >
                      {[
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                      ].map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.mes
                  )}
                </td>

                {/* Casos Antiguos EL */}
                <td className="p-2 border text-center whitespace-nowrap">
                  <input
                    type="number"
                    value={row.casosAntiguosEL}
                    onChange={e =>
                      handleChange(idx, "casosAntiguosEL", e.target.value)
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>

                {/* Numero Trabajadores Año (automático) */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.numeroTrabajadoresAnio}
                </td>

                {/* Casos Nuevos EL */}
                <td className="p-2 border text-center whitespace-nowrap">
                  <input
                    type="number"
                    value={row.casosNuevosEL}
                    onChange={e =>
                      handleChange(idx, "casosNuevosEL", e.target.value)
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>

                {/* Constante (fija en BD) */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.constante}
                </td>

                {/* Indicador */}
                <td className="p-2 border text-center whitespace-nowrap">
                  <select
                    value={row.indicador}
                    onChange={e =>
                      handleChange(idx, "indicador", e.target.value)
                    }
                    className="border rounded p-1 w-full"
                  >
                    {["P-EL", "I-EL"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Resultado (automático) */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.resultado ? (
                    <span className="font-medium">
                      {parseFloat(row.resultado).toLocaleString('es-CO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  ) : '-'}
                </td>

                {/* Código CIE10 */}
                <td className="p-2 border text-center whitespace-nowrap">
                  <input
                    type="text"
                    value={row.codigoCIE10}
                    onChange={e =>
                      handleChange(idx, "codigoCIE10", e.target.value)
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>

                {/* Clasificación CIE */}
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="text"
                    value={row.clasificacionCIE}
                    onChange={e =>
                      handleChange(idx, "clasificacionCIE", e.target.value)
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>

                {/* Clasificación Enfermedad Laboral */}
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="text"
                    value={row.clasificacionEnfermedadLaboral}
                    onChange={e =>
                      handleChange(
                        idx,
                        "clasificacionEnfermedadLaboral",
                        e.target.value
                      )
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </main>
  );
}
