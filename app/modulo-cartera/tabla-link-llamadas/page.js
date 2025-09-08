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
    agencia: "1",
    usuarioGestor: "JOSE DAVID GOMEZ VARGAS",
    numeroIdentificacion: "1003965540",
    nombreAsociado: "Mario Adolfo Lopez Bustos",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1953492",
    saldoCapital: "$ 720.100",
    periodicidadCapital: "Mensual",
    diasMora: 3,
    calificacionArrastre: "A",
  },
  {
    id: 2,
    agencia: "1",
    usuarioGestor: "CRISTIAN GEOVANNY LEON MONTAÑO",
    numeroIdentificacion: "1004253645",
    nombreAsociado: "Maria Del Carmen Erazo",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1953909",
    saldoCapital: "$ 2.521.418",
    periodicidadCapital: "Mensual",
    diasMora: 3,
    calificacionArrastre: "A",
  },
  {
    id: 3,
    agencia: "1",
    usuarioGestor: "JOSE EDGAR VARGAS LOSADA",
    numeroIdentificacion: "1006459223",
    nombreAsociado: "Nodier Fernando Martinez Bonilla",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1954348",
    saldoCapital: "$ 8.324.286",
    periodicidadCapital: "Mensual",
    diasMora: 33,
    calificacionArrastre: "C",
  },
  {
    id: 4,
    agencia: "1",
    usuarioGestor: "JOSE DAVID GOMEZ VARGAS",
    numeroIdentificacion: "1007334256",
    nombreAsociado: "Anderson  Bermeo Serrato",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1954603",
    saldoCapital: "$ 729.570",
    periodicidadCapital: "Mensual",
    diasMora: 3,
    calificacionArrastre: "A",
  },
  {
    id: 5,
    agencia: "1",
    usuarioGestor: "JOSE EDGAR VARGAS LOSADA",
    numeroIdentificacion: "1007342198",
    nombreAsociado: "Veronica Andrea Lobaton Martinez",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1954614",
    saldoCapital: "$ 1.037.577",
    periodicidadCapital: "Mensual",
    diasMora: 3,
    calificacionArrastre: "A",
  },
  {
    id: 6,
    agencia: "1",
    usuarioGestor: "KAREN DAYANNA CERQUERA CABRERA",
    numeroIdentificacion: "1007359328",
    nombreAsociado: "Hary Julieth Vanegas Perez",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1954639",
    saldoCapital: "$ 1.547.692",
    periodicidadCapital: "Mensual",
    diasMora: 74,
    calificacionArrastre: "C",
  },
  {
    id: 7,
    agencia: "1",
    usuarioGestor: "KAREN DAYANNA CERQUERA CABRERA",
    numeroIdentificacion: "1007371122",
    nombreAsociado: "Diana Carolina Cadena Arrigui",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1954666",
    saldoCapital: "$ 2.880.147",
    periodicidadCapital: "Mensual",
    diasMora: 33,
    calificacionArrastre: "B",
  },
  {
    id: 8,
    agencia: "1",
    usuarioGestor: "JOSE DAVID GOMEZ VARGAS",
    numeroIdentificacion: "1007416369",
    nombreAsociado: "Matilde  Ramirez Murillo",
    lineaCredito: "PRO POP.PROD.URBANO FINAGRO EMPRESARIAL 28%",
    numeroCredito: "1954696",
    saldoCapital: "$ 1.418.483",
    periodicidadCapital: "Mensual",
    diasMora: 3,
    calificacionArrastre: "A",
  },
  {
    id: 9,
    agencia: "1",
    usuarioGestor: "CRISTIAN GEOVANNY LEON MONTAÑO",
    numeroIdentificacion: "1007416380",
    nombreAsociado: "Conny Fernanda Prada Bustos",
    lineaCredito: "PRO POP.PROD.RURAL OTRAS INVERSIONES",
    numeroCredito: "1954698",
    saldoCapital: "$ 769.880",
    periodicidadCapital: "Mensual",
    diasMora: 63,
    calificacionArrastre: "C",
  },
  {
    id: 10,
    agencia: "1",
    usuarioGestor: "CRISTIAN GEOVANNY LEON MONTAÑO",
    numeroIdentificacion: "1007419848",
    nombreAsociado: "Maria Teresa Benavides Quiza",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1954705",
    saldoCapital: "$ 3.214.703",
    periodicidadCapital: "Mensual",
    diasMora: 3,
    calificacionArrastre: "B",
  },
  {
    id: 11,
    agencia: "1",
    usuarioGestor: "JOSE DAVID GOMEZ VARGAS",
    numeroIdentificacion: "1007419951",
    nombreAsociado: "Ricardo  Trujillo Trujillo",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1954707",
    saldoCapital: "$ 5.270.494",
    periodicidadCapital: "Mensual",
    diasMora: 14,
    calificacionArrastre: "A",
  },
  {
    id: 12,
    agencia: "1",
    usuarioGestor: "JOSE EDGAR VARGAS LOSADA",
    numeroIdentificacion: "1007524886",
    nombreAsociado: "Gabriela  Diaz Almario",
    lineaCredito: "MIC EMPRESARIAL",
    numeroCredito: "1954770",
    saldoCapital: "$ 1.992.842",
    periodicidadCapital: "Mensual",
    diasMora: 19,
    calificacionArrastre: "A",
  },
  {
    id: 13,
    agencia: "1",
    usuarioGestor: "CRISTIAN DANIEL MONJE FIERRO",
    numeroIdentificacion: "1007677692",
    nombreAsociado: "Davis Andres Cediel Bejarano",
    lineaCredito: "CON LIBRE INVERSION",
    numeroCredito: "1954846",
    saldoCapital: "$ 720.980",
    periodicidadCapital: "Mensual",
    diasMora: 3,
    calificacionArrastre: "A",
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
        Link de llamadas
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
                Agencia
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                Usuario Gestor
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Identificación
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                Nombre Asociado
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                Línea de Crédito
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Crédito
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Saldo Capital
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Periodicidad Capital
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Mora
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Calificación Arrastre
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.agencia}</td>
                <td className="p-2 border text-center">{r.usuarioGestor}</td>
                <td className="p-2 border text-center">
                  {r.numeroIdentificacion}
                </td>
                <td className="p-2 border text-center">{r.nombreAsociado}</td>
                <td className="p-2 border text-center">{r.lineaCredito}</td>
                <td className="p-2 border text-center">{r.numeroCredito}</td>
                <td className="p-2 border text-center">{r.saldoCapital}</td>
                <td className="p-2 border text-center">
                  {r.periodicidadCapital}
                </td>
                <td className="p-2 border text-center">{r.diasMora}</td>
                <td className="p-2 border text-center">
                  {r.calificacionArrastre}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
