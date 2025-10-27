-- Lógica D/E/F/G para finanzas.presupuesto
-- D = presupuesto (monto proyectado) [editable]
-- E = monto_historico (desde Libro de Balance)
-- F = variacion = (E - D)
-- G = variacion_porcentaje = ((E - D) / D) * 100

CREATE OR REPLACE FUNCTION finanzas.fn_presupuesto_calc()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Asegurar proyectado por defecto = presupuesto
  IF NEW.monto_proyectado IS NULL THEN
    NEW.monto_proyectado := NEW.presupuesto;
  END IF;

  -- Si no viene histórico, intente resolver desde una vista/tablas de balance (opcional)
  -- Descomentar y ajustar a su fuente real de balance
  -- IF NEW.monto_historico IS NULL THEN
  --   SELECT COALESCE(b.saldo, 0)
  --   INTO NEW.monto_historico
  --   FROM indicadores.vista_balance_cuentas b
  --   WHERE b.cuenta = NEW.cuenta AND b.anio = NEW.anio AND b.mes = NEW.mes
  --   LIMIT 1;
  -- END IF;

  -- Calcular variación y porcentaje
  NEW.variacion := COALESCE(NEW.monto_historico, 0) - COALESCE(NEW.presupuesto, 0);
  IF COALESCE(NEW.presupuesto, 0) = 0 THEN
    NEW.variacion_porcentaje := 0;
  ELSE
    NEW.variacion_porcentaje := ROUND((NEW.variacion / NEW.presupuesto) * 100::numeric, 2);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_presupuesto_calc_biu ON finanzas.presupuesto;
CREATE TRIGGER trg_presupuesto_calc_biu
BEFORE INSERT OR UPDATE OF presupuesto, monto_historico, monto_proyectado
ON finanzas.presupuesto
FOR EACH ROW
EXECUTE FUNCTION finanzas.fn_presupuesto_calc();

