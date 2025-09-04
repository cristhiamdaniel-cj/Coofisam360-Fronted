"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function CuposTable() {
  //const [records, setRecords] = useState([]);

  /*useEffect(() => {
    async function loadData() {
      const data = await getFinancialRecords();
      setRecords(data);
    }
    loadData();
  }, []);
  */

  const initialRows = [
    {
      id: 1,
      fecha: "2025-09-02",
      cuenta: "12345",
      entidad: "Banco de Bogotá",
      asignado: "50000",
      ejecutado: "20000",
      disponible: "30000",
      garantia: "Hipoteca",
      utilizacion: "40%",
      plazo: "12",
      tasa: "La vigente al reesembolso",
    },
    {
      id: 2,
      fecha: "2025-09-10",
      cuenta: "67890",
      entidad: "Davivienda",
      asignado: "70000",
      ejecutado: "50000",
      disponible: "20000",
      garantia: "Fianza",
      utilizacion: "71%",
      plazo: "24",
      tasa: "La vigente al reesembolso",
    },
    {
      id: 3,
      fecha: "2025-09-02",
      cuenta: "12345",
      entidad: "Banco de Bogotá",
      asignado: "50000",
      ejecutado: "20000",
      disponible: "30000",
      garantia: "Hipoteca",
      utilizacion: "40%",
      plazo: "12",
      tasa: "La vigente al reesembolso",
    },
    {
      id: 4,
      fecha: "2025-09-10",
      cuenta: "67890",
      entidad: "Davivienda",
      asignado: "70000",
      ejecutado: "50000",
      disponible: "20000",
      garantia: "Fianza",
      utilizacion: "71%",
      plazo: "24",
      tasa: "La vigente al reesembolso",
    },
    {
      id: 5,
      fecha: "2025-09-02",
      cuenta: "12345",
      entidad: "Banco de Bogotá",
      asignado: "50000",
      ejecutado: "20000",
      disponible: "30000",
      garantia: "Hipoteca",
      utilizacion: "40%",
      plazo: "12",
      tasa: "La vigente al reesembolso",
    },
    {
      id: 6,
      fecha: "2025-09-10",
      cuenta: "67890",
      entidad: "Davivienda",
      asignado: "70000",
      ejecutado: "50000",
      disponible: "20000",
      garantia: "Fianza",
      utilizacion: "71%",
      plazo: "24",
      tasa: "La vigente al reesembolso",
    },
    {
      id: 7,
      fecha: "2025-09-02",
      cuenta: "12345",
      entidad: "Banco de Bogotá",
      asignado: "50000",
      ejecutado: "20000",
      disponible: "30000",
      garantia: "Hipoteca",
      utilizacion: "40%",
      plazo: "12",
      tasa: "La vigente al reesembolso",
    },
    {
      id: 8,
      fecha: "2025-09-10",
      cuenta: "67890",
      entidad: "Davivienda",
      asignado: "70000",
      ejecutado: "50000",
      disponible: "20000",
      garantia: "Fianza",
      utilizacion: "71%",
      plazo: "24",
      tasa: "La vigente al reesembolso",
    },
  ];

  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});

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

  return (
    <main className="pt-12 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-12">
        Cupo Créditos
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
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
            Descargar
            <FaFileDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-cupos-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">
                Fecha Renovado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cuenta
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Entidad Financiera
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cupo Asignado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cupo Ejecutado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Disponible
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Garantia
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Utilizacion
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Plazo/Meses
              </th>
              <th className="p-4 border text-center whitespace-nowrap">Tasa</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td>
                  <input
                    type="date"
                    value={r.fecha}
                    onChange={e => handleChange(r.id, "fecha", e.target.value)}
                    className="px-2 py-1 w-full cursor-pointer"
                  />
                </td>
                <td>{r.cuenta}</td>
                <td>{r.entidad}</td>
                <td>
                  <input
                    type="number"
                    value={r.asignado}
                    onChange={e =>
                      handleChange(r.id, "asignado", e.target.value)
                    }
                    className="px-2 py-1 w-full cursor-pointer"
                  />
                </td>
                <td>{r.ejecutado}</td>
                <td>{r.disponible}</td>
                <td className="min-w-[350px]">
                  <input
                    type="text"
                    value={r.garantia}
                    onChange={e =>
                      handleChange(r.id, "garantia", e.target.value)
                    }
                    className="px-2 py-1 w-full cursor-pointer"
                  />
                </td>
                <td>{r.utilizacion}</td>
                <td>{r.plazo}</td>
                <td>{r.tasa}</td>
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
