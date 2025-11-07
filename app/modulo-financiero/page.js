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
import { useAuth } from "../lib/authContext";

function Modal({ open, onClose, title, children, width = 700, height = 520 }) {
  if (!open) return null;
  return (
    <div className="modal-tablero-control fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center">
      <div
        className="bg-white rounded-[20px] flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        style={{ width, maxWidth: "96vw", height, maxHeight: "90vh" }}
      >
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

function Tree({ data, onDownload, onDelete, canDelete = true }) {
  if (!data || !Array.isArray(data)) return null;
  return (
    <ul style={{ listStyle: "none", paddingLeft: 12, margin: 0 }}>
      {data.map((n, i) => (
        <Node key={i} node={n} onDownload={onDownload} onDelete={onDelete} canDelete={canDelete} />
      ))}
    </ul>
  );
}

function Node({ node, onDownload, onDelete, canDelete = true }) {
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
                canDelete={canDelete}
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
        {!!node.rel && canDelete && (
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

// Validador de nombre de archivo de balance
function isValidBalanceFilename(name) {
  if (!name) return false;
  try {
    const re = /^(Listado[\s_-]*balances[\s_-]*Consolidado[\s_-]*[A-Za-zÁÉÍÓÚáéíóúñÑ]+[\s_-]*\d{4})\.(xlsx|xls)$/i;
    return re.test(String(name).trim());
  } catch (_) {
    return false;
  }
}

export default function FinancieroDashboard() {
  const { user } = useAuth();
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
  // Parámetros del ETL
  const now = new Date();
  const [etlYear, setEtlYear] = useState(now.getFullYear());
  // UI simplificada: el usuario solo elige Año y Archivo
  // Selección de archivo a procesar
  const [etlFileRel, setEtlFileRel] = useState("");
  const [filesForYear, setFilesForYear] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // función para validar acceso a carpetas
  const hasFolderAccess = folderName => {
    if (!user || !user.acceso) return false;

    // Si user.acceso es un array (nuevo formato)
    if (Array.isArray(user.acceso)) {
      // Si el usuario tiene acceso al módulo financiero, mostrar todas las carpetas
      return user.acceso.includes("modulo-financiero");
    }

    // Si user.acceso es un objeto (formato anterior)
    const financiero = user.acceso["Financiera"];
    if (!financiero) return false;

    // financiero es un objeto con keys = nombres de carpeta
    const keys = Object.keys(financiero);
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

  // función para verificar si el usuario puede eliminar archivos
  const canUserDelete = () => {
    if (!user || !user.username) return true;
    
    // Usuarios que NO pueden eliminar archivos
    const restrictedUsers = [
      "subgerenciafinanciera@coofisam.com",
      "contabilidad@coofisam.com"
    ];
    
    return !restrictedUsers.includes(user.username);
  };

  useEffect(() => {
    if (!etlOpen) return;
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs, etlOpen]);

  // Cerrar el stream al desmontar el componente
  useEffect(() => {
    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, []);

  async function fetchTree() {
    try {
      const { data } = await api.get("/api/v1/finanzas/tree/", {
        params: { depth: 6, includeFiles: true },
      });
      setRootName(data.root || "");
      setTree(data.tree || []);
      return data;
    } catch (e) {
      setError(e.message || "Error");
      return null;
    }
  }

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    // Validar patrón de nombre de archivo requerido
    if (!isValidBalanceFilename(file.name)) {
      alert(
        "Nombre inválido. Usa: Listado_balances_Consolidado_<Mes>_<Año>.xlsx"
      );
      e.target.value = "";
      return;
    }
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

  // Cargar archivos disponibles para el año seleccionado
  useEffect(() => {
    if (!etlOpen) return;
    async function computeFiles() {
      try {
        setLoadingFiles(true);
        const data = await fetchTree();
        const srcTree = (data && data.tree) || tree || [];
        const flat = [];
        function walk(nodes, prefix = "") {
          (nodes || []).forEach(n => {
            if (n.type === "dir") {
              walk(n.children || [], (prefix ? prefix + "/" : "") + (n.name || ""));
            } else if (n.type === "file" && n.rel) {
              flat.push({ rel: n.rel, name: n.name });
            }
          });
        }
        walk(srcTree, "");
        const targetPrefix = `Aanoo_${etlYear}/`;
        const candidates = flat
          .filter(f => f.rel && f.rel.startsWith(targetPrefix) && isValidBalanceFilename(f.name))
          .sort((a, b) => a.name.localeCompare(b.name));
        setFilesForYear(candidates);
        if (candidates.length && !etlFileRel) setEtlFileRel(candidates[0].rel);
      } finally {
        setLoadingFiles(false);
      }
    }
    computeFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etlOpen, etlYear]);

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
    // Validar selección de archivo
    if (!etlFileRel) {
      alert("Selecciona un archivo a procesar");
      return;
    }
    setError("");
    setLogs([]);
    // Reiniciar el stream si ya existía
    if (esRef.current) {
      try {
        esRef.current.close();
      } catch (_) {}
      esRef.current = null;
    }
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
    const params = new URLSearchParams();
    if (token) params.set("token", token);
    if (etlYear) params.set("year", String(etlYear));
    // Simplificado: backend poblara automáticamente sin exponer banderas
    if (etlFileRel) params.set("file", etlFileRel);
    const url = `${base}/users/finanzas/etl/stream/${params.toString() ? `?${params.toString()}` : ""}`;
    const es = new EventSource(url, { withCredentials: true });
    es.onmessage = event => {
      setLogs(prev => [...prev, event.data]);
    };
    es.onerror = () => {
      try {
        es.close();
      } catch (_) {}
      esRef.current = null;
    };
    esRef.current = es;
  };

  async function handlePopulateNow() {
    setPosting(true);
    try {
      const body = {
        year: etlYear,
        month: etlMonth,
        populate_public_saldos: populatePublicSaldos,
        populate_op_saldo: populateOpSaldo,
      };
      const { data } = await api.post("/api/v1/finanzas/etl/populate/", body);
      setLogs(prev => [...prev, `Populate ✓: ${JSON.stringify(data)}`]);
    } catch (e) {
      setLogs(prev => [
        ...prev,
        `Populate ✗: ${(e && (e.message || e.status)) || "error"}. Si el endpoint no existe, el backend debe implementarlo.`,
      ]);
    } finally {
      setPosting(false);
    }
  }

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
          onClick={() => { setEtlOpen(true); setLogs([]); }}
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
          <Tree data={tree} onDownload={downloadFile} onDelete={deleteFile} canDelete={canUserDelete()} />
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
        <div style={{ marginBottom: 8, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center", fontWeight: 600, color: "#333" }}>
            Año
            <input
              type="number"
              value={etlYear}
              onChange={e => setEtlYear(parseInt(e.target.value) || now.getFullYear())}
              className="border px-2 py-1 w-[120px]"
              min={2020}
              max={2035}
            />
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center", minWidth: 360, flex: 1, fontWeight: 600, color: "#333" }}>
            Archivo
            <select
              value={etlFileRel}
              onChange={e => setEtlFileRel(e.target.value)}
              className="border px-2 py-1 min-w-[320px]"
            >
              {loadingFiles && <option>Cargando...</option>}
              {!loadingFiles && filesForYear.map(f => (
                <option key={f.rel} value={f.rel}>{f.rel}</option>
              ))}
              {!loadingFiles && filesForYear.length === 0 && (
                <option value="">Sin archivos para el año seleccionado</option>
              )}
            </select>
          </label>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button
              onClick={handleRunETL}
              disabled={!etlFileRel}
              className="action-button"
              style={{ background: "#780000", color: "#fff", padding: "6px 12px", borderRadius: 6, opacity: !etlFileRel ? 0.6 : 1 }}
              title="Ejecutar ETL para el archivo seleccionado"
            >
              Ejecutar ETL
            </button>
            <button
              onClick={stopETL}
              className="action-button"
              style={{ background: "#eee", color: "#333", padding: "6px 12px", borderRadius: 6 }}
              title="Detener stream"
            >
              Detener
            </button>
          </div>
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

      {hasFolderAccess("modulo-financiero") ? (
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
            Ejecución Presupuestal
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
      ) : (
        <div className="text-center p-8">
          <p className="text-red-600 text-lg">No tienes acceso a este módulo.</p>
        </div>
      )}
    </main>
  );
}
