"use client";
import { useEffect, useState } from "react";
import {
  listCreditQuota,
  saveCreditQuota,
} from "../../services/modulo-financiero/creditQuota";
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
        const data = await listCreditQuota({ limit: 200 });
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
    const filtered = rows.filter(
      r =>
        r.cuenta?.toLowerCase().includes(query) ||
        r.entidadFinanciera?.toLowerCase().includes(query)
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
          entidad_financiera:
            fullRow.entidadFinanciera || changes.entidadFinanciera,
          fecha_renovado: fullRow.fechaRenovado || changes.fechaRenovado,
          cupo_asignado: fullRow.cupoAsignado || changes.cupoAsignado,
        };

        await saveCreditQuota(payload);
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
        Cupo Créditos
      </h1>

      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cuenta o entidad"
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
              disabled={saving}
              className="action-button flex gap-2 items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
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
          <thead className="tabla-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">
                Fecha Renovado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cuenta
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Entidad Financiera
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Cupo Asignado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cupo Ejecutado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Disponible
              </th>
              <th className="p-4 border text-center  min-w-[250px]">
                Garantia
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % Utilizacion
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Plazo/Meses
              </th>
              <th className="p-4 border text-center whitespace-nowrap">Tasa</th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map((r, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="date"
                    value={
                      r.fechaRenovado
                        ? r.fechaRenovado.split("/").reverse().join("-")
                        : ""
                    }
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaRenovado",
                        // Convert back to dd/mm/yyyy so it stays consistent with the rest of your code
                        e.target.value.split("-").reverse().join("/")
                      )
                    }
                    className="px-2 py-1 w-full cursor-pointer border"
                  />
                </td>

                <td>{r.cuenta}</td>
                <td>{r.entidadFinanciera}</td>

                <td>
                  <input
                    type="number"
                    value={r.cupoAsignado || ""}
                    onChange={e =>
                      handleChange(r.id, "cupoAsignado", e.target.value)
                    }
                    className="px-2 py-1 w-full text-right border"
                  />
                </td>

                <td className="num text-right">
                  {Intl.NumberFormat("es-CO").format(r.cupoEjecutado || 0)}
                </td>
                <td className="num text-right">
                  {Intl.NumberFormat("es-CO").format(r.disponible || 0)}
                </td>

                <td>
                  <input
                    type="text"
                    value={r.garantia || ""}
                    onChange={e =>
                      handleChange(r.id, "garantia", e.target.value)
                    }
                    className="px-2 py-1 w-full border"
                  />
                </td>

                <td className="num text-right">
                  {r.porcentajeUtilizacion ?? 0}%
                </td>
                <td className="text-center">{r.plazo}</td>
                <td className="text-center">{r.tasa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function toInputDateValue(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${yy}-${mm}-${dd}`;
}

/*
function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
  */

/*<td>
                  <input
                    type="date"
                    value={r.fecharenovado}
                    onChange={e => handleChange(r.id, "fecha", e.target.value)}
                    className="px-2 py-1 w-full cursor-pointer"
                  />
</td>*/
