"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
// Format: 05/01/2023 -> 2023-01-05
const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Helper function to convert date input to date string
// Format: 2023-01-05 -> 05/01/2023
const fromDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// Initial data - first few rows as example
const initialRows = [
  {
    id: 1,
    ano: "2023",
    tipoPersona: "Jurídica",
    asociado: "Si",
    nitCc: "9012600920",
    contratistaProveedor: "CARVAJAL INVERSIONES & NEGOCIOS SAS",
    municipio: "Garzón",
    departamento: "Huila",
    fechaFirma: "05/01/2023",
    tipoFirma: "Física",
    tipoContrato: "Prestación de servicios",
    objetoContrato: "Mantenimiento de equipos tecnológicos",
    fechaInicio: "05/01/2023",
    fechaFin: "31/12/2023",
    duracionDias: "360",
    montoTotalContratado: "11246690",
    montoEjecutado: "",
    diferencia: "-11246690",
    requiereComiteCompras: "No",
    fechaViabilidadComiteCompras: "",
    nroActaComiteCompras: "",
    enteAprobacion: "Gerencia General",
    formaPago: "Pago contra entrega total",
    poliza: "No",
    modificaciones: "No Aplica",
    tipoModificacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    fechaRenovacionInicial: "01/01/2024",
    fechaUltimaRenovacion: "01/01/2025",
    fechaProximaRenovacion: "01/01/2026",
    tiempoPreavisoDias: "30",
    fechaTerminacionNoRenovacion: "31/12/2023",
    estadoPreaviso: "No aplica",
    estadoContrato: "Finalizado",
    supervisor: "Director Tecnologia",
    area: "Subgerencia Innovación Empresarial",
    subarea: "Tecnología",
    fori01: "",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "15/10/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    certificacionPagoParafiscales: "15/10/2025",
    fotocopiaTarjetaRegistro: "No Aplica",
    constanciaAfiliacionFondo: "15/09/2025",
    documentos: "Actualizado",
    observaciones: "",
  },
  {
    id: 2,
    ano: "2023",
    tipoPersona: "Natural",
    asociado: "Si",
    nitCc: "12191161",
    contratistaProveedor: "ALVARO TEJADA TOVAR",
    municipio: "Garzón",
    departamento: "Huila",
    fechaFirma: "04/02/2023",
    tipoFirma: "Física",
    tipoContrato: "Obra o construcción",
    objetoContrato: "Remodelación o adecuación locativa",
    fechaInicio: "04/02/2023",
    fechaFin: "11/03/2023",
    duracionDias: "35",
    montoTotalContratado: "23140000",
    montoEjecutado: "",
    diferencia: "",
    requiereComiteCompras: "Si",
    fechaViabilidadComiteCompras: "01/02/2023",
    nroActaComiteCompras: "1",
    enteAprobacion: "Gerencia General",
    formaPago: "Pago contra entrega total",
    poliza: "No",
    modificaciones: "",
    tipoModificacion: "",
    tipoRenovacion: "",
    fechaRenovacionInicial: "",
    fechaUltimaRenovacion: "",
    fechaProximaRenovacion: "",
    tiempoPreavisoDias: "",
    fechaTerminacionNoRenovacion: "",
    estadoPreaviso: "",
    estadoContrato: "Vigente",
    supervisor: "Subgerencia Innovación Empresarial",
    area: "Subgerencia Innovación Empresarial",
    subarea: "Subgerencia Innovación Empresarial",
    fori01: "",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    certificacionPagoParafiscales: "",
    fotocopiaTarjetaRegistro: "",
    constanciaAfiliacionFondo: "",
    documentos: "",
    observaciones: "",
  },
  {
    id: 3,
    ano: "2023",
    tipoPersona: "Natural",
    asociado: "Si",
    nitCc: "79480687",
    contratistaProveedor: "J.A. SERVICIOS INTEGRALES",
    municipio: "Garzón",
    departamento: "Huila",
    fechaFirma: "01/02/2023",
    tipoFirma: "Electrónica o Digital",
    tipoContrato: "Prestación de servicios",
    objetoContrato: "Mantenimiento de aires acondicionados",
    fechaInicio: "01/02/2023",
    fechaFin: "30/06/2023",
    duracionDias: "149",
    montoTotalContratado: "17004910",
    montoEjecutado: "",
    diferencia: "",
    requiereComiteCompras: "No",
    fechaViabilidadComiteCompras: "",
    nroActaComiteCompras: "",
    enteAprobacion: "",
    formaPago: "",
    poliza: "",
    modificaciones: "",
    tipoModificacion: "",
    tipoRenovacion: "",
    fechaRenovacionInicial: "",
    fechaUltimaRenovacion: "",
    fechaProximaRenovacion: "",
    tiempoPreavisoDias: "",
    fechaTerminacionNoRenovacion: "",
    estadoPreaviso: "",
    estadoContrato: "Vigente",
    supervisor: "Subgerencia Innovación Empresarial",
    area: "Subgerencia Innovación Empresarial",
    subarea: "Subgerencia Innovación Empresarial",
    fori01: "",
    copiaDocumentoIdentidad: "No",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    certificacionPagoParafiscales: "",
    fotocopiaTarjetaRegistro: "No Aplica",
    constanciaAfiliacionFondo: "",
    documentos: "",
    observaciones: "",
  },
  {
    id: 4,
    ano: "2023",
    tipoPersona: "",
    asociado: "",
    nitCc: "",
    contratistaProveedor: "RADIO CADENA NACIONAL S.A.S.",
    municipio: "",
    departamento: "",
    fechaFirma: "",
    tipoFirma: "",
    tipoContrato: "",
    objetoContrato: "",
    fechaInicio: "",
    fechaFin: "",
    duracionDias: "0",
    montoTotalContratado: "44000000",
    montoEjecutado: "",
    diferencia: "",
    requiereComiteCompras: "Si",
    fechaViabilidadComiteCompras: "02/03/2023",
    nroActaComiteCompras: "4",
    enteAprobacion: "Gerencia General",
    formaPago: "Pago mensual vencido",
    poliza: "No",
    modificaciones: "No",
    tipoModificacion: "",
    tipoRenovacion: "",
    fechaRenovacionInicial: "",
    fechaUltimaRenovacion: "",
    fechaProximaRenovacion: "",
    tiempoPreavisoDias: "",
    fechaTerminacionNoRenovacion: "",
    estadoPreaviso: "",
    estadoContrato: "Vigente",
    supervisor: "",
    area: "",
    subarea: "",
    fori01: "",
    copiaDocumentoIdentidad: "No",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    certificacionPagoParafiscales: "",
    fotocopiaTarjetaRegistro: "No Aplica",
    constanciaAfiliacionFondo: "",
    documentos: "",
    observaciones: "",
  },
  {
    id: 5,
    ano: "2023",
    tipoPersona: "Jurídica",
    asociado: "Si",
    nitCc: "900271394",
    contratistaProveedor: "LIAN BPO S.A.S.",
    municipio: "Neiva",
    departamento: "Huila",
    fechaFirma: "28/03/2023",
    tipoFirma: "Física",
    tipoContrato: "Prestación de servicios",
    objetoContrato: "Estudio de Mercado",
    fechaInicio: "28/03/2023",
    fechaFin: "27/09/2023",
    duracionDias: "183",
    montoTotalContratado: "78858265",
    montoEjecutado: "",
    diferencia: "",
    requiereComiteCompras: "Si",
    fechaViabilidadComiteCompras: "22/03/2023",
    nroActaComiteCompras: "6",
    enteAprobacion: "Gerencia General",
    formaPago: "Pago mensual vencido",
    poliza: "Si",
    modificaciones: "",
    tipoModificacion: "",
    tipoRenovacion: "",
    fechaRenovacionInicial: "",
    fechaUltimaRenovacion: "",
    fechaProximaRenovacion: "",
    tiempoPreavisoDias: "",
    fechaTerminacionNoRenovacion: "",
    estadoPreaviso: "",
    estadoContrato: "Vigente",
    supervisor: "Coordinador Mercadeo",
    area: "Subgerencia Comercial",
    subarea: "Mercadeo",
    fori01: "",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    certificacionPagoParafiscales: "",
    fotocopiaTarjetaRegistro: "No Aplica",
    constanciaAfiliacionFondo: "",
    documentos: "",
    observaciones: "",
  },
  {
    id: 6,
    ano: "2023",
    tipoPersona: "Natural",
    asociado: "Si",
    nitCc: "1077875729",
    contratistaProveedor: "JUAN CAMILO DIAZ LOSADA",
    municipio: "Garzón",
    departamento: "Huila",
    fechaFirma: "15/03/2023",
    tipoFirma: "Electrónica o Digital",
    tipoContrato: "Prestación de servicios",
    objetoContrato: "Software y licencias",
    fechaInicio: "15/03/2023",
    fechaFin: "14/10/2023",
    duracionDias: "213",
    montoTotalContratado: "4500000",
    montoEjecutado: "",
    diferencia: "",
    requiereComiteCompras: "No",
    fechaViabilidadComiteCompras: "",
    nroActaComiteCompras: "",
    enteAprobacion: "",
    formaPago: "",
    poliza: "",
    modificaciones: "",
    tipoModificacion: "",
    tipoRenovacion: "",
    fechaRenovacionInicial: "",
    fechaUltimaRenovacion: "",
    fechaProximaRenovacion: "",
    tiempoPreavisoDias: "",
    fechaTerminacionNoRenovacion: "",
    estadoPreaviso: "",
    estadoContrato: "Vigente",
    supervisor: "",
    area: "",
    subarea: "",
    fori01: "",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    certificacionPagoParafiscales: "",
    fotocopiaTarjetaRegistro: "No Aplica",
    constanciaAfiliacionFondo: "",
    documentos: "",
    observaciones: "",
  },
  {
    id: 7,
    ano: "2023",
    tipoPersona: "Jurídica",
    asociado: "No",
    nitCc: "800058607",
    contratistaProveedor: "CONTROLES EMPRESARIALES S.A.S.",
    municipio: "Bogotá D.C.",
    departamento: "Cundinamarca",
    fechaFirma: "30/03/2023",
    tipoFirma: "Electrónica o Digital",
    tipoContrato: "Compra",
    objetoContrato: "Equipos de cómputo y periféricos",
    fechaInicio: "30/03/2023",
    fechaFin: "13/04/2023",
    duracionDias: "14",
    montoTotalContratado: "87302100",
    montoEjecutado: "",
    diferencia: "",
    requiereComiteCompras: "Si",
    fechaViabilidadComiteCompras: "15/03/2023",
    nroActaComiteCompras: "5",
    enteAprobacion: "Gerencia General",
    formaPago: "Pago contra entrega total",
    poliza: "No",
    modificaciones: "",
    tipoModificacion: "",
    tipoRenovacion: "",
    fechaRenovacionInicial: "",
    fechaUltimaRenovacion: "",
    fechaProximaRenovacion: "",
    tiempoPreavisoDias: "",
    fechaTerminacionNoRenovacion: "",
    estadoPreaviso: "",
    estadoContrato: "Vigente",
    supervisor: "Director Tecnologia",
    area: "Subgerencia Innovación Empresarial",
    subarea: "Tecnología",
    fori01: "",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    certificacionPagoParafiscales: "",
    fotocopiaTarjetaRegistro: "No Aplica",
    constanciaAfiliacionFondo: "",
    documentos: "",
    observaciones: "",
  },
  {
    id: 8,
    ano: "2023",
    tipoPersona: "Jurídica",
    asociado: "No",
    nitCc: "12191161",
    contratistaProveedor: "ALVARO TEJADA TOVAR",
    municipio: "Garzón",
    departamento: "Huila",
    fechaFirma: "25/03/2023",
    tipoFirma: "Física",
    tipoContrato: "Obra o construcción",
    objetoContrato: "Remodelación o adecuación locativa",
    fechaInicio: "25/03/2023",
    fechaFin: "25/05/2023",
    duracionDias: "61",
    montoTotalContratado: "46775000",
    montoEjecutado: "",
    diferencia: "",
    requiereComiteCompras: "Si",
    fechaViabilidadComiteCompras: "01/02/2023",
    nroActaComiteCompras: "1",
    enteAprobacion: "Gerencia General",
    formaPago: "Pago contra entrega total",
    poliza: "No",
    modificaciones: "",
    tipoModificacion: "",
    tipoRenovacion: "",
    fechaRenovacionInicial: "",
    fechaUltimaRenovacion: "",
    fechaProximaRenovacion: "",
    tiempoPreavisoDias: "",
    fechaTerminacionNoRenovacion: "",
    estadoPreaviso: "",
    estadoContrato: "Vigente",
    supervisor: "",
    area: "",
    subarea: "",
    fori01: "",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    certificacionPagoParafiscales: "",
    fotocopiaTarjetaRegistro: "No Aplica",
    constanciaAfiliacionFondo: "",
    documentos: "",
    observaciones: "",
  },
  {
    id: 9,
    ano: "2023",
    tipoPersona: "Jurídica",
    asociado: "No",
    nitCc: "900292966",
    contratistaProveedor: "DISTRIBUIDORA Y MAYORISTA DE COMPUTADORES-DISMACOM",
    municipio: "Neiva",
    departamento: "Huila",
    fechaFirma: "07/03/2023",
    tipoFirma: "Electrónica o Digital",
    tipoContrato: "Compra",
    objetoContrato: "Equipos de cómputo y periféricos",
    fechaInicio: "07/03/2023",
    fechaFin: "15/12/2023",
    duracionDias: "283",
    montoTotalContratado: "18864789",
    montoEjecutado: "",
    diferencia: "",
    requiereComiteCompras: "No",
    fechaViabilidadComiteCompras: "",
    nroActaComiteCompras: "",
    enteAprobacion: "Gerencia General",
    formaPago: "Anticipo parcial",
    poliza: "Si",
    modificaciones: "",
    tipoModificacion: "",
    tipoRenovacion: "",
    fechaRenovacionInicial: "",
    fechaUltimaRenovacion: "",
    fechaProximaRenovacion: "",
    tiempoPreavisoDias: "",
    fechaTerminacionNoRenovacion: "",
    estadoPreaviso: "",
    estadoContrato: "Vigente",
    supervisor: "Director Tecnologia",
    area: "Subgerencia Innovación Empresarial",
    subarea: "Tecnología",
    fori01: "",
    copiaDocumentoIdentidad: "No",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    certificacionPagoParafiscales: "",
    fotocopiaTarjetaRegistro: "No Aplica",
    constanciaAfiliacionFondo: "",
    documentos: "",
    observaciones: "",
  },
];

// Options for dropdowns
const tipoPersonaOptions = ["Natural", "Jurídica", ""];

const asociadoOptions = ["Si", "No", ""];

const municipioOptions = [
  "Garzón",
  "Neiva",
  "Bogotá D.C.",
  "Medellín",
  "Sabaneta",
  "Circasia",
  "Ibagué",
  "",
];

const departamentoOptions = [
  "Huila",
  "Cundinamarca",
  "Antioquia",
  "Quindío",
  "Tolima",
  "",
];

const tipoFirmaOptions = ["Física", "Electrónica o Digital"];

const tipoContratoOptions = [
  "Prestación de servicios",
  "Obra o construcción",
  "Compra",
  "Suministro",
];

const objetoContratoOptions = [
  "Mantenimiento de equipos tecnológicos",
  "Remodelación o adecuación locativa",
  "Mantenimiento de aires acondicionados",
  "Estudio de Mercado",
  "Software y licencias",
  "Equipos de cómputo y periféricos",
  "Servicios de aseo y cafetería",
  "Papelería y útiles de oficina",
  "Elementos de aseo",
  "Consultoría tecnológica / digital",
  "Mantenimiento Sistemas de Seguridad",
  "Consultoría financiera o contable",
  "Mobiliario y enseres",
  "Dotaciones institucionales",
  "",
];

const requiereComiteComprasOptions = ["Si", "No"];

const enteAprobacionOptions = [
  "Gerencia General",
  "Comité de Compras",
];

const formaPagoOptions = [
  "Pago contra entrega total",
  "Pago mensual vencido",
  "Anticipo parcial",
  "Pago según cronograma",
  "Pago único final",
];

const polizaOptions = ["Si", "No", "No Aplica"];

const modificacionesOptions = ["Si", "No", "No Aplica"];

const tipoModificacionOptions = [""];

const tipoRenovacionOptions = [
  "Renovación expresa (por otro sí o documento formal)",
  "Renovación automática",
  "",
];

const estadoPreavisoOptions = ["No aplica", "Renovado", "Por vencer", ""];

const estadoContratoOptions = ["Vigente", "Finalizado", "Vencido", "Terminado"];

const supervisorOptions = [
  "Director Tecnologia",
  "Subgerencia Innovación Empresarial",
  "Coordinador Mercadeo",
  "Coordinador Talento y Cultura",
  "Auxiliar SST",
  "Director Contabilidad",
  "Subgerente Financiero",
  "",
];

const areaOptions = [
  "Subgerencia Innovación Empresarial",
  "Subgerencia Comercial",
  "Subgerencia Financiera",
  "",
];

const subareaOptions = [
  "Tecnología",
  "Mercadeo",
  "Talento y Cultura",
  "Contabilidad",
  "Subgerencia Financiera",
  "",
];

const copiaDocumentoIdentidadOptions = ["Si", "No"];

const consultaEfectivaOptions = ["Si", "No", "No Aplica"];

const fotocopiaTarjetaRegistroOptions = ["Si", "No", "No Aplica"];

const documentosOptions = ["Actualizado", "Desactualizado", "Pendiente", ""];

export default function ControlContratosTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (id, field, value) => {
    // Calculate diferencia if montoTotalContratado or montoEjecutado changes
    if (field === "montoTotalContratado" || field === "montoEjecutado") {
      const row = rows.find(r => r.id === id);
      const total = field === "montoTotalContratado" ? value : row.montoTotalContratado;
      const ejecutado = field === "montoEjecutado" ? value : row.montoEjecutado;
      const diferencia = total && ejecutado ? (parseFloat(ejecutado) - parseFloat(total)).toString() : "";
      
      setRows(prev =>
        prev.map(row => {
          if (row.id === id) {
            const updated = { ...row, [field]: value, diferencia };
            return updated;
          }
          return row;
        })
      );
    } else {
      setRows(prev =>
        prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
      );
    }

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
        ano: "",
        tipoPersona: "",
        asociado: "",
        nitCc: "",
        contratistaProveedor: "",
        municipio: "",
        departamento: "",
        fechaFirma: "",
        tipoFirma: "",
        tipoContrato: "",
        objetoContrato: "",
        fechaInicio: "",
        fechaFin: "",
        duracionDias: "",
        montoTotalContratado: "",
        montoEjecutado: "",
        diferencia: "",
        requiereComiteCompras: "",
        fechaViabilidadComiteCompras: "",
        nroActaComiteCompras: "",
        enteAprobacion: "",
        formaPago: "",
        poliza: "",
        modificaciones: "",
        tipoModificacion: "",
        tipoRenovacion: "",
        fechaRenovacionInicial: "",
        fechaUltimaRenovacion: "",
        fechaProximaRenovacion: "",
        tiempoPreavisoDias: "",
        fechaTerminacionNoRenovacion: "",
        estadoPreaviso: "",
        estadoContrato: "",
        supervisor: "",
        area: "",
        subarea: "",
        fori01: "",
        copiaDocumentoIdentidad: "",
        rut: "",
        certificadoCamaraComercio: "",
        fechaCamaraComercio: "",
        consultaEfectiva: "",
        certificacionBancaria: "",
        certificadoLibertadTradicion: "",
        certificacionPagoParafiscales: "",
        fotocopiaTarjetaRegistro: "",
        constanciaAfiliacionFondo: "",
        documentos: "",
        observaciones: "",
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
      "Control Contratos"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "control-contratos.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.contratistaProveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.nitCc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.municipio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.objetoContrato?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Control de Contratos
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por contratista, NIT/CC, municipio u objeto"
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
              <th className="p-4 border text-center whitespace-nowrap">AÑO</th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE PERSONA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ASOCIADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NIT/CC
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CONTRATISTA/PROVEEDOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MUNICIPIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DEPARTAMENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA FIRMA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE FIRMA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO CONTRATO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                OBJETO CONTRATO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA INICIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA FIN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DURACIÓN (DÍAS)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MONTO TOTAL CONTRATADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MONTO EJECUTADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DIFERENCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                REQUIERE COMITÉ DE COMPRAS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA VIABILIDAD COMITÉ DE COMPRAS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NRO. ACTA COMITÉ DE COMPRAS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ENTE DE APROBACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FORMA DE PAGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                PÓLIZA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MODIFICACIONES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE MODIFICACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE RENOVACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA RENOVACIÓN INICIAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA ÚLTIMA RENOVACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA PRÓXIMA RENOVACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIEMPO DEL PREAVISO (DÍAS)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE TERMINACIÓN O NO RENOVACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO DEL PREAVISO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO DEL CONTRATO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                SUPERVISOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">ÁREA</th>
              <th className="p-4 border text-center whitespace-nowrap">
                SUBÁREA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FORI-01
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                COPIA DOCUMENTO IDENTIDAD
              </th>
              <th className="p-4 border text-center whitespace-nowrap">RUT</th>
              <th className="p-4 border text-center whitespace-nowrap">
                CERTIFICADO CÁMARA DE COMERCIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA CÁMARA DE COMERCIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CONSULTA EFECTIVA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CERTIFICACIÓN BANCARIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CERTIFICADO LIBERTAD Y TRADICIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CERTIFICACIÓN DE PAGO AL DÍA DE PARAFISCALES Y/O SEGURIDAD SOCIAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FOTOCOPIA DE TARJETA O REGISTRO PROFESIONAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CONSTANCIA DE AFILIACIÓN A FONDO DE PENSIONES O PLANILLA DE PAGO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DOCUMENTOS
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                OBSERVACIONES
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.ano}
                    onChange={e => handleChange(r.id, "ano", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Año"
                    min="2000"
                    max="2100"
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
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.asociado}
                    onChange={e =>
                      handleChange(r.id, "asociado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {asociadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nitCc}
                    onChange={e => handleChange(r.id, "nitCc", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="NIT/CC"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.contratistaProveedor}
                    onChange={e =>
                      handleChange(r.id, "contratistaProveedor", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Contratista/Proveedor"
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
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaFirma)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaFirma",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoFirma}
                    onChange={e =>
                      handleChange(r.id, "tipoFirma", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoFirmaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoContrato}
                    onChange={e =>
                      handleChange(r.id, "tipoContrato", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoContratoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.objetoContrato}
                    onChange={e =>
                      handleChange(r.id, "objetoContrato", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {objetoContratoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaInicio)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaInicio",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaFin)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaFin",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.duracionDias}
                    onChange={e =>
                      handleChange(r.id, "duracionDias", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Días"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.montoTotalContratado}
                    onChange={e =>
                      handleChange(r.id, "montoTotalContratado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Monto total"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.montoEjecutado}
                    onChange={e =>
                      handleChange(r.id, "montoEjecutado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Monto ejecutado"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.diferencia}
                    readOnly
                    className="w-full border-none outline-none bg-transparent text-sm bg-gray-100"
                    placeholder="Diferencia (calculado)"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.requiereComiteCompras}
                    onChange={e =>
                      handleChange(r.id, "requiereComiteCompras", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {requiereComiteComprasOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaViabilidadComiteCompras)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaViabilidadComiteCompras",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.nroActaComiteCompras}
                    onChange={e =>
                      handleChange(r.id, "nroActaComiteCompras", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Nro. Acta"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.enteAprobacion}
                    onChange={e =>
                      handleChange(r.id, "enteAprobacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {enteAprobacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.formaPago}
                    onChange={e =>
                      handleChange(r.id, "formaPago", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {formaPagoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.poliza}
                    onChange={e => handleChange(r.id, "poliza", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {polizaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
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
                        {opcion}
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
                    value={r.tipoRenovacion}
                    onChange={e =>
                      handleChange(r.id, "tipoRenovacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoRenovacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaRenovacionInicial)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaRenovacionInicial",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaUltimaRenovacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaUltimaRenovacion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaProximaRenovacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaProximaRenovacion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="number"
                    value={r.tiempoPreavisoDias}
                    onChange={e =>
                      handleChange(r.id, "tiempoPreavisoDias", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Días"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaTerminacionNoRenovacion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaTerminacionNoRenovacion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estadoPreaviso}
                    onChange={e =>
                      handleChange(r.id, "estadoPreaviso", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoPreavisoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estadoContrato}
                    onChange={e =>
                      handleChange(r.id, "estadoContrato", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoContratoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.supervisor}
                    onChange={e =>
                      handleChange(r.id, "supervisor", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {supervisorOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.area}
                    onChange={e => handleChange(r.id, "area", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {areaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.subarea}
                    onChange={e =>
                      handleChange(r.id, "subarea", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {subareaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fori01)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fori01",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.copiaDocumentoIdentidad}
                    onChange={e =>
                      handleChange(r.id, "copiaDocumentoIdentidad", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {copiaDocumentoIdentidadOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.rut}
                    onChange={e => handleChange(r.id, "rut", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="RUT"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.certificadoCamaraComercio}
                    onChange={e =>
                      handleChange(r.id, "certificadoCamaraComercio", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Certificado"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaCamaraComercio)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaCamaraComercio",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.consultaEfectiva}
                    onChange={e =>
                      handleChange(r.id, "consultaEfectiva", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {consultaEfectivaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.certificacionBancaria)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "certificacionBancaria",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.certificadoLibertadTradicion)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "certificadoLibertadTradicion",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.certificacionPagoParafiscales)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "certificacionPagoParafiscales",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.fotocopiaTarjetaRegistro}
                    onChange={e =>
                      handleChange(r.id, "fotocopiaTarjetaRegistro", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {fotocopiaTarjetaRegistroOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.constanciaAfiliacionFondo)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "constanciaAfiliacionFondo",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.documentos}
                    onChange={e =>
                      handleChange(r.id, "documentos", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {documentosOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <textarea
                    value={r.observaciones}
                    onChange={e =>
                      handleChange(r.id, "observaciones", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm resize-none"
                    placeholder="Observaciones"
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

