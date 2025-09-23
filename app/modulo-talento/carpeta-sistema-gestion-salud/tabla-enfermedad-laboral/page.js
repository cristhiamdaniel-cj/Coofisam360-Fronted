"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import {
  listEnfermedadLaboralRows,
  saveEnfermedadLaboralRow,
} from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/enfermedadLaboralQuota";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await listEnfermedadLaboralRows({ limit: 500 });
        setRows(data);
        //setFilteredRows(data);
        setError("");
      } catch (e) {
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (idx, field, value) => {
    setRows(prev =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

    setEditedRows(prev => ({
      ...prev,
      [idx]: { ...prev[idx], [field]: value },
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

  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      anio: new Date().getFullYear(),
      mes: "ENERO",
      casosAntiguosEL: 0,
      numeroTrabajadoresAnio: 0,
      casosNuevosEL: 0,
      constante: 0,
      indicador: "P-EL",
      resultado: 0,
      codigoCIE10: "",
      clasificacionCIE: "",
      clasificacionEnfermedadLaboral: "",
      isNew: true,
    };

    setRows(prev => [newRow, ...prev]);
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Enfermedad Laboral
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Casos Antiguos de EL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                N° Trabajadores en el Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Casos Nuevos de EL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Constante
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Indicador
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Resultado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Código CIE-10
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Clasificación Internacional de Enfermedades
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Clasificación Enfermedad Laboral
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Año */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.isNew ? (
                    <input
                      type="number"
                      value={row.anio}
                      onChange={e => handleChange(idx, "anio", e.target.value)}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    row.anio
                  )}
                </td>

                {/* Mes */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.isNew ? (
                    <select
                      value={row.mes}
                      onChange={e => handleChange(idx, "mes", e.target.value)}
                      className="border rounded p-1 w-full"
                    >
                      {[
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                      ].map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.mes
                  )}
                </td>

                {/* Casos Antiguos EL */}
                <td className="p-2 border text-center whitespace-nowrap">
                  <input
                    type="number"
                    value={row.casosAntiguosEL}
                    onChange={e =>
                      handleChange(idx, "casosAntiguosEL", e.target.value)
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>

                {/* Numero Trabajadores Año */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.isNew ? (
                    <input
                      type="number"
                      value={row.numeroTrabajadoresAnio}
                      onChange={e =>
                        handleChange(
                          idx,
                          "numeroTrabajadoresAnio",
                          e.target.value
                        )
                      }
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    row.numeroTrabajadoresAnio
                  )}
                </td>

                {/* Casos Nuevos EL */}
                <td className="p-2 border text-center whitespace-nowrap">
                  <input
                    type="number"
                    value={row.casosNuevosEL}
                    onChange={e =>
                      handleChange(idx, "casosNuevosEL", e.target.value)
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>

                {/* Constante */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.isNew ? (
                    <input
                      type="number"
                      value={row.constante}
                      onChange={e =>
                        handleChange(idx, "constante", e.target.value)
                      }
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    row.constante
                  )}
                </td>

                {/* Indicador */}
                <td className="p-2 border text-center whitespace-nowrap">
                  <select
                    value={row.indicador}
                    onChange={e =>
                      handleChange(idx, "indicador", e.target.value)
                    }
                    className="border rounded p-1 w-full"
                  >
                    {["P-EL", "I-EL"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Resultado */}
                <td className="p-2 border text-center whitespace-nowrap">
                  {row.isNew ? (
                    <input
                      type="number"
                      value={row.resultado}
                      onChange={e =>
                        handleChange(idx, "resultado", e.target.value)
                      }
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    row.resultado
                  )}
                </td>

                {/* Código CIE10 */}
                <td className="p-2 border text-center whitespace-nowrap">
                  <input
                    type="text"
                    value={row.codigoCIE10}
                    onChange={e =>
                      handleChange(idx, "codigoCIE10", e.target.value)
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>

                {/* Clasificación CIE */}
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="text"
                    value={row.clasificacionCIE}
                    onChange={e =>
                      handleChange(idx, "clasificacionCIE", e.target.value)
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>

                {/* Clasificación Enfermedad Laboral */}
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="text"
                    value={row.clasificacionEnfermedadLaboral}
                    onChange={e =>
                      handleChange(
                        idx,
                        "clasificacionEnfermedadLaboral",
                        e.target.value
                      )
                    }
                    className="px-2 py-1 w-full text-left border ml-1"
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
