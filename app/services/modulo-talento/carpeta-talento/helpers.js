export function str(v) {
  return (v ?? "").toString();
}

export function num(v) {
  if (v == null || v === "") return 0;

  const s = String(v).replace(/[%$]/g, "").replace(/\s/g, "");
  const n = Number(
    s
      .replace(/\./g, "")       
      .replace(/,/g, ".")        
      .replace(/[^\d.-]/g, "")   
  );
  return Number.isFinite(n) ? n : 0;
}

export const percent = num;
