/**
 * Importa EN AUTOMÁTICO todo lo que ya subiste a Storage:
 * crea una fila en `photos` por cada imagen del bucket `loquesaliomal`
 * y una en `videos` por cada video de `loquesaliomalvideos`.
 *
 *  - Lee el ancho/alto real de cada foto (no tienes que escribirlos).
 *  - Lee la duración real de cada video.
 *  - Si ya existe una fila con ese mismo archivo, la salta (puedes correrlo
 *    varias veces cuando subas más cosas, sin duplicar).
 *  - Título = nombre del archivo ("calle-01.png" -> "calle 01").
 *  - Categoría = nombre de la carpeta donde esté el archivo; si está
 *    suelto en el bucket, usa DEFAULT_CATEGORY.
 *  - Poster de video = imagen con el mismo nombre en el bucket de videos
 *    ("viaje.mp4" + "viaje.jpg"). Si no hay, la genera sola con ffmpeg
 *    (un cuadro del video), la sube a la carpeta posters/ y la usa.
 *    Instalar ffmpeg:  sudo apt install ffmpeg
 *
 * Uso:
 *   npx tsx scripts/import-from-storage.ts --dry     (solo muestra, no escribe)
 *   npx tsx scripts/import-from-storage.ts           (importa de verdad)
 *
 * Requiere en .env.local: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { WebSocket } from "ws";
import { imageSize } from "image-size";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

config({ path: ".env.local" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).WebSocket = WebSocket;

const PHOTO_BUCKET = "loquesaliomal";
const VIDEO_BUCKET = "loquesaliomalvideos";
const DEFAULT_CATEGORY = "General";
const DRY = process.argv.includes("--dry");

const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabase = createClient(BASE, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const IMG = /\.(png|jpe?g|webp|avif)$/i;
const VID = /\.(mp4|mov|webm|m4v)$/i;

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const fmtDate = (iso?: string | null) => {
  const d = iso ? new Date(iso) : new Date();
  return `${MESES[d.getMonth()]} ${d.getFullYear()}`;
};

const publicUrl = (bucket: string, path: string) =>
  `${BASE}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;

const titleOf = (path: string) =>
  path
    .split("/")
    .pop()!
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

interface Entry { path: string; created_at?: string | null }

/** Lista todos los archivos del bucket, entrando a las carpetas. */
async function listAll(bucket: string, folder = ""): Promise<Entry[]> {
  const out: Entry[] = [];
  let offset = 0;
  for (;;) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, { limit: 1000, offset, sortBy: { column: "name", order: "asc" } });
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const f of data) {
      const full = folder ? `${folder}/${f.name}` : f.name;
      if (f.id === null) out.push(...(await listAll(bucket, full))); // carpeta
      else if (f.name !== ".emptyFolderPlaceholder") out.push({ path: full, created_at: f.created_at });
    }
    if (data.length < 1000) break;
    offset += 1000;
  }
  return out;
}

async function photoSize(url: string): Promise<{ w: number; h: number }> {
  // Primero solo los primeros 512 KB (basta para leer dimensiones)
  for (const range of ["bytes=0-524287", null]) {
    const res = await fetch(url, range ? { headers: { Range: range } } : undefined);
    if (!res.ok && res.status !== 206) continue;
    const buf = new Uint8Array(await res.arrayBuffer());
    try {
      const { width, height } = imageSize(buf);
      if (width && height) return { w: width, h: height };
    } catch {}
  }
  throw new Error("no pude leer dimensiones");
}

/** Lee la duración desde el átomo mvhd de un mp4/mov. */
function mp4Duration(buf: Buffer): string {
  const i = buf.indexOf("mvhd");
  if (i < 0) return "0:00";
  const version = buf[i + 4];
  let timescale: number, duration: number;
  if (version === 1) {
    timescale = buf.readUInt32BE(i + 24);
    duration = Number(buf.readBigUInt64BE(i + 28));
  } else {
    timescale = buf.readUInt32BE(i + 16);
    duration = buf.readUInt32BE(i + 20);
  }
  if (!timescale) return "0:00";
  const secs = Math.round(duration / timescale);
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
}

const naturalSort = (a: Entry, b: Entry) =>
  a.path.localeCompare(b.path, undefined, { numeric: true });

/** Saca un cuadro del video con ffmpeg (segundo 1, o el inicio si es muy corto). */
function makePoster(videoBytes: Buffer): Buffer | null {
  const dir = mkdtempSync(join(tmpdir(), "poster-"));
  try {
    const input = join(dir, "in.mp4");
    const output = join(dir, "out.jpg");
    writeFileSync(input, videoBytes);
    for (const ss of ["1", "0"]) {
      try {
        execFileSync(
          "ffmpeg",
          ["-y", "-ss", ss, "-i", input, "-frames:v", "1", "-vf", "scale=720:-2", "-q:v", "3", output],
          { stdio: "ignore" }
        );
        return readFileSync(output);
      } catch {}
    }
    return null;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function importPhotos() {
  const files = (await listAll(PHOTO_BUCKET)).filter((f) => IMG.test(f.path));
  const { data: existing } = await supabase.from("photos").select("src");
  const have = new Set((existing ?? []).map((r) => r.src as string));
  const todo = files.filter((f) => !have.has(publicUrl(PHOTO_BUCKET, f.path))).sort(naturalSort);
  console.log(`Fotos en Storage: ${files.length} · nuevas: ${todo.length}`);

  const rows = [];
  let n = 0;
  for (const f of todo) {
    const src = publicUrl(PHOTO_BUCKET, f.path);
    n++;
    try {
      const { w, h } = await photoSize(src);
      const parts = f.path.split("/");
      rows.push({
        title: titleOf(f.path),
        description: "",
        src,
        blur: src,
        width: w,
        height_px: h,
        category: parts.length > 1 ? parts[0] : DEFAULT_CATEGORY,
        date: fmtDate(f.created_at),
      });
      if (n % 25 === 0) console.log(`  leídas ${n}/${todo.length}`);
    } catch (e) {
      console.warn(`  ✗ ${f.path}: ${(e as Error).message}`);
    }
  }
  if (DRY) return console.log("DRY: ejemplo ->", rows[0]);
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await supabase.from("photos").insert(rows.slice(i, i + 100));
    if (error) throw error;
  }
  console.log(`✓ ${rows.length} fotos importadas`);
}

async function importVideos() {
  const all = await listAll(VIDEO_BUCKET);
  const files = all.filter((f) => VID.test(f.path));
  const posters = new Map(
    all.filter((f) => IMG.test(f.path)).map((f) => [f.path.replace(/\.[^.]+$/, "").toLowerCase(), f.path])
  );
  const { data: existing } = await supabase.from("videos").select("src");
  const have = new Set((existing ?? []).map((r) => r.src as string));
  const todo = files.filter((f) => !have.has(publicUrl(VIDEO_BUCKET, f.path))).sort(naturalSort);
  console.log(`Videos en Storage: ${files.length} · nuevos: ${todo.length}`);

  const rows = [];
  for (const f of todo) {
    const src = publicUrl(VIDEO_BUCKET, f.path);
    let duration = "0:00";
    let bytes: Buffer | null = null;
    try {
      const res = await fetch(src);
      bytes = Buffer.from(await res.arrayBuffer());
      duration = mp4Duration(bytes);
    } catch {}

    const key = f.path.replace(/\.[^.]+$/, "").toLowerCase();
    let poster = posters.get(key) ?? posters.get(`posters/${key}`);
    let posterUrl = poster ? publicUrl(VIDEO_BUCKET, poster) : null;

    if (!posterUrl && bytes) {
      const jpg = makePoster(bytes);
      if (jpg && !DRY) {
        const up = `posters/${f.path.replace(/\.[^.]+$/, "")}.jpg`;
        const { error } = await supabase.storage
          .from(VIDEO_BUCKET)
          .upload(up, jpg, { contentType: "image/jpeg", upsert: true });
        if (!error) posterUrl = publicUrl(VIDEO_BUCKET, up);
        else console.warn(`  ✗ poster de ${f.path}: ${error.message}`);
      } else if (jpg) {
        posterUrl = "(se generaría con ffmpeg)";
      } else {
        console.warn(`  ! sin poster para ${f.path} (¿ffmpeg instalado?)`);
      }
    }
    rows.push({
      title: titleOf(f.path),
      description: "",
      src,
      poster: posterUrl,
      duration,
      date: fmtDate(f.created_at),
    });
    console.log(`  ${f.path} · ${duration}`);
  }
  if (DRY) return console.log("DRY: ejemplo ->", rows[0]);
  if (rows.length) {
    const { error } = await supabase.from("videos").insert(rows);
    if (error) throw error;
  }
  console.log(`✓ ${rows.length} videos importados`);
}

(async () => {
  await importPhotos();
  await importVideos();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});