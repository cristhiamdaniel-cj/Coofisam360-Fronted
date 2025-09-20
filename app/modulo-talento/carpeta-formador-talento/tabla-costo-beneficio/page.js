"use client";
import { useEffect, useState } from "react";
//import { getFinancialRecords } from "@/services/financial";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import {
  listCostoBeneficioQuota,
  saveCostoBeneficioQuota,
} from "../../../services/modulo-talento/carpeta-formador-talento/costoBeneficioQuota";
import { toMonthNumber } from "@/app/services/modulo-talento/carpeta-formador-talento/talentHelpers";

export default function GestionesTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await listCostoBeneficioQuota({ limit: 200 });
        setRows(data);
        //setFilteredRows(data);
        setError("");
      } catch (e) {
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (id, field, value) => {
    setRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
    setFilteredRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(
        r =>
          r.Mes?.toUpperCase().includes(query) ||
          r.Modalidad?.toLowerCase().includes(query)
      );
      setFilteredRows(filtered);
    }
  }, [search, rows]);

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

        if (!fullRow) return;

        const payload = {
          id: fullRow.id,
          anio: Number(fullRow.Año),
          mes: toMonthNumber(fullRow.Mes),
          total_gastos:
            Number(
              changes.TotalGastosTransferencia ??
                fullRow.TotalGastosTransferencia
            ) || 0,
          trabajadores_capacitados:
            Number(
              changes.TrabajadoresCapacitados ?? fullRow.TrabajadoresCapacitados
            ) || 0,
          costo_por_trabajador: Number(fullRow.CostoPorTrabajador) || 0,
          modalidad: changes.Modalidad ?? fullRow.Modalidad ?? "",
          rentabilidad: changes.Rentabilidad ?? fullRow.Rentabilidad ?? "",
        };

        console.log(">>> Payload enviado al backend:", payload);

        await saveCostoBeneficioQuota(payload);
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

  const handleAddRow = () => {
    const newRow = {
      id: crypto.randomUUID(), // genera un id único
      Año: new Date().getFullYear(),
      Mes: new Date().getMonth(), // o podrías poner el mes actual
      TotalGastosTransferencia: 0,
      TrabajadoresCapacitados: 0,
      CostoPorTrabajador: 0,
      Modalidad: "",
      Rentabilidad: "",
      isNew: true,
    };

    setRows(prev => [newRow, ...prev]);
    setFilteredRows(prev => [newRow, ...prev]);

    // opcional: marcarla como editada inmediatamente
    setEditedRows(prev => ({
      ...prev,
      [newRow.id]: newRow,
    }));
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Costo/Beneficio
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
          <button
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
            onClick={handleAddRow}
          >
            Añadir fila
            <FaArrowDownWideShort />
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="tabla-header">
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap">Mes</th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total gastos en la transferencia de los conocimientos
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad Trabajadores Capacitados
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Costo x Trabajador Formado
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Modalidad
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Rentabilidad
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {rows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.Año}
                      onChange={e => handleChange(r.id, "Año", e.target.value)}
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.Año
                  )}
                </td>

                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <select
                      value={r.Mes}
                      onChange={e => handleChange(r.id, "Mes", e.target.value)}
                      className="border rounded p-1 w-full"
                    >
                      {[
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
                      ].map(m => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.Mes
                  )}
                </td>

                <td className="p-1 border text-left whitespace-nowrap w-full">
                  $
                  <input
                    type="number"
                    value={r.TotalGastosTransferencia}
                    onChange={e => {
                      handleChange(
                        r.id,
                        "TotalGastosTransferencia",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.TrabajadoresCapacitados}
                    onChange={e => {
                      handleChange(
                        r.id,
                        "TrabajadoresCapacitados",
                        e.target.value
                      );
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.CostoPorTrabajador}
                      onChange={e =>
                        handleChange(r.id, "CostoPorTrabajador", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.CostoPorTrabajador
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Modalidad}
                    onChange={e => {
                      handleChange(r.id, "Modalidad", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["Virtual", "Presencial"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Rentabilidad}
                    onChange={e => {
                      handleChange(r.id, "Rentabilidad", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {["Baja", "Alta"].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
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
