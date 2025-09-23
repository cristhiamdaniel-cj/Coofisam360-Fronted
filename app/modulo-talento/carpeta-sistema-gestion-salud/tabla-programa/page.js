"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import React from "react";
import { FaArrowDownWideShort } from "react-icons/fa6";

const actividadesSST = [
  "Induccion Seguridad y Salud en el Trabajo",
  "Reinduccion Seguridad y Salud en el Trabajo",
  "Seguridad Vial",
  "Entrenamiento brigada de emergencia",
  "Taller técnicas de relajación",
  "Capacitación equidad de género y violencia",
  "Capacitación estrategias de seguridad en entornos públicos",
  "Capacitación acoso sexual ley 2365 de 2024",
  "Capacitación conservación visual",
  "Taller en el manejo de las emociones y del estrés",
  "Capacitacion lesiones osteomusculares",
  "Capacitacion Copasst",
  "Capacitacion Comité Convivencia Laboral",
  "Formacion Lideres Pausas Activas",
  "Capacitacion Riesgos Laborales",
  "Capacitacion Ludica Comité Convivencia Laboral",
  "Capacitacion Habitos y Estilos de Vida Saludable",
  "Capacitacion Brigadas Sistemas de Comando de Incidentes",
  "Formacion habitos de vida saludable",
];

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [actividades, setActividades] = useState(actividadesSST);

  const handleChange = (idx, field, value) => {
    setActividades(prev => {
      const newRows = [...prev];
      newRows[idx] = { ...newRows[idx], [field]: value };
      return newRows;
    });
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

  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      nombre: "Nueva actividad",
      responsable: "",
      recurso1: "SI",
      recurso2: "NO",
      observaciones: "",
      isNew: true,
    };

    // Inicializar columnas P/E
    for (let i = 0; i < 24; i++) {
      newRow[`col${i}`] = false;
    }

    setActividades(prev => [newRow, ...prev]);
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Programa de Capacitaciones
      </h1>
      <div className="actions-container flex justify-end mb-4">
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
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleAddRow}
          >
            Añadir fila
            <FaArrowDownWideShort />
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th
                rowSpan="3"
                className="p-4 border text-center bg-white z-20 min-w-[250px]"
              >
                ACTIVIDAD
              </th>
              <th colSpan="24" className="border text-center p-2 bg-white z-20">
                PROGRAMA DE CAPACITACIONES
              </th>
              <th rowSpan="3" className="p-4 border text-center bg-white z-20">
                Responsable(s)
              </th>
              <th
                colSpan="2"
                className="p-4 border text-center min-w-[300px] bg-white z-20"
              >
                RECURSOS
              </th>
              <th rowSpan="3" className="p-4 border text-center bg-white z-20">
                OBSERVACIONES
              </th>
            </tr>

            <tr>
              {[
                "ENERO",
                "FEBRERO",
                "MARZO",
                "ABRIL",
                "MAYO",
                "JUNIO",
                "JULIO",
                "AGOSTO",
                "SEPTIEMBRE",
                "OCTUBRE",
                "NOVIEMBRE",
                "DICIEMBRE",
              ].map(m => (
                <th
                  colSpan="2"
                  className="border text-center p-2 text-[10px] min-w-[80px] text-white bg-white z-20"
                  key={m}
                >
                  {m}
                </th>
              ))}

              <th
                rowSpan="2"
                colSpan="1"
                className="border text-center p-2 min-w-[150px] text-white bg-white z-20"
              >
                admin
              </th>
              <th
                rowSpan="2"
                colSpan="1"
                className="border text-center p-2 min-w-[150px] text-white bg-white z-20"
              >
                finan
              </th>
            </tr>

            <tr>
              {Array.from({ length: 12 }).map((_, i) => (
                <React.Fragment key={i}>
                  <th className="border text-center p-2 bg-white z-20 text-white">
                    P
                  </th>
                  <th className="border text-center p-2 bg-white z-20 text-white">
                    E
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody className="tabla-cupos-content">
            {actividades.map((actividad, idx) => (
              <tr key={actividad.id || idx}>
                <td className="p-2 border text-left">
                  {actividad.isNew ? (
                    <input
                      type="text"
                      value={actividad.nombre || actividad}
                      onChange={e =>
                        handleChange(idx, "actividad", e.target.value)
                      }
                      placeholder="Nueva actividad"
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    actividad.nombre || actividad
                  )}
                </td>
                {Array.from({ length: 24 }).map((_, i) => (
                  <td key={i} className="p-2 border text-center max-w-[40px]">
                    <input
                      type="checkbox"
                      checked={actividad[`col${i}`] || false}
                      onChange={e =>
                        handleChange(idx, `col${i}`, e.target.checked)
                      }
                      className="mx-auto"
                    />
                  </td>
                ))}
                {/* Responsable(s) */}
                <td className="p-2 border text-center">
                  <select
                    value={actividad.responsable || ""}
                    onChange={e =>
                      handleChange(idx, "responsable", e.target.value)
                    }
                    className="w-full border px-1 py-1"
                  >
                    {[
                      "Comité de Convivencia Laboral",
                      "Comité de COPASST",
                      "Auxiliar SST",
                      "ARL",
                      "Coordinador Talento y Cultura",
                      "Subgerencia de Innovación Empresarial",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Recursos */}
                <td className="p-2 border text-center">
                  <select
                    value={actividad.recurso1 || "SI"}
                    onChange={e =>
                      handleChange(idx, "recurso1", e.target.value)
                    }
                    className="border rounded text-center p-1 w-full"
                  >
                    {["SI", "NO"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={actividad.recurso2 || "NO"}
                    onChange={e =>
                      handleChange(idx, "recurso2", e.target.value)
                    }
                    className="border rounded text-center p-1 w-full"
                  >
                    {["SI", "NO"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    value={actividad.observaciones || ""}
                    onChange={e =>
                      handleChange(idx, "observaciones", e.target.value)
                    }
                    className="w-full border px-1 py-1"
                    placeholder=""
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
