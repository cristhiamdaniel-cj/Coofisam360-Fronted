import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";

export default function JuridicoDashboard() {
  return (
    <main className="container-financiero flex-col p-12 pt-4">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo pl-8">
        Módulo Jurídico
      </h1>
      <div className="separator-modulo"></div>
      <div className="dashboard-financiero">
        <Link
          href="/modulo-juridico/tabla-contratos-arrendamiento"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/indicadores.svg"
              className="module-image"
              alt="Contratos Arrendamiento"
              width={200}
              height={50}
              priority
            />
          </div>
          Contratos de Arrendamiento
        </Link>
        <Link
          href="/modulo-juridico/tabla-control-contratos"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/aprobacion-de-prestamo.png"
              className="module-image"
              alt="Control Contratos"
              width={200}
              height={50}
              priority
            />
          </div>
          Control de Contratos
        </Link>
        <Link
          href="/modulo-juridico/tabla-control-polizas"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/oficina.png"
              className="module-image"
              alt="Control Pólizas"
              width={200}
              height={50}
              priority
            />
          </div>
          Control de Pólizas
        </Link>
        <Link
          href="/modulo-juridico/tabla-control-renovaciones"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/presupuesto.svg"
              className="module-image"
              alt="Control Renovaciones"
              width={200}
              height={50}
              priority
            />
          </div>
          Control de Renovaciones
        </Link>
        <Link
          href="/modulo-juridico/tabla-reclamaciones"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/analisis.svg"
              className="module-image"
              alt="Reclamaciones"
              width={200}
              height={50}
              priority
            />
          </div>
          Reclamaciones
        </Link>
        <Link
          href="/modulo-juridico/tabla-seguimiento-alumbrado"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/participacion.svg"
              className="module-image"
              alt="Seguimiento Alumbrado"
              width={200}
              height={50}
              priority
            />
          </div>
          Seguimiento Alumbrado
        </Link>
        <Link
          href="/modulo-juridico/tabla-seguimiento-procesos"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/transferencia.svg"
              className="module-image"
              alt="Seguimiento Procesos"
              width={200}
              height={50}
              priority
            />
          </div>
          Seguimiento de Procesos
        </Link>
      </div>
    </main>
  );
}
