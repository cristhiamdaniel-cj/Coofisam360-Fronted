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
  listFormacionQuota,
  getFormacionQuota,
  saveFormacionQuota,
  updateFormacionQuota,
} from "../../../services/modulo-talento/carpeta-formador-talento/formacionQuota";

const puestos = [
  "ANALISTA DE CREDITO 1",
  "ANALISTA DE RIESGOS",
  "Analista Ingeniería Organizacional",
  "APRENDIZ ETAPA PRODUCTIVA",
  "ASESOR COMERCIAL AGENCIA 1",
  "ASESOR COMERCIAL AGENCIA 2",
  "ASESOR COMERCIAL AGENCIA 3",
  "ASESOR COMERCIAL AGENCIA 4",
  "ASESOR COMERCIAL CORRESPONSAL SOLIDARIO",
  "ASESOR FINANCIERO RURAL",
  "ASESOR MICROFINANZAS URBANO",
  "ASISTENTE BASE DE DATOS",
  "ASISTENTE CIENCIA DE DATOS",
  "ASISTENTE CONTABILIDAD",
  "AUX. SERV. GENERALES AGENCIA 1",
  "AUX. SERV. GENERALES DIRECCIÓN GENERAL",
  "Auxiliar Comunicaciones",
  "AUXILIAR CONTABILIDAD 2",
  "AUXILIAR DE AUDITORIA 1",
  "AUXILIAR DE AUDITORIA 2",
  "AUXILIAR DE CARTERA 1",
  "AUXILIAR DE CARTERA 2",
  "AUXILIAR DE CONTABILIDAD 1",
  "AUXILIAR DE CREDITO 1",
  "AUXILIAR DE CREDITO 2",
  "AUXILIAR DE GESTIÓN DOCUMENTAL",
  "AUXILIAR DE PUBLICIDAD",
  "AUXILIAR DE TALENTO Y CULTURA",
  "AUXILIAR JURIDICO 1",
  "AUXILIAR JURIDICO 2",
  "AUXILIAR OFICIAL DE CUMPLIMIENTO",
  "Auxiliar Seguridad y Salud en el Trabajo",
  "AUXILIAR SOCIAL MEDIA",
  "CAJERO 1 AGENCIA 1",
  "CAJERO 1 AGENCIA 2",
  "CAJERO AGENCIA 3",
  "CAJERO AGENCIA 4",
  "CAJERO AGENCIA 4A",
  "COORDINADOR DE CARTERA",
  "COORDINADOR DE COMUNICACIONES",
  "COORDINADOR DE MERCADEO",
  "COORDINADOR DE TALENTO Y CULTURA",
  "COORDINADOR GESTION DOCUMENTAL",
  "DIRECTOR AGENCIA 1",
  "DIRECTOR AGENCIA 2",
  "DIRECTOR AGENCIA 3",
  "DIRECTOR AGENCIA 4",
  "DIRECTOR AGENCIA 4A",
  "DIRECTOR AUDITORIA INTERNA",
  "DIRECTOR COMERCIAL",
  "DIRECTOR CONTABILIDAD",
  "DIRECTOR CREDITO",
  "DIRECTOR DE RIESGOS",
  "DIRECTOR DE TEGNOLOGIA",
  "DIRECTOR INGENIERIA ORGANIZACIONAL",
  "DIRECTOR JURIDICO",
  "FORMADOR DE TALENTO Y CULTURA",
  "GERENTE GENERAL",
  "GESTOR COMERCIAL",
  "GESTOR DE CANALES",
  "GESTOR DE CARTERA 1",
  "GESTOR DE CARTERA 2",
  "GESTOR MICROFINANZAS",
  "JEFE OPERACIONES AGENCIA 1",
  "JEFE OPERACIONES AGENCIA 2",
  "JEFE OPERACIONES AGENCIA 3",
  "JEFE OPERACIONES AGENCIA 4",
  "JEFE OPERACIONES AGENCIA 4A",
  "OFICIAL DE CUMPLIMIENTO",
  "PRACTICANTE UNIVERSITARIO",
  "SECRETARIA DE GERENCIA",
  "SUBGERENTE COMERCIAL",
  "SUBGERENTE DE CREDITO Y CARTERA",
  "SUBGERENTE FINANCIERO",
  "SUBGERENTE INNOVACION EMPRESARIAL",
  "SUPERNUMERARIO DE OFICINA",
  "SUPERNUMERARIO MICROFINANZAS",
  "SUPERNUMERARIO MICROFINANZAS 1",
  "TESORERO",
];

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
        const data = await listFormacionQuota({ limit: 500 });
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

  useEffect(() => {
    const query = search.trim().toLowerCase();

    const filtered = rows
      .filter(r => {
        const matchesSearch =
          !query || r.TipoFormacion.toLowerCase().includes(query);

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

  const handleChange = (index, field, value) => {
    // Convertir a número si es campo numérico

    // Actualizar rows usando el índice
    setRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });

    // Actualizar editedRows
    setEditedRows(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      const indices = Object.keys(editedRows || {})
        .map(k => Number(k))
        .filter(i => Number.isInteger(i) && i >= 0);
      for (const idx of Array.from(new Set(indices))) {
        const row = rows[idx];
        if (!row) continue;
        if (row.isNew) {
          await saveFormacionQuota(row);
        } else {
          await updateFormacionQuota(row);
        }
      }
      setEditedRows({});
      alert("Cambios guardados correctamente");
    } catch (err) {
      console.error("Error guardando cambios:", err);
      alert("Error al guardar cambios");
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
      id: crypto.randomUUID(), // o uuidv4() si ya lo tienes importado
      Año: new Date().getFullYear(),
      Mes: "", // se puede dejar vacío para seleccionar luego
      CantidadTrabajadores: 0,
      Oficina: "",
      Puesto: "",
      TemaFormacion: "",
      TipoCapacitacion: "",
      TotalParticipantes: 0,
      TotalTrabajadores: 0, // si quieres mostrarlo como no editable
      PorcentajeParticipacion: 0, // idem
      NumeroVecesFormado: 0,
      Calificacion: 0, // idem
      isNew: true, // marcar que esta fila es editable completamente
    };

    setRows(prev => [newRow, ...prev]); // 🔹 se agrega al principio
    setFilteredRows(prev => [newRow, ...prev]); // si estás usando filteredRows para la búsqueda
  };

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Formación y Participación
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por oficina"
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap">Mes</th>
              <th className="p-4 border text-center whitespace-nowrap">
                Cantidad Trabajadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Oficina - Dependencia
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[350px]">
                Roles
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[500px]">
                Tema de Formación
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Tipo de Formación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total de Participantes
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Total de Trabajadores
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                % de Participación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                # Veces Formado
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Calificación
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map((r, idx) => (
              <tr key={idx}>
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
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.CantidadTrabajadores}
                    onChange={e => {
                      handleChange(idx, "CantidadTrabajadores", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Oficina} // Cambia r.Oficina por el campo que estés usando
                    onChange={e => {
                      handleChange(idx, "Oficina", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "Garzón",
                      "Guadalupe",
                      "Pital",
                      "Gigante",
                      "Acevedo",
                      "Tarqui",
                      "La Plata",
                      "Pitalito",
                      "Suaza",
                      "La Argentina",
                      "Neiva",
                      "Rivera",
                      "Hobo",
                      "Iquira",
                      "Saladoblanco",
                      "Espinal",
                      "Planadas",
                      "Chaparral",
                      "Florencia",
                      "Red de Oficinas",
                      "Dirección General",
                      "Todo Coofisam",
                      "Fundacoofisam",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.Puesto}
                    onChange={e => {
                      handleChange(idx, "Puesto", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {puestos.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="text"
                    value={r.TemaFormacion}
                    onChange={e => {
                      handleChange(idx, "TemaFormacion", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <select
                    value={r.TipoFormacion} // Cambia r.TipoCapacitacion por el campo que estés usando
                    onChange={e => {
                      handleChange(idx, "TipoFormacion", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {[
                      "Capacitación Interna",
                      "Curso en Plataforma Aprendizaje",
                      "Inducción",
                      "Reinducción",
                      "Entrenamiento",
                      "Capacitación Externa",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.TotalParticipantes}
                    onChange={e => {
                      handleChange(idx, "TotalParticipantes", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.TotalTrabajadores}
                      onChange={e =>
                        handleChange(r.id, "TotalTrabajadores", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.TotalTrabajadores
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.PorcentajeParticipacion}
                      onChange={e =>
                        handleChange(
                          r.id,
                          "PorcentajeParticipacion",
                          e.target.value
                        )
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.PorcentajeParticipacion
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <input
                    type="number"
                    value={r.NumeroVecesFormado}
                    onChange={e => {
                      handleChange(idx, "NumeroVecesFormado", e.target.value);
                    }}
                    className="px-2 py-1 w-full text-left border ml-1"
                  />
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {r.isNew ? (
                    <input
                      type="number"
                      value={r.Calificacion}
                      onChange={e =>
                        handleChange(r.id, "Calificacion", e.target.value)
                      }
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.Calificacion
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
