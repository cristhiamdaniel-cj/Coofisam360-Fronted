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
    tipo: "Llamada",
    fechaGestion: "04/06/2024",
    comentario: "Asociado remite soporte de pago para cancelar cuota de junio",
    nroProducto: "1955971",
    cedula: "1075280799",
    nombre: "Daniel Sebastian Rojas Mazorra",
    usuarioGestion: "DASU",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 2,
    tipo: "Acuerdo de Pago",
    fechaGestion: "04/06/2024",
    comentario:
      "Asociado se presenta a la oficina, reconoce el estado de la obligación, solicita plazo hasta el fin de semana, se recomienda dar cumplimiento",
    nroProducto: "1961553",
    cedula: "1083879986",
    nombre: "Daniel Jimenez Burbano",
    usuarioGestion: "IMVA",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 3,
    tipo: "Prejuridico",
    fechaGestion: "04/06/2024",
    comentario: "Gestión migración",
    nroProducto: "1963965",
    cedula: "12122354",
    nombre: "Aristobulo Cardozo Quimbayo",
    usuarioGestion: "operativo",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 4,
    tipo: "Acuerdo de Pago",
    fechaGestion: "04/06/2024",
    comentario:
      "ASOCIADO SE ACERCA A REALIZAR ABONO DE 1.000.000, Y MANIFIESTA QUE EL SALDO LO CANCELA PARA EL DIA 20/06/2024, PENDIENTE RECIBIR EFECTIVO. CLAG",
    nroProducto: "1973426",
    cedula: "4937585",
    nombre: "Hector Hernando Anacona Peña",
    usuarioGestion: "CLAG",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 5,
    tipo: "Prejuridico",
    fechaGestion: "04/06/2024",
    comentario: "Asignación por migración",
    nroProducto: "1967613",
    cedula: "26431629",
    nombre: "Yamile Gallego Trujillo",
    usuarioGestion: "operativo",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 6,
    tipo: "Prejuridico",
    fechaGestion: "04/06/2024",
    comentario: "Asignación por migración",
    nroProducto: "1959233",
    cedula: "1081156288",
    nombre: "Monica Andrade Mendoza",
    usuarioGestion: "operativo",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 7,
    tipo: "Prejuridico",
    fechaGestion: "04/06/2024",
    comentario: "Asignación por migración",
    nroProducto: "1966853",
    cedula: "15327597",
    nombre: "Querubin Ospina Mejia",
    usuarioGestion: "operativo",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 8,
    tipo: "Prejuridico",
    fechaGestion: "04/06/2024",
    comentario: "Asignación por migración.",
    nroProducto: "1967119",
    cedula: "17657316",
    nombre: "Pablo Andres Alvarez Vega",
    usuarioGestion: "operativo",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 9,
    tipo: "Prejuridico",
    fechaGestion: "04/06/2024",
    comentario: "Gestión por migración",
    nroProducto: "1955639",
    cedula: "1075222252",
    nombre: "Blanca Lorena Quintero Herrera",
    usuarioGestion: "operativo",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 10,
    tipo: "Prejuridico",
    fechaGestion: "04/06/2024",
    comentario: "Asignación por migración.",
    nroProducto: "1955381",
    cedula: "1060207896",
    nombre: "Alexander Penagos Torres",
    usuarioGestion: "operativo",
    oficina: "",
    gestionValidada: "",
  },
  {
    id: 11,
    tipo: "Prejuridico",
    fechaGestion: "04/06/2024",
    comentario: "Asignación por migración.",
    nroProducto: "1963462",
    cedula: "1117542235",
    nombre: "Yeraldin Yineth Poveda Collazos",
    usuarioGestion: "operativo",
    oficina: "",
    gestionValidada: "",
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
        Gestiones
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                Tipo
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Fecha de la gestión
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[400px]">
                Comentario
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Nro producto
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cédula
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Nombre
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Usuario Gestión
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestión Validada
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.tipo}</td>
                <td className="p-2 border text-center">{r.fechaGestion}</td>
                <td className="p-2 border text-center">{r.comentario}</td>
                <td className="p-2 border text-center">{r.nroProducto}</td>
                <td className="p-2 border text-center">{r.cedula}</td>
                <td className="p-2 border text-center">{r.nombre}</td>
                <td className="p-2 border text-center">{r.usuarioGestion}</td>
                <td className="p-2 border text-center">{r.oficina}</td>
                <td className="p-2 border text-center">{r.gestionValidada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
