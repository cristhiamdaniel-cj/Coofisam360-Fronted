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
        Talento y Cultura
      </h1>

      <div className="separator-modulo"></div>
      <div className="dashboard-financiero">
        <Link
          href="/modulo-talento/carpeta-disciplinario"
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
          Disciplinario
        </Link>
        <Link
          href="/modulo-talento/carpeta-formador-talento"
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
          Formador Talento y Cultura
        </Link>
        <Link
          href="/modulo-talento/carpeta-sistema-gestion-salud"
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
          Sistema de Gestion de Seguridad y Salud en el Trabajo
        </Link>
        <Link href="/modulo-talento/carpeta-talento" className="modulo-button">
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
          Talento y Cultura
        </Link>
      </div>
    </main>
  );
}
