"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Helper function to convert date string to date input format
const toDateInput = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

// Helper function to convert date input to date string
const fromDateInput = (dateInputStr) => {
  if (!dateInputStr) return "";
  const [year, month, day] = dateInputStr.split("-");
  return `${day}/${month}/${year}`;
};

// Helper function to format number with dots as thousands separator
const formatNumber = (num) => {
  if (!num) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Helper function to parse number (remove dots)
const parseNumber = (str) => {
  if (!str) return "";
  return str.toString().replace(/\./g, "");
};

// Initial data
const initialRows = [
  {
    id: 1,
    dia: "01/01/2020",
    ganamas: "24677208127",
    diariomas: "18528393767",
    sami: "1974121157",
    ahorramigos: "595538433",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45775261485",
    variacion: "1,00",
  },
  {
    id: 2,
    dia: "04/01/2020",
    ganamas: "24113600264",
    diariomas: "18421124484",
    sami: "1961381048",
    ahorramigos: "598987770",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45095093566",
    variacion: "0,99",
  },
  {
    id: 3,
    dia: "05/01/2020",
    ganamas: "24259350804",
    diariomas: "18573672180",
    sami: "1971320540",
    ahorramigos: "614592500",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45418936024",
    variacion: "1,01",
  },
  {
    id: 4,
    dia: "06/01/2020",
    ganamas: "24212837429",
    diariomas: "18657213247",
    sami: "2007946965",
    ahorramigos: "614771741",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45492769383",
    variacion: "1,00",
  },
  {
    id: 5,
    dia: "07/01/2020",
    ganamas: "24184339408",
    diariomas: "18603663190",
    sami: "1997534394",
    ahorramigos: "614465706",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45400002698",
    variacion: "1,00",
  },
  {
    id: 6,
    dia: "08/01/2020",
    ganamas: "24068410543",
    diariomas: "18610765253",
    sami: "1991537660",
    ahorramigos: "619418555",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45290132011",
    variacion: "1,00",
  },
  {
    id: 7,
    dia: "10/01/2020",
    ganamas: "24015912005",
    diariomas: "18681993488",
    sami: "1984060769",
    ahorramigos: "622567365",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45304533628",
    variacion: "1,00",
  },
  {
    id: 8,
    dia: "11/01/2020",
    ganamas: "23997872015",
    diariomas: "18713693240",
    sami: "1984964932",
    ahorramigos: "621301900",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45317832087",
    variacion: "1,00",
  },
  {
    id: 9,
    dia: "12/01/2020",
    ganamas: "23772640325",
    diariomas: "18576677054",
    sami: "1986049865",
    ahorramigos: "619308585",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44954675829",
    variacion: "0,99",
  },
  {
    id: 10,
    dia: "13/01/2020",
    ganamas: "23581533843",
    diariomas: "18856244484",
    sami: "1977591025",
    ahorramigos: "621683143",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45037052496",
    variacion: "1,00",
  },
  {
    id: 11,
    dia: "14/01/2020",
    ganamas: "23604522639",
    diariomas: "18868939923",
    sami: "1990789493",
    ahorramigos: "616569726",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45080821781",
    variacion: "1,00",
  },
  {
    id: 12,
    dia: "15/01/2020",
    ganamas: "23727943936",
    diariomas: "18754805470",
    sami: "1995984040",
    ahorramigos: "615404794",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45094138241",
    variacion: "1,00",
  },
  {
    id: 13,
    dia: "17/01/2020",
    ganamas: "23377030347",
    diariomas: "18730342183",
    sami: "2001191334",
    ahorramigos: "617005453",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44725569317",
    variacion: "0,99",
  },
  {
    id: 14,
    dia: "18/01/2020",
    ganamas: "23245753102",
    diariomas: "18779645392",
    sami: "2010651113",
    ahorramigos: "618967649",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44655017256",
    variacion: "1,00",
  },
  {
    id: 15,
    dia: "19/01/2020",
    ganamas: "23249843849",
    diariomas: "18780122047",
    sami: "2014672464",
    ahorramigos: "617304069",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44661942429",
    variacion: "1,00",
  },
  {
    id: 16,
    dia: "20/01/2020",
    ganamas: "23090452126",
    diariomas: "18722030189",
    sami: "2020721534",
    ahorramigos: "616754794",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44449958643",
    variacion: "1,00",
  },
  {
    id: 17,
    dia: "21/01/2020",
    ganamas: "23219934705",
    diariomas: "18699967040",
    sami: "2018564709",
    ahorramigos: "622228194",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44560694648",
    variacion: "1,00",
  },
  {
    id: 18,
    dia: "22/01/2020",
    ganamas: "23168248852",
    diariomas: "18595283082",
    sami: "2021246030",
    ahorramigos: "621183167",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44405961131",
    variacion: "1,00",
  },
  {
    id: 19,
    dia: "24/01/2020",
    ganamas: "23089551631",
    diariomas: "18573434206",
    sami: "2016899919",
    ahorramigos: "617008135",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44296893891",
    variacion: "1,00",
  },
  {
    id: 20,
    dia: "25/01/2020",
    ganamas: "23218884230",
    diariomas: "18458536959",
    sami: "1990049248",
    ahorramigos: "615527679",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44282998117",
    variacion: "1,00",
  },
  {
    id: 21,
    dia: "26/01/2020",
    ganamas: "23322431175",
    diariomas: "18097496067",
    sami: "2005685620",
    ahorramigos: "615710640",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44041323503",
    variacion: "0,99",
  },
  {
    id: 22,
    dia: "27/01/2020",
    ganamas: "23843658624",
    diariomas: "18131470079",
    sami: "2006348660",
    ahorramigos: "617036975",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44598514339",
    variacion: "1,01",
  },
  {
    id: 23,
    dia: "28/01/2020",
    ganamas: "24283208406",
    diariomas: "18096672234",
    sami: "2023354106",
    ahorramigos: "612782265",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "45016017012",
    variacion: "1,01",
  },
  {
    id: 24,
    dia: "29/01/2020",
    ganamas: "23890250866",
    diariomas: "17923132227",
    sami: "2008187022",
    ahorramigos: "619212763",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44440782878",
    variacion: "0,99",
  },
  {
    id: 25,
    dia: "31/01/2020",
    ganamas: "23670854591",
    diariomas: "18007019896",
    sami: "2013309399",
    ahorramigos: "622050894",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "44313234780",
    variacion: "1,00",
  },
  {
    id: 26,
    dia: "01/02/2020",
    ganamas: "23533375620",
    diariomas: "17847802492",
    sami: "2018894933",
    ahorramigos: "583989953",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43984062998",
    variacion: "0,99",
  },
  {
    id: 27,
    dia: "02/02/2020",
    ganamas: "23246196895",
    diariomas: "17660015214",
    sami: "2021383293",
    ahorramigos: "582682289",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43510277691",
    variacion: "0,99",
  },
  {
    id: 28,
    dia: "03/02/2020",
    ganamas: "23376735546",
    diariomas: "17929572575",
    sami: "2020684306",
    ahorramigos: "583489653",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43910482080",
    variacion: "1,01",
  },
  {
    id: 29,
    dia: "04/02/2020",
    ganamas: "23275702563",
    diariomas: "17859636143",
    sami: "2016301072",
    ahorramigos: "585855121",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43737494899",
    variacion: "1,00",
  },
  {
    id: 30,
    dia: "05/02/2020",
    ganamas: "23090812140",
    diariomas: "17733236303",
    sami: "2006741255",
    ahorramigos: "580346923",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43411136622",
    variacion: "0,99",
  },
  {
    id: 31,
    dia: "07/02/2020",
    ganamas: "22902432198",
    diariomas: "17651646558",
    sami: "1996589325",
    ahorramigos: "590846279",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43141514360",
    variacion: "0,99",
  },
  {
    id: 32,
    dia: "08/02/2020",
    ganamas: "22672242068",
    diariomas: "17593732307",
    sami: "1995880216",
    ahorramigos: "604557651",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "42866412242",
    variacion: "0,99",
  },
  {
    id: 33,
    dia: "09/02/2020",
    ganamas: "22812253577",
    diariomas: "17611268451",
    sami: "1990688725",
    ahorramigos: "604483227",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43018693980",
    variacion: "1,00",
  },
  {
    id: 34,
    dia: "10/02/2020",
    ganamas: "22896948353",
    diariomas: "17738922123",
    sami: "1997162073",
    ahorramigos: "613902804",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43246935353",
    variacion: "1,01",
  },
  {
    id: 35,
    dia: "11/02/2020",
    ganamas: "22823689190",
    diariomas: "17748977326",
    sami: "1995560723",
    ahorramigos: "612651127",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43180878367",
    variacion: "1,00",
  },
  {
    id: 36,
    dia: "12/02/2020",
    ganamas: "22749258951",
    diariomas: "17674407921",
    sami: "2009380506",
    ahorramigos: "608998861",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43042046239",
    variacion: "1,00",
  },
  {
    id: 37,
    dia: "14/02/2020",
    ganamas: "22850783857",
    diariomas: "17457733498",
    sami: "2024191748",
    ahorramigos: "608521071",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "42941230174",
    variacion: "1,00",
  },
  {
    id: 38,
    dia: "15/02/2020",
    ganamas: "23020464029",
    diariomas: "17377713987",
    sami: "2028973717",
    ahorramigos: "608613432",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43035765166",
    variacion: "1,00",
  },
  {
    id: 39,
    dia: "16/02/2020",
    ganamas: "23298082896",
    diariomas: "17604149416",
    sami: "2029571465",
    ahorramigos: "603288847",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43535092624",
    variacion: "1,01",
  },
  {
    id: 40,
    dia: "17/02/2020",
    ganamas: "22910930457",
    diariomas: "17606237407",
    sami: "2026643519",
    ahorramigos: "601452273",
    corresponsal: "",
    coofipay: "",
    totalALaVista: "43145263656",
    variacion: "0,99",
  },
];

export default function HistoricoAhorrosTable() {
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
        dia: "",
        ganamas: "",
        diariomas: "",
        sami: "",
        ahorramigos: "",
        corresponsal: "",
        coofipay: "",
        totalALaVista: "",
        variacion: "",
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
      DIA: row.dia,
      GANAMAS: formatNumber(row.ganamas),
      DIARIOMAS: formatNumber(row.diariomas),
      SAMI: formatNumber(row.sami),
      AHORRAMIGOS: formatNumber(row.ahorramigos),
      CORRESPONSAL: row.corresponsal || "",
      COOFIPAY: row.coofipay || "",
      "TOTAL A LA VISTA": formatNumber(row.totalALaVista),
      VARIACION: row.variacion,
    }));

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Histórico Ahorros"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "historico-ahorros.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.dia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatNumber(row.ganamas)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatNumber(row.totalALaVista)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Histórico de Ahorros
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por fecha, GANAMAS o total"
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
              <th className="p-4 border text-center whitespace-nowrap">DÍA</th>
              <th className="p-4 border text-center whitespace-nowrap">GANAMAS</th>
              <th className="p-4 border text-center whitespace-nowrap">DIARIOMAS</th>
              <th className="p-4 border text-center whitespace-nowrap">SAMI</th>
              <th className="p-4 border text-center whitespace-nowrap">AHORRAMIGOS</th>
              <th className="p-4 border text-center whitespace-nowrap">CORRESPONSAL</th>
              <th className="p-4 border text-center whitespace-nowrap">COOFIPAY</th>
              <th className="p-4 border text-center whitespace-nowrap">TOTAL A LA VISTA</th>
              <th className="p-4 border text-center whitespace-nowrap">VARIACIÓN</th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-center">
                  <input
                    type="date"
                    value={toDateInput(r.dia)}
                    onChange={e =>
                      handleChange(r.id, "dia", fromDateInput(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                  />
                </td>
                <td className="p-2 border text-right">
                  <input
                    type="text"
                    value={formatNumber(r.ganamas)}
                    onChange={e =>
                      handleChange(r.id, "ganamas", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-right"
                    placeholder="0"
                  />
                </td>
                <td className="p-2 border text-right">
                  <input
                    type="text"
                    value={formatNumber(r.diariomas)}
                    onChange={e =>
                      handleChange(r.id, "diariomas", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-right"
                    placeholder="0"
                  />
                </td>
                <td className="p-2 border text-right">
                  <input
                    type="text"
                    value={formatNumber(r.sami)}
                    onChange={e =>
                      handleChange(r.id, "sami", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-right"
                    placeholder="0"
                  />
                </td>
                <td className="p-2 border text-right">
                  <input
                    type="text"
                    value={formatNumber(r.ahorramigos)}
                    onChange={e =>
                      handleChange(r.id, "ahorramigos", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-right"
                    placeholder="0"
                  />
                </td>
                <td className="p-2 border text-right">
                  <input
                    type="text"
                    value={formatNumber(r.corresponsal)}
                    onChange={e =>
                      handleChange(r.id, "corresponsal", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-right"
                    placeholder="0"
                  />
                </td>
                <td className="p-2 border text-right">
                  <input
                    type="text"
                    value={formatNumber(r.coofipay)}
                    onChange={e =>
                      handleChange(r.id, "coofipay", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-right"
                    placeholder="0"
                  />
                </td>
                <td className="p-2 border text-right">
                  <input
                    type="text"
                    value={formatNumber(r.totalALaVista)}
                    onChange={e =>
                      handleChange(r.id, "totalALaVista", parseNumber(e.target.value))
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-right font-semibold"
                    placeholder="0"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="text"
                    value={r.variacion}
                    onChange={e =>
                      handleChange(r.id, "variacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm text-center"
                    placeholder="0,00"
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



