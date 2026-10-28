import { supabase } from "@/lib/supabase";

/** Total de likes de todo el sitio (0 si todavía no corres features3.sql). */
export async function getTotalLikes(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("site_stats")
      .select("value")
      .eq("key", "likes")
      .maybeSingle();
    if (error || !data) return 0;
    return Number(data.value) || 0;
  } catch {
    return 0;
  }
}

/** +1 / -1 al like de una foto; suma también al total del sitio. */
export async function changePhotoLikes(photoId: number, delta: 1 | -1) {
  const { error } = await supabase.rpc("change_photo_likes", {
    photo_id: photoId,
    delta,
  });
  if (error) console.error("No se pudo guardar el like:", error.message);
}