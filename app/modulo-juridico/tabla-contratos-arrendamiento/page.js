"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
// Format: 01/08/2020 -> 2020-08-01
const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Helper function to convert date input to date string
// Format: 2020-08-01 -> 01/08/2020
const fromDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// Initial data
const initialRows = [
  {
    id: 1,
    municipioOficina: "Guadalupe",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "83056760",
    nombre: "Rodrigo Olave Manchola",
    direccion: "Carrera 72 B Nro. 121 80 AP 1702",
    telefonoCelular: "3148143650",
    email: "ing_rodrigo_olave@hotmail.com",
    municipioArrendador: "Bogotá, D.C.",
    departamentoArrendador: "Cundinamarca",
    asociado: "Si",
    fechaFirma: "01/08/2020",
    tipoFirma: "Física",
    fechaInicio: "01/08/2015",
    fechaFin: "31/07/2020",
    duracionAnos: "5",
    fechaRenovacionInicial: "01/08/2020",
    fechaUltimaRenovacion: "01/08/2025",
    fechaProximaRenovacion: "01/08/2026",
    precioCanonInicialmentePactado: "1430000",
    precioCanonActual: "3290656",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "01/08/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "30",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "15/10/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "",
  },
  {
    id: 2,
    municipioOficina: "Acevedo",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "83180128",
    nombre: "Irne Rojas Duarte",
    direccion: "Calle 19 Nro, 46 80 Conjunto Alto Llano",
    telefonoCelular: "3188590513",
    email: "iard1751@gmail.com",
    municipioArrendador: "Neiva",
    departamentoArrendador: "Huila",
    asociado: "Si",
    fechaFirma: "31/03/2023",
    tipoFirma: "Física",
    fechaInicio: "01/04/2022",
    fechaFin: "31/03/2027",
    duracionAnos: "5",
    fechaRenovacionInicial: "01/04/2027",
    fechaUltimaRenovacion: "No aplica",
    fechaProximaRenovacion: "31/03/2027",
    precioCanonInicialmentePactado: "2930000",
    precioCanonActual: "3619302",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "01/04/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "24/10/2023",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "08/08/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "15/12/2023",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "",
  },
  {
    id: 3,
    municipioOficina: "Tarqui",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "26577778",
    nombre: "María Teresa Joven",
    direccion: "Calle 3 Nro. 9 21",
    telefonoCelular: "3114403315",
    email: "terejomar@hotmail.com",
    municipioArrendador: "Tarqui",
    departamentoArrendador: "Huila",
    asociado: "Si",
    fechaFirma: "01/10/2010",
    tipoFirma: "Física",
    fechaInicio: "01/10/2010",
    fechaFin: "31/10/2011",
    duracionAnos: "1",
    fechaRenovacionInicial: "01/11/2011",
    fechaUltimaRenovacion: "01/11/2025",
    fechaProximaRenovacion: "01/11/2026",
    precioCanonInicialmentePactado: "1200000",
    precioCanonActual: "2321000",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "01/10/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "30",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "24/01/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "23/01/2025",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "",
  },
  {
    id: 4,
    municipioOficina: "La Plata",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "26519939",
    nombre: "María Dolores Casanova Valenzuela",
    direccion: "Calle 3 Nro. 4 79",
    telefonoCelular: "3114733411",
    email: "jadizortiz9@gmail.com",
    municipioArrendador: "La Plata",
    departamentoArrendador: "Huila",
    asociado: "Si",
    fechaFirma: "01/04/2023",
    tipoFirma: "Física",
    fechaInicio: "01/04/2023",
    fechaFin: "31/05/2026",
    duracionAnos: "3",
    fechaRenovacionInicial: "01/06/2026",
    fechaUltimaRenovacion: "No aplica",
    fechaProximaRenovacion: "31/05/2026",
    precioCanonInicialmentePactado: "3900935",
    precioCanonActual: "4483518",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "01/04/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "07/09/2023",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "30/07/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "07/02/2023",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "22/02/2017",
  },
  {
    id: 5,
    municipioOficina: "Pitalito",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "12228406",
    nombre: "Jairo Hernán Quintero Cuéllar",
    direccion: "Calle 10 Sur Nro. 5 39",
    telefonoCelular: "3114828452",
    email: "jairoh_quintero@yahoo.com",
    municipioArrendador: "Pitalito",
    departamentoArrendador: "Huila",
    asociado: "No",
    fechaFirma: "02/01/2024",
    tipoFirma: "Física",
    fechaInicio: "02/01/2024",
    fechaFin: "01/01/2029",
    duracionAnos: "5",
    fechaRenovacionInicial: "02/01/2029",
    fechaUltimaRenovacion: "No aplica",
    fechaProximaRenovacion: "01/01/2029",
    precioCanonInicialmentePactado: "6800000",
    precioCanonActual: "7153600",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "02/01/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "27/01/2024",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "30/07/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "26/04/2024",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "Se realiza el pago a los 5 herederos por proceso de sucesión",
  },
  {
    id: 6,
    municipioOficina: "Suaza",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "26573381",
    nombre: "Diocelina Isabel Cabrera Losada",
    direccion: "Calle 7 Nro. 3 13",
    telefonoCelular: "3132278222",
    email: "No registra",
    municipioArrendador: "Suaza",
    departamentoArrendador: "Huila",
    asociado: "Si",
    fechaFirma: "22/08/2022",
    tipoFirma: "Física",
    fechaInicio: "01/09/2022",
    fechaFin: "31/08/2025",
    duracionAnos: "3",
    fechaRenovacionInicial: "01/09/2025",
    fechaUltimaRenovacion: "01/09/2025",
    fechaProximaRenovacion: "01/09/2026",
    precioCanonInicialmentePactado: "1050000",
    precioCanonActual: "2016000",
    incrementoAnualAcordado: "IPC aprox. Cifra mil",
    fechaAjusteIpcProxima: "01/09/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "15/12/2023",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "05/07/2024",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "15/12/2023",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "",
  },
  {
    id: 7,
    municipioOficina: "La Argentina",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "55068325",
    nombre: "María Isabel Palechor Quintero",
    direccion: "Calle 6 Sur Nro. 15 13",
    telefonoCelular: "3112329158",
    email: "mariaisapalechor@gmailcom",
    municipioArrendador: "Garzón",
    departamentoArrendador: "Huila",
    asociado: "Si",
    fechaFirma: "12/04/2024",
    tipoFirma: "Física",
    fechaInicio: "12/04/2024",
    fechaFin: "11/04/2029",
    duracionAnos: "5",
    fechaRenovacionInicial: "12/04/2029",
    fechaUltimaRenovacion: "No aplica",
    fechaProximaRenovacion: "11/04/2029",
    precioCanonInicialmentePactado: "3355000",
    precioCanonActual: "3529500",
    incrementoAnualAcordado: "IPC aprox. Cifra mil",
    fechaAjusteIpcProxima: "12/04/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "26/03/2024",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "30/07/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "03/04/2024",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "01/04/2024",
  },
  {
    id: 8,
    municipioOficina: "Neiva",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "12141693",
    nombre: "César Augusto Quintero Nuñoz",
    direccion: "Carerra 3 Nro. 4 43 Piso 3",
    telefonoCelular: "3212202169",
    email: "cesaraquintero@gmail.com",
    municipioArrendador: "Pitalito",
    departamentoArrendador: "Huila",
    asociado: "No",
    fechaFirma: "01/12/2015",
    tipoFirma: "Física",
    fechaInicio: "01/12/2015",
    fechaFin: "30/11/2020",
    duracionAnos: "5",
    fechaRenovacionInicial: "01/12/2020",
    fechaUltimaRenovacion: "01/12/2024",
    fechaProximaRenovacion: "01/12/2025",
    precioCanonInicialmentePactado: "4787000",
    precioCanonActual: "9747703",
    incrementoAnualAcordado: "IPC + 3 ptos. IVA.",
    fechaAjusteIpcProxima: "01/12/2025",
    estadoIpc: "Pendiente por ajustar",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación automática",
    tiempoPreavisoDias: "90",
    estadoPreaviso: "Por vencer",
    estadoContrato: "Vigente",
    fori01: "29/04/2024",
    copiaDocumentoIdentidad: "No",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "16/05/2024",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "05/06/2021",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "25/04/2024",
  },
  {
    id: 9,
    municipioOficina: "Rivera",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "19363155",
    nombre: "Críspulo Augusto Vega Martínez",
    direccion: "Calle 4 Nro. 8 50 Segundo Piso",
    telefonoCelular: "3232428913",
    email: "vegaarizaltda@hotmail.com",
    municipioArrendador: "Rivera",
    departamentoArrendador: "Huila",
    asociado: "Si",
    fechaFirma: "01/04/2019",
    tipoFirma: "Física",
    fechaInicio: "01/04/2019",
    fechaFin: "30/04/2022",
    duracionAnos: "3",
    fechaRenovacionInicial: "01/05/2022",
    fechaUltimaRenovacion: "01/05/2025",
    fechaProximaRenovacion: "01/05/2026",
    precioCanonInicialmentePactado: "1600000",
    precioCanonActual: "2319000",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "01/04/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "29/12/2023",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "08/01/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "16/03/2023",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "",
  },
  {
    id: 10,
    municipioOficina: "Hobo",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "26512078",
    nombre: "Amparo Ninco Lara",
    direccion: "Calle 6 Nro. 10 01 Las Mercedes",
    telefonoCelular: "3103419846",
    email: "elcampesino01@hotmail.com",
    municipioArrendador: "Hobo",
    departamentoArrendador: "Huila",
    asociado: "Si",
    fechaFirma: "08/08/2012",
    tipoFirma: "Física",
    fechaInicio: "01/09/2012",
    fechaFin: "31/08/2017",
    duracionAnos: "5",
    fechaRenovacionInicial: "01/09/2017",
    fechaUltimaRenovacion: "01/09/2025",
    fechaProximaRenovacion: "01/09/2026",
    precioCanonInicialmentePactado: "950000",
    precioCanonActual: "3013974",
    incrementoAnualAcordado: "10% + IVA",
    fechaAjusteIpcProxima: "01/09/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación automática",
    tiempoPreavisoDias: "90",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "06/05/2024",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "27/01/2023",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "06/05/2024",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "13/05/2024",
  },
  {
    id: 11,
    municipioOficina: "Iquira",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "26515438",
    nombre: "Carmenza Polanía Farfán",
    direccion: "Carerra 12 A Nro. 11 Sur 13",
    telefonoCelular: "3132856657",
    email: "carmenza-p@hotmail.com",
    municipioArrendador: "Bogotá, D.C.",
    departamentoArrendador: "Cundinamarca",
    asociado: "Si",
    fechaFirma: "30/11/2022",
    tipoFirma: "Física",
    fechaInicio: "01/12/2022",
    fechaFin: "30/11/2027",
    duracionAnos: "5",
    fechaRenovacionInicial: "01/12/2027",
    fechaUltimaRenovacion: "No aplica",
    fechaProximaRenovacion: "30/11/2027",
    precioCanonInicialmentePactado: "1597500",
    precioCanonActual: "2078000",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "01/12/2025",
    estadoIpc: "Pendiente por ajustar",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "26/03/2024",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "30/07/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "07/05/2024",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "14/03/2022",
  },
  {
    id: 12,
    municipioOficina: "Saladoblanco",
    departamentoOficina: "Huila",
    tipoPersona: "Natural",
    documento: "83028213",
    nombre: "Raúl Artunduaga Flórez",
    direccion: "Calle 2 Nro. 3 164 Centro",
    telefonoCelular: "3214055545",
    email: "rarflo@hotmail.com",
    municipioArrendador: "Saladoblanco",
    departamentoArrendador: "Huila",
    asociado: "Si",
    fechaFirma: "01/05/2014",
    tipoFirma: "Física",
    fechaInicio: "01/05/2014",
    fechaFin: "30/04/2019",
    duracionAnos: "5",
    fechaRenovacionInicial: "01/05/2019",
    fechaUltimaRenovacion: "01/05/2025",
    fechaProximaRenovacion: "01/05/2026",
    precioCanonInicialmentePactado: "1100000",
    precioCanonActual: "1200000",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "01/05/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación automática",
    tiempoPreavisoDias: "180",
    estadoPreaviso: "Por vencer",
    estadoContrato: "Vigente",
    fori01: "15/12/2023",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "01/06/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "08/02/2025",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "04/12/2023",
  },
  {
    id: 13,
    municipioOficina: "Espinal",
    departamentoOficina: "Tolima",
    tipoPersona: "Jurídica",
    documento: "890706246",
    nombre: "Forero & Olaya Limitada",
    direccion: "Calle 11 Nro.  4 26",
    telefonoCelular: "3108181663",
    email: "olimpicaespinal@hotmail.com",
    municipioArrendador: "Espinal",
    departamentoArrendador: "Tolima",
    asociado: "No",
    fechaFirma: "30/11/2020",
    tipoFirma: "Física",
    fechaInicio: "01/12/2020",
    fechaFin: "31/12/2023",
    duracionAnos: "3",
    fechaRenovacionInicial: "01/01/2024",
    fechaUltimaRenovacion: "01/01/2025",
    fechaProximaRenovacion: "01/01/2026",
    precioCanonInicialmentePactado: "2500000",
    precioCanonActual: "4087018",
    incrementoAnualAcordado: "IVA",
    fechaAjusteIpcProxima: "01/12/2025",
    estadoIpc: "Pendiente por ajustar",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación automática",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Por vencer",
    estadoContrato: "Vigente",
    fori01: "13/03/2024",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "21/02/2025",
    consultaEfectiva: "Si",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "18/03/2023",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "25/03/2025",
  },
  {
    id: 14,
    municipioOficina: "Planadas",
    departamentoOficina: "Tolima",
    tipoPersona: "Natural",
    documento: "14257788",
    nombre: "Libardo Bustos Rojas",
    direccion: " Calle 7 Nro. 14 45",
    telefonoCelular: "3102437320",
    email: "mundodelosanimalessas@gmail.com",
    municipioArrendador: "Planadas",
    departamentoArrendador: "Tolima",
    asociado: "Si",
    fechaFirma: "02/01/2025",
    tipoFirma: "Física",
    fechaInicio: "02/01/2025",
    fechaFin: "01/01/2027",
    duracionAnos: "2",
    fechaRenovacionInicial: "02/01/2027",
    fechaUltimaRenovacion: "No aplica",
    fechaProximaRenovacion: "01/01/2027",
    precioCanonInicialmentePactado: "2261000",
    precioCanonActual: "2261000",
    incrementoAnualAcordado: "IPC + 2 ptos. IVA.",
    fechaAjusteIpcProxima: "02/01/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "14/04/2025",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "20/08/2022",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "14/04/2025",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "",
  },
  {
    id: 15,
    municipioOficina: "Florencia",
    departamentoOficina: "Caquetá",
    tipoPersona: "Natural",
    documento: "26627792",
    nombre: "María Lucila Carvajal De Urrego",
    direccion: "Carrera 12 Nro. 13 - 16",
    telefonoCelular: "3136599667",
    email: "No registra",
    municipioArrendador: "Florencia",
    departamentoArrendador: "Caquetá",
    asociado: "Si",
    fechaFirma: "05/11/2022",
    tipoFirma: "Física",
    fechaInicio: "01/11/2022",
    fechaFin: "31/10/2027",
    duracionAnos: "5",
    fechaRenovacionInicial: "01/11/2027",
    fechaUltimaRenovacion: "No aplica",
    fechaProximaRenovacion: "31/10/2027",
    precioCanonInicialmentePactado: "8000000",
    precioCanonActual: "9890000",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "01/11/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "18/12/2024",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "09/07/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "28/01/2023",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "Arrendadora Fallecida - Pte. Iniciar Proceso de Sucesión",
  },
  {
    id: 16,
    municipioOficina: "Chaparral",
    departamentoOficina: "Tolima",
    tipoPersona: "Natural",
    documento: "28683549",
    nombre: "Martha Cecilia González Cortés",
    direccion: "Carrera 9 Nro. 7 21",
    telefonoCelular: "3186506339 - 3147939422",
    email: "copicentro1@hotmail.com",
    municipioArrendador: "Chaparral",
    departamentoArrendador: "Tolima",
    asociado: "Si",
    fechaFirma: "01/06/2022",
    tipoFirma: "Física",
    fechaInicio: "01/06/2022",
    fechaFin: "31/07/2027",
    duracionAnos: "5",
    fechaRenovacionInicial: "01/08/2027",
    fechaUltimaRenovacion: "No aplica",
    fechaProximaRenovacion: "31/07/2027",
    precioCanonInicialmentePactado: "4146000",
    precioCanonActual: "5391710",
    incrementoAnualAcordado: "IPC",
    fechaAjusteIpcProxima: "01/06/2026",
    estadoIpc: "Al día",
    fechaTerminacionNoRenovacion: "",
    tipoRenovacion: "Renovación expresa (por otro sí o documento formal)",
    tiempoPreavisoDias: "60",
    estadoPreaviso: "Renovado",
    estadoContrato: "Vigente",
    fori01: "19/12/2023",
    copiaDocumentoIdentidad: "Si",
    rut: "",
    certificadoCamaraComercio: "",
    fechaCamaraComercio: "07/02/2025",
    consultaEfectiva: "No Aplica",
    certificacionBancaria: "",
    certificadoLibertadTradicion: "30/01/2025",
    estadoTotalDocumentos: "Desactualizado",
    observaciones: "01/05/2024",
  },
];

// Options for dropdowns
const municipioOficinaOptions = [
  "Guadalupe",
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
  "Florencia",
  "Chaparral",
];

const departamentoOficinaOptions = ["Huila", "Tolima", "Caquetá", "Cundinamarca"];

const tipoPersonaOptions = ["Natural", "Jurídica"];

const municipioArrendadorOptions = [
  "Bogotá, D.C.",
  "Neiva",
  "Tarqui",
  "La Plata",
  "Pitalito",
  "Suaza",
  "Garzón",
  "Rivera",
  "Hobo",
  "Saladoblanco",
  "Espinal",
  "Planadas",
  "Florencia",
  "Chaparral",
];

const departamentoArrendadorOptions = [
  "Cundinamarca",
  "Huila",
  "Tolima",
  "Caquetá",
];

const asociadoOptions = ["Si", "No"];

const tipoFirmaOptions = ["Física", "Digital"];

const incrementoAnualAcordadoOptions = [
  "IPC",
  "IPC aprox. Cifra mil",
  "IPC + 3 ptos. IVA.",
  "10% + IVA",
  "IVA",
  "IPC + 2 ptos. IVA.",
];

const estadoIpcOptions = ["Al día", "Pendiente por ajustar"];

const tipoRenovacionOptions = [
  "Renovación expresa (por otro sí o documento formal)",
  "Renovación automática",
];

const estadoPreavisoOptions = ["Renovado", "Por vencer"];

const estadoContratoOptions = ["Vigente", "Vencido", "Terminado"];

const copiaDocumentoIdentidadOptions = ["Si", "No"];

const consultaEfectivaOptions = ["Si", "No", "No Aplica"];

const estadoTotalDocumentosOptions = ["Actualizado", "Desactualizado", "Pendiente"];

export default function ContratosArrendamientoTable() {
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
        municipioOficina: "",
        departamentoOficina: "",
        tipoPersona: "",
        documento: "",
        nombre: "",
        direccion: "",
        telefonoCelular: "",
        email: "",
        municipioArrendador: "",
        departamentoArrendador: "",
        asociado: "",
        fechaFirma: "",
        tipoFirma: "",
        fechaInicio: "",
        fechaFin: "",
        duracionAnos: "",
        fechaRenovacionInicial: "",
        fechaUltimaRenovacion: "",
        fechaProximaRenovacion: "",
        precioCanonInicialmentePactado: "",
        precioCanonActual: "",
        incrementoAnualAcordado: "",
        fechaAjusteIpcProxima: "",
        estadoIpc: "",
        fechaTerminacionNoRenovacion: "",
        tipoRenovacion: "",
        tiempoPreavisoDias: "",
        estadoPreaviso: "",
        estadoContrato: "",
        fori01: "",
        copiaDocumentoIdentidad: "",
        rut: "",
        certificadoCamaraComercio: "",
        fechaCamaraComercio: "",
        consultaEfectiva: "",
        certificacionBancaria: "",
        certificadoLibertadTradicion: "",
        estadoTotalDocumentos: "",
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
      "Contratos Arrendamiento"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "contratos-arrendamiento.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.documento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.municipioOficina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.municipioArrendador?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Contratos de Arrendamiento
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, documento, municipio"
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
                MUNICIPIO OFICINA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DEPARTAMENTO OFICINA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE PERSONA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DOCUMENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">NOMBRE</th>
              <th className="p-4 border text-center whitespace-nowrap">
                DIRECCIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NRO. TELEFONO O CELULAR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">E-MAIL</th>
              <th className="p-4 border text-center whitespace-nowrap">
                MUNICIPIO ARRENDADOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DEPARTAMENTO ARRENDADOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ASOCIADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA FIRMA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE FIRMA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA INICIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA FIN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DURACIÓN (AÑOS)
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
                PRECIO O CANON INICIALMENTE PACTADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                PRECIO O CANON ACTUAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                INCREMENTO ANUAL ACORDADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA AJUSTE IPC PRÓXIMA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO IPC
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA DE TERMINACIÓN O NO RENOVACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE RENOVACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIEMPO DE PREAVISO (DÍAS)
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO DEL PREAVISO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ESTADO DEL CONTRATO
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
                ESTADO TOTAL DE DOCUMENTOS
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
                <td className="p-2 border text-left">
                  <select
                    value={r.municipioOficina}
                    onChange={e =>
                      handleChange(r.id, "municipioOficina", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {municipioOficinaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.departamentoOficina}
                    onChange={e =>
                      handleChange(r.id, "departamentoOficina", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {departamentoOficinaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
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
                    value={r.documento}
                    onChange={e =>
                      handleChange(r.id, "documento", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Documento"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nombre}
                    onChange={e => handleChange(r.id, "nombre", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Nombre"
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
                    value={r.telefonoCelular}
                    onChange={e =>
                      handleChange(r.id, "telefonoCelular", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Teléfono/Celular"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="email"
                    value={r.email}
                    onChange={e => handleChange(r.id, "email", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Email"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.municipioArrendador}
                    onChange={e =>
                      handleChange(r.id, "municipioArrendador", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {municipioArrendadorOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.departamentoArrendador}
                    onChange={e =>
                      handleChange(r.id, "departamentoArrendador", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {departamentoArrendadorOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
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
                        {opcion}
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
                    value={r.duracionAnos}
                    onChange={e =>
                      handleChange(r.id, "duracionAnos", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="Años"
                  />
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
                    type="text"
                    value={r.fechaUltimaRenovacion}
                    onChange={e =>
                      handleChange(r.id, "fechaUltimaRenovacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Fecha o 'No aplica'"
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
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.precioCanonInicialmentePactado}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "precioCanonInicialmentePactado",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Precio inicial"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.precioCanonActual}
                    onChange={e =>
                      handleChange(r.id, "precioCanonActual", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Precio actual"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.incrementoAnualAcordado}
                    onChange={e =>
                      handleChange(r.id, "incrementoAnualAcordado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {incrementoAnualAcordadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fechaAjusteIpcProxima)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fechaAjusteIpcProxima",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estadoIpc}
                    onChange={e =>
                      handleChange(r.id, "estadoIpc", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoIpcOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
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
                    value={r.tipoRenovacion}
                    onChange={e =>
                      handleChange(r.id, "tipoRenovacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoRenovacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
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
                        {opcion}
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
                  <select
                    value={r.estadoTotalDocumentos}
                    onChange={e =>
                      handleChange(r.id, "estadoTotalDocumentos", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoTotalDocumentosOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
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

