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
    Año: 2024,
    Mes: "Abril",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Crédito, Comercial, Cartera",
    Recomendaciones: "Más casos prácticos",
  },
  {
    Año: 2024,
    Mes: "Mayo",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Crédito, Comercial, Cartera",
    Recomendaciones: "Más casos prácticos",
  },
  {
    Año: 2024,
    Mes: "Mayo",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Educación Financiera",
    Recomendaciones: "Utilizar mejores metodologías",
  },
  {
    Año: 2024,
    Mes: "Junio",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Riesgos",
    Recomendaciones: "Utilizar mejores metodologías",
  },
  {
    Año: 2024,
    Mes: "Julio",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Comunicaciones",
    Recomendaciones: "Utilizar videos para mayor afianzamiento",
  },
  {
    Año: 2024,
    Mes: "Agosto",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Comunicaciones",
    Recomendaciones: "Utilizar mejores metodologías",
  },
  {
    Año: 2024,
    Mes: "Septiembre",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Sarlaft",
    Recomendaciones: "Utilizar mejores metodologías",
  },
  {
    Año: 2024,
    Mes: "Octubre",
    NumeroFormadoresConRecomendacion: 0,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "100%",
    Formadores: "Ninguno",
    Recomendaciones: "Ninguno",
  },
  {
    Año: 2024,
    Mes: "Noviembre",
    NumeroFormadoresConRecomendacion: 0,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "100%",
    Formadores: "Ninguno",
    Recomendaciones: "Ninguno",
  },
  {
    Año: 2024,
    Mes: "Diciembre",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Auditoria",
    Recomendaciones: "Utilizar mejores metodologías",
  },
  {
    Año: 2024,
    Mes: "Diciembre",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Workmanager",
    Recomendaciones: "Más casos prácticos",
  },
  {
    Año: 2025,
    Mes: "Enero",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Comunicaciones",
    Recomendaciones: "Otro",
  },
  {
    Año: 2025,
    Mes: "Enero",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Sarlaft",
    Recomendaciones: "Utilizar mejores metodologías",
  },
  {
    Año: 2025,
    Mes: "Febrero",
    NumeroFormadoresConRecomendacion: 0,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "100%",
    Formadores: "Auditoria",
    Recomendaciones: "Utilizar mejores metodologías",
  },
  {
    Año: 2025,
    Mes: "Marzo",
    NumeroFormadoresConRecomendacion: 0,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "100%",
    Formadores: "Sarlaft",
    Recomendaciones: "Utilizar mejores metodologías",
  },
  {
    Año: 2025,
    Mes: "Abril",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Educación Financiera",
    Recomendaciones: "Utilizar videos para mayor afianzamiento",
  },
  {
    Año: 2025,
    Mes: "Abril",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Ing. Organizacional",
    Recomendaciones: "Utilizar videos para mayor afianzamiento",
  },
  {
    Año: 2025,
    Mes: "Mayo",
    NumeroFormadoresConRecomendacion: 1,
    TotalFormadores: 13,
    PorcentajeSatisfaccion: "92%",
    Formadores: "Ing. Organizacional",
    Recomendaciones: "Más casos prácticos",
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
        Satisfacción del Aprendizaje
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
                # Formadores con Recomendación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total Formadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Satisfacción
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Formadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Recomendaciones
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
                  {r.NumeroFormadoresConRecomendacion}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TotalFormadores}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.PorcentajeSatisfaccion}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Formadores}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Recomendaciones}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
