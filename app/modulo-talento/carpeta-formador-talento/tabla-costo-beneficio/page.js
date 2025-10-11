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
  updateCostoBeneficioQuota,
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
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [editingRows, setEditingRows] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const data = await listCostoBeneficioQuota({ limit: 200 });
        console.log(data);
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

    const filtered = rows
      .filter(r => {
        const matchesSearch =
          !query || r.Modalidad.toLowerCase().includes(query);

        const matchesYear = !selectedYear || r.Año === Number(selectedYear);

        // Ahora comparamos el mes como string en mayúscula
        const matchesMonth =
          !selectedMonth || r.Mes.toUpperCase() === selectedMonth.toUpperCase();

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => Number(a.codigo) - Number(b.codigo));

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  // Obtener años únicos
  const uniqueYears = [...new Set(rows.map(r => r.Año).filter(Boolean))];

  // Obtener meses únicos en mayúscula
  const uniqueMonths = [
    ...new Set(rows.map(r => r.Mes && r.Mes.toUpperCase()).filter(Boolean)),
  ];

  // Mantener el orden original de los meses
  const monthNames = [
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

  const availableMonths = monthNames.filter(m => uniqueMonths.includes(m));

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
          // PK requerida por el backend para PUT
          id: Number(fullRow.id) || undefined,
          anio: Number(fullRow.Año),
          mes: toMonthNumber(fullRow.Mes),
          // Para ubicar exactamente el registro en PUT, usar valor original de PK si existe
          modalidad: String(
            fullRow.ModalidadPk ?? changes.Modalidad ?? fullRow.Modalidad ?? ""
          ),
          grupo: Number(fullRow.Grupo) || 1,
          total_gastos:
            Number(
              changes.TotalGastosTransferencia ??
                fullRow.TotalGastosTransferencia
            ) || 0,
          trabajadores_cap:
            Number(
              changes.TrabajadoresCapacitados ?? fullRow.TrabajadoresCapacitados
            ) || 0,
          rentabilidad: String(
            changes.Rentabilidad ?? fullRow.Rentabilidad ?? ""
          ),
        };

        console.log(">>> Payload enviado al backend:", payload);

        // Validación mínima requerida
        if (!payload.anio || !payload.mes || !payload.modalidad) {
          throw new Error(
            "Faltan campos obligatorios: Año, Mes y Modalidad"
          );
        }

        // Validación de límites numéricos (numeric(14,2) < 1e12)
        const MAX_NUM = 1_000_000_000_000 - 0.01; // 10^12 - 0.01
        if (
          Math.abs(payload.total_gastos) >= 1_000_000_000_000 ||
          Math.abs(
            payload.trabajadores_cap
              ? Number((payload.total_gastos / payload.trabajadores_cap).toFixed(2))
              : 0
          ) >= 1_000_000_000_000
        ) {
          throw new Error(
            "Valores demasiado grandes: verifique Total Gastos o Costo por Trabajador (< 10^12)"
          );
        }
        // costo_por_trabajador es calculado siempre en backend; enviamos el valor esperado para consistencia
        payload.costo_por_trabajador = payload.trabajadores_cap > 0
          ? Number((payload.total_gastos / payload.trabajadores_cap).toFixed(2))
          : 0;

        if (fullRow.isNew) {
          // Con PK por id ya no restringimos por (periodo, modalidad, grupo)
          await saveCostoBeneficioQuota(payload);
        } else {
          await updateCostoBeneficioQuota(payload);
        }
      });

      await Promise.all(updates);

      alert("Cambios guardados correctamente ✅");
      setEditedRows({});
      // Recargar la lista desde el backend para reflejar persistencia
      const data = await listCostoBeneficioQuota({ limit: 200 });
      setRows(Array.isArray(data) ? data : data?.items || []);
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
      Mes: "", // elige explícitamente el mes
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
        Costo/Beneficio samir
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por modalidad"
            className="unified-input w-[300px]"
          />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="unified-select"
          >
            <option value="">Todos los años</option>
            {uniqueYears.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="unified-select"
          >
            <option value="">Todos los meses</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>
                {m}
                {/* Opcional: mostrar capitalizado */}
              </option>
            ))}
          </select>
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
          <button
            className="unified-button flex gap-2 items-center justify-center"
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
              <th className="p-4 border text-center whitespace-nowrap">Acciones</th>
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
            {filteredRows.map(r => {
              const isEditing = r.isNew || !!editingRows[r.id];
              return (
              <tr key={r.id}>
                <td className="p-2 border text-center whitespace-nowrap">
                  <button
                    onClick={() => setEditingRows(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                    className="px-3 py-1 border rounded cursor-pointer"
                  >
                    {isEditing ? "Terminar" : "Editar"}
                  </button>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
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
                  {isEditing ? (
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
                  {isEditing ? (
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
                  ) : (
                    r.TotalGastosTransferencia
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
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
                  ) : (
                    r.TrabajadoresCapacitados
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.TrabajadoresCapacitados > 0
                    ? Number((Number(r.TotalGastosTransferencia || 0) / Number(r.TrabajadoresCapacitados)).toFixed(2))
                    : 0}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.Modalidad}
                    onChange={e => {
                      handleChange(r.id, "Modalidad", e.target.value.toUpperCase());
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[{v:"VIRTUAL",l:"Virtual"},{v:"PRESENCIAL",l:"Presencial"}].map(opt => (
                      <option key={opt.v} value={opt.v}>
                        {opt.l}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select disabled={!isEditing}
                    value={r.Rentabilidad}
                    onChange={e => {
                      handleChange(r.id, "Rentabilidad", e.target.value.toUpperCase());
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[{v:"BAJA",l:"Baja"},{v:"ALTA",l:"Alta"}].map(opt => (
                      <option key={opt.v} value={opt.v}>
                        {opt.l}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
