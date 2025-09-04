"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
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

  const initialRows = [
    {
      id: 1,
      fecha: "12-25-2005",
      indicador: "Endedudamiento",
      alcance:
        "Es un indicador de estructura que mide la colocación eficiente de las captaciones. IDEAL 70% AL 80%",
      mes2a: "",
      mes1a: "",
      diciembre1a: "",
      mesActual: "",
      analisis:
        "Resultado alineado con el comportamiento de los deposito y cartera de crédito",
    },
    {
      id: 2,
      fecha: "12-25-2005",
      indicador: "Endedudamiento",
      alcance:
        "Es un indicador de estructura que mide la colocación eficiente de las captaciones. IDEAL 70% AL 80%",
      mes2a: "",
      mes1a: "",
      diciembre1a: "",
      mesActual: "",
      analisis:
        "Resultado alineado con el comportamiento de los deposito y cartera de crédito",
    },
    {
      id: 3,
      fecha: "12-25-2005",
      indicador: "Endedudamiento",
      alcance:
        "Es un indicador de estructura que mide la colocación eficiente de las captaciones. IDEAL 70% AL 80%",
      mes2a: "",
      mes1a: "",
      diciembre1a: "",
      mesActual: "",
      analisis:
        "Resultado alineado con el comportamiento de los deposito y cartera de crédito",
    },
    {
      id: 4,
      fecha: "12-25-2005",
      indicador: "Endedudamiento",
      alcance:
        "Es un indicador de estructura que mide la colocación eficiente de las captaciones. IDEAL 70% AL 80%",
      mes2a: "",
      mes1a: "",
      diciembre1a: "",
      mesActual: "",
      analisis:
        "Resultado alineado con el comportamiento de los deposito y cartera de crédito",
    },
    {
      id: 5,
      fecha: "12-25-2005",
      indicador: "Endedudamiento",
      alcance:
        "Es un indicador de estructura que mide la colocación eficiente de las captaciones. IDEAL 70% AL 80%",
      mes2a: "",
      mes1a: "",
      diciembre1a: "",
      mesActual: "",
      analisis:
        "Resultado alineado con el comportamiento de los deposito y cartera de crédito",
    },
    {
      id: 6,
      fecha: "12-25-2005",
      indicador: "Endedudamiento",
      alcance:
        "Es un indicador de estructura que mide la colocación eficiente de las captaciones. IDEAL 70% AL 80%",
      mes2a: "",
      mes1a: "",
      diciembre1a: "",
      mesActual: "",
      analisis:
        "Resultado alineado con el comportamiento de los deposito y cartera de crédito",
    },
    {
      id: 7,
      fecha: "12-25-2005",
      indicador: "Endedudamiento",
      alcance:
        "Es un indicador de estructura que mide la colocación eficiente de las captaciones. IDEAL 70% AL 80%",
      mes2a: "",
      mes1a: "",
      diciembre1a: "",
      mesActual: "",
      analisis:
        "Resultado alineado con el comportamiento de los deposito y cartera de crédito",
    },
    {
      id: 8,
      fecha: "12-25-2005",
      indicador: "Endedudamiento",
      alcance:
        "Es un indicador de estructura que mide la colocación eficiente de las captaciones. IDEAL 70% AL 80%",
      mes2a: "",
      mes1a: "",
      diciembre1a: "",
      mesActual: "",
      analisis:
        "Resultado alineado con el comportamiento de los deposito y cartera de crédito",
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

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-cupos-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
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
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.fecha}</td>
                <td>{r.indicador}</td>
                <td>{r.alcance}</td>
                <td>{r.mes2a}</td>
                <td>{r.mes1a}</td>
                <td>{r.diciembre1a}</td>
                <td>{r.mesActual}</td>
                <td>
                  <input
                    type="text"
                    value={r.analisis}
                    onChange={e =>
                      handleChange(r.id, "analisis", e.target.value)
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
