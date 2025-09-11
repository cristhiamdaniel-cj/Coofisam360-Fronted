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
    Año: 2025,
    Mes: "ENERO",
    DiasAusenciaPropios: 103,
    DiasAusenciaContratistas: 0,
    TotalDiasIncapacidad: 103,
    DiasLaboralesMes: 25,
    NumeroTrabajadores: 217,
    DiasTrabajoProgramados: 5425,
    AusentismoLaboral: "1,90%",
  },
  {
    Año: 2025,
    Mes: "FEBRERO",
    DiasAusenciaPropios: 101,
    DiasAusenciaContratistas: 0,
    TotalDiasIncapacidad: 101,
    DiasLaboralesMes: 24,
    NumeroTrabajadores: 232,
    DiasTrabajoProgramados: 5568,
    AusentismoLaboral: "1,81%",
  },
  {
    Año: 2025,
    Mes: "MARZO",
    DiasAusenciaPropios: 96,
    DiasAusenciaContratistas: 0,
    TotalDiasIncapacidad: 96,
    DiasLaboralesMes: 25,
    NumeroTrabajadores: 208,
    DiasTrabajoProgramados: 5200,
    AusentismoLaboral: "1,85%",
  },
  {
    Año: 2025,
    Mes: "ABRIL",
    DiasAusenciaPropios: 92,
    DiasAusenciaContratistas: 0,
    TotalDiasIncapacidad: 92,
    DiasLaboralesMes: 25,
    NumeroTrabajadores: 212,
    DiasTrabajoProgramados: 5300,
    AusentismoLaboral: "1,74%",
  },
  {
    Año: 2025,
    Mes: "MAYO",
    DiasAusenciaPropios: 106,
    DiasAusenciaContratistas: 0,
    TotalDiasIncapacidad: 106,
    DiasLaboralesMes: 26,
    NumeroTrabajadores: 212,
    DiasTrabajoProgramados: 5512,
    AusentismoLaboral: "1,92%",
  },
  {
    Año: 2025,
    Mes: "JUNIO",
    DiasAusenciaPropios: 64,
    DiasAusenciaContratistas: 30,
    TotalDiasIncapacidad: 94,
    DiasLaboralesMes: 21,
    NumeroTrabajadores: 206,
    DiasTrabajoProgramados: 4326,
    AusentismoLaboral: "2,17%",
  },
  {
    Año: 2025,
    Mes: "JULIO",
    DiasAusenciaPropios: 0,
    DiasAusenciaContratistas: 0,
    TotalDiasIncapacidad: 0,
    DiasLaboralesMes: 0,
    NumeroTrabajadores: 0,
    DiasTrabajoProgramados: 0,
    AusentismoLaboral: "0,00%",
  },
  {
    Año: 2025,
    Mes: "AGOSTO",
    DiasAusenciaPropios: 0,
    DiasAusenciaContratistas: 0,
    TotalDiasIncapacidad: 0,
    DiasLaboralesMes: 0,
    NumeroTrabajadores: 0,
    DiasTrabajoProgramados: 0,
    AusentismoLaboral: "0,00%",
  },
  {
    Año: 2025,
    Mes: "SEPTIEMBRE",
    DiasAusenciaPropios: 0,
    DiasAusenciaContratistas: 0,
    TotalDiasIncapacidad: 0,
    DiasLaboralesMes: 0,
    NumeroTrabajadores: 0,
    DiasTrabajoProgramados: 0,
    AusentismoLaboral: "0,00%",
  },
  {
    Año: 2025,
    Mes: "OCTUBRE",
    DiasAusenciaPropios: 0,
    DiasAusenciaContratistas: 0,
    TotalDiasIncapacidad: 0,
    DiasLaboralesMes: 0,
    NumeroTrabajadores: 0,
    DiasTrabajoProgramados: 0,
    AusentismoLaboral: "0,00%",
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
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-8">
        Ausentismo
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
              <th className="p-4 border text-center whitespace-nowrap">Mes</th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Ausencia Propios
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Ausencia Contratistas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total Días Incapacidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Laborales Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Trabajadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Trabajo Programados
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Ausentismo Laboral
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Año}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Mes}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.DiasAusenciaPropios}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.DiasAusenciaContratistas}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TotalDiasIncapacidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.DiasLaboralesMes}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.NumeroTrabajadores}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.DiasTrabajoProgramados}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.AusentismoLaboral}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
