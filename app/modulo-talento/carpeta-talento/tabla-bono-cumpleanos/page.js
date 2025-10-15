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
  {
    AÑO: 2025,
    MES: "ENERO",
    "CANTIDAD EMPLEADOS": 217,
    "CANTIDAD BENEFICIADOS": 16,
    "VALOR BONO": 170000,
    "TOTAL BONO": 2720000,
    "% VARIACIÓN": "7,37%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "CANTIDAD EMPLEADOS": 233,
    "CANTIDAD BENEFICIADOS": 18,
    "VALOR BONO": 170000,
    "TOTAL BONO": 3060000,
    "% VARIACIÓN": "7,73%",
  },
  {
    AÑO: 2025,
    MES: "MARZO",
    "CANTIDAD EMPLEADOS": 208,
    "CANTIDAD BENEFICIADOS": 26,
    "VALOR BONO": 170000,
    "TOTAL BONO": 4420000,
    "% VARIACIÓN": "12,50%",
  },
  {
    AÑO: 2025,
    MES: "ABRIL",
    "CANTIDAD EMPLEADOS": 212,
    "CANTIDAD BENEFICIADOS": 14,
    "VALOR BONO": 170000,
    "TOTAL BONO": 2380000,
    "% VARIACIÓN": "6,60%",
  },
  {
    AÑO: 2025,
    MES: "MAYO",
    "CANTIDAD EMPLEADOS": 212,
    "CANTIDAD BENEFICIADOS": 12,
    "VALOR BONO": 170000,
    "TOTAL BONO": 2040000,
    "% VARIACIÓN": "5,66%",
  },
  {
    AÑO: 2025,
    MES: "JUNIO",
    "CANTIDAD EMPLEADOS": 206,
    "CANTIDAD BENEFICIADOS": 16,
    "VALOR BONO": 170000,
    "TOTAL BONO": 2720000,
    "% VARIACIÓN": "7,77%",
  },
  {
    AÑO: 2025,
    MES: "JULIO",
    "CANTIDAD EMPLEADOS": 204,
    "CANTIDAD BENEFICIADOS": 15,
    "VALOR BONO": 170000,
    "TOTAL BONO": 2550000,
    "% VARIACIÓN": "7,35%",
  },
];

export default function GestionesTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState([]);
  const [search, setSearch] = useState("");

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
        Bono de Cumpleaños
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <div className="search-bar flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por codigo u oficina"
              className="unified-input w-[300px]"
            />
          </div>
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

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th className="p-4 border text-center">Año</th>
              <th className="p-4 border text-center">Mes</th>
              <th className="p-4 border text-center">Cantidad Empleados</th>
              <th className="p-4 border text-center">Cantidad Beneficiados</th>
              <th className="p-4 border text-center">Valor Bono</th>
              <th className="p-4 border text-center">Total Bono</th>
              <th className="p-4 border text-center">% Variación</th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content">
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-center">{row.AÑO}</td>
                <td className="p-2 border text-center">{row.MES}</td>
                <td className="p-2 border text-center">
                  {row["CANTIDAD EMPLEADOS"]}
                </td>
                <td className="p-2 border text-center">
                  {row["CANTIDAD BENEFICIADOS"]}
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={row["VALOR BONO"]}
                    onChange={e =>
                      handleChange(idx, "VALOR BONO", e.target.value)
                    }
                    className="px-2 py-1 w-full border"
                  />
                </td>
                <td className="p-2 border text-center">{row["TOTAL BONO"]}</td>
                <td className="p-2 border text-center">{row["% VARIACIÓN"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
