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
  listRestriccionesRows,
  saveRestriccionRow,
} from "../../../services/modulo-talento/carpeta-sistema-gestion-salud/restriccionesQuota";

const cargos = [
  "ANALISTA DE CREDITO 1",
  "ANALISTA DE RIESGOS",
  "Analista Ingeniería Organizacional",
  "APRENDIZ ETAPA PRODUCTIVA",
  "ASESOR COMERCIAL AGENCIA 1",
  "ASESOR COMERCIAL AGENCIA 2",
  "ASESOR COMERCIAL AGENCIA 3",
  "ASESOR COMERCIAL AGENCIA 4",
  "ASESOR COMERCIAL CORRESPONSAL SOLIDARIO",
  "ASESOR FINANCIERO RURAL",
  "ASESOR MICROFINANZAS URBANO",
  "ASISTENTE BASE DE DATOS",
  "ASISTENTE CIENCIA DE DATOS",
  "ASISTENTE CONTABILIDAD",
  "AUX. SERV. GENERALES AGENCIA 1",
  "AUX. SERV. GENERALES DIRECCIÓN GENERAL",
  "Auxiliar Comunicaciones",
  "AUXILIAR CONTABILIDAD 2",
  "AUXILIAR DE AUDITORIA 1",
  "AUXILIAR DE AUDITORIA 2",
  "AUXILIAR DE CARTERA 1",
  "AUXILIAR DE CARTERA 2",
  "AUXILIAR DE CONTABILIDAD 1",
  "AUXILIAR DE CREDITO 1",
  "AUXILIAR DE CREDITO 2",
  "AUXILIAR DE GESTIÓN DOCUMENTAL",
  "AUXILIAR DE PUBLICIDAD",
  "AUXILIAR DE TALENTO Y CULTURA",
  "AUXILIAR JURIDICO 1",
  "AUXILIAR JURIDICO 2",
  "AUXILIAR OFICIAL DE CUMPLIMIENTO",
  "Auxiliar Seguridad y Salud en el Trabajo",
  "AUXILIAR SOCIAL MEDIA",
  "CAJERO 1 AGENCIA 1",
  "CAJERO 1 AGENCIA 2",
  "CAJERO AGENCIA 3",
  "CAJERO AGENCIA 4",
  "CAJERO AGENCIA 4A",
  "COORDINADOR DE CARTERA",
  "COORDINADOR DE COMUNICACIONES",
  "COORDINADOR DE MERCADEO",
  "COORDINADOR DE TALENTO Y CULTURA",
  "COORDINADOR GESTION DOCUMENTAL",
  "DIRECTOR AGENCIA 1",
  "DIRECTOR AGENCIA 2",
  "DIRECTOR AGENCIA 3",
  "DIRECTOR AGENCIA 4",
  "DIRECTOR AGENCIA 4A",
  "DIRECTOR AUDITORIA INTERNA",
  "DIRECTOR COMERCIAL",
  "DIRECTOR CONTABILIDAD",
  "DIRECTOR CREDITO",
  "DIRECTOR DE RIESGOS",
  "DIRECTOR DE TEGNOLOGIA",
  "DIRECTOR INGENIERIA ORGANIZACIONAL",
  "DIRECTOR JURIDICO",
  "FORMADOR DE TALENTO Y CULTURA",
  "GERENTE GENERAL",
  "GESTOR COMERCIAL",
  "GESTOR DE CANALES",
  "GESTOR DE CARTERA 1",
  "GESTOR DE CARTERA 2",
  "GESTOR MICROFINANZAS",
  "JEFE OPERACIONES AGENCIA 1",
  "JEFE OPERACIONES AGENCIA 2",
  "JEFE OPERACIONES AGENCIA 3",
  "JEFE OPERACIONES AGENCIA 4",
  "JEFE OPERACIONES AGENCIA 4A",
  "OFICIAL DE CUMPLIMIENTO",
  "PRACTICANTE UNIVERSITARIO",
  "SECRETARIA DE GERENCIA",
  "SUBGERENTE COMERCIAL",
  "SUBGERENTE DE CREDITO Y CARTERA",
  "SUBGERENTE FINANCIERO",
  "SUBGERENTE INNOVACION EMPRESARIAL",
  "SUPERNUMERARIO DE OFICINA",
  "SUPERNUMERARIO MICROFINANZAS",
  "SUPERNUMERARIO MICROFINANZAS 1",
  "TESORERO",
];

const oficinas = [
  "GARZON",
  "GUADALUPE",
  "PITAL",
  "GIGANTE",
  "ACEVEDO",
  "TARQUI",
  "LA PLATA",
  "PITALITO",
  "SUAZA",
  "LA ARGENTINA",
  "NEIVA",
  "RIVERA",
  "HOBO",
  "IQUIRA",
  "SALADOBLANCO",
  "ESPINAL",
  "PLANADAS",
  "CHAPARRAL",
  "FLORENCIA",
  "DIRECCION GENERAL",
];

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
        const data = await listRestriccionesRows({ limit: 500 });
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

  // Función para agregar una nueva fila al inicio de la tabla
  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`, // ID único temporal
      anio: new Date().getFullYear(), // Año actual
      oficina: oficinas[0] || "", // primera opción por defecto
      cargo: cargos[0] || "", // primera opción por defecto
      patologia: "",
      restricciones: "",
      isNew: true, // marca que es una fila nueva
    };

    // Agregar al inicio de la tabla
    setRows(prev => [newRow, ...prev]);
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Reporte Ministerio
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
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
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-center whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.anio}
                      onChange={e => handleChange(idx, "anio", e.target.value)}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    r.anio
                  )}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  <select
                    value={r.oficina}
                    onChange={e => {
                      handleChange(idx, "oficina", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {oficinas.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  <select
                    value={r.cargo}
                    onChange={e => {
                      handleChange(idx, "cargo", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {cargos.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center ">
                  <input
                    type="text"
                    value={r.patologia}
                    onChange={e => {
                      handleChange(idx, "patologia", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-center ">
                  <input
                    type="text"
                    value={r.restricciones}
                    onChange={e => {
                      handleChange(idx, "restricciones", e.target.value);
                    }}
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
