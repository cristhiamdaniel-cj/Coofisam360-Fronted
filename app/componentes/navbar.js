import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="logo">
        <Image
          src="/logo-coofisam.png" // Path relative to /public
          className="logo-image"
          alt="Company Logo"
          width={200} // required
          height={50} // required
          priority // loads immediately
        />
      </div>
      <div className="separator"></div>
      <div className="navbar-box px-8">
        <p className="navbar-title">Modulos</p>
        <Link href="/modulo-financiero" className="navbar-link">
          - Financiera
        </Link>
        <Link href="/modulo-financiero" className="navbar-link">
          - Talento y Cultura
        </Link>
        <Link href="/modulo-cartera" className="navbar-link">
          - Cartera
        </Link>
        <Link href="/modulo-credito" className="navbar-link">
          - Crédito
        </Link>
        <Link href="/modulo-financiero" className="navbar-link">
          - Comercial
        </Link>
        <Link href="/modulo-financiero" className="navbar-link">
          - Gestión Documental
        </Link>
        <Link href="/modulo-financiero" className="navbar-link">
          - Ingenieria Organizacional
        </Link>
        <Link href="/modulo-financiero" className="navbar-link">
          - Jurídico
        </Link>
        <Link href="/modulo-financiero" className="navbar-link">
          - Oficial de Cumplimiento
        </Link>
      </div>
      <div className="flex gap-8 mt-8">
        <Link href="/login" className="login-link">
          Ingresar
        </Link>
        <p className="logout-button">Salir</p>
      </div>
    </nav>
  );
}
