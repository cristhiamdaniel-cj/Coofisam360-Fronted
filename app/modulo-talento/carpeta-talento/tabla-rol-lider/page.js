"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import {
  listRolLiderRows,
  saveRolLiderRow,
} from "../../../services/modulo-talento/carpeta-talento/rolLiderQuota";

const initialRows = [
  {
    id: 1,
    AÑO: 2024,
    MES: "OCTUBRE",
    "LIDER MUJER": 36,
    "LIDER HOMBRE": 19,
    "LIDER OTRO": 0,
    "TOTAL EMPLEADOS": 222,
    "% LIDER MUJER": "16%",
    "% LIDER HOMBRE": "9%",
    "% LIDER OTRO": "0%",
  },
  {
    id: 2,
    AÑO: 2024,
    MES: "NOVIEMBRE",
    "LIDER MUJER": 36,
    "LIDER HOMBRE": 19,
    "LIDER OTRO": 0,
    "TOTAL EMPLEADOS": 222,
    "% LIDER MUJER": "16%",
    "% LIDER HOMBRE": "9%",
    "% LIDER OTRO": "0%",
  },
  {
    id: 3,
    AÑO: 2024,
    MES: "DICIEMBRE",
    "LIDER MUJER": 40,
    "LIDER HOMBRE": 20,
    "LIDER OTRO": 0,
    "TOTAL EMPLEADOS": 221,
    "% LIDER MUJER": "18%",
    "% LIDER HOMBRE": "9%",
    "% LIDER OTRO": "0%",
  },
  {
    id: 4,
    AÑO: 2025,
    MES: "ENERO",
    "LIDER MUJER": 21,
    "LIDER HOMBRE": 10,
    "LIDER OTRO": 0,
    "TOTAL EMPLEADOS": 217,
    "% LIDER MUJER": "10%",
    "% LIDER HOMBRE": "5%",
    "% LIDER OTRO": "0%",
  },
  {
    id: 5,
    AÑO: 2025,
    MES: "FEBRERO",
    "LIDER MUJER": 20,
    "LIDER HOMBRE": 10,
    "LIDER OTRO": 0,
    "TOTAL EMPLEADOS": 233,
    "% LIDER MUJER": "9%",
    "% LIDER HOMBRE": "4%",
    "% LIDER OTRO": "0%",
  },
  {
    id: 6,
    AÑO: 2025,
    MES: "MARZO",
    "LIDER MUJER": 20,
    "LIDER HOMBRE": 10,
    "LIDER OTRO": 0,
    "TOTAL EMPLEADOS": 208,
    "% LIDER MUJER": "10%",
    "% LIDER HOMBRE": "5%",
    "% LIDER OTRO": "0%",
  },
  {
    id: 7,
    AÑO: 2025,
    MES: "ABRIL",
    "LIDER MUJER": 20,
    "LIDER HOMBRE": 10,
    "LIDER OTRO": 0,
    "TOTAL EMPLEADOS": 212,
    "% LIDER MUJER": "9%",
    "% LIDER HOMBRE": "5%",
    "% LIDER OTRO": "0%",
  },
  {
    id: 8,
    AÑO: 2025,
    MES: "MAYO",
    "LIDER MUJER": 20,
    "LIDER HOMBRE": 10,
    "LIDER OTRO": 0,
    "TOTAL EMPLEADOS": 212,
    "% LIDER MUJER": "9%",
    "% LIDER HOMBRE": "5%",
    "% LIDER OTRO": "0%",
  },
  {
    id: 9,
    AÑO: 2025,
    MES: "JUNIO",
    "LIDER MUJER": 26,
    "LIDER HOMBRE": 12,
    "LIDER OTRO": 0,
    "TOTAL EMPLEADOS": 206,
    "% LIDER MUJER": "13%",
    "% LIDER HOMBRE": "6%",
    "% LIDER OTRO": "0%",
  },
];

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

  const handleChange = (id, field, value) => {
    // update rows state immediately
    setRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );

    // mark this row as edited
    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  useEffect(() => {
    const query = search.trim().toLowerCase();

    const filtered = rows
      .filter(r => {
        const matchesSearch =
          !query || r.TipoVinculacion.toLowerCase().includes(query);

        const matchesYear = !selectedYear || r.AÑO === Number(selectedYear);

        // Ahora comparamos el mes como string en mayúscula
        const matchesMonth =
          !selectedMonth || r.MES.toUpperCase() === selectedMonth.toUpperCase();

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => Number(a.codigo) - Number(b.codigo));

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  // Obtener años únicos
  const uniqueYears = [...new Set(rows.map(r => r.AÑO).filter(Boolean))];

  // Obtener meses únicos en mayúscula
  const uniqueMonths = [
    ...new Set(rows.map(r => r.MES && r.MES.toUpperCase()).filter(Boolean)),
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

  useEffect(() => {
    async function load() {
      try {
        const data = await listRolLiderRows({ limit: 500 });
        console.log(data);
        setRows(data);
        setError("");
      } catch (e) {
        setError(e.message || "Error cargando datos");
        // Si hay error, usar datos iniciales como fallback
        setRows(initialRows);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log(">>> editedRows:", editedRows);

      const updates = Object.entries(editedRows).map(async ([id, changes]) => {
        console.log(">>> Iterando row:", id, changes);

        const fullRow = rows.find(r => String(r.id) === String(id));
        if (!fullRow) {
          console.warn("⚠️ No se encontró la fila con id:", id);
          return;
        }

        const payload = {
          id: fullRow.id,
          anio: Number(fullRow.AÑO),
          mes: fullRow.MES,
          lider_mujer: Number(
            changes["LIDER MUJER"] ?? fullRow["LIDER MUJER"]
          ) || 0,
          lider_hombre: Number(
            changes["LIDER HOMBRE"] ?? fullRow["LIDER HOMBRE"]
          ) || 0,
          lider_otro: Number(
            changes["LIDER OTRO"] ?? fullRow["LIDER OTRO"]
          ) || 0,
          total_empleados: Number(fullRow["TOTAL EMPLEADOS"]) || 0,
          pct_lider_mujer: fullRow["% LIDER MUJER"] || "0%",
          pct_lider_hombre: fullRow["% LIDER HOMBRE"] || "0%",
          pct_lider_otro: fullRow["% LIDER OTRO"] || "0%",
        };

        console.log(">>> Payload enviado al backend:", payload);

        await saveRolLiderRow(payload);
      });

      await Promise.all(updates);

      alert("Cambios guardados correctamente ✅");
      setEditedRows({});
    } catch (err) {
      console.error("Error guardando cambios:", err);
      alert("Error guardando cambios ❌");
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

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Rol de Líder
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por Tipo de Vinculación"
            className="border w-[300px] px-2 py-1"
          />
          <select
            value={selectedYear}
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
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border px-2 py-1"
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
              className="action-button flex gap-2 items-center justify-center cursor-pointer"
            >
              Guardar cambios
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
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th className="p-4 border text-center">Año</th>
              <th className="p-4 border text-center">Mes</th>
              <th className="p-4 border text-center">Líder Mujer</th>
              <th className="p-4 border text-center">Líder Hombre</th>
              <th className="p-4 border text-center">Líder Otro</th>
              <th className="p-4 border text-center">Total Empleados</th>
              <th className="p-4 border text-center">% Líder Mujer</th>
              <th className="p-4 border text-center">% Líder Hombre</th>
              <th className="p-4 border text-center">% Líder Otro</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content">
            {filteredRows.map(row => (
              <tr key={row.id}>
                <td className="p-2 border text-center">{row.AÑO}</td>
                <td className="p-2 border text-center">{row.MES}</td>

                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={row["LIDER MUJER"]}
                    onChange={e =>
                      handleChange(row.id, "LIDER MUJER", e.target.value)
                    }
                    className="border rounded p-1 w-24 text-center"
                  />
                </td>

                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={row["LIDER HOMBRE"]}
                    onChange={e =>
                      handleChange(row.id, "LIDER HOMBRE", e.target.value)
                    }
                    className="border rounded p-1 w-24 text-center"
                  />
                </td>

                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={row["LIDER OTRO"]}
                    onChange={e =>
                      handleChange(row.id, "LIDER OTRO", e.target.value)
                    }
                    className="border rounded p-1 w-24 text-center"
                  />
                </td>

                <td className="p-2 border text-center">
                  {row["TOTAL EMPLEADOS"]}
                </td>
                <td className="p-2 border text-center">
                  {row["% LIDER MUJER"]}
                </td>
                <td className="p-2 border text-center">
                  {row["% LIDER HOMBRE"]}
                </td>
                <td className="p-2 border text-center">
                  {row["% LIDER OTRO"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
