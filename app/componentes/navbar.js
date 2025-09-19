"use client";

import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";
import { logout } from "../lib/auth";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="navbar-container px-12">
      <div className="logo">
        <Image
          src="/logo-coofisam.png" // Path relative to /public
          className="logo-image"
          alt="Company Logo"
          width={100} // required
          height={30} // required
          priority // loads immediately
        />
      </div>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="navbar-title flex items-center"
        >
          Módulos
        </button>

        {isOpen && (
          <div className="absolute flex flex-col gap-2 top-full  bg-white shadow-lg rounded-md py-2 z-10 min-w-[200px] module-dropdown">
            <Link href="/modulo-financiero" className="navbar-link">
              Financiera
            </Link>
            <Link href="/modulo-talento" className="navbar-link">
              Talento y Cultura
            </Link>
            <Link href="/modulo-cartera" className="navbar-link">
              Cartera
            </Link>
            <Link href="/modulo-credito" className="navbar-link">
              Crédito
            </Link>
            <Link href="/modulo-financiero" className="navbar-link">
              Comercial
            </Link>
            <Link href="/modulo-financiero" className="navbar-link">
              Gestión Documental
            </Link>
            <Link href="/modulo-financiero" className="navbar-link">
              Ingenieria Organizacional
            </Link>
            <Link href="/modulo-financiero" className="navbar-link">
              Jurídico
            </Link>
            <Link href="/modulo-financiero" className="navbar-link">
              Oficial de Cumplimiento
            </Link>
          </div>
        )}
      </div>

      {/*<div className="flex gap-8 mt-8">
        <button onClick={logout} className="navbar-link">
          Salir
        </button>
      </div>*/}
    </nav>
  );
}
