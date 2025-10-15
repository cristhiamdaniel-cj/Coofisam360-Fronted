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
    id: 1,
    AÑO: 2023,
    MES: "DICIEMBRE",
    "CANTIDAD EMPLEADOS": 219,
    "CANTIDAD BENEFICIADOS": 121,
    "% VARIACIÓN": "55.25%",
  },
  {
    id: 2,
    AÑO: 2024,
    MES: "DICIEMBRE",
    "CANTIDAD EMPLEADOS": 221,
    "CANTIDAD BENEFICIADOS": 134,
    "% VARIACIÓN": "60.63%",
  },
  {
    id: 3,
    AÑO: 2025,
    MES: "DICIEMBRE",
    "CANTIDAD EMPLEADOS": "",
    "CANTIDAD BENEFICIADOS": "",
    "% VARIACIÓN": "",
  },
];

export default function GestionesTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState([]);
  const [search, setSearch] = useState("");

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
        Bonificación
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
              <th className="p-4 border text-center">% Variación</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content">
            {rows.map(row => (
              <tr key={row.id}>
                <td className="p-2 border text-center">{row.AÑO}</td>
                <td className="p-2 border text-center">{row.MES}</td>

                <td className="p-2 border text-center">
                  {row["CANTIDAD EMPLEADOS"]}
                </td>

                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={row["CANTIDAD BENEFICIADOS"]}
                    onChange={e =>
                      handleChange(
                        row.id,
                        "CANTIDAD BENEFICIADOS",
                        e.target.value
                      )
                    }
                    className="border rounded p-1 w-24 text-center"
                  />
                </td>

                <td className="p-2 border text-center">{row["% VARIACIÓN"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
