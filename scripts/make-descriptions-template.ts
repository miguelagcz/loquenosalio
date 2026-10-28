/**
 * Arma `descriptions.txt` listo para llenar: una línea por GRUPO (con el id de
 * su portada) y una por cada foto suelta. Solo tienes que escribir el texto
 * después de los dos puntos. Las líneas vacías ("12:") se ignoran al aplicar.
 *
 * Si ya hay descripciones en la base de datos, las trae ya escritas.
 * Si descriptions.txt ya tenía líneas tuyas, lo guarda antes en descriptions.bak.txt
 *
 * Uso:  npx tsx scripts/make-descriptions-template.ts
 * Luego edita descriptions.txt y aplica:  npx tsx scripts/apply-descriptions.ts
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { WebSocket } from "ws";

config({ path: ".env.local" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).WebSocket = WebSocket;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Row = { id: number; description: string | null; set_name: string | null };

(async () => {
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("photos")
      .select("id,description,set_name")
      .order("id")
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...(data as Row[]));
    if (!data || data.length < 1000) break;
  }

  const groups = new Map<string, Row[]>();
  const singles: Row[] = [];
  for (const r of rows) {
    if (r.set_name) groups.set(r.set_name, [...(groups.get(r.set_name) ?? []), r]);
    else singles.push(r);
  }

  const text = (rs: Row[]) => rs.find((r) => r.description?.trim())?.description?.trim() ?? "";

  const out: string[] = [
    "# Escribe el texto después de los dos puntos. Líneas sin texto se ignoran.",
    "# GRUPOS: una sola descripción para todo el carrete (aparece en todas sus fotos).",
    "# Aplica con:  npx tsx scripts/apply-descriptions.ts",
    "",
    "# ============ GRUPOS ============",
  ];
  for (const g of [...groups.values()].sort((a, b) => a[0].id - b[0].id)) {
    out.push(`# grupo de ${g.length}: ${g.map((r) => r.id).join(", ")}`);
    out.push(`${g[0].id}: ${text(g)}`);
  }
  out.push("", "# ============ FOTOS SUELTAS ============");
  for (const r of singles) out.push(`${r.id}: ${r.description?.trim() ?? ""}`);

  if (existsSync("descriptions.txt")) {
    const had = readFileSync("descriptions.txt", "utf8")
      .split("\n")
      .some((l) => /^\d+\s*:\s*\S/.test(l.trim()));
    if (had) {
      writeFileSync("descriptions.bak.txt", readFileSync("descriptions.txt", "utf8"));
      console.log("(tu descriptions.txt anterior quedó en descriptions.bak.txt)");
    }
  }
  writeFileSync("descriptions.txt", out.join("\n") + "\n");
  console.log(`✓ descriptions.txt listo: ${groups.size} grupos + ${singles.length} fotos sueltas`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});