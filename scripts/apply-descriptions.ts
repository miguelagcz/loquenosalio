/**
 * Pone la descripción de cada foto desde el archivo `descriptions.txt`.
 *
 * descriptions.txt: una línea por foto con  id: texto
 * (el id es el número chico junto a "id" en contact-sheet.html)
 *
 *     # comentarios con #
 *     12: Atardecer desde la azotea, antes de la lluvia.
 *     13: Mismo atardecer, un paso a la izquierda.
 *
 * Las fotos que no pongas quedan como están. Es repetible: correrlo otra vez
 * solo actualiza esas líneas.
 *
 * Uso:
 *   npx tsx scripts/apply-descriptions.ts --dry   (solo muestra)
 *   npx tsx scripts/apply-descriptions.ts         (aplica)
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { WebSocket } from "ws";

config({ path: ".env.local" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).WebSocket = WebSocket;

const DRY = process.argv.includes("--dry");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

(async () => {
  const entries: { id: number; text: string }[] = [];
  for (const [n, raw] of readFileSync("descriptions.txt", "utf8").split("\n").entries()) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (/^\d+\s*:\s*$/.test(line)) continue; // "12:" sin texto todavía: se salta
    const m = line.match(/^(\d+)\s*:\s*(.+)$/);
    if (!m) {
      console.warn(`línea ${n + 1}: no entiendo "${line.slice(0, 40)}…" (usa  id: texto)`);
      continue;
    }
    entries.push({ id: Number(m[1]), text: m[2].trim() });
  }

  let ok = 0;
  let missing = 0;
  for (const { id, text } of entries) {
    if (DRY) {
      console.log(`${id}: ${text}`);
      ok++;
      continue;
    }
    const { data, error } = await supabase
      .from("photos")
      .update({ description: text })
      .eq("id", id)
      .select("id");
    if (error) throw error;
    if (data?.length) ok++;
    else {
      missing++;
      console.warn(`  ✗ no existe la foto con id ${id}`);
    }
  }
  console.log(
    DRY
      ? `DRY: se actualizarían ${ok} descripciones`
      : `✓ ${ok} descripciones aplicadas` + (missing ? ` (${missing} ids no existen)` : "")
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});