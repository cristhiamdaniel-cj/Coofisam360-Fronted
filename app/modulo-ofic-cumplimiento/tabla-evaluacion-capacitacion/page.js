"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Initial data
const initialRows = [
  {
    id: 1,
    ano: "",
    mes: "",
    nombreCompleto: "",
    noDocumento: "",
    areaOficina: "",
    cargo: "",
    temaCapacitado: "",
    nota: "",
    desempeno: "",
  },
];

// Options for dropdowns
const nombreCompletoOptions = [
  "LYDA FERNANDA JIMENEZ FIERRO",
  "JORGE EDUARDO TELLO PERDOMO",
  "GERARDO BUENDIA CHICUE",
  "DIEGO MAURICIO SANTOS ZUÑIGA",
  "RAMIRO PINEDA MARIN",
  "JESÚS ALBERTO OCHOA BELTRÁN",
  "HAINNER ESTIVINSON COSSIO RENGIFO",
  "ALEXANDER RIVERA DIAZ",
  "JAVIER LIZCANO QUEVEDO",
  "ALVARO VARON PINEDA",
  "HECTOR RAMIREZ VARGAS",
  "HAROL CERQUERA",
  "HOLLMAN YAMID PEREZ YUNDA",
  "WILBER ALEIXER POLANIA RUIZ",
  "JUAN MANUEL JURADO VODNIZA",
  "CARLOS AUGUSTO MEJIA HOYOS",
  "MAURICIO LUNA ARANGO",
  "LUCY DEL SOCORRO DIAZ ARIZA",
  "YOLANDA CASTELLANOS CAMARGO",
  "YENY LINDSAY TIRADO GOMEZ",
  "SANDRA PATRICIA CAVIEDES ROJAS",
  "BLANCA ELCY TIERRANDENTRO CARDENAS",
  "BELÉN RINCÓN",
  "MARBELIS CUELLAR TOVAR",
  "LUCY ABANED PENAGOS MUNAR",
  "ASTRID TALERO CUELLAR",
  "Luz Herlandy Suaza De Chavez",
  "LUZ BEIDA USMA AREVALO",
  "ESPERANZA OSSO ANDRADE",
  "CIELO NURY MENDEZ ROJAS",
  "YOLIMA PEREZ DURAN",
  "Martha Cecilia Ramos Gonzalez",
  "CLAUDIA LORENA PUENTES ALVAREZ",
  "EMERITA CLAROS",
  "LILIANA OTALORA CLAVIJO",
  "YINETH RIVERA CABRERA",
  "MARIA MILDRED TOVAR SERRANO",
  "PIEDAD CRISTINA HERNANDEZ MURCIA",
  "ELIANA ISABEL CAMPOS QUIMBAYO",
  "Diana Lorena Valdes Carvajal",
  "MARIA OMAIRA TORRES ROJAS",
  "KATTY ROCIO CORTES LOZANO",
  "Zoraida Isabel Urbano Lopez",
  "SOFIA CARVAJAL RAMOS",
  "DORIS MOLINA PEÑA",
  "DORA MARLEDY CORDOBA GONZALEZ",
  "MAGNOLIA LUCIA BOLAÑOS BURBANO",
  "NINI YOHANA ALMARIO SANTOS",
  "IVON MARITZA SÁNCHEZ GÓMEZ",
  "IVONNE JIMENA MARTINEZ OSORIO",
  "KELLY JOHANNA RUIZ TOVAR",
  "NATALY TATIANA LOZANO REY",
  "EMNA CONSTANZA JARAMILLO MUÑOZ",
  "Silvia Montenegro Fandiño",
  "LUZ MILENA DIAZ TOQUICA",
  "YEIMY GARZÓN TRUJILLO",
  "ELSA MILENA GONZALEZ PEÑA",
  "AIDA MARY PERAFAN NARVAEZ",
  "MARIA PATRICIA BALLEN PEÑA",
  "NADIA MORENO DONOSO",
];

const cargoOptions = [
  "DIRECTIVO",
  "TRABAJADOR",
  "TERCERO",
  "APRENDIZ SENA",
  "PRACTICANTE UNIVERSITARIO",
];

const desempenoOptions = ["SUPERIOR", "ALTO", "BASICO", "BAJO"];

const mesOptions = [
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
];

export default function EvaluacionCapacitacionTable() {
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

  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows(prev => [
      ...prev,
      {
        id: newId,
        ano: "",
        mes: "",
        nombreCompleto: "",
        noDocumento: "",
        areaOficina: "",
        cargo: "",
        temaCapacitado: "",
        nota: "",
        desempeno: "",
      },
    ]);
  };

  const handleDeleteRow = id => {
    if (confirm("¿Está seguro de eliminar este registro?")) {
      setRows(prev => prev.filter(row => row.id !== id));
      setEditedRows(prev => {
        const newEdited = { ...prev };
        delete newEdited[id];
        return newEdited;
      });
    }
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
      "Evaluacion Capacitacion"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "evaluacion-capacitacion.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.noDocumento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.areaOficina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.temaCapacitado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Evaluación Capacitación
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, documento, área o tema"
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
          <button
            onClick={handleAddRow}
            className="unified-button flex gap-2 items-center justify-center"
          >
            Agregar Fila
          </button>
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
              <th className="p-4 border text-center whitespace-nowrap">AÑO</th>
              <th className="p-4 border text-center whitespace-nowrap">MES</th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRE COMPLETO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                No DOCUMENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                AREA/OFICINA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">CARGO</th>
              <th className="p-4 border text-center whitespace-nowrap">
                TEMA CAPACITADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">NOTA</th>
              <th className="p-4 border text-center whitespace-nowrap">
                DESEMPEÑO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ACCIONES
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.ano}
                    onChange={e =>
                      handleChange(r.id, "ano", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Año"
                    min="2000"
                    max="2100"
                  />
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.mes}
                    onChange={e => handleChange(r.id, "mes", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {mesOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.nombreCompleto}
                    onChange={e =>
                      handleChange(r.id, "nombreCompleto", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {nombreCompletoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.noDocumento}
                    onChange={e =>
                      handleChange(r.id, "noDocumento", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Número de documento"
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
                  <select
                    value={r.cargo}
                    onChange={e => handleChange(r.id, "cargo", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {cargoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.temaCapacitado}
                    onChange={e =>
                      handleChange(r.id, "temaCapacitado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Tema capacitado"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.nota}
                    onChange={e => handleChange(r.id, "nota", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Nota"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.desempeno}
                    onChange={e =>
                      handleChange(r.id, "desempeno", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {desempenoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDeleteRow(r.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


