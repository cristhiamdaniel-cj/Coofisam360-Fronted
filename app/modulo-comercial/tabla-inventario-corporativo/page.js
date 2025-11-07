"use client";
import { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to format numbers with thousand separators
const formatNumber = num => {
  if (num === null || num === undefined || num === "") return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Helper function to parse formatted numbers
const parseNumber = str => {
  if (!str) return 0;
  return parseFloat(str.toString().replace(/\./g, "")) || 0;
};

// Datos de productos
const initialProductos = [
  {
    id: 1,
    codigo: "CAJA02",
    descripcion: "CAJAS ESTATUILLAS",
    proveedor: "FANTACIAS PLASTICAS DE COLOMBIA LTDA",
    valorUnitario: 75700,
    iva: 14383,
    total: 90083,
    totalStock: 90083,
    entrada: 6,
    salida: 5,
    stock: 1,
  },
  {
    id: 2,
    codigo: "LIBR01",
    descripcion: "LIBRETA APUNTES",
    proveedor: "MONTERO OCHOA ANGIE",
    valorUnitario: 2300,
    iva: 437,
    total: 2737,
    totalStock: 16422,
    entrada: 551,
    salida: 545,
    stock: 6,
  },
  {
    id: 3,
    codigo: "BATI01",
    descripcion: "BATIDORA",
    proveedor: "ELECTROMUBLES",
    valorUnitario: 65546,
    iva: 12454,
    total: 78000,
    totalStock: 233999,
    entrada: 9,
    salida: 6,
    stock: 3,
  },
  {
    id: 4,
    codigo: "FREI01",
    descripcion: "FREIDORAS OSTER",
    proveedor: "BASARA",
    valorUnitario: 300000,
    iva: 57000,
    total: 357000,
    totalStock: 357000,
    entrada: 8,
    salida: 7,
    stock: 1,
  },
  {
    id: 5,
    codigo: "CERS01",
    descripcion: "CERRADO Y SALIDA",
    proveedor: "May kop arce",
    valorUnitario: 15244,
    iva: 2896,
    total: 21037,
    totalStock: 42073,
    entrada: 14,
    salida: 12,
    stock: 2,
  },
  {
    id: 6,
    codigo: "BOLS01",
    descripcion: "BOLSO CORPORATIVOS",
    proveedor: "INVERSIONES HAY SAS",
    valorUnitario: 99673,
    iva: 18938,
    total: 118611,
    totalStock: 355833,
    entrada: 91,
    salida: 88,
    stock: 3,
  },
  {
    id: 7,
    codigo: "SAND01",
    descripcion: "SANDUCHERA KALLEY",
    proveedor: "BASARA",
    valorUnitario: 79000,
    iva: 15010,
    total: 94010,
    totalStock: 94010,
    entrada: 9,
    salida: 8,
    stock: 1,
  },
  {
    id: 8,
    codigo: "LLAVE01",
    descripcion: "LLAVEROS CUADRADO QR",
    proveedor: "INDUSTRIAS BEBA SAS",
    valorUnitario: 1128,
    iva: 214,
    total: 1342,
    totalStock: 630890,
    entrada: 1000,
    salida: 530,
    stock: 470,
  },
  {
    id: 9,
    codigo: "AVIS02",
    descripcion: "AVISOS CONVENIOS PESTAÑA",
    proveedor: "ELVER TOVAR ORTIZ",
    valorUnitario: 60000,
    iva: 0,
    total: 60000,
    totalStock: 2700000,
    entrada: 45,
    salida: 0,
    stock: 45,
  },
  {
    id: 10,
    codigo: "ALCA01",
    descripcion: "ALCANCIAS  CORAZON",
    proveedor: "FANTACIAS PLASTICAS DE COLOMBIA LTDA",
    valorUnitario: 1592,
    iva: 302,
    total: 1894,
    totalStock: 2083928,
    entrada: 16401,
    salida: 15301,
    stock: 1100,
  },
  {
    id: 11,
    codigo: "BALO01",
    descripcion: "BALONES",
    proveedor: "BALONES MILIANS",
    valorUnitario: 22170,
    iva: 4212,
    total: 26382,
    totalStock: 237441,
    entrada: 219,
    salida: 210,
    stock: 9,
  },
  {
    id: 12,
    codigo: "BOMB01",
    descripcion: "BOMBAS BLANCAS",
    proveedor: "BOMBATEX PUBLICIDAD SAS",
    valorUnitario: 380,
    iva: 0,
    total: 380,
    totalStock: 45600,
    entrada: 4822,
    salida: 4702,
    stock: 120,
  },
  {
    id: 13,
    codigo: "BOMB02",
    descripcion: "BOMBAS ROJAS",
    proveedor: "IDEAS GRAFICAS",
    valorUnitario: 380,
    iva: 0,
    total: 380,
    totalStock: 9500,
    entrada: 4425,
    salida: 4400,
    stock: 25,
  },
  {
    id: 14,
    codigo: "CAMB02",
    descripcion: "BOLSA CAMBEL PEQUEÑA",
    proveedor: "HIG SOLUCIONES PUBLICITARIAS",
    valorUnitario: 1250,
    iva: 238,
    total: 1488,
    totalStock: 43138,
    entrada: 5094,
    salida: 5065,
    stock: 29,
  },
  {
    id: 15,
    codigo: "BOLI02",
    descripcion: "BOLIGRAFO FABER CASTELL",
    proveedor: "FABER-CASTELL COLOMBIA LTDA",
    valorUnitario: 715,
    iva: 136,
    total: 851,
    totalStock: 3343841,
    entrada: 10275,
    salida: 6345,
    stock: 3930,
  },
  {
    id: 16,
    codigo: "BOLI01",
    descripcion: "BOLIGRAFO PARKER",
    proveedor: "ALMACEN PARKER LIMITADA",
    valorUnitario: 1330,
    iva: 253,
    total: 1583,
    totalStock: 696388,
    entrada: 7800,
    salida: 7360,
    stock: 440,
  },
  {
    id: 17,
    codigo: "COLO01",
    descripcion: "COLOMBINAS",
    proveedor: "DELIMARCA S.A.S",
    valorUnitario: 250,
    iva: 48,
    total: 298,
    totalStock: 642600,
    entrada: 39310,
    salida: 37150,
    stock: 2160,
  },
  {
    id: 18,
    codigo: "CARP01",
    descripcion: "CARPETAS CONVENIOS",
    proveedor: "ELVER TOVAR ORTIZ",
    valorUnitario: 2200,
    iva: 418,
    total: 2618,
    totalStock: 2657270,
    entrada: 2286,
    salida: 1271,
    stock: 1015,
  },
  {
    id: 19,
    codigo: "CUAD01",
    descripcion: "CUADERNO SAMI",
    proveedor: "ELVER TOVAR ORTIZ",
    valorUnitario: 2857,
    iva: 543,
    total: 3400,
    totalStock: 71396,
    entrada: 1266,
    salida: 1245,
    stock: 21,
  },
  {
    id: 20,
    codigo: "CHAQ01",
    descripcion: "CHAQUETA ASESORES",
    proveedor: "ELIANA JULIETH RUBIANO",
    valorUnitario: 55000,
    iva: 10450,
    total: 65450,
    totalStock: 327250,
    entrada: 113,
    salida: 108,
    stock: 5,
  },
  {
    id: 21,
    codigo: "GORR02",
    descripcion: "GORRA SAMI",
    proveedor: "CLASS PUBLICIDAD  LTDA",
    valorUnitario: 7500,
    iva: 1425,
    total: 8925,
    totalStock: 258825,
    entrada: 117,
    salida: 88,
    stock: 29,
  },
  {
    id: 22,
    codigo: "GORR01",
    descripcion: "GORRA ADULTO",
    proveedor: "MONTERO OCHOA ANGIE LISBETH - IDEAS GRAFICAS",
    valorUnitario: 8500,
    iva: 1615,
    total: 10115,
    totalStock: 3398640,
    entrada: 2107,
    salida: 1771,
    stock: 336,
  },
  {
    id: 23,
    codigo: "JARR01",
    descripcion: "JARRO CERVECERO",
    proveedor: "y LEO PLATZ H Y CIA § EN C",
    valorUnitario: 10300,
    iva: 1957,
    total: 12257,
    totalStock: 220626,
    entrada: 3000,
    salida: 2982,
    stock: 18,
  },
  {
    id: 24,
    codigo: "JARR17",
    descripcion: "JARRA 1,7",
    proveedor: "FANTACIAS PLASTICAS DE COLOMBIA LTDA",
    valorUnitario: 3500,
    iva: 665,
    total: 4165,
    totalStock: 2340730,
    entrada: 2000,
    salida: 1438,
    stock: 562,
  },
  {
    id: 25,
    codigo: "MARA01",
    descripcion: "MARACAS",
    proveedor: "FANTACIAS PLASTICAS DE COLOMBIA LTDA",
    valorUnitario: 2860,
    iva: 543,
    total: 3403,
    totalStock: 2110108,
    entrada: 944,
    salida: 324,
    stock: 620,
  },
  {
    id: 26,
    codigo: "RECI02",
    descripcion: "RECIPIENTE GRANDE",
    proveedor: "FANTACIAS PLASTICAS DE COLOMBIA LTDA",
    valorUnitario: 3500,
    iva: 665,
    total: 4165,
    totalStock: 12495,
    entrada: 1000,
    salida: 997,
    stock: 3,
  },
  {
    id: 27,
    codigo: "RECI01",
    descripcion: "RECIPIENTE PEQUEÑO",
    proveedor: "FANTACIAS PLASTICAS DE COLOMBIA LTDA",
    valorUnitario: 3100,
    iva: 589,
    total: 3689,
    totalStock: 5533500,
    entrada: 2600,
    salida: 1100,
    stock: 1500,
  },
  {
    id: 28,
    codigo: "RELO01",
    descripcion: "RELOJ",
    proveedor: "FANTACIAS PLASTICAS DE COLOMBIA LTDA",
    valorUnitario: 11500,
    iva: 2185,
    total: 13685,
    totalStock: 4570790,
    entrada: 555,
    salida: 221,
    stock: 334,
  },
  {
    id: 29,
    codigo: "SETC01",
    descripcion: "SET COCINA",
    proveedor: "PROMERAK COMERCIALIZADORA S.A.S",
    valorUnitario: 9500,
    iva: 1805,
    total: 11305,
    totalStock: 90440,
    entrada: 75,
    salida: 67,
    stock: 8,
  },
  {
    id: 30,
    codigo: "SOPO01",
    descripcion: "SOPORTE PC",
    proveedor: "ADMINISTRATIVA",
    valorUnitario: 37000,
    iva: 7030,
    total: 44030,
    totalStock: 352240,
    entrada: 10,
    salida: 2,
    stock: 8,
  },
  {
    id: 31,
    codigo: "HORN01",
    descripcion: "HORNO",
    proveedor: "BASARA",
    valorUnitario: 190000,
    iva: 36100,
    total: 226100,
    totalStock: 226100,
    entrada: 1,
    salida: 0,
    stock: 1,
  },
  {
    id: 32,
    codigo: "TOAL01",
    descripcion: "TOALLA DE MANO",
    proveedor: "HIG SOLUCIONES PUBLICITARIAS",
    valorUnitario: 3200,
    iva: 608,
    total: 3808,
    totalStock: 15232,
    entrada: 80,
    salida: 76,
    stock: 4,
  },
  {
    id: 33,
    codigo: "TAMB01",
    descripcion: "TAMBOR",
    proveedor: "FANTACIAS PLASTICAS DE COLOMBIA LTDA",
    valorUnitario: 5100,
    iva: 969,
    total: 6069,
    totalStock: 54621,
    entrada: 109,
    salida: 100,
    stock: 9,
  },
  {
    id: 34,
    codigo: "TROM01",
    descripcion: "TROMPO",
    proveedor: "FANTACIAS PLASTICAS DE COLOMBIA LTDA",
    valorUnitario: 1160,
    iva: 220,
    total: 1380,
    totalStock: 122856,
    entrada: 175,
    salida: 86,
    stock: 89,
  },
];

// Datos de entradas
const initialEntradas = [
  {
    id: 1,
    codigo: "ALCA01",
    descripcion: "ALCANCIAS  CORAZON",
    valorTotal: 20879456,
    fecha: "30/06/2023",
    cantidad: 11024,
  },
  {
    id: 2,
    codigo: "BOTI01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 1216,
  },
  {
    id: 3,
    codigo: "VAPO01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 130,
  },
  {
    id: 4,
    codigo: "BALO01",
    descripcion: "BALONES",
    valorTotal: 5698512,
    fecha: "30/06/2023",
    cantidad: 216,
  },
  {
    id: 5,
    codigo: "AGEN01",
    descripcion: "AGENDAS CORPORATIVAS",
    valorTotal: 6301200,
    fecha: "30/06/2023",
    cantidad: 300,
  },
  {
    id: 6,
    codigo: "GORR01",
    descripcion: "GORRA ADULTO",
    valorTotal: 6069000,
    fecha: "30/06/2023",
    cantidad: 600,
  },
  {
    id: 7,
    codigo: "JARA01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 720,
  },
  {
    id: 8,
    codigo: "BOKR01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 160,
  },
  {
    id: 9,
    codigo: "ARMA01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 1,
  },
  {
    id: 10,
    codigo: "AVIS01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 13,
  },
  {
    id: 11,
    codigo: "COLO01",
    descripcion: "COLOMBINAS",
    valorTotal: 193700,
    fecha: "30/06/2023",
    cantidad: 650,
  },
  {
    id: 12,
    codigo: "GLOB02",
    descripcion: "GLOBO R40",
    valorTotal: 571200,
    fecha: "30/06/2023",
    cantidad: 30,
  },
  {
    id: 13,
    codigo: "BOMB01",
    descripcion: "BOMBAS BLANCAS",
    valorTotal: 164000,
    fecha: "30/06/2023",
    cantidad: 822,
  },
  {
    id: 14,
    codigo: "BOMB02",
    descripcion: "BOMBAS ROJAS",
    valorTotal: 152000,
    fecha: "30/06/2023",
    cantidad: 400,
  },
  {
    id: 15,
    codigo: "CAMB01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 260,
  },
  {
    id: 16,
    codigo: "CAMB02",
    descripcion: "BOLSA CAMBEL PEQUEÑA",
    valorTotal: 1488000,
    fecha: "30/06/2023",
    cantidad: 1000,
  },
  {
    id: 17,
    codigo: "CARP01",
    descripcion: "CARPETAS CONVENIOS",
    valorTotal: 5984748,
    fecha: "30/06/2023",
    cantidad: 2286,
  },
  {
    id: 18,
    codigo: "LIBR01",
    descripcion: "LIBRETA APUNTES",
    valorTotal: 821100,
    fecha: "30/06/2023",
    cantidad: 300,
  },
  {
    id: 19,
    codigo: "TOAL01",
    descripcion: "TOALLA DE MANO",
    valorTotal: 304640,
    fecha: "30/06/2023",
    cantidad: 80,
  },
  {
    id: 20,
    codigo: "BOLI01",
    descripcion: "BOLIGRAFO PARKER",
    valorTotal: 2057900,
    fecha: "30/06/2023",
    cantidad: 1300,
  },
  {
    id: 21,
    codigo: "BOLI02",
    descripcion: "BOLIGRAFO FABER CASTELL",
    valorTotal: 610167,
    fecha: "30/06/2023",
    cantidad: 717,
  },
  {
    id: 22,
    codigo: "CABI01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 1,
  },
  {
    id: 23,
    codigo: "SAND01",
    descripcion: "SANDUCHERA KALLEY",
    valorTotal: 658070,
    fecha: "30/06/2023",
    cantidad: 7,
  },
  {
    id: 24,
    codigo: "TABL01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 1,
  },
  {
    id: 25,
    codigo: "FREI01",
    descripcion: "FREIDORAS OSTER",
    valorTotal: 2499000,
    fecha: "30/06/2023",
    cantidad: 7,
  },
  {
    id: 26,
    codigo: "ASAD01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 1,
  },
  {
    id: 27,
    codigo: "CUAD01",
    descripcion: "CUADERNO SAMI",
    valorTotal: 904400,
    fecha: "30/06/2023",
    cantidad: 266,
  },
  {
    id: 28,
    codigo: "RELO01",
    descripcion: "RELOJ",
    valorTotal: 273700,
    fecha: "30/06/2023",
    cantidad: 20,
  },
  {
    id: 29,
    codigo: "GORR02",
    descripcion: "GORRA SAMI",
    valorTotal: 624750,
    fecha: "30/06/2023",
    cantidad: 70,
  },
  {
    id: 30,
    codigo: "BOKR02",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 10,
  },
  {
    id: 31,
    codigo: "BEBE01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 4,
  },
  {
    id: 32,
    codigo: "BOLS01",
    descripcion: "BOLSO CORPORATIVOS",
    valorTotal: 2372220,
    fecha: "30/06/2023",
    cantidad: 20,
  },
  {
    id: 33,
    codigo: "CRIS01",
    descripcion: "",
    valorTotal: 0,
    fecha: "30/06/2023",
    cantidad: 41,
  },
  {
    id: 34,
    codigo: "CHAQ01",
    descripcion: "CHAQUETA ASESORES",
    valorTotal: 523600,
    fecha: "30/06/2023",
    cantidad: 8,
  },
];

// Datos de salidas
const initialSalidas = [
  {
    id: 1,
    codigo: "JARR01",
    descripcion: "JARRO CERVECERO",
    valorUnitario: 12257,
    codigoAgencia: 5,
    agencia: "ACEVEDO",
    fecha: "01/08/2023",
    cantidad: 180,
    valorTotal: 2206260,
  },
  {
    id: 2,
    codigo: "JARR01",
    descripcion: "JARRO CERVECERO",
    valorUnitario: 12257,
    codigoAgencia: 9,
    agencia: "SUAZA",
    fecha: "01/08/2023",
    cantidad: 180,
    valorTotal: 2206260,
  },
  {
    id: 3,
    codigo: "JARR01",
    descripcion: "JARRO CERVECERO",
    valorUnitario: 12257,
    codigoAgencia: 3,
    agencia: "EL PITAL",
    fecha: "01/08/2023",
    cantidad: 180,
    valorTotal: 2206260,
  },
  {
    id: 4,
    codigo: "JARR01",
    descripcion: "JARRO CERVECERO",
    valorUnitario: 12257,
    codigoAgencia: 6,
    agencia: "TARQUI",
    fecha: "01/08/2023",
    cantidad: 180,
    valorTotal: 2206260,
  },
  {
    id: 5,
    codigo: "BALO01",
    descripcion: "BALONES",
    valorUnitario: 26382,
    codigoAgencia: 6,
    agencia: "TARQUI",
    fecha: "01/08/2023",
    cantidad: 14,
    valorTotal: 369348,
  },
  {
    id: 6,
    codigo: "LICU01",
    descripcion: "",
    valorUnitario: 0,
    codigoAgencia: 5,
    agencia: "ACEVEDO",
    fecha: "01/08/2023",
    cantidad: 1,
    valorTotal: 0,
  },
  {
    id: 7,
    codigo: "AGEN01",
    descripcion: "AGENDAS CORPORATIVAS",
    valorUnitario: 21004,
    codigoAgencia: 20,
    agencia: "DIRECCION GENERA",
    fecha: "01/08/2023",
    cantidad: 5,
    valorTotal: 105020,
  },
  {
    id: 8,
    codigo: "CAMB02",
    descripcion: "BOLSA CAMBEL PEQUEÑA",
    valorUnitario: 1488,
    codigoAgencia: 20,
    agencia: "DIRECCION GENERA",
    fecha: "01/08/2023",
    cantidad: 3,
    valorTotal: 4464,
  },
  {
    id: 9,
    codigo: "ALCA01",
    descripcion: "ALCANCIAS  CORAZON",
    valorUnitario: 1894,
    codigoAgencia: 20,
    agencia: "DIRECCION GENERA",
    fecha: "01/08/2023",
    cantidad: 3,
    valorTotal: 5682,
  },
  {
    id: 10,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 1,
    agencia: "GARZON",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 11,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 2,
    agencia: "GUADALUPE",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 12,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 4,
    agencia: "GIGANTE",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 13,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 5,
    agencia: "ACEVEDO",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 14,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 6,
    agencia: "TARQUI",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 15,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 7,
    agencia: "LA PLATA",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 16,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 8,
    agencia: "PITALITO",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 17,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 9,
    agencia: "SUAZA",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 18,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 10,
    agencia: "LA ARGENTINA",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 19,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 11,
    agencia: "NEIVA",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 20,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 12,
    agencia: "RIVERA",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 21,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 13,
    agencia: "HOBO",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 22,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 14,
    agencia: "IQUIRA",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 23,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 15,
    agencia: "SALADOBLANCO",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 24,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 16,
    agencia: "ESPINAL",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 25,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 17,
    agencia: "PLANADAS",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 26,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 18,
    agencia: "CHAPARRAL",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 27,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 19,
    agencia: "FLORENCIA",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 28,
    codigo: "VOLA03",
    descripcion: "VOLANTE QR TU PAGO AL INSTANTE",
    valorUnitario: 238,
    codigoAgencia: 3,
    agencia: "EL PITAL",
    fecha: "01/08/2023",
    cantidad: 200,
    valorTotal: 47600,
  },
  {
    id: 29,
    codigo: "ALCA01",
    descripcion: "ALCANCIAS  CORAZON",
    valorUnitario: 1894,
    codigoAgencia: 20,
    agencia: "DIRECCION GENERA",
    fecha: "01/08/2023",
    cantidad: 50,
    valorTotal: 94700,
  },
  {
    id: 30,
    codigo: "BOLI01",
    descripcion: "BOLIGRAFO PARKER",
    valorUnitario: 1583,
    codigoAgencia: 20,
    agencia: "DIRECCION GENERA",
    fecha: "01/08/2023",
    cantidad: 119,
    valorTotal: 188377,
  },
  {
    id: 31,
    codigo: "BOLI02",
    descripcion: "BOLIGRAFO FABER CASTELL",
    valorUnitario: 851,
    codigoAgencia: 20,
    agencia: "DIRECCION GENERA",
    fecha: "01/08/2023",
    cantidad: 36,
    valorTotal: 30636,
  },
  {
    id: 32,
    codigo: "LIBR01",
    descripcion: "LIBRETA APUNTES",
    valorUnitario: 2737,
    codigoAgencia: 20,
    agencia: "DIRECCION GENERA",
    fecha: "01/08/2023",
    cantidad: 50,
    valorTotal: 136850,
  },
  {
    id: 33,
    codigo: "ALCA01",
    descripcion: "ALCANCIAS  CORAZON",
    valorUnitario: 1894,
    codigoAgencia: 1,
    agencia: "GARZON",
    fecha: "01/08/2023",
    cantidad: 25,
    valorTotal: 47350,
  },
  {
    id: 34,
    codigo: "CAMB01",
    descripcion: "",
    valorUnitario: 0,
    codigoAgencia: 1,
    agencia: "GARZON",
    fecha: "01/08/2023",
    cantidad: 10,
    valorTotal: 0,
  },
];

export default function InventarioCorporativoTable() {
  const [productos, setProductos] = useState(initialProductos);
  const [entradas, setEntradas] = useState(initialEntradas);
  const [salidas, setSalidas] = useState(initialSalidas);
  const [editedProductos, setEditedProductos] = useState({});
  const [editedEntradas, setEditedEntradas] = useState({});
  const [editedSalidas, setEditedSalidas] = useState({});
  const [searchTermProductos, setSearchTermProductos] = useState("");
  const [searchTermEntradas, setSearchTermEntradas] = useState("");
  const [searchTermSalidas, setSearchTermSalidas] = useState("");

  const handleChangeProducto = (id, field, value) => {
    setProductos(prev =>
      prev.map(row => {
        if (row.id === id) {
          const updated = { ...row };

          if (field === "entrada" || field === "salida") {
            updated[field] = parseNumber(value);
            // Recalculate stock
            updated.stock = updated.entrada - updated.salida;
          } else if (
            field === "valorUnitario" ||
            field === "iva" ||
            field === "total" ||
            field === "totalStock"
          ) {
            updated[field] = parseNumber(value);
            // Recalculate total if valorUnitario or iva changed
            if (field === "valorUnitario" || field === "iva") {
              updated.total = updated.valorUnitario + updated.iva;
            }
          } else {
            updated[field] = value;
          }

          return updated;
        }
        return row;
      })
    );

    setEditedProductos(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleChangeEntrada = (id, field, value) => {
    setEntradas(prev =>
      prev.map(row => {
        if (row.id === id) {
          const updated = { ...row };

          if (field === "valorTotal" || field === "cantidad") {
            updated[field] = parseNumber(value);
          } else {
            updated[field] = value;
          }

          return updated;
        }
        return row;
      })
    );

    setEditedEntradas(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleChangeSalida = (id, field, value) => {
    setSalidas(prev =>
      prev.map(row => {
        if (row.id === id) {
          const updated = { ...row };

          if (
            field === "valorUnitario" ||
            field === "valorTotal" ||
            field === "cantidad" ||
            field === "codigoAgencia"
          ) {
            updated[field] = parseNumber(value);
            // Recalculate valorTotal if valorUnitario or cantidad changed
            if (field === "valorUnitario" || field === "cantidad") {
              updated.valorTotal = updated.valorUnitario * updated.cantidad;
            }
          } else {
            updated[field] = value;
          }

          return updated;
        }
        return row;
      })
    );

    setEditedSalidas(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async () => {
    console.log("Saving productos:", editedProductos);
    console.log("Saving entradas:", editedEntradas);
    console.log("Saving salidas:", editedSalidas);
    setEditedProductos({});
    setEditedEntradas({});
    setEditedSalidas({});
  };

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();

    // Productos worksheet
    const productosWorksheet = XLSX.utils.json_to_sheet(productos);
    XLSX.utils.book_append_sheet(workbook, productosWorksheet, "Productos");

    // Entradas worksheet
    const entradasWorksheet = XLSX.utils.json_to_sheet(entradas);
    XLSX.utils.book_append_sheet(workbook, entradasWorksheet, "Entradas");

    // Salidas worksheet
    const salidasWorksheet = XLSX.utils.json_to_sheet(salidas);
    XLSX.utils.book_append_sheet(workbook, salidasWorksheet, "Salidas");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "inventario-corporativo.xlsx");
  };

  // Filter productos based on search term
  const filteredProductos = productos.filter(row => {
    if (!searchTermProductos) return true;
    const search = searchTermProductos.toLowerCase();
    return (
      row.codigo.toLowerCase().includes(search) ||
      row.descripcion.toLowerCase().includes(search) ||
      row.proveedor.toLowerCase().includes(search)
    );
  });

  // Filter entradas based on search term
  const filteredEntradas = entradas.filter(row => {
    if (!searchTermEntradas) return true;
    const search = searchTermEntradas.toLowerCase();
    return (
      row.codigo.toLowerCase().includes(search) ||
      row.descripcion.toLowerCase().includes(search)
    );
  });

  // Filter salidas based on search term
  const filteredSalidas = salidas.filter(row => {
    if (!searchTermSalidas) return true;
    const search = searchTermSalidas.toLowerCase();
    return (
      row.codigo.toLowerCase().includes(search) ||
      row.descripcion.toLowerCase().includes(search) ||
      row.agencia.toLowerCase().includes(search)
    );
  });

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Inventario Material Corporativo
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="flex gap-4">
          {(Object.keys(editedProductos).length > 0 ||
            Object.keys(editedEntradas).length > 0 ||
            Object.keys(editedSalidas).length > 0) && (
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
            <FiDownload />
          </button>
        </div>
      </div>

      {/* Three tables side by side */}
      <div
        className="flex gap-4 overflow-x-auto mb-4"
        style={{ minWidth: "max-content" }}
      >
        {/* Tabla Productos */}
        <div
          className="flex-shrink-0 overflow-x-auto table-container h-[65vh]"
          style={{ minWidth: "600px" }}
        >
          <h2 className="text-xl font-semibold mb-2 text-center">Producto</h2>
          <div className="search-bar flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Buscar producto..."
              className="border w-full px-2 py-1 rounded text-sm"
              value={searchTermProductos}
              onChange={e => setSearchTermProductos(e.target.value)}
            />
            <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
              <IoSearch />
            </button>
          </div>
          <table className="table-auto border-collapse w-full text-xs">
            <thead>
              <tr className="tabla-header">
                <th className="p-1 border text-center whitespace-nowrap">
                  CODIGO
                </th>
                <th className="p-1 border text-center whitespace-nowrap min-w-[100px]">
                  DESCRIPCION
                </th>
                <th className="p-1 border text-center whitespace-nowrap min-w-[120px]">
                  PROVEEDOR
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "90px" }}
                >
                  VALOR UNITARIO
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "80px" }}
                >
                  IVA
                </th>
                <th className="p-1 border text-center whitespace-nowrap">
                  TOTAL
                </th>
                <th className="p-1 border text-center whitespace-nowrap">
                  TOTAL STOCK
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "80px" }}
                >
                  ENTRADA
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "80px" }}
                >
                  SALIDA
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "55px" }}
                >
                  STOCK
                </th>
              </tr>
            </thead>

            <tbody className="tabla-cupos-content">
              {filteredProductos.map(r => (
                <tr key={r.id}>
                  <td className="p-1 border text-left text-xs">{r.codigo}</td>
                  <td className="p-1 border text-left text-xs">
                    {r.descripcion}
                  </td>
                  <td className="p-1 border text-left text-xs">
                    {r.proveedor}
                  </td>
                  <td
                    className="p-1 border text-right"
                    style={{ width: "90px" }}
                  >
                    <input
                      type="text"
                      value={formatNumber(r.valorUnitario)}
                      onChange={e =>
                        handleChangeProducto(
                          r.id,
                          "valorUnitario",
                          e.target.value
                        )
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-right"
                    />
                  </td>
                  <td
                    className="p-1 border text-right"
                    style={{ width: "50px" }}
                  >
                    <input
                      type="text"
                      value={formatNumber(r.iva)}
                      onChange={e =>
                        handleChangeProducto(r.id, "iva", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-right"
                    />
                  </td>
                  <td className="p-1 border text-right font-semibold text-xs">
                    {formatNumber(r.total)}
                  </td>
                  <td className="p-1 border text-right">
                    <input
                      type="text"
                      value={formatNumber(r.totalStock)}
                      onChange={e =>
                        handleChangeProducto(r.id, "totalStock", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-right"
                    />
                  </td>
                  <td
                    className="p-1 border text-center"
                    style={{ width: "65px" }}
                  >
                    <input
                      type="number"
                      value={r.entrada}
                      onChange={e =>
                        handleChangeProducto(r.id, "entrada", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-center"
                    />
                  </td>
                  <td
                    className="p-1 border text-center"
                    style={{ width: "60px" }}
                  >
                    <input
                      type="number"
                      value={r.salida}
                      onChange={e =>
                        handleChangeProducto(r.id, "salida", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-center"
                    />
                  </td>
                  <td
                    className="p-1 border text-center font-semibold text-xs"
                    style={{ width: "55px" }}
                  >
                    {r.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla Entradas */}
        <div
          className="flex-shrink-0 overflow-x-auto table-container h-[65vh]"
          style={{ minWidth: "450px" }}
        >
          <h2 className="text-xl font-semibold mb-2 text-center">Entradas</h2>
          <div className="search-bar flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Buscar entrada..."
              className="border w-full px-2 py-1 rounded text-sm"
              value={searchTermEntradas}
              onChange={e => setSearchTermEntradas(e.target.value)}
            />
            <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
              <IoSearch />
            </button>
          </div>
          <table className="table-auto border-collapse w-full text-xs">
            <thead>
              <tr className="tabla-header">
                <th className="p-1 border text-center whitespace-nowrap">
                  CODIGO
                </th>
                <th className="p-1 border text-center whitespace-nowrap min-w-[120px]">
                  DESCRIPCION
                </th>
                <th className="p-1 border text-center whitespace-nowrap">
                  VALOR TOTAL
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "110px" }}
                >
                  FECHA
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "85px" }}
                >
                  CANTIDAD
                </th>
              </tr>
            </thead>

            <tbody className="tabla-cupos-content">
              {filteredEntradas.map(r => (
                <tr key={r.id}>
                  <td className="p-1 border text-left text-xs">{r.codigo}</td>
                  <td className="p-1 border text-left text-xs">
                    {r.descripcion || "-"}
                  </td>
                  <td className="p-1 border text-right">
                    <input
                      type="text"
                      value={formatNumber(r.valorTotal)}
                      onChange={e =>
                        handleChangeEntrada(r.id, "valorTotal", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-right"
                    />
                  </td>
                  <td
                    className="p-1 border text-left"
                    style={{ width: "80px" }}
                  >
                    <input
                      type="text"
                      value={r.fecha}
                      onChange={e =>
                        handleChangeEntrada(r.id, "fecha", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs"
                    />
                  </td>
                  <td
                    className="p-1 border text-center"
                    style={{ width: "65px" }}
                  >
                    <input
                      type="number"
                      value={r.cantidad}
                      onChange={e =>
                        handleChangeEntrada(r.id, "cantidad", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla Salidas */}
        <div
          className="flex-shrink-0 overflow-x-auto table-container h-[65vh]"
          style={{ minWidth: "550px" }}
        >
          <h2 className="text-xl font-semibold mb-2 text-center">Salidas</h2>
          <div className="search-bar flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Buscar salida..."
              className="border w-full px-2 py-1 rounded text-sm"
              value={searchTermSalidas}
              onChange={e => setSearchTermSalidas(e.target.value)}
            />
            <button className="action-button flex gap-2 items-center justify-center cursor-pointer">
              <IoSearch />
            </button>
          </div>
          <table className="table-auto border-collapse w-full text-xs">
            <thead>
              <tr className="tabla-header">
                <th className="p-1 border text-center whitespace-nowrap">
                  CODIGO
                </th>
                <th className="p-1 border text-center whitespace-nowrap min-w-[120px]">
                  DESCRIPCION
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "90px" }}
                >
                  VALOR UNITARIO
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "70px" }}
                >
                  COD. AGENCIA
                </th>
                <th className="p-1 border text-center whitespace-nowrap min-w-[100px]">
                  AGENCIA
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "100px" }}
                >
                  FECHA
                </th>
                <th
                  className="p-1 border text-center whitespace-nowrap"
                  style={{ width: "80px" }}
                >
                  CANTIDAD
                </th>
                <th className="p-1 border text-center whitespace-nowrap">
                  VALOR TOTAL
                </th>
              </tr>
            </thead>

            <tbody className="tabla-cupos-content">
              {filteredSalidas.map(r => (
                <tr key={r.id}>
                  <td className="p-1 border text-left text-xs">{r.codigo}</td>
                  <td className="p-1 border text-left text-xs">
                    {r.descripcion || "-"}
                  </td>
                  <td
                    className="p-1 border text-right"
                    style={{ width: "90px" }}
                  >
                    <input
                      type="text"
                      value={formatNumber(r.valorUnitario)}
                      onChange={e =>
                        handleChangeSalida(
                          r.id,
                          "valorUnitario",
                          e.target.value
                        )
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-right"
                    />
                  </td>
                  <td
                    className="p-1 border text-center"
                    style={{ width: "70px" }}
                  >
                    <input
                      type="number"
                      value={r.codigoAgencia}
                      onChange={e =>
                        handleChangeSalida(
                          r.id,
                          "codigoAgencia",
                          e.target.value
                        )
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-center"
                    />
                  </td>
                  <td className="p-1 border text-left">
                    <input
                      type="text"
                      value={r.agencia}
                      onChange={e =>
                        handleChangeSalida(r.id, "agencia", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs"
                    />
                  </td>
                  <td
                    className="p-1 border text-left"
                    style={{ width: "80px" }}
                  >
                    <input
                      type="text"
                      value={r.fecha}
                      onChange={e =>
                        handleChangeSalida(r.id, "fecha", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs"
                    />
                  </td>
                  <td
                    className="p-1 border text-center"
                    style={{ width: "65px" }}
                  >
                    <input
                      type="number"
                      value={r.cantidad}
                      onChange={e =>
                        handleChangeSalida(r.id, "cantidad", e.target.value)
                      }
                      className="w-full border-none outline-none bg-transparent text-xs text-center"
                    />
                  </td>
                  <td className="p-1 border text-right font-semibold text-xs">
                    {formatNumber(r.valorTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
