"use client";
import { useState } from "react";
import { savePresupuestoApp } from "../../../services/modulo-financiero/presupuesto";

export default function ImportarEneroPage() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [ok, setOk] = useState(0);
  const [fail, setFail] = useState(0);
  const append = (m) => setLog((prev) => [...prev, m]);

  async function importar() {
    setLoading(true);
    setLog([]);
    setOk(0);
    setFail(0);
    try {
      const res = await fetch("/api/indicadores/parse-enero");
      if (!res.ok) throw new Error(`Parse error: ${res.status}`);
      const data = await res.json();
      append(`Detectado período: ${data.periodo?.mes || "?"}-${data.periodo?.anio || "?"}`);
      append(`Filas a importar: ${data.count}`);

      for (const item of data.items) {
        try {
          const payload = {
            cuenta: item.codigo,
            anio: item.anio,
            mes: item.mes,
            denominacion: item.denominacion,
            monto_proyectado: item.proyectado,
            presupuesto: item.proyectado, // compatibilidad
            monto_historico: item.historico,
          };
          await savePresupuestoApp(payload);
          setOk((n) => n + 1);
        } catch (e) {
          setFail((n) => n + 1);
          append(`❌ ${item.codigo} - ${item.denominacion}: ${e.message || e}`);
        }
      }
      append("Importación finalizada");
    } catch (e) {
      append(`Error general: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl space-y-4">
      <h1 className="text-2xl font-semibold">Importar mes_enero.txt → finanzas.presupuesto</h1>
      <p className="text-sm text-gray-600">
        Lee el archivo local y carga Proyectado (D) y Histórico (E) para el período detectado.
      </p>
      <button
        onClick={importar}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Importando..." : "Importar mes_enero.txt"}
      </button>
      <div className="text-sm">✔️ OK: {ok} · ❌ Fallas: {fail}</div>
      <pre className="bg-gray-50 border p-3 text-xs whitespace-pre-wrap max-h-[50vh] overflow-auto">{log.join("\n")}</pre>
    </div>
  );
}
