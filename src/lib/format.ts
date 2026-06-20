export function formatCHF(value: number, withDecimals = false): string {
  const negative = value < 0;
  const abs = Math.abs(value);
  const fixed = withDecimals ? abs.toFixed(2) : Math.round(abs).toString();
  const [intPart, decPart] = fixed.split(".");
  // Swiss-style thousands separator: ASCII apostrophe (SSR-safe)
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  const formatted = decPart ? `${grouped}.${decPart}` : grouped;
  return `${negative ? "-" : ""}CHF ${formatted}`;
}
