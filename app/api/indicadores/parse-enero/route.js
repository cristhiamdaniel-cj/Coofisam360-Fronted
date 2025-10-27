import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function parseLocaleNumber(value) {
  if (value == null) return null;
  let s = String(value).trim();
  if (!s) return null;
  // quitar % si viene
  s = s.replace(/%/g, "");
  // quitar separadores de miles con punto y usar coma como decimal
  // casos: 1.234.567,89 | 1234567,89 | 1.234.567
  const hasDot = s.includes(".");
  const hasComma = s.includes(",");
  if (hasDot && hasComma) {
    s = s.replace(/\./g, "").replace(/,/g, ".");
  } else if (hasComma && !hasDot) {
    s = s.replace(/,/g, ".");
  } else {
    // quitar puntos repetidos de miles dejando el último como decimal si aplica
    const parts = s.split(".");
    if (parts.length > 2) {
      const dec = parts.pop();
      s = parts.join("") + "." + dec;
    }
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function detectPeriodo(headers) {
  // Busca algo tipo "ene-2025" para inferir año/mes
  const months = {
    ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6,
    jul: 7, ago: 8, sep: 9, oct: 10, nov: 11, dic: 12,
  };
  const joined = headers.join(" ").toLowerCase();
  const m = joined.match(/\b(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[\-\s]?([12][0-9]{3})\b/);
  if (!m) return { anio: null, mes: null };
  return { anio: Number(m[2]), mes: months[m[1]] };
}

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "app",
      "modulo-financiero",
      "tabla-indicadores",
      "mes_enero.txt"
    );
    const raw = await fs.readFile(filePath, "utf8");
    const lines = raw.split(/\r?\n/);

    // Detectar período desde headers
    const periodo = detectPeriodo(lines.slice(0, 6));

    const items = [];
    for (const line of lines) {
      const cols = line.split("\t").map((c) => c.trim());
      const codigo = cols[0];
      if (!codigo || !/^[0-9]+$/.test(codigo)) continue; // omitir headers o líneas vacías
      const denominacion = cols[1] || "";
      const proyectado = parseLocaleNumber(cols[2]);
      const historico = parseLocaleNumber(cols[3]);
      const diferencia = parseLocaleNumber(cols[4]);
      const porcentaje = parseLocaleNumber(cols[5]);

      items.push({
        codigo,
        denominacion,
        proyectado: proyectado ?? 0,
        historico: historico ?? 0,
        diferencia: diferencia ?? (proyectado ?? 0) - (historico ?? 0),
        porcentaje: porcentaje ?? ((proyectado ? ((proyectado - (historico ?? 0)) / proyectado) * 100 : 0)),
        anio: periodo.anio,
        mes: periodo.mes,
      });
    }

    return NextResponse.json({ count: items.length, periodo, items });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

