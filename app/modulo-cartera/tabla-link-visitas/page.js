"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Array of objects
const initialRows = [
  {
    id: 1,
    agencia: "1",
    numeroCredito: "1954639",
    lineaCredito: "CON LIBRE INVERSION",
    numeroIdentificacion: "1007359328",
    nombreAsociado: "Hary Julieth Vanegas Perez",
    saldoCapital: "$ 1.547.692",
    diasMora: "73",
    periodicidadCapital: "Mensual",
  },
  {
    id: 2,
    agencia: "1",
    numeroCredito: "1955016",
    lineaCredito: "MIC EMPRESARIAL",
    numeroIdentificacion: "1010165792",
    nombreAsociado: "Monica Andrea Almario Santos",
    saldoCapital: "$ 4.311.927",
    diasMora: "28",
    periodicidadCapital: "Mensual",
  },
  {
    id: 3,
    agencia: "1",
    numeroCredito: "1956398",
    lineaCredito: "MIC EMPRESARIAL",
    numeroIdentificacion: "1077842480",
    nombreAsociado: "Wiliam Andres Vargas Meneses",
    saldoCapital: "$ 1.496.064",
    diasMora: "32",
    periodicidadCapital: "Mensual",
  },
  {
    id: 4,
    agencia: "1",
    numeroCredito: "1956782",
    lineaCredito: "CON LIBRE INVERSION",
    numeroIdentificacion: "1077860520",
    nombreAsociado: "Yenifer  Silva Romero",
    saldoCapital: "$ 8.260.805",
    diasMora: "28",
    periodicidadCapital: "Mensual",
  },
  {
    id: 5,
    agencia: "1",
    numeroCredito: "1957192",
    lineaCredito: "MIC AGROPECUARIO",
    numeroIdentificacion: "1077873916",
    nombreAsociado: "Yesid  Quinayas Quinayas",
    saldoCapital: "$ 1.062.585",
    diasMora: "32",
    periodicidadCapital: "Semestral",
  },
  {
    id: 6,
    agencia: "1",
    numeroCredito: "1964696",
    lineaCredito: "PRO POP.PROD.RURAL OTRAS INVERSIONES",
    numeroIdentificacion: "12196308",
    nombreAsociado: "Sandro  Ramirez Cardozo",
    saldoCapital: "$ 1.455.733",
    diasMora: "92",
    periodicidadCapital: "Semestral",
  },
  {
    id: 7,
    agencia: "1",
    numeroCredito: "1974398",
    lineaCredito: "PRO PROD.RURAL FINAGRO IBR + 4.8 PEQ.PROD ING.BAJ",
    numeroIdentificacion: "55061046",
    nombreAsociado: "Betsabe  Angarita Dussan",
    saldoCapital: "$ 2.500.000",
    diasMora: "0",
    periodicidadCapital: "Semestral",
  },
  {
    id: 8,
    agencia: "1",
    numeroCredito: "1975664",
    lineaCredito: "CON LIBRE INVERSION",
    numeroIdentificacion: "55163168",
    nombreAsociado: "Yicela  Dussan Tovar",
    saldoCapital: "$ 18.365.912",
    diasMora: "32",
    periodicidadCapital: "Semestral",
  },
  {
    id: 9,
    agencia: "1",
    numeroCredito: "1987455",
    lineaCredito: "CON LIBRE INVERSION",
    numeroIdentificacion: "1077862498",
    nombreAsociado: "Juan Camilo Cuenca Pastrana",
    saldoCapital: "$ 3.323.009",
    diasMora: "103",
    periodicidadCapital: "Mensual",
  },
  {
    id: 10,
    agencia: "1",
    numeroCredito: "1992221",
    lineaCredito: "PRO POP. PROD  RURAL SOBRE APORTES",
    numeroIdentificacion: "12190934",
    nombreAsociado: "Evelio  Ciceri Silva",
    saldoCapital: "$ 357.969",
    diasMora: "32",
    periodicidadCapital: "Mensual",
  },
  {
    id: 11,
    agencia: "1",
    numeroCredito: "1993889",
    lineaCredito: "CON SOBRE APORTES",
    numeroIdentificacion: "12203020",
    nombreAsociado: "Albeiro  Eraso Cuellar",
    saldoCapital: "$ 382.163",
    diasMora: "18",
    periodicidadCapital: "Mensual",
  },
  {
    id: 12,
    agencia: "1",
    numeroCredito: "1994674",
    lineaCredito: "CUPO ROTATIVO CORTE 5",
    numeroIdentificacion: "26482563",
    nombreAsociado: "Analiber  Noriega Chavarro",
    saldoCapital: "$ 1.894.134",
    diasMora: "28",
    periodicidadCapital: "Mensual",
  },
  {
    id: 13,
    agencia: "1",
    numeroCredito: "1997717",
    lineaCredito: "CUPO ROTATIVO CORTE 5",
    numeroIdentificacion: "1077841130",
    nombreAsociado: "Santiago Stiven Parra Cadena",
    saldoCapital: "$ 4.524.645",
    diasMora: "58",
    periodicidadCapital: "Mensual",
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
        Link de visitas
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
              <th className="p-4 border text-center whitespace-nowrap">ID</th>
              <th className="p-4 border text-center whitespace-nowrap">
                Agencia
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Crédito
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                Línea de Crédito
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Identificación
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                Nombre Asociado
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Saldo Capital
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Mora
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Periodicidad Capital
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {initialRows.map(row => (
              <tr key={row.id}>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.id}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.agencia}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.numeroCredito}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.lineaCredito}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.numeroIdentificacion}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.nombreAsociado}
                </td>
                <td className="p-2 border text-right whitespace-nowrap">
                  {row.saldoCapital}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.diasMora}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.periodicidadCapital}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
