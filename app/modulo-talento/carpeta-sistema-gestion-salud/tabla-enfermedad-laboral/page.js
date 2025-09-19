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
    anio: 2025,
    mes: "ENERO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 217,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "P -EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 2,
    anio: 2025,
    mes: "ENERO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 217,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "I - EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 3,
    anio: 2025,
    mes: "FEBRERO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 233,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "P -EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 4,
    anio: 2025,
    mes: "FEBRERO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 233,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "I - EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 5,
    anio: 2025,
    mes: "MARZO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 208,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "P -EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 6,
    anio: 2025,
    mes: "MARZO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 208,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "I - EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 7,
    anio: 2025,
    mes: "ABRIL",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 212,
    casosNuevosEL: 1,
    constante: "100.000",
    indicador: "P -EL",
    resultado: "471,7",
    codigoCIE10: "M77.1",
    clasificacionCIE: "Epicondilitis lateral, bilateral",
    clasificacionEnfermedadLaboral:
      "Enfermedades del sistema músculo-esquelético",
  },
  {
    id: 8,
    anio: 2025,
    mes: "ABRIL",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 212,
    casosNuevosEL: 1,
    constante: "100.000",
    indicador: "I - EL",
    resultado: "471,7",
    codigoCIE10: "M77.1",
    clasificacionCIE: "Epicondilitis lateral, bilateral",
    clasificacionEnfermedadLaboral:
      "Enfermedades del sistema músculo-esquelético",
  },
  {
    id: 9,
    anio: 2025,
    mes: "MAYO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 212,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "P -EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 10,
    anio: 2025,
    mes: "MAYO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 212,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "I - EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 11,
    anio: 2025,
    mes: "JUNIO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 206,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "P -EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 12,
    anio: 2025,
    mes: "JUNIO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 206,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "I - EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 13,
    anio: 2025,
    mes: "JULIO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 206,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "P -EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
  },
  {
    id: 14,
    anio: 2025,
    mes: "JULIO",
    casosAntiguosEL: 0,
    numeroTrabajadoresAnio: 206,
    casosNuevosEL: 0,
    constante: "100.000",
    indicador: "I - EL",
    resultado: "0,0",
    codigoCIE10: "",
    clasificacionCIE: "",
    clasificacionEnfermedadLaboral: "",
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
        Enfermedad Laboral
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
                Casos Antiguos de EL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                N° Trabajadores en el Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Casos Nuevos de EL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Constante
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Indicador
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Resultado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Código CIE-10
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Clasificación Internacional de Enfermedades
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Clasificación Enfermedad Laboral
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map(row => (
              <tr key={row.id}>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.anio}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.mes}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.casosAntiguosEL}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.numeroTrabajadoresAnio}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.casosNuevosEL}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.constante}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  <select
                    value={row.indicador}
                    onChange={e => {
                      handleChange(row.id, "indicador", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["P-EL", "I-EL"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.resultado}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.codigoCIE10}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.clasificacionCIE}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.clasificacionEnfermedadLaboral}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
