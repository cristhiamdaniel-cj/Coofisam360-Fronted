"use client";
import { useEffect, useState } from "react";
import {
  listAnalisisExplicativo,
  saveAnalisisExplicativo,
  deleteAnalisisExplicativo,
} from "../../services/modulo-financiero/analisisExplicativo";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegSave, FaFileDownload, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const initialRows = [
  {
    id: 1,
    anio: 2025,
    mes: "Junio",
    categoria: "Activos",
    subcategoria: "Comportamiento de los Activos",
    descripcion:
      "Al corte de junio de 2025, los activos presentaron un incremento del 0,52% respecto al mes de diciembre de 2024, lo que equivale a un aumento de aproximadamente $1.290 millones de pesos. Esta variacion se debe principalmente  al  recimiento de la cartera de credito y adquisicion de elementos de propiedad, planta y equipo.",
  },
  {
    id: 2,
    anio: 2025,
    mes: "Junio",
    categoria: "Activos",
    subcategoria: "Comportamiento de la Cartera de Crédito",
    descripcion:
      "Al corte del mes de junio de 2025, la cartera de credito incluyendo capital, intereses y provisiones, alcanzo un valor de $170.696 millones, lo que representa un  recimiento del 1,93% en comparacion con el cierre de diciembre de 2024.\n\nPor otro lado, la cartera bruta registro un saldo de 182.760 millones, reflejando una disminucion del -0,57% frente al mes de mayo de 2025.\n\nEn cuanto a la calidad de la cartera, se presentó un incremento de 0,4 puntos porcentuales con respecto a mayo de 2025, cerrando el indicador en 8,44%.",
  },
  {
    id: 3,
    anio: 2025,
    mes: "Junio",
    categoria: "Pasivos",
    subcategoria: "Obligaciones Financieras",
    descripcion:
      "Las obligaciones financieras presentan una reduccion en el año de $1.567 millones cumpliendo así con el compromiso de pago oportuno de estas.",
  },
  {
    id: 4,
    anio: 2025,
    mes: "Junio",
    categoria: "Pasivos",
    subcategoria: "Comportamento del Pasivo",
    descripcion:
      "Los pasivos presentan decrecimiento al corte del mes de junio principalmente por la disminucion de cuentas por pagar cumpliendo con los compromisos contractuales adquiridos con proveedores y demas.",
  },
  {
    id: 5,
    anio: 2025,
    mes: "Junio",
    categoria: "Patrimonio",
    subcategoria: "Comportamiento de Excedentes",
    descripcion:
      "Durante junio, se registro un excedente de $464 millones.\n\nEl excedente acumulado alcanzó los $3.067 millones, destacandose que cerca de $900 millones provienen de la recuperacion del deterioro de cartera, conforme al modelo de pérdida esperada.",
  },
  {
    id: 6,
    anio: 2025,
    mes: "Junio",
    categoria: "Ingresos",
    subcategoria: "Analisis de Ingresos",
    descripcion:
      "El ingreso total para junio 2025 fue de $3.700 millones con un acumulado en el ano de $23.580 millones de los cuales $17.176 millones corresponden a ingresos por colocacion de cartera de crédito y $6.403 millones corresponden a otros ingresos.\n\nLos rubros que mayor aportan a la generacion de otros ingresos son: la recuperacion de deterioro con un saldo de $4.176 millones, igualmente aportan los ingresos por valoracion de inversiones con $1.458 millones y otros ingresos con $680 millones que corresponden basicamente a las diferentes comisiones que cobra COOFISAM en el desarrollo del objeto social.\n\nEl ingreso recibido por cartera de credito en el mes fue de $2.932 millones, presentando una leve disminucion para el corte de junio, y continua siendo menor al ingreso promedio generado en el año 2024 ($3.087), esto a causa de disminucion en tasa que se viene presentado, por lo cual es importante continuar con la dinamica de crecimiento de la cartera ofertando las diferentes campanas pero tambien enfocados a la par en las lineas que nos generan mayor ingreso.",
  },
  {
    id: 7,
    anio: 2025,
    mes: "Junio",
    categoria: "Gastos",
    subcategoria: "Análisis de Gastos",
    descripcion:
      "Los gastos al corte del junio 2025 ascendieron a $16.972 millones dentro de los cuales $14.980 millones corresponde a gastos administrativos y $1.992 millones corresponden a otros gastos.\n\nEl gasto por deterioro de cartera se situa en $4.734 millones.\n\nLos gastos varios fueron de $1.352 millones, dentro de los cuales encontramos erogaciones mas representativas por contrato de cooperacion con Fundacoofisam $649 millones e impuestos asumidos por $424 millones.",
  },
  {
    id: 8,
    anio: 2025,
    mes: "Junio",
    categoria: "Costos",
    subcategoria: "Análisis de Costos",
    descripcion:
      "Para el mes de Junio, los intereses causados por los Depositos a la vista fueron de $73 millones y el interes causado del ahorro a termino fue de $463 Millones.\n\nLos intereses de las obligaciones financieras ascendieron a $29 millones.",
  },
  {
    id: 9,
    anio: 2025,
    mes: "Julio",
    categoria: "Activos",
    subcategoria: "Comportamiento de los Activos",
    descripcion:
      "Al corte de julio de 2025, los activos presentaron un incremento del 6,56% respecto al mes de diciembre de 2024, lo que equivale a un aumento de aproximadamente $16.361 millones de pesos. Esta variacion se debe principalmente a la constitucion de inversiones, con el fin de generar mayor rentabilidad a os recursos por la liquidez presentada.",
  },
  {
    id: 10,
    anio: 2025,
    mes: "Julio",
    categoria: "Activos",
    subcategoria: "Comportamiento de la Cartera de Crédito",
    descripcion:
      "Al corte del mes de julio de 2025, la cartera de credito incluyendo capital, intereses y provisiones, alcanzo un valor de $171.170 millones, lo que representa un crecimiento del 2,21% en comparacion con el cierre de diciembre de 2024.\n\nPor otro lado, la cartera bruta registro un saldo de 183.296 millones, reflejando un incremento del 0,29% frente al mes de junio de 2025.\n\nEn cuanto a la calidad de la cartera, se presento disminucion de 0,33 puntos porcentuales con respecto a junio de 2025, cerrando el indicador en 8,11%.",
  },
  {
    id: 11,
    anio: 2025,
    mes: "Julio",
    categoria: "Pasivos",
    subcategoria: "Obligaciones Financieras",
    descripcion:
      "Las obligaciones financieras presentan una reduccion en el año de $1.868 millones cumpliendo así con el compromiso de pago oportuno de estas.",
  },
  {
    id: 12,
    anio: 2025,
    mes: "Julio",
    categoria: "Pasivos",
    subcategoria: "Comportamento del Pasivo",
    descripcion:
      "Los pasivos presentan incremento al corte del mes de julio principalmente por la dinamica de crecimietno de los ahorros.",
  },
  {
    id: 13,
    anio: 2025,
    mes: "Julio",
    categoria: "Patrimonio",
    subcategoria: "Comportamiento de Excedentes",
    descripcion:
      "Durante julio, se genero un excedente de $632 millones, como resultado a la adecuado gestion de la cartera vencida.\n\nEl excedente acumulado alcanzo los $3.700 millones, destacandose que cerca de $900 millones provienen de la recuperacion del deterioro de cartera, conforme al modelo de perdida esperada.",
  },
  {
    id: 14,
    anio: 2025,
    mes: "Julio",
    categoria: "Ingresos",
    subcategoria: "Analisis de Ingresos",
    descripcion:
      "El ingreso total para julio 2025 fue de $3.803 millones con un acumulado en el ano de $27,383 millones de los cuales $20,696 millones corresponden a ingresos por colocacion de cartera de credito y $7,317 millones corresponden a otros ingresos.\n\nLos rubros que mayor aportan a la generacion de otros ingresos son: la recuperacion de deterioro con un saldo de $4,646 millones, igualmente aportan los ingresos por valoracion de inversiones con $1,773 millones y otros ingresos con $795 millones que corresponden basicamente a las diferentes comisiones que cobra COOFISAM en el desarrollo del objeto social.\n\nEl ingreso recibido por cartera de credito en el mes fue de $2,914 millones, presentando una leve disminucion para el corte de julio, y continua siendo menor al ingreso promedio generado en el año 2024 ($3.087), esto a causa de disminucion en tasa que se viene presentado, por lo cual es importante continuar con la dinamica de crecimiento de la cartera ofertando las diferentes campanas pero tambien enfocados a la par en las lineas que nos generan mayor ingreso.",
  },
  {
    id: 15,
    anio: 2025,
    mes: "Julio",
    categoria: "Gastos",
    subcategoria: "Análisis de Gastos",
    descripcion:
      "Los gastos al corte del julio 2025 ascendieron a $19.526 millones dentro de los cuales $17.176 millones corresponde a gastos administrativos y $2.359 millones corresponden a otros gastos.\n\nEl gasto por deterioro de cartera se situa en $4.874 millones.\n\nLos gastos varios fueron de $1.597 millones, dentro de los cuales encontramos erogaciones mas representativas por contrato de cooperacion con Fundacoofisam $727 millones e impuestos asumidos por $518 millones.",
  },
  {
    id: 16,
    anio: 2025,
    mes: "Julio",
    categoria: "Costos",
    subcategoria: "Análisis de Costos",
    descripcion:
      "Para el mes de Julio, los intereses causados por los Depósitos a la vista fueron de $87 millones y el interes causado del ahorro a termino fue de $496 Millones.\n\nLos intereses de las obligaciones inancieras ascendieron a $27 millones.",
  },
  {
    id: 17,
    anio: 2025,
    mes: "Agosto",
    categoria: "Activos",
    subcategoria: "Comportamiento de los Activos",
    descripcion:
      "Los activos presentaron un incremento del 12.19% respecto al mes de diciembre de 2024, lo que equivale a un aumento de aproximadamente $30.408 millones de pesos. Esta variación se debe principalmente a la constitución de inversiones, con el fin de generar mayor rentabilidad a los recursos por la liquidez presentada.",
  },
  {
    id: 18,
    anio: 2025,
    mes: "Agosto",
    categoria: "Activos",
    subcategoria: "Comportamiento de la Cartera de Crédito",
    descripcion:
      "La cartera de crédito incluyendo capital, intereses y provisiones, alcanzó un valor de $169.563 millones, lo que representa un crecimiento del 1.25% en comparación con el cierre de diciembre de 2024.\n\nPor otro lado, la cartera bruta registró un saldo de $181.021 millones, reflejando una disminución del 1.2% frente al mes de julio de 2025.\n\nEn cuanto a la calidad de la cartera, se presentó disminución de 1.01 puntos porcentuales con respecto a julio de 2025, cerrando el indicador en el 7.10%.",
  },
  {
    id: 19,
    anio: 2025,
    mes: "Agosto",
    categoria: "Pasivos",
    subcategoria: "Obligaciones Financieras",
    descripcion:
      "Las obligaciones financieras presentan una reducción en el año de $2.148 millones cumpliendo así con el compromiso de pago oportuno de estas.",
  },
  {
    id: 20,
    anio: 2025,
    mes: "Agosto",
    categoria: "Pasivos",
    subcategoria: "Comportamento del Pasivo",
    descripcion:
      "Los pasivos presentan incremento al corte del mes de agosto principalmente por la dinámica de crecimiento de los ahorros.",
  },
  {
    id: 21,
    anio: 2025,
    mes: "Agosto",
    categoria: "Patrimonio",
    subcategoria: "Comportamiento de Excedentes",
    descripcion:
      "Durante el mes de agosto, se generó un excedente de $149 millones. No obstante, el resultado del mes se vio impactado en $362 millones debido al incremento del 0,2% en la provisión general de la cartera de crédito en cumplimiento a direccionamiento de la Superintendencia de la Economía Solidaria.\n\nEl excedente acumulado alcanzó los $3.850 millones.",
  },
  {
    id: 22,
    anio: 2025,
    mes: "Agosto",
    categoria: "Ingresos",
    subcategoria: "Analisis de Ingresos",
    descripcion:
      "Para agosto 2025 fue de $3.882 millones con un acumulado en el año de $31.265 millones de los cuales $22.965 millones corresponden a ingresos por colocación de cartera de crédito y $8.300 millones corresponden a otros ingresos.\n\nLos rubros que mayor aportan a la generación de otros ingresos son: la recuperación de deterioro con un saldo de $5.096 millones, igualmente aportan los ingresos por valoración de inversiones con $2.161 millones y otros ingresos con $929 millones que corresponden básicamente a las diferentes comisiones que cobra COOFISAM en el desarrollo del objeto social.\n\nEl ingreso recibido por cartera de crédito en el mes fue de $2.928 millones, presentando un leve crecimiento para el corte de agosto, y continúa siendo menor al ingreso promedio generado en el año 2024 ($3.087), esto a causa de disminución en tasa que se viene presentado, por lo cual es importante continuar con la dinámica de crecimiento de la cartera ofertando las diferentes campañas, pero también enfocados a la par en las líneas que nos generan mayor ingreso.",
  },
  {
    id: 23,
    anio: 2025,
    mes: "Agosto",
    categoria: "Gastos",
    subcategoria: "Análisis de Gastos",
    descripcion:
      "Al corte del agosto 2025 ascendieron a $22.622 millones dentro de los cuales $19.933 millones corresponde a gastos administrativos y $2.688 millones corresponden a otros gastos.\n\nEl gasto por deterioro de cartera se sitúa en $5.752 millones.\n\nLos gastos varios fueron de $1.823 millones, dentro de los cuales encontramos erogaciones más representativas por contrato de cooperación con Fundacoofisam $795 millones e impuestos asumidos por $605 millones.",
  },
  {
    id: 24,
    anio: 2025,
    mes: "Agosto",
    categoria: "Costos",
    subcategoria: "Análisis de Costos",
    descripcion:
      "Para el mes de agosto, los intereses causados por los Depósitos a la vista fueron de $95 millones y el interés causado del ahorro a término fue de $509 Millones.\n\nLos intereses de las obligaciones financieras ascendieron a $25 millones.",
  },
];

export default function CategoriasTable() {
  const [rows, setRows] = useState(initialRows);
  const [filteredRows, setFilteredRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [editingRows, setEditingRows] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();

  async function loadData() {
    setLoading(true);
    try {
      const data = await listAnalisisExplicativo({ limit: 900 });

      // Sort by anio and mes (most recent first)
      const sorted = [...data].sort((a, b) => {
        // Sort by year first (descending), then by month (descending)
        if (a.anio !== b.anio) return b.anio - a.anio;
        const monthOrder = [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return monthOrder.indexOf(b.mes) - monthOrder.indexOf(a.mes);
      });

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
          r.categoria.toLowerCase().includes(query) ||
          r.subcategoria.toLowerCase().includes(query) ||
          r.descripcion.toLowerCase().includes(query);

        // Only apply year/month filters if they are set in the filter dropdowns
        // Don't filter based on individual row values
        const matchesYear = !selectedYear || r.anio === Number(selectedYear);
        const matchesMonth = !selectedMonth || r.mes === selectedMonth;

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => {
        // Sort by year first (descending), then by month (descending)
        if (a.anio !== b.anio) return b.anio - a.anio;
        const monthOrder = [
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
        return monthOrder.indexOf(b.mes) - monthOrder.indexOf(a.mes);
      });

    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth]);

  if (loading) {
    return <div className="p-12 text-center">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Análisis Explicativo");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Analisis_Explicativo.xlsx");
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

  const availableMonths = monthNames.filter(name =>
    uniqueMonths.includes(name)
  );

  // Dropdown options
  const yearOptions = Array.from({ length: 11 }, (_, i) => 2025 + i); // 2025-2035
  const panelOptions = [
    "Activos",
    "Pasivos",
    "Patrimonio",
    "Ingresos",
    "Gastos",
    "Costos",
  ];
  const titleOptions = [
    "Comportamiento de los Activos",
    "Comportamiento de la Cartera de Crédito",
    "Obligaciones Financieras",
    "Comportamento del Pasivo",
    "Comportamiento de Excedentes",
    "Análisis de Ingresos",
    "Análisis de Gastos",
    "Análisis de Costos",
  ];

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

  const handleAddRow = () => {
    const newId = `new_${Date.now()}`;
    const newRow = {
      id: newId,
      anio: 2025,
      mes: "Enero",
      categoria: "",
      subcategoria: "",
      descripcion: "",
      isNew: true,
      created_at: new Date().toISOString() // Timestamp para indicador visual
    };
    
    setRows(prev => [newRow, ...prev]);
    setFilteredRows(prev => [newRow, ...prev]);
    setEditingRows(prev => ({ ...prev, [newId]: true }));
    setEditedRows(prev => ({ ...prev, [newId]: {} }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg("");
    setStatusType("");
    
    try {
      const updates = [];
      
      console.log("=== DEBUG handleSave ===");
      console.log("editedRows:", editedRows);
      console.log("editingRows:", editingRows);
      console.log("rows:", rows);
      
      // Procesar todas las filas que están siendo editadas (excluyendo las nuevas)
      Object.entries(editedRows).forEach(([id, changes]) => {
        const fullRow = rows.find(r => String(r.id) === String(id));
        if (!fullRow || fullRow.isNew) return; // Saltar filas nuevas

        const payload = {
          anio: Number(fullRow.anio),
          mes: fullRow.mes,
          categoria: fullRow.categoria,
          subcategoria: fullRow.subcategoria,
          descripcion: (changes.descripcion ?? fullRow.descripcion) || "",
        };

        console.log("Procesando fila editada:", id, payload);
        updates.push(saveAnalisisExplicativo(payload));
      });

      // Procesar filas nuevas que están en editingRows
      Object.keys(editingRows).forEach(id => {
        const fullRow = rows.find(r => String(r.id) === String(id));
        if (fullRow && fullRow.isNew) {
          // Si la fila nueva ya está en editedRows, usar esos cambios
          const changes = editedRows[id] || {};
          const payload = {
            anio: Number(changes.anio ?? fullRow.anio),
            mes: changes.mes ?? fullRow.mes,
            categoria: changes.categoria ?? fullRow.categoria,
            subcategoria: changes.subcategoria ?? fullRow.subcategoria,
            descripcion: (changes.descripcion ?? fullRow.descripcion) || "",
          };

          // Validar que todos los campos requeridos estén llenos
          if (!payload.anio || !payload.mes || !payload.categoria || !payload.subcategoria) {
            console.log("Fila nueva con campos faltantes:", id, payload);
            setStatusMsg("Por favor complete todos los campos requeridos (Año, Mes, Categoría, Subcategoría)");
            setStatusType("error");
            return;
          }

          console.log("Procesando fila nueva:", id, payload);
          updates.push(saveAnalisisExplicativo(payload));
        }
      });

      console.log("Total updates:", updates.length);

      if (updates.length === 0) {
        setStatusMsg("No hay cambios para guardar");
        setStatusType("info");
        return;
      }

      await Promise.all(updates);
      setStatusMsg("Cambios guardados correctamente");
      setStatusType("success");
      setEditedRows({});
      setEditingRows({});
      await loadData();
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message || "Error guardando cambios");
      setStatusType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, categoria, subcategoria) => {
    // Primera confirmación
    const firstConfirm = window.confirm(
      `¿Está seguro que desea eliminar el análisis de "${categoria} - ${subcategoria}"?`
    );
    
    if (!firstConfirm) return;
    
    // Segunda confirmación
    const secondConfirm = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Confirma que desea ELIMINAR permanentemente este análisis?`
    );
    
    if (!secondConfirm) return;
    
    try {
      await deleteAnalisisExplicativo(id);
      setStatusMsg("Análisis eliminado correctamente");
      setStatusType("success");
      await loadData();
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message || "Error eliminando análisis");
      setStatusType("error");
    }
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Análisis Explicativo
      </h1>
      <div className="actions-container flex justify-between mb-4">
        {statusMsg && (
          <div className={`px-4 py-2 rounded text-sm ${
            statusType === 'success' ? 'bg-green-100 text-green-800' : 
            statusType === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {statusMsg}
          </div>
        )}
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por categoría, subcategoría o descripción"
            className="border w-[300px] px-2 py-1"
          />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="border-2 border-red-700 text-red-700 px-2 py-1"
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
            className="border-2 border-red-700 text-red-700 px-2 py-1 "
          >
            <option value="">Todos los meses</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAddRow}
            className="action-button flex gap-2 items-center justify-center cursor-pointer"
          >
            Añadir fila
          </button>
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
          <thead className="tabla-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap ">AÑO</th>
              <th className="p-4 border text-center whitespace-nowrap ">MES</th>
              <th className="p-4 border text-center whitespace-nowrap ">
                PANEL
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                TITULO
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                TEXTO: ANÁLISIS EXPLICATIVO
              </th>
              <th className="p-4 border text-center whitespace-nowrap ">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(row => {
              const isEditing = editingRows[row.id] || row.isNew;
              const isRecentlyCreated = row.isNew; // Solo para filas realmente nuevas
              return (
                <tr key={row.id} className={isRecentlyCreated ? "bg-green-50" : ""}>
                  <td className="p-4 border text-center">
                    <div className="flex items-center justify-center gap-2">
                      {isRecentlyCreated && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          NUEVO
                        </span>
                      )}
                      {isEditing ? (
                        <select
                          value={row.anio || ""}
                          onChange={e =>
                            handleChange(row.id, "anio", parseInt(e.target.value))
                          }
                          className="w-full px-2 py-1 border rounded"
                        >
                          <option value="">Seleccionar año</option>
                          {yearOptions.map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      ) : (
                        row.anio
                      )}
                    </div>
                  </td>
                  <td className="p-4 border text-center">
                    {isEditing ? (
                      <select
                        value={row.mes || ""}
                        onChange={e => handleChange(row.id, "mes", e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="">Seleccionar mes</option>
                        {monthNames.map(month => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    ) : (
                      row.mes
                    )}
                  </td>
                  <td className="p-4 border text-center">
                    {isEditing ? (
                      <select
                        value={row.categoria || ""}
                        onChange={e =>
                          handleChange(row.id, "categoria", e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="">Seleccionar panel</option>
                        {panelOptions.map(panel => (
                          <option key={panel} value={panel}>
                            {panel}
                          </option>
                        ))}
                      </select>
                    ) : (
                      row.categoria
                    )}
                  </td>
                  <td className="p-4 border text-center">
                    {isEditing ? (
                      <select
                        value={row.subcategoria || ""}
                        onChange={e =>
                          handleChange(row.id, "subcategoria", e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="">Seleccionar título</option>
                        {titleOptions.map(title => (
                          <option key={title} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      row.subcategoria
                    )}
                  </td>
                  <td className="p-4 border text-left max-w-md">
                    {isEditing ? (
                      <textarea
                        value={row.descripcion || ""}
                        onChange={e =>
                          handleChange(row.id, "descripcion", e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded min-h-[100px]"
                        rows={4}
                      />
                    ) : (
                      <div className="max-h-[100px] overflow-y-auto">
                        {row.descripcion}
                      </div>
                    )}
                  </td>
                  <td className="p-2 border text-center whitespace-nowrap">
                    <div className="flex gap-2 justify-center">
                      {isEditing ? (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                if (row.isNew) {
                                  // Para filas nuevas, validar campos requeridos
                                  const changes = editedRows[row.id] || {};
                                  const payload = {
                                    anio: Number(changes.anio ?? row.anio),
                                    mes: changes.mes ?? row.mes,
                                    categoria: changes.categoria ?? row.categoria,
                                    subcategoria: changes.subcategoria ?? row.subcategoria,
                                    descripcion: (changes.descripcion ?? row.descripcion) || "",
                                  };

                                  if (!payload.anio || !payload.mes || !payload.categoria || !payload.subcategoria) {
                                    setStatusMsg("Por favor complete todos los campos requeridos (Año, Mes, Categoría, Subcategoría)");
                                    setStatusType("error");
                                    return;
                                  }

                                  await saveAnalisisExplicativo(payload);
                                  setStatusMsg("Análisis guardado correctamente");
                                  setStatusType("success");
                                  await loadData(); // Recargar datos para obtener el ID real
                                } else {
                                  // Para filas existentes, guardar cambios
                                  const changes = editedRows[row.id] || {};
                                  const payload = {
                                    anio: Number(row.anio),
                                    mes: row.mes,
                                    categoria: row.categoria,
                                    subcategoria: row.subcategoria,
                                    descripcion: (changes.descripcion ?? row.descripcion) || "",
                                  };

                                  await saveAnalisisExplicativo(payload);
                                  setStatusMsg("Cambios guardados correctamente");
                                  setStatusType("success");
                                  await loadData();
                                }

                                // Salir del modo de edición
                                setEditingRows(prev => {
                                  const newState = { ...prev };
                                  delete newState[row.id];
                                  return newState;
                                });
                                setEditedRows(prev => {
                                  const newState = { ...prev };
                                  delete newState[row.id];
                                  return newState;
                                });
                              } catch (err) {
                                console.error(err);
                                setStatusMsg(err.message || "Error guardando cambios");
                                setStatusType("error");
                              }
                            }}
                            className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
                            title="Guardar"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => {
                              if (row.isNew) {
                                // Si es nueva y se cancela, eliminar la fila
                                setRows(prev => prev.filter(r => r.id !== row.id));
                                setFilteredRows(prev => prev.filter(r => r.id !== row.id));
                              }
                              setEditingRows(prev => {
                                const newState = { ...prev };
                                delete newState[row.id];
                                return newState;
                              });
                              setEditedRows(prev => {
                                const newState = { ...prev };
                                delete newState[row.id];
                                return newState;
                              });
                            }}
                            className="px-3 py-1 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600"
                            title="Cancelar"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingRows(prev => ({ ...prev, [row.id]: true }))}
                            className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          {!row.isNew && (
                            <button
                              onClick={() => handleDelete(row.id, row.categoria, row.subcategoria)}
                              className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                              title="Eliminar análisis"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
