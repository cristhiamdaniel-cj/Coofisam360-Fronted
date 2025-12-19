"use client";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

// Initial data - empty rows for new entries
const initialRows = [
  {
    id: 1,
    ano: "",
    mes: "",
    oficinaAsociado: "",
    oficinaTransaccion: "",
    consecutivoFoco05: "",
    nitCedula: "",
    razonSocialNombre: "",
    observaciones: "",
    tipoObservacion: "",
    nombreTrabajador: "",
    usuarioTrabajador: "",
  },
];

// Options for dropdowns
const oficinaAsociadoOptions = [
  "GARZON",
  "GUADALUPE",
  "EL PITAL",
  "GIGANTE",
  "ACEVEDO",
  "TARQUI",
  "LA PLATA",
  "PITALITO",
  "SUAZA",
  "LA ARGENTINA",
  "NEIVA",
  "RIVERA",
  "HOBO",
  "IQUIRA",
  "SALADOBLANCO",
  "ESPINAL",
  "PLANADAS",
  "CHAPARRAL",
  "FLORENCIA",
];

const oficinaTransaccionOptions = [
  "GARZON",
  "GUADALUPE",
  "EL PITAL",
  "GIGANTE",
  "ACEVEDO",
  "TARQUI",
  "LA PLATA",
  "PITALITO",
  "SUAZA",
  "LA ARGENTINA",
  "NEIVA",
  "RIVERA",
  "HOBO",
  "IQUIRA",
  "SALADOBLANCO",
  "ESPINAL",
  "PLANADAS",
  "CHAPARRAL",
  "FLORENCIA",
];

const observacionesOptions = [
  "Anulación de FOCO-05 fisico por mal diligenciamiento de información",
  "Formulario con espacios por diligenciar",
  "Diligenciamiento fisico por omisión de empleado",
  "Tachones y enmendaduras",
  "Información inconsistente",
  "Formato fisico anulado por diligenciamiento en el core",
  "Anulación de FOCO-05 digital por mal diligenciamiento de información",
  "Origen/ Destino sin contexto",
  "",
];

const tipoObservacionOptions = ["Manual", "Digital", ""];

const nombreTrabajadorOptions = [
  "LYDA FERNANDA JIMENEZ FIERRO",
  "JORGE EDUARDO TELLO PERDOMO",
  "GERARDO BUENDIA CHICUE",
  "DIEGO MAURICIO SANTOS ZUÑIGA",
  "RAMIRO PINEDA MARIN",
  "JESÚS ALBERTO OCHOA BELTRÁN",
  "HAINNER ESTIVINSON COSSIO RENGIFO",
  "ALEXANDER RIVERA DIAZ",
  "JAVIER LIZCANO QUEVEDO",
  "ALVARO VARON PINEDA",
  "HECTOR RAMIREZ VARGAS",
  "HAROL CERQUERA",
  "HOLLMAN YAMID PEREZ YUNDA",
  "Usuario genérico administrativo",
  "WILBER ALEIXER POLANIA RUIZ",
  "JUAN MANUEL JURADO VODNIZA",
  "CARLOS AUGUSTO MEJIA HOYOS",
  "MAURICIO LUNA ARANGO",
  "LUCY DEL SOCORRO DIAZ ARIZA",
  "YOLANDA CASTELLANOS CAMARGO",
  "YENY LINDSAY TIRADO GOMEZ",
];

const usuarioTrabajadorOptions = [
  "LYDA",
  "JOTE",
  "GEBU",
  "DIMA",
  "adminsw",
  "RAPI",
  "JEOC",
  "HACO",
  "ALRI",
  "JALI",
  "ALVA",
  "HERA",
  "HACE",
  "HOPE",
  "OperacionRed",
  "WIPO",
  "JUJU",
  "CAME",
  "MAUR",
  "LUDI",
  "YOLA",
  "YETI",
];

const mesOptions = [
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

export default function SeguimientoTable() {
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
        ano: "",
        mes: "",
        oficinaAsociado: "",
        oficinaTransaccion: "",
        consecutivoFoco05: "",
        nitCedula: "",
        razonSocialNombre: "",
        observaciones: "",
        tipoObservacion: "",
        nombreTrabajador: "",
        usuarioTrabajador: "",
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
      "Seguimiento"
    );

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "seguimiento.xlsx");
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(
    row =>
      row.nitCedula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.razonSocialNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.oficinaAsociado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.consecutivoFoco05?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-4 pb-0 px-12 overflow-auto">
      <h1 className="titulo-tabla-cupos text-3xl font-semibold pb-4">
        Seguimiento
      </h1>
      <div className="actions-container flex justify-between mb-4">
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Buscar por NIT/Cédula, razón social, oficina o consecutivo"
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
              <th className="p-4 border text-center whitespace-nowrap">MES</th>
              <th className="p-4 border text-center whitespace-nowrap">
                OFICINA ASOCIADO
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                OFICINA TRANSACCION
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                CONSECUTIVO FOCO-05
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NIT/CÉDULA
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                RAZON SOCIAL/NOMBRE
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                OBSERVACIONES
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                TIPO DE OBSERVACIÓN
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                NOMBRE DEL TRABAJADOR
              </th>
              <th className="p-4 border text-center whitespace-nowrap">
                USUARIO DEL TRABAJADOR
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
                    value={r.mes}
                    onChange={e => handleChange(r.id, "mes", e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {mesOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.oficinaAsociado}
                    onChange={e =>
                      handleChange(r.id, "oficinaAsociado", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {oficinaAsociadoOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.oficinaTransaccion}
                    onChange={e =>
                      handleChange(r.id, "oficinaTransaccion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {oficinaTransaccionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.consecutivoFoco05}
                    onChange={e =>
                      handleChange(r.id, "consecutivoFoco05", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Consecutivo FOCO-05"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.nitCedula}
                    onChange={e =>
                      handleChange(r.id, "nitCedula", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="NIT/Cédula"
                  />
                </td>
                <td className="p-2 border text-left">
                  <input
                    type="text"
                    value={r.razonSocialNombre}
                    onChange={e =>
                      handleChange(r.id, "razonSocialNombre", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                    placeholder="Razón Social/Nombre"
                  />
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.observaciones}
                    onChange={e =>
                      handleChange(r.id, "observaciones", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {observacionesOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.tipoObservacion}
                    onChange={e =>
                      handleChange(r.id, "tipoObservacion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {tipoObservacionOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion || "(Vacío)"}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.nombreTrabajador}
                    onChange={e =>
                      handleChange(r.id, "nombreTrabajador", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {nombreTrabajadorOptions.map(opcion => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-left">
                  <select
                    value={r.usuarioTrabajador}
                    onChange={e =>
                      handleChange(r.id, "usuarioTrabajador", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {usuarioTrabajadorOptions.map(opcion => (
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


