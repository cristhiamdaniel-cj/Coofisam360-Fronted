"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

const initialRows = [
  { DIMENSION: "COMPENSACION", "% DE CUMPLIMIENTO": "81%", AÑO: 2022 },
  { DIMENSION: "PARTICIPACION", "% DE CUMPLIMIENTO": "82%", AÑO: 2022 },
  { DIMENSION: "ORGANIZACIÓN Y APOYO", "% DE CUMPLIMIENTO": "82%", AÑO: 2022 },
  { DIMENSION: "TRABAJO EN EQUIPO", "% DE CUMPLIMIENTO": "88%", AÑO: 2022 },
  { DIMENSION: "LIDERAZGO", "% DE CUMPLIMIENTO": "90%", AÑO: 2022 },
  {
    DIMENSION: "MOTIVACION Y SATISFACCION",
    "% DE CUMPLIMIENTO": "76%",
    AÑO: 2022,
  },
  { DIMENSION: "COMUNICACIÓN", "% DE CUMPLIMIENTO": "76%", AÑO: 2022 },
  {
    DIMENSION: "DESARROLLO PROFESIONAL",
    "% DE CUMPLIMIENTO": "86%",
    AÑO: 2022,
  },
  {
    DIMENSION: "SENTIDO DE PERTENENCIA",
    "% DE CUMPLIMIENTO": "91%",
    AÑO: 2022,
  },
  {
    DIMENSION: "ESTRUCTURA ORGANIZACIONAL",
    "% DE CUMPLIMIENTO": "95%",
    AÑO: 2022,
  },
  {
    DIMENSION: "CONDICIONES DE  TRABAJO",
    "% DE CUMPLIMIENTO": "90%",
    AÑO: 2022,
  },
  { DIMENSION: "INTEGRIDAD", "% DE CUMPLIMIENTO": "86%", AÑO: 2022 },

  { DIMENSION: "COMPENSACION", "% DE CUMPLIMIENTO": "84%", AÑO: 2023 },
  { DIMENSION: "PARTICIPACION", "% DE CUMPLIMIENTO": "85%", AÑO: 2023 },
  { DIMENSION: "ORGANIZACIÓN Y APOYO", "% DE CUMPLIMIENTO": "84%", AÑO: 2023 },
  { DIMENSION: "TRABAJO EN EQUIPO", "% DE CUMPLIMIENTO": "83%", AÑO: 2023 },
  { DIMENSION: "LIDERAZGO", "% DE CUMPLIMIENTO": "88%", AÑO: 2023 },
  {
    DIMENSION: "MOTIVACION Y SATISFACCION",
    "% DE CUMPLIMIENTO": "76%",
    AÑO: 2023,
  },
  { DIMENSION: "COMUNICACIÓN", "% DE CUMPLIMIENTO": "76%", AÑO: 2023 },
  {
    DIMENSION: "DESARROLLO PROFESIONAL",
    "% DE CUMPLIMIENTO": "86%",
    AÑO: 2023,
  },
  {
    DIMENSION: "SENTIDO DE PERTENENCIA",
    "% DE CUMPLIMIENTO": "91%",
    AÑO: 2023,
  },
  {
    DIMENSION: "ESTRUCTURA ORGANIZACIONAL",
    "% DE CUMPLIMIENTO": "94%",
    AÑO: 2023,
  },
  {
    DIMENSION: "CONDICIONES DE  TRABAJO",
    "% DE CUMPLIMIENTO": "90%",
    AÑO: 2023,
  },
  { DIMENSION: "INTEGRIDAD", "% DE CUMPLIMIENTO": "90%", AÑO: 2023 },

  { DIMENSION: "COMPENSACION", "% DE CUMPLIMIENTO": "87%", AÑO: 2024 },
  { DIMENSION: "PARTICIPACION", "% DE CUMPLIMIENTO": "88%", AÑO: 2024 },
  { DIMENSION: "ORGANIZACIÓN Y APOYO", "% DE CUMPLIMIENTO": "88%", AÑO: 2024 },
  { DIMENSION: "TRABAJO EN EQUIPO", "% DE CUMPLIMIENTO": "89%", AÑO: 2024 },
  { DIMENSION: "LIDERAZGO", "% DE CUMPLIMIENTO": "90%", AÑO: 2024 },
  {
    DIMENSION: "MOTIVACION Y SATISFACCION",
    "% DE CUMPLIMIENTO": "91%",
    AÑO: 2024,
  },
  { DIMENSION: "COMUNICACIÓN", "% DE CUMPLIMIENTO": "91%", AÑO: 2024 },
  {
    DIMENSION: "DESARROLLO PROFESIONAL",
    "% DE CUMPLIMIENTO": "91%",
    AÑO: 2024,
  },
  {
    DIMENSION: "SENTIDO DE PERTENENCIA",
    "% DE CUMPLIMIENTO": "94%",
    AÑO: 2024,
  },
  {
    DIMENSION: "ESTRUCTURA ORGANIZACIONAL",
    "% DE CUMPLIMIENTO": "95%",
    AÑO: 2024,
  },
  {
    DIMENSION: "CONDICIONES DE  TRABAJO",
    "% DE CUMPLIMIENTO": "96%",
    AÑO: 2024,
  },
  { DIMENSION: "INTEGRIDAD", "% DE CUMPLIMIENTO": "98%", AÑO: 2024 },

  { DIMENSION: "COMPENSACION", "% DE CUMPLIMIENTO": "0%", AÑO: 2025 },
  { DIMENSION: "PARTICIPACION", "% DE CUMPLIMIENTO": "0%", AÑO: 2025 },
  { DIMENSION: "ORGANIZACIÓN Y APOYO", "% DE CUMPLIMIENTO": "0%", AÑO: 2025 },
  { DIMENSION: "TRABAJO EN EQUIPO", "% DE CUMPLIMIENTO": "0%", AÑO: 2025 },
  { DIMENSION: "LIDERAZGO", "% DE CUMPLIMIENTO": "0%", AÑO: 2025 },
  {
    DIMENSION: "MOTIVACION Y SATISFACCION",
    "% DE CUMPLIMIENTO": "0%",
    AÑO: 2025,
  },
  { DIMENSION: "COMUNICACIÓN", "% DE CUMPLIMIENTO": "0%", AÑO: 2025 },
  { DIMENSION: "DESARROLLO PROFESIONAL", "% DE CUMPLIMIENTO": "0%", AÑO: 2025 },
  { DIMENSION: "SENTIDO DE PERTENENCIA", "% DE CUMPLIMIENTO": "0%", AÑO: 2025 },
  {
    DIMENSION: "ESTRUCTURA ORGANIZACIONAL",
    "% DE CUMPLIMIENTO": "0%",
    AÑO: 2025,
  },
  {
    DIMENSION: "CONDICIONES DE  TRABAJO",
    "% DE CUMPLIMIENTO": "0%",
    AÑO: 2025,
  },
  { DIMENSION: "INTEGRIDAD", "% DE CUMPLIMIENTO": "0%", AÑO: 2025 },
];

export default function GestionesTable() {
  const [rows, setRows] = useState(initialRows);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();

  const handleChange = (index, field, value) => {
    // Convertir a número si es campo numérico

    // Actualizar rows usando el índice
    setRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });

    // Actualizar editedRows
    setEditedRows(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
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
          !selectedMonth || r.Mes.toUpperCase() === selectedMonth.toUpperCase();

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => Number(a.codigo) - Number(b.codigo));

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  // Obtener años únicos
  const uniqueYears = [...new Set(rows.map(r => r.AÑO).filter(Boolean))];

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

  const handleSave = async () => {
    console.log("Saving edits:", editedRows);

    // Example: send to backend
    /*
    await fetch("https://coofisam360.ngrok.io/api/update-records/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedRows),
    });
    */

    // clear edited state after saving
    setEditedRows({});
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
        Clima Laboral
      </h1>
      <div className="actions-container flex justify-between mb-4">
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
              className="unified-button flex gap-2 items-center justify-center"
            >
              Guardar cambios
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
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[60vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th className="p-4 border text-center">Dimensión</th>
              <th className="p-4 border text-center">% de Cumplimiento</th>
              <th className="p-4 border text-center">Año</th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content">
            {filteredRows.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-center">
                  <select
                    value={row.DIMENSION}
                    onChange={e => {
                      handleChange(idx, "DIMENSION", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "DIMENSION",
                      "COMPENSACION",
                      "PARTICIPACION",
                      "ORGANIZACIÓN Y APOYO",
                      "TRABAJO EN EQUIPO",
                      "LIDERAZGO",
                      "MOTIVACION Y SATISFACCION",
                      "COMUNICACIÓN",
                      "DESARROLLO PROFESIONAL",
                      "SENTIDO DE PERTENENCIA",
                      "ESTRUCTURA ORGANIZACIONAL",
                      "CONDICIONES DE TRABAJO",
                      "INTEGRIDAD",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-2 border text-center">
                  {row["% DE CUMPLIMIENTO"]}
                </td>
                <td className="p-2 border text-center">{row.AÑO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
