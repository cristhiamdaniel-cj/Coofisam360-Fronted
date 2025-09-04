"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function CategoriasTable() {
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
      codigo: "1",
      nombre: "Garzon",
      fecha: "20/07/1991",
      entidades: "5",
      poblacion: "1234",
    },
    {
      id: 2,
      codigo: "2",
      nombre: "Guadalupe",
      fecha: "20/07/1991",
      entidades: "7",
      poblacion: "1234",
    },
    {
      id: 3,
      codigo: "3",
      nombre: "Pital",
      fecha: "20/07/1991",
      entidades: "9",
      poblacion: "1234",
    },
    {
      id: 4,
      codigo: "4",
      nombre: "Gigante",
      fecha: "20/07/1991",
      entidades: "1",
      poblacion: "1234",
    },
    {
      id: 5,
      codigo: "5",
      nombre: "Acevedo",
      fecha: "20/07/1991",
      entidades: "4",
      poblacion: "1234",
    },
    {
      id: 6,
      codigo: "6",
      nombre: "Tarqui",
      fecha: "20/07/1991",
      entidades: "2",
      poblacion: "1234",
    },
    {
      id: 7,
      codigo: "7",
      nombre: "La Plata",
      fecha: "20/07/1991",
      entidades: "10",
      poblacion: "1234",
    },
    {
      id: 8,
      codigo: "8",
      nombre: "Pitalito",
      fecha: "20/07/1991",
      entidades: "6",
      poblacion: "1234",
    },
  ];

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

  return (
    <main className="pt-12 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-12">
        Categorias Oficinas
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
              <th className="p-4 border text-center whitespace-nowrap ">
                Codigo Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Nombre Oficina
              </th>

              <th className="p-4 border text-center whitespace-nowrap ">
                Cta PUC 14
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Cta PUC 21
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Asociados
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Fecha de Apertura
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Entidades Financieras
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Población
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {rows.map(row => (
              <tr key={row.id}>
                <td>{row.codigo}</td>
                <td>{row.nombre}</td>
                <td></td>
                <td></td>
                <td></td>
                <td>{row.fecha}</td>
                <td>
                  <input
                    type="number"
                    value={row.entidades}
                    onChange={e =>
                      handleChange(row.id, "entidades", e.target.value)
                    }
                    className="px-2 py-1 w-full cursor-pointer"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.poblacion}
                    onChange={e =>
                      handleChange(row.id, "poblacion", e.target.value)
                    }
                    className="px-2 py-1 w-full cursor-pointer"
                  />
                </td>
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
