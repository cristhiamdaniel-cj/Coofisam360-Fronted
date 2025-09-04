import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";
import { FaFileUpload } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

export default function FinancieroDashboard() {
  return (
    <main className="container-financiero flex-col p-12">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo">
        Formularios
      </h1>
      <div className="actions-container flex gap-4 pt-12">
        <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
          Cargar Balance
          <FaFileUpload />
          <input type="file" accept=".xlsx,.csv" className="hidden" />
        </label>
        <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
          Cargar Presupuesto
          <FaFileUpload />
          <input type="file" accept=".xlsx,.csv" className="hidden" />
        </label>
        <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
          Ejecutar
          <FaPlay />
          <input type="file" accept=".xlsx,.csv" className="hidden" />
        </label>
      </div>
      <div className="separator-modulo"></div>
      <div className="dashboard-financiero">
        <Link
          href="/modulo-financiero/tabla-indicadores"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/indicadores.svg" // Path relative to /public
              className="module-image"
              alt="Company Logo"
              width={200} // required
              height={50} // required
              priority // loads immediately
            />
          </div>
          Indicadores financieros
        </Link>
        <Link href="/modulo-financiero/tabla-cupos" className="modulo-button">
          <div className="logo">
            <Image
              src="/aprobacion-de-prestamo.png" // Path relative to /public
              className="module-image"
              alt="Company Logo"
              width={200} // required
              height={50} // required
              priority // loads immediately
            />
          </div>
          Cupos Credito
        </Link>
        <Link
          href="/modulo-financiero/tabla-categorias"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/oficina.png" // Path relative to /public
              className="module-image"
              alt="Company Logo"
              width={200} // required
              height={50} // required
              priority // loads immediately
            />
          </div>
          Categorias Oficinas
        </Link>
      </div>
    </main>
  );
}
