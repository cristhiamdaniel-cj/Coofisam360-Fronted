"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Options for dropdowns
const portafolioOptions = [
  "PORTAFOLIO DE AHORRO PERSONA JURIDICA",
  "CRÉDITO PERSONA JURIDICA",
  "CONVENIOS",
  "SEGUROS",
  "CODIGO QR",
  "PORTAL EMPRESARIAL",
  "MULTIPORTAL",
  "PROGRAMA ALCANCIAS DE PROGRESO",
  "SERVICIOS SOCIALES",
  "OFERTA BOTON PSE DE RECAUDO",
];

const acuerdoOptions = [
  "SE APERTURA CUENTA DE AHORRO - CDAT - AHORRO PROGRAMADO",
  "SE VA A TRAMITAR CRÉDITO",
  "ACTUALIZACIÓN - CREACIÓN DE CONVENIO",
  "ASESORAMIENTO PORTAL EMPRESARIAL",
  "ENTREGA DE QR",
  "SE PROGRAMA OTRA VISITA",
  "NO ESTA INTERESADO / NO SE LLEGO A UN ACUERDO",
];

// Parse the data from the user's table
const parseData = () => {
  const rawData = `3535	1/3/25 16:28:37	1/3/25 16:32:14	anonymous			12/19/2024	 OPTIK VISION TOTAL	65704047	MARIA EMMA VARGAS RODRIGUEZ	CLL 11 4 86	3504535979	SECRETARIA	16. ESPINAL	CONVENIOS;	ENTREGA DE QR ;	MARCELA GOMEZ	https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_160258_anonymous.jpg
3536	1/3/25 16:33:18	1/3/25 16:37:45	anonymous			1/3/2025	COOTRANSTOL	890701017-2	ALEX ERNEY MONTEALEGRE RAMIREZ	CARRERA 4 # 7-74	2483476	JOHANNA DEL PILAR CAVAJAL	16. ESPINAL	CONVENIOS;	SE PROGRAMA OTRA VISITA ;	MARCELA GOMEZ	https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_155530_anonymous.jpg
3537	1/3/25 16:39:01	1/3/25 16:40:02	anonymous			1/3/2025	"INVERSIONES B&B S.A. HOTEL DULIMA 
"	809008583-3	CARLOS ALBERTO BOTERO BOTERO	CALLE 9 # 3-92	7540420	MARISOL ADMNISTRADORA	16. ESPINAL	CONVENIOS;	SE PROGRAMA OTRA VISITA ;	MARCELA GOMEZ	https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_154110_anonymous.jpg`;

  // This is a simplified version - we'll use the full data structure
  return [];
};

// Helper function to parse portafolio string (may contain multiple values separated by ;)
const parsePortafolio = str => {
  if (!str) return "";
  // Remove trailing semicolons and return first value
  return str.replace(/;+$/, "").split(";")[0] || "";
};

// Helper function to parse acuerdo string
const parseAcuerdo = str => {
  if (!str) return "";
  return str.replace(/;+$/, "").trim();
};

const initialRows = [
  {
    id: 3535,
    horaInicio: "1/3/25 16:28:37",
    horaFinalizacion: "1/3/25 16:32:14",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "12/19/2024",
    nombreEstablecimiento: " OPTIK VISION TOTAL",
    nit: "65704047",
    nombreRepresentanteLegal: "MARIA EMMA VARGAS RODRIGUEZ",
    direccion: "CLL 11 4 86",
    telefono: "3504535979",
    personaQuienAtiende: "SECRETARIA",
    oficina: "16. ESPINAL",
    portafolioServiciosOfertado: parsePortafolio("CONVENIOS;"),
    acuerdo: parseAcuerdo("ENTREGA DE QR ;"),
    nombreTrabajador: "MARCELA GOMEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_160258_anonymous.jpg",
  },
  {
    id: 3536,
    horaInicio: "1/3/25 16:33:18",
    horaFinalizacion: "1/3/25 16:37:45",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "COOTRANSTOL",
    nit: "890701017-2",
    nombreRepresentanteLegal: "ALEX ERNEY MONTEALEGRE RAMIREZ",
    direccion: "CARRERA 4 # 7-74",
    telefono: "2483476",
    personaQuienAtiende: "JOHANNA DEL PILAR CAVAJAL",
    oficina: "16. ESPINAL",
    portafolioServiciosOfertado: parsePortafolio("CONVENIOS;"),
    acuerdo: parseAcuerdo("SE PROGRAMA OTRA VISITA ;"),
    nombreTrabajador: "MARCELA GOMEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_155530_anonymous.jpg",
  },
  {
    id: 3537,
    horaInicio: "1/3/25 16:39:01",
    horaFinalizacion: "1/3/25 16:40:02",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "INVERSIONES B&B S.A. HOTEL DULIMA",
    nit: "809008583-3",
    nombreRepresentanteLegal: "CARLOS ALBERTO BOTERO BOTERO",
    direccion: "CALLE 9 # 3-92",
    telefono: "7540420",
    personaQuienAtiende: "MARISOL ADMNISTRADORA",
    oficina: "16. ESPINAL",
    portafolioServiciosOfertado: parsePortafolio("CONVENIOS;"),
    acuerdo: parseAcuerdo("SE PROGRAMA OTRA VISITA ;"),
    nombreTrabajador: "MARCELA GOMEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_154110_anonymous.jpg",
  },
  {
    id: 3538,
    horaInicio: "1/3/25 16:41:04",
    horaFinalizacion: "1/3/25 16:44:59",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "FERRETERIA EL MARTILLO",
    nit: "65705400",
    nombreRepresentanteLegal: "DIANA CRISTINA CARDOSO",
    direccion: "CR4 CLL 11",
    telefono: "3144817293",
    personaQuienAtiende: "DIANA CARDOSO",
    oficina: "16. ESPINAL",
    portafolioServiciosOfertado: parsePortafolio("CODIGO QR ;"),
    acuerdo: parseAcuerdo("ASESORAMIENTO PORTAL EMPRESARIAL ;"),
    nombreTrabajador: "MARCELA GOMEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_153259%201_anonymous.jpg",
  },
  {
    id: 3539,
    horaInicio: "1/3/25 16:45:52",
    horaFinalizacion: "1/3/25 16:46:54",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "SARA CALZADO.M",
    nit: "28715935-2",
    nombreRepresentanteLegal: "MARIA ESTHER ÑUSTES ORTEGON",
    direccion: "CALLE 11 # 4-20",
    telefono: "3124498181",
    personaQuienAtiende: "MARIA ESTHER ÑUSTES ORTEGON",
    oficina: "16. ESPINAL",
    portafolioServiciosOfertado: parsePortafolio("CONVENIOS;"),
    acuerdo: parseAcuerdo("SE PROGRAMA OTRA VISITA ;"),
    nombreTrabajador: "MARCELA GOMEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_150923_anonymous.jpg",
  },
  {
    id: 3540,
    horaInicio: "1/3/25 16:53:02",
    horaFinalizacion: "1/3/25 16:54:09",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "BARBERIA GOOD FELLAS",
    nit: "1019037257",
    nombreRepresentanteLegal: "JUAN CAMILO CUERVO REINOSO",
    direccion: "CALLE 6 N 4 38",
    telefono: "3059459071",
    personaQuienAtiende: "JUAN CAMILO CUERVO REINOSO",
    oficina: "4. GIGANTE",
    portafolioServiciosOfertado: parsePortafolio("CODIGO QR ;"),
    acuerdo: parseAcuerdo("ENTREGA DE QR ;"),
    nombreTrabajador: "MARIA CAMILA PUENTES MENDEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/BARBERIA%20GOOD%20FELLAS_anonymous.jpg",
  },
  {
    id: 3541,
    horaInicio: "1/3/25 16:54:12",
    horaFinalizacion: "1/3/25 16:55:09",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "CERAMICAS DIANA",
    nit: "1080180231",
    nombreRepresentanteLegal: "DIANA PATRICIA CABRERA MAYORCA",
    direccion: "CARRERA 4 N 5 39",
    telefono: "3118745880",
    personaQuienAtiende: "DIANA PATRICIA CABRERA MAYORCA",
    oficina: "4. GIGANTE",
    portafolioServiciosOfertado: parsePortafolio("CODIGO QR ;"),
    acuerdo: parseAcuerdo("ENTREGA DE QR ;"),
    nombreTrabajador: "MARIA CAMILA PUENTES MENDEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/CERAMICAS%20DIANA_anonymous.jpg",
  },
  {
    id: 3542,
    horaInicio: "1/3/25 16:52:04",
    horaFinalizacion: "1/3/25 16:56:46",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "OPTIK VISION",
    nit: "65704047",
    nombreRepresentanteLegal: "MARIA EMMA VARGAS",
    direccion: "CLL 11 4 82",
    telefono: "3504535979",
    personaQuienAtiende: "SECRETARIA",
    oficina: "16. ESPINAL",
    portafolioServiciosOfertado: parsePortafolio("CONVENIOS;"),
    acuerdo: parseAcuerdo("SE PROGRAMA OTRA VISITA ;"),
    nombreTrabajador: "MARCELA GOMEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_154110_anonymous%201.jpg",
  },
  {
    id: 3543,
    horaInicio: "1/3/25 16:56:51",
    horaFinalizacion: "1/3/25 16:58:11",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "SURTIESCOLARES - JESUS ALBERTO OCHOA BELTRAN",
    nit: "11317731-8",
    nombreRepresentanteLegal: "JESUS ALBERTO OCHOA BELTRAN",
    direccion: "CARRERA 7 # 8-43",
    telefono: "3134897065",
    personaQuienAtiende: "ADMINISTRADORA",
    oficina: "16. ESPINAL",
    portafolioServiciosOfertado: parsePortafolio("CONVENIOS;"),
    acuerdo: parseAcuerdo("SE PROGRAMA OTRA VISITA ;"),
    nombreTrabajador: "MARCELA GOMEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/TimePhoto_20250103_145807_anonymous.jpg",
  },
  {
    id: 3544,
    horaInicio: "1/4/25 8:15:28",
    horaFinalizacion: "1/4/25 8:35:03",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "HOTEL CENTRAL PARK - PABLO ANDRES SANCHEZ MENDOZA",
    nit: "75078454-9",
    nombreRepresentanteLegal: "PABLO ANDRES SANCHEZ MENDOZA",
    direccion: "CARRERA 7 CON CALLE 9 ESQUINA PISO 2",
    telefono: "3167155319",
    personaQuienAtiende: "GABRIELA RECEPCION",
    oficina: "16. ESPINAL",
    portafolioServiciosOfertado: parsePortafolio("CONVENIOS;"),
    acuerdo: parseAcuerdo("SE PROGRAMA OTRA VISITA ;"),
    nombreTrabajador: "MARCELA GOMEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/_layouts/15/Doc.aspx?sourcedoc=%7B38078523-9F1E-454A-86C4-7605ED416051%7D&file=central%20park%20foto_anonymous.docx&action=default&mobileredirect=true",
  },
  {
    id: 3545,
    horaInicio: "1/4/25 8:35:05",
    horaFinalizacion: "1/4/25 8:40:19",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/3/2025",
    nombreEstablecimiento: "CASA NUEVA MUEBLES Y ELECRODOMESTICOS",
    nit: "3203393894",
    nombreRepresentanteLegal: "OMAR GOMEZ SOTO",
    direccion: "CALLE 10 # 7-67",
    telefono: "3203393894",
    personaQuienAtiende: "OMAR GOMEZ SOTO",
    oficina: "16. ESPINAL",
    portafolioServiciosOfertado: parsePortafolio("CONVENIOS;"),
    acuerdo: parseAcuerdo("ACTUALIZACIÓN - CREACIÓN DE CONVENIO ;"),
    nombreTrabajador: "MARCELA GOMEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/_layouts/15/Doc.aspx?sourcedoc=%7B3C57803C-33B5-4369-B702-B83C5869B868%7D&file=CASA%20NUEVA_anonymous.docx&action=default&mobileredirect=true",
  },
  {
    id: 3546,
    horaInicio: "1/7/25 11:48:19",
    horaFinalizacion: "1/7/25 11:52:19",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/7/2025",
    nombreEstablecimiento: "DISTRIBUIDORA MAX POLLO",
    nit: "1078750489",
    nombreRepresentanteLegal: "LUZ AMANDA GIL ORDOÑEZ",
    direccion: "CARRERA 5 N 5 10",
    telefono: "3112093274",
    personaQuienAtiende: "LUZ AMANDA GIL ORDOÑEZ",
    oficina: "4. GIGANTE",
    portafolioServiciosOfertado: parsePortafolio("CODIGO QR ;"),
    acuerdo: parseAcuerdo("ENTREGA DE QR ;"),
    nombreTrabajador: "MARIA CAMILA PUENTES  MENDEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/DISTRIBUIDORA%20MAX%20POLLO_anonymous.jpg",
  },
  {
    id: 3547,
    horaInicio: "1/7/25 11:52:22",
    horaFinalizacion: "1/7/25 11:56:04",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/7/2025",
    nombreEstablecimiento: "EMPUGIGANTE",
    nit: "9002546320",
    nombreRepresentanteLegal: "DIANA CAROLINA ROMERO RAMIREZ",
    direccion: "CALLE 2 N 3 57",
    telefono: "3143587584",
    personaQuienAtiende: "DIANA CAROLINA ROMERO RAMIREZ",
    oficina: "4. GIGANTE",
    portafolioServiciosOfertado: parsePortafolio("CONVENIOS;"),
    acuerdo: parseAcuerdo(
      "SE PROGRAMA OTRA VISITA ;AUTORIZA SOCIALIZACION DEL PORTAFOLIO DE SERVICIOS CON PERSONAL DE PLANTA EL DIA 24 DE ENERO;"
    ),
    nombreTrabajador: "MARIA CAMILA PUENTES MENDEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/EMPUGIGANTE_anonymous%201.jpg",
  },
  {
    id: 3548,
    horaInicio: "1/7/25 12:01:01",
    horaFinalizacion: "1/7/25 12:03:06",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/7/2025",
    nombreEstablecimiento: "ESTACION DE POLICIA DE GIGANTE",
    nit: "800141397",
    nombreRepresentanteLegal: "CARLOS ANDRES GONZALEZ SANCHEZ",
    direccion: "CARRERA 4 CALLE 2 ESQUINA",
    telefono: "3114462905",
    personaQuienAtiende: "CARLOS ANDRES GONZALEZ SANCHEZ",
    oficina: "4. GIGANTE",
    portafolioServiciosOfertado: parsePortafolio(
      "PORTAFOLIO DE CRÉDITO ;PORTAFOLIO DE AHORRO ;"
    ),
    acuerdo: parseAcuerdo(
      "SE OFERTA PORTAFOLIO DE SERVICIOS DE AHORRO Y CREDITO ;"
    ),
    nombreTrabajador: "MARIA CAMILA PUENTES MENDEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/ESTACION%20DE%20POLICIA_anonymous.jpg",
  },
  {
    id: 3549,
    horaInicio: "1/7/25 12:03:15",
    horaFinalizacion: "1/7/25 12:04:29",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/7/2025",
    nombreEstablecimiento: "DIRECCION DE JUSTICIA  MUNICIPAL",
    nit: "1080180489",
    nombreRepresentanteLegal: "LEIDY JOHANA ACOSTA",
    direccion: "CALLE 3 CARRERA 4 ESQUINA",
    telefono: "3118687893",
    personaQuienAtiende: "LEIDY JOHANA ACOSTA",
    oficina: "4. GIGANTE",
    portafolioServiciosOfertado: parsePortafolio("PORTAFOLIO DE CRÉDITO ;"),
    acuerdo: parseAcuerdo("SE REALIZA OFERTA DEL PORTAFOLIO DE SERVICIOS;"),
    nombreTrabajador: "MARIA CAMILA PUENTES MENDEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/SECRETARIA%20DE%20JUSTICIA_anonymous.jpg",
  },
  {
    id: 3550,
    horaInicio: "1/7/25 12:04:38",
    horaFinalizacion: "1/7/25 12:06:11",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/7/2025",
    nombreEstablecimiento: "PERSONERIA MUNICIPAL",
    nit: "53011419",
    nombreRepresentanteLegal: "GELVIS ESTHER CABRERA HERNANDEZ",
    direccion: "CARRERA 4 N 2 41",
    telefono: "3104608256",
    personaQuienAtiende: "GELVIS ESTHER CABRERA HERNANDEZ",
    oficina: "4. GIGANTE",
    portafolioServiciosOfertado: parsePortafolio(
      "CONVENIOS;PORTAFOLIO DE CRÉDITO ;"
    ),
    acuerdo: parseAcuerdo("SE REALIZA OFERTA DEL PORTAFOLIO DE SERVICIOS;"),
    nombreTrabajador: "MARIA CAMILA PUENTES MENDEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/PERSONERIA%20MUNICIPAL_anonymous%201.jpg",
  },
  {
    id: 3551,
    horaInicio: "1/7/25 13:47:59",
    horaFinalizacion: "1/7/25 13:48:29",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/7/2025",
    nombreEstablecimiento: "ESE HOSPITAL SAN ANTONIO DE GIGANTE",
    nit: "891180065",
    nombreRepresentanteLegal: "KAREN LISSETH POLANIA TRIANA",
    direccion: "CALLE 5 N 1 40",
    telefono: "3214111385",
    personaQuienAtiende: "KAREN LISSETH POLANIA TRIANA",
    oficina: "4. GIGANTE",
    portafolioServiciosOfertado: parsePortafolio(
      "PORTAFOLIO DE CRÉDITO ;CONVENIOS;"
    ),
    acuerdo: parseAcuerdo("SE REALIZA OFRECIMIENTO DEL PORTAFOLIO DE CREDITO;"),
    nombreTrabajador: "MARIA CAMILA PUENTES MENDEZ",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/ESE%20HOSPITAL%20SAN%20ANTONIO_anonymous%201.jpg",
  },
  {
    id: 3552,
    horaInicio: "1/8/25 17:51:48",
    horaFinalizacion: "1/8/25 17:53:26",
    correoElectronico: "anonymous",
    nombre: "",
    horaUltimaModificacion: "",
    fecha: "1/8/2025",
    nombreEstablecimiento: "RICARDA SILVA",
    nit: "36345917",
    nombreRepresentanteLegal: "RICARDA SILVA",
    direccion: "BARRIO VILLA KAROL",
    telefono: "3152694655",
    personaQuienAtiende: "RICARDA SILVA",
    oficina: "1. GARZÓN",
    portafolioServiciosOfertado: parsePortafolio("PORTAFOLIO DE CRÉDITO ;"),
    acuerdo: parseAcuerdo("ENTREGA DE QR ;"),
    nombreTrabajador: "YUDI MOSQUERA",
    evidenciaFotografica:
      "https://coopahorroycreditosanmiguel-my.sharepoint.com/personal/gestorcomercial01_coofisam_com/Documents/Aplicaciones/Microsoft%20Forms/MANTENIMIENTOS%20ENERO%20OFICINAS/Pregunta%201/FOTO%20RICARDA_anonymous.pdf",
  },
];

export default function MantenimientosTable() {
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mantenimientos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "mantenimientos.xlsx");
  };

  const filteredRows = rows.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Mantenimientos Convenios Oficinas
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
              <th className="p-4 border text-center whitespace-nowrap">ID</th>
              <th className="p-4 border text-center whitespace-nowrap">
                Hora de inicio
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Hora de finalización
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Correo electrónico
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Nombre
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                Hora de la última modificación
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                FECHA
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                NOMBRE DEL ESTABLECIMIENTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">NIT</th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                NOMBRE REPRESENTANTE LEGAL
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                DIRECCIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TELÉFONO
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[200px]">
                PERSONA QUIEN ATIENDE LA VISITA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                OFICINA
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                PORTAFOLIO DE SERVICIOS OFERTADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                ACUERDO
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[250px]">
                NOMBRE DEL TRABAJADOR QUIEN REALIZA LA VISITA
              </th>
              <th className="p-4 border text-center whitespace-nowrap min-w-[300px]">
                EVIDENCIA FOTOGRAFICA
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-left">{r.horaInicio}</td>
                <td className="p-2 border text-left">{r.horaFinalizacion}</td>
                <td className="p-2 border text-left">{r.correoElectronico}</td>
                <td className="p-2 border text-left">{r.nombre}</td>
                <td className="p-2 border text-left">
                  {r.horaUltimaModificacion}
                </td>
                <td className="p-2 border text-left">{r.fecha}</td>
                <td className="p-2 border text-left">
                  {r.nombreEstablecimiento}
                </td>
                <td className="p-2 border text-left">{r.nit}</td>
                <td className="p-2 border text-left">
                  {r.nombreRepresentanteLegal}
                </td>
                <td className="p-2 border text-left">{r.direccion}</td>
                <td className="p-2 border text-left">{r.telefono}</td>
                <td className="p-2 border text-left">
                  {r.personaQuienAtiende}
                </td>
                <td className="p-2 border text-left">{r.oficina}</td>
                <td className="p-2 border text-left">
                  <select
                    value={r.portafolioServiciosOfertado}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "portafolioServiciosOfertado",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {portafolioOptions.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.acuerdo}
                    onChange={e =>
                      handleChange(r.id, "acuerdo", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {acuerdoOptions.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">{r.nombreTrabajador}</td>
                <td className="p-2 border text-left">
                  {r.evidenciaFotografica ? (
                    <a
                      href={r.evidenciaFotografica}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver evidencia
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
