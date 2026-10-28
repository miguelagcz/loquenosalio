const KEY = "lqnsb-home-scroll";

/** Guarda en qué foto (y a qué altura) estabas al abrir una foto. */
export function saveHomeScroll(photoId: number) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ id: photoId, y: window.scrollY }));
  } catch {}
}

/**
 * Al volver a la galería, te regresa a esa foto (centrada en pantalla).
 * Reintenta unos instantes porque Next y las imágenes aún están acomodándose;
 * si empiezas a hacer scroll tú, deja de insistir.
 */
export function restoreHomeScroll() {
  let saved: { id?: number; y: number } | null = null;
  try {
    saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
  } catch {}
  if (!saved) return () => {};

  const { id, y } = saved;

  const go = () => {
    const el = id ? document.getElementById(`photo-${id}`) : null;
    if (el) {
      const r = el.getBoundingClientRect();
      window.scrollTo(0, Math.max(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2));
    } else {
      window.scrollTo(0, y);
    }
  };

  const timers = [0, 60, 200, 500].map((ms) => window.setTimeout(go, ms));
  const stop = () => timers.forEach(clearTimeout);
  const cleanup = () => {
    stop();
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
  };
  window.addEventListener("wheel", stop, { passive: true, once: true });
  window.addEventListener("touchstart", stop, { passive: true, once: true });
  const clear = window.setTimeout(() => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {}
  }, 900);

  return () => {
    cleanup();
    clearTimeout(clear);
  };
}
