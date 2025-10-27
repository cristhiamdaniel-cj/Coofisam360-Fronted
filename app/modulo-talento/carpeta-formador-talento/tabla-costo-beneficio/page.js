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
  deleteCostoBeneficioQuota,
} from "../../../services/modulo-talento/carpeta-formador-talento/costoBeneficioQuota";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toMonthNumber, fmtMoneyCOP, moneyToNumber } from "@/app/services/modulo-talento/carpeta-formador-talento/talentHelpers";

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
    // Usar filteredRows para respetar los filtros aplicados
    const dataToExport = filteredRows.length > 0 ? filteredRows : rows;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Costo Beneficio");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    
    // Nombre del archivo basado en si hay filtros aplicados
    const fileName = filteredRows.length > 0 && filteredRows.length < rows.length 
      ? `costo-beneficio-filtrado-${filteredRows.length}-registros.xlsx`
      : "costo-beneficio-completo.xlsx";
    
    saveAs(data, fileName);
  };

  const handleSaveSingle = async (rowId) => {
    try {
      const finalRow = rows.find(r => String(r.id) === String(rowId));
      if (!finalRow) {
        console.warn("⚠️ No se encontró la fila con id:", rowId);
        return;
      }
      const payload = {
        id: Number(finalRow.id) || undefined,
        anio: Number(finalRow.Año),
        mes: toMonthNumber(finalRow.Mes),
        modalidad: String(finalRow.Modalidad ?? ""),
        grupo: Number(finalRow.Grupo) || 1,
        total_gastos: Number(finalRow.TotalGastosTransferencia) || 0,
        trabajadores_cap: Number(finalRow.TrabajadoresCapacitados) || 0,
        rentabilidad: String(finalRow.Rentabilidad ?? ""),
      };

      console.log(">>> DEBUG handleSaveSingle:");
      console.log(">>> finalRow:", finalRow);
      console.log(">>> payload:", payload);

      // Validación mínima requerida
      if (!payload.anio || !payload.mes || !payload.modalidad) {
        console.error(">>> Campos faltantes:", {
          anio: payload.anio,
          mes: payload.mes,
          modalidad: payload.modalidad
        });
        throw new Error("Faltan campos obligatorios: Año, Mes y Modalidad");
      }

      if (finalRow.isNew) {
        await saveCostoBeneficioQuota(payload);
        alert("✅ Nueva fila creada correctamente");
      } else {
        await updateCostoBeneficioQuota(payload);
        alert("✅ Registro modificado correctamente");
      }

      // Cerrar modo edición
      setEditingRows(prev => ({ ...prev, [finalRow.id]: false }));
      setEditedRows(prev => {
        const newEdited = { ...prev };
        delete newEdited[finalRow.id];
        return newEdited;
      });

      // Recargar datos
      const data = await listCostoBeneficioQuota({ limit: 200 });
      setRows(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      console.error("Error guardando registro:", err);
      alert(`Error al guardar el registro: ${err.message}`);
    }
  };

  const handleDelete = async (rowId) => {
    const row = rows.find(r => String(r.id) === String(rowId));
    if (!row) {
      console.warn("⚠️ No se encontró la fila con id:", rowId);
      return;
    }
    if (!row.id || row.isNew) {
      // Si es una fila nueva, solo la removemos del estado
      setRows(prev => prev.filter(r => String(r.id) !== String(rowId)));
      setFilteredRows(prev => prev.filter(r => String(r.id) !== String(rowId)));
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar este registro?`)) {
      try {
        await deleteCostoBeneficioQuota(row.id);
        
        // Remover de los estados
        setRows(prev => prev.filter(r => String(r.id) !== String(rowId)));
        setFilteredRows(prev => prev.filter(r => String(r.id) !== String(rowId)));
        
        alert("Registro eliminado correctamente ✅");
      } catch (err) {
        console.error("Error eliminando registro:", err);
        alert(`Error al eliminar el registro: ${err.message}`);
      }
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: crypto.randomUUID(), // genera un id único
      Año: new Date().getFullYear(),
      Mes: "ENERO", // valor por defecto
      TotalGastosTransferencia: 0,
      TrabajadoresCapacitados: 0,
      CostoPorTrabajador: 0,
      Modalidad: "PRESENCIAL", // valor por defecto
      Rentabilidad: "BAJA", // valor por defecto
      Grupo: 1, // valor por defecto
      isNew: true,
    };

    setRows(prev => [newRow, ...prev]);
    setFilteredRows(prev => [newRow, ...prev]);

    // Marcar la nueva fila como editada y en modo de edición
    setEditedRows(prev => ({
      ...prev,
      [newRow.id]: newRow,
    }));
    
    // Abrir automáticamente en modo de edición
    setEditingRows(prev => ({
      ...prev,
      [newRow.id]: true,
    }));
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Costo/Beneficio
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
                  {isEditing ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleSaveSingle(r.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                        title="Guardar cambios"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => setEditingRows(prev => ({ ...prev, [r.id]: false }))}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                        title="Cancelar edición"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setEditingRows(prev => ({ ...prev, [r.id]: true }))}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        title="Editar registro"
                      >
                        <FaEdit />
                      </button>
                      {!r.isNew && (
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Eliminar registro"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  )}
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
                  {isEditing ? (
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">$</span>
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
                        className="px-2 py-1 w-full text-left border"
                        placeholder="0"
                      />
                    </div>
                  ) : (
                    fmtMoneyCOP(r.TotalGastosTransferencia)
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
                    ? fmtMoneyCOP(Number((Number(r.TotalGastosTransferencia || 0) / Number(r.TrabajadoresCapacitados)).toFixed(2)))
                    : fmtMoneyCOP(0)}
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
