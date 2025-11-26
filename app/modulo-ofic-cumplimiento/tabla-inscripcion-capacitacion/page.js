"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to datetime-local format
// Format: 10/9/25 14:22:36 -> 2025-09-10T14:22:36
const toDateTimeLocal = dateStr => {
  if (!dateStr) return "";
  const [datePart, timePart] = dateStr.split(" ");
  if (!datePart || !timePart) return "";
  const [month, day, year] = datePart.split("/");
  // Convert 2-digit year to 4-digit year
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart}`;
};

// Helper function to convert datetime-local to date string
// Format: 2025-09-10T14:22:36 -> 10/9/25 14:22:36
const fromDateTimeLocal = dateTimeStr => {
  if (!dateTimeStr) return "";
  const [datePart, timePart] = dateTimeStr.split("T");
  if (!datePart || !timePart) return "";
  const [year, month, day] = datePart.split("-");
  // Convert to 2-digit year
  const shortYear = year.slice(-2);
  return `${parseInt(day)}/${parseInt(month)}/${shortYear} ${timePart}`;
};

// Initial data
const initialRows = [
  {
    id: 1,
    horaInicio: "10/9/25 14:22:36",
    horaFinalizacion: "10/9/25 14:25:26",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    nombre2: "CRISTIAN JULIAN HUELGOS GALINDO",
    numeroIdentificacion: "1030533192",
    areaOficina: "GERENCIA",
    cargo: "TRABAJADOR",
    temaCapacitacion: "CAPACITACIÓN ANUAL SARLAFT",
  },
];

export default function InscripcionCapacitacionTable() {
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
      "Inscripcion Capacitacion"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "inscripcion-capacitacion.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.nombre2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.correoElectronico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.numeroIdentificacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.areaOficina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.temaCapacitacion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Inscripción Capacitación
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, correo, identificación, área o tema"
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
                HORA DE INICIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                HORA DE FINALIZACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CORREO ELECTRÓNICO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                HORA DE LA ÚLTIMA MODIFICACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRE2
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NÚMERO DE IDENTIFICACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ÁREA/OFICINA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CARGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TEMA DE CAPACITACIÓN
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.id}
                    onChange={e =>
                      handleChange(r.id, "id", parseInt(e.target.value) || 0)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="ID"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="datetime-local"
                    value={toDateTimeLocal(r.horaInicio)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "horaInicio",
                        fromDateTimeLocal(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="datetime-local"
                    value={toDateTimeLocal(r.horaFinalizacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "horaFinalizacion",
                        fromDateTimeLocal(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="email"
                    value={r.correoElectronico}
                    onChange={e =>
                      handleChange(r.id, "correoElectronico", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="correo@coofisam.com"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nombre}
                    onChange={e => handleChange(r.id, "nombre", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Nombre"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="datetime-local"
                    value={toDateTimeLocal(r.horaUltimaModificacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "horaUltimaModificacion",
                        fromDateTimeLocal(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nombre2}
                    onChange={e =>
                      handleChange(r.id, "nombre2", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Nombre2"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.numeroIdentificacion}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "numeroIdentificacion",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Número de identificación"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.areaOficina}
                    onChange={e =>
                      handleChange(r.id, "areaOficina", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Área/Oficina"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.cargo}
                    onChange={e => handleChange(r.id, "cargo", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Cargo"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.temaCapacitacion}
                    onChange={e =>
                      handleChange(r.id, "temaCapacitacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Tema de capacitación"
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


