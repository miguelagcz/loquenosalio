/**
 * Aplica tus grupos (carretes) desde el archivo `groups.txt`.
 *
 * groups.txt: una línea por grupo, con los números (títulos) de las fotos
 * que son la misma escena. Acepta comas, espacios y rangos:
 *
 *     # comentarios con #
 *     12, 13, 14
 *     40-43
 *     57 58 61
 *
 * Uso:
 *   npx tsx scripts/apply-groups.ts --dry   (solo muestra qué haría)
 *   npx tsx scripts/apply-groups.ts         (aplica de verdad)
 *
 * Para buscar por id de la base de datos en vez de por título: --by=id
 * --reset: antes de aplicar, quita TODOS los grupos actuales y deja solo los de groups.txt
 *          (úsalo cuando cambies/quites fotos de un grupo).
 * Es repetible: volver a correrlo actualiza los grupos sin duplicar nada.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { WebSocket } from "ws";

config({ path: ".env.local" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).WebSocket = WebSocket;

const DRY = process.argv.includes("--dry");
const BY_ID = process.argv.includes("--by=id");
const RESET = process.argv.includes("--reset");
const column = BY_ID ? "id" : "title";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parseLine(line: string): string[] {
  const out: string[] = [];
  for (const token of line.split(/[\s,]+/).filter(Boolean)) {
    const m = token.match(/^(\d+)-(\d+)$/);
    if (m) {
      for (let n = Number(m[1]); n <= Number(m[2]); n++) out.push(String(n));
    } else out.push(token);
  }
  return out;
}

(async () => {
  const lines = readFileSync("groups.txt", "utf8")
    .split("\n")
    .map((l) => l.replace(/#.*/, "").trim())
    .filter(Boolean);

  if (RESET) {
    if (DRY) console.log("DRY: se quitarían todos los grupos actuales antes de aplicar");
    else {
      const { error: rErr } = await supabase.from("photos").update({ set_name: null }).not("set_name", "is", null);
      if (rErr) throw rErr;
      console.log("grupos anteriores quitados");
    }
  }

  const used = new Map<string, number>();
  let applied = 0;

  for (const [i, line] of lines.entries()) {
    const keys = parseLine(line);
    if (keys.length < 2) {
      console.warn(`línea ${i + 1}: "${line}" tiene menos de 2 fotos, la salto`);
      continue;
    }
    for (const k of keys) {
      if (used.has(k)) console.warn(`  ! "${k}" ya estaba en el grupo de la línea ${used.get(k)}`);
      used.set(k, i + 1);
    }

    const name = `g-${keys[0]}`;
    const { data: found, error } = await supabase
      .from("photos")
      .select("id,title")
      .in(column, BY_ID ? keys.map(Number) : keys);
    if (error) throw error;

    const foundKeys = new Set((found ?? []).map((r) => String(BY_ID ? r.id : r.title)));
    const missing = keys.filter((k) => !foundKeys.has(k));
    console.log(
      `${name}: ${found?.length ?? 0} fotos` + (missing.length ? `  (no encontré: ${missing.join(", ")})` : "")
    );
    if (!found || found.length < 2) continue;

    if (!DRY) {
      const { error: upErr } = await supabase
        .from("photos")
        .update({ set_name: name })
        .in("id", found.map((r) => r.id));
      if (upErr) throw upErr;
    }
    applied++;
  }
  console.log(DRY ? `DRY: se crearían ${applied} grupos` : `✓ ${applied} grupos aplicados`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});