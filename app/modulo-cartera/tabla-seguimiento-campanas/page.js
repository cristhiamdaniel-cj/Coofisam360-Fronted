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
    oficina: 17,
    pagareVirtualCop: 1962700,
    pagareOpa: 170780,
    cedula: "1106333969",
    nombre: "Aldair Lerma Tavera",
    saldoCapital: "13.198.810",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "01/07/2025",
    gestor: "DANIELA",
    honorarios: "1.391.762",
    abogado: "PAOLA PERDOMO",
  },
  {
    id: 2,
    oficina: 11,
    pagareVirtualCop: 1963854,
    pagareOpa: 5472,
    cedula: "12100975",
    nombre: "Luis Alfonso Macias",
    saldoCapital: "79.444",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "ABONO P.",
    fecha: "01/07/2025",
    gestor: "MARTHA",
    honorarios: "17.830",
    abogado: "MAGNOLIA ESPAÑA",
  },
  {
    id: 3,
    oficina: 11,
    pagareVirtualCop: 1956151,
    pagareOpa: 100871,
    cedula: "1075309754",
    nombre: "Daniela Mildrey Caballero García",
    saldoCapital: "208.724",
    capitalCondonado: "-",
    estadoObligacion: "CASTIGO-LIAN",
    novedad: "ABONO P.",
    fecha: "02/07/2025",
    gestor: "MARTHA",
    honorarios: "49.676",
    abogado: "N/A",
  },
  {
    id: 4,
    oficina: 11,
    pagareVirtualCop: 1971644,
    pagareOpa: 102006,
    cedula: "36312378",
    nombre: "Angela Pamela Racedo Osorio",
    saldoCapital: "2.072.305",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "02/07/2025",
    gestor: "MARTHA",
    honorarios: "354.104",
    abogado: "MAGNOLIA ESPAÑA",
  },
  {
    id: 5,
    oficina: 10,
    pagareVirtualCop: 1963497,
    pagareOpa: 27392,
    cedula: "1117819139",
    nombre: "Emir Montiel Ocampo",
    saldoCapital: "2.167.137",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "01/07/2025",
    gestor: "CAMILA",
    honorarios: "117.804",
    abogado: "YESSICA MATIZ",
  },
  {
    id: 6,
    oficina: 10,
    pagareVirtualCop: 1958538,
    pagareOpa: 18091,
    cedula: "1080262003",
    nombre: "Stephany Carolina Latorre Latorre",
    saldoCapital: "2.984.079",
    capitalCondonado: "994.693",
    estadoObligacion: "CASTIGO-LIAN",
    novedad: "PAZ Y SALVO",
    fecha: "02/07/2025",
    gestor: "CAMILA",
    honorarios: "710.211",
    abogado: "N/A",
  },
  {
    id: 7,
    oficina: 7,
    pagareVirtualCop: 1976808,
    pagareOpa: 7020860,
    cedula: "66951762",
    nombre: "Luz Arbely Bravo Golondrino",
    saldoCapital: "187.000",
    capitalCondonado: "-",
    estadoObligacion: "CASTIGO-COOFISAM",
    novedad: "ABONO P.",
    fecha: "04/07/2025",
    gestor: "PAOLA",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 8,
    oficina: 1,
    pagareVirtualCop: 1956570,
    pagareOpa: 1131342,
    cedula: "1077850351",
    nombre: "Monica Guevara Vargas",
    saldoCapital: "4.443.206",
    capitalCondonado: "-",
    estadoObligacion: "POSIBLE CASTIGO",
    novedad: "PAZ Y SALVO",
    fecha: "03/07/2025",
    gestor: "DANIELA",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 9,
    oficina: 12,
    pagareVirtualCop: 1971023,
    pagareOpa: 164512,
    cedula: "36180728",
    nombre: "Amanda Ortiz",
    saldoCapital: "6.873.626",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "04/07/2025",
    gestor: "CAMILA",
    honorarios: "291.415",
    abogado: "MAGNOLIA ESPAÑA",
  },
  {
    id: 10,
    oficina: 12,
    pagareVirtualCop: 1971022,
    pagareOpa: 163760,
    cedula: "36180728",
    nombre: "Amanda Ortiz",
    saldoCapital: "361.938",
    capitalCondonado: "-",
    estadoObligacion: "POSIBLE CASTIGO",
    novedad: "PAZ Y SALVO",
    fecha: "04/07/2025",
    gestor: "CAMILA",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 11,
    oficina: 7,
    pagareVirtualCop: 1958225,
    pagareOpa: 7021585,
    cedula: "1080183615",
    nombre: "Johanna Zamora Quintero",
    saldoCapital: "360.000",
    capitalCondonado: "-",
    estadoObligacion: "CASTIGO-COOFISAM",
    novedad: "ABONO P.",
    fecha: "04/07/2025",
    gestor: "PAOLA",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 12,
    oficina: 14,
    pagareVirtualCop: 1953590,
    pagareOpa: 144627,
    cedula: "1004074671",
    nombre: "Leyder Fabian Perdomo Leyton",
    saldoCapital: "1.353.573",
    capitalCondonado: "-",
    estadoObligacion: "POSIBLE CASTIGO",
    novedad: "PAZ Y SALVO",
    fecha: "04/07/2025",
    gestor: "INGRID",
    honorarios: "-",
    abogado: "N/A",
  },
  {
    id: 13,
    oficina: 3,
    pagareVirtualCop: 1967894,
    pagareOpa: 3046914,
    cedula: "26451097",
    nombre: "Sandra Volveras Rivera",
    saldoCapital: "3.401.200",
    capitalCondonado: "-",
    estadoObligacion: "JURIDICO",
    novedad: "PAZ Y SALVO",
    fecha: "05/07/2025",
    gestor: "MARTHA",
    honorarios: "1.160.391",
    abogado: "MAGNOLIA ESPAÑA",
  },
];

export default function Page() {
  const [rows, setRows] = useState(initialRows);
  const [filteredRows, setFilteredRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState([]);
  const [search, setSearch] = useState("");

  // Live search (reactive as you type)
  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows.filter(r => {
      const matchesSearch =
        !query ||
        r.oficina?.toString().includes(query) ||
        r.pagareVirtualCop?.toString().includes(query) ||
        r.pagareOpa?.toString().includes(query) ||
        r.cedula?.toLowerCase().includes(query) ||
        r.nombre?.toLowerCase().includes(query) ||
        r.saldoCapital?.toLowerCase().includes(query) ||
        r.capitalCondonado?.toLowerCase().includes(query) ||
        r.estadoObligacion?.toLowerCase().includes(query) ||
        r.novedad?.toLowerCase().includes(query) ||
        r.gestor?.toLowerCase().includes(query) ||
        r.honorarios?.toLowerCase().includes(query) ||
        r.abogado?.toLowerCase().includes(query);

      return matchesSearch;
    });
    setFilteredRows(filtered);
  }, [search, rows]);

  // Opciones para los dropdowns
  const estadoObligacionOptions = [
    "JURIDICO",
    "POSIBLE CASTIGO",
    "CASTIGO-CJ",
    "CASTIGO-LIAN",
    "CASTIGO-SURCOLOMB.",
    "CASTIGO-COOFISAM",
  ];

  const novedadOptions = ["PAZ Y SALVO", "ABONO P."];

  const gestorOptions = [
    "PAOLA",
    "DANIELA",
    "SANDRA",
    "MARTHA",
    "PAULA",
    "CAMILA",
    "CAROLINA",
    "GRUPAL",
    "INGRID",
  ];

  const abogadoOptions = [
    "SANDRA CHARRY",
    "MAGNOLIA ESPAÑA",
    "CARMEN ALVAREZ",
    "ARMANDO TAMAYO",
    "DIEGO BAHAMON",
    "PAOLA PERDOMO",
    "MIGUEL FLORIANO",
    "DIEGO RODRIGUEZ",
    "LILI IBAÑEZ",
    "YESSICA MATIZ",
    "LINO ROJAS",
    "MARIA JOSE MURCIA",
    "CLARA INES",
    "N/A",
  ];

  const handleChange = (id, field, value) => {
    // update rows state immediately
    setRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );

    // update filteredRows state immediately
    setFilteredRows(prev =>
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
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Asignación de llamadas
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cédula, nombre, gestor, abogado..."
            className="unified-input w-[300px]"
          />
          <button className="unified-button flex gap-2 items-center justify-center">
            Buscar
            <IoSearch />
          </button>
        </div>
        <div className="flex gap-4">
          {Object.keys(editedRows).length > 0 && (
            <button
              onClick={handleSave}
              className="unified-button flex gap-2 items-center justify-center"
            >
              Guardar cambios
              <FaRegSave />
            </button>
          )}
          <button
            className="unified-button flex gap-2 items-center justify-center"
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Pagaré VirtualCop
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Pagaré OPA
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                Cédula
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Nombre
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Saldo a Capital
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Capital Condonado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Estado de la Obligación
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                Novedad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Fecha
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                Gestor
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                Honorarios
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Abogado
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(row => (
              <tr key={row.id}>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={row.oficina || ""}
                    onChange={e =>
                      handleChange(
                        row.id,
                        "oficina",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={row.pagareVirtualCop || ""}
                    onChange={e =>
                      handleChange(
                        row.id,
                        "pagareVirtualCop",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={row.pagareOpa || ""}
                    onChange={e =>
                      handleChange(
                        row.id,
                        "pagareOpa",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    value={row.cedula || ""}
                    onChange={e =>
                      handleChange(row.id, "cedula", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    value={row.nombre || ""}
                    onChange={e =>
                      handleChange(row.id, "nombre", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    value={row.saldoCapital || ""}
                    onChange={e =>
                      handleChange(row.id, "saldoCapital", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    value={row.capitalCondonado || ""}
                    onChange={e =>
                      handleChange(row.id, "capitalCondonado", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={row.estadoObligacion || ""}
                    onChange={e =>
                      handleChange(row.id, "estadoObligacion", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar estado</option>
                    {estadoObligacionOptions.map(estado => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={row.novedad || ""}
                    onChange={e =>
                      handleChange(row.id, "novedad", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar novedad</option>
                    {novedadOptions.map(novedad => (
                      <option key={novedad} value={novedad}>
                        {novedad}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="date"
                    value={row.fecha || ""}
                    onChange={e =>
                      handleChange(row.id, "fecha", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={row.gestor || ""}
                    onChange={e =>
                      handleChange(row.id, "gestor", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar gestor</option>
                    {gestorOptions.map(gestor => (
                      <option key={gestor} value={gestor}>
                        {gestor}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    value={row.honorarios || ""}
                    onChange={e =>
                      handleChange(row.id, "honorarios", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={row.abogado || ""}
                    onChange={e =>
                      handleChange(row.id, "abogado", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar abogado</option>
                    {abogadoOptions.map(abogado => (
                      <option key={abogado} value={abogado}>
                        {abogado}
                      </option>
                    ))}
                  </select>
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
