"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to datetime-local format
// Format: 14/12/2022 11:57 -> 2022-12-14T11:57
const toDateTimeLocal = (dateStr) => {
  if (!dateStr) return "";
  const [datePart, timePart] = dateStr.split(" ");
  if (!datePart || !timePart) return "";
  const [day, month, year] = datePart.split("/");
  if (!day || !month || !year) return "";
  const [hours, minutes] = timePart.split(":");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hours}:${minutes}`;
};

// Helper function to convert datetime-local to date string
// Format: 2022-12-14T11:57 -> 14/12/2022 11:57
const fromDateTimeLocal = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const [datePart, timePart] = dateTimeStr.split("T");
  if (!datePart || !timePart) return "";
  const [year, month, day] = datePart.split("-");
  const [hours, minutes] = timePart.split(":");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Initial data
const initialRows = [
  {
    id: 1,
    creado: "14/12/2022 11:57",
    nombreQuienReporta: "HOLLMAN YAMID PEREZ YUNDA",
    agencia: "Hobo",
    mesReportado: "Noviembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 2,
    creado: "14/12/2022 12:30",
    nombreQuienReporta: "MARTHA LILIANA CAMARGO PAREDES",
    agencia: "Gigante",
    mesReportado: "Noviembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 3,
    creado: "14/12/2022 12:59",
    nombreQuienReporta: "NATALY TATIANA LOZANO REY",
    agencia: "Neiva",
    mesReportado: "Noviembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 4,
    creado: "14/12/2022 13:11",
    nombreQuienReporta: "EXNEHIDER NARANJO JOVEN ",
    agencia: "El Pital",
    mesReportado: "Noviembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 5,
    creado: "14/12/2022 14:35",
    nombreQuienReporta: "LINA MARITZA CANDELA MOLANO",
    agencia: "La Plata",
    mesReportado: "Noviembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 6,
    creado: "15/12/2022 7:58",
    nombreQuienReporta: "LINA XIMENA PARRA VARGAS",
    agencia: "Dirección General",
    mesReportado: "Diciembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 7,
    creado: "15/12/2022 12:42",
    nombreQuienReporta: "MARIA MILDRED TOVAR SERRANO",
    agencia: "Tarqui",
    mesReportado: "Noviembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 8,
    creado: "30/12/2022 13:56",
    nombreQuienReporta: "EXNEHIDER NARANJO JOVEN ",
    agencia: "El Pital",
    mesReportado: "Diciembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 9,
    creado: "30/12/2022 14:03",
    nombreQuienReporta: "NATALY TATIANA LOZANO REY",
    agencia: "Neiva",
    mesReportado: "Diciembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 10,
    creado: "30/12/2022 14:11",
    nombreQuienReporta: "LINA MARITZA CANDELA MOLANO",
    agencia: "La Plata",
    mesReportado: "Diciembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 11,
    creado: "03/01/2023 7:59",
    nombreQuienReporta: "MARIA MILDRED TOVAR SERRANO",
    agencia: "Tarqui",
    mesReportado: "Diciembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 12,
    creado: "03/01/2023 8:45",
    nombreQuienReporta: "Claudia Patricia Fernandez Cediel",
    agencia: "Dirección General",
    mesReportado: "Diciembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 13,
    creado: "03/01/2023 14:41",
    nombreQuienReporta: "MARINELA PERILLA CAPERA",
    agencia: "Dirección General",
    mesReportado: "Diciembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 14,
    creado: "04/01/2023 7:35",
    nombreQuienReporta: "DORIS MOLINA PEÑA",
    agencia: "Acevedo",
    mesReportado: "Diciembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
  {
    id: 15,
    creado: "04/01/2023 14:49",
    nombreQuienReporta: "DIEGO MAURICIO SANTOS ZUÑIGA",
    agencia: "Íquira",
    mesReportado: "Diciembre",
    certifico: "No",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Ausencia de operaciones inusuales o sospechosas",
  },
];

// Options for dropdowns
const nombreQuienReportaOptions = [
  "HOLLMAN YAMID PEREZ YUNDA",
  "MARTHA LILIANA CAMARGO PAREDES",
  "NATALY TATIANA LOZANO REY",
  "EXNEHIDER NARANJO JOVEN ",
  "LINA MARITZA CANDELA MOLANO",
  "LINA XIMENA PARRA VARGAS",
  "MARIA MILDRED TOVAR SERRANO",
  "Claudia Patricia Fernandez Cediel",
  "MARINELA PERILLA CAPERA",
  "DORIS MOLINA PEÑA",
  "DIEGO MAURICIO SANTOS ZUÑIGA",
];

const agenciaOptions = [
  "Hobo",
  "Gigante",
  "Neiva",
  "El Pital",
  "La Plata",
  "Dirección General",
  "Tarqui",
  "Acevedo",
  "Íquira",
];

const mesReportadoOptions = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const certificoOptions = ["No", "Sí"];

const tipoElementoOptions = ["Elemento"];

export default function Fori20Table() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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
      "FORI-20"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "fori-20.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.nombreQuienReporta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.agencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mesReportado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        FORI-20
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, agencia o mes"
            className="unified-input w-[300px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="unified-button flex gap-2 items-center justify-center">
            Buscar
            <IoSearch />
          </button>
        </div>
        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              className="unified-button flex gap-2 items-center justify-center"
            >
              Guardar cambios
              <FaRegSave />
            </button>
          )}
          <button
            className="unified-button flex gap-2 items-center justify-center"
            onClick={handleDownload}
          >
            Descargar
            <FiDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">ID</th>
              <th className="p-4 border text-center whitespace-nowrap">
                CREADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRE QUIEN REPORTA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                AGENCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MÉS REPORTADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CERTIFICO que durante el mes NO se presentaron operaciones que pudieran ser calificadas como sospechosas o inusuales, de conformidad con el MARI-01 Manual SARLAFT y anexos.
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE ELEMENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                RUTA DE ACCESO
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-left">
                  <input
                    type="datetime-local"
                    value={toDateTimeLocal(r.creado)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "creado",
                        fromDateTimeLocal(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.nombreQuienReporta}
                    onChange={e =>
                      handleChange(r.id, "nombreQuienReporta", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {nombreQuienReportaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.agencia}
                    onChange={e =>
                      handleChange(r.id, "agencia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {agenciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.mesReportado}
                    onChange={e =>
                      handleChange(r.id, "mesReportado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {mesReportadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.certifico}
                    onChange={e =>
                      handleChange(r.id, "certifico", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {certificoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoElemento}
                    onChange={e =>
                      handleChange(r.id, "tipoElemento", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoElementoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.rutaAcceso}
                    onChange={e =>
                      handleChange(r.id, "rutaAcceso", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Ruta de acceso"
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


