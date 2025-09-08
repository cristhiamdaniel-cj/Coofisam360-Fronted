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
    oficina: 17,
    pagareVirtualCop: 1962700,
    pagareOpa: 170780,
    cedula: "1106333969",
    nombre: "Aldair Lerma Tavera",
    saldoCapital: "13.198.810",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "01/07/2025",
    gestor: "DANIELA",
    honorarios: "1.391.762",
    abogado: "PAOLA PERDOMO",
  },
  {
    id: 2,
    oficina: 11,
    pagareVirtualCop: 1963854,
    pagareOpa: 5472,
    cedula: "12100975",
    nombre: "Luis Alfonso Macias",
    saldoCapital: "79.444",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "ABONO P.",
    fecha: "01/07/2025",
    gestor: "MARTHA",
    honorarios: "17.830",
    abogado: "MAGNOLIA ESPAÑA",
  },
  {
    id: 3,
    oficina: 11,
    pagareVirtualCop: 1956151,
    pagareOpa: 100871,
    cedula: "1075309754",
    nombre: "Daniela Mildrey Caballero García",
    saldoCapital: "208.724",
    capitalCondonado: "-",
    estadoObligacion: "CASTIGO-LIAN",
    novedad: "ABONO P.",
    fecha: "02/07/2025",
    gestor: "MARTHA",
    honorarios: "49.676",
    abogado: "N/A",
  },
  {
    id: 4,
    oficina: 11,
    pagareVirtualCop: 1971644,
    pagareOpa: 102006,
    cedula: "36312378",
    nombre: "Angela Pamela Racedo Osorio",
    saldoCapital: "2.072.305",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "02/07/2025",
    gestor: "MARTHA",
    honorarios: "354.104",
    abogado: "MAGNOLIA ESPAÑA",
  },
  {
    id: 5,
    oficina: 10,
    pagareVirtualCop: 1963497,
    pagareOpa: 27392,
    cedula: "1117819139",
    nombre: "Emir Montiel Ocampo",
    saldoCapital: "2.167.137",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "01/07/2025",
    gestor: "CAMILA",
    honorarios: "117.804",
    abogado: "YESSICA MATIZ",
  },
  {
    id: 6,
    oficina: 10,
    pagareVirtualCop: 1958538,
    pagareOpa: 18091,
    cedula: "1080262003",
    nombre: "Stephany Carolina Latorre Latorre",
    saldoCapital: "2.984.079",
    capitalCondonado: "994.693",
    estadoObligacion: "CASTIGO-LIAN",
    novedad: "PAZ Y SALVO",
    fecha: "02/07/2025",
    gestor: "CAMILA",
    honorarios: "710.211",
    abogado: "N/A",
  },
  {
    id: 7,
    oficina: 7,
    pagareVirtualCop: 1976808,
    pagareOpa: 7020860,
    cedula: "66951762",
    nombre: "Luz Arbely Bravo Golondrino",
    saldoCapital: "187.000",
    capitalCondonado: "-",
    estadoObligacion: "CASTIGO-COOFISAM",
    novedad: "ABONO P.",
    fecha: "04/07/2025",
    gestor: "PAOLA",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 8,
    oficina: 1,
    pagareVirtualCop: 1956570,
    pagareOpa: 1131342,
    cedula: "1077850351",
    nombre: "Monica Guevara Vargas",
    saldoCapital: "4.443.206",
    capitalCondonado: "-",
    estadoObligacion: "POSIBLE CASTIGO",
    novedad: "PAZ Y SALVO",
    fecha: "03/07/2025",
    gestor: "DANIELA",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 9,
    oficina: 12,
    pagareVirtualCop: 1971023,
    pagareOpa: 164512,
    cedula: "36180728",
    nombre: "Amanda Ortiz",
    saldoCapital: "6.873.626",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "04/07/2025",
    gestor: "CAMILA",
    honorarios: "291.415",
    abogado: "MAGNOLIA ESPAÑA",
  },
  {
    id: 10,
    oficina: 12,
    pagareVirtualCop: 1971022,
    pagareOpa: 163760,
    cedula: "36180728",
    nombre: "Amanda Ortiz",
    saldoCapital: "361.938",
    capitalCondonado: "-",
    estadoObligacion: "POSIBLE CASTIGO",
    novedad: "PAZ Y SALVO",
    fecha: "04/07/2025",
    gestor: "CAMILA",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 11,
    oficina: 7,
    pagareVirtualCop: 1958225,
    pagareOpa: 7021585,
    cedula: "1080183615",
    nombre: "Johanna Zamora Quintero",
    saldoCapital: "360.000",
    capitalCondonado: "-",
    estadoObligacion: "CASTIGO-COOFISAM",
    novedad: "ABONO P.",
    fecha: "04/07/2025",
    gestor: "PAOLA",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 12,
    oficina: 14,
    pagareVirtualCop: 1953590,
    pagareOpa: 144627,
    cedula: "1004074671",
    nombre: "Leyder Fabian Perdomo Leyton",
    saldoCapital: "1.353.573",
    capitalCondonado: "-",
    estadoObligacion: "POSIBLE CASTIGO",
    novedad: "PAZ Y SALVO",
    fecha: "04/07/2025",
    gestor: "INGRID",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 13,
    oficina: 3,
    pagareVirtualCop: 1967894,
    pagareOpa: 3046914,
    cedula: "26451097",
    nombre: "Sandra Volveras Rivera",
    saldoCapital: "3.401.200",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "05/07/2025",
    gestor: "MARTHA",
    honorarios: "1.160.391",
    abogado: "MAGNOLIA ESPAÑA",
  },
];

export default function Page() {
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
        Asignación de llamadas
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
          <thead className="tabla-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">
                Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Pagaré VirtualCop
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Pagaré OPA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cédula
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Nombre
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Saldo a Capital
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Capital Condonado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Estado de la Obligación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Novedad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Fecha
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestor
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Honorarios
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Abogado
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {initialRows.map(row => (
              <tr key={row.id}>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.oficina}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.pagareVirtualCop}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.pagareOpa}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.cedula}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.nombre}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.saldoCapital}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.capitalCondonado}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.estadoObligacion}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.novedad}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.fecha}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.gestor}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.honorarios}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {row.abogado}
                </td>
              </tr>
            ))}

            {/*records.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.amount}</td>
              <td>{r.description}</td>
            </tr>
          ))*/}
          </tbody>
        </table>
      </div>
    </main>
  );
}
