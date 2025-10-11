"use client";

import "../styles/global.css";
import Image from "next/image";
import Link from "next/link";
import { FaRegFolderOpen, FaPlay } from "react-icons/fa";
import { TbUpload } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { FiDownload } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

function Modal({ open, onClose, title, children, width = 700, height = 520 }) {
  if (!open) return null;
  return (
    <div className="modal-tablero-control fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center">
      <div className="bg-white rounded-[20px] w-[700px] max-w-[96vw] h-[520px] max-h-[90vh] flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="px-3.5 py-2.5 border-b rounded-t-[20px] border-[#e6e6e6] flex items-center justify-between bg-[#780000] text-[#fff1f2]">
          <h3 style={{ margin: 0, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} title="Cerrar" className="cursor-pointer">
            ✖
          </button>
        </div>
        <div style={{ padding: 12, overflow: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

function Tree({ data, onDownload, onDelete }) {
  if (!data || !Array.isArray(data)) return null;
  return (
    <ul style={{ listStyle: "none", paddingLeft: 12, margin: 0 }}>
      {data.map((n, i) => (
        <Node key={i} node={n} onDownload={onDownload} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function Node({ node, onDownload, onDelete }) {
  const [open, setOpen] = useState(false);
  if (node.type === "dir") {
    return (
      <li>
        <span
          onClick={() => setOpen(v => !v)}
          className="cursor-pointer font-semibold pr-10"
        >
          {open ? "📂" : "📁"} {node.name}
        </span>
        {open && (
          <ul style={{ listStyle: "none", paddingLeft: 16 }}>
            {(node.children || []).map((c, i) => (
              <Node
                key={i}
                node={c}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }
  return (
    <li className="flex items-center gap-4 justify-between pr-8">
      <span>📄 {node.name}</span>
      <div className="flex gap-4">
        {!!node.rel && (
          <button
            onClick={() => onDownload?.(node.rel, node.name)}
            title="Descargar"
            className="cursor-pointer text-[#b81121]"
          >
            <FiDownload />
          </button>
        )}
        {!!node.rel && (
          <button
            onClick={() => onDelete?.(node.rel, node.name)}
            title="Eliminar"
            className="cursor-pointer text-[#b81121]"
          >
            <FaRegTrashAlt />
          </button>
        )}
      </div>
    </li>
  );
}

export default function FinancieroDashboard() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "";
  const [uploading, setUploading] = useState(false);
  const [tree, setTree] = useState([]);
  const [rootName, setRootName] = useState("");
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [etlOpen, setEtlOpen] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);
  const esRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!etlOpen) return;
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs, etlOpen]);

  async function fetchTree() {
    try {
      const { data } = await api.get("/api/v1/finanzas/tree/", {
        params: { depth: 6, includeFiles: true },
      });
      setRootName(data.root || "");
      setTree(data.tree || []);
    } catch (e) {
      setError(e.message || "Error");
    }
  }

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
      const res = await fetch(`${base}/api/v1/finanzas/upload/`, {
        method: "POST",
        headers: token ? { Authorization: `Token ${token}` } : {},
        body: formData,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.success)
        throw new Error(body.error || "Error al subir el archivo");
      alert(`✅ Subido: ${body.saved_name}`);
      await fetchTree();
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleExplore = async () => {
    setExplorerOpen(true);
    setError("");
    await fetchTree();
  };

  async function downloadFile(rel, name) {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
      const url = `${base}/api/v1/finanzas/download/?path=${encodeURIComponent(
        rel
      )}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = name || rel.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      setError(`Error descargando: ${e.message}`);
    }
  }

  async function deleteFile(rel, name) {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await api.delete("/api/v1/finanzas/delete/", { path: rel });
      await fetchTree();
    } catch (e) {
      setError(e.message || "Error");
    }
  }

  const handleRunETL = () => {
    setEtlOpen(true);
    setLogs([]);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
    const es = new EventSource(
      `${base}/users/finanzas/etl/stream/${
        token ? `?token=${encodeURIComponent(token)}` : ""
      }`,
      { withCredentials: true }
    );
    es.onmessage = event => {
      setLogs(prev => [...prev, event.data]);
    };
    es.onerror = () => {
      es.close();
    };
    esRef.current = es;
  };

  function stopETL() {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  }

  function closeETL() {
    stopETL();
    setEtlOpen(false);
  }

  return (
    <main className="container-financiero flex-col p-12 pt-4">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo pl-8">
        Formularios
      </h1>

      <div className="actions-container flex gap-4 pt-4">
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

      {/* Modal Explorador */}
      <Modal
        open={explorerOpen}
        onClose={() => setExplorerOpen(false)}
        title={`Explorador · ${rootName || ""}`}
      >
        {error && (
          <p style={{ color: "crimson", marginBottom: 8 }}>Error: {error}</p>
        )}
        {tree && tree.length ? (
          <Tree data={tree} onDownload={downloadFile} onDelete={deleteFile} />
        ) : (
          <div style={{ opacity: 0.7 }}>
            Sin datos. Usa Cargar Balance o refresca.
          </div>
        )}
      </Modal>

      {/* Modal ETL Logs */}
      <Modal
        open={etlOpen}
        onClose={closeETL}
        title="ETL · Libro de Balance"
        width={960}
        height={560}
      >
        <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
          <button onClick={handleRunETL}>Iniciar</button>
          <button onClick={stopETL}>Detener</button>
        </div>
        <pre
          ref={boxRef}
          style={{
            whiteSpace: "pre-wrap",
            background: "#0b0b0b",
            color: "#d2ffd2",
            padding: 12,
            height: 420,
            overflow: "auto",
            borderRadius: 4,
          }}
        >
          {logs.join("\n")}
        </pre>
      </Modal>

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

        <Link
          href="/modulo-financiero/tabla-presupuesto"
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
          Presupuesto
        </Link>

        <Link
          href="/modulo-financiero/tabla-analisis"
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
          Análisis Explicativo
        </Link>

        {/* Enlaces a rutas eliminadas removidos */}
      </div>
    </main>
  );
}
