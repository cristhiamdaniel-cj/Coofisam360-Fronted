"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaFileUpload } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function FinancialPage() {
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
    <main className="p-12 overflow-auto">
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
            Cargar
            <FaFileUpload />
          </button>
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
            Descargar
            <FaFileDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container">
        <table className="tabla-cupos table-fixed">
          <thead className="tabla-cupos-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap w-full">
                Fecha Renovado
              </th>
              <th className="p-4 border text-center whitespace-nowrap w-full">
                Cuenta
              </th>
              <th className="p-4 border text-center whitespace-nowrap w-full">
                Entidad Financiera
              </th>
              <th className="p-4 border text-center whitespace-nowrap w-full">
                Cupo Asignado
              </th>
              <th className="p-4 border text-center whitespace-nowrap w-full">
                Cupo Ejecutado
              </th>
              <th className="p-4 border text-center whitespace-nowrap w-full">
                Disponible
              </th>
              <th className="p-4 border text-center whitespace-nowrap w-full">
                Garantia
              </th>
              <th className="p-4 border text-center whitespace-nowrap w-full">
                % Utilizacion
              </th>
              <th className="p-4 border text-center whitespace-nowrap w-full">
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
