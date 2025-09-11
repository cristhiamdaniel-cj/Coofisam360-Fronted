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
    anio: 2025,
    oficina: "Neiva",
    cargo: "Director Oficina",
    patologia:
      "M469- Espondilopatia inflamatoria, no especificada; M109- Gota no especificada; Hipertensión",
    restricciones:
      "Control y seguimiento por EPS con reumatología y psicología",
  },
  {
    id: 2,
    anio: 2025,
    oficina: "Dirección General",
    cargo: "Coordinadora TH",
    patologia: "Diabetes, Nefropatia, enfermedad coronaria, crohn",
    restricciones:
      "Control y seguimiento por eps, descanso, bajar de peso, toma de medicamento de por vida para la diabetes y la neuropia por perdidas de visión constantes, pausas activas visuales",
  },
  {
    id: 3,
    anio: 2025,
    oficina: "Garzón",
    cargo: "Gestor Cartera",
    patologia: "Cardiopatia",
    restricciones: "Control con eps",
  },
  {
    id: 4,
    anio: 2025,
    oficina: "Dirección General",
    cargo: "Auxiliar Auditoria",
    patologia: "Dorsalgia no especificada",
    restricciones: "Proceso de diagnostico y recomendaciones",
  },
  {
    id: 5,
    anio: 2025,
    oficina: "Dirección General",
    cargo: "Gestor Comercial",
    patologia: "Depresión y ansiedad",
    restricciones: "Control con psiquiatria y continuar con la medicaciones",
  },
  {
    id: 6,
    anio: 2025,
    oficina: "Dirección General",
    cargo: "Gestor Cartera",
    patologia:
      "Fistula Epigastrica, Dermatitis esponguitica cronica, hernia discal LS-S1",
    restricciones: "Proceso de  reconocimiento  por parte de la ARL",
  },
  {
    id: 7,
    anio: 2025,
    oficina: "Suaza",
    cargo: "Cajero",
    patologia: "Cardiopatia",
    restricciones: "Control por EPS",
  },
  {
    id: 8,
    anio: 2025,
    oficina: "Suaza",
    cargo: "Jefe Operaciones",
    patologia: "J46X Estado asmático",
    restricciones: "Control por EPS",
  },
  {
    id: 9,
    anio: 2025,
    oficina: "Dirección General",
    cargo: "Subgerencia Financiera",
    patologia: "M771 – Epicondilitis lateral, bilateral",
    restricciones:
      "Enfermedad laboral reconocida por la ARL, con recomendaciones especificas",
  },
  {
    id: 10,
    anio: 2025,
    oficina: "Dirección General",
    cargo: "Formador TH",
    patologia:
      "Hernia discal L5 y S2; M518-Otros tratornos especificos de los discos intervertebrales; M624- contractura muscular; R522- otro dolor crónico",
    restricciones:
      "Control por EPS, con recomendaciones constantes de hernia y medicación por psiquiatria",
  },
  {
    id: 11,
    anio: 2025,
    oficina: "Tarqui",
    cargo: "Jefe Operaciones",
    patologia: "M329-Lupus eritematoso sistémico sin otra especificación",
    restricciones: "Control por EPS",
  },
  {
    id: 12,
    anio: 2025,
    oficina: "Acevedo",
    cargo: "Jefe Operaciones",
    patologia: "G560- Síndrome del tunel carpiano",
    restricciones:
      "Terapias por reumatologia, sin restricciones, solo pausas activas",
  },
  {
    id: 13,
    anio: 2025,
    oficina: "Neiva",
    cargo: "Jefe Operaciones",
    patologia:
      "M551- Síndrome de manguito rotatario; M552- Tendinitis de biceps; F412 Trastorno mixto de ansiedad y depresión; K210- Enfermedad del reflujo gastroesofagico con esofagitis; R490- Disfonía",
    restricciones:
      "Con recomendaciones por especialistas en las patologias reportadas y por reintegro laboral",
  },
  {
    id: 14,
    anio: 2025,
    oficina: "Garzón",
    cargo: "Asesor Comercial",
    patologia: "I442- Bloqueo auriculoventricular completo",
    restricciones: "No salida de campo , ni acercamientos a equipos eléctricos",
  },
  {
    id: 15,
    anio: 2025,
    oficina: "Dirección General",
    cargo: "Director Juridico",
    patologia:
      "Hipertension; Cateterismo cardiaco; Sospecha del tunel del Carpo",
    restricciones:
      "Estricto cumplimiento a las recomendaciones del médico tratante en los exámenes periódicos de control de P.P. en dónde se le trata, Hipertensión, así mismo del médico urólogo y cardiologo.",
  },
  {
    id: 16,
    anio: 2025,
    oficina: "Gigante",
    cargo: "Director Oficina",
    patologia: "K210- Enfermedad del reflujo gastroesofagico con esofagitis",
    restricciones: "No salida de campo",
  },
  {
    id: 17,
    anio: 2025,
    oficina: "La plata",
    cargo: "Asesor Microfinanzas Urbano",
    patologia:
      "M545- Lumbago no especificado; M512- Otros desplazamientos especificados de disco intervertebral; K648- Otras hemorroides especificadas; K641- Hemorroides de segundo grado",
    restricciones:
      "Salida a zonas uniformes, no uso de motocicleta y control de eps",
  },
  {
    id: 18,
    anio: 2025,
    oficina: "Guadalupe",
    cargo: "Asesora comercial",
    patologia: "E340- Sindrome carcinoide",
    restricciones:
      "La trabajadora no cree en médicos y no continuó tratamiento",
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
        Reporte Ministerio
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
              <th className="p-4 border text-center whitespace-nowrap">
                Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cargo
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[500px]">
                Patología
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[500px]">
                Restricciones
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center whitespace-nowrap">
                  {r.anio}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {r.oficina}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {r.cargo}
                </td>
                <td className="p-2 border text-center ">{r.patologia}</td>
                <td className="p-2 border text-center ">{r.restricciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
