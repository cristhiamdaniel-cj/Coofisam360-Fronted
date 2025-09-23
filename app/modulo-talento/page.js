"use client";

import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../lib/authContext";

export default function TalentoDashboard() {
  const { user } = useAuth();

  // función para validar acceso a carpetas
  const hasFolderAccess = folderName => {
    if (!user || !user.acceso) return false;
    const talento = user.acceso["Talento y Cultura"];
    if (!talento) return false;

    // talento es un objeto con keys = nombres de carpeta
    const keys = Object.keys(talento);
    return keys.some(
      k =>
        k
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") ===
        folderName
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    );
  };

  return (
    <main className="container-financiero flex-col p-12 pt-4">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo pl-8">
        Talento y Cultura
      </h1>

      <div className="separator-modulo"></div>
      <div className="dashboard-financiero">
        {/* Disciplinario */}
        {hasFolderAccess("Disciplinario") && (
          <Link
            href="/modulo-talento/carpeta-disciplinario"
            className="modulo-button hover:shadow-lg"
          >
            <div className="logo">
              <Image
                src="/indicadores.svg"
                className="module-image"
                alt="Disciplinario"
                width={200}
                height={50}
                priority
              />
            </div>
            Disciplinario
          </Link>
        )}

        {/* Formador Talento y Cultura */}
        {hasFolderAccess("Formador Talento y Cultura") && (
          <Link
            href="/modulo-talento/carpeta-formador-talento"
            className="modulo-button hover:shadow-lg"
          >
            <div className="logo">
              <Image
                src="/aprobacion-de-prestamo.png"
                className="module-image"
                alt="Formador Talento y Cultura"
                width={200}
                height={50}
                priority
              />
            </div>
            Formador Talento y Cultura
          </Link>
        )}

        {/* Sistema de Gestión de Seguridad y Salud en el Trabajo */}
        {hasFolderAccess(
          "Sistema de Gestion de Seguridad y Salud en el Trabajo"
        ) && (
          <Link
            href="/modulo-talento/carpeta-sistema-gestion-salud"
            className="modulo-button hover:shadow-lg"
          >
            <div className="logo">
              <Image
                src="/oficina.png"
                className="module-image"
                alt="SG-SST"
                width={200}
                height={50}
                priority
              />
            </div>
            Sistema de Gestión de Seguridad y Salud en el Trabajo
          </Link>
        )}

        {/* Talento y Cultura */}
        {hasFolderAccess("Talento y Cultura") && (
          <Link
            href="/modulo-talento/carpeta-talento"
            className="modulo-button hover:shadow-lg"
          >
            <div className="logo">
              <Image
                src="/oficina.png"
                className="module-image"
                alt="Talento y Cultura"
                width={200}
                height={50}
                priority
              />
            </div>
            Talento y Cultura
          </Link>
        )}
      </div>
    </main>
  );
}
