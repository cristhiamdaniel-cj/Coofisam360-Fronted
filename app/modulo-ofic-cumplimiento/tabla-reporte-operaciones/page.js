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

// Helper function to convert time string to time input format
// Format: HH:MM -> HH:MM
const toTimeInput = (timeStr) => {
  if (!timeStr) return "";
  return timeStr;
};

// Initial data - empty rows for new entries
const initialRows = [
  {
    id: 1,
    fecha: "",
    hora: "",
    documentoIdentificacion: "",
    nombre: "",
    agenciaProducto: "",
    linea: "",
    tipo: "",
    nombreProducto: "",
    tipoFormato: "",
    valorDeclarado: "",
    consecutivoFormato: "",
    estado: "",
    usuarioAgencia: "",
    origenDestino: "",
    tipoDocumentoPersona: "",
    identificacionPersona: "",
    nombresPersona: "",
    apellidosPersona: "",
    telefonoPersona: "",
    tipoDocumentoBeneficiario: "",
    identificacionBeneficiario: "",
    nombreBeneficiario: "",
    direccionBeneficiario: "",
    telefonoBeneficiario: "",
    motivoAnulacion: "",
    usuarioAnulacion: "",
    tipoOperacion: "",
  },
];

// Options for dropdowns
const agenciaProductoOptions = [
  "Oficina garzon",
  "Oficina suaza",
  "Oficina hobo",
  "Oficina acevedo",
  "Oficina tarqui",
  "Oficina pitalito",
  "Oficina saladoblanco",
  "Oficina rivera",
  "Oficina la plata",
  "Oficina el pital",
  "Oficina neiva",
  "Oficina guadalupe",
  "Oficina gigante",
  "Oficina espinal",
  "Oficina planadas",
  "Oficina iquira",
  "Oficina la argentina",
  "Oficina chaparral",
  "Oficina florencia",
];

const lineaOptions = [
  "AHORROS",
  "CREDITOS",
  "APORTES",
  "AHORROS- CREDITOS",
  "APORTES- CREDITOS",
  "APORTES- AHORROS",
  "CONVENIOS",
  "AHORROS- CREDITOS- CREDITOS",
  "APORTES- AHORROS- AHORROS",
  "AHORROS- AHORROS",
];

const tipoOptions = [
  "A LA VISTA",
  "CONSUMO",
  "APORTES ORDINARIOS",
  "PRODUCTIVO",
  "CONTRACTUAL",
  "COMERCIAL",
  "A TERMINO",
  "MICROCREDITO",
  "SEGUROS",
  "VIVIENDA",
  "APORTES ORDINARIOS- A LA VISTA",
  "A LA VISTA- CONSUMO",
  "A LA VISTA- PRODUCTIVO",
  "APORTES ORDINARIOS- A TERMINO",
  "A LA VISTA- A TERMINO",
  "A LA VISTA- CONSUMO- PRODUCTIVO",
  "APORTES ORDINARIOS- A LA VISTA- A TERMINO",
  "A LA VISTA- CONSUMO- CONSUMO",
  "A LA VISTA- CONTRACTUAL",
  "CONTRACTUAL- PRODUCTIVO",
  "A LA VISTA- A LA VISTA",
  "A LA VISTA- COMERCIAL",
  "GANAMAS- CON LIBRE INVERSION",
  "APORTES SOCIALES- PRO POP. PROD RURAL AGROPECUARIO",
  "COM CONSUMO AGROPECUARIO",
  "APORTES SOCIALES- DIARIOMAS",
  "GANAMAS- MIC AGRICOLA CONSUMO",
  "PRO POP. PROD RURAL AGROPECUARIO",
  "PRO PROD.RURAL OTRAS INVERSIONES",
  "APORTES SOCIALES- GANAMAS",
  "CON CAMPAÑA LIBRANZA",
  "COM FINAGRO MEDIANO PRODUCTOR",
  "PRO PROD.MAYOR MONTO REDESCUENTO IBR MED.PRODUCTOR",
  "PRO PROD.URBANO FINAGRO EMPRESARIAL 28%",
  "MIC BANCOLDEX TASA FIJA",
  "PRO PROD. RURAL EMPRESARIAL",
  "PRO POP. PROD  RURAL COOFIMASPROG",
  "PROGRAMADO MICROFINANZAS",
  "PRO PROD.URBANO OTRAS INVERSIONES",
  "COM FOMENTO EMPRESARIAL INFIHUILA",
  "CXC SEGURO HIPOTECARIO",
  "GANAMAS- PRO POP.PROD.RURAL OTRAS INVERSIONES",
];

const nombreProductoOptions = [
  "DIARIOMAS",
  "CUPO ROTATIVO CORTE 5",
  "GANAMAS",
  "SAMI",
  "APORTES SOCIALES",
  "PRO PROD.RURAL AGROPECUARIO",
  "COSO",
  "PROGRAMADO LIBRE INVERSION",
  "PRO MAYOR MONTO CAMPAÑA",
  "CDAT",
  "CON LIBRE INVERSION",
  "AHORRAMIGO",
  "CON CAMPAÑA ASALARIADOS",
  "PRO PROD.MAYOR MONTO AGROPECUARIO",
  "CUPO ROTATIVO CORTE 20",
  "PRO PROD. RURAL COOFIMASPROG",
  "COM BANCOLDEX TASA FIJA",
  "PRO PROD.MAYOR MONTO OTRAS INVERSIONES",
  "COM AGROPECUARIO",
  "PRO URBANO CAMPAÑA",
  "PRO PROD.MAYOR MONTO EMPRESARIAL",
  "MIC AGROPECUARIO",
  "CON CONSOLIDA TUS DEUDAS OFICIAL Y PENSIONADO",
  "PRO PROD.MAYOR MONTO FINAGRO IBR PEQ.PRODUCTOR",
  "PRO POP. PROD RURAL AGROPECUARIO",
  "COM CONSUMO AGROPECUARIO",
  "MIC AGRICOLA CONSUMO",
  "PRO PROD.RURAL OTRAS INVERSIONES",
  "CON CAMPAÑA LIBRANZA",
  "COM FINAGRO MEDIANO PRODUCTOR",
  "PRO PROD.MAYOR MONTO REDESCUENTO IBR MED.PRODUCTOR",
  "PRO PROD.URBANO FINAGRO EMPRESARIAL 28%",
  "MIC BANCOLDEX TASA FIJA",
  "PRO PROD. RURAL EMPRESARIAL",
  "PRO POP. PROD  RURAL COOFIMASPROG",
  "PROGRAMADO MICROFINANZAS",
  "PRO PROD.URBANO OTRAS INVERSIONES",
  "COM FOMENTO EMPRESARIAL INFIHUILA",
  "CXC SEGURO HIPOTECARIO",
  "PRO POP.PROD.RURAL OTRAS INVERSIONES",
];

const tipoFormatoOptions = ["Automático", "Manual"];

const estadoOptions = ["Activa", "Anulada"];

const usuarioAgenciaOptions = [
  "SORAYA MARIA POLO QUESADA ",
  "BIBIANA CONSTANZA ZAMBRANO ROJAS ",
  "YENNY FERNANDA MOTTA CUELLAR ",
  "ANGEE YOJANNA LOSADA CAMACHO ",
  "JUAN DAVID CUELTAN BARRERA ",
  "MARBELIS CUELLAR TOVAR",
  "Yurany Ruiz Uni",
  "Maria Juliana Hernandez Ramirez",
  "Maricela Leiva Trujillo",
  "YOLIMA PEREZ DURAN ",
  "Yurany Vega Olis",
  "Isabel Cristina Rojas Ninco",
  "RODOLFO TOVAR STERLING ",
  "JHON ALEXANDER VANEGAS CHAVEZ ",
  "Paula Andrea Cupitra Cadena",
  "YULIETH TATIANA ANDRADE DEVIA",
  "ESPERANZA OSSO ANDRADE ",
  "Lucia Muñoz Ramirez",
  "YURY ALEXANDRA LARA LOPEZ",
  "LUCY DEL SOCORRO DIAZ ARIZA ",
  "ANGELICA MARIA HURTADO CASTILLO ",
  "LORENA ALVAREZ MORA",
  "JEIN CLAROS ROMERO ",
  "HAROL CERQUERA ",
  "MAURICIO PARRA MORA ",
  "MILTON ALEXIS GUARNIZO TRUJILLO ",
  "VICTOR ALFONSO ANDRADE DIAZ ",
  "MARIA CAMILA PUENTES MENDEZ ",
  "SORAYA HIGUITA CARDONA ",
  "EVELY CASTRO ORTIZ ",
  "LIDA SOFIA MOSQUERA MOSQUERA ",
  "Laura Nataly Castillo Vargas",
  "VICTOR ALFONSO RINCON TRIANA ",
  "Yennifer Cruz Rayo",
  "Nancy Alejandra Bonilla Gonzalez",
  "Yudy Marcela Rodriguez Cordoba",
  "HOLLMAN YAMID PEREZ YUNDA ",
  "CARLOS AUGUSTO OSPINA LUGO ",
  "VIVIANA HOYOS MEDINA",
  "Alexandra Maria Paredes Navia",
  "JERSON DANILO CASTRO AGUIRRE ",
  "NATHALIA ANDREA MUÑOZ MEDINA ",
  "MARIA ALEJANDRA MOTTA ESCOBAR ",
  "ENRRIQUE TORRES BETANCOURT ",
];

const tipoDocumentoPersonaOptions = ["C", "E", "N", "I"];

const tipoDocumentoBeneficiarioOptions = ["C", "E", "N", "I"];

const motivoAnulacionOptions = [
  "Transacción no realizada con éxito",
  "Error en digitación de información",
  "Transacción Reversada",
  "Formato duplicado",
];

const tipoOperacionOptions = [
  "Consignación",
  "Retiro",
  "Transferencia",
  "Pago",
  "Apertura",
  "Cierre",
  "Otro",
];

export default function ReporteOperacionesTable() {
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
        fecha: "",
        hora: "",
        documentoIdentificacion: "",
        nombre: "",
        agenciaProducto: "",
        linea: "",
        tipo: "",
        nombreProducto: "",
        tipoFormato: "",
        valorDeclarado: "",
        consecutivoFormato: "",
        estado: "",
        usuarioAgencia: "",
        origenDestino: "",
        tipoDocumentoPersona: "",
        identificacionPersona: "",
        nombresPersona: "",
        apellidosPersona: "",
        telefonoPersona: "",
        tipoDocumentoBeneficiario: "",
        identificacionBeneficiario: "",
        nombreBeneficiario: "",
        direccionBeneficiario: "",
        telefonoBeneficiario: "",
        motivoAnulacion: "",
        usuarioAnulacion: "",
        tipoOperacion: "",
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
      "Reporte Operaciones"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "reporte-operaciones.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.documentoIdentificacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.agenciaProducto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.identificacionPersona?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Reporte de Operaciones
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, documento, agencia o identificación"
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
              <th className="p-4 border text-center whitespace-nowrap">FECHA</th>
              <th className="p-4 border text-center whitespace-nowrap">HORA</th>
              <th className="p-4 border text-center whitespace-nowrap">
                DOCUMENTO IDENTIFICACION
              </th>
              <th className="p-4 border text-center whitespace-nowrap">NOMBRE</th>
              <th className="p-4 border text-center whitespace-nowrap">
                AGENCIA PRODUCTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">LINEA</th>
              <th className="p-4 border text-center whitespace-nowrap">TIPO</th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRE PRODUCTO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO FORMATO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                VALOR DECLARADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CONSECUTIVO FORMATO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">ESTADO</th>
              <th className="p-4 border text-center whitespace-nowrap">
                USUARIO AGENCIA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                ORIGEN DESTINO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DOCUMENTO PERSONA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                IDENTIFICACION PERSONA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRES PERSONA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                APELLIDOS PERSONA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TELEFONO PERSONA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DOCUMENTO BENEFICIARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                IDENTIFICACION BENEFICIARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRE BENEFICIARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                DIRECCION BENEFICIARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TELEFONO BENEFICIARIO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                MOTIVO ANULACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                USUARIO ANULACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO OPERACION
              </th>
            </tr>
          </thead>

          <tbody className="tabla-cupos-content p-4">
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border text-left">
                  <input
                    type="date"
                    value={toDateInput(r.fecha)}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "fecha",
                        fromDateInput(e.target.value)
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="time"
                    value={toTimeInput(r.hora)}
                    onChange={e =>
                      handleChange(r.id, "hora", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.documentoIdentificacion}
                    onChange={e =>
                      handleChange(r.id, "documentoIdentificacion", e.target.value)
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
                  <select
                    value={r.agenciaProducto}
                    onChange={e =>
                      handleChange(r.id, "agenciaProducto", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {agenciaProductoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.linea}
                    onChange={e => handleChange(r.id, "linea", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {lineaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipo}
                    onChange={e => handleChange(r.id, "tipo", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.nombreProducto}
                    onChange={e =>
                      handleChange(r.id, "nombreProducto", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {nombreProductoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoFormato}
                    onChange={e =>
                      handleChange(r.id, "tipoFormato", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoFormatoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.valorDeclarado}
                    onChange={e =>
                      handleChange(r.id, "valorDeclarado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Valor"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="number"
                    value={r.consecutivoFormato}
                    onChange={e =>
                      handleChange(r.id, "consecutivoFormato", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Consecutivo"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.estado}
                    onChange={e => handleChange(r.id, "estado", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {estadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.usuarioAgencia}
                    onChange={e =>
                      handleChange(r.id, "usuarioAgencia", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {usuarioAgenciaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.origenDestino}
                    onChange={e =>
                      handleChange(r.id, "origenDestino", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Origen/Destino"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoDocumentoPersona}
                    onChange={e =>
                      handleChange(r.id, "tipoDocumentoPersona", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoDocumentoPersonaOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.identificacionPersona}
                    onChange={e =>
                      handleChange(r.id, "identificacionPersona", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Identificación"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nombresPersona}
                    onChange={e =>
                      handleChange(r.id, "nombresPersona", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Nombres"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.apellidosPersona}
                    onChange={e =>
                      handleChange(r.id, "apellidosPersona", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Apellidos"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.telefonoPersona}
                    onChange={e =>
                      handleChange(r.id, "telefonoPersona", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Teléfono"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoDocumentoBeneficiario}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "tipoDocumentoBeneficiario",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoDocumentoBeneficiarioOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.identificacionBeneficiario}
                    onChange={e =>
                      handleChange(
                        r.id,
                        "identificacionBeneficiario",
                        e.target.value
                      )
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Identificación"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nombreBeneficiario}
                    onChange={e =>
                      handleChange(r.id, "nombreBeneficiario", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Nombre"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.direccionBeneficiario}
                    onChange={e =>
                      handleChange(r.id, "direccionBeneficiario", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Dirección"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.telefonoBeneficiario}
                    onChange={e =>
                      handleChange(r.id, "telefonoBeneficiario", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Teléfono"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.motivoAnulacion}
                    onChange={e =>
                      handleChange(r.id, "motivoAnulacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {motivoAnulacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.usuarioAnulacion}
                    onChange={e =>
                      handleChange(r.id, "usuarioAnulacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Usuario"
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


