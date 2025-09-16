

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
    nombreCampaña:
      "Condiciones de Crédito para Microempresarios Convenio Interinstitucional con Cámara de Comercio del Huila",
    numeroCircular: "CIGG-046 de 2024",
    modalidad: "Camara de Comercio",
    codigo: "CCH",
    vigenciaDesde: "",
    vigenciaHasta: "30/11/2025",
    recursosDisponibles: "80.000.000",
    numeroOp: "",
    valorDesembolsos: "26.281.521",
    porcentajeAvance: "33%",
    estado: "Abierta",
    recursosDisponiblesFinal: "53.718.479",
  },
  {
    id: 2,
    nombreCampaña: "Campaña especial de credito Tu vivienda una realidad",
    numeroCircular: "CIGG-067 de 2024",
    modalidad: "Compra de Vivienda",
    codigo: "C_VIV",
    vigenciaDesde: "30/12/2024",
    vigenciaHasta: "",
    recursosDisponibles: "1.500.000.000",
    numeroOp: "6",
    valorDesembolsos: "787.000.000",
    porcentajeAvance: "52%",
    estado: "Abierta",
    recursosDisponiblesFinal: "713.000.000",
  },
  {
    id: 3,
    nombreCampaña:
      "Condiciones de Crédito para Microempresarios de los Departamentos de Tolima y Caquetá",
    numeroCircular: "CIGG-013 de 2025",
    modalidad: "Campaña Tolima y Caquetá",
    codigo: "C_T&C",
    vigenciaDesde: "04/03/2025",
    vigenciaHasta: "31/12/2025",
    recursosDisponibles: "2.000.000.000",
    numeroOp: "19",
    valorDesembolsos: "126.823.000",
    porcentajeAvance: "6%",
    estado: "Abierta",
    recursosDisponiblesFinal: "1.873.177.000",
  },
  {
    id: 4,
    nombreCampaña: "Condiciones Campaña Especial de Libranza",
    numeroCircular: "CIGG-027 de 2025",
    modalidad: "Convenio de Libranza",
    codigo: "C_LibCIGG",
    vigenciaDesde: "05/05/2025",
    vigenciaHasta: "",
    recursosDisponibles: "6.500.000.000",
    numeroOp: "195",
    valorDesembolsos: "6.422.474.000",
    porcentajeAvance: "99%",
    estado: "Abierta",
    recursosDisponiblesFinal: "77.526.000",
  },
  {
    id: 5,
    nombreCampaña:
      "Campaña Especial Crédito a tu medida, Toma el control de tus Deudas 2025",
    numeroCircular: "CIGG-34 de 2025",
    modalidad: "Productivo Mayor Monto",
    codigo: "C>Monto",
    vigenciaDesde: "05/06/2026",
    vigenciaHasta: "31/08/2025",
    recursosDisponibles: "2.000.000.000",
    numeroOp: "46",
    valorDesembolsos: "2.112.325.000",
    porcentajeAvance: "106%",
    estado: "Abierta",
    recursosDisponiblesFinal: "-112.325.000",
  },
  {
    id: 6,
    nombreCampaña: "",
    numeroCircular: "",
    modalidad: "Compra de Cartera",
    codigo: "C_CCart",
    vigenciaDesde: "",
    vigenciaHasta: "31/08/2025",
    recursosDisponibles: "3.000.000.000",
    numeroOp: "19",
    valorDesembolsos: "452.975.000",
    porcentajeAvance: "15%",
    estado: "Abierta",
    recursosDisponiblesFinal: "2.547.025.000",
  },
  {
    id: 7,
    nombreCampaña: "Garantias Avales",
    numeroCircular: "CIGG-035 de  2025",
    modalidad: "EMP-255",
    codigo: "FNG - EMP255",
    vigenciaDesde: "05/06/2026",
    vigenciaHasta: "",
    recursosDisponibles: "0",
    numeroOp: "0",
    valorDesembolsos: "0",
    porcentajeAvance: "0%",
    estado: "Abierta",
    recursosDisponiblesFinal: "0",
  },
  {
    id: 8,
    nombreCampaña: "",
    numeroCircular: "",
    modalidad: "EMP-285",
    codigo: "FNG - EMP285",
    vigenciaDesde: "05/06/2026",
    vigenciaHasta: "",
    recursosDisponibles: "1.500.000.000",
    numeroOp: "8",
    valorDesembolsos: "86.935.000",
    porcentajeAvance: "6%",
    estado: "Abierta",
    recursosDisponiblesFinal: "1.413.065.000",
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
        Seguimiento de campañas de crédito x oficinas
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[400px]">
                NOMBRE DE LA CAMPAÑA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                N° CIRCULAR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MODALIDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CODIGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VIGENCIA DESDE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VIGENCIA HASTA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                RECURSOS DISPONIBLES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                N° OP
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR DESEMBOLSOS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % AVANCE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                RECURSOS DISPONIBLES
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {initialRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-left ">{r.nombreCampaña}</td>
                <td className="p-2 border text-left ">{r.numeroCircular}</td>
                <td className="p-2 border text-left ">{r.modalidad}</td>
                <td className="p-2 border text-left ">{r.codigo}</td>
                <td className="p-2 border text-left ">{r.vigenciaDesde}</td>
                <td className="p-2 border text-left ">{r.vigenciaHasta}</td>
                <td className="p-2 border text-left ">
                  {r.recursosDisponibles}
                </td>
                <td className="p-2 border text-left ">{r.numeroOp}</td>
                <td className="p-2 border text-left ">{r.valorDesembolsos}</td>
                <td className="p-2 border text-left ">{r.porcentajeAvance}</td>
                <td className="p-2 border text-left ">{r.estado}</td>
                <td className="p-2 border text-left ">
                  {r.recursosDisponiblesFinal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
