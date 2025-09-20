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

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
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

  const actividadesSST = [
    "Evaluación Inicial",
    "Inducción y reinducción a empleados",
    "Actualización de la Matriz de identificación de peligros, evaluación y valoración de los riesgos.",
    "Indicadores de gestión",
    "Documentación de la designación del responsable del Sistema de Gestión de Seguridad y Salud en el Trabajo, con la respectiva asignación de responsabilidades.",
    "Documentación de las responsabilidades específicas en el Sistema de Gestión de la Seguridad y Salud en el Trabajo a todos los niveles de la cooperativa",
    "Solicitar al responsable del SG-SST - COPASST y CCL certificado de aprobación del curso virtual de cincuenta (50) horas en Seguridad y Salud en el Trabajo",
    "Actualización de la matriz de requisitos legales",
    "Actas de las reuniones mensuales del COPASST",
    "Realizar la capacitación al Comité Paritario de Seguridad y Salud en el Trabajo",
    "Actas de las reuniones mensuales del CCL",
    "Capacitar al Comité de Convivencia Laboral",
    "Diseñar el programa de Capacitación y entrenamiento de SST",
    "Registro anual donde se evidencie que las personas con responsabilidades en el SG-SST realizaron la rendición de cuenta sobre su desempeño",
    "Inducción y reinducción a Contratistas",
    "Programa de riesgo visual",
    "Programa de riesgo cardiovascular",
    "Incluir como requisito para el proceso de selección y evaluación de proveedores y/o contratistas tengan documentado e implementado el Sistema de Gestión de Seguridad y Salud en el Trabajo",
  ];

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Programa de Capacitaciones
      </h1>
      <div className="actions-container flex justify-between mb-4">
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
              <th rowSpan="3" className="p-4 border text-center bg-white z-20">
                Actividad
              </th>
              <th colSpan="24" className="border text-center p-2 bg-white z-20">
                CRONOGRAMA VIGENCIA
              </th>
              <th rowSpan="3" className="p-4 border text-center bg-white z-20">
                Responsable(s)
              </th>
              <th
                colSpan="2"
                className="p-4 border text-center min-w-[300px] bg-white z-20"
              >
                Recursos
              </th>
              <th rowSpan="3" className="p-4 border text-center bg-white z-20">
                Observaciones
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
            {actividadesSST.map((actividad, idx) => (
              <tr key={idx}>
                {/* Actividad: desde tu array */}
                <td className="p-2 border text-left">{actividad}</td>

                {/* Cronograma: 24 columnas P/E */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <td key={i} className="p-2 border text-center max-w-[40px]">
                    {/* Aquí puedes poner un input si quieres que sea editable */}
                    <input type="checkbox" className="mx-auto" />
                  </td>
                ))}

                {/* Responsable(s) */}
                <td className="p-2 border text-center">
                  <select className="w-full border px-1 py-1">
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
                  <input
                    type="text"
                    className="w-full border px-1 py-1"
                    placeholder="admin"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    className="w-full border px-1 py-1"
                    placeholder="finan"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    className="w-full border px-1 py-1"
                    placeholder="finan"
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
