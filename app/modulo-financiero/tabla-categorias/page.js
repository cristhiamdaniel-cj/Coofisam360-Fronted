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

export default function CuposTable() {
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
        const data = await listCategoriesQuota({ limit: 200 });
        setRows(data);
        setFilteredRows(data);
        setError("");
      } catch (e) {
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearch = () => {
    const query = search.toLowerCase();
    if (!query) {
      setFilteredRows(rows); // reset if search is empty
      return;
    }
    const filtered = rows.filter(
      r =>
        r.nombre?.toLowerCase().includes(query) ||
        r.codigo?.toLowerCase().includes(query)
    );
    setFilteredRows(filtered);
  };

  const handleChange = (id, field, value) => {
    const updateRow = row => (row.id === id ? { ...row, [field]: value } : row);

    setRows(prev => prev.map(updateRow));
    setFilteredRows(prev => prev.map(updateRow));

    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedRows).map(async ([id, changes]) => {
        const fullRow = rows.find(r => r.id === Number(id));
        if (!fullRow) return;

        const payload = {
          ...fullRow,
          ...changes,
          id: Number(id),
        };

        await saveCategoryQuota(payload);
      });

      await Promise.all(updates);

      alert("Cambios guardados correctamente");
      setEditedRows({});
    } catch (err) {
      console.error(err);
      alert("Error guardando cambios");
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
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cupos Credito");

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Cupos_Credito.xlsx");
  };

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
          <button
            onClick={handleSearch}
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
          >
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
                <td>{row.ctaPuc14}</td>
                <td>{row.ctaPuc21}</td>
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
