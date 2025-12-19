import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";

export default function RiesgosDashboard() {
  return (
    <main className="container-financiero flex-col p-12 pt-4">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo pl-8">
        Módulo de Riesgos
      </h1>
      <div className="separator-modulo"></div>
      <div className="dashboard-financiero">
        <Link
          href="/modulo-riesgos/tabla-efectividad-siar"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/indicadores.svg"
              className="module-image"
              alt="Efectividad SIAR"
              width={200}
              height={50}
              priority
            />
          </div>
          Efectividad SIAR
        </Link>
        <Link
          href="/modulo-riesgos/tabla-historico-ahorros"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/aprobacion-de-prestamo.png"
              className="module-image"
              alt="Histórico Ahorros"
              width={200}
              height={50}
              priority
            />
          </div>
          Histórico de Ahorros
        </Link>
        <Link
          href="/modulo-riesgos/tabla-limites-individuales"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/oficina.png"
              className="module-image"
              alt="Límites Individuales"
              width={200}
              height={50}
              priority
            />
          </div>
          Límites Individuales
        </Link>
        <Link
          href="/modulo-riesgos/tabla-seguimiento-liquidez"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/presupuesto.svg"
              className="module-image"
              alt="Seguimiento Liquidez"
              width={200}
              height={50}
              priority
            />
          </div>
          Seguimiento de Liquidez
        </Link>
      </div>
    </main>
  );
}
