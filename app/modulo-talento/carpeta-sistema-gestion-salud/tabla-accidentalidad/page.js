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
    Mes: "Enero",
    TipoVinculacion: "Propios",
    NumeroTrabajadores: 217,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 103,
    DiasCargados: 0,
    Indicador: "I.S",
    Resultado: "43.5%",
  },
  {
    Año: 2025,
    Mes: "Enero",
    TipoVinculacion: "Contratistas",
    NumeroTrabajadores: 20,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 0,
    DiasCargados: 0,
    Indicador: "I.F",
    Resultado: "0.0%",
  },
  {
    Año: 2025,
    Mes: "Enero",
    TipoVinculacion: "Propios y contratistas",
    NumeroTrabajadores: 237,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 103,
    DiasCargados: 0,
    Indicador: "AT MORTALES",
    Resultado: "0%",
  },
  {
    Año: 2025,
    Mes: "Febrero",
    TipoVinculacion: "Propios",
    NumeroTrabajadores: 233,
    AccidentesTrabajo: 2,
    AtMortales: 0,
    DiasIncapacidad: 101,
    DiasCargados: 0,
    Indicador: "I.S",
    Resultado: "39.9%",
  },
  {
    Año: 2025,
    Mes: "Febrero",
    TipoVinculacion: "Contratistas",
    NumeroTrabajadores: 20,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 0,
    DiasCargados: 0,
    Indicador: "I.F",
    Resultado: "0.0%",
  },
  {
    Año: 2025,
    Mes: "Febrero",
    TipoVinculacion: "Propios y contratistas",
    NumeroTrabajadores: 253,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 101,
    DiasCargados: 0,
    Indicador: "AT MORTALES",
    Resultado: "0%",
  },
  {
    Año: 2025,
    Mes: "Marzo",
    TipoVinculacion: "Propios",
    NumeroTrabajadores: 208,
    AccidentesTrabajo: 1,
    AtMortales: 0,
    DiasIncapacidad: 4,
    DiasCargados: 0,
    Indicador: "I.S",
    Resultado: "1.8%",
  },
  {
    Año: 2025,
    Mes: "Marzo",
    TipoVinculacion: "Contratistas",
    NumeroTrabajadores: 20,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 0,
    DiasCargados: 0,
    Indicador: "I.F",
    Resultado: "0.0%",
  },
  {
    Año: 2025,
    Mes: "Marzo",
    TipoVinculacion: "Propios y contratistas",
    NumeroTrabajadores: 228,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 4,
    DiasCargados: 0,
    Indicador: "AT MORTALES",
    Resultado: "0%",
  },
  {
    Año: 2025,
    Mes: "Abril",
    TipoVinculacion: "Propios",
    NumeroTrabajadores: 212,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 3,
    DiasCargados: 0,
    Indicador: "I.S",
    Resultado: "1.29%",
  },
  {
    Año: 2025,
    Mes: "Abril",
    TipoVinculacion: "Contratistas",
    NumeroTrabajadores: 20,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 0,
    DiasCargados: 0,
    Indicador: "I.F",
    Resultado: "0.0%",
  },
  {
    Año: 2025,
    Mes: "Abril",
    TipoVinculacion: "Propios y contratistas",
    NumeroTrabajadores: 232,
    AccidentesTrabajo: 0,
    AtMortales: 0,
    DiasIncapacidad: 3,
    DiasCargados: 0,
    Indicador: "AT MORTALES",
    Resultado: "0%",
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
    <main className="pt-4 pb-0 px-12">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Accidentalidad
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[230px]">
                Tipo de Vinculación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Trabajadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Nº Accidentes de Trabajo
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                At Mortales
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días de Incapacidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Cargados
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                Indicador
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Resultado
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
                  <select
                    value={r.TipoVinculacion}
                    onChange={e => {
                      handleChange(idx, "TipoVinculacion", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["Propios", "Contratistas", "Propios y Contratistas"].map(
                      opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.NumeroTrabajadores}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.AccidentesTrabajo}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.AtMortales}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.DiasIncapacidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.DiasCargados}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Indicador}
                    onChange={e => {
                      handleChange(idx, "Indicador", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["I.S", "I.F", "AT MORTALES"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Resultado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
