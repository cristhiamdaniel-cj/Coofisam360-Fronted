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
  deleteFormacionQuota,
} from "../../../services/modulo-talento/carpeta-formador-talento/formacionQuota";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toMonthNumber } from "@/app/services/modulo-talento/carpeta-formador-talento/talentHelpers";

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

        // Si el registro está siendo editado, no aplicar filtro de mes para evitar que desaparezca
        const isBeingEdited = editingRows[r.id];
        const matchesMonth =
          !selectedMonth || r.Mes.toUpperCase() === selectedMonth.toUpperCase() || isBeingEdited;

        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => Number(a.id) - Number(b.id));

    console.log("🔍 Filtrado - Total rows:", rows.length, "Filtered:", filtered.length, "Selected month:", selectedMonth, "Selected year:", selectedYear);
    const februaryFiltered = filtered.filter(r => r.Mes === 'FEBRERO' && r.Año === 2025);
    console.log("📅 Registros de febrero filtrados:", februaryFiltered.length, februaryFiltered);
    
    setFilteredRows(filtered);
  }, [search, rows, selectedYear, selectedMonth, editingRows]);

  // Obtener años únicos
  const uniqueYears = [...new Set(rows.map(r => r.Año).filter(Boolean))];

  // Obtener meses únicos en mayúscula - incluir todos los meses del año
  const existingMonths = [
    ...new Set(rows.map(r => r.Mes && r.Mes.toUpperCase()).filter(Boolean)),
  ];
  
  // Mantener el orden original de los meses
  const monthNames = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  
  // Incluir todos los meses del año, no solo los que tienen datos
  const uniqueMonths = monthNames;

  // Usar todos los meses del año como opciones disponibles
  const availableMonths = uniqueMonths;

  const calculatePercentage = (totalParticipantes, totalTrabajadores) => {
    if (!totalParticipantes || !totalTrabajadores || totalTrabajadores === 0) {
      return 0;
    }
    return Math.round((Number(totalParticipantes) / Number(totalTrabajadores)) * 100);
  };

  const getTotalTrabajadoresForMonth = (anio, mes) => {
    // Buscar en los datos existentes el total de trabajadores para el mes específico
    const existingRow = rows.find(r => r.Año === anio && r.Mes === mes && r.TotalTrabajadores > 0);
    return existingRow ? existingRow.TotalTrabajadores : 0;
  };

  const handleChange = (rowId, field, value) => {
    // Convertir a número si es campo numérico

    // Actualizar rows usando el ID de la fila
    setRows(prev => {
      const newRows = [...prev];
      const rowIndex = newRows.findIndex(r => String(r.id) === String(rowId));
      if (rowIndex === -1) return prev;
      
      const currentRow = newRows[rowIndex];
      newRows[rowIndex] = { ...currentRow, [field]: value };
      
      // Si cambia el mes, actualizar el Total de Trabajadores automáticamente
      if (field === 'Mes') {
        const anio = currentRow.Año;
        const totalTrabajadores = getTotalTrabajadoresForMonth(anio, value);
        newRows[rowIndex].TotalTrabajadores = totalTrabajadores;
        
        // Recalcular el porcentaje con el nuevo total de trabajadores
        const totalParticipantes = currentRow.TotalParticipantes;
        newRows[rowIndex].PorcentajeParticipacion = calculatePercentage(totalParticipantes, totalTrabajadores);
      }
      
      // Si cambia TotalParticipantes, recalcular el porcentaje
      if (field === 'TotalParticipantes') {
        const totalParticipantes = value;
        const totalTrabajadores = currentRow.TotalTrabajadores;
        newRows[rowIndex].PorcentajeParticipacion = calculatePercentage(totalParticipantes, totalTrabajadores);
      }
      
      return newRows;
    });

    // Actualizar editedRows
    setEditedRows(prev => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: value },
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
    // Usar filteredRows para respetar los filtros aplicados
    const dataToExport = filteredRows.length > 0 ? filteredRows : rows;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Formación y Participación");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    
    // Nombre del archivo basado en si hay filtros aplicados
    const fileName = filteredRows.length > 0 && filteredRows.length < rows.length 
      ? `formacion-participacion-filtrado-${filteredRows.length}-registros.xlsx`
      : "formacion-participacion-completo.xlsx";
    
    saveAs(data, fileName);
  };

  const handleSaveSingle = async (rowId) => {
    try {
      const finalRow = rows.find(r => String(r.id) === String(rowId));
      if (!finalRow) {
        console.warn("⚠️ No se encontró la fila con id:", rowId);
        return;
      }
      
      // Validar campos obligatorios
      if (!finalRow.Oficina || finalRow.Oficina.trim() === "") {
        alert("El campo 'Oficina' es obligatorio");
        return;
      }
      if (!finalRow.Puesto || finalRow.Puesto.trim() === "") {
        alert("El campo 'Puesto' es obligatorio");
        return;
      }
      if (!finalRow.TipoFormacion || finalRow.TipoFormacion.trim() === "") {
        alert("El campo 'Tipo de Formación' es obligatorio");
        return;
      }
      
      // Validar rango de calificación (numeric(3,2) = -9.99 a 9.99)
      if (finalRow.Calificacion < 0 || finalRow.Calificacion > 9.99) {
        alert("La calificación debe estar entre 0 y 9.99");
        return;
      }
      
      // Construir payload con campos del frontend (como en otros formularios)
      const payload = {
        id: finalRow.id,
        Año: finalRow.Año,
        Mes: finalRow.Mes,
        Oficina: finalRow.Oficina,
        Puesto: finalRow.Puesto,
        TemaFormacion: finalRow.TemaFormacion,
        TipoFormacion: finalRow.TipoFormacion,
        CantidadTrabajadores: finalRow.CantidadTrabajadores,
        TotalParticipantes: finalRow.TotalParticipantes,
        TotalTrabajadores: finalRow.TotalTrabajadores,
        PorcentajeParticipacion: Math.round(finalRow.PorcentajeParticipacion), // Convertir a entero
        NumeroVecesFormado: finalRow.NumeroVecesFormado,
        Calificacion: finalRow.Calificacion,
        // Grupo no se envía porque no existe en fyc_formacion_snapshot
      };

      // Debug: Log del payload antes de enviar
      console.log("🔍 DEBUG - Payload antes de enviar:", payload);
      console.log("🔍 DEBUG - Calificacion value:", finalRow.Calificacion, "Type:", typeof finalRow.Calificacion);

      // Crear o actualizar el registro usando el nuevo sistema de ID
      if (finalRow.isNew) {
        // Si es un registro nuevo, crear directamente
        await saveFormacionQuota(payload);
      } else {
        // Si es un registro existente, actualizar usando el ID
        await updateFormacionQuota(payload);
      }

      // Cerrar modo edición
      setEditingRows(prev => ({ ...prev, [finalRow.id]: false }));
      setEditedRows(prev => {
        const newEdited = { ...prev };
        delete newEdited[finalRow.id];
        return newEdited;
      });

      // Recargar datos
      console.log("🔄 Recargando datos después de guardar...");
      const data = await listFormacionQuota({ limit: 500 });
      console.log("📊 Datos recargados:", data);
      const februaryRecords = Array.isArray(data) ? data.filter(r => r.Mes === 'FEBRERO' && r.Año === 2025) : (data?.items || []).filter(r => r.Mes === 'FEBRERO' && r.Año === 2025);
      console.log("📅 Registros de febrero después de recargar:", februaryRecords.length, februaryRecords);
      setRows(Array.isArray(data) ? data : data?.items || []);
      
      // Mostrar mensaje de éxito
      alert("✅ Registro guardado exitosamente");
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
        // TODO: Implementar deleteFormacionQuota cuando esté disponible en el backend
        alert("Función de eliminar pendiente de implementar en el backend");
      } catch (err) {
        console.error("Error eliminando registro:", err);
        alert("Error al eliminar el registro");
      }
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: `new_${Date.now()}`, // ID temporal para el frontend (no se envía al backend)
      Año: new Date().getFullYear(),
      Mes: "ENERO", // valor por defecto válido
      CantidadTrabajadores: 0,
      Oficina: "Direccion General", // valor por defecto válido (campo obligatorio) - sin tilde como en BD
      Puesto: "ADMINISTRATIVO", // valor por defecto válido
      TemaFormacion: "Competencias básicas, técnicas y específicas", // valor por defecto válido
      TipoFormacion: "Capacitación Interna", // valor por defecto válido (campo obligatorio)
      TotalParticipantes: 0,
      TotalTrabajadores: 0, // si quieres mostrarlo como no editable
      PorcentajeParticipacion: 0, // se calculará automáticamente
      NumeroVecesFormado: 0,
      Calificacion: 0, // valor entre 0 y 9.99 (numeric(3,2))
      // Grupo no se incluye porque no existe en fyc_formacion_snapshot
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
              <th className="p-4 border text-center whitespace-nowrap">Acciones</th>
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
            {filteredRows.map((r, idx) => {
              const isEditing = r.isNew || !!editingRows[r.id];
              return (
                <tr key={idx}>
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
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.CantidadTrabajadores}
                      onChange={e => {
                        handleChange(r.id, "CantidadTrabajadores", e.target.value);
                      }}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    r.CantidadTrabajadores
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={r.Oficina}
                      onChange={e => {
                        handleChange(r.id, "Oficina", e.target.value);
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
                      "Direccion General",
                      "Todo Coofisam",
                      "Fundacoofisam",
                    ].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    </select>
                  ) : (
                    r.Oficina
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={r.Puesto}
                    onChange={e => {
                      handleChange(r.id, "Puesto", e.target.value);
                    }}
                    className="border rounded p-1 w-full"
                  >
                    {puestos.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    </select>
                  ) : (
                    r.Puesto
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={r.TemaFormacion}
                    onChange={e => {
                      handleChange(r.id, "TemaFormacion", e.target.value);
                    }}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    r.TemaFormacion
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={r.TipoFormacion} // Cambia r.TipoCapacitacion por el campo que estés usando
                    onChange={e => {
                      handleChange(r.id, "TipoFormacion", e.target.value);
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
                  ) : (
                    r.TipoFormacion
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.TotalParticipantes}
                    onChange={e => {
                      handleChange(r.id, "TotalParticipantes", e.target.value);
                    }}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    r.TotalParticipantes
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <div className="px-2 py-1 w-full text-center font-semibold">
                    {r.TotalTrabajadores}
                  </div>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  <div className="px-2 py-1 w-full text-center font-semibold">
                    {r.PorcentajeParticipacion}%
                  </div>
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.NumeroVecesFormado}
                      onChange={e => {
                        handleChange(r.id, "NumeroVecesFormado", e.target.value);
                      }}
                      className="px-2 py-1 w-full text-left border ml-1"
                    />
                  ) : (
                    r.NumeroVecesFormado
                  )}
                </td>
                <td className="p-2 border text-left whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={r.Calificacion}
                      onChange={e =>
                        handleChange(r.id, "Calificacion", e.target.value)
                      }
                      min="0"
                      max="9.99"
                      step="0.01"
                      className="px-2 py-1 w-full border"
                    />
                  ) : (
                    r.Calificacion
                  )}
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
