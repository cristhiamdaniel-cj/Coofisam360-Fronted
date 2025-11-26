"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to format number with dots and commas
const formatNumber = (num) => {
  if (!num) return "";
  const numStr = num.toString().replace(/\./g, "").replace(/,/g, ".");
  const numValue = parseFloat(numStr);
  if (isNaN(numValue)) return num;
  return numValue.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Helper function to format currency
const formatCurrency = (num) => {
  if (!num) return "";
  const formatted = formatNumber(num);
  return formatted ? `$ ${formatted}` : "";
};

// Helper function to parse number (remove dots, keep comma as decimal)
const parseNumber = (str) => {
  if (!str) return "";
  // Remove currency symbols, dots (thousands separator) and replace comma with dot for parsing
  return str.toString().replace(/\$/g, "").replace(/\s/g, "").replace(/\./g, "").replace(/,/g, ".");
};

// Helper function to format percentage
const formatPercentage = (num) => {
  if (!num) return "";
  const numValue = parseFloat(num);
  if (isNaN(numValue)) return num;
  return numValue.toFixed(2) + "%";
};

// Initial data
const initialRows = [
  {
    id: 1,
    topes: "1500000000",
    codigo: "1",
    oficina: "Garzón",
    cajaGeneral: "532712150",
    bancos: "7198716213",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "7940714451",
    diariomas: "5693003174",
    sami: "375705732",
    ahorramigos: "73499503",
    corresponsalSolidario: "145000000",
    coofipay: "9477241",
    inactivaGanamas: "281021509",
    inactivaDiariomas: "255081929",
    inactivaSami: "117436258",
    inactivaAhorramigos: "3562901",
    depositosAhorroContractual: "469226530",
    certificadosDepositos: "20951117993",
    depositos: "36314847221",
    porcentajeIndicadorDisponible: "21.29",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "36314847221",
  },
  {
    id: 2,
    topes: "700000000",
    codigo: "2",
    oficina: "Guadalupe",
    cajaGeneral: "178300200",
    bancos: "58408491",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "5325233526",
    diariomas: "2150768463",
    sami: "168107677",
    ahorramigos: "35861190",
    corresponsalSolidario: "30000000",
    coofipay: "0",
    inactivaGanamas: "171704295",
    inactivaDiariomas: "100368549",
    inactivaSami: "41417131",
    inactivaAhorramigos: "39125350",
    depositosAhorroContractual: "174284155",
    certificadosDepositos: "6447296692",
    depositos: "14684167028",
    porcentajeIndicadorDisponible: "1.61",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "14684167028",
  },
  {
    id: 3,
    topes: "700000000",
    codigo: "3",
    oficina: "Pital",
    cajaGeneral: "327991400",
    bancos: "122988320",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "7980104537",
    diariomas: "2811855483",
    sami: "363104345",
    ahorramigos: "31009316",
    corresponsalSolidario: "20000000",
    coofipay: "0",
    inactivaGanamas: "136050778",
    inactivaDiariomas: "166720372",
    inactivaSami: "76109924",
    inactivaAhorramigos: "5431524",
    depositosAhorroContractual: "137838862",
    certificadosDepositos: "2878093977",
    depositos: "14606319118",
    porcentajeIndicadorDisponible: "3.09",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "14606319118",
  },
  {
    id: 4,
    topes: "700000000",
    codigo: "4",
    oficina: "Gigante",
    cajaGeneral: "295852450",
    bancos: "100419882",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "3577336825",
    diariomas: "1778686661",
    sami: "77372395",
    ahorramigos: "40933",
    corresponsalSolidario: "30000000",
    coofipay: "0",
    inactivaGanamas: "138083693",
    inactivaDiariomas: "142789771",
    inactivaSami: "31475245",
    inactivaAhorramigos: "2232303",
    depositosAhorroContractual: "153567645",
    certificadosDepositos: "4056636568",
    depositos: "9988222039",
    porcentajeIndicadorDisponible: "3.97",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "9988222039",
  },
  {
    id: 5,
    topes: "1200000000",
    codigo: "5",
    oficina: "Acevedo",
    cajaGeneral: "1358041300",
    bancos: "101378591",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "7067804452",
    diariomas: "6120287121",
    sami: "223278491",
    ahorramigos: "23772630",
    corresponsalSolidario: "30000000",
    coofipay: "0",
    inactivaGanamas: "202517317",
    inactivaDiariomas: "104821391",
    inactivaSami: "46520339",
    inactivaAhorramigos: "12093579",
    depositosAhorroContractual: "378797656",
    certificadosDepositos: "5240808991",
    depositos: "19450701967",
    porcentajeIndicadorDisponible: "7.50",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "19450701967",
  },
  {
    id: 6,
    topes: "700000000",
    codigo: "6",
    oficina: "Tarqui",
    cajaGeneral: "669539850",
    bancos: "44000823",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "7223224317",
    diariomas: "4671029815",
    sami: "582564031",
    ahorramigos: "49877728",
    corresponsalSolidario: "10000000",
    coofipay: "0",
    inactivaGanamas: "95234439",
    inactivaDiariomas: "40497107",
    inactivaSami: "40851748",
    inactivaAhorramigos: "13534649",
    depositosAhorroContractual: "136176530",
    certificadosDepositos: "4220859066",
    depositos: "17083849430",
    porcentajeIndicadorDisponible: "4.18",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "17083849430",
  },
  {
    id: 7,
    topes: "700000000",
    codigo: "7",
    oficina: "La Plata",
    cajaGeneral: "186671550",
    bancos: "821081547",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "3587383741",
    diariomas: "1532146674",
    sami: "199126084",
    ahorramigos: "135876007",
    corresponsalSolidario: "45000000",
    coofipay: "0",
    inactivaGanamas: "77131634",
    inactivaDiariomas: "62767890",
    inactivaSami: "60154549",
    inactivaAhorramigos: "592635",
    depositosAhorroContractual: "254154266",
    certificadosDepositos: "3495762330",
    depositos: "9450095810",
    porcentajeIndicadorDisponible: "10.66",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "9450095810",
  },
  {
    id: 8,
    topes: "700000000",
    codigo: "8",
    oficina: "Pitalito",
    cajaGeneral: "168580900",
    bancos: "1905560610",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "4090247580",
    diariomas: "688852215",
    sami: "150485617",
    ahorramigos: "36463809",
    corresponsalSolidario: "69820996",
    coofipay: "0",
    inactivaGanamas: "114380429",
    inactivaDiariomas: "44296179",
    inactivaSami: "27925686",
    inactivaAhorramigos: "468508",
    depositosAhorroContractual: "123271975",
    certificadosDepositos: "3294917135",
    depositos: "8641130129",
    porcentajeIndicadorDisponible: "24.00",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "8641130129",
  },
  {
    id: 9,
    topes: "700000000",
    codigo: "9",
    oficina: "Suaza",
    cajaGeneral: "523192650",
    bancos: "99082859",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "3527092515",
    diariomas: "3015248683",
    sami: "321655546",
    ahorramigos: "91004149",
    corresponsalSolidario: "20000000",
    coofipay: "29552467",
    inactivaGanamas: "90254721",
    inactivaDiariomas: "42093174",
    inactivaSami: "25010282",
    inactivaAhorramigos: "20009661",
    depositosAhorroContractual: "186152395",
    certificadosDepositos: "4836157029",
    depositos: "12204230622",
    porcentajeIndicadorDisponible: "5.10",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "12204230622",
  },
  {
    id: 10,
    topes: "1000000000",
    codigo: "10",
    oficina: "La Argentina",
    cajaGeneral: "442429650",
    bancos: "41316037",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "6000808833",
    diariomas: "1503255977",
    sami: "350587377",
    ahorramigos: "52929839",
    corresponsalSolidario: "20000000",
    coofipay: "0",
    inactivaGanamas: "58041130",
    inactivaDiariomas: "48872054",
    inactivaSami: "28494584",
    inactivaAhorramigos: "48885923",
    depositosAhorroContractual: "206752249",
    certificadosDepositos: "4283060559",
    depositos: "12601688525",
    porcentajeIndicadorDisponible: "3.84",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "12601688525",
  },
  {
    id: 11,
    topes: "1000000000",
    codigo: "11",
    oficina: "Neiva",
    cajaGeneral: "219672250",
    bancos: "1906677865",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "3544331739",
    diariomas: "918981677",
    sami: "186997306",
    ahorramigos: "41576377",
    corresponsalSolidario: "28000000",
    coofipay: "0",
    inactivaGanamas: "136728006",
    inactivaDiariomas: "16445513",
    inactivaSami: "37066996",
    inactivaAhorramigos: "1721697",
    depositosAhorroContractual: "196900625",
    certificadosDepositos: "11413788195",
    depositos: "16522538131",
    porcentajeIndicadorDisponible: "12.87",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "16522538131",
  },
  {
    id: 12,
    topes: "700000000",
    codigo: "12",
    oficina: "Rivera",
    cajaGeneral: "322591350",
    bancos: "119729867",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "2509862259",
    diariomas: "1992446436",
    sami: "106972099",
    ahorramigos: "195850048",
    corresponsalSolidario: "10000000",
    coofipay: "0",
    inactivaGanamas: "66777385",
    inactivaDiariomas: "36517459",
    inactivaSami: "18032622",
    inactivaAhorramigos: "68576",
    depositosAhorroContractual: "160811148",
    certificadosDepositos: "3167429250",
    depositos: "8264767282",
    porcentajeIndicadorDisponible: "5.35",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "8264767282",
  },
  {
    id: 13,
    topes: "500000000",
    codigo: "13",
    oficina: "Hobo",
    cajaGeneral: "203168850",
    bancos: "63619293",
    fondosFiduciarios: "0",
    remesasTransito: "200000000",
    ganamas: "2412084975",
    diariomas: "444741505",
    sami: "157773976",
    ahorramigos: "16648546",
    corresponsalSolidario: "30000000",
    coofipay: "0",
    inactivaGanamas: "109517163",
    inactivaDiariomas: "2211874",
    inactivaSami: "6062356",
    inactivaAhorramigos: "6681736",
    depositosAhorroContractual: "39353091",
    certificadosDepositos: "1344293898",
    depositos: "4569369120",
    porcentajeIndicadorDisponible: "10.22",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "4569369120",
  },
  {
    id: 14,
    topes: "500000000",
    codigo: "14",
    oficina: "Iquira",
    cajaGeneral: "170742450",
    bancos: "108406951",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "2478981843",
    diariomas: "174999282",
    sami: "139561658",
    ahorramigos: "28092063",
    corresponsalSolidario: "10001000",
    coofipay: "0",
    inactivaGanamas: "36053240",
    inactivaDiariomas: "753096",
    inactivaSami: "16027981",
    inactivaAhorramigos: "1243",
    depositosAhorroContractual: "28122398",
    certificadosDepositos: "1523112483",
    depositos: "4435706287",
    porcentajeIndicadorDisponible: "6.29",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "4435706287",
  },
  {
    id: 15,
    topes: "500000000",
    codigo: "15",
    oficina: "Saladoblanco",
    cajaGeneral: "252200450",
    bancos: "32061737",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "2397237394",
    diariomas: "823754668",
    sami: "310054348",
    ahorramigos: "23406899",
    corresponsalSolidario: "10000000",
    coofipay: "0",
    inactivaGanamas: "31995427",
    inactivaDiariomas: "5105140",
    inactivaSami: "12362279",
    inactivaAhorramigos: "4938033",
    depositosAhorroContractual: "55684431",
    certificadosDepositos: "2436811929",
    depositos: "6111350548",
    porcentajeIndicadorDisponible: "4.65",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "6111350548",
  },
  {
    id: 16,
    topes: "500000000",
    codigo: "16",
    oficina: "Espinal",
    cajaGeneral: "309152150",
    bancos: "245552362",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "622424819",
    diariomas: "124239522",
    sami: "117948454",
    ahorramigos: "3150536",
    corresponsalSolidario: "20000000",
    coofipay: "0",
    inactivaGanamas: "35716011",
    inactivaDiariomas: "977799",
    inactivaSami: "8893678",
    inactivaAhorramigos: "61",
    depositosAhorroContractual: "53588985",
    certificadosDepositos: "518618451",
    depositos: "1505558316",
    porcentajeIndicadorDisponible: "36.84",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "1505558316",
  },
  {
    id: 17,
    topes: "400000000",
    codigo: "17",
    oficina: "Planadas",
    cajaGeneral: "151323450",
    bancos: "63610637",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "2018066856",
    diariomas: "1662826331",
    sami: "162097917",
    ahorramigos: "10484101",
    corresponsalSolidario: "20000000",
    coofipay: "0",
    inactivaGanamas: "22987420",
    inactivaDiariomas: "5598809",
    inactivaSami: "11827785",
    inactivaAhorramigos: "1966843",
    depositosAhorroContractual: "100238883",
    certificadosDepositos: "916765222",
    depositos: "4932860167",
    porcentajeIndicadorDisponible: "4.36",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "4932860167",
  },
  {
    id: 18,
    topes: "400000000",
    codigo: "18",
    oficina: "Chaparral",
    cajaGeneral: "91524100",
    bancos: "167001657",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "414641292",
    diariomas: "34712662",
    sami: "16121636",
    ahorramigos: "2772292",
    corresponsalSolidario: "20000000",
    coofipay: "0",
    inactivaGanamas: "7814620",
    inactivaDiariomas: "281494",
    inactivaSami: "1349218",
    inactivaAhorramigos: "0",
    depositosAhorroContractual: "50941461",
    certificadosDepositos: "222617183",
    depositos: "771251858",
    porcentajeIndicadorDisponible: "33.52",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "771251858",
  },
  {
    id: 19,
    topes: "400000000",
    codigo: "19",
    oficina: "Florencia",
    cajaGeneral: "279536600",
    bancos: "1056618253",
    fondosFiduciarios: "0",
    remesasTransito: "0",
    ganamas: "684080532",
    diariomas: "55317053",
    sami: "13843668",
    ahorramigos: "362",
    corresponsalSolidario: "10000000",
    coofipay: "0",
    inactivaGanamas: "1088807",
    inactivaDiariomas: "108903",
    inactivaSami: "218221",
    inactivaAhorramigos: "0",
    depositosAhorroContractual: "73469635",
    certificadosDepositos: "358542984",
    depositos: "1196670165",
    porcentajeIndicadorDisponible: "111.66",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "1196670165",
  },
  {
    id: 20,
    topes: "0",
    codigo: "843",
    oficina: "Dirección General",
    cajaGeneral: "0",
    bancos: "6591978025",
    fondosFiduciarios: "2066140221",
    remesasTransito: "0",
    ganamas: "0",
    diariomas: "0",
    sami: "0",
    ahorramigos: "0",
    corresponsalSolidario: "0",
    coofipay: "0",
    inactivaGanamas: "0",
    inactivaDiariomas: "0",
    inactivaSami: "0",
    inactivaAhorramigos: "0",
    depositosAhorroContractual: "0",
    certificadosDepositos: "0",
    depositos: "0",
    porcentajeIndicadorDisponible: "",
    porcentajeIndicadorFondoLiquidez: "",
    validacion: "0",
  },
  {
    id: 21,
    topes: "13500000000",
    codigo: "",
    oficina: "Liquidez Consolidada",
    cajaGeneral: "6683223750",
    bancos: "20848210020",
    fondosFiduciarios: "2066140221",
    remesasTransito: "200000000",
    ganamas: "73401662486",
    diariomas: "36197153402",
    sami: "4023358357",
    ahorramigos: "852316328",
    corresponsalSolidario: "577821996",
    coofipay: "39029708",
    inactivaGanamas: "1813098024",
    inactivaDiariomas: "1076308503",
    inactivaSami: "607236882",
    inactivaAhorramigos: "161315222",
    depositosAhorroContractual: "2979332920",
    certificadosDepositos: "81606689935",
    depositos: "203335323763",
    porcentajeIndicadorDisponible: "14.65",
    porcentajeIndicadorFondoLiquidez: "10.47",
    validacion: "203335323763",
  },
];

export default function SeguimientoLiquidezTable() {
  const [rows, setRows] = useState(initialRows);
  const [editedRows, setEditedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (id, field, value) => {
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
        topes: "",
        codigo: "",
        oficina: "",
        cajaGeneral: "",
        bancos: "",
        fondosFiduciarios: "",
        remesasTransito: "",
        ganamas: "",
        diariomas: "",
        sami: "",
        ahorramigos: "",
        corresponsalSolidario: "",
        coofipay: "",
        inactivaGanamas: "",
        inactivaDiariomas: "",
        inactivaSami: "",
        inactivaAhorramigos: "",
        depositosAhorroContractual: "",
        certificadosDepositos: "",
        depositos: "",
        porcentajeIndicadorDisponible: "",
        porcentajeIndicadorFondoLiquidez: "",
        validacion: "",
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
    // Convert rows to export format
    const exportData = rows.map(row => ({
      Topes: formatCurrency(row.topes),
      Código: row.codigo,
      Oficina: row.oficina,
      "CAJA GENERAL PUC 110505": formatCurrency(row.cajaGeneral),
      "BANCOS Y OTRAS ENTIDADES FINANCIERAS PUC 1110": formatCurrency(row.bancos),
      "FONDOS FIDUCIARIOS A LA VISTA PUC 111515": formatCurrency(row.fondosFiduciarios),
      "REMESAS EN TRANSITO PUC 112045": formatCurrency(row.remesasTransito),
      "GANAMAS PUC 21050501": formatCurrency(row.ganamas),
      "DIARIOMAS PUC 21050502": formatCurrency(row.diariomas),
      "SAMI PUC 21050503": formatCurrency(row.sami),
      "AHORRAMIGOS PUC 21050504": formatCurrency(row.ahorramigos),
      "CORRESPONSAL SOLIDARIO PUC 21050505": formatCurrency(row.corresponsalSolidario),
      "COOFIPAY PUC 21050508": formatCurrency(row.coofipay),
      "INACTIVA GANAMAS PUC 21051001": formatCurrency(row.inactivaGanamas),
      "INACTIVA DIARIOMAS PUC 21051002": formatCurrency(row.inactivaDiariomas),
      "INACTIVA SAMI PUC 21051003": formatCurrency(row.inactivaSami),
      "INACATIVA AHORRAMIGOS PUC 21051004": formatCurrency(row.inactivaAhorramigos),
      "DEPOSITOS DE AHORRO CONTRACTUAL PUC 2125": formatCurrency(row.depositosAhorroContractual),
      "CERTIFICADOS DEPOSITOS DE AHORRO A TÉRMINO PUC 2110": formatCurrency(row.certificadosDepositos),
      "DEPOSITOS PUC 21": formatCurrency(row.depositos),
      "% INDICADOR DISPONIBLE": row.porcentajeIndicadorDisponible ? formatPercentage(row.porcentajeIndicadorDisponible) : "",
      "% INDICADOR FONDO LIQUIDEZ": row.porcentajeIndicadorFondoLiquidez ? formatPercentage(row.porcentajeIndicadorFondoLiquidez) : "",
      Validacion: formatCurrency(row.validacion),
    }));

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Seguimiento Liquidez"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "seguimiento-liquidez.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.oficina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatCurrency(row.topes)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Seguimiento de Liquidez
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por oficina, código o tope"
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
              <th className="p-2 border text-center whitespace-nowrap">ID</th>
              <th className="p-2 border text-center whitespace-nowrap">TOPES</th>
              <th className="p-2 border text-center whitespace-nowrap">CÓDIGO</th>
              <th className="p-2 border text-center whitespace-nowrap">OFICINA</th>
              <th className="p-2 border text-center whitespace-nowrap">CAJA GENERAL PUC 110505</th>
              <th className="p-2 border text-center whitespace-nowrap">BANCOS PUC 1110</th>
              <th className="p-2 border text-center whitespace-nowrap">FONDOS FIDUCIARIOS PUC 111515</th>
              <th className="p-2 border text-center whitespace-nowrap">REMESAS EN TRANSITO PUC 112045</th>
              <th className="p-2 border text-center whitespace-nowrap">GANAMAS PUC 21050501</th>
              <th className="p-2 border text-center whitespace-nowrap">DIARIOMAS PUC 21050502</th>
              <th className="p-2 border text-center whitespace-nowrap">SAMI PUC 21050503</th>
              <th className="p-2 border text-center whitespace-nowrap">AHORRAMIGOS PUC 21050504</th>
              <th className="p-2 border text-center whitespace-nowrap">CORRESPONSAL SOLIDARIO PUC 21050505</th>
              <th className="p-2 border text-center whitespace-nowrap">COOFIPAY PUC 21050508</th>
              <th className="p-2 border text-center whitespace-nowrap">INACTIVA GANAMAS PUC 21051001</th>
              <th className="p-2 border text-center whitespace-nowrap">INACTIVA DIARIOMAS PUC 21051002</th>
              <th className="p-2 border text-center whitespace-nowrap">INACTIVA SAMI PUC 21051003</th>
              <th className="p-2 border text-center whitespace-nowrap">INACTIVA AHORRAMIGOS PUC 21051004</th>
              <th className="p-2 border text-center whitespace-nowrap">DEPOSITOS AHORRO CONTRACTUAL PUC 2125</th>
              <th className="p-2 border text-center whitespace-nowrap">CERTIFICADOS DEPOSITOS PUC 2110</th>
              <th className="p-2 border text-center whitespace-nowrap">DEPOSITOS PUC 21</th>
              <th className="p-2 border text-center whitespace-nowrap">% INDICADOR DISPONIBLE</th>
              <th className="p-2 border text-center whitespace-nowrap">% INDICADOR FONDO LIQUIDEZ</th>
              <th className="p-2 border text-center whitespace-nowrap">VALIDACIÓN</th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-1 border text-center text-xs">{r.id}</td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.topes)}
                    onChange={e =>
                      handleChange(r.id, "topes", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-center">
                  <input
                    type="text"
                    value={r.codigo}
                    onChange={e => handleChange(r.id, "codigo", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-xs text-center"
                    placeholder="Código"
                  />
                </td>
                <td className="p-1 border text-left">
                  <input
                    type="text"
                    value={r.oficina}
                    onChange={e => handleChange(r.id, "oficina", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-xs"
                    placeholder="Oficina"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.cajaGeneral)}
                    onChange={e =>
                      handleChange(r.id, "cajaGeneral", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.bancos)}
                    onChange={e =>
                      handleChange(r.id, "bancos", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.fondosFiduciarios)}
                    onChange={e =>
                      handleChange(r.id, "fondosFiduciarios", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.remesasTransito)}
                    onChange={e =>
                      handleChange(r.id, "remesasTransito", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.ganamas)}
                    onChange={e =>
                      handleChange(r.id, "ganamas", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.diariomas)}
                    onChange={e =>
                      handleChange(r.id, "diariomas", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.sami)}
                    onChange={e =>
                      handleChange(r.id, "sami", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.ahorramigos)}
                    onChange={e =>
                      handleChange(r.id, "ahorramigos", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.corresponsalSolidario)}
                    onChange={e =>
                      handleChange(r.id, "corresponsalSolidario", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.coofipay)}
                    onChange={e =>
                      handleChange(r.id, "coofipay", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.inactivaGanamas)}
                    onChange={e =>
                      handleChange(r.id, "inactivaGanamas", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.inactivaDiariomas)}
                    onChange={e =>
                      handleChange(r.id, "inactivaDiariomas", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.inactivaSami)}
                    onChange={e =>
                      handleChange(r.id, "inactivaSami", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.inactivaAhorramigos)}
                    onChange={e =>
                      handleChange(r.id, "inactivaAhorramigos", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.depositosAhorroContractual)}
                    onChange={e =>
                      handleChange(r.id, "depositosAhorroContractual", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.certificadosDepositos)}
                    onChange={e =>
                      handleChange(r.id, "certificadosDepositos", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.depositos)}
                    onChange={e =>
                      handleChange(r.id, "depositos", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right font-semibold"
                    placeholder="$ 0,00"
                  />
                </td>
                <td className="p-1 border text-center">
                  <input
                    type="text"
                    value={r.porcentajeIndicadorDisponible ? formatPercentage(r.porcentajeIndicadorDisponible) : ""}
                    onChange={e =>
                      handleChange(r.id, "porcentajeIndicadorDisponible", e.target.value.replace("%", ""))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-center"
                    placeholder="0,00%"
                  />
                </td>
                <td className="p-1 border text-center">
                  <input
                    type="text"
                    value={r.porcentajeIndicadorFondoLiquidez ? formatPercentage(r.porcentajeIndicadorFondoLiquidez) : ""}
                    onChange={e =>
                      handleChange(r.id, "porcentajeIndicadorFondoLiquidez", e.target.value.replace("%", ""))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-center"
                    placeholder="0,00%"
                  />
                </td>
                <td className="p-1 border text-right">
                  <input
                    type="text"
                    value={formatCurrency(r.validacion)}
                    onChange={e =>
                      handleChange(r.id, "validacion", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-xs text-right font-semibold"
                    placeholder="$ 0,00"
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

