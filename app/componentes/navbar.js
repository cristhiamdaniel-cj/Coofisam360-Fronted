"use client";

import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../lib/authContext";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const modulesRef = useRef(null);
  const userMenuRef = useRef(null);

  const modules = [
    { name: "Financiera", href: "/modulo-financiero" },
    { name: "Talento y Cultura", href: "/modulo-talento" },
    { name: "Cartera", href: "/modulo-cartera" },
    { name: "Crédito", href: "/modulo-credito" },
    { name: "Comercial", href: "/modulo-comercial" },
    { name: "Gestión Documental", href: "/modulo-gestion" },
    { name: "Ingeniería Organizacional", href: "/modulo-ingenieria" },
    { name: "Jurídico", href: "/modulo-juridico" },
    { name: "Oficial de Cumplimiento", href: "/modulo-cumplimiento" },
  ];

  const handleModuleClick = () => setIsModulesOpen(false);

  const getInitials = name => {
    if (!name) return "";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsModulesOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (modulesRef.current && !modulesRef.current.contains(event.target)) {
        setIsModulesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-container px-12 flex items-center justify-between h-16 bg-white shadow-md relative">
      {/* Logo */}
      <div className="logo">
        <Image
          src="/logo-coofisam.png"
          alt="Company Logo"
          width={200}
          height={50}
          priority
        />
      </div>

      {/* Módulos */}
      <div className="flex gap-4 items-center">
        <div className="relative">
          <button
            onClick={() => setIsModulesOpen(!isModulesOpen)}
            className="rounded-xl text-white flex items-center px-8 py-2 border border-gray-200 rounded hover:text-red-700 hover:bg-gray-300"
          >
            Módulos
          </button>

          {isModulesOpen && (
            <div className="absolute flex flex-col gap-2 top-full mt-2 bg-white shadow-lg rounded-md py-2 z-20 min-w-[200px] module-dropdown">
              {modules.map(mod => (
                <Link
                  key={mod.name}
                  href={mod.href}
                  className="navbar-link px-4 py-2 hover:bg-gray-100 rounded"
                  onClick={handleModuleClick}
                >
                  {mod.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User menu / login */}
        <div className="relative">
          {user ? (
            <>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-12 h-12 text-[25px] rounded-full cursor-pointer border-3 border-gray-300 bg-transparent hover:bg-gray-300 text-yellow-300 hover:text-red-700 flex items-center justify-center font-bold"
              >
                {getInitials(user.name)}
              </button>

              {isUserMenuOpen && (
                <div className="absolute module-dropdown right-0 pr-2 top-full mt-2 bg-white shadow-lg rounded-md py-2 z-20 min-w-[150px] flex flex-col">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 navbar-link  text-left rounded"
                  >
                    Salir
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-3 rounded-xl bg-gray-300 text-red-700 hover:bg-yellow-500"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
