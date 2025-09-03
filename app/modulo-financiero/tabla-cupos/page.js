"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";

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
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            <tr>
              <td>02/09/2025</td>
              <td>1254884</td>
              <td>Bancolombia</td>
              <td>30.000.000</td>
              <td>15.000.000</td>
              <td>15.000.000</td>
              <td>Firma Institucional</td>
              <td>50%</td>
              <td>60</td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>1254884</td>
              <td>Bancolombia</td>
              <td>30.000.000</td>
              <td>15.000.000</td>
              <td>15.000.000</td>
              <td>Firma Institucional</td>
              <td>50%</td>
              <td>60</td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>1254884</td>
              <td>Bancolombia</td>
              <td>30.000.000</td>
              <td>15.000.000</td>
              <td>15.000.000</td>
              <td>Firma Institucional</td>
              <td>50%</td>
              <td>60</td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>1254884</td>
              <td>Bancolombia</td>
              <td>30.000.000</td>
              <td>15.000.000</td>
              <td>15.000.000</td>
              <td>Firma Institucional</td>
              <td>50%</td>
              <td>60</td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>1254884</td>
              <td>Bancolombia</td>
              <td>30.000.000</td>
              <td>15.000.000</td>
              <td>15.000.000</td>
              <td>Firma Institucional</td>
              <td>50%</td>
              <td>60</td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>1254884</td>
              <td>Bancolombia</td>
              <td>30.000.000</td>
              <td>15.000.000</td>
              <td>15.000.000</td>
              <td>Firma Institucional</td>
              <td>50%</td>
              <td>60</td>
            </tr>
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
