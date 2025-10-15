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
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 1,
    oficina: "GARZON",
    llamadasAsignadas: 1487,
    obligacionesAlDiaLlamadas: 378,
    llamadasAsignadasAlDia: 1109,
    gestionesEfectuadasLlamadas: 1393,
    cumplimientoLlamadas: "126%",
    visitasAsignadas: 55,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 55,
    gestionesEfectuadasVisitas: 203,
    cumplimientoVisitas: "369%",
  },
  {
    id: 2,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 2,
    oficina: "GUADALUPE",
    llamadasAsignadas: 525,
    obligacionesAlDiaLlamadas: 174,
    llamadasAsignadasAlDia: 351,
    gestionesEfectuadasLlamadas: 390,
    cumplimientoLlamadas: "111%",
    visitasAsignadas: 17,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 17,
    gestionesEfectuadasVisitas: 12,
    cumplimientoVisitas: "71%",
  },
  {
    id: 3,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 3,
    oficina: "PITAL",
    llamadasAsignadas: 484,
    obligacionesAlDiaLlamadas: 150,
    llamadasAsignadasAlDia: 334,
    gestionesEfectuadasLlamadas: 298,
    cumplimientoLlamadas: "89%",
    visitasAsignadas: 12,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 12,
    gestionesEfectuadasVisitas: 27,
    cumplimientoVisitas: "225%",
  },
  {
    id: 4,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 4,
    oficina: "GIGANTE",
    llamadasAsignadas: 551,
    obligacionesAlDiaLlamadas: 170,
    llamadasAsignadasAlDia: 381,
    gestionesEfectuadasLlamadas: 433,
    cumplimientoLlamadas: "114%",
    visitasAsignadas: 16,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 16,
    gestionesEfectuadasVisitas: 50,
    cumplimientoVisitas: "313%",
  },
  {
    id: 5,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 5,
    oficina: "ACEVEDO",
    llamadasAsignadas: 419,
    obligacionesAlDiaLlamadas: 103,
    llamadasAsignadasAlDia: 316,
    gestionesEfectuadasLlamadas: 354,
    cumplimientoLlamadas: "112%",
    visitasAsignadas: 11,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 11,
    gestionesEfectuadasVisitas: 17,
    cumplimientoVisitas: "155%",
  },
  {
    id: 6,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 6,
    oficina: "TARQUI",
    llamadasAsignadas: 323,
    obligacionesAlDiaLlamadas: 134,
    llamadasAsignadasAlDia: 189,
    gestionesEfectuadasLlamadas: 176,
    cumplimientoLlamadas: "93%",
    visitasAsignadas: 7,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 7,
    gestionesEfectuadasVisitas: 25,
    cumplimientoVisitas: "357%",
  },
  {
    id: 7,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 7,
    oficina: "LA PLATA",
    llamadasAsignadas: 477,
    obligacionesAlDiaLlamadas: 178,
    llamadasAsignadasAlDia: 299,
    gestionesEfectuadasLlamadas: 294,
    cumplimientoLlamadas: "98%",
    visitasAsignadas: 16,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 16,
    gestionesEfectuadasVisitas: 33,
    cumplimientoVisitas: "206%",
  },
  {
    id: 8,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 8,
    oficina: "PITALITO",
    llamadasAsignadas: 781,
    obligacionesAlDiaLlamadas: 250,
    llamadasAsignadasAlDia: 531,
    gestionesEfectuadasLlamadas: 534,
    cumplimientoLlamadas: "101%",
    visitasAsignadas: 34,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 34,
    gestionesEfectuadasVisitas: 40,
    cumplimientoVisitas: "118%",
  },
  {
    id: 9,
    mes: "JUNIO",
    año: 2025,
    codigoOficina: 9,
    oficina: "SUAZA",
    llamadasAsignadas: 317,
    obligacionesAlDiaLlamadas: 113,
    llamadasAsignadasAlDia: 204,
    gestionesEfectuadasLlamadas: 192,
    cumplimientoLlamadas: "94%",
    visitasAsignadas: 9,
    obligacionesAlDiaVisitas: 0,
    visitasAsignadasAlDia: 9,
    gestionesEfectuadasVisitas: 7,
    cumplimientoVisitas: "78%",
  },
];

export default function AsignacionLlamadasTable() {
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
        r.mes?.toLowerCase().includes(query) ||
        r.oficina?.toLowerCase().includes(query) ||
        r.llamadasAsignadas?.toString().includes(query) ||
        r.obligacionesAlDiaLlamadas?.toString().includes(query) ||
        r.gestionesEfectuadasLlamadas?.toString().includes(query) ||
        r.visitasAsignadas?.toString().includes(query) ||
        r.obligacionesAlDiaVisitas?.toString().includes(query) ||
        r.gestionesEfectuadasVisitas?.toString().includes(query);
      
      return matchesSearch;
    });
    setFilteredRows(filtered);
  }, [search, rows]);

  // Opciones para los dropdowns de oficinas
  const oficinaOptions = [
    { codigo: 1, nombre: "GARZON" },
    { codigo: 2, nombre: "GUADALUPE" },
    { codigo: 3, nombre: "PITAL" },
    { codigo: 4, nombre: "GIGANTE" },
    { codigo: 5, nombre: "ACEVEDO" },
    { codigo: 6, nombre: "TARQUI" },
    { codigo: 7, nombre: "LA PLATA" },
    { codigo: 8, nombre: "PITALITO" },
    { codigo: 9, nombre: "SUAZA" },
    { codigo: 10, nombre: "LA ARGENTINA" },
    { codigo: 11, nombre: "NEIVA" },
    { codigo: 12, nombre: "RIVERA" },
    { codigo: 13, nombre: "HOBO" },
    { codigo: 14, nombre: "IQUIRA" },
    { codigo: 15, nombre: "SALADOBLANCO" },
    { codigo: 16, nombre: "ESPINAL" },
    { codigo: 17, nombre: "PLANADAS" },
    { codigo: 18, nombre: "CHAPARRAL" },
    { codigo: 19, nombre: "FLORENCIA" },
  ];

  // Opciones para los meses del año
  const mesOptions = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];

  // Opciones para los años (hasta 2035)
  const añoOptions = [];
  for (let año = 2020; año <= 2035; año++) {
    añoOptions.push(año);
  }

  // Función para calcular llamadas asignadas al día
  const calcularLlamadasAsignadasAlDia = (
    llamadasAsignadas,
    obligacionesAlDia
  ) => {
    return llamadasAsignadas - obligacionesAlDia;
  };

  // Función para calcular visitas asignadas al día
  const calcularVisitasAsignadasAlDia = (
    visitasAsignadas,
    obligacionesAlDia
  ) => {
    return visitasAsignadas - obligacionesAlDia;
  };

  // Función para calcular % cumplimiento llamadas
  const calcularCumplimientoLlamadas = (
    llamadasAsignadasAlDia,
    gestionesEfectuadas
  ) => {
    if (llamadasAsignadasAlDia === 0) return "0%";
    const porcentaje = Math.round(
      (gestionesEfectuadas / llamadasAsignadasAlDia) * 100
    );
    return `${porcentaje}%`;
  };

  // Función para calcular % cumplimiento visitas
  const calcularCumplimientoVisitas = (
    visitasAsignadasAlDia,
    gestionesEfectuadas
  ) => {
    if (visitasAsignadasAlDia === 0) return "0%";
    const porcentaje = Math.round(
      (gestionesEfectuadas / visitasAsignadasAlDia) * 100
    );
    return `${porcentaje}%`;
  };

  const handleChange = (id, field, value) => {
    setRows(prev => {
      const updatedRows = prev.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          
          // Si se cambia la oficina, actualizar también el código
          if (field === "oficina") {
            const oficina = oficinaOptions.find(o => o.nombre === value);
            if (oficina) {
              updatedRow.codigoOficina = oficina.codigo;
            }
          }
          
          // Si se cambia el código de oficina, actualizar también la oficina
          if (field === "codigoOficina") {
            const oficina = oficinaOptions.find(
              o => o.codigo === parseInt(value)
            );
            if (oficina) {
              updatedRow.oficina = oficina.nombre;
            }
          }
          
          // Recalcular llamadas asignadas al día
          const llamadasAsignadasAlDia = calcularLlamadasAsignadasAlDia(
            updatedRow.llamadasAsignadas || 0,
            updatedRow.obligacionesAlDiaLlamadas || 0
          );
          updatedRow.llamadasAsignadasAlDia = llamadasAsignadasAlDia;
          
          // Recalcular % cumplimiento llamadas
          const cumplimientoLlamadas = calcularCumplimientoLlamadas(
            llamadasAsignadasAlDia,
            updatedRow.gestionesEfectuadasLlamadas || 0
          );
          updatedRow.cumplimientoLlamadas = cumplimientoLlamadas;
          
          // Recalcular visitas asignadas al día
          const visitasAsignadasAlDia = calcularVisitasAsignadasAlDia(
            updatedRow.visitasAsignadas || 0,
            updatedRow.obligacionesAlDiaVisitas || 0
          );
          updatedRow.visitasAsignadasAlDia = visitasAsignadasAlDia;
          
          // Recalcular % cumplimiento visitas
          const cumplimientoVisitas = calcularCumplimientoVisitas(
            visitasAsignadasAlDia,
            updatedRow.gestionesEfectuadasVisitas || 0
          );
          updatedRow.cumplimientoVisitas = cumplimientoVisitas;
          
          return updatedRow;
        }
        return row;
      });
      return updatedRows;
    });

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
        Gestión de llamadas
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por oficina, mes, números..."
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[180px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Código Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Llamadas Asignadas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Obligaciones al Día Llamadas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Llamadas Asignadas - Al Día
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestiones Efectuadas (Llamadas)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Cumplimiento Llamadas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Visitas Asignadas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Obligaciones al Día Visitas
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Visitas Asignadas - Al Día
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Gestiones Efectuadas (Visitas)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Cumplimiento Visitas
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">
                  <select
                    value={r.mes || ""}
                    onChange={e => handleChange(r.id, "mes", e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar mes</option>
                    {mesOptions.map(mes => (
                      <option key={mes} value={mes}>
                        {mes}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.anio || ""}
                    onChange={e =>
                      handleChange(r.id, "anio", parseInt(e.target.value))
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar año</option>
                    {añoOptions.map(año => (
                      <option key={año} value={año}>
                        {año}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.codigoOficina || ""}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "codigoOficina",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar código</option>
                    {oficinaOptions.map(oficina => (
                      <option key={oficina.codigo} value={oficina.codigo}>
                        {oficina.codigo}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <select
                    value={r.oficina || ""}
                    onChange={e =>
                      handleChange(r.id, "oficina", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Seleccionar oficina</option>
                    {oficinaOptions.map(oficina => (
                      <option key={oficina.codigo} value={oficina.nombre}>
                        {oficina.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.llamadasAsignadas || ""}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "llamadasAsignadas",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.obligacionesAlDiaLlamadas || ""}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "obligacionesAlDiaLlamadas",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center bg-gray-100">
                  {r.llamadasAsignadasAlDia}
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.gestionesEfectuadasLlamadas || ""}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "gestionesEfectuadasLlamadas",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center bg-gray-100">
                  {r.cumplimientoLlamadas}
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.visitasAsignadas || ""}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "visitasAsignadas",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.obligacionesAlDiaVisitas || ""}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "obligacionesAlDiaVisitas",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center bg-gray-100">
                  {r.visitasAsignadasAlDia}
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.gestionesEfectuadasVisitas || ""}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "gestionesEfectuadasVisitas",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-2 border text-center bg-gray-100">
                  {r.cumplimientoVisitas}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
