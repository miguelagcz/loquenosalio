/**
 * Borra fotos por id: la fila de la base de datos Y el archivo de Storage
 * (si dejaras el archivo, import-from-storage.ts lo volvería a importar).
 *
 * Edita la lista IDS de abajo.
 *
 * Uso:
 *   npx tsx scripts/delete-photos.ts --dry   (solo muestra qué borraría)
 *   npx tsx scripts/delete-photos.ts         (borra de verdad)
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { WebSocket } from "ws";

config({ path: ".env.local" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).WebSocket = WebSocket;

const IDS = [66, 360, 361, 357, 356];
const BUCKET = "loquesaliomal";
const DRY = process.argv.includes("--dry");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

(async () => {
  const { data, error } = await supabase.from("photos").select("id,src,set_name").in("id", IDS);
  if (error) throw error;

  const rows = data ?? [];
  const missing = IDS.filter((id) => !rows.some((r) => r.id === id));
  if (missing.length) console.warn(`no encontré en la base: ${missing.join(", ")}`);

  const files = rows.map((r) => decodeURIComponent((r.src as string).split(`/${BUCKET}/`)[1] ?? ""));
  for (const [i, r] of rows.entries()) {
    console.log(`id ${r.id} -> ${files[i] || "(sin archivo)"}${r.set_name ? `  [estaba en grupo ${r.set_name}]` : ""}`);
  }
  if (DRY) return console.log(`DRY: se borrarían ${rows.length} fotos`);

  const toRemove = files.filter(Boolean);
  if (toRemove.length) {
    const { error: sErr } = await supabase.storage.from(BUCKET).remove(toRemove);
    if (sErr) throw sErr;
  }
  const { error: dErr } = await supabase.from("photos").delete().in("id", rows.map((r) => r.id));
  if (dErr) throw dErr;
  console.log(`✓ ${rows.length} fotos borradas (base de datos y Storage)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});