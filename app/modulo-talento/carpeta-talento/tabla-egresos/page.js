"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import {
  listEgresoRows,
  saveEgresoRow,
} from "../../../services/modulo-talento/carpeta-talento/egresoQuota";

const initialRows = [
  {
    id: 1,
    AÑO: 2024,
    MES: "NOVIEMBRE",
    OFICINA: "CHAPARRRAL",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 2,
    AÑO: 2024,
    MES: "NOVIEMBRE",
    OFICINA: "FLORENCIA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 3,
    AÑO: 2024,
    MES: "NOVIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "AUXILIAR CONTABILIDAD",
    CANTIDAD: 1,
    MOTIVO: "RENUNCIA VOLUNTARIA",
  },
  {
    id: 4,
    AÑO: 2024,
    MES: "NOVIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "APRENDIZ ETAPA PRODUCTIVA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 5,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "GARZON",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 6,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "GUADALUPE",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 7,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "EL PITAL",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 8,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "GIGANTE",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 9,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "ACEVEDO",
    CARGO: "SUPERNUMERIO DE OFICINA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 10,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "TARQUI",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 11,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "LA PLATA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 12,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "PITALITO",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 13,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "SUAZA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 14,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "LA ARGENTINA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 15,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "NEIVA",
    CARGO: "SUPERNUMERIO DE OFICINA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 16,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "RIVERA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 17,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "HOBO",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 18,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "IQUIRA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 19,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "SALADOBLANCO",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 20,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "ESPINAL",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 21,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "PLANADAS",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 22,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "CHAPARRRAL",
    CARGO: "DIRECTOR OFICINA",
    CANTIDAD: 1,
    MOTIVO: "RENUNCIA VOLUNTARIA",
  },
  {
    id: 23,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "CHAPARRRAL",
    CARGO: "ASESOR COMERCIAL CORRESPONSAL SOLIDARIO",
    CANTIDAD: 1,
    MOTIVO: "RENUNCIA VOLUNTARIA",
  },
  {
    id: 24,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "FLORENCIA",
    CARGO: "",
    CANTIDAD: "",
    MOTIVO: "",
  },
  {
    id: 25,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "AUXILIAR JURIDICO",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 26,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "APRENDIZ ETAPA PRODUCTIVA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 27,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "GESTOR COMERCIAL",
    CANTIDAD: 1,
    MOTIVO: "RENUNCIA VOLUNTARIA",
  },
  {
    id: 28,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "AUXILIAR SEGURIDAD Y SALUD EN EL TRABAJO",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO SIN JUSTA CAUSA",
  },
  {
    id: 29,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "AUXILIAR AUDITORIA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
  {
    id: 30,
    AÑO: 2024,
    MES: "DICIEMBRE",
    OFICINA: "DIRECCION GENERAL",
    CARGO: "SUPERNUMERIO DE OFICINA",
    CANTIDAD: 1,
    MOTIVO: "TERMINACION DE CONTRATO",
  },
];

const oficinas = [
  "GARZON",
  "GUADALUPE",
  "PITAL",
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
  "DIRECCION GENERAL",
];

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    async function load() {
      try {
        const data = await listEgresoRows({ limit: 500 });
        console.log(data);
        setRows(data);
        setError("");
      } catch (e) {
        setError(e.message || "Error cargando datos");
        // Si hay error, usar datos iniciales como fallback
        setRows(initialRows);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log(">>> editedRows:", editedRows);

      const updates = Object.entries(editedRows).map(async ([id, changes]) => {
        console.log(">>> Iterando row:", id, changes);

        const fullRow = rows.find(r => String(r.id) === String(id));
        if (!fullRow) {
          console.warn("⚠️ No se encontró la fila con id:", id);
          return;
        }

        const payload = {
          id: fullRow.id,
          anio: Number(fullRow.AÑO),
          mes: fullRow.MES,
          oficina: changes.OFICINA ?? fullRow.OFICINA ?? "",
          cargo: changes.CARGO ?? fullRow.CARGO ?? "",
          cantidad: Number(changes.CANTIDAD ?? fullRow.CANTIDAD) || 0,
          motivo: changes.MOTIVO ?? fullRow.MOTIVO ?? "",
        };

        console.log(">>> Payload enviado al backend:", payload);

        await saveEgresoRow(payload);
      });

      await Promise.all(updates);

      alert("Cambios guardados correctamente ✅");
      setEditedRows({});
    } catch (err) {
      console.error("Error guardando cambios:", err);
      alert("Error guardando cambios ❌");
    } finally {
      setSaving(false);
    }
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
        Egresos
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <div className="search-bar flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por codigo u oficina"
              className="border w-[300px] px-2 py-1"
            />
          </div>
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
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleDownload}
          >
            Descargar
            <FiDownload />
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th className="p-4 border text-center">Año</th>
              <th className="p-4 border text-center">Mes</th>
              <th className="p-4 border text-center">Oficina</th>
              <th className="p-4 border text-center">Cargo</th>
              <th className="p-4 border text-center">Cantidad</th>
              <th className="p-4 border text-center">Motivo</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content">
            {rows.map(row => (
              <tr key={row.id}>
                <td className="p-2 border text-center">{row.AÑO}</td>
                <td className="p-2 border text-center">{row.MES}</td>
                <td className="p-2 border text-center">
                  <select
                    value={row.OFICINA}
                    onChange={e => {
                      handleChange(row.id, "OFICINA", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {oficinas.map(loc => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-2 border text-center">{row.CARGO}</td>

                <td className="p-2 border text-center">{row.CANTIDAD}</td>

                <td className="p-2 border text-center">
                  <select
                    value={row.MOTIVO}
                    onChange={e => {
                      handleChange(row.id, "MOTIVO", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "RENUNCIA VOLUNTARIA",
                      "TERMINACION DE CONTRATO",
                      "TERMINACION DE CONTRATO EN PERIODO DE PRUEBA",
                      "TERMINACION DE CONTRATO SIN JUSTA CAUSA",
                      "TERMINACION DE CONTRATO CON JUSTA CAUSA",
                      "VENCIMIENTO DE CONTRATO DE APRENDIZAJE",
                      "VENCIMIENTO DE CONTRATO",
                    ].map(tipo => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
