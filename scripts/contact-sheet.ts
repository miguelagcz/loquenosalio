/**
 * Genera `contact-sheet.html`: una hoja de contactos con TODAS tus fotos
 * y su número (título), para ver de un vistazo cuáles son la misma escena
 * en otro ángulo y anotar los grupos.
 *
 * Uso:   npx tsx scripts/contact-sheet.ts
 * Luego abre el archivo contact-sheet.html (doble clic) en tu navegador.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { writeFileSync } from "node:fs";
import { WebSocket } from "ws";

config({ path: ".env.local" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).WebSocket = WebSocket;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

(async () => {
  const all: { id: number; title: string; src: string; set_name: string | null }[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("photos")
      .select("id,title,src,set_name")
      .order("id", { ascending: true })
      .range(from, from + 999);
    if (error) throw error;
    all.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }

  const cells = all
    .map(
      (p) => `<figure class="${p.set_name ? "g" : ""}">
  <img loading="lazy" src="${p.src}" alt="">
  <figcaption><b>${p.title}</b> <span>id ${p.id}</span>${
        p.set_name ? ` <em>${p.set_name}</em>` : ""
      }</figcaption>
</figure>`
    )
    .join("\n");

  writeFileSync(
    "contact-sheet.html",
    `<!doctype html><meta charset="utf-8"><title>Hoja de contactos</title>
<style>
  body{margin:0;padding:16px;font:12px system-ui;background:#111;color:#eee}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
  figure{margin:0;background:#1c1c1c;border-radius:8px;overflow:hidden}
  figure.g{outline:2px solid #4ade80}
  img{width:100%;aspect-ratio:1;object-fit:cover;display:block}
  figcaption{padding:6px 8px;display:flex;gap:6px;flex-wrap:wrap;align-items:baseline}
  b{font-size:15px} span{opacity:.5} em{color:#4ade80;font-style:normal}
</style>
<h3>${all.length} fotos — el número en negrita es el que usas en groups.txt (verde = ya tiene grupo)</h3>
<div class="grid">${cells}</div>`
  );
  console.log(`✓ contact-sheet.html creado con ${all.length} fotos`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});