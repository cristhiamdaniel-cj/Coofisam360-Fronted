import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";

export default function OficCumplimientoDashboard() {
  return (
    <main className="container-financiero flex-col p-12 pt-4">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo pl-8">
        Oficial de Cumplimiento
      </h1>
      <div className="separator-modulo"></div>
      <div className="dashboard-financiero">
        <Link
          href="/modulo-ofic-cumplimiento/tabla-evaluacion-capacitacion"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/satisfaccion.svg"
              className="module-image"
              alt="Evaluación Capacitación"
              width={200}
              height={50}
              priority
            />
          </div>
          Evaluación Capacitación
        </Link>
        <Link
          href="/modulo-ofic-cumplimiento/tabla-fori-19"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/indicadores.svg"
              className="module-image"
              alt="FORI-19"
              width={200}
              height={50}
              priority
            />
          </div>
          FORI-19
        </Link>
        <Link
          href="/modulo-ofic-cumplimiento/tabla-fori-20"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/aprobacion-de-prestamo.png"
              className="module-image"
              alt="FORI-20"
              width={200}
              height={50}
              priority
            />
          </div>
          FORI-20
        </Link>
        <Link
          href="/modulo-ofic-cumplimiento/tabla-inscripcion-capacitacion"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/transferencia.svg"
              className="module-image"
              alt="Inscripción Capacitación"
              width={200}
              height={50}
              priority
            />
          </div>
          Inscripción Capacitación
        </Link>
        <Link
          href="/modulo-ofic-cumplimiento/tabla-reporte-operaciones"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/analisis.svg"
              className="module-image"
              alt="Reporte Operaciones"
              width={200}
              height={50}
              priority
            />
          </div>
          Reporte Operaciones
        </Link>
        <Link
          href="/modulo-ofic-cumplimiento/tabla-seguimiento"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/presupuesto.svg"
              className="module-image"
              alt="Seguimiento"
              width={200}
              height={50}
              priority
            />
          </div>
          Seguimiento
        </Link>
        <Link
          href="/modulo-ofic-cumplimiento/tabla-temas-boletines"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/participacion.svg"
              className="module-image"
              alt="Temas Boletines"
              width={200}
              height={50}
              priority
            />
          </div>
          Temas Boletines
        </Link>
      </div>
    </main>
  );
}
