"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";

import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function IndicadoresTable() {
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
        Indicadores Financieros
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

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-cupos-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap ">
                Fecha
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Indicador
              </th>
              <th className="py-4 px-28 border text-center whitespace-nowrap ">
                Alcance
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Mismo mes <br />2 años atras
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Mismo mes <br />
                año anterior
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Diciembre <br />
                año anterior
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Mes año actual
              </th>
              <th className="py-4 px-28 border text-center whitespace-nowrap ">
                Análisis
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            <tr>
              <td>02/09/2025</td>
              <td>Endedudamiento</td>
              <td>
                Es un indicador de estructura que mide la colocación eficiente
                de las captaciones. IDEAL 70% AL 80%
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                Resultado alineado con el comportamiento de los deposito y
                cartera de crédito
              </td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>Depositos</td>
              <td>
                Es un indicador de estructura que mide la colocación eficiente
                de las captaciones. IDEAL 70% AL 80%
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                Resultado alineado con el comportamiento de los deposito y
                cartera de crédito
              </td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>Cartera</td>
              <td>
                Es un indicador de estructura que mide la colocación eficiente
                de las captaciones. IDEAL 70% AL 80%
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                Resultado alineado con el comportamiento de los deposito y
                cartera de crédito
              </td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>Cartera</td>
              <td>
                Es un indicador de estructura que mide la colocación eficiente
                de las captaciones. IDEAL 70% AL 80%
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                Resultado alineado con el comportamiento de los deposito y
                cartera de crédito
              </td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>Depositos</td>
              <td>
                Es un indicador de estructura que mide la colocación eficiente
                de las captaciones. IDEAL 70% AL 80%
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                Resultado alineado con el comportamiento de los deposito y
                cartera de crédito
              </td>
            </tr>
            <tr>
              <td>02/09/2025</td>
              <td>Endedudamiento</td>
              <td>
                Es un indicador de estructura que mide la colocación eficiente
                de las captaciones. IDEAL 70% AL 80%
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                Resultado alineado con el comportamiento de los deposito y
                cartera de crédito
              </td>
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
