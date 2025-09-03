"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";

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

  const [rows, setRows] = useState([
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
  ]);

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
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
            Descargar
            <FaFileDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container h-[70vh]">
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
                <td>{row.entidades}</td>
                <td>{row.poblacion}</td>
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
