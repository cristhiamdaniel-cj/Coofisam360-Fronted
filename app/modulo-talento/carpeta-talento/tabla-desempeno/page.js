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
  { id: 1, "OFICINA O SUBGERENCIA": "GARZON", "% DESEMPEÑO": "90%", AÑO: 2024 },
  {
    id: 2,
    "OFICINA O SUBGERENCIA": "GUADALUPE",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  { id: 3, "OFICINA O SUBGERENCIA": "PITAL", "% DESEMPEÑO": "90%", AÑO: 2024 },
  {
    id: 4,
    "OFICINA O SUBGERENCIA": "ACEVEDO",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  { id: 5, "OFICINA O SUBGERENCIA": "TARQUI", "% DESEMPEÑO": "90%", AÑO: 2024 },
  {
    id: 6,
    "OFICINA O SUBGERENCIA": "LA PLATA",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 7,
    "OFICINA O SUBGERENCIA": "PITALITO",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  { id: 8, "OFICINA O SUBGERENCIA": "SUAZA", "% DESEMPEÑO": "90%", AÑO: 2024 },
  {
    id: 9,
    "OFICINA O SUBGERENCIA": "ARGENTINA",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  { id: 10, "OFICINA O SUBGERENCIA": "NEIVA", "% DESEMPEÑO": "90%", AÑO: 2024 },
  {
    id: 11,
    "OFICINA O SUBGERENCIA": "RIVERA",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  { id: 12, "OFICINA O SUBGERENCIA": "HOBO", "% DESEMPEÑO": "90%", AÑO: 2024 },
  {
    id: 13,
    "OFICINA O SUBGERENCIA": "IQUIRA",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 14,
    "OFICINA O SUBGERENCIA": "SALADOBLANCO",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 15,
    "OFICINA O SUBGERENCIA": "ESPINAL",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 16,
    "OFICINA O SUBGERENCIA": "PLANADAS",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 17,
    "OFICINA O SUBGERENCIA": "CHAPARRRAL",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 18,
    "OFICINA O SUBGERENCIA": "FLORENCIA",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 19,
    "OFICINA O SUBGERENCIA": "SUBGERENCIA INNOVACION EMPRESARIAL",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 20,
    "OFICINA O SUBGERENCIA": "SUBGERENCIA COMERCIAL",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 21,
    "OFICINA O SUBGERENCIA": "SUBGERENCIA CREDITO Y CARTERA",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 22,
    "OFICINA O SUBGERENCIA": "SUBGERENCIA FINANCIERA",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
  },
  {
    id: 23,
    "OFICINA O SUBGERENCIA": "GERENCIA",
    "% DESEMPEÑO": "90%",
    AÑO: 2024,
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
        Desempeño
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
              <th className="p-4 border text-center">Oficina o Subgerencia</th>
              <th className="p-4 border text-center">% Desempeño</th>
              <th className="p-4 border text-center">Año</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content">
            {rows.map(row => (
              <tr key={row.id}>
                <td className="p-2 border text-center">
                  {row["OFICINA O SUBGERENCIA"]}
                </td>
                <td className="p-2 border text-center">{row["% DESEMPEÑO"]}</td>
                <td className="p-2 border text-center">{row["AÑO"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
