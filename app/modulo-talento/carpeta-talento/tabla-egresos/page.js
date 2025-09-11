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
    AÑO: 2024,
    MES: "NOVIEMBRE",
    OFICINA: "CHAPARRRAL",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 2,
    AÑO: 2024,
    MES: "NOVIEMBRE",
    OFICINA: "FLORENCIA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 3,
    AÑO: 2024,
    MES: "NOVIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "AUXILIAR CONTABILIDAD",
    CANTIDAD: 1,
    MOTIVO: "RENUNCIA VOLUNTARIA",
  },
  {
    id: 4,
    AÑO: 2024,
    MES: "NOVIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "APRENDIZ ETAPA PRODUCTIVA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 5,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "GARZON",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 6,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "GUADALUPE",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 7,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "EL PITAL",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 8,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "GIGANTE",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 9,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "ACEVEDO",
    CARGO: "SUPERNUMERIO DE OFICINA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 10,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "TARQUI",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 11,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "LA PLATA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 12,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "PITALITO",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 13,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "SUAZA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 14,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "LA ARGENTINA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 15,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "NEIVA",
    CARGO: "SUPERNUMERIO DE OFICINA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 16,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "RIVERA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 17,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "HOBO",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 18,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "IQUIRA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 19,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "SALADOBLANCO",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 20,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "ESPINAL",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 21,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "PLANADAS",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 22,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "CHAPARRRAL",
    CARGO: "DIRECTOR OFICINA",
    CANTIDAD: 1,
    MOTIVO: "RENUNCIA VOLUNTARIA",
  },
  {
    id: 23,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "CHAPARRRAL",
    CARGO: "ASESOR COMERCIAL CORRESPONSAL SOLIDARIO",
    CANTIDAD: 1,
    MOTIVO: "RENUNCIA VOLUNTARIA",
  },
  {
    id: 24,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "FLORENCIA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 25,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "AUXILIAR JURIDICO",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 26,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "APRENDIZ ETAPA PRODUCTIVA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 27,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "GESTOR COMERCIAL",
    CANTIDAD: 1,
    MOTIVO: "RENUNCIA VOLUNTARIA",
  },
  {
    id: 28,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "AUXILIAR SEGURIDAD Y SALUD EN EL TRABAJO",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO SIN JUSTA CAUSA",
  },
  {
    id: 29,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "AUXILIAR AUDITORIA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 30,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "SUPERNUMERIO DE OFICINA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
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
        Egresos
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
              <th className="p-4 border text-center">Año</th>
              <th className="p-4 border text-center">Mes</th>
              <th className="p-4 border text-center">Oficina</th>
              <th className="p-4 border text-center">Cargo</th>
              <th className="p-4 border text-center">Cantidad</th>
              <th className="p-4 border text-center">Motivo</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content">
            {rows.map(row => (
              <tr key={row.id}>
                <td className="p-2 border text-center">{row.AÑO}</td>
                <td className="p-2 border text-center">{row.MES}</td>
                <td className="p-2 border text-center">{row.OFICINA}</td>

                <td className="p-2 border text-center">{row.CARGO}</td>

                <td className="p-2 border text-center">{row.CANTIDAD}</td>

                <td className="p-2 border text-center">{row.MOTIVO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
