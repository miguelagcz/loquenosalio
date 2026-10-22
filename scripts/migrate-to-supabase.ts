/**
 * Script de migración única: copia tus arrays estáticos actuales
 * (data/photos.ts y data/videos.ts) hacia las tablas de Supabase.
 *
 * Requiere que YA hayas subido tus imágenes/videos a Storage y que
 * `photo.src` / `video.src` apunten a las URLs públicas de Storage
 * en vez de "/photos/photo1.jpg" (ruta local) — actualiza esos valores
 * en tus archivos originales antes de correr esto, o mapea aquí mismo.
 *
 * Uso:
 *   npx tsx scripts/migrate-to-supabase.ts
 *
 * Requiere en .env.local: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { WebSocket } from "ws";
import { photos } from "../data/photos";
import { videos } from "../data/videos";

// tsx no carga .env.local automáticamente como sí lo hace Next.js —
// hay que decírselo explícitamente aquí.
config({ path: ".env.local" });

// Node 20 no trae WebSocket nativo (sí Node 22+). El cliente de Supabase
// lo necesita para inicializar Realtime, aunque este script no lo use.
(globalThis as any).WebSocket = WebSocket;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migratePhotos() {
  const rows = photos.map((p) => ({
    // id NO se envía: la tabla lo genera sola (GENERATED ALWAYS AS IDENTITY).
    // Como insertamos en el mismo orden 1→5 sobre una tabla vacía,
    // los ids resultantes van a coincidir de todas formas.
    title: p.title,
    description: p.description,
    src: p.src, // <- reemplaza por la URL de Storage antes de correr
    blur: p.blur,
    width: p.width,
    height_px: p.heightPx,
    // `height` (la clase tailwind) NO se migra: se calcula en el cliente
    category: p.category,
    tags: p.tags,
    views: p.views,
    downloads: p.downloads,
    date: p.date,
    location: p.location,
    camera: p.camera,
    lens: p.lens,
    iso: p.iso,
    aperture: p.aperture,
    shutter: p.shutter,
  }));

  const { error } = await supabase.from("photos").insert(rows);
  if (error) throw error;
  console.log(`✓ ${rows.length} fotos migradas`);
}

async function migrateVideos() {
  const rows = videos.map((v) => ({
    // id NO se envía, mismo motivo que en fotos.
    title: v.title,
    src: v.src, // <- reemplaza por la URL de Storage antes de correr
    poster: v.poster,
    duration: v.duration,
    views: v.views,
    date: v.date,
    tags: v.tags,
  }));

  const { error } = await supabase.from("videos").insert(rows);
  if (error) throw error;
  console.log(`✓ ${rows.length} videos migrados`);
}

async function main() {
  await migratePhotos();
  await migrateVideos();
}

main().catch((err) => {
  console.error("Migración falló:", err);
  process.exit(1);
});