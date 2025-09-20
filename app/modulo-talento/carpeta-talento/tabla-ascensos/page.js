"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { useMemo } from "react";

const initialRows = [
  // 2024 - DICIEMBRE
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 1,
    "OFICINA O SUBGERENCIA": "GARZON",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 19,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 2,
    "OFICINA O SUBGERENCIA": "GUADALUPE",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 5,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 3,
    "OFICINA O SUBGERENCIA": "PITAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 12,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 4,
    "OFICINA O SUBGERENCIA": "GIGANTE",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 6,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 5,
    "OFICINA O SUBGERENCIA": "ACEVEDO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 5,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 6,
    "OFICINA O SUBGERENCIA": "TARQUI",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 4,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 7,
    "OFICINA O SUBGERENCIA": "LA PLATA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 4,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 8,
    "OFICINA O SUBGERENCIA": "PITALITO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 4,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 9,
    "OFICINA O SUBGERENCIA": "SUAZA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 5,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 10,
    "OFICINA O SUBGERENCIA": "LA ARGENTINA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 4,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 11,
    "OFICINA O SUBGERENCIA": "NEIVA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 6,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 12,
    "OFICINA O SUBGERENCIA": "RIVERA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 9,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 13,
    "OFICINA O SUBGERENCIA": "HOBO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 7,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 14,
    "OFICINA O SUBGERENCIA": "IQUIRA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 8,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 15,
    "OFICINA O SUBGERENCIA": "SALADOBLANCO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 8,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 16,
    "OFICINA O SUBGERENCIA": "ESPINAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 6,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 17,
    "OFICINA O SUBGERENCIA": "PLANADAS",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 8,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 18,
    "OFICINA O SUBGERENCIA": "CHAPARRAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 13,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 19,
    "OFICINA O SUBGERENCIA": "FLORENCIA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 7,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },
  {
    AÑO: 2024,
    MES: "DICIEMBRE",
    "ID-OFICINA": 99,
    "OFICINA O SUBGERENCIA": "DIRECCION GENERAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 81,
    "% VARIACIÓN": "0%",
    PROMEDIO: "0%",
  },

  // 2025 - ENERO (PROMEDIO for ENERO computed across Jan YTD -> "2%")
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 1,
    "OFICINA O SUBGERENCIA": "GARZON",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 19,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 2,
    "OFICINA O SUBGERENCIA": "GUADALUPE",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 8,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 3,
    "OFICINA O SUBGERENCIA": "PITAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 7,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 4,
    "OFICINA O SUBGERENCIA": "GIGANTE",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 8,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 5,
    "OFICINA O SUBGERENCIA": "ACEVEDO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 8,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 6,
    "OFICINA O SUBGERENCIA": "TARQUI",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 6,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 7,
    "OFICINA O SUBGERENCIA": "LA PLATA",
    CANTIDAD: 1,
    "TOTAL EMPLEADOS": 9,
    "% VARIACIÓN": "11%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 8,
    "OFICINA O SUBGERENCIA": "PITALITO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 13,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 9,
    "OFICINA O SUBGERENCIA": "SUAZA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 8,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 10,
    "OFICINA O SUBGERENCIA": "LA ARGENTINA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 4,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 11,
    "OFICINA O SUBGERENCIA": "NEIVA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 12,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 12,
    "OFICINA O SUBGERENCIA": "RIVERA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 6,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 13,
    "OFICINA O SUBGERENCIA": "HOBO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 5,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 14,
    "OFICINA O SUBGERENCIA": "IQUIRA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 4,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 15,
    "OFICINA O SUBGERENCIA": "SALADOBLANCO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 4,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 16,
    "OFICINA O SUBGERENCIA": "ESPINAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 4,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 17,
    "OFICINA O SUBGERENCIA": "PLANADAS",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 5,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 18,
    "OFICINA O SUBGERENCIA": "CHAPARRAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 4,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 19,
    "OFICINA O SUBGERENCIA": "FLORENCIA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 6,
    "% VARIACIÓN": "0%",
    PROMEDIO: "2%",
  },
  {
    AÑO: 2025,
    MES: "ENERO",
    "ID-OFICINA": 99,
    "OFICINA O SUBGERENCIA": "DIRECCION GENERAL",
    CANTIDAD: 2,
    "TOTAL EMPLEADOS": 77,
    "% VARIACIÓN": "3%",
    PROMEDIO: "2%",
  },

  // 2025 - FEBRERO (PROMEDIO for FEBRERO computed across Jan+Feb YTD -> "1%")
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 1,
    "OFICINA O SUBGERENCIA": "GARZON",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 22,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 2,
    "OFICINA O SUBGERENCIA": "GUADALUPE",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 9,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 3,
    "OFICINA O SUBGERENCIA": "PITAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 8,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 4,
    "OFICINA O SUBGERENCIA": "GIGANTE",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 9,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 5,
    "OFICINA O SUBGERENCIA": "ACEVEDO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 9,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 6,
    "OFICINA O SUBGERENCIA": "TARQUI",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 8,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 7,
    "OFICINA O SUBGERENCIA": "LA PLATA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 9,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 8,
    "OFICINA O SUBGERENCIA": "PITALITO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 13,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 9,
    "OFICINA O SUBGERENCIA": "SUAZA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 9,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 10,
    "OFICINA O SUBGERENCIA": "LA ARGENTINA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 6,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 11,
    "OFICINA O SUBGERENCIA": "NEIVA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 13,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 12,
    "OFICINA O SUBGERENCIA": "RIVERA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 7,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 13,
    "OFICINA O SUBGERENCIA": "HOBO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 6,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 14,
    "OFICINA O SUBGERENCIA": "IQUIRA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 5,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 15,
    "OFICINA O SUBGERENCIA": "SALADOBLANCO",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 5,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 16,
    "OFICINA O SUBGERENCIA": "ESPINAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 6,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 17,
    "OFICINA O SUBGERENCIA": "PLANADAS",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 5,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 18,
    "OFICINA O SUBGERENCIA": "CHAPARRAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 5,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 19,
    "OFICINA O SUBGERENCIA": "FLORENCIA",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 7,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
  {
    AÑO: 2025,
    MES: "FEBRERO",
    "ID-OFICINA": 99,
    "OFICINA O SUBGERENCIA": "DIRECCION GENERAL",
    CANTIDAD: 0,
    "TOTAL EMPLEADOS": 72,
    "% VARIACIÓN": "0%",
    PROMEDIO: "1%",
  },
];

export default function GestionesTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState([]);
  const [search, setSearch] = useState("");

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

  const grouped = useMemo(() => {
    const map = {};
    for (const row of rows) {
      const key = `${row.AÑO}-${row.MES}`;
      if (!map[key]) map[key] = [];
      map[key].push(row);
    }
    return map;
  }, [rows]);

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Ascensos
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <div className="search-bar flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por codigo u oficina"
              className="border w-[300px] px-2 py-1"
            />
          </div>
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
                ID-Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Oficina o Subgerencia
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total Empleados
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Variación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Promedio
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content">
            {Object.entries(grouped).map(([groupKey, groupRows]) =>
              groupRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-2 border text-center">{row.AÑO}</td>
                  <td className="p-2 border text-center">{row.MES}</td>
                  <td className="p-2 border text-center">
                    {row["ID-OFICINA"]}
                  </td>
                  <td className="p-2 border text-center">
                    {row["OFICINA O SUBGERENCIA"]}
                  </td>

                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      value={row.CANTIDAD}
                      onChange={e =>
                        handleChange(row.id, "CANTIDAD", e.target.value)
                      }
                      className="border rounded p-1 w-20 text-center"
                    />
                  </td>

                  <td className="p-2 border text-center whitespace-nowrap">
                    {row["TOTAL EMPLEADOS"]}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    {row["% VARIACIÓN"]}
                  </td>

                  {idx === 0 && (
                    <td
                      className="p-2 border text-center"
                      rowSpan={groupRows.length}
                    >
                      {row.PROMEDIO}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
