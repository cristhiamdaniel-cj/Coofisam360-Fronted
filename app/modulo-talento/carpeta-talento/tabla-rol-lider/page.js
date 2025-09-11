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
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState([]);

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
    <main className="pt-12 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-12">
        Rol de Líder
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
            {rows.map(row => (
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
