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
    agencia: "4 - OFICINA GIGANTE",
    numeroCredito: "1953289",
    lineaCredito: "CON LIBRE INVERSION",
    numeroIdentificacion: "1000493927",
    nombreAsociado: "Lizeth Cubillos Mendez",
    saldoCapital: 2712282,
    diasMora: 0,
    periodicidadCapital: "Mensual",
    tipoGarantia: "Codeudores",
    celular: "3183784519",
    estado: "Normal",
    gestor: "INGRID",
    fechaGestion: "07/07/2025",
    fechaAcuerdo: "",
    gestionTitular: "AL DIA",
    gestionCodeudor: "",
    novedadGestion: "",
    programarVisita: "",
    gestorApoya: "",
    calificacion: "",
  },
  {
    agencia: "13 - OFICINA HOBO",
    numeroCredito: "1953298",
    lineaCredito: "CON LIBRE INVERSION",
    numeroIdentificacion: "1000936255",
    nombreAsociado: "Cesar Augusto Guerrero Sanchez",
    saldoCapital: 774346,
    diasMora: 63,
    periodicidadCapital: "Mensual",
    tipoGarantia: "Codeudores",
    celular: "3212087062",
    estado: "Normal",
    gestor: "INGRID",
    fechaGestion: "07/08/2025",
    fechaAcuerdo: "",
    gestionTitular: "NO CONTESTO",
    gestionCodeudor: "NO CONTESTO",
    novedadGestion: "",
    programarVisita: "PROGRAMAR VISITA",
    gestorApoya: "",
    calificacion: "",
  },
  {
    agencia: "8 - OFICINA PITALITO",
    numeroCredito: "1953331",
    lineaCredito: "PRO POP.PROD.URBANO EMPRESARIAL",
    numeroIdentificacion: "1003260079",
    nombreAsociado: "Ana Yugeth Arenas Mandon",
    saldoCapital: 1600260,
    diasMora: 33,
    periodicidadCapital: "Mensual",
    tipoGarantia: "Codeudores",
    celular: "3212572661",
    estado: "Normal",
    gestor: "INGRID",
    fechaGestion: "07/08/2025",
    fechaAcuerdo: "",
    gestionTitular: "MENSAJE  WHATSAPP",
    gestionCodeudor: "NO CONTESTO",
    novedadGestion: "",
    programarVisita: "",
    gestorApoya: "",
    calificacion: "",
  },
  {
    agencia: "16 - OFICINA ESPINAL",
    numeroCredito: "1953334",
    lineaCredito: "MIC EMPRESARIAL",
    numeroIdentificacion: "1003555758",
    nombreAsociado: "Dayana Oliveros Perdomo",
    saldoCapital: 6198206,
    diasMora: 78,
    periodicidadCapital: "Mensual",
    tipoGarantia: "Avalista / Fondo de garantía no Idóneo",
    celular: "3160497111",
    estado: "Normal",
    gestor: "INGRID",
    fechaGestion: "07/07/2025",
    fechaAcuerdo: "",
    gestionTitular: "MENSAJE  WHATSAPP",
    gestionCodeudor: "NO CONTESTO",
    novedadGestion: "",
    programarVisita: "",
    gestorApoya: "",
    calificacion: "",
  },
  {
    agencia: "3 - OFICINA EL PITAL",
    numeroCredito: "1953344",
    lineaCredito: "CON LIBRE INVERSION",
    numeroIdentificacion: "1003762754",
    nombreAsociado: "Keinny Vanesa Tavera Trujillo",
    saldoCapital: 2831351,
    diasMora: 3,
    periodicidadCapital: "Mensual",
    tipoGarantia: "Firma Personal",
    celular: "3209135857",
    estado: "Normal",
    gestor: "INGRID",
    fechaGestion: "07/07/2025",
    fechaAcuerdo: "",
    gestionTitular: "AL DIA",
    gestionCodeudor: "",
    novedadGestion: "",
    programarVisita: "",
    gestorApoya: "",
    calificacion: "",
  },
  {
    agencia: "14 - OFICINA IQUIRA",
    numeroCredito: "1953589",
    lineaCredito: "CON LIBRE INVERSION",
    numeroIdentificacion: "1004074530",
    nombreAsociado: "Karen Yulieth Vargas Vargas",
    saldoCapital: 894754,
    diasMora: 0,
    periodicidadCapital: "Mensual",
    tipoGarantia: "Codeudores",
    celular: "3176533812",
    estado: "Normal",
    gestor: "INGRID",
    fechaGestion: "07/07/2025",
    fechaAcuerdo: "",
    gestionTitular: "AL DIA",
    gestionCodeudor: "",
    novedadGestion: "",
    programarVisita: "",
    gestorApoya: "",
    calificacion: "",
  },
  {
    agencia: "4 - OFICINA GIGANTE",
    numeroCredito: "1953642",
    lineaCredito: "MIC AGROPECUARIO",
    numeroIdentificacion: "1004148194",
    nombreAsociado: "Diego Andres Beltran Ortiz",
    saldoCapital: 3758124,
    diasMora: 0,
    periodicidadCapital: "Semestral",
    tipoGarantia: "Avalista / Fondo de garantía no Idóneo",
    celular: "3214017558",
    estado: "Normal",
    gestor: "INGRID",
    fechaGestion: "07/07/2025",
    fechaAcuerdo: "",
    gestionTitular: "AL DIA",
    gestionCodeudor: "",
    novedadGestion: "",
    programarVisita: "",
    gestorApoya: "",
    calificacion: "",
  },
  {
    agencia: "4 - OFICINA GIGANTE",
    numeroCredito: "1953660",
    lineaCredito: "CON LIBRE INVERSION",
    numeroIdentificacion: "1004149161",
    nombreAsociado: "Ana Solangie Calderon Bermeo",
    saldoCapital: 1269761,
    diasMora: 0,
    periodicidadCapital: "Mensual",
    tipoGarantia: "Firma Personal",
    celular: "3222379749",
    estado: "Sacar de juridico",
    gestor: "INGRID",
    fechaGestion: "07/08/2025",
    fechaAcuerdo: "",
    gestionTitular: "AL DIA",
    gestionCodeudor: "",
    novedadGestion: "",
    programarVisita: "",
    gestorApoya: "",
    calificacion: "",
  },
];

export default function AsignacionLlamadasTable() {
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
        Asignación de llamadas
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
          <thead className="tabla-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Agencia
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Crédito
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Línea de Crédito
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Número de Identificación
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Nombre Asociado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Saldo Capital
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Días Mora
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Periodicidad Capital
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Tipo Garantía
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Celular
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Estado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestor
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Fecha Gestión
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Fecha Acuerdo
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestión Titular
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestión Codeudor
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Novedad Gestión
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Programar Visita
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestor Apoya
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Calificación
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.agencia}</td>
                <td>{r.numeroCredito}</td>
                <td>{r.lineaCredito}</td>
                <td>{r.numeroIdentificacion}</td>
                <td>{r.nombreAsociado}</td>
                <td>{r.saldoCapital}</td>
                <td>{r.diasMora}</td>
                <td>{r.periodicidadCapital}</td>
                <td>{r.tipoGarantia}</td>
                <td>{r.celular}</td>
                <td>{r.estado}</td>
                <td>{r.gestor}</td>
                <td>{r.fechaGestion}</td>
                <td>{r.fechaAcuerdo}</td>
                <td>{r.gestionTitular}</td>
                <td>{r.gestionCodeudor}</td>
                <td>{r.novedadGestion}</td>
                <td>{r.programarVisita}</td>
                <td>{r.gestorApoya}</td>
                <td>{r.calificacion}</td>
              </tr>
            ))}

            {/*records.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.amount}</td>
              <td>{r.description}</td>
            </tr>
          ))*/}
          </tbody>
        </table>
      </div>
    </main>
  );
}
