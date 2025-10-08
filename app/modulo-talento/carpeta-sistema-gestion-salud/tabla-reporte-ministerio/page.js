"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import {
  listReporteMinisterioRows,
  saveReporteMinisterioRow,
} from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/reporteMinisterioQuota";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await listReporteMinisterioRows({ limit: 500 });
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
      const idxs = Object.keys(editedRows).map(k => Number(k));
      for (const i of idxs) {
        const merged = { ...rows[i], ...(editedRows[i] || {}) };
        await saveReporteMinisterioRow(merged);
      }
      setEditedRows({});
      const data = await listReporteMinisterioRows({ limit: 500 });
      setRows(data);
    } catch (e) {}
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
        Reporte Ministerio
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input type="text" className="border w-[300px]" />
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
            Buscar
            <IoSearch />
          </button>
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
              <th className="p-4 border text-center whitespace-nowrap">Año</th>
              <th className="p-4 border text-center whitespace-nowrap">
                Recursos (10%)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestión Integral del SG-SST (15%)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestión de la Salud (20%)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestión de Peligros y Riesgos (30%)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestión de Amenazas (10%)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Verificación del SG-SST (5%)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Mejoramiento (10%)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Porcentaje
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.anio}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.recursos}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.gestionIntegral}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.gestionSalud}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.gestionPeligros}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.gestionAmenazas}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.verificacion}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.mejoramiento}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.porcentaje}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
