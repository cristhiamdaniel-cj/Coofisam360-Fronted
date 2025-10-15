import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";
import { FaFileUpload, FaRegFolderOpen } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { TbUpload } from "react-icons/tb";

export default function FinancieroDashboard() {
  return (
    <main className="container-financiero flex-col p-12 pt-4">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo pl-8">
        Formularios
      </h1>
      <div className="actions-container flex gap-4 pt-4">
        <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
          Cargar Balance
          <TbUpload />
          <input type="file" accept=".xlsx,.csv" className="hidden" />
        </label>
        <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
          Explorar
          <FaRegFolderOpen />
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
          href="/modulo-cartera/tabla-asignacion-llamadas"
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
          Asignación de llamadas
        </Link>
        <Link
          href="/modulo-cartera/tabla-gestion-llamadas"
          className="modulo-button"
        >
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
          Gestión de llamadas
        </Link>
        <Link href="/modulo-cartera/tabla-gestiones" className="modulo-button">
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
          Gestiones
        </Link>
        <Link
          href="/modulo-cartera/tabla-link-llamadas"
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
          Link de llamadas
        </Link>
        <Link
          href="/modulo-cartera/tabla-link-visitas"
          className="modulo-button"
        >
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
          Link de visitas
        </Link>
        <Link
          href="/modulo-cartera/tabla-seguimiento-campanas"
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
          Seguimiento de campañas
        </Link>
      </div>
    </main>
  );
}
