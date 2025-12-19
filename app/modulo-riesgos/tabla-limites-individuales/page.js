"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to format number with dots and commas
const formatNumber = (num) => {
  if (!num) return "";
  const numStr = num.toString().replace(/\./g, "").replace(/,/g, ".");
  const numValue = parseFloat(numStr);
  if (isNaN(numValue)) return num;
  return numValue.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Helper function to parse number (remove dots, keep comma as decimal)
const parseNumber = (str) => {
  if (!str) return "";
  // Remove dots (thousands separator) and replace comma with dot for parsing
  return str.toString().replace(/\./g, "").replace(/,/g, ".");
};

// Helper function to convert back to storage format (dot for thousands, comma for decimal)
const toStorageFormat = (str) => {
  if (!str) return "";
  const num = parseFloat(str);
  if (isNaN(num)) return str;
  return num.toString().replace(/\./g, ",");
};

// Initial data
const initialRows = [
  {
    id: 1,
    mes: "SEPTIEMBRE",
    año: "2025",
    tipoLimite: "INDIVIDUAL DE CRÉDITO (1) /PT",
    porcentajeLimite: "10",
    formulaValorLimite: "Suma Patrimonio Tenico (3205+3215+3417+3405+3110+3305+3325+3335+3310+3330)-(35+122602+1220+1910)+(146805+((4-5-6)*5%)+39)*10%",
    valorLimite: "3945188815.96",
    formulaSaldoActual: "CAPTURA MANUAL",
    saldoActual: "1409436619.00",
  },
  {
    id: 2,
    mes: "SEPTIEMBRE",
    año: "2025",
    tipoLimite: "INDIVIDUAL DE CRÉDITO (2) /PT",
    porcentajeLimite: "20",
    formulaValorLimite: "Suma Patrimonio Tenico (3205+3215+3417+3405+3110+3305+3325+3335+3310+3330)-(35+122602+1220+1910)+(146805+((4-5-6)*5%)+39)*20%",
    valorLimite: "7890377631.93",
    formulaSaldoActual: "CAPTURA MANUAL",
    saldoActual: "0.00",
  },
  {
    id: 3,
    mes: "SEPTIEMBRE",
    año: "2025",
    tipoLimite: "INDIVIDUAL DE INVERSIONES CAPITAL /A+R",
    porcentajeLimite: "100",
    formulaValorLimite: "Suma Aportes Sociales (3105+3110-311010) + Reservas Patrimoniales (32) - Activos Materiales (17)",
    valorLimite: "58052167621.43",
    formulaSaldoActual: "Suma (122602)",
    saldoActual: "1104822723.00",
  },
  {
    id: 4,
    mes: "SEPTIEMBRE",
    año: "2025",
    tipoLimite: "INDIVIDUAL DE CAPTACIONES /PT",
    porcentajeLimite: "25",
    formulaValorLimite: "Suma Patrimonio Tenico (3205+3215+3417+3405+3110+3305+3325+3335+3310+3330)-(35+122602+1220+1910)+(146805+((4-5-6)*5%)+39)*25%",
    valorLimite: "9862972039.91",
    formulaSaldoActual: "CAPTURA MANUAL",
    saldoActual: "2439821804.00",
  },
  {
    id: 5,
    mes: "SEPTIEMBRE",
    año: "2025",
    tipoLimite: "INDIVIDUAL DE APORTES/ Total Aportes",
    porcentajeLimite: "10",
    formulaValorLimite: "Suma Aportes Sociales (3105+3110-311010)*10%",
    valorLimite: "5749508066.44",
    formulaSaldoActual: "CAPTURA MANUAL",
    saldoActual: "159695665.00",
  },
  {
    id: 6,
    mes: "SEPTIEMBRE",
    año: "2025",
    tipoLimite: "CREDITOS VIVIENDA RECURSOS PROPIOS /PT",
    porcentajeLimite: "25",
    formulaValorLimite: "Suma Patrimonio Tenico (3205+3215+3417+3405+3110+3305+3325+3335+3310+3330)-(35+122602+1220+1910)+(146805+((4-5-6)*5%)+39)*25%",
    valorLimite: "9862972039.91",
    formulaSaldoActual: "Suma (1404+1405)",
    saldoActual: "4062558434.00",
  },
];

// Options for dropdowns
const mesOptions = [
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
  "",
];

const formulaSaldoActualOptions = [
  "CAPTURA MANUAL",
  "Suma (122602)",
  "Suma (1404+1405)",
  "",
];

export default function LimitesIndividualesTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (id, field, value) => {
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
        mes: "",
        año: "",
        tipoLimite: "",
        porcentajeLimite: "",
        formulaValorLimite: "",
        valorLimite: "",
        formulaSaldoActual: "",
        saldoActual: "",
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
    // Convert rows to export format
    const exportData = rows.map(row => ({
      MES: row.mes,
      AÑO: row.año,
      "TIPO DE LIMITE": row.tipoLimite,
      "% LIMITE": row.porcentajeLimite,
      "FORMULA PARA VALOR LIMITE": row.formulaValorLimite,
      "VALOR LIMITE": formatNumber(row.valorLimite),
      "FORMULA SALDO ACTUAL": row.formulaSaldoActual,
      "SALDO ACTUAL": formatNumber(row.saldoActual),
    }));

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Límites Individuales"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "limites-individuales.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.mes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.año?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.tipoLimite?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatNumber(row.valorLimite)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Límites Individuales
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por mes, año, tipo de límite o valor"
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
              <th className="p-4 border text-center whitespace-nowrap">MES</th>
              <th className="p-4 border text-center whitespace-nowrap">AÑO</th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE LÍMITE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">% LÍMITE</th>
              <th className="p-4 border text-center whitespace-nowrap">
                FÓRMULA PARA VALOR LÍMITE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR LÍMITE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FÓRMULA SALDO ACTUAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                SALDO ACTUAL
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-left">
                  <select
                    value={r.mes}
                    onChange={e => handleChange(r.id, "mes", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {mesOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.año}
                    onChange={e => handleChange(r.id, "año", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Año"
                    min="2000"
                    max="2100"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.tipoLimite}
                    onChange={e =>
                      handleChange(r.id, "tipoLimite", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Tipo de límite"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.porcentajeLimite}
                    onChange={e =>
                      handleChange(r.id, "porcentajeLimite", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="%"
                    min="0"
                    max="1000"
                    step="0.01"
                  />
                </td>
                <td className="p-2 border text-left">
                  <textarea
                    value={r.formulaValorLimite}
                    onChange={e =>
                      handleChange(r.id, "formulaValorLimite", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm resize-none"
                    placeholder="Fórmula para valor límite"
                    rows="2"
                  />
                </td>
                <td className="p-2 border text-right">
                  <input
                    type="text"
                    value={formatNumber(r.valorLimite)}
                    onChange={e =>
                      handleChange(r.id, "valorLimite", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-right font-semibold"
                    placeholder="0,00"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.formulaSaldoActual}
                    onChange={e =>
                      handleChange(r.id, "formulaSaldoActual", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {formulaSaldoActualOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                  {!formulaSaldoActualOptions.includes(r.formulaSaldoActual) && r.formulaSaldoActual && (
                    <input
                      type="text"
                      value={r.formulaSaldoActual}
                      onChange={e =>
                        handleChange(r.id, "formulaSaldoActual", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-sm mt-1"
                      placeholder="Fórmula personalizada"
                    />
                  )}
                </td>
                <td className="p-2 border text-right">
                  <input
                    type="text"
                    value={formatNumber(r.saldoActual)}
                    onChange={e =>
                      handleChange(r.id, "saldoActual", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-right font-semibold"
                    placeholder="0,00"
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



