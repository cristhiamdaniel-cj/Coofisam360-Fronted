import {
  listRestriccionesLaborales as listRaw,
  getRestriccionLaboral as getRaw,
  saveRestriccionLaboral as saveRaw,
  updateRestriccionLaboral as updateRaw,
  deleteRestriccionLaboral as deleteRaw,
} from "./talentHealthService";
import { num, str } from "./healthHelpers";

export async function listRestriccionesRows(params = {}) {
  const raw = await listRaw(params);
  const rows = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  return rows.map(fromApi);
}
export async function getRestriccionRow(id, params = {}) {
  const r = await getRaw(id, params);
  return r ? fromApi(r) : null;
}
export async function saveRestriccionRow(uiRow = {}) {
  const base = toApi(uiRow);
  const extras = Object.fromEntries(
    Object.entries(uiRow || {}).filter(([k]) => k.startsWith("where_"))
  );
  const body = { ...base, ...extras };

  const origAnio = uiRow.origAnio ?? uiRow.anio;
  const origSede = uiRow.origSede ?? uiRow.sede;
  const origCargo = uiRow.origCargo ?? uiRow.cargo;
  const origPatologia = uiRow.origPatologia ?? uiRow.patologia;

  const sameOriginalKey =
    body.anio === num(origAnio) &&
    body.sede === str(origSede).trim() &&
    body.cargo === str(origCargo).trim() &&
    body.patologia === str(origPatologia);

  if (!sameOriginalKey) {
    if (uiRow.allowPkChange) {
      await maybeReplacePkRecord({
        origAnio,
        origSede,
        origCargo,
        origPatologia,
        newBody: body,
        originalBody: {
          anio: num(origAnio),
          sede: str(origSede).trim(),
          cargo: str(origCargo).trim(),
          patologia: str(origPatologia),
          restricciones: str(uiRow.restricciones ?? base.restricciones),
        },
        isNew: uiRow.isNew,
      });
      return;
    }
    if (origAnio != null) body.where_anio = num(origAnio);
    if (origSede) body.where_sede = str(origSede).trim();
    if (origCargo) body.where_cargo = str(origCargo).trim();
    if (origPatologia) body.where_patologia = str(origPatologia);
  }

  if (uiRow && !uiRow.isNew) {
    try {
      return await updateRaw(body);
    } catch (e) {
      if (e && e.status === 404) {
        throw e;
      }
      throw e;
    }
  }
  return await saveRaw(body);
}

async function maybeReplacePkRecord({
  origAnio,
  origSede,
  origCargo,
  origPatologia,
  newBody,
  originalBody,
  isNew,
}) {
  const hasOriginalKey =
    origAnio != null &&
    origSede != null &&
    origCargo != null &&
    origPatologia != null;
  if (!hasOriginalKey) {
    return await saveRaw(newBody);
  }

  const deletePayload = {
    anio: num(origAnio),
    sede: str(origSede).trim(),
    cargo: str(origCargo).trim(),
    patologia: str(origPatologia),
  };

  try {
    await deleteRaw(deletePayload);
  } catch (err) {
    if (err?.status !== 404) {
      throw err;
    }
  }

  try {
    return await saveRaw(newBody);
  } catch (err) {
    try {
      await saveRaw(originalBody);
    } catch (_) {}
    throw err;
  }
}

function fromApi(a = {}) {
  const anio = num(a.anio);
  const sede = str(a.sede).trim();
  const cargo = str(a.cargo).trim();
  const patologia = str(a.patologia);
  const pkRef =
    a.id != null && a.id !== undefined
      ? String(a.id)
      : `${anio ?? ""}|${sede.toUpperCase()}|${cargo.toUpperCase()}|${patologia.toUpperCase()}`;
  return {
    _key: `restr-${pkRef}`,
    id: a.id ?? a.row_id,
    anio,
    sede,
    cargo,
    patologia,
    restricciones: str(a.restricciones),
    origAnio: anio,
    origSede: sede,
    origCargo: cargo,
    origPatologia: patologia,
  };
}
function toApi(u = {}) {
  const body = {
    anio: num(u.anio),
    sede: str(u.sede).trim(),
    cargo: str(u.cargo).trim(),
    patologia: str(u.patologia),
    restricciones: str(u.restricciones),
  };
  if (u.id != null && /^\d+$/.test(String(u.id))) {
    body.id = Number(u.id);
  }
  return body;
}
