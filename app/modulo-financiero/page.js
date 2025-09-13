"use client";

import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";
import { FaRegFolderOpen, FaPlay } from "react-icons/fa";
import { TbUpload } from "react-icons/tb";
import { useState } from "react";

export default function FinancieroDashboard() {
  const [uploading, setUploading] = useState(false);
  const [tree, setTree] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/finanzas/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir el archivo");
      alert("✅ Archivo subido correctamente");
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = ""; // Limpia el input para permitir volver a subir el mismo archivo
    }
  };

  const handleExplore = async () => {
    try {
      const res = await fetch("/finanzas/api/tree/");
      if (!res.ok) throw new Error("Error obteniendo árbol de archivos");
      const data = await res.json();
      setTree(data);
      console.log("Árbol de archivos:", data);
      alert(
        "📁 Árbol de archivos cargado. Mira la consola para ver el resultado."
      );
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    }
  };

  const handleRunETL = () => {
    setLogs([]);
    const eventSource = new EventSource("/finanzas/etl/stream/");

    eventSource.onmessage = event => {
      setLogs(prev => [...prev, event.data]);
      console.log("ETL:", event.data);
    };

    eventSource.onerror = () => {
      eventSource.close();
      console.log("⚠️ Conexión SSE cerrada");
    };
  };

  return (
    <main className="container-financiero flex-col p-12">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo">
        Formularios
      </h1>

      <div className="actions-container flex gap-4 pt-12">
        {/* Cargar Balance */}
        <label className="action-button flex gap-2 items-center justify-center cursor-pointer">
          {uploading ? "Subiendo..." : "Cargar Balance"}
          <TbUpload />
          <input
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={handleUpload}
          />
        </label>

        {/* Explorar */}
        <button
          className="action-button flex gap-2 items-center justify-center cursor-pointer"
          onClick={handleExplore}
        >
          Explorar
          <FaRegFolderOpen />
        </button>

        {/* Ejecutar */}
        <button
          className="action-button flex gap-2 items-center justify-center cursor-pointer"
          onClick={handleRunETL}
        >
          Ejecutar
          <FaPlay />
        </button>
      </div>

      {/* Mostrar logs de ETL si existen */}
      {logs.length > 0 && (
        <div className="etl-logs mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Logs ETL</h2>
          <pre className="text-sm max-h-64 overflow-auto">
            {logs.join("\n")}
          </pre>
        </div>
      )}

      <div className="separator-modulo"></div>

      <div className="dashboard-financiero">
        <Link
          href="/modulo-financiero/tabla-indicadores"
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
          Indicadores financieros
        </Link>

        <Link href="/modulo-financiero/tabla-cupos" className="modulo-button">
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
          Cupos de Crédito
        </Link>

        <Link
          href="/modulo-financiero/tabla-categorias"
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
          Categorias de Oficinas
        </Link>
      </div>
    </main>
  );
}
