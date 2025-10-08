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

const initialRows = [
  {
    codigo: "1",
    nombre: "ACTIVO",
    valorAnterior: 220342007644,
    valorActual: 245897984209,
  },
  {
    codigo: "11",
    nombre: "EFECTIVO Y EQUIVALENTE AL EFECTIVO",
    valorAnterior: 33608702242,
    valorActual: 31024411867,
  },
  {
    codigo: "1105",
    nombre: "CAJA",
    valorAnterior: 7013409950,
    valorActual: 7530682598,
  },
  {
    codigo: "110505",
    nombre: "CAJA GENERAL",
    valorAnterior: 7000692677,
    valorActual: 7530682598,
  },
  {
    codigo: "110510",
    nombre: "CAJA MENOR",
    valorAnterior: 12717273,
    valorActual: 0,
  },
  {
    codigo: "1110",
    nombre: "BANCOS Y OTRAS ENTIDADES CON ACTIVIDAD FINANCIERA",
    valorAnterior: 24166833885,
    valorActual: 14608262200,
  },
  {
    codigo: "111005",
    nombre: "BANCOS COMERCIALES",
    valorAnterior: 15186233294,
    valorActual: 12350471621,
  },
  {
    codigo: "111010",
    nombre: "BANCOS COOPERATIVOS",
    valorAnterior: 8980600591,
    valorActual: 2257790579,
  },
  {
    codigo: "1115",
    nombre: "EQUIVALENTES AL EFECTIVO (compromiso de pago)",
    valorAnterior: 2428458407,
    valorActual: 720533035,
  },
  {
    codigo: "111515",
    nombre: "FONDOS FIDUCIARIOS A LA VISTA",
    valorAnterior: 2428458407,
    valorActual: 720533035,
  },
  {
    codigo: "1120",
    nombre: "EFECTIVO DE USO RESTRINGIDO Y/O CON DESTINACIÓN ESPECÍFICA",
    valorAnterior: 0,
    valorActual: 8164934034,
  },
  {
    codigo: "112005",
    nombre: "FONDO DE LIQUIDEZ - CUENTAS DE AHORRO",
    valorAnterior: 0,
    valorActual: 8164934034,
  },
  {
    codigo: "12",
    nombre: "INVERSIONES",
    valorAnterior: 31307973362,
    valorActual: 36405650608,
  },
  {
    codigo: "1203",
    nombre: "FONDO DE LIQUIDEZ",
    valorAnterior: 0,
    valorActual: 9278952205,
  },
  {
    codigo: "120305",
    nombre: "FONDO DE LIQUIDEZ - CERTIFICADOS DE DEPÓSITO A TÉRMINO - CDT",
    valorAnterior: 0,
    valorActual: 9278952205,
  },
  {
    codigo: "1220",
    nombre: "INVERSIONES EN ENTIDADES ASOCIADAS",
    valorAnterior: 0,
    valorActual: 247000000,
  },
  {
    codigo: "122001",
    nombre: "INVERSIONES CONTABILIZADAS AL COSTO",
    valorAnterior: 0,
    valorActual: 247000000,
  },
  {
    codigo: "1226",
    nombre: "OTRAS INVERSIONES EN INSTRUMENTOS DE PATRIMONIO",
    valorAnterior: 8240711718,
    valorActual: 1093141384,
  },
  {
    codigo: "122602",
    nombre: "APORTES SOCIALES EN ENTIDADES ECONOMÍA SOLIDARIA",
    valorAnterior: 8240711718,
    valorActual: 1093141384,
  },
  {
    codigo: "1228",
    nombre: "INVERSIONES CONTABILIZADAS A COSTO AMORTIZADO",
    valorAnterior: 23067261644,
    valorActual: 25786557019,
  },
  {
    codigo: "122811",
    nombre:
      "TÍTULOS EMITIDOS AVALADOS ACEPTADOS O GARANTIZADOS POR INSTITUCIONES VIGILADAS POR LA SUPERINTENDENCIA FINANCIERA (INCLUIDOS LOS BONOS OBLIGATORIA U OPCIONALMENTE CONVERTIBLES EN ACCIONES)",
    valorAnterior: 23051200245,
    valorActual: 25786557019,
  },
  {
    codigo: "122895",
    nombre: "OTROS TÍTULOS",
    valorAnterior: 16061399,
    valorActual: 0,
  },
  {
    codigo: "14",
    nombre: "CARTERA DE CRÉDITOS",
    valorAnterior: 145372293807,
    valorActual: 167755661823,
  },
  {
    codigo: "1404",
    nombre: "CRÉDITOS DE VIVIENDA - CON LIBRANZA",
    valorAnterior: 76706744,
    valorActual: 77575007,
  },
  {
    codigo: "140405",
    nombre: "CATEGORÍA A RIESGO NORMAL",
    valorAnterior: 76706744,
    valorActual: 77575007,
  },
  {
    codigo: "1405",
    nombre: "CRÉDITOS DE VIVIENDA - SIN LIBRANZA",
    valorAnterior: 3398553120,
    valorActual: 3394362783,
  },
  {
    codigo: "140505",
    nombre: "CATEGORÍA A RIESGO NORMAL",
    valorAnterior: 3282817343,
    valorActual: 3256962444,
  },
  {
    codigo: "140510",
    nombre: "CATEGORÍA B RIESGO ACEPTABLE",
    valorAnterior: 53190115,
    valorActual: 37957138,
  },
  {
    codigo: "140515",
    nombre: "CATEGORÍA C RIESGO APRECIABLE",
    valorAnterior: 0,
    valorActual: 65463710,
  },
  {
    codigo: "140520",
    nombre: "CATEGORÍA D RIESGO SIGNIFICATIVO",
    valorAnterior: 0,
    valorActual: 23768741,
  },
  {
    codigo: "140525",
    nombre: "CATEGORÍA E RIESGO DE INCOBRABILIDAD",
    valorAnterior: 62545661,
    valorActual: 10210750,
  },
  {
    codigo: "1406",
    nombre: "INTERESES CRÉDITOS DE VIVIENDA",
    valorAnterior: 39933966,
    valorActual: 41763231,
  },
  {
    codigo: "140605",
    nombre: "CATEGORÍA A RIESGO NORMAL",
    valorAnterior: 26950314,
    valorActual: 29862798,
  },
  {
    codigo: "140610",
    nombre: "CATEGORÍA B RIESGO ACEPTABLE",
    valorAnterior: 1993107,
    valorActual: 1117200,
  },
  {
    codigo: "140615",
    nombre: "CATEGORÍA C RIESGO APRECIABLE",
    valorAnterior: 3385192,
    valorActual: 2143109,
  },
  {
    codigo: "140620",
    nombre: "CATEGORÍA D RIESGO SIGNIFICATIVO",
    valorAnterior: 0,
    valorActual: 899424,
  },
  {
    codigo: "140625",
    nombre: "CATEGORÍA E RIESGO DE INCOBRABILIDAD",
    valorAnterior: 683311,
    valorActual: 627277,
  },
  {
    codigo: "140630",
    nombre: "INTERESES DE CRÉDITOS CON PERIODOS DE GRACIA",
    valorAnterior: 6922043,
    valorActual: 7113423,
  },
  {
    codigo: "1407",
    nombre: "PAGOS POR CUENTA DE ASOCIADOS - CRÉDITOS VIVIENDA",
    valorAnterior: 904976,
    valorActual: 763670,
  },
];

export default function CategoriasTable() {
  const [rows, setRows] = useState(initialRows);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();

  /*async function loadData() {
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
  */

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

  /*
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
    */

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
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Presupuesto
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
          <thead className="tabla-presupuesto-header">
            <tr>
              <th
                rowSpan="2"
                className="p-4 border text-center whitespace-nowrap "
              >
                Codigo
              </th>
              <th
                rowSpan="2"
                className="p-4 border text-center whitespace-nowrap "
              >
                Denominación
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                ene-2025 Proyectado
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                ene-2025 Histórico
              </th>
              <th
                colSpan="2"
                className="p-4 border text-center whitespace-nowrap "
              >
                ene-2025 Proyectado VS ene-2025 Histórico
              </th>
            </tr>
            <tr>
              <th className="p-4 border text-center whitespace-nowrap ">
                Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                Monto
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">%</th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(row => (
              <tr key={row.id}>
                <td>{row.codigo}</td>
                <td>{row.nombre}</td>
                <td>$ {row.valorAnterior}</td>
                <td>$ {row.valorActual}</td>
                <td>$ {row.valorActual - row.valorAnterior}</td>
                <td>
                  {(row.valorAnterior === 0
                    ? 100
                    : ((row.valorActual - row.valorAnterior) /
                        row.valorAnterior) *
                      100
                  ).toFixed(2)}
                  %
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
