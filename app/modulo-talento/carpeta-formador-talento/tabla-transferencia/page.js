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
    Comprension: 3.9,
    Practica: 3.5,
    RetencionConocimiento: 4.5,
    ValoracionDesempeno: 3.5,
    SatisfaccionTrabajador: 4.2,
    Total: 19.6,
    EfectividadTransferencia: 3.92,
  },
  {
    Año: 2024,
    Mes: "Mayo",
    Comprension: 3.0,
    Practica: 3.0,
    RetencionConocimiento: 3.0,
    ValoracionDesempeno: 3.5,
    SatisfaccionTrabajador: 4.2,
    Total: 16.7,
    EfectividadTransferencia: 3.34,
  },
  {
    Año: 2024,
    Mes: "Junio",
    Comprension: 4.5,
    Practica: 4.5,
    RetencionConocimiento: 4.5,
    ValoracionDesempeno: 4.5,
    SatisfaccionTrabajador: 4.2,
    Total: 22.2,
    EfectividadTransferencia: 4.44,
  },
  {
    Año: 2024,
    Mes: "Julio",
    Comprension: 4.0,
    Practica: 4.8,
    RetencionConocimiento: 4.0,
    ValoracionDesempeno: 4.5,
    SatisfaccionTrabajador: 4.2,
    Total: 21.5,
    EfectividadTransferencia: 4.3,
  },
  {
    Año: 2024,
    Mes: "Agosto",
    Comprension: 3.8,
    Practica: 3.5,
    RetencionConocimiento: 3.7,
    ValoracionDesempeno: 4.0,
    SatisfaccionTrabajador: 4.2,
    Total: 19.2,
    EfectividadTransferencia: 3.84,
  },
  {
    Año: 2024,
    Mes: "Septiembre",
    Comprension: 4.5,
    Practica: 4.8,
    RetencionConocimiento: 4.5,
    ValoracionDesempeno: 4.3,
    SatisfaccionTrabajador: 4.2,
    Total: 22.3,
    EfectividadTransferencia: 4.46,
  },
  {
    Año: 2024,
    Mes: "Octubre",
    Comprension: 3.9,
    Practica: 4.8,
    RetencionConocimiento: 3.9,
    ValoracionDesempeno: 4.5,
    SatisfaccionTrabajador: 5.0,
    Total: 22.1,
    EfectividadTransferencia: 4.42,
  },
  {
    Año: 2024,
    Mes: "Noviembre",
    Comprension: 4.0,
    Practica: 4.5,
    RetencionConocimiento: 4.5,
    ValoracionDesempeno: 4.5,
    SatisfaccionTrabajador: 5.0,
    Total: 22.5,
    EfectividadTransferencia: 4.5,
  },
  {
    Año: 2024,
    Mes: "Diciembre",
    Comprension: 4.0,
    Practica: 4.8,
    RetencionConocimiento: 4.1,
    ValoracionDesempeno: 4.6,
    SatisfaccionTrabajador: 4.2,
    Total: 21.7,
    EfectividadTransferencia: 4.34,
  },
  {
    Año: 2025,
    Mes: "Enero",
    Comprension: 4.3,
    Practica: 4.8,
    RetencionConocimiento: 4.0,
    ValoracionDesempeno: 4.4,
    SatisfaccionTrabajador: 4.2,
    Total: 21.7,
    EfectividadTransferencia: 4.34,
  },
  {
    Año: 2025,
    Mes: "Febrero",
    Comprension: 4.4,
    Practica: 5.0,
    RetencionConocimiento: 4.1,
    ValoracionDesempeno: 4.3,
    SatisfaccionTrabajador: 5.0,
    Total: 22.8,
    EfectividadTransferencia: 4.56,
  },
  {
    Año: 2025,
    Mes: "Marzo",
    Comprension: 4.3,
    Practica: 4.2,
    RetencionConocimiento: 3.9,
    ValoracionDesempeno: 4.6,
    SatisfaccionTrabajador: 5.0,
    Total: 22.0,
    EfectividadTransferencia: 4.4,
  },
  {
    Año: 2025,
    Mes: "Abril",
    Comprension: 4.4,
    Practica: 2.0,
    RetencionConocimiento: 3.9,
    ValoracionDesempeno: 2.7,
    SatisfaccionTrabajador: 4.2,
    Total: 17.2,
    EfectividadTransferencia: 3.44,
  },
];

export default function GestionesTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState([]);

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
        Transferencia del Conocimiento
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
                Comprensión
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Práctica
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Retención del Conocimiento
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Valoración Desempeño
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Satisfacción del Trabajador
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Efectividad Transferencia
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
                  <input
                    type="number"
                    step={0.1}
                    value={r.Comprension}
                    onChange={e => {
                      handleChange(idx, "Comprension", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    step={0.1}
                    value={r.Practica}
                    onChange={e => {
                      handleChange(idx, "Practica", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    step={0.1}
                    value={r.RetencionConocimiento}
                    onChange={e => {
                      handleChange(
                        idx,
                        "RetencionConocimiento",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    step={0.1}
                    value={r.ValoracionDesempeno}
                    onChange={e => {
                      handleChange(
                        idx,
                        "ValoracionesDesempeno",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    step={0.1}
                    value={r.SatisfaccionTrabajador}
                    onChange={e => {
                      handleChange(
                        idx,
                        "SatisfaccionTrabajador",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Total}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.EfectividadTransferencia}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
