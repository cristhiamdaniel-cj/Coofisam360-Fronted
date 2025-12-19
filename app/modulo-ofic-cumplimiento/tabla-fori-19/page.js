"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
// Format: 01/02/2023 -> 2023-02-01
const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Helper function to convert date input to date string
// Format: 2023-02-01 -> 01/02/2023
const fromDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// Initial data
const initialRows = [
  {
    id: 1,
    creadoPor: "Jorge Eduardo Tello Perdomo",
    oficinaArea: "Neiva",
    importanciaReporte: "Alta",
    fechaReporte: "01/02/2023",
    vinculosTercero: "Familiar",
    tipoOperacionContraparte: "consignaciones y retiros",
    ultimaFechaActualizacion: "30/04/2022",
    tipoOperacion: "Inusual",
    title: "buendia lopez luayen yukzarat",
    tipoPersona: "Natural",
    numeroCedulaNit: "1075796245",
    direccion: "CARRERA 27 2E 23 NEIVA",
    telefono: "3143210151",
    actividadEconomica: "subsidiada por terceros",
    descripcion: "varias consignaciones y retiros inmediatos en el mes de enero de 2023, esta información fue reportada por el director de oficina por W.M",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 2,
    creadoPor: "Jorge Eduardo Tello Perdomo",
    oficinaArea: "Neiva",
    importanciaReporte: "Alta",
    fechaReporte: "01/02/2023",
    vinculosTercero: "Otro",
    tipoOperacionContraparte: "CONSIGNACIONES Y RETIROS",
    ultimaFechaActualizacion: "12/01/2023",
    tipoOperacion: "Inusual",
    title: "BUENDIA LOPEZ YERAI",
    tipoPersona: "Natural",
    numeroCedulaNit: "1077732496",
    direccion: "CARRERA  27 2E 23 NEIVA",
    telefono: "3115889048",
    actividadEconomica: "SUBSIDIADA POR TERCEROS",
    descripcion: "APERTURARON CUENTA EN ENERO PARA CONSIGNACIONES Y RETIROS. ESTE CASO FUE REPORTADO POR EL DIRECTOR DE OFICINA EN EL MES DE ENERO POR W.M",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 3,
    creadoPor: "Viviana Hoyos Medina",
    oficinaArea: "Garzon",
    importanciaReporte: "Media",
    fechaReporte: "12/04/2023",
    vinculosTercero: "",
    tipoOperacionContraparte: "",
    ultimaFechaActualizacion: "04/04/2023",
    tipoOperacion: "Inusual",
    title: "JOSE ANTONIO RESTREPO LOPEZ",
    tipoPersona: "Natural",
    numeroCedulaNit: "1083917954",
    direccion: "CALLE 6 B N 21 A 31",
    telefono: "3124104655",
    actividadEconomica: "ASALARIADO",
    descripcion: "Asociado que se vinculo a la cooperativa el día 04/04/2023 y a la fecha ya ha realizado varios retiros hasta dos en el mismo día.",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 4,
    creadoPor: "Viviana Hoyos Medina",
    oficinaArea: "Pitalito",
    importanciaReporte: "Media",
    fechaReporte: "12/04/2023",
    vinculosTercero: "",
    tipoOperacionContraparte: "",
    ultimaFechaActualizacion: "04/04/2023",
    tipoOperacion: "Inusual",
    title: "CARLOS ALBERTO RESTREPO LOPEZ",
    tipoPersona: "Natural",
    numeroCedulaNit: "1083901872",
    direccion: "CALLE 6 B N 21 A 31",
    telefono: "3128985815",
    actividadEconomica: "ASALARIADO",
    descripcion: "Asociado que se vinculo a la cooperativa el día 04/04/2023 y a la fecha ya ha realizado varios retiros hasta dos en el mismo día.",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 5,
    creadoPor: "Director Fundación",
    oficinaArea: "Administrativa",
    importanciaReporte: "Baja",
    fechaReporte: "04/10/2023",
    vinculosTercero: "",
    tipoOperacionContraparte: "solicitud",
    ultimaFechaActualizacion: "04/10/2023",
    tipoOperacion: "Sospechosa",
    title: "1000000",
    tipoPersona: "Natural",
    numeroCedulaNit: "900354849",
    direccion: "calle5 8 87",
    telefono: "3133257072",
    actividadEconomica: "8969",
    descripcion: "hola prueba",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "Prueba\n",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 6,
    creadoPor: "Yudi Luz Karime Mosquera Cruz",
    oficinaArea: "Garzon",
    importanciaReporte: "Media",
    fechaReporte: "22/11/2023",
    vinculosTercero: "Otro",
    tipoOperacionContraparte: "Se informa que el asociado Serafin Losada  Sarrias identificado con cedula N, 16.188.467 aperturo cuenta de ahorros en Coofisam Garzón durante el mes de febrero del año en curso y posterior a un par de meses despues se fue para Planadas y luego para Chaparral presentando en todos las zonas diferentes ahorros significativos y ahora hace un par de semanas atras nos indica que ahora se esta radicando en Pitalito y requiere de un cupo rotativo; se le consulto porque en menos de poco tiempo se habia traslado de zonas y manifesto que debido a diversas amenazas en el Tolima, pero es un asociado que recauda montos significativos en su cuenta de ahorros",
    ultimaFechaActualizacion: "15/02/2023",
    tipoOperacion: "Sospechosa",
    title: "Serafin Losada Sarrias",
    tipoPersona: "Natural",
    numeroCedulaNit: "16188467",
    direccion: "Pitalito",
    telefono: "3102827053",
    actividadEconomica: "Comerciante venta de productos naturistas",
    descripcion: "Se informa que el asociado Serafin Losada  Sarrias identificado con cedula N, 16.188.467 aperturo cuenta de ahorros en Coofisam Garzón durante el mes de febrero del año en curso y posterior a un par de meses despues se fue para Planadas y luego para Chaparral presentando en todos las zonas diferentes ahorros significativos y ahora hace un par de semanas atras nos indica que ahora se esta radicando en Pitalito y requiere de un cupo rotativo; se le consulto porque en menos de poco tiempo se habia traslado de zonas y manifesto que debido a diversas amenazas en el Tolima, pero es un asociado que recauda montos significativos en su cuenta de ahorros          ",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "Se realizó gestión y se pudo evidenciar que el asociado es de la agencia de Pitalito, donde tiene ahora su residencia mas asídua, por lo que se le facilitaba abrir cuenta en dicha oficina. \n\nEn su momento, la directora agencia Garzón Liliana Sterling orientó al señor y le indicó que no era sujeto de crédito, informando tambien del hecho al director agencia Pitalito, en razón a la inusualidad de su comportamiento transaccional.\n\nAl final se pudo dialogar con la persona, quien aclaró la procedencia de sus recursos, por varios conceptos, entre otros, por su actividad de comercio de productos naturales.\n\nPese a sus operaciones inusuales, no se considera de riesgo para la Cooperativa, en cuanto a que tenga alguna relación con dineros ilícitos, provenientes de actividades de LA/FT.\n\nTeniendo en cuenta lo anterior, se da por cerrado el caso.",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 7,
    creadoPor: "Doris Molina Peña",
    oficinaArea: "Acevedo",
    importanciaReporte: "Alta",
    fechaReporte: "04/12/2023",
    vinculosTercero: "Comercial",
    tipoOperacionContraparte: "POSIBLE HECHO DE FRAUDE CIBERNETICO",
    ultimaFechaActualizacion: "15/06/2023",
    tipoOperacion: "Inusual",
    title: "PARROQUIA SAN FRANCISCO JAVIER",
    tipoPersona: "Jurídica",
    numeroCedulaNit: "891180135",
    direccion: "CARRERA 6 N 8-25",
    telefono: "3214923586",
    actividadEconomica: "OFICIOS RELIGIOSOS",
    descripcion: "El 30 de noviembre llaman a informar que no tienen el saldo correspondiente según información del portal empresarial, se procede a verificar en Visionamos y han realizado pagos por pse el 23 de noviembre en horas de la mañana por valor de $59.873.500 en 4 transacciones, posteriormente se evidencia que el 02 de noviembre también habían realizado pagos por pse por valor de $ 15.115.400 en 9 transacciones, de inmediato se notificó mediante correo electrónico a la encargada de canales con copia a Gerencia General, Subgerencia Comercial y Subgerencia Financiera. al día siguiente se notifica al Oficial de Cumplimiento y al Director de Riesgos, generando la tarea por wm.",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 8,
    creadoPor: "Doris Molina Peña",
    oficinaArea: "Acevedo",
    importanciaReporte: "Alta",
    fechaReporte: "14/12/2023",
    vinculosTercero: "Comercial",
    tipoOperacionContraparte: "POSIBLE FRAUDE CIBERNETICO",
    ultimaFechaActualizacion: "15/06/2023",
    tipoOperacion: "Sospechosa",
    title: "PARROQUIA SAN FRANCISCO JAVIER",
    tipoPersona: "Jurídica",
    numeroCedulaNit: "891180135",
    direccion: "CARRERA 6  8-26",
    telefono: "3214923586",
    actividadEconomica: "SERVICIOS RELIGIOSOS",
    descripcion: "Revisados los movimientos de la cuenta de ahorros, le registran pagos por PSE los días 02 y 23 de noviembre por valor total de $70.988.000, se dio a conocer a la encargada de Canales, al subg. comercial, gerencia general y subg. Fra. el día 30 de noviembre en horas de la noche y el 01 de diciembre de 2023 a Oficial de cumplimiento y Director de Riesgos.",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 9,
    creadoPor: "Angee Yojanna Losada Camacho",
    oficinaArea: "La Plata",
    importanciaReporte: "Alta",
    fechaReporte: "21/02/2024",
    vinculosTercero: "",
    tipoOperacionContraparte: "",
    ultimaFechaActualizacion: "29/08/2023",
    tipoOperacion: "Sospechosa",
    title: "VENANCIO HERNANDEZ ROJAS",
    tipoPersona: "Natural",
    numeroCedulaNit: "12201668",
    direccion: "CALLE 4 N 12 50",
    telefono: "3209681574",
    actividadEconomica: "COMERCIANTE (REMATES)",
    descripcion: "ASOCIADO DE LA AGENCIA LA PLATA, REALIZA RETIROS SEGUIDOS POR VALORES ALTOS Y NO SE SABE DE QUE PROVIENE EL DINERO, YA QUE TODAS SUS TRANSACCIONES REALIZADAS EN LA AGENCIA DE GARZON SON POR RETIROS. además, se evidencia en su estado de cuenta transacciones todos los días por valores grandes.",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 10,
    creadoPor: "Daniela Sierra Fierro",
    oficinaArea: "Administrativa",
    importanciaReporte: "Baja",
    fechaReporte: "28/02/2024",
    vinculosTercero: "Comercial",
    tipoOperacionContraparte: "solicitud de prueba",
    ultimaFechaActualizacion: "14/02/2024",
    tipoOperacion: "Sospechosa",
    title: "FERNEY CAMACHO",
    tipoPersona: "Natural",
    numeroCedulaNit: "1077855297",
    direccion: "CALLE 3",
    telefono: "31327375",
    actividadEconomica: "EMPLEADO",
    descripcion: "SOLICITUD DE PRUEBA",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "REGISTRO DE PRUEBA",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
  {
    id: 11,
    creadoPor: "Jose Alexis Peña Valencia",
    oficinaArea: "Garzon",
    importanciaReporte: "Alta",
    fechaReporte: "17/12/2024",
    vinculosTercero: "Comercial",
    tipoOperacionContraparte: "Buenas tardes, se reportan movimiento de saldos considerables de asociada  Duvier Garces CC 1080262360, me confirma asociado que cultiva y comerciliza lulo  a terceros en bogota\npero esta semana ha movido recursos altos por cuenta convenio bancolombia 92555, ref se confirmo con datos del soporte y me confirmaron datos e informacion cel 3235229126 di 1004148035\n\nAtentamente., ",
    ultimaFechaActualizacion: "14/06/2024",
    tipoOperacion: "Inusual",
    title: "DUVIER GARCES ROJAS",
    tipoPersona: "Natural",
    numeroCedulaNit: "1080262360",
    direccion: "VEREDA ZULUAGA",
    telefono: "3168911350",
    actividadEconomica: "AGRICULTURA",
    descripcion: "AGRICULTURA",
    esAsociado: "Si",
    conceptoTrabajador: "",
    conceptoOficial: "",
    tipoElemento: "Elemento",
    rutaAcceso: "sites/GESTINSARLAFT/Lists/Reporte de operaciones",
  },
];

// Options for dropdowns
const creadoPorOptions = [
  "Jorge Eduardo Tello Perdomo",
  "Viviana Hoyos Medina",
  "Director Fundación",
  "Yudi Luz Karime Mosquera Cruz",
  "Doris Molina Peña",
  "Angee Yojanna Losada Camacho",
  "Daniela Sierra Fierro",
  "Jose Alexis Peña Valencia",
];

const oficinaAreaOptions = [
  "Neiva",
  "Garzon",
  "Pitalito",
  "Administrativa",
  "Acevedo",
  "La Plata",
];

const importanciaReporteOptions = ["Alta", "Media", "Baja"];

const vinculosTerceroOptions = ["Familiar", "Otro", "Comercial", ""];

const tipoOperacionOptions = ["Inusual", "Sospechosa"];

const tipoPersonaOptions = ["Natural", "Jurídica"];

const esAsociadoOptions = ["Si", "No"];

const tipoElementoOptions = ["Elemento"];

export default function Fori19Table() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDownload = () => {
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "FORI-19"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "fori-19.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.numeroCedulaNit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.oficinaArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.creadoPor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        FORI-19
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por título, cédula, oficina o creado por"
            className="unified-input w-[300px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="unified-button flex gap-2 items-center justify-center">
            Buscar
            <IoSearch />
          </button>
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
        </div>
      </div>

      <div className="overflow-x-auto max-w-full table-container h-[65vh]">
        <table className="table-auto border-collapse w-full">
          <thead className="tabla-header">
            <tr>
              <th className="p-4 border text-center whitespace-nowrap">ID</th>
              <th className="p-4 border text-center whitespace-nowrap">
                CREADO POR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                OFICINA O ÁREA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                IMPORTANCIA DEL REPORTE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DEL REPORTE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VÍNCULOS EXISTENTES CON EL TERCERO (SI APLICA)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE OPERACIÓN A REALIZAR CON LA CONTRAPARTE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ÚLTIMA FECHA DE ACTUALIZACIÓN DE DATOS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE OPERACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">TITLE</th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE PERSONA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NÚMERO DE CÉDULA Y NIT
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DIRECCIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TELÉFONO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ACTIVIDAD ECONÓMICA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DESCRIPCIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ES ASOCIADO(A) DE COOFISAM
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CONCEPTO DE TRABAJADOR QUE REPORTA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CONCEPTO OFICIAL DE CUMPLIMIENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE ELEMENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                RUTA DE ACCESO
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-left">
                  <select
                    value={r.creadoPor}
                    onChange={e =>
                      handleChange(r.id, "creadoPor", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {creadoPorOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.oficinaArea}
                    onChange={e =>
                      handleChange(r.id, "oficinaArea", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {oficinaAreaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.importanciaReporte}
                    onChange={e =>
                      handleChange(r.id, "importanciaReporte", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {importanciaReporteOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaReporte)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaReporte",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.vinculosTercero}
                    onChange={e =>
                      handleChange(r.id, "vinculosTercero", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {vinculosTerceroOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.tipoOperacionContraparte}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "tipoOperacionContraparte",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Tipo de operación"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.ultimaFechaActualizacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "ultimaFechaActualizacion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoOperacion}
                    onChange={e =>
                      handleChange(r.id, "tipoOperacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoOperacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.title}
                    onChange={e => handleChange(r.id, "title", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Title"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoPersona}
                    onChange={e =>
                      handleChange(r.id, "tipoPersona", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoPersonaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.numeroCedulaNit}
                    onChange={e =>
                      handleChange(r.id, "numeroCedulaNit", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Cédula/NIT"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.direccion}
                    onChange={e =>
                      handleChange(r.id, "direccion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Dirección"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.telefono}
                    onChange={e =>
                      handleChange(r.id, "telefono", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Teléfono"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.actividadEconomica}
                    onChange={e =>
                      handleChange(r.id, "actividadEconomica", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Actividad económica"
                  />
                </td>
                <td className="p-2 border text-left">
                  <textarea
                    value={r.descripcion}
                    onChange={e =>
                      handleChange(r.id, "descripcion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm resize-none"
                    placeholder="Descripción"
                    rows="3"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.esAsociado}
                    onChange={e =>
                      handleChange(r.id, "esAsociado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {esAsociadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.conceptoTrabajador}
                    onChange={e =>
                      handleChange(r.id, "conceptoTrabajador", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Concepto trabajador"
                  />
                </td>
                <td className="p-2 border text-left">
                  <textarea
                    value={r.conceptoOficial}
                    onChange={e =>
                      handleChange(r.id, "conceptoOficial", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm resize-none"
                    placeholder="Concepto oficial"
                    rows="3"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoElemento}
                    onChange={e =>
                      handleChange(r.id, "tipoElemento", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoElementoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.rutaAcceso}
                    onChange={e =>
                      handleChange(r.id, "rutaAcceso", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Ruta de acceso"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


