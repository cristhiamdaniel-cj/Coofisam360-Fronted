"use client";
import { useState, useEffect } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Inventario General
const inventarioGeneral = [
  {
    id: 1,
    numero: 1,
    codigo: "CAJA02",
    materialCorporativo: "CAJAS ESTATUILLAS",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 2,
    numero: 2,
    codigo: "LIBR01",
    materialCorporativo: "LIBRETA APUNTES",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 3,
    numero: 3,
    codigo: "BATI01",
    materialCorporativo: "BATIDORA",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 4,
    numero: 4,
    codigo: "FREI01",
    materialCorporativo: "FREIDORAS OSTER",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 5,
    numero: 5,
    codigo: "CERS01",
    materialCorporativo: "CERRADO Y SALIDA",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 6,
    numero: 6,
    codigo: "BOLS01",
    materialCorporativo: "BOLSO CORPORATIVOS",
    entrada: 3,
    salida: 3,
    stock: 0,
  },
  {
    id: 7,
    numero: 7,
    codigo: "SAND01",
    materialCorporativo: "SANDUCHERA KALLEY",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 8,
    numero: 8,
    codigo: "LLAVE01",
    materialCorporativo: "LLAVEROS CUADRADO QR",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 9,
    numero: 9,
    codigo: "AVIS02",
    materialCorporativo: "AVISOS CONVENIOS PESTAÑA",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 10,
    numero: 10,
    codigo: "ALCA01",
    materialCorporativo: "ALCANCIAS  CORAZON",
    entrada: 57,
    salida: 32,
    stock: 25,
  },
  {
    id: 11,
    numero: 11,
    codigo: "BALO01",
    materialCorporativo: "BALONES",
    entrada: 2,
    salida: 0,
    stock: 2,
  },
  {
    id: 12,
    numero: 12,
    codigo: "BOMB01",
    materialCorporativo: "BOMBAS BLANCAS",
    entrada: 50,
    salida: 50,
    stock: 0,
  },
  {
    id: 13,
    numero: 13,
    codigo: "BOMB02",
    materialCorporativo: "BOMBAS ROJAS",
    entrada: 50,
    salida: 50,
    stock: 0,
  },
  {
    id: 14,
    numero: 14,
    codigo: "CAMB02",
    materialCorporativo: "BOLSA CAMBEL PEQUEÑA",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 15,
    numero: 15,
    codigo: "BOLI02",
    materialCorporativo: "BOLIGRAFO FABER CASTELL",
    entrada: 56,
    salida: 20,
    stock: 36,
  },
  {
    id: 16,
    numero: 16,
    codigo: "BOLI01",
    materialCorporativo: "BOLIGRAFO PARKER",
    entrada: 0,
    salida: 0,
    stock: 0,
  },
  {
    id: 17,
    numero: 17,
    codigo: "COLO01",
    materialCorporativo: "COLOMBINAS",
    entrada: 300,
    salida: 200,
    stock: 100,
  },
];

// Entradas de material corporativo a la oficina
const entradasMaterial = [
  {
    id: 1,
    numero: 1,
    fecha: "18/02/2025",
    materialCorporativo: "ALCANCIAS  CORAZON",
    cantidad: 57,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 2,
    numero: 2,
    fecha: "18/02/2025",
    materialCorporativo: "BALONES",
    cantidad: 2,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 3,
    numero: 3,
    fecha: "18/02/2025",
    materialCorporativo: "BOLIGRAFO FABER CASTELL",
    cantidad: 36,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 4,
    numero: 4,
    fecha: "18/02/2025",
    materialCorporativo: "CARPETAS CONVENIOS",
    cantidad: 12,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 5,
    numero: 5,
    fecha: "18/02/2025",
    materialCorporativo: "GORRA ADULTO",
    cantidad: 7,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 6,
    numero: 6,
    fecha: "18/02/2025",
    materialCorporativo: "JARRA 1,7",
    cantidad: 20,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 7,
    numero: 7,
    fecha: "18/02/2025",
    materialCorporativo: "MARACAS",
    cantidad: 1,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 8,
    numero: 8,
    fecha: "18/02/2025",
    materialCorporativo: "RECIPIENTE GRANDE",
    cantidad: 2,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 9,
    numero: 9,
    fecha: "18/02/2025",
    materialCorporativo: "RELOJ",
    cantidad: 3,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 10,
    numero: 10,
    fecha: "18/02/2025",
    materialCorporativo: "TROMPO",
    cantidad: 3,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 11,
    numero: 12,
    fecha: "18/02/2025",
    materialCorporativo: "PORTAFOLIO",
    cantidad: 100,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 12,
    numero: 13,
    fecha: "18/02/2025",
    materialCorporativo: "CAJAS EMPRESARIALES",
    cantidad: 6,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 13,
    numero: 14,
    fecha: "18/02/2025",
    materialCorporativo: "STAND COMERCIAL",
    cantidad: 1,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 14,
    numero: 15,
    fecha: "18/02/2025",
    materialCorporativo: "PESTAÑAS TU PAGO AL INSTANTE",
    cantidad: 15,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 15,
    numero: 16,
    fecha: "18/02/2025",
    materialCorporativo: "VOLANTE QR TU PAGO AL INSTANTE",
    cantidad: 50,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 16,
    numero: 17,
    fecha: "18/02/2025",
    materialCorporativo: "VOLANTE NOMINA ,LIBRANZA",
    cantidad: 20,
    quienRecibe: "Lucy Abaned Penagos",
  },
  {
    id: 17,
    numero: 18,
    fecha: "18/02/2025",
    materialCorporativo: "SONBRILLAS",
    cantidad: 2,
    quienRecibe: "Lucy Abaned Penagos",
  },
];

// Salidas de material corporativo a la oficina
const salidasMaterial = [
  {
    id: 1,
    numero: 1,
    fecha: "03/03/2025",
    materialCorporativo: "JARRA 1,7",
    cantidad: 4,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "LUPE",
  },
  {
    id: 2,
    numero: 2,
    fecha: "03/03/2025",
    materialCorporativo: "ALCANCIAS  CORAZON",
    cantidad: 10,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "LUPE",
  },
  {
    id: 3,
    numero: 3,
    fecha: "27/03/2025",
    materialCorporativo: "JARRA 2LT CON TAPA ROJA Y AZUL",
    cantidad: 2,
    quienRecibe: "Lucy Abaned Penagos",
    observaciones: "LUPE (ACT. DOCENTES)",
  },
  {
    id: 4,
    numero: 4,
    fecha: "27/3/2025",
    materialCorporativo: "JARRA 1,7",
    cantidad: 1,
    quienRecibe: "Lucy Abaned Penagos",
    observaciones: "LUPE (ACT. DOCENTES)",
  },
  {
    id: 5,
    numero: 5,
    fecha: "27/03/2025",
    materialCorporativo: "RECIPIENTE PEQUEÑO",
    cantidad: 1,
    quienRecibe: "Lucy Abaned Penagos",
    observaciones: "LUPE (ACT. DOCENTES)",
  },
  {
    id: 6,
    numero: 6,
    fecha: "27/03/2025",
    materialCorporativo: "RECIPIENTE GRANDE",
    cantidad: 2,
    quienRecibe: "Lucy Abaned Penagos",
    observaciones: "LUPE (ACT. DOCENTES)",
  },
  {
    id: 7,
    numero: 7,
    fecha: "27/3/2025",
    materialCorporativo: "CARAMAÑOLA SANTORINI",
    cantidad: 2,
    quienRecibe: "LUPE",
    observaciones: "LUPE (ACT. DOCENTES)",
  },
  {
    id: 8,
    numero: 8,
    fecha: "27/03/2025",
    materialCorporativo: "CALENSARIO MESA",
    cantidad: 4,
    quienRecibe: "LUPR",
    observaciones: "",
  },
  {
    id: 9,
    numero: 9,
    fecha: "04/02/2025",
    materialCorporativo: "ALCANCIAS  CORAZON",
    cantidad: 10,
    quienRecibe: "LUPE",
    observaciones: "ASESORES",
  },
  {
    id: 10,
    numero: 10,
    fecha: "09/04/2025",
    materialCorporativo: "RECIPIENTE PEQUEÑO",
    cantidad: 2,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "LUPE",
  },
  {
    id: 11,
    numero: 11,
    fecha: "25/04/2025",
    materialCorporativo: "ASADORES PEQUEÑOS",
    cantidad: 1,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "ASOCIADO",
  },
  {
    id: 12,
    numero: 12,
    fecha: "25/042025",
    materialCorporativo: "JARRA 1,7",
    cantidad: 1,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "ASOCIADO",
  },
  {
    id: 13,
    numero: 13,
    fecha: "29/04/2025",
    materialCorporativo: "RECIPIENTE PEQUEÑO",
    cantidad: 13,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "ASOCIADO",
  },
  {
    id: 14,
    numero: 14,
    fecha: "30/04/2025",
    materialCorporativo: "JARRA 2LT CON TAPA ROJA Y AZUL",
    cantidad: 2,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "ASOCIADO",
  },
  {
    id: 15,
    numero: 15,
    fecha: "16/05/2025",
    materialCorporativo: "AGENDAS CORPORATIVAS",
    cantidad: 3,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "ASOCIADO",
  },
  {
    id: 16,
    numero: 16,
    fecha: "19/05/2025",
    materialCorporativo: "JARRA 1,7",
    cantidad: 2,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "ASOCIADOS",
  },
  {
    id: 17,
    numero: 17,
    fecha: "19/05/2025",
    materialCorporativo: "BOLIGRAFO FABER CASTELL",
    cantidad: 20,
    quienRecibe: "Diana Alexandra Alarcon Cabrera",
    observaciones: "PARABOLICA",
  },
];

const oficinas = [
  "GARZON",
  "GUADALUPE",
  "EL PITAL",
  "GIGANTE",
  "ACEVEDO",
  "TARQUI",
  "LA PLATA",
  "PITALITO",
  "SUAZA",
  "LA ARGENTINA",
  "NEIVA",
  "RIVERA",
  "HOBO",
  "IQUIRA",
  "SALADOBLANCO",
  "ESPINAL",
  "PLANADAS",
  "CHAPARRAL",
  "FLORENCIA",
];

// Helper function to create deep copy of data
const cloneData = data => JSON.parse(JSON.stringify(data));

// Initialize data structure for each office
const initializeOfficeData = () => {
  const data = {};
  oficinas.forEach(oficina => {
    data[oficina] = {
      inventario: cloneData(inventarioGeneral),
      entradas: cloneData(entradasMaterial),
      salidas: cloneData(salidasMaterial),
    };
  });
  return data;
};

export default function InventarioOficinaTable() {
  const [oficinaSeleccionada, setOficinaSeleccionada] = useState(oficinas[0]);
  const [officeData, setOfficeData] = useState(initializeOfficeData());
  const [editedRows, setEditedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Get current office data
  const inventario = officeData[oficinaSeleccionada]?.inventario || [];
  const entradas = officeData[oficinaSeleccionada]?.entradas || [];
  const salidas = officeData[oficinaSeleccionada]?.salidas || [];

  // Clear edited rows when switching offices
  useEffect(() => {
    setEditedRows({});
  }, [oficinaSeleccionada]);

  const handleChange = (table, id, field, value) => {
    setOfficeData(prev => {
      const newData = { ...prev };
      const currentOffice = { ...newData[oficinaSeleccionada] };

      if (table === "inventario") {
        currentOffice.inventario = currentOffice.inventario.map(row => {
          if (row.id === id) {
            const updated = { ...row, [field]: value };
            // Recalculate stock
            if (field === "entrada" || field === "salida") {
              updated.stock = updated.entrada - updated.salida;
            }
            return updated;
          }
          return row;
        });
      } else if (table === "entradas") {
        currentOffice.entradas = currentOffice.entradas.map(row =>
          row.id === id ? { ...row, [field]: value } : row
        );
      } else if (table === "salidas") {
        currentOffice.salidas = currentOffice.salidas.map(row =>
          row.id === id ? { ...row, [field]: value } : row
        );
      }

      newData[oficinaSeleccionada] = currentOffice;
      return newData;
    });

    setEditedRows(prev => ({
      ...prev,
      [`${oficinaSeleccionada}-${table}-${id}`]: {
        ...prev[`${oficinaSeleccionada}-${table}-${id}`],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    console.log("Saving edits:", editedRows);
    setEditedRows({});
  };

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();

    // Inventario General
    const invWorksheet = XLSX.utils.json_to_sheet(inventario);
    XLSX.utils.book_append_sheet(
      workbook,
      invWorksheet,
      `Inv General ${oficinaSeleccionada}`
    );

    // Entradas
    const entWorksheet = XLSX.utils.json_to_sheet(entradas);
    XLSX.utils.book_append_sheet(
      workbook,
      entWorksheet,
      `Entradas ${oficinaSeleccionada}`
    );

    // Salidas
    const salWorksheet = XLSX.utils.json_to_sheet(salidas);
    XLSX.utils.book_append_sheet(
      workbook,
      salWorksheet,
      `Salidas ${oficinaSeleccionada}`
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `inventario-${oficinaSeleccionada.toLowerCase().replace(/\s+/g, "-")}.xlsx`);
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Inventario de Oficina
      </h1>

      {/* Tabs for offices */}
      <div className="mb-4 border-b border-gray-300">
        <div className="flex flex-wrap gap-2 overflow-x-auto">
          {oficinas.map(oficina => (
            <button
              key={oficina}
              onClick={() => setOficinaSeleccionada(oficina)}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                oficinaSeleccionada === oficina
                  ? "bg-[#780000] text-white border-b-2 border-[#780000]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {oficina}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">
          Oficina: {oficinaSeleccionada}
        </h2>
      </div>

      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar..."
            className="unified-input w-[300px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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

      {/* Three tables side by side */}
      <div className="flex gap-4 overflow-x-auto mb-4" style={{ minWidth: "max-content" }}>
        {/* Inventario General */}
        <div className="flex-shrink-0 overflow-x-auto table-container h-[65vh]" style={{ minWidth: "400px" }}>
          <h2 className="text-xl font-semibold mb-2 text-center">
            Inventario General
          </h2>
          <table className="table-auto border-collapse w-full">
            <thead className="tabla-header">
              <tr>
                <th className="p-2 border text-center whitespace-nowrap">
                  NO.
                </th>
                <th className="p-2 border text-center whitespace-nowrap">
                  CODIGO
                </th>
                <th className="p-2 border text-center whitespace-nowrap min-w-[180px]">
                  MATERIAL CORPORATIVO
                </th>
                <th className="p-2 border text-center whitespace-nowrap">
                  ENTRADA
                </th>
                <th className="p-2 border text-center whitespace-nowrap">
                  SALIDA
                </th>
                <th className="p-2 border text-center whitespace-nowrap">
                  STOCK
                </th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content">
              {inventario.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-center">{r.numero}</td>
                  <td className="p-2 border text-left">{r.codigo}</td>
                  <td className="p-2 border text-left">
                    {r.materialCorporativo}
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      value={r.entrada}
                      onChange={e =>
                        handleChange(
                          "inventario",
                          r.id,
                          "entrada",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full border-none outline-none bg-transparent text-sm text-center"
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      value={r.salida}
                      onChange={e =>
                        handleChange(
                          "inventario",
                          r.id,
                          "salida",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full border-none outline-none bg-transparent text-sm text-center"
                    />
                  </td>
                  <td className="p-2 border text-center font-semibold">
                    {r.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Entradas de material corporativo */}
        <div className="flex-shrink-0 overflow-x-auto table-container h-[65vh]" style={{ minWidth: "450px" }}>
          <h2 className="text-xl font-semibold mb-2 text-center">
            Entradas de material corporativo a la oficina
          </h2>
          <table className="table-auto border-collapse w-full">
            <thead className="tabla-header">
              <tr>
                <th className="p-2 border text-center whitespace-nowrap">
                  NO.
                </th>
                <th className="p-2 border text-center whitespace-nowrap">
                  FECHA
                </th>
                <th className="p-2 border text-center whitespace-nowrap min-w-[180px]">
                  MATERIAL CORPORATIVO
                </th>
                <th className="p-2 border text-center whitespace-nowrap">
                  CANTIDAD
                </th>
                <th className="p-2 border text-center whitespace-nowrap min-w-[200px]">
                  QUIEN RECIBE
                </th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content">
              {entradas.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-center">{r.numero}</td>
                  <td className="p-2 border text-left">{r.fecha}</td>
                  <td className="p-2 border text-left">
                    {r.materialCorporativo}
                  </td>
                  <td className="p-2 border text-center">{r.cantidad}</td>
                  <td className="p-2 border text-left">{r.quienRecibe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Salidas de material corporativo */}
        <div className="flex-shrink-0 overflow-x-auto table-container h-[65vh]" style={{ minWidth: "500px" }}>
          <h2 className="text-xl font-semibold mb-2 text-center">
            Salidas de material corporativo a la oficina
          </h2>
          <table className="table-auto border-collapse w-full">
            <thead className="tabla-header">
              <tr>
                <th className="p-2 border text-center whitespace-nowrap">
                  NO.
                </th>
                <th className="p-2 border text-center whitespace-nowrap">
                  FECHA
                </th>
                <th className="p-2 border text-center whitespace-nowrap min-w-[180px]">
                  MATERIAL CORPORATIVO
                </th>
                <th className="p-2 border text-center whitespace-nowrap">
                  CANTIDAD
                </th>
                <th className="p-2 border text-center whitespace-nowrap min-w-[200px]">
                  QUIEN RECIBE
                </th>
                <th className="p-2 border text-center whitespace-nowrap min-w-[150px]">
                  OBSERVACIONES
                </th>
              </tr>
            </thead>
            <tbody className="tabla-cupos-content">
              {salidas.map(r => (
                <tr key={r.id}>
                  <td className="p-2 border text-center">{r.numero}</td>
                  <td className="p-2 border text-left">{r.fecha}</td>
                  <td className="p-2 border text-left">
                    {r.materialCorporativo}
                  </td>
                  <td className="p-2 border text-center">{r.cantidad}</td>
                  <td className="p-2 border text-left">{r.quienRecibe}</td>
                  <td className="p-2 border text-left">{r.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
