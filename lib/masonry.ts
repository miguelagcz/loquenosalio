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

export function getBentoSpan(width: number, heightPx: number) {
  const ratio = width / heightPx; // >1 = más ancha que alta, <1 = más alta que ancha

  if (ratio >= 2.1) return { colSpan: 4, rowSpan: 2 }; // panorámica: ancha y baja
  if (ratio >= 1.25) return { colSpan: 3, rowSpan: 3 }; // horizontal
  if (ratio >= 0.85) return { colSpan: 2, rowSpan: 3 }; // cuadrada
  if (ratio >= 0.55) return { colSpan: 2, rowSpan: 5 }; // vertical: angosta y alta
  return { colSpan: 1, rowSpan: 6 }; // muy vertical: lo más angosto y alto
}

export function getGridSpan(
  width: number,
  heightPx: number
): { colSpan: number; rowSpan: number } {
  const orientation = getOrientation(width, heightPx);
  const ratio = width / heightPx;

  switch (orientation) {
    case "vertical":
      return { colSpan: 2, rowSpan: Math.round(4 / ratio) || 4 };
    case "panoramic":
      return { colSpan: 4, rowSpan: 2 };
    case "horizontal":
      return { colSpan: 3, rowSpan: 2 };
    case "square":
    default:
      return { colSpan: 2, rowSpan: 2 };
  }
}