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

    // Si user.acceso es un array (nuevo formato)
    if (Array.isArray(user.acceso)) {
      // Si el usuario tiene acceso al módulo de talento, mostrar todas las carpetas
      return user.acceso.includes("modulo-comercial");
    }

    // Si user.acceso es un objeto (formato anterior)
    const comercial = user.acceso["Comercial"];
    if (!comercial) return false;

    // talento es un objeto con keys = nombres de carpeta
    const keys = Object.keys(comercial);
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
        Comercial
      </h1>

      <div className="separator-modulo"></div>

      {hasFolderAccess("modulo-comercial") ? (
        <div className="dashboard-financiero">
          <Link
            href="/modulo-comercial/tabla-comunicacion-boletin"
            className="modulo-button"
          >
            <div className="logo">
              <Image
                src="/indicadores.svg"
                className="module-image"
                alt="Indicadores"
                width={200}
                height={50}
                priority
              />
            </div>
            Comunicación Interna Boletín
          </Link>

          <Link
            href="/modulo-comercial/tabla-comunicacion-campana"
            className="modulo-button"
          >
            <div className="logo">
              <Image
                src="/aprobacion-de-prestamo.png"
                className="module-image"
                alt="Cupos de crédito"
                width={200}
                height={50}
                priority
              />
            </div>
            Comunicación Interna Campaña
          </Link>

          <Link
            href="/modulo-comercial/tabla-convenios"
            className="modulo-button"
          >
            <div className="logo">
              <Image
                src="/oficina.png"
                className="module-image"
                alt="Categorías de oficinas"
                width={200}
                height={50}
                priority
              />
            </div>
            Convenios Nuevo y Mantenimiento
          </Link>

          <Link
            href="/modulo-comercial/tabla-inventario-oficina"
            className="modulo-button"
          >
            <div className="logo">
              <Image
                src="/presupuesto.svg"
                className="module-image"
                alt="Categorías de oficinas"
                width={200}
                height={50}
                priority
              />
            </div>
            Inventario Material Corporativo Oficina
          </Link>

          <Link
            href="/modulo-comercial/tabla-comunicacion-boletin"
            className="modulo-button"
          >
            <div className="logo">
              <Image
                src="/analisis.svg"
                className="module-image"
                alt="Categorías de oficinas"
                width={200}
                height={50}
                priority
              />
            </div>
            Inventario Material Corporativo
          </Link>

          <Link
            href="/modulo-comercial/tabla-mantenimientos"
            className="modulo-button"
          >
            <div className="logo">
              <Image
                src="/analisis.svg"
                className="module-image"
                alt="Categorías de oficinas"
                width={200}
                height={50}
                priority
              />
            </div>
            Mantenimientos Convenios Oficinas
          </Link>

          <Link
            href="/modulo-comercial/tabla-vinculaciones"
            className="modulo-button"
          >
            <div className="logo">
              <Image
                src="/analisis.svg"
                className="module-image"
                alt="Categorías de oficinas"
                width={200}
                height={50}
                priority
              />
            </div>
            Vinculaciones con Novedad
          </Link>

          {/* Enlaces a rutas eliminadas removidos */}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-red-600 text-lg">
            No tienes acceso a este módulo.
          </p>
        </div>
      )}
    </main>
  );
}
