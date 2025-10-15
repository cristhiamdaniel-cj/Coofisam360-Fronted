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
  listAccidentalidadRows,
  saveAccidentalidadRow,
} from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/accidentalidadQuota";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [editingRows, setEditingRows] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info"); // success | error | info

  useEffect(() => {
    async function load() {
      try {
        const data = await listAccidentalidadRows({ limit: 500 });
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

  useEffect(() => {
    const query = search.trim().toLowerCase();

    const filtered = rows
      .filter(r => {
        const matchesSearch =
          !query || r.TipoVinculacion.toLowerCase().includes(query);

        const matchesYear = !selectedYear || r.Año === Number(selectedYear);

        // Ahora comparamos el mes como string en mayúscula
        const matchesMonth =
          !selectedMonth || r.Mes.toUpperCase() === selectedMonth.toUpperCase();

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => Number(a.codigo) - Number(b.codigo));

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  // Obtener años únicos
  const uniqueYears = [...new Set(rows.map(r => r.Año).filter(Boolean))];

  // Obtener meses únicos en mayúscula
  const uniqueMonths = [
    ...new Set(rows.map(r => r.Mes && r.Mes.toUpperCase()).filter(Boolean)),
  ];

  // Mantener el orden original de los meses
  const monthNames = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];

  const availableMonths = monthNames.filter(m => uniqueMonths.includes(m));

  const handleChange = (id, field, value) => {
    const updateRow = row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Si se cambia el tipo de vinculación, actualizar automáticamente el número de trabajadores
        if (field === 'TipoVinculacion') {
          if (value === 'Propios') {
            updatedRow.NumeroTrabajadores = updatedRow.NumeroTrabajadoresPropios || 0;
          } else if (value === 'Contratistas') {
            updatedRow.NumeroTrabajadores = updatedRow.NumeroTrabajadoresContratistas || 0;
          } else if (value === 'Propios y Contratistas') {
            const propios = updatedRow.NumeroTrabajadoresPropios || 0;
            const contratistas = updatedRow.NumeroTrabajadoresContratistas || 0;
            updatedRow.NumeroTrabajadores = propios + contratistas;
          }
        }
        
        return updatedRow;
      }
      return row;
    };
    
    setRows(prev => prev.map(updateRow));
    setFilteredRows(prev => prev.map(updateRow));
    setEditedRows(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const keys = Object.keys(editedRows);
      let ok = 0, fail = 0;
      for (const k of keys) {
        const row = rows.find(r => String(r.id) === String(k));
        if (!row) continue;
        const merged = { ...row, ...(editedRows[k] || {}) };
        try {
          await saveAccidentalidadRow(merged);
          ok++;
        } catch (e) {
          console.error(e);
          fail++;
        }
      }
      setEditedRows({});
      const data = await listAccidentalidadRows({ limit: 500 });
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
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Tabla de Accidentalidad"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "tablaAccidentalidad.xlsx");
  };

  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`, // id único temporal
      Año: new Date().getFullYear(),
      Mes: "ENERO",
      TipoVinculacion: "Propios",
      NumeroTrabajadores: 0, // se calcula automáticamente según el tipo de vinculación
      NumeroTrabajadoresPropios: 0, // para cálculos automáticos
      NumeroTrabajadoresContratistas: 0, // para cálculos automáticos
      AccidentesTrabajo: 0,
      AtMortales: 0,
      DiasIncapacidad: 0, // solo lectura
      DiasCargados: 0,
      Indicador: "I.S",
      Resultado: 0, // solo lectura
      isNew: true,
    };

    setRows(prev => [newRow, ...prev]); // agregamos al inicio
  };

  return (
    <main className="pt-4 pb-0 px-12">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Accidentalidad
      </h1>
      <div className="actions-container flex justify-between mb-4">
        {statusMsg && (
          <div className={`px-4 py-2 rounded text-sm ${statusType === 'success' ? 'bg-green-100 text-green-800' : statusType === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {statusMsg}
          </div>
        )}
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por Tipo de Vinculación"
            className="unified-input w-[300px]"
          />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="unified-select"
          >
            <option value="">Todos los años</option>
            {uniqueYears.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="unified-select"
          >
            <option value="">Todos los meses</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>
                {m}
                {/* Opcional: mostrar capitalizado */}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="unified-button flex gap-2 items-center justify-center"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
              <FaRegSave />
            </button>
          )}
          <button
            className="unified-button flex gap-2 items-center justify-center"
            onClick={handleDownload}
          >
            Descargar
            <FiDownload />
          </button>
          <button
            className="unified-button flex gap-2 items-center justify-center"
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[230px]">
                Tipo de Vinculación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Trabajadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Nº Accidentes de Trabajo
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                At Mortales
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días de Incapacidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Cargados
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                Indicador
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Resultado
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map((r, idx) => { const isEditing = r.isNew || !!editingRows[idx]; return (
              <tr key={idx}>
                <td className="p-2 border text-center whitespace-nowrap">
                  <button onClick={() => setEditingRows(prev => ({...prev, [idx]: !prev[idx]}))} className="px-3 py-1 border rounded cursor-pointer">{isEditing ? "Terminar" : "Editar"}</button>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.Año}
                      onChange={e => {
                        handleChange(r.id, "Año", e.target.value);
                      }}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    r.Año
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={r.Mes}
                      onChange={e => {
                        handleChange(r.id, "Mes", e.target.value);
                      }}
                      className="border rounded p-1 w-full"
                    >
                      {[
                        "ENERO",
                        "FEBRERO",
                        "MARZO",
                        "ABRIL",
                        "MAYO",
                        "JUNIO",
                        "JULIO",
                        "AGOSTO",
                        "SEPTIEMBRE",
                        "OCTUBRE",
                        "NOVIEMBRE",
                        "DICIEMBRE",
                      ].map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.Mes
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.TipoVinculacion}
                    onChange={e => {
                      handleChange(r.id, "TipoVinculacion", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["Propios", "Contratistas", "Propios y Contratistas"].map(
                      opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TipoVinculacion === 'Propios' ? (r.NumeroTrabajadoresPropios ?? 0) : 
                   r.TipoVinculacion === 'Contratistas' ? (r.NumeroTrabajadoresContratistas ?? 0) : 
                   (r.NumeroTrabajadores ?? 0)}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.AccidentesTrabajo}
                    onChange={e => {
                      handleChange(r.id, "AccidentesTrabajo", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.AtMortales}
                    onChange={e => {
                      handleChange(r.id, "AtMortales", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.DiasIncapacidad}
                      onChange={e =>
                        handleChange(r.id, "DiasIncapacidad", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.DiasIncapacidad
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.DiasCargados}
                    onChange={e => {
                      handleChange(r.id, "DiasCargados", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Indicador}
                    onChange={e => {
                      handleChange(r.id, "Indicador", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["I.S", "I.F", "AT MORTALES"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.Resultado}
                      onChange={e =>
                        handleChange(r.id, "Resultado", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.Resultado
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
