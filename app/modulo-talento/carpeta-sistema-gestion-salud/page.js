import "../../styles/global.css";
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

      <div className="separator-modulo"></div>
      <div className="dashboard-financiero">
        <Link
          href="/modulo-talento/carpeta-sistema-gestion-salud/tabla-accidentalidad"
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
          Accidentalidad
        </Link>
        <Link
          href="/modulo-talento/carpeta-sistema-gestion-salud/tabla-ausentismo"
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
          Ausentismo
        </Link>
        <Link
          href="/modulo-talento/carpeta-sistema-gestion-salud/tabla-enfermedad-laboral"
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
          Enfermedad Laboral
        </Link>
        <Link
          href="/modulo-talento/carpeta-sistema-gestion-salud/tabla-plan-trabajo"
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
          Plan de Trabajo Anual
        </Link>
        <Link
          href="/modulo-talento/carpeta-sistema-gestion-salud/tabla-programa"
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
          Programa de Capacitaciones
        </Link>
        <Link
          href="/modulo-talento/carpeta-sistema-gestion-salud/tabla-reporte-ministerio"
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
          Reporte Ministerio
        </Link>
        <Link
          href="/modulo-talento/carpeta-sistema-gestion-salud/tabla-restricciones-laborales"
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
          Restricciones Laborales
        </Link>
      </div>
    </main>
  );
}
