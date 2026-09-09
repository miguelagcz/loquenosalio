/**
 * Reemplaza el campo `height` que antes guardabas a mano ("h-80", "h-56"...).
 * Se calcula desde el aspect ratio real de la foto — la misma lógica
 * que viste en los renders de masonry por aspect ratio.
 *
 * Ajusta los buckets a los tamaños de tu escala de Tailwind si usas otros.
 */
const HEIGHT_BUCKETS = [
  { maxRatio: 0.75, class: "h-96" }, // muy vertical (retrato alto)
  { maxRatio: 0.95, class: "h-80" }, // vertical
  { maxRatio: 1.15, class: "h-72" }, // casi cuadrada
  { maxRatio: 1.6, class: "h-56" }, // horizontal
  { maxRatio: Infinity, class: "h-44" }, // panorámica
];

export function getHeightClass(width: number, heightPx: number): string {
  const ratio = width / heightPx;
  const bucket = HEIGHT_BUCKETS.find((b) => ratio <= b.maxRatio);
  return bucket?.class ?? "h-72";
}

export function getOrientation(
  width: number,
  heightPx: number
): "vertical" | "horizontal" | "square" | "panoramic" {
  const ratio = width / heightPx;
  if (ratio < 0.9) return "vertical";
  if (ratio > 1.15 && ratio <= 2.2) return "horizontal";
  if (ratio > 2.2) return "panoramic";
  return "square";
}