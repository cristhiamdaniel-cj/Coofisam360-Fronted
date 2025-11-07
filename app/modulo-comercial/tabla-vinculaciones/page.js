"use client";
import { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Options for dropdowns
const grupoOptions = [
  "Novedad en consulta en listas restrictivas y vinculantes",
  "Documento de identidad en mal estado",
  "Inconsistencias informacion ingresada al core",
  "Documentos no subidos a WM",
  "Formulario con espacios en blanco",
  "Informacion inconsistente",
];

const novedadInfolaftOptions = ["SI", "NO"];

const meses = [
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

const initialRows = [
  {
    id: 1,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "55.059.665",
    nombreAsociado: "LUZ MERY RUBIANO GONZALEZ",
    asesorVinculacion: "Karla Vanessa Castro Marin",
    fechaVinculacion: "04/01/2025",
    oficina: "Garzón",
    observaciones:
      "Por favor, actualizar el correo electrónico del asociado en VirtualCoop, con la información del FOCO-128.",
    grupo: "Inconsistencias informacion ingresada al core",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "NO",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 2,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "1.075.305.395",
    nombreAsociado: "LINA MARIA CUSPIAN MOSQUERA",
    asesorVinculacion: "Karla Vanessa Castro Marin",
    fechaVinculacion: "03/01/2025",
    oficina: "Garzón",
    observaciones:
      "Por favor, se le recuerda que no se acepta pantallazo de las consultas realizadas, volver a generar la consulta de la procuraduría y descargarla en formato PDF y actualizar el correo electronico del asociado en VirtualCoop, con la información del FOCO-128.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 3,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "29.775.754",
    nombreAsociado: "OMAIRA  ESPINOSA TOBAR",
    asesorVinculacion: "Disponible",
    fechaVinculacion: "04/01/2025",
    oficina: "La Argentina",
    observaciones:
      "Por favor, cargar toda la documentación del asociado a la carpeta de WM, para proceder a validar la información.",
    grupo: "Documentos no subidos a WM",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "NO",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 4,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "12.171.374",
    nombreAsociado: "ILDE ALIRIO MUÑOZ ESPAÑA",
    asesorVinculacion: "Yurani Ruiz Uni",
    fechaVinculacion: "22/01/2025",
    oficina: "Pitalito",
    observaciones:
      "Por favor, anexar la consulta de la procuraduría a la carpeta del asociado WM, la que esta nombrada no corresponde a la consulta.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "NO",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 5,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "1.004.153.617",
    nombreAsociado: "EDNA VIRGINIA ORDONEZ PERAFAN",
    asesorVinculacion: "Jeniffer Camila Claros Torres",
    fechaVinculacion: "25/01/2025",
    oficina: "La Argentina",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 6,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "52.975.962",
    nombreAsociado: "MAYERLY  BARAJAS ZAMBRANO",
    asesorVinculacion: "Jhon Fredy Muñoz Vargas",
    fechaVinculacion: "21/01/2025",
    oficina: "Hobo",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 7,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "79.902.003",
    nombreAsociado: "LUIS  OSPINA OTAVO",
    asesorVinculacion: "Jonathan Buendia Tovar",
    fechaVinculacion: "22/01/2025",
    oficina: "Espinal",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 8,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "1.019.025.013",
    nombreAsociado: "CARLOS MAURICIO ROJAS GONZALEZ",
    asesorVinculacion: "Jonathan Buendia Tovar",
    fechaVinculacion: "25/01/2025",
    oficina: "Espinal",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 9,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "1.070.386.518",
    nombreAsociado: "DIEGO ALEJANDRO TORRES GALINDO",
    asesorVinculacion: "Judy Carolina Olave Lozano",
    fechaVinculacion: "24/01/2025",
    oficina: "Espinal",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 10,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "1.108.933.432",
    nombreAsociado: "LAURA DANIELA GUZMAN ARGUELLO",
    asesorVinculacion: "Jonathan Buendia Tovar",
    fechaVinculacion: "21/01/2025",
    oficina: "Espinal",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 11,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "1.192.742.685",
    nombreAsociado: "ALEJANDRO  RODRIGUEZ CARVAJAL",
    asesorVinculacion: "Jonathan Buendia Tovar",
    fechaVinculacion: "25/01/2025",
    oficina: "Espinal",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 12,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "93.472.740",
    nombreAsociado: "SANDRO  RIVERA ACOSTA",
    asesorVinculacion: "Akerles Steven Polania Camacho",
    fechaVinculacion: "25/01/2025",
    oficina: "Planadas",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 13,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "1.006.027.663",
    nombreAsociado: "YENCY LORENA GUARACA GUILOMBO",
    asesorVinculacion: "Akerles Steven Polania Camacho",
    fechaVinculacion: "23/01/2025",
    oficina: "Planadas",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 14,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "1.077.871.436",
    nombreAsociado: "ROSA ELENA JARA MORALES",
    asesorVinculacion: "Asesor Comercial Externo",
    fechaVinculacion: "30/01/2025",
    oficina: "Garzón",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
  {
    id: 15,
    mes: "Enero",
    año: "2025",
    cedulaAsociado: "55.061.837",
    nombreAsociado: "CARMENZA SANCHEZ MONTES",
    asesorVinculacion: "Martin Camilo Polo Arias",
    fechaVinculacion: "27/01/2025",
    oficina: "Garzón",
    observaciones:
      "Por favor, volver a realizar la consulta de INFOLAFT, se le recuerda que se dio la directriz que se debe consultar con la jurisdicción de la agencia.",
    grupo: "Novedad en consulta en listas restrictivas y vinculantes",
    muestra: "124",
    vinculacionesMes: "622",
    novedadInfolaft: "SI",
    tipoElemento: "Elemento",
    rutaAcceso:
      "sites/SistemaIntegraldeAdministracindelRiesgo/Lists/Observaciones Vinculaciones",
  },
];

export default function VinculacionesTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (id, field, value) => {
    setRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async () => {
    console.log("Saving edits:", editedRows);
    setEditedRows({});
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vinculaciones");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "vinculaciones.xlsx");
  };

  const filteredRows = rows.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Vinculaciones con Novedades
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar..."
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
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                Mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[80px]">
                Año
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Cedula del asociado
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                Nombre del asociado
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                Asesor que realizó la vinculación
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[130px]">
                Fecha de vinculación
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                Oficina
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                Observaciones
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                Grupo
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[100px]">
                Muestra
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Vinculaciones del mes
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[150px]">
                Novedad en INFOLAFT
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[120px]">
                Tipo de elemento
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[400px]">
                Ruta de acceso
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-left">
                  <select
                    value={r.mes}
                    onChange={e => handleChange(r.id, "mes", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {meses.map(mes => (
                      <option key={mes} value={mes}>
                        {mes}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.año}
                    onChange={e => handleChange(r.id, "año", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">{r.cedulaAsociado}</td>
                <td className="p-2 border text-left">{r.nombreAsociado}</td>
                <td className="p-2 border text-left">{r.asesorVinculacion}</td>
                <td className="p-2 border text-left">{r.fechaVinculacion}</td>
                <td className="p-2 border text-left">{r.oficina}</td>
                <td className="p-2 border text-left">{r.observaciones}</td>
                <td className="p-2 border text-left">
                  <select
                    value={r.grupo}
                    onChange={e => handleChange(r.id, "grupo", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {grupoOptions.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">{r.muestra}</td>
                <td className="p-2 border text-left">{r.vinculacionesMes}</td>
                <td className="p-2 border text-left">
                  <select
                    value={r.novedadInfolaft}
                    onChange={e =>
                      handleChange(r.id, "novedadInfolaft", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {novedadInfolaftOptions.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">{r.tipoElemento}</td>
                <td className="p-2 border text-left">
                  {r.rutaAcceso ? (
                    <a
                      href={r.rutaAcceso}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                      title={r.rutaAcceso}
                    >
                      {r.rutaAcceso.length > 50
                        ? `${r.rutaAcceso.substring(0, 50)}...`
                        : r.rutaAcceso}
                    </a>
                  ) : (
                    ""
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
