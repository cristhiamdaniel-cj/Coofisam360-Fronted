"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
// Format: DD/MM/YYYY -> YYYY-MM-DD
const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Helper function to convert date input to date string
// Format: YYYY-MM-DD -> DD/MM/YYYY
const fromDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// Helper function to parse money value
const parseMoney = (value) => {
  if (!value) return "";
  return value.toString().replace(/\$|\.| /g, "").trim();
};

// Initial data
const initialRows = [
  {
    id: 1,
    entidad: "Alcaldía Municipal",
    nit: "8911800226",
    municipio: "Garzón",
    departamento: "Huila",
    acuerdoVigente: "34",
    anoAcuerdo: "2017",
    montoSolicitado: "2 Smlmv",
    modificaciones: "Si",
    tipoModificacion: "Financiera",
    detalleModificacion: "Base de liquidación",
    efectoModificacion: "Disminución",
    montoAcordado: "1 Smlmv",
    valorMensual: "1423500",
    fechaUltimaModificacion: "",
    accionJuridicaRealizada: "",
    estadoAccion: "",
    fechaAccion: "",
    estadoPago: "",
    estadoAcuerdo: "Activo",
    observacionesJuridicas: "",
  },
  {
    id: 2,
    entidad: "Alcaldía Municipal",
    nit: "8911801990",
    municipio: "Pital",
    departamento: "Huila",
    acuerdoVigente: "11",
    anoAcuerdo: "2021",
    montoSolicitado: "3 Smlmv",
    modificaciones: "Si",
    tipoModificacion: "Financiera",
    detalleModificacion: "Base de liquidación",
    efectoModificacion: "Disminución",
    montoAcordado: "1½ Smlmv",
    valorMensual: "2135250",
    fechaUltimaModificacion: "",
    accionJuridicaRealizada: "",
    estadoAccion: "",
    fechaAccion: "",
    estadoPago: "",
    estadoAcuerdo: "Activo",
    observacionesJuridicas: "",
  },
  {
    id: 3,
    entidad: "Alcaldía Municipal",
    nit: "8911801761",
    municipio: "Gigante",
    departamento: "Huila",
    acuerdoVigente: "19",
    anoAcuerdo: "2020",
    montoSolicitado: "2 Smlmv",
    modificaciones: "No",
    tipoModificacion: "",
    detalleModificacion: "",
    efectoModificacion: "",
    montoAcordado: "2 Smlmv",
    valorMensual: "2847000",
    fechaUltimaModificacion: "",
    accionJuridicaRealizada: "Recurso de reconsideración",
    estadoAccion: "Desfavorable",
    fechaAccion: "",
    estadoPago: "",
    estadoAcuerdo: "Activo",
    observacionesJuridicas: "",
  },
  {
    id: 4,
    entidad: "Alcaldía Municipal",
    nit: "8911801912",
    municipio: "Suaza",
    departamento: "Huila",
    acuerdoVigente: "29",
    anoAcuerdo: "2017",
    montoSolicitado: "2 Smlmv",
    modificaciones: "No",
    tipoModificacion: "",
    detalleModificacion: "",
    efectoModificacion: "",
    montoAcordado: "2 Smlmv",
    valorMensual: "2847000",
    fechaUltimaModificacion: "",
    accionJuridicaRealizada: "Recurso de reconsideración",
    estadoAccion: "Desfavorable",
    fechaAccion: "",
    estadoPago: "",
    estadoAcuerdo: "Activo",
    observacionesJuridicas: "",
  },
  {
    id: 5,
    entidad: "Alcaldía Municipal",
    nit: "8911800193",
    municipio: "Hobo",
    departamento: "Huila",
    acuerdoVigente: "20",
    anoAcuerdo: "2017",
    montoSolicitado: "1 Smlmv",
    modificaciones: "No",
    tipoModificacion: "",
    detalleModificacion: "",
    efectoModificacion: "",
    montoAcordado: "1 Smlmv",
    valorMensual: "1423500",
    fechaUltimaModificacion: "",
    accionJuridicaRealizada: "Recurso de reconsideración",
    estadoAccion: "Desfavorable",
    fechaAccion: "",
    estadoPago: "",
    estadoAcuerdo: "Activo",
    observacionesJuridicas: "",
  },
  {
    id: 6,
    entidad: "Alcaldía Municipal",
    nit: "8911801801",
    municipio: "Saladoblanco",
    departamento: "Huila",
    acuerdoVigente: "39",
    anoAcuerdo: "2020",
    montoSolicitado: "½ Smlmv",
    modificaciones: "No",
    tipoModificacion: "",
    detalleModificacion: "",
    efectoModificacion: "",
    montoAcordado: "½ Smlmv",
    valorMensual: "711750",
    fechaUltimaModificacion: "",
    accionJuridicaRealizada: "",
    estadoAccion: "",
    fechaAccion: "",
    estadoPago: "",
    estadoAcuerdo: "Activo",
    observacionesJuridicas: "",
  },
];

// Options for dropdowns
const entidadOptions = [
  "Alcaldía Municipal",
  "Secretaría de Hacienda Municipal",
  "Empresa de Servicios Públicos de Energía",
  "Concesionario privado de alumbrado público",
  "Otra entidad delegada",
  "",
];

const municipioOptions = [
  "Garzón",
  "Pital",
  "Gigante",
  "Suaza",
  "Hobo",
  "Saladoblanco",
  "Medellín",
  "Abejorral",
  "Abriaquí",
  "Alejandría",
  "Amagá",
  "Amalfi",
  "Andes",
  "Angelópolis",
  "Angostura",
  "Anorí",
  "Santa Fé De Antioquia",
  "Anzá",
  "Apartadó",
  "Arboletes",
  "Argelia",
  "Armenia",
  "Barbosa",
  "Belmira",
  "Bello",
  "Betania",
  "Betulia",
  "Ciudad Bolívar",
  "Briceño",
  "Buriticá",
  "Cáceres",
  "Caicedo",
  "Caldas",
  "Campamento",
  "Cañasgordas",
  "Caracolí",
  "Caramanta",
  "Carepa",
  "El Carmen De Viboral",
  "Carolina",
  "",
];

const departamentoOptions = [
  "Huila",
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bogotá D.C.",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
  "",
];

const montoSolicitadoOptions = [
  "½ Smlmv",
  "1 Smlmv",
  "1½ Smlmv",
  "2 Smlmv",
  "2½ Smlmv",
  "3 Smlmv",
  "3½ Smlmv",
  "4 Smlmv",
  "4½ Smlmv",
  "5 Smlmv",
  "5½ Smlmv",
  "6 Smlmv",
  "6½ Smlmv",
  "7 Smlmv",
  "7½ Smlmv",
  "8 Smlmv",
  "8½ Smlmv",
  "9 Smlmv",
  "9½ Smlmv",
  "10 Smlmv",
  "",
];

const modificacionesOptions = ["Si", "No", ""];

const tipoModificacionOptions = [
  "En la facturación",
  "En el recaudo",
  "Normativa",
  "Llegal",
  "Administrativa",
  "Financiera",
  "Control",
  "Operativa",
  "De gestión",
  "En destinación de recursos",
  "",
];

const detalleModificacionOptions = [
  "Fijo",
  "Variable",
  "Porcentual",
  "En factura de energía",
  "En recibo independiente",
  "Otro medio",
  "Directo",
  "A través de tercero",
  "En convenio",
  "Acuerdo municipal",
  "Decreto",
  "Resolución",
  "Sentencia judicial",
  "Cambio de ley",
  "Concepto jurídico",
  "Recaudo",
  "Facturación",
  "Prestación de servicio",
  "Circular",
  "Manual interno",
  "Resolución administrativa",
  "Base de liquidación",
  "Exenciones",
  "Forma de pago",
  "Auditoría",
  "Reporte",
  "Seguimiento interno",
  "Cobro",
  "Registro",
  "Aplicación del impuesto",
  "Planeación",
  "Supervisión",
  "Coordinación",
  "Alumbrado",
  "",
];

const efectoModificacionOptions = [
  "Aumento",
  "Disminución",
  "Eliminación",
  "Adición / Creación",
  "Actualización",
  "Sustitución",
  "Reubicación",
  "Suspensión",
  "Reactivación",
  "",
];

const montoAcordadoOptions = [
  "½ Smlmv",
  "1 Smlmv",
  "1½ Smlmv",
  "2 Smlmv",
  "2½ Smlmv",
  "3 Smlmv",
  "3½ Smlmv",
  "4 Smlmv",
  "4½ Smlmv",
  "5 Smlmv",
  "5½ Smlmv",
  "6 Smlmv",
  "6½ Smlmv",
  "7 Smlmv",
  "7½ Smlmv",
  "8 Smlmv",
  "8½ Smlmv",
  "9 Smlmv",
  "9½ Smlmv",
  "10 Smlmv",
  "",
];

const accionJuridicaRealizadaOptions = [
  "Revisión normativa",
  "Concepto jurídico",
  "Derecho de petición",
  "Requerimiento administrativo",
  "Revisión contractual",
  "Auditoría jurídica",
  "Acción de cumplimiento",
  "Acción de nulidad simple",
  "Acción de nulidad y restablecimiento",
  "Acción popular",
  "Acción contractual",
  "Conciliación prejudicial",
  "Recurso de reposición",
  "Recurso de apelación",
  "Recurso de queja",
  "Recurso extraordinario de revisión",
  "Recurso de reconsideración",
  "Excepción de inconstitucionalidad",
  "Solicitud de revocatoria directa",
  "Incidente de nulidad",
  "Solicitud de aclaración o corrección",
  "Ninguna",
  "",
];

const estadoAccionOptions = [
  "Radicada",
  "En trámite",
  "En revisión",
  "En curso",
  "En traslado",
  "Con requerimiento",
  "Suspendida",
  "Decidida",
  "Favorable",
  "Desfavorable",
  "Archivada",
  "Cumplida",
  "Incumplida",
  "",
];

const estadoPagoOptions = [
  "Pago realizado",
  "Pago pendiente",
  "Pago parcial",
  "Pago en trámite",
  "Pago vencido",
  "",
];

const estadoAcuerdoOptions = [
  "Activo",
  "Inactivo",
  "Vigente",
  "Vencido",
  "Suspendido",
  "Terminado",
  "",
];

export default function SeguimientoAlumbradoTable() {
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

  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows(prev => [
      ...prev,
      {
        id: newId,
        entidad: "",
        nit: "",
        municipio: "",
        departamento: "",
        acuerdoVigente: "",
        anoAcuerdo: "",
        montoSolicitado: "",
        modificaciones: "",
        tipoModificacion: "",
        detalleModificacion: "",
        efectoModificacion: "",
        montoAcordado: "",
        valorMensual: "",
        fechaUltimaModificacion: "",
        accionJuridicaRealizada: "",
        estadoAccion: "",
        fechaAccion: "",
        estadoPago: "",
        estadoAcuerdo: "",
        observacionesJuridicas: "",
      },
    ]);
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
      "Seguimiento Alumbrado"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "seguimiento-alumbrado.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.entidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.nit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.municipio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.departamento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Seguimiento Alumbrado
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por entidad, NIT, municipio o departamento"
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
          <button
            onClick={handleAddRow}
            className="unified-button flex gap-2 items-center justify-center"
          >
            Agregar Fila
          </button>
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
                ENTIDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">NIT</th>
              <th className="p-4 border text-center whitespace-nowrap">
                MUNICIPIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DEPARTAMENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ACUERDO VIGENTE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                AÑO DE ACUERDO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MONTO SOLICITADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MODIFICACIONES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE MODIFICACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DETALLE DE MODIFICACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                EFECTO DE MODIFICACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MONTO ACORDADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR MENSUAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE ULTIMA MODIFICACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ACCIÓN JURÍDICA REALIZADA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO DE LA ACCIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE LA ACCIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO DEL PAGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO DEL ACUERDO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                OBSERVACIONES JURÍDICAS
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-left">
                  <select
                    value={r.entidad}
                    onChange={e =>
                      handleChange(r.id, "entidad", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {entidadOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nit}
                    onChange={e => handleChange(r.id, "nit", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="NIT"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.municipio}
                    onChange={e =>
                      handleChange(r.id, "municipio", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {municipioOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.departamento}
                    onChange={e =>
                      handleChange(r.id, "departamento", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {departamentoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.acuerdoVigente}
                    onChange={e =>
                      handleChange(r.id, "acuerdoVigente", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Acuerdo"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.anoAcuerdo}
                    onChange={e =>
                      handleChange(r.id, "anoAcuerdo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Año"
                    min="2000"
                    max="2100"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.montoSolicitado}
                    onChange={e =>
                      handleChange(r.id, "montoSolicitado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {montoSolicitadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.modificaciones}
                    onChange={e =>
                      handleChange(r.id, "modificaciones", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {modificacionesOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoModificacion}
                    onChange={e =>
                      handleChange(r.id, "tipoModificacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoModificacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.detalleModificacion}
                    onChange={e =>
                      handleChange(r.id, "detalleModificacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {detalleModificacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.efectoModificacion}
                    onChange={e =>
                      handleChange(r.id, "efectoModificacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {efectoModificacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.montoAcordado}
                    onChange={e =>
                      handleChange(r.id, "montoAcordado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {montoAcordadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.valorMensual}
                    onChange={e =>
                      handleChange(r.id, "valorMensual", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Valor mensual"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaUltimaModificacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaUltimaModificacion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.accionJuridicaRealizada}
                    onChange={e =>
                      handleChange(r.id, "accionJuridicaRealizada", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {accionJuridicaRealizadaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estadoAccion}
                    onChange={e =>
                      handleChange(r.id, "estadoAccion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoAccionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaAccion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaAccion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estadoPago}
                    onChange={e =>
                      handleChange(r.id, "estadoPago", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoPagoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estadoAcuerdo}
                    onChange={e =>
                      handleChange(r.id, "estadoAcuerdo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoAcuerdoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <textarea
                    value={r.observacionesJuridicas}
                    onChange={e =>
                      handleChange(r.id, "observacionesJuridicas", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm resize-none"
                    placeholder="Observaciones jurídicas"
                    rows="2"
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

