"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
// Format: 02/01/2025 -> 2025-01-02
const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Helper function to convert date input to date string
// Format: 2025-01-02 -> 02/01/2025
const fromDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// Initial data
const initialRows = [
  {
    id: 1,
    numeroContrato: "1",
    ano: "2025",
    tipoGarantia: "Cumplimiento general",
    valorPorcentaje: "20",
    fechaExpedicion: "02/01/2025",
    fechaVigencia: "30/04/2026",
    aseguradora: "Seguros Mundial S.A.",
    estado: "VIGENTE",
  },
  {
    id: 2,
    numeroContrato: "1",
    ano: "2025",
    tipoGarantia: "Pago de salarios, prestaciones sociales y aportes parafiscales",
    valorPorcentaje: "20",
    fechaExpedicion: "02/01/2025",
    fechaVigencia: "31/12/2028",
    aseguradora: "Seguros Mundial S.A.",
    estado: "VIGENTE",
  },
];

// Options for dropdowns
const tipoGarantiaOptions = [
  "Cumplimiento general",
  "Buen manejo y correcta inversión del anticipo",
  "Calidad del servicio o del bien",
  "Estabilidad y calidad de la obra",
  "Pago de salarios, prestaciones sociales y aportes parafiscales",
  "Responsabilidad civil extracontractual",
  "Responsabilidad profesional o técnica",
  "Cumplimiento de disposiciones ambientales y de seguridad industrial",
  "Cumplimiento de obligaciones tributarias",
  "",
];

const aseguradoraOptions = [
  "Seguros Bolívar S.A.",
  "Seguros del Estado S.A.",
  "Seguros Generales Suramericana S.A. (SURA)",
  "Seguros de Occidente S.A.",
  "AXA Colpatria Seguros S.A.",
  "La Previsora S.A. Compañía de Seguros",
  "Liberty Seguros S.A.",
  "Mapfre Seguros Generales de Colombia S.A.",
  "Allianz Seguros S.A.",
  "HDI Seguros S.A.",
  "Chubb Seguros Colombia S.A.",
  "Seguros Mundial S.A.",
  "Equidad Seguros Generales Organismo Cooperativo",
  "Seguros Confianza S.A.",
  "Positiva Compañía de Seguros S.A.",
  "Aseguradora Solidaria de Colombia Ltda.",
  "Zurich Colombia Seguros S.A.",
  "Colmena Seguros S.A.",
  "Seguros Beta S.A.",
  "Seguros Comerciales Bolívar S.A.",
  "Seguros de Vida Suramericana S.A. (SURA Vida)",
  "Allianz Seguros de Vida S.A.",
  "AXA Colpatria Seguros de Vida S.A.",
  "Seguros de Vida Alfa S.A.",
  "Seguros de Vida del Estado S.A.",
  "Mapfre Colombia Vida Seguros S.A.",
  "MetLife Colombia Seguros de Vida S.A.",
  "Positiva Compañía de Seguros de Vida S.A.",
  "Liberty Seguros de Vida S.A.",
  "Seguros Bolívar Vida S.A.",
  "QBE Seguros S.A.",
  "La Equidad Seguros (Cooperativa)",
  "Colpatria Seguros Patrimoniales",
  "Colseguros (actualmente Allianz)",
  "Coface Colombia Seguros de Crédito S.A.",
  "Solunion Colombia Seguros de Crédito S.A.",
  "AIG Seguros Colombia S.A.",
  "SBS Seguros Colombia S.A.",
  "RSA Seguros S.A.",
  "Cardinal Compañía de Seguros S.A.",
];

const estadoOptions = ["VIGENTE", "VENCIDA", "CANCELADA", "RENOVADA"];

export default function ControlPolizasTable() {
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
        numeroContrato: "",
        ano: "",
        tipoGarantia: "",
        valorPorcentaje: "",
        fechaExpedicion: "",
        fechaVigencia: "",
        aseguradora: "",
        estado: "",
      },
    ]);
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
      "Control Polizas"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "control-polizas.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.numeroContrato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.tipoGarantia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.aseguradora?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Control de Pólizas
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por número de contrato, tipo de garantía, aseguradora o estado"
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
              <th className="p-4 border text-center whitespace-nowrap">
                NÚMERO DE CONTRATO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">AÑO</th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE GARANTÍA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR (%)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE EXPEDICIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA VIGENCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ASEGURADORA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">ESTADO</th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.numeroContrato}
                    onChange={e =>
                      handleChange(r.id, "numeroContrato", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Número"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.ano}
                    onChange={e => handleChange(r.id, "ano", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Año"
                    min="2000"
                    max="2100"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoGarantia}
                    onChange={e =>
                      handleChange(r.id, "tipoGarantia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoGarantiaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.valorPorcentaje}
                    onChange={e =>
                      handleChange(r.id, "valorPorcentaje", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="%"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaExpedicion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaExpedicion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaVigencia)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaVigencia",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.aseguradora}
                    onChange={e =>
                      handleChange(r.id, "aseguradora", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {aseguradoraOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estado}
                    onChange={e => handleChange(r.id, "estado", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

