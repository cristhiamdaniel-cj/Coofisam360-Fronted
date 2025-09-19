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
    Mes: "ABRIL",
    TotalGastosTransferencia: 2940000,
    TrabajadoresCapacitados: 2,
    CostoPorTrabajador: "$1.470.000",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
  },
  {
    Año: 2024,
    Mes: "MAYO",
    TotalGastosTransferencia: "$3.450.000",
    TrabajadoresCapacitados: 2,
    CostoPorTrabajador: "$1.725.000",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
  },
  {
    Año: 2024,
    Mes: "JUNIO",
    TotalGastosTransferencia: "$-",
    TrabajadoresCapacitados: 1,
    CostoPorTrabajador: "$-",
    Modalidad: "Virtual",
    Rentabilidad: "Alta",
  },
  {
    Año: 2024,
    Mes: "JULIO",
    TotalGastosTransferencia: "$1.470.000",
    TrabajadoresCapacitados: 1,
    CostoPorTrabajador: "$1.470.000",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
  },
  {
    Año: 2024,
    Mes: "AGOSTO",
    TotalGastosTransferencia: "$-",
    TrabajadoresCapacitados: 4,
    CostoPorTrabajador: "$-",
    Modalidad: "Virtual",
    Rentabilidad: "Alta",
  },
  {
    Año: 2024,
    Mes: "SEPTIEMBRE",
    TotalGastosTransferencia: "$1.470.000",
    TrabajadoresCapacitados: 1,
    CostoPorTrabajador: "$1.470.000",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
  },
  {
    Año: 2024,
    Mes: "OCTUBRE",
    TotalGastosTransferencia: "$4.410.000",
    TrabajadoresCapacitados: 4,
    CostoPorTrabajador: "$1.102.500",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
  },
  {
    Año: 2024,
    Mes: "NOVIEMBRE",
    TotalGastosTransferencia: "$-",
    TrabajadoresCapacitados: 3,
    CostoPorTrabajador: "$-",
    Modalidad: "Virtual",
    Rentabilidad: "Alta",
  },
  {
    Año: 2024,
    Mes: "DICIEMBRE",
    TotalGastosTransferencia: "$1.232.000",
    TrabajadoresCapacitados: 1,
    CostoPorTrabajador: "$1.232.000",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
  },
  {
    Año: 2025,
    Mes: "ENERO",
    TotalGastosTransferencia: "$1.470.000",
    TrabajadoresCapacitados: 2,
    CostoPorTrabajador: "$735.000",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
  },
  {
    Año: 2025,
    Mes: "FEBRERO",
    TotalGastosTransferencia: "$3.348.000",
    TrabajadoresCapacitados: 3,
    CostoPorTrabajador: "$1.116.000",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
  },
  {
    Año: 2025,
    Mes: "MARZO",
    TotalGastosTransferencia: "$2.678.000",
    TrabajadoresCapacitados: 2,
    CostoPorTrabajador: "$1.339.000",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
  },
  {
    Año: 2025,
    Mes: "ABRIL",
    TotalGastosTransferencia: "$905.000",
    TrabajadoresCapacitados: 1,
    CostoPorTrabajador: "$905.000",
    Modalidad: "Presencial",
    Rentabilidad: "Baja",
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
        Costo/Beneficio
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
                Total gastos en la transferencia de los conocimientos
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad Trabajadores Capacitados
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Costo x Trabajador Formado
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Modalidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Rentabilidad
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
                <td className="p-1 border text-left whitespace-nowrap w-full">
                  $
                  <input
                    type="number"
                    value={r.TotalGastosTransferencia}
                    onChange={e => {
                      handleChange(
                        idx,
                        "TotalGastosTransferencia",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TrabajadoresCapacitados}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.CostoPorTrabajador}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Modalidad}
                    onChange={e => {
                      handleChange(idx, "Modalidad", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["Virtual", "Presencial"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Rentabilidad}
                    onChange={e => {
                      handleChange(idx, "Rentabilidad", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["Baja", "Alta"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
