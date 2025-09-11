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
    Mes: "Abril",
    CantidadTrabajadores: 1,
    Oficina: "Gigante",
    Roles: "Asesores externos y barra",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 13,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "7%",
    NumeroVecesFormado: 3,
    Calificacion: 4,
  },
  {
    Año: 2024,
    Mes: "Abril",
    CantidadTrabajadores: 1,
    Oficina: "Pital",
    Roles: "Aprendiz Sena",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 13,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "7%",
    NumeroVecesFormado: 3,
    Calificacion: 3.9,
  },
  {
    Año: 2024,
    Mes: "Abril",
    CantidadTrabajadores: 1,
    Oficina: "Guadalupe",
    Roles: "Aprendiz Sena",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 13,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "7%",
    NumeroVecesFormado: 3,
    Calificacion: 3.9,
  },
  {
    Año: 2024,
    Mes: "Abril",
    CantidadTrabajadores: 1,
    Oficina: "Chaparral",
    Roles: "Jefe de Operaciones",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 13,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "7%",
    NumeroVecesFormado: 3,
    Calificacion: 3.9,
  },
  {
    Año: 2024,
    Mes: "Abril",
    CantidadTrabajadores: 1,
    Oficina: "Rivera",
    Roles: "Cajeros",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 13,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "7%",
    NumeroVecesFormado: 3,
    Calificacion: 3.9,
  },
  {
    Año: 2024,
    Mes: "Abril",
    CantidadTrabajadores: 1,
    Oficina: "Saladoblanco",
    Roles: "Asesores externos y barra",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 13,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "7%",
    NumeroVecesFormado: 3,
    Calificacion: 3.9,
  },
  {
    Año: 2024,
    Mes: "Abril",
    CantidadTrabajadores: 5,
    Oficina: "Direccion General",
    Roles: "Gestores de Cartera",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 13,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "7%",
    NumeroVecesFormado: 3,
    Calificacion: 3.9,
  },
  {
    Año: 2024,
    Mes: "Abril",
    CantidadTrabajadores: 1,
    Oficina: "Guadalupe",
    Roles: "Asesores externos y barra",
    TemaFormacion: "Habilidades Comerciales",
    TipoFormacion: "Entrenamiento",
    TotalParticipantes: 13,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "7%",
    NumeroVecesFormado: 3,
    Calificacion: 3.9,
  },
  {
    Año: 2024,
    Mes: "Abril",
    CantidadTrabajadores: 1,
    Oficina: "Planadas",
    Roles: "Jefe de Operaciones",
    TemaFormacion: "Habilidades operativas",
    TipoFormacion: "Entrenamiento",
    TotalParticipantes: 13,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "7%",
    NumeroVecesFormado: 3,
    Calificacion: 4.5,
  },
  {
    Año: 2024,
    Mes: "Mayo",
    CantidadTrabajadores: 180,
    Oficina: "Todo Coofisam",
    Roles: "Todos los roles",
    TemaFormacion: "Virtualcoop",
    TipoFormacion: "Capacitación Interna",
    TotalParticipantes: 180,
    TotalTrabajadores: 196,
    PorcentajeParticipacion: "92%",
    NumeroVecesFormado: 2,
    Calificacion: 3,
  },
  {
    Año: 2024,
    Mes: "Mayo",
    CantidadTrabajadores: 1,
    Oficina: "Garzón",
    Roles: "Asesores externos y barra",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 9,
    TotalTrabajadores: 196,
    PorcentajeParticipacion: "5%",
    NumeroVecesFormado: 2,
    Calificacion: 3,
  },
  {
    Año: 2024,
    Mes: "Mayo",
    CantidadTrabajadores: 2,
    Oficina: "Espinal",
    Roles: "Cajeros",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 9,
    TotalTrabajadores: 196,
    PorcentajeParticipacion: "5%",
    NumeroVecesFormado: 2,
    Calificacion: 3.1,
  },
  {
    Año: 2024,
    Mes: "Mayo",
    CantidadTrabajadores: 3,
    Oficina: "Acevedo",
    Roles: "Aprendiz Sena",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 9,
    TotalTrabajadores: 196,
    PorcentajeParticipacion: "5%",
    NumeroVecesFormado: 2,
    Calificacion: 3,
  },
  {
    Año: 2024,
    Mes: "Mayo",
    CantidadTrabajadores: 1,
    Oficina: "Dirección General",
    Roles: "Aprendiz Sena",
    TemaFormacion: "Competencias básicas, técnicas y específicas",
    TipoFormacion: "Inducción",
    TotalParticipantes: 9,
    TotalTrabajadores: 196,
    PorcentajeParticipacion: "5%",
    NumeroVecesFormado: 2,
    Calificacion: 3,
  },
  {
    Año: 2024,
    Mes: "Mayo",
    CantidadTrabajadores: 1,
    Oficina: "Fundacoofisam",
    Roles: "Todos los roles",
    TemaFormacion: "Portafolio de Servicios Coofisam y Fundacoofisam",
    TipoFormacion: "Reinducción",
    TotalParticipantes: 9,
    TotalTrabajadores: 196,
    PorcentajeParticipacion: "5%",
    NumeroVecesFormado: 2,
    Calificacion: 3.2,
  },
  {
    Año: 2024,
    Mes: "Mayo",
    CantidadTrabajadores: 1,
    Oficina: "La Plata",
    Roles: "Asesores externos y barra",
    TemaFormacion: "Habilidades comerciales y operativas",
    TipoFormacion: "Entrenamiento",
    TotalParticipantes: 9,
    TotalTrabajadores: 196,
    PorcentajeParticipacion: "5%",
    NumeroVecesFormado: 2,
    Calificacion: 3.1,
  },
  {
    Año: 2024,
    Mes: "Junio",
    CantidadTrabajadores: 187,
    Oficina: "Todo Coofisam",
    Roles: "Todos los roles",
    TemaFormacion: "Virtualcoop",
    TipoFormacion: "Capacitación Interna",
    TotalParticipantes: 188,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "99%",
    NumeroVecesFormado: 1,
    Calificacion: 4.5,
  },
  {
    Año: 2024,
    Mes: "Junio",
    CantidadTrabajadores: 1,
    Oficina: "Acevedo",
    Roles: "Cajeros",
    TemaFormacion: "Tips de concentración",
    TipoFormacion: "Reinducción",
    TotalParticipantes: 188,
    TotalTrabajadores: 189,
    PorcentajeParticipacion: "99%",
    NumeroVecesFormado: 1,
    Calificacion: 4.5,
  },
  {
    Año: 2024,
    Mes: "Julio",
    CantidadTrabajadores: 180,
    Oficina: "Todo Coofisam",
    Roles: "Todos los roles",
    TemaFormacion:
      "Imagen Corporativa, Comunicaciones, Fortalecimiento Comercial y Crédito",
    TipoFormacion: "Capacitación Interna",
    TotalParticipantes: 180,
    TotalTrabajadores: 190,
    PorcentajeParticipacion: "95%",
    NumeroVecesFormado: 1,
    Calificacion: 4,
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
        Formación y Participación
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
                Cantidad Trabajadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Oficina - Dependencia
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Roles
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Tema de Formación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Tipo de Formación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total de Participantes
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total de Trabajadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % de Participación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                # Veces Formado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Calificación
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
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.CantidadTrabajadores}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Oficina}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Roles}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TemaFormacion}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TipoFormacion}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TotalParticipantes}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TotalTrabajadores}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.PorcentajeParticipacion}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.NumeroVecesFormado}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.Calificacion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
