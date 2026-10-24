import { supabase } from "./supabase";
import { getHeightClass } from "./masonry";
import { Photo } from "@/types";

// Fila cruda tal como sale de Supabase (snake_case, sin `height`)
interface PhotoRow {
  id: number;
  title: string;
  description: string | null;
  src: string;
  blur: string | null;
  width: number;
  height_px: number;
  category: string;
  tags: string[];
  views: number;
  downloads: number;
  date: string | null;
  location: string | null;
  camera: string | null;
  lens: string | null;
  iso: number | null;
  aperture: string | null;
  shutter: string | null;
  set_name: string | null;
}

function toPhoto(row: PhotoRow): Photo {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    src: row.src,
    blur: row.blur ?? row.src,
    width: row.width,
    heightPx: row.height_px,
    height: getHeightClass(row.width, row.height_px), // calculado, no viene de la DB
    category: row.category,
    tags: row.tags,
    views: row.views,
    downloads: row.downloads,
    date: row.date ?? "",
    location: row.location ?? "",
    camera: row.camera ?? "",
    lens: row.lens ?? "",
    iso: row.iso ?? 0,
    aperture: row.aperture ?? "",
    shutter: row.shutter ?? "",
    setName: row.set_name ?? null,
  };
}

/** Reemplaza el `import { photos } from "@/data/photos"` en tus componentes */
export async function getPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return (data as PhotoRow[]).map(toPhoto);
}

export async function getPhotoById(id: number): Promise<Photo | null> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? toPhoto(data as PhotoRow) : null;
}

export async function getPhotosByCategory(category: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("category", category)
    .order("id", { ascending: true });

  if (error) throw error;
  return (data as PhotoRow[]).map(toPhoto);
}

/**
 * Suma +1 a las views de una foto. Llama a la función de Postgres
 * (ver increment-views.sql) en vez de hacer un update directo —
 * la publishable key no tiene permiso de UPDATE en la tabla,
 * solo de ejecutar esta función puntual.
 */
export async function incrementPhotoViews(id: number): Promise<void> {
  const { error } = await supabase.rpc("increment_photos_views", {
    photo_id: id,
  });
  if (error) throw error;
}