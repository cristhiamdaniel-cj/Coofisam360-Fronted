"use client";
import { useEffect, useState } from "react";
import { listCreditQuota } from "../../services/modulo-financiero/creditQuota";
import { FaRegSave } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function CuposTable() {
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await listCreditQuota({ limit: 200 });
        setRows(data);
        setError("");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  return (
    <main className="pt-12 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-12">
        Cupo Créditos
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input type="text" className="border w-[300px]" />
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
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
          <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
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
            {rows.map((r, idx) => (
              <tr key={idx}>
                {/* Fecha Renovado editable */}
                <td>{r.fechaRenovado || r.fecha_renovado}</td>

                <td>{r.cuenta}</td>
                <td>{r.entidadFinanciera || r.entidad_financiera}</td>

                {/* Cupo Asignado editable */}
                <td>
                  <input
                    type="number"
                    value={r.cupoAsignado || r.cupo_asignado || ""}
                    onChange={e =>
                      handleChange(r.id, "cupoAsignado", e.target.value)
                    }
                    className="px-2 py-1 w-full text-right border"
                  />
                </td>

                <td className="num">
                  {Intl.NumberFormat("es-CO").format(
                    r.cupoEjecutado || r.cupo_ejecutado
                  )}
                </td>
                <td className="num">
                  {Intl.NumberFormat("es-CO").format(r.disponible)}
                </td>

                {/* Garantia editable */}
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

                <td className="num">
                  {r.porcentajeUtilizacion ?? r.porcentaje_utilizacion ?? 0}%
                </td>
                <td>{r.plazo}</td>
                <td>{r.tasa}</td>
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
  return `${yy}-${mm}-${dd}`; // browser-friendly
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
