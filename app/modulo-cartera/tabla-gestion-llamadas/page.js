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
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 1,
    oficina: "GARZON",
    llamadasAsignadas: 1487,
    obligacionesAlDiaLlamadas: 378,
    llamadasAsignadasAlDia: 1109,
    gestionesEfectuadasLlamadas: 1393,
    cumplimientoLlamadas: "126%",
    visitasAsignadas: 55,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 55,
    gestionesEfectuadasVisitas: 203,
    cumplimientoVisitas: "369%",
  },
  {
    id: 2,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 2,
    oficina: "GUADALUPE",
    llamadasAsignadas: 525,
    obligacionesAlDiaLlamadas: 174,
    llamadasAsignadasAlDia: 351,
    gestionesEfectuadasLlamadas: 390,
    cumplimientoLlamadas: "111%",
    visitasAsignadas: 17,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 17,
    gestionesEfectuadasVisitas: 12,
    cumplimientoVisitas: "71%",
  },
  {
    id: 3,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 3,
    oficina: "PITAL",
    llamadasAsignadas: 484,
    obligacionesAlDiaLlamadas: 150,
    llamadasAsignadasAlDia: 334,
    gestionesEfectuadasLlamadas: 298,
    cumplimientoLlamadas: "89%",
    visitasAsignadas: 12,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 12,
    gestionesEfectuadasVisitas: 27,
    cumplimientoVisitas: "225%",
  },
  {
    id: 4,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 4,
    oficina: "GIGANTE",
    llamadasAsignadas: 551,
    obligacionesAlDiaLlamadas: 170,
    llamadasAsignadasAlDia: 381,
    gestionesEfectuadasLlamadas: 433,
    cumplimientoLlamadas: "114%",
    visitasAsignadas: 16,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 16,
    gestionesEfectuadasVisitas: 50,
    cumplimientoVisitas: "313%",
  },
  {
    id: 5,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 5,
    oficina: "ACEVEDO",
    llamadasAsignadas: 419,
    obligacionesAlDiaLlamadas: 103,
    llamadasAsignadasAlDia: 316,
    gestionesEfectuadasLlamadas: 354,
    cumplimientoLlamadas: "112%",
    visitasAsignadas: 11,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 11,
    gestionesEfectuadasVisitas: 17,
    cumplimientoVisitas: "155%",
  },
  {
    id: 6,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 6,
    oficina: "TARQUI",
    llamadasAsignadas: 323,
    obligacionesAlDiaLlamadas: 134,
    llamadasAsignadasAlDia: 189,
    gestionesEfectuadasLlamadas: 176,
    cumplimientoLlamadas: "93%",
    visitasAsignadas: 7,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 7,
    gestionesEfectuadasVisitas: 25,
    cumplimientoVisitas: "357%",
  },
  {
    id: 7,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 7,
    oficina: "LA PLATA",
    llamadasAsignadas: 477,
    obligacionesAlDiaLlamadas: 178,
    llamadasAsignadasAlDia: 299,
    gestionesEfectuadasLlamadas: 294,
    cumplimientoLlamadas: "98%",
    visitasAsignadas: 16,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 16,
    gestionesEfectuadasVisitas: 33,
    cumplimientoVisitas: "206%",
  },
  {
    id: 8,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 8,
    oficina: "PITALITO",
    llamadasAsignadas: 781,
    obligacionesAlDiaLlamadas: 250,
    llamadasAsignadasAlDia: 531,
    gestionesEfectuadasLlamadas: 534,
    cumplimientoLlamadas: "101%",
    visitasAsignadas: 34,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 34,
    gestionesEfectuadasVisitas: 40,
    cumplimientoVisitas: "118%",
  },
  {
    id: 9,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 9,
    oficina: "SUAZA",
    llamadasAsignadas: 317,
    obligacionesAlDiaLlamadas: 113,
    llamadasAsignadasAlDia: 204,
    gestionesEfectuadasLlamadas: 192,
    cumplimientoLlamadas: "94%",
    visitasAsignadas: 9,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 9,
    gestionesEfectuadasVisitas: 7,
    cumplimientoVisitas: "78%",
  },
];

export default function AsignacionLlamadasTable() {
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
        Gestión de llamadas
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
              <th className="p-4 border text-center whitespace-nowrap">Mes</th>
              <th className="p-4 border text-center whitespace-nowrap">Año</th>
              <th className="p-4 border text-center whitespace-nowrap">
                Código Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Llamadas Asignadas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Obligaciones al Día Llamadas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Llamadas Asignadas - Al Día
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestiones Efectuadas (Llamadas)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Cumplimiento Llamadas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Visitas Asignadas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Obligaciones al Día Visitas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Visitas Asignadas - Al Día
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestiones Efectuadas (Visitas)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Cumplimiento Visitas
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.mes}</td>
                <td className="p-2 border text-center">{r.anio}</td>
                <td className="p-2 border text-center">{r.codigoOficina}</td>
                <td className="p-2 border text-center">{r.oficina}</td>
                <td className="p-2 border text-center">
                  {r.llamadasAsignadas}
                </td>
                <td className="p-2 border text-center">
                  {r.obligacionesAlDiaLlamadas}
                </td>
                <td className="p-2 border text-center">
                  {r.llamadasAsignadasAlDia}
                </td>
                <td className="p-2 border text-center">
                  {r.gestionesEfectuadasLlamadas}
                </td>
                <td className="p-2 border text-center">
                  {r.cumplimientoLlamadas}
                </td>
                <td className="p-2 border text-center">{r.visitasAsignadas}</td>
                <td className="p-2 border text-center">
                  {r.obligacionesAlDiaVisitas}
                </td>
                <td className="p-2 border text-center">
                  {r.visitasAsignadasAlDia}
                </td>
                <td className="p-2 border text-center">
                  {r.gestionesEfectuadasVisitas}
                </td>
                <td className="p-2 border text-center">
                  {r.cumplimientoVisitas}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
