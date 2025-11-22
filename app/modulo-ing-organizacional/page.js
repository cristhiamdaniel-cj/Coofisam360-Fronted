import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";

export default function IngOrganizacionalDashboard() {
  return (
    <main className="container-financiero flex-col p-12 pt-4">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo pl-8">
        Ingeniería Organizacional
      </h1>
      <div className="separator-modulo"></div>
      <div className="dashboard-financiero">
        <Link
          href="/modulo-ing-organizacional/tabla-encuesta-satisfaccion"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/satisfaccion.svg"
              className="module-image"
              alt="Encuesta de Satisfacción"
              width={200}
              height={50}
              priority
            />
          </div>
          Encuesta de Satisfacción
        </Link>
        <Link
          href="/modulo-ing-organizacional/tabla-listado-maestros"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/indicadores.svg"
              className="module-image"
              alt="Listado de Maestros"
              width={200}
              height={50}
              priority
            />
          </div>
          Listado de Maestros
        </Link>
        <Link
          href="/modulo-ing-organizacional/tabla-solicitudes-ingenieria"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/aprobacion-de-prestamo.png"
              className="module-image"
              alt="Solicitudes de Ingeniería"
              width={200}
              height={50}
              priority
            />
          </div>
          Solicitudes de Ingeniería
        </Link>
      </div>
    </main>
  );
}
