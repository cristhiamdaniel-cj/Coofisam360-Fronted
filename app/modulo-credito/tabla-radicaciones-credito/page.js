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
    radicadosCantidad: 110,
    radicadosPorcentaje: "16,63",
    aprobadosValor: "1.358.031.000",
    aprobadosCantidad: 67,
    aprobadosPorcentaje: "18,64",
    negadosValor: "200.000.000",
    negadosCantidad: 1,
    negadosPorcentaje: "31,29",
    aplazadosValor: "0",
    aplazadosCantidad: 0,
    aplazadosPorcentaje: "0,00",
    sinDecisionValor: "417.174.000",
    sinDecisionCantidad: 17,
    sinDecisionPorcentaje: "12,49",
  },
  {
    id: 2,
    radicadosCantidad: 33,
    radicadosPorcentaje: "5,16",
    aprobadosValor: "491.740.000",
    aprobadosCantidad: 22,
    aprobadosPorcentaje: "6,44",
    negadosValor: "0",
    negadosCantidad: 0,
    negadosPorcentaje: "0,00",
    aplazadosValor: "0",
    aplazadosCantidad: 0,
    aplazadosPorcentaje: "0,00",
    sinDecisionValor: "115.200.000",
    sinDecisionCantidad: 3,
    sinDecisionPorcentaje: "2,83",
  },
  {
    id: 3,
    radicadosCantidad: 25,
    radicadosPorcentaje: "3,79",
    aprobadosValor: "247.630.000",
    aprobadosCantidad: 10,
    aprobadosPorcentaje: "3,09",
    negadosValor: "60.000.000",
    negadosCantidad: 1,
    negadosPorcentaje: "13,76",
    aplazadosValor: "0",
    aplazadosCantidad: 0,
    aplazadosPorcentaje: "0,00",
    sinDecisionValor: "119.200.000",
    sinDecisionCantidad: 4,
    sinDecisionPorcentaje: "3,26",
  },
  {
    id: 4,
    radicadosCantidad: 47,
    radicadosPorcentaje: "5,84",
    aprobadosValor: "353.179.100",
    aprobadosCantidad: 29,
    aprobadosPorcentaje: "6,43",
    negadosValor: "0",
    negadosCantidad: 0,
    negadosPorcentaje: "0,00",
    aplazadosValor: "0",
    aplazadosCantidad: 0,
    aplazadosPorcentaje: "0,00",
    sinDecisionValor: "196.460.000",
    sinDecisionCantidad: 9,
    sinDecisionPorcentaje: "6,25",
  },
  {
    id: 5,
    radicadosCantidad: 46,
    radicadosPorcentaje: "6,40",
    aprobadosValor: "352.650.000",
    aprobadosCantidad: 25,
    aprobadosPorcentaje: "5,88",
    negadosValor: "6.500.000",
    negadosCantidad: 1,
    negadosPorcentaje: "7,06",
    aplazadosValor: "20.000.000",
    aplazadosCantidad: 1,
    aplazadosPorcentaje: "25,79",
    sinDecisionValor: "301.890.000",
    sinDecisionCantidad: 10,
    sinDecisionPorcentaje: "8,20",
  },
  {
    id: 6,
    radicadosCantidad: 23,
    radicadosPorcentaje: "3,28",
    aprobadosValor: "277.070.000",
    aprobadosCantidad: 13,
    aprobadosPorcentaje: "3,71",
    negadosValor: "0",
    negadosCantidad: 0,
    negadosPorcentaje: "0,00",
    aplazadosValor: "0",
    aplazadosCantidad: 0,
    aplazadosPorcentaje: "0,00",
    sinDecisionValor: "72.000.000",
    sinDecisionCantidad: 5,
    sinDecisionPorcentaje: "2,91",
  },
  {
    id: 7,
    radicadosCantidad: 38,
    radicadosPorcentaje: "6,17",
    aprobadosValor: "650.765.000",
    aprobadosCantidad: 21,
    aprobadosPorcentaje: "7,41",
    negadosValor: "99.600.000",
    negadosCantidad: 1,
    negadosPorcentaje: "18,72",
    aplazadosValor: "0",
    aplazadosCantidad: 0,
    aplazadosPorcentaje: "0,00",
    sinDecisionValor: "26.900.000",
    sinDecisionCantidad: 4,
    sinDecisionPorcentaje: "1,87",
  },
  {
    id: 8,
    radicadosCantidad: 65,
    radicadosPorcentaje: "8,89",
    aprobadosValor: "522.457.800",
    aprobadosCantidad: 27,
    aprobadosPorcentaje: "7,34",
    negadosValor: "10.500.000",
    negadosCantidad: 1,
    negadosPorcentaje: "7,56",
    aplazadosValor: "14.235.000",
    aplazadosCantidad: 1,
    aplazadosPorcentaje: "21,96",
    sinDecisionValor: "404.944.000",
    sinDecisionCantidad: 14,
    sinDecisionPorcentaje: "11,22",
  },
  {
    id: 9,
    radicadosCantidad: 23,
    radicadosPorcentaje: "4,48",
    aprobadosValor: "203.059.000",
    aprobadosCantidad: 11,
    aprobadosPorcentaje: "2,92",
    negadosValor: "0",
    negadosCantidad: 0,
    negadosPorcentaje: "0,00",
    aplazadosValor: "0",
    aplazadosCantidad: 0,
    aplazadosPorcentaje: "0,00",
    sinDecisionValor: "380.200.000",
    sinDecisionCantidad: 10,
    sinDecisionPorcentaje: "9,38",
  },
  {
    id: 10,
    radicadosCantidad: 30,
    radicadosPorcentaje: "3,99",
    aprobadosValor: "362.948.000",
    aprobadosCantidad: 14,
    aprobadosPorcentaje: "4,45",
    negadosValor: "0",
    negadosCantidad: 0,
    negadosPorcentaje: "0,00",
    aplazadosValor: "6.000.000",
    aplazadosCantidad: 1,
    aplazadosPorcentaje: "16,49",
    sinDecisionValor: "40.720.000",
    sinDecisionCantidad: 7,
    sinDecisionPorcentaje: "3,17",
  },
  {
    id: 11,
    radicadosCantidad: 59,
    radicadosPorcentaje: "7,11",
    aprobadosValor: "496.012.000",
    aprobadosCantidad: 11,
    aprobadosPorcentaje: "4,96",
    negadosValor: "1.500.000",
    negadosCantidad: 1,
    negadosPorcentaje: "6,44",
    aplazadosValor: "0",
    aplazadosCantidad: 0,
    aplazadosPorcentaje: "0,00",
    sinDecisionValor: "160.385.000",
    sinDecisionCantidad: 12,
    sinDecisionPorcentaje: "6,80",
  },
  {
    id: 12,
    radicadosCantidad: 45,
    radicadosPorcentaje: "6,41",
    aprobadosValor: "288.119.000",
    aprobadosCantidad: 24,
    aprobadosPorcentaje: "5,29",
    negadosValor: "0",
    negadosCantidad: 0,
    negadosPorcentaje: "0,00",
    aplazadosValor: "0",
    aplazadosCantidad: 0,
    aplazadosPorcentaje: "0,00",
    sinDecisionValor: "427.490.000",
    sinDecisionCantidad: 11,
    sinDecisionPorcentaje: "10,46",
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
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Radicaciones de Crédito
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
              <th className="p-4 border text-center whitespace-nowrap">
                RADICADOS_CANTIDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                RADICADOS_%
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                APROBADOS_VALOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                APROBADOS_CANTIDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                APROBADOS_%
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NEGADOS_VALOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NEGADOS_CANTIDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NEGADOS_%
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                APLAZADOS_VALOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                APLAZADOS_CANTIDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                APLAZADOS_%
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                SIN DECISION_VALOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                SIN DECISION_CANTIDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                SIN DECISION_%
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.radicadosCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.radicadosPorcentaje}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.aprobadosValor}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.aprobadosCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.aprobadosPorcentaje}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.negadosValor}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.negadosCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.negadosPorcentaje}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.aplazadosValor}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.aplazadosCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.aplazadosPorcentaje}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.sinDecisionValor}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.sinDecisionCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.sinDecisionPorcentaje}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
