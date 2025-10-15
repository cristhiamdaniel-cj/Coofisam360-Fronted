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

  // normaliza string: trim, collapse spaces, lower, remove diacritics
  const normalize = s =>
    String(s || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // hasModuleAccess: user.acceso puede ser un array o un objeto
  const hasModuleAccess = moduleName => {
    if (!user || !user.acceso) return false;
    
    // Si user.acceso es un array (nuevo formato)
    if (Array.isArray(user.acceso)) {
      return user.acceso.some(module => {
        // Mapear nombres de módulos del backend a nombres del frontend
        const moduleMap = {
          'modulo-financiero': 'Financiera',
          'modulo-talento': 'Talento y Cultura',
          'modulo-cartera': 'Cartera',
          'modulo-credito': 'Crédito',
          'modulo-comercial': 'Comercial',
          'modulo-gestion': 'Gestión Documental',
          'modulo-ingenieria': 'Ingeniería Organizacional',
          'modulo-juridico': 'Jurídico',
          'modulo-cumplimiento': 'Oficial de Cumplimiento'
        };
        const frontendModuleName = moduleMap[module] || module;
        return normalize(frontendModuleName) === normalize(moduleName);
      });
    }
    
    // Si user.acceso es un objeto (formato anterior)
    const keys = Object.keys(user.acceso || {});
    const found = keys.find(k => normalize(k) === normalize(moduleName));
    return !!found;
  };

  // iniciales: usa responsable si existe, sino username
  const getInitials = responsableOrUsername => {
    const name = responsableOrUsername || "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsModulesOpen(false);
  };

  // cerrar dropdowns al click fuera
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

  // Si hay usuario, filtra; si no (por ejemplo en dev) puedes decidir mostrar todos o ninguno.
  const allowedModules = user
    ? modules.filter(m => hasModuleAccess(m.name))
    : modules;

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

      <div className="flex gap-4 items-center">
        {/* Módulos */}
        <div className="relative" ref={modulesRef}>
          <button
            onClick={() => setIsModulesOpen(!isModulesOpen)}
            className="rounded-xl text-white flex items-center px-8 py-2 border border-gray-200 hover:text-red-700 hover:bg-gray-300"
          >
            Módulos
          </button>

          {isModulesOpen && (
            <div className="absolute flex flex-col gap-2 top-full mt-2 bg-white shadow-lg rounded-md py-2 z-20 min-w-[220px] module-dropdown">
              {allowedModules.length > 0 ? (
                allowedModules.map(mod => (
                  <Link
                    key={mod.name}
                    href={mod.href}
                    className="navbar-link px-4 py-2 hover:bg-gray-100 rounded"
                    onClick={() => setIsModulesOpen(false)}
                  >
                    {mod.name}
                  </Link>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-400 text-sm">Sin acceso</p>
              )}
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          {user ? (
            <>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-12 h-12 text-[20px] rounded-full cursor-pointer border-3 border-gray-300 bg-transparent hover:bg-gray-300 text-gray-300 hover:text-red-700 flex items-center justify-center font-bold"
              >
                {getInitials(user.responsable || user.username)}
              </button>

              {isUserMenuOpen && (
                <div className="absolute module-dropdown right-0 pr-2 top-full mt-2 bg-white shadow-lg rounded-md py-2 z-20 min-w-[220px] flex flex-col">
                  <p className="px-4 py-2 text-sm text-gray-300 border-b">
                    {user.username || ""}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 mt-2 navbar-link text-left rounded hover:bg-gray-100"
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
