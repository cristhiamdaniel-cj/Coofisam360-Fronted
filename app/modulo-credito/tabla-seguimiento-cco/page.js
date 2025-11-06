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
    cod: 1,
    oficina: "GARZON",
    cch: "15.694.000",
    cchCantidad: "",
    cViv: "458.000.000",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "1.295.740.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "292.940.000",
    cMayorMontoCantidad: "",
    cCCart: "0",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "56.385.000",
    fngEmp285Cantidad: "",
  },
  {
    id: 2,
    cod: 2,
    oficina: "GUADALUPE",
    cch: "5.600.000",
    cchCantidad: "",
    cViv: "149.000.000",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "239.000.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "278.600.000",
    cMayorMontoCantidad: "",
    cCCart: "36.000.000",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "0",
    fngEmp285Cantidad: "",
  },
  {
    id: 3,
    cod: 3,
    oficina: "PITAL",
    cch: "0",
    cchCantidad: "",
    cViv: "0",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "28.000.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "56.000.000",
    cMayorMontoCantidad: "",
    cCCart: "21.530.000",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "0",
    fngEmp285Cantidad: "",
  },
  {
    id: 4,
    cod: 4,
    oficina: "GIGANTE",
    cch: "0",
    cchCantidad: "",
    cViv: "0",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "504.500.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "161.600.000",
    cMayorMontoCantidad: "",
    cCCart: "72.500.000",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "0",
    fngEmp285Cantidad: "",
  },
  {
    id: 5,
    cod: 5,
    oficina: "ACEVEDO",
    cch: "10.000.000",
    cchCantidad: "",
    cViv: "0",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "93.300.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "153.940.000",
    cMayorMontoCantidad: "",
    cCCart: "71.070.000",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "0",
    fngEmp285Cantidad: "",
  },
  {
    id: 6,
    cod: 6,
    oficina: "TARQUI",
    cch: "0",
    cchCantidad: "",
    cViv: "0",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "60.000.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "0",
    cMayorMontoCantidad: "",
    cCCart: "0",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "0",
    fngEmp285Cantidad: "",
  },
  {
    id: 7,
    cod: 7,
    oficina: "LA PLATA",
    cch: "0",
    cchCantidad: "",
    cViv: "80.000.000",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "347.900.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "0",
    cMayorMontoCantidad: "",
    cCCart: "140.200.000",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "0",
    fngEmp285Cantidad: "",
  },
  {
    id: 8,
    cod: 8,
    oficina: "PITALITO",
    cch: "3.000.000",
    cchCantidad: "",
    cViv: "0",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "245.000.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "477.245.000",
    cMayorMontoCantidad: "",
    cCCart: "24.675.000",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "0",
    fngEmp285Cantidad: "",
  },
  {
    id: 9,
    cod: 9,
    oficina: "SUAZA",
    cch: "0",
    cchCantidad: "",
    cViv: "0",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "213.300.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "0",
    cMayorMontoCantidad: "",
    cCCart: "0",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "0",
    fngEmp285Cantidad: "",
  },
  {
    id: 10,
    cod: 10,
    oficina: "LA ARGENTINA",
    cch: "3.350.000",
    cchCantidad: "",
    cViv: "0",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "562.400.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "0",
    cMayorMontoCantidad: "",
    cCCart: "0",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "30.550.000",
    fngEmp285Cantidad: "",
  },
  {
    id: 11,
    cod: 11,
    oficina: "NEIVA",
    cch: "12.190.000",
    cchCantidad: "",
    cViv: "100.000.000",
    cVivCantidad: "",
    cTyC: "0",
    cTyCCantidad: "",
    cLibCIGG: "541.900.000",
    cLibCIGGCantidad: "",
    cMayorMonto: "132.000.000",
    cMayorMontoCantidad: "",
    cCCart: "20.000.000",
    cCCartCantidad: "",
    fngEmp255: "0",
    fngEmp255Cantidad: "",
    fngEmp285: "0",
    fngEmp285Cantidad: "",
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
        Seguimiento de campañas de crédito
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
              <th className="p-4 border text-center whitespace-nowrap">COD</th>
              <th className="p-4 border text-center whitespace-nowrap">
                OFICINA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">CCH</th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                C_VIV
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                C_T&amp;C
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                C_LibCIGG
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                C&gt;Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                C_CCart
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FNG - EMP255
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FNG - EMP285
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {initialRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cod}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.oficina}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cch}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cchCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cViv}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cVivCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cTyC}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cTyCCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cLibCIGG}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cLibCIGGCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cMayorMonto}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cMayorMontoCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cCCart}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.cCCartCantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.fngEmp255}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.fngEmp255Cantidad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.fngEmp285}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.fngEmp285Cantidad}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
