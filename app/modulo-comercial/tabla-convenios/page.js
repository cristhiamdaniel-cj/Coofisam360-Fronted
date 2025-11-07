"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// JSON data structure for convenios
const initialRows = [
  {
    id: 1,
    mes: "JULIO",
    año: "2025",
    codigo: 1,
    oficina: "GARZON",
    proveedor: "Garzon Dorado",
    libranza: 1,
    nomina: 0,
    recaudo: 0,
    comercialFinanciamiento: 0,
    cooperacionAlianzaEstrategica: 0,
    totalConvenioEjecutado: 1,
    metaNuevosConvenios: 1,
    cumplimientoNuevosConvenios: "100,00%",
    metaConvenio: 29,
    ejecutadoConvenio: 29,
    cumplimientoMantenimiento: "100,00%",
  },
  {
    id: 2,
    mes: "JULIO",
    año: "2025",
    codigo: 1,
    oficina: "GARZON",
    proveedor: "Coocentral",
    libranza: 0,
    nomina: 1,
    recaudo: 0,
    comercialFinanciamiento: 0,
    cooperacionAlianzaEstrategica: 0,
    totalConvenioEjecutado: 1,
    metaNuevosConvenios: 0,
    cumplimientoNuevosConvenios: "0,00%",
    metaConvenio: 0,
    ejecutadoConvenio: 0,
    cumplimientoMantenimiento: "0,00%",
  },
  {
    id: 3,
    mes: "JULIO",
    año: "2025",
    codigo: 2,
    oficina: "GUADALUPE",
    proveedor: "",
    libranza: 0,
    nomina: 0,
    recaudo: 0,
    comercialFinanciamiento: 0,
    cooperacionAlianzaEstrategica: 0,
    totalConvenioEjecutado: 0,
    metaNuevosConvenios: 1,
    cumplimientoNuevosConvenios: "0,00%",
    metaConvenio: 15,
    ejecutadoConvenio: 16,
    cumplimientoMantenimiento: "106,67%",
  },
  {
    id: 4,
    mes: "JULIO",
    año: "2025",
    codigo: 3,
    oficina: "PITAL",
    proveedor: "",
    libranza: 0,
    nomina: 0,
    recaudo: 0,
    comercialFinanciamiento: 0,
    cooperacionAlianzaEstrategica: 0,
    totalConvenioEjecutado: 0,
    metaNuevosConvenios: 1,
    cumplimientoNuevosConvenios: "0,00%",
    metaConvenio: 10,
    ejecutadoConvenio: 11,
    cumplimientoMantenimiento: "110,00%",
  },
  {
    id: 5,
    mes: "JULIO",
    año: "2025",
    codigo: 4,
    oficina: "GIGANTE",
    proveedor: "",
    libranza: 0,
    nomina: 0,
    recaudo: 0,
    comercialFinanciamiento: 0,
    cooperacionAlianzaEstrategica: 0,
    totalConvenioEjecutado: 0,
    metaNuevosConvenios: 1,
    cumplimientoNuevosConvenios: "0,00%",
    metaConvenio: 13,
    ejecutadoConvenio: 13,
    cumplimientoMantenimiento: "100,00%",
  },
  {
    id: 6,
    mes: "JULIO",
    año: "2025",
    codigo: 5,
    oficina: "ACEVEDO",
    proveedor: "Empresas Publicas de Acevedo",
    libranza: 1,
    nomina: 0,
    recaudo: 1,
    comercialFinanciamiento: 0,
    cooperacionAlianzaEstrategica: 0,
    totalConvenioEjecutado: 2,
    metaNuevosConvenios: 1,
    cumplimientoNuevosConvenios: "200,00%",
    metaConvenio: 11,
    ejecutadoConvenio: 12,
    cumplimientoMantenimiento: "109,09%",
  },
  {
    id: 7,
    mes: "JULIO",
    año: "2025",
    codigo: 5,
    oficina: "ACEVEDO",
    proveedor: "Alcaldia de Acevedo",
    libranza: 0,
    nomina: 1,
    recaudo: 0,
    comercialFinanciamiento: 0,
    cooperacionAlianzaEstrategica: 0,
    totalConvenioEjecutado: 1,
    metaNuevosConvenios: 1,
    cumplimientoNuevosConvenios: "100,00%",
    metaConvenio: 0,
    ejecutadoConvenio: 0,
    cumplimientoMantenimiento: "0,00%",
  },
];

// Options for dropdowns
const meses = [
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
];

const años = ["2025", "2026", "2027", "2028", "2029"];

// Office mapping with codes
const oficinas = [
  { nombre: "GARZON", codigo: 1 },
  { nombre: "GUADALUPE", codigo: 2 },
  { nombre: "PITAL", codigo: 3 },
  { nombre: "GIGANTE", codigo: 4 },
  { nombre: "ACEVEDO", codigo: 5 },
  { nombre: "TARQUI", codigo: 6 },
  { nombre: "LA PLATA", codigo: 7 },
  { nombre: "PITALITO", codigo: 8 },
  { nombre: "SUAZA", codigo: 9 },
  { nombre: "LA ARGENTINA", codigo: 10 },
  { nombre: "NEIVA", codigo: 11 },
  { nombre: "RIVERA", codigo: 12 },
  { nombre: "HOBO", codigo: 13 },
  { nombre: "IQUIRA", codigo: 14 },
  { nombre: "SALADOBLANCO", codigo: 15 },
  { nombre: "ESPINAL", codigo: 16 },
  { nombre: "PLANADAS", codigo: 17 },
  { nombre: "CHAPARRAL", codigo: 18 },
  { nombre: "FLORENCIA", codigo: 19 },
  { nombre: "DIRECCION GENERAL", codigo: 843 },
];

export default function ConveniosTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState([]);

  // Calculate total convenio ejecutado
  const calculateTotalConvenioEjecutado = row => {
    const libranza = parseFloat(row.libranza) || 0;
    const nomina = parseFloat(row.nomina) || 0;
    const recaudo = parseFloat(row.recaudo) || 0;
    const comercialFinanciamiento =
      parseFloat(row.comercialFinanciamiento) || 0;
    const cooperacionAlianzaEstrategica =
      parseFloat(row.cooperacionAlianzaEstrategica) || 0;
    return (
      libranza +
      nomina +
      recaudo +
      comercialFinanciamiento +
      cooperacionAlianzaEstrategica
    );
  };

  // Calculate cumplimiento nuevos convenios
  const calculateCumplimientoNuevosConvenios = row => {
    const metaNuevosConvenios = parseFloat(row.metaNuevosConvenios) || 0;
    const totalConvenioEjecutado = calculateTotalConvenioEjecutado(row);
    if (metaNuevosConvenios === 0) return "0,00%";
    const percentage = (totalConvenioEjecutado / metaNuevosConvenios) * 100;
    return `${percentage.toFixed(2).replace(".", ",")}%`;
  };

  // Calculate cumplimiento mantenimiento
  const calculateCumplimientoMantenimiento = row => {
    const metaConvenio = parseFloat(row.metaConvenio) || 0;
    const ejecutadoConvenio = parseFloat(row.ejecutadoConvenio) || 0;
    if (metaConvenio === 0) return "0,00%";
    const percentage = (ejecutadoConvenio / metaConvenio) * 100;
    return `${percentage.toFixed(2).replace(".", ",")}%`;
  };

  const handleChange = (id, field, value) => {
    // update rows state immediately
    setRows(prev =>
      prev.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };

          // Auto-update code when office changes
          if (field === "oficina") {
            const selectedOffice = oficinas.find(
              office => office.nombre === value
            );
            if (selectedOffice) {
              updatedRow.codigo = selectedOffice.codigo;
            }
          }

          // Recalculate formula fields
          updatedRow.totalConvenioEjecutado =
            calculateTotalConvenioEjecutado(updatedRow);
          updatedRow.cumplimientoNuevosConvenios =
            calculateCumplimientoNuevosConvenios(updatedRow);
          updatedRow.cumplimientoMantenimiento =
            calculateCumplimientoMantenimiento(updatedRow);

          return updatedRow;
        }
        return row;
      })
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Convenios");

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "convenios.xlsx");
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Convenios Nuevos y Mantenimiento
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por oficina o proveedor"
            className="unified-input w-[300px]"
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                MES
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                AÑO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CODIGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                OFICINA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                PROVEEDOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                LIBRANZA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMINA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                RECAUDO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                COMERCIAL Y FINANCIAMIENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                COOPERACION Y ALIANZA ESTRATEG
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TOTAL CONVENIO EJECUTADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                META NUEVOS CONVENIOS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                △ % CUMPLIMIENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                META CONVENIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                EJECUTADO CONVENIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                △ % CUMPLIMIENTO MANTENIM
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-left">
                  <select
                    value={r.mes}
                    onChange={e => handleChange(r.id, "mes", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar mes</option>
                    {meses.map(mes => (
                      <option key={mes} value={mes}>
                        {mes}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.año}
                    onChange={e => handleChange(r.id, "año", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar año</option>
                    {años.map(año => (
                      <option key={año} value={año}>
                        {año}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.codigo}
                    onChange={e => handleChange(r.id, "codigo", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                    readOnly
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.oficina}
                    onChange={e =>
                      handleChange(r.id, "oficina", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar oficina</option>
                    {oficinas.map(oficina => (
                      <option key={oficina.nombre} value={oficina.nombre}>
                        {oficina.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.proveedor}
                    onChange={e =>
                      handleChange(r.id, "proveedor", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Ingrese proveedor"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.libranza}
                    onChange={e =>
                      handleChange(r.id, "libranza", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.nomina}
                    onChange={e => handleChange(r.id, "nomina", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.recaudo}
                    onChange={e =>
                      handleChange(r.id, "recaudo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.comercialFinanciamiento}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "comercialFinanciamiento",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.cooperacionAlianzaEstrategica}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "cooperacionAlianzaEstrategica",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <span className="text-sm font-semibold">
                    {r.totalConvenioEjecutado}
                  </span>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.metaNuevosConvenios}
                    onChange={e =>
                      handleChange(r.id, "metaNuevosConvenios", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <span className="text-sm font-semibold">
                    {r.cumplimientoNuevosConvenios}
                  </span>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.metaConvenio}
                    onChange={e =>
                      handleChange(r.id, "metaConvenio", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.ejecutadoConvenio}
                    onChange={e =>
                      handleChange(r.id, "ejecutadoConvenio", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-2 border text-left">
                  <span className="text-sm font-semibold">
                    {r.cumplimientoMantenimiento}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
