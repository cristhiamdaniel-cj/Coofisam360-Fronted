import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";

export default function FinancieroDashboard() {
  return (
    <main className="dashboard-financiero">
      <Link href="/modulo-financiero/tabla-cupos" className="modulo-button">
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
      <Link href="/modulo-financiero/tabla-cupos" className="modulo-button">
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
    </main>
  );
}
