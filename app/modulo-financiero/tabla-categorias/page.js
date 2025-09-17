"use client";
import { useEffect, useState } from "react";
import {
  listCategoriesQuota,
  saveCategoryQuota,
} from "../../services/modulo-financiero/categoriesQuota";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegSave, FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function CategoriasTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();

  async function loadData() {
    setLoading(true);
    try {
      const data = await listCategoriesQuota({ limit: 900 });

      // Sort by codigo numerically
      const sorted = [...data].sort(
        (a, b) => Number(a.codigo) - Number(b.codigo)
      );

      setRows(sorted);
      setFilteredRows(sorted);
      setError("");
    } catch (e) {
      setError(e.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Live search (reactive as you type)
  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows
      .filter(r => {
        const matchesSearch =
          !query ||
          r.indicador.toLowerCase().includes(query) ||
          r.alcance.toLowerCase().includes(query);

        const matchesYear = !selectedYear || r.anio === Number(selectedYear);
        const matchesMonth = !selectedMonth || r.mes === Number(selectedMonth);

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => Number(a.codigo) - Number(b.codigo));

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedRows).map(async ([id, changes]) => {
        // id es string; no lo conviertas a número
        const fullRow = rows.find(r => String(r.id) === String(id));
        if (!fullRow) return; // nada que guardar

        const payload = {
          codigo: fullRow.codigo,
          anio: Number(fullRow.anio),
          mes: Number(fullRow.mes),
          nombre: (changes.nombre ?? fullRow.nombre) || undefined,
          // No enviar fecha si no se edita explícitamente en formato ISO (YYYY-MM-DD)
          // fecha: (changes.fecha ?? fullRow.fecha) || undefined,
          asociados: Number(changes.asociados ?? fullRow.asociados),
          entidades: Number(changes.entidades ?? fullRow.entidades),
          poblacion: Number(changes.poblacion ?? fullRow.poblacion),
        };

        await saveCategoryQuota(payload);
      });

      await Promise.all(updates);
      alert("Cambios guardados correctamente");
      setEditedRows({});
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categoria de Oficinas");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Categoria_Oficinas.xlsx");
  };

  const uniqueYears = [...new Set(rows.map(r => r.anio).filter(Boolean))];
  const uniqueMonths = [...new Set(rows.map(r => r.mes).filter(Boolean))];

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const availableMonths = monthNames
    .map((name, index) => ({ name, number: index + 1 }))
    .filter(m => uniqueMonths.includes(m.number));

  return (
    <main className="pt-12 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-12">
        Categorias Oficinas
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por codigo u oficina"
            className="border w-[300px] px-2 py-1"
          />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="border px-2 py-1"
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
            className="border px-2 py-1"
          >
            <option value="">Todos los meses</option>
            {availableMonths.map(m => (
              <option key={m.number} value={m.number}>
                {m.name}
              </option>
            ))}
          </select>
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
            <FaFileDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-cupos-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap ">
                Codigo Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Nombre Oficina
              </th>

              <th className="p-4 border text-center whitespace-nowrap ">
                Cta PUC 14
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Cta PUC 21
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Asociados
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Fecha de Apertura
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Entidades Financieras
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[220px]">
                Población
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(row => (
              <tr key={row.id}>
                <td>{row.codigo}</td>
                <td>{row.nombre}</td>
                <td>${row.ctaPuc14}</td>
                <td>${row.ctaPuc21}</td>
                <td>{row.asociados}</td>
                <td>{row.fecha}</td>
                <td>
                  <input
                    type="number"
                    value={row.entidades}
                    onChange={e =>
                      handleChange(row.id, "entidades", e.target.value)
                    }
                    className="px-2 py-1 w-full text-right border"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.poblacion}
                    onChange={e =>
                      handleChange(row.id, "poblacion", e.target.value)
                    }
                    className="px-2 py-1 w-full text-right border"
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
