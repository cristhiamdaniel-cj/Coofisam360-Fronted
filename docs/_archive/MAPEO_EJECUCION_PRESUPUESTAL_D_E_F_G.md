Resumen lógica (D/E/F/G) – Ejecución Presupuestal

Conexión actual del frontend
- Vista: `app/modulo-financiero/tabla-presupuesto/page.js` (título: “Ejecución Presupuestal”).
- Servicio: `app/services/modulo-financiero/presupuesto.js` → endpoint `GET /api/v1/finanzas/presupuesto/`.

Backend involucrado
- Archivo: `backend/django/users/api_views.py`.
- Vistas:
  - `PresupuestoView` → `/api/v1/finanzas/presupuesto/` (arreglado `nombre_cuenta`).
  - `presupuesto_completo` → `/api/v1/finanzas/presupuesto-completo/` (calcula diferencia y porcentaje).

Mapa de columnas (frontend → backend → BD)
- Código → `cuenta` → `finanzas.presupuesto.cuenta`
- Denominación → `nombre_cuenta` (alias) → `COALESCE(p.denominacion, d.nombre_cuenta, pc.nombre)`
- D: Proyectado → `monto_proyectado` (ó `presupuesto`) → `finanzas.presupuesto.monto_proyectado|presupuesto` (editable)
- E: Histórico → `monto_historico` → `finanzas.presupuesto.monto_historico` (desde Libro de Balance)
- F: Diferencia → `variacion` → calculado: `E - D`
- G: % → `variacion_porcentaje` → calculado: `(E - D) / D * 100`

Trigger sugerido (en `sql/presupuesto_triggers.sql`)
- `trg_presupuesto_calc_biu` actualiza `variacion` y `variacion_porcentaje` en cada INSERT/UPDATE.
- Opcional: autollenar `monto_historico` desde una vista de balance (dejar fuente real).

Nota de uso
- Si se quiere consumir directamente los campos calculados sin depender del trigger, usar `/api/v1/finanzas/presupuesto-completo/` que ya devuelve `diferencia` y `porcentaje` computados.

