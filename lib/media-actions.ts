import { supabase } from "@/lib/supabase";

function slug(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "archivo"
  );
}

function extOf(url: string) {
  const m = url.split("?")[0].match(/\.([a-z0-9]{2,4})$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

/**
 * Descarga real del archivo. El atributo <a download> se ignora con URLs de
 * otro dominio (Supabase), así que bajamos el archivo como blob y lo guardamos.
 * Si falla (red/CORS), abre la URL con ?download= que fuerza la descarga.
 */
export async function downloadMedia(url: string, title: string) {
  const filename = `${slug(title)}.${extOf(url)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1500);
  } catch {
    window.open(`${url}?download=${encodeURIComponent(filename)}`, "_blank");
  }
}

/** Menú nativo de compartir (celular); en escritorio copia el enlace. */
export async function shareMedia(
  title: string,
  url: string
): Promise<"shared" | "copied" | "failed"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, url });
      return "shared";
    } catch {
      // canceló: seguimos al fallback
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}

/** Suma +1 a las descargas de una foto (ver features.sql). */
export async function trackPhotoDownload(id: number) {
  const { error } = await supabase.rpc("increment_photo_downloads", {
    photo_id: id,
  });
  if (error) console.error("No se pudo registrar la descarga:", error.message);
}