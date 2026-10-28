"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layers } from "lucide-react";
import { motion } from "framer-motion";
import { Photo } from "@/types";
import { useLikesTotal } from "@/hooks/useLikesTotal";
import { restoreHomeScroll, saveHomeScroll } from "@/lib/scroll-memory";

interface BentoGalleryProps {
  photos: Photo[];
  stats: {
    photoCount: number;
    totalViews: number;
    totalLikes: number;
    since: string;
  };
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 0.68, 0, 1.01] as const },
  },
};

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Tamaño de cada tile. La unidad del grid es un cuadrito
 * (ancho de columna = alto de fila), así que el alto en filas sale de la
 * proporción REAL de la foto: una foto larga ocupa más filas y se ve larga.
 *
 *  móvil  = grid de 4 columnas
 *  escritorio (lg) = grid de 12 columnas
 *
 * Cada 9.ª foto casi cuadrada se agranda ("destacada") para dar ritmo bento.
 */
function getSpans(width: number, height: number, index: number) {
  const r = width / height;
  const featured = index % 9 === 4 && r >= 0.8 && r <= 1.25;

  if (featured) return { cm: 4, rm: 4, cd: 6, rd: 6 };

  if (r >= 2) {
    // panorámica
    return { cm: 4, rm: clamp(Math.round(4 / r), 1, 3), cd: 8, rd: clamp(Math.round(8 / r), 2, 5) };
  }
  if (r >= 1.2) {
    // horizontal
    return { cm: 4, rm: clamp(Math.round(4 / r), 2, 4), cd: 6, rd: clamp(Math.round(6 / r), 3, 6) };
  }
  if (r >= 0.8) {
    // casi cuadrada
    return { cm: 2, rm: 2, cd: 3, rd: 3 };
  }
  // vertical / muy larga: crece hacia abajo
  return { cm: 2, rm: clamp(Math.round(2 / r), 3, 6), cd: 3, rd: clamp(Math.round(3 / r), 4, 8) };
}

type Vars = React.CSSProperties & Record<`--${string}`, number>;

/** clases que leen las variables --cm/--rm (móvil) y --cd/--rd (escritorio) */
const spanClasses =
  "[grid-column:span_var(--cm)] [grid-row:span_var(--rm)] lg:[grid-column:span_var(--cd)] lg:[grid-row:span_var(--rd)]";

export function BentoGallery({ photos, stats }: BentoGalleryProps) {
  const likes = useLikesTotal(stats.totalLikes);

  // Al volver desde una foto, regresa a donde estabas
  useEffect(() => restoreHomeScroll(), []);

  // Una sola tarjeta por grupo (set_name): la primera foto es la portada del carrete
  const counts = new Map<string, number>();
  for (const p of photos) if (p.setName) counts.set(p.setName, (counts.get(p.setName) ?? 0) + 1);
  const seen = new Set<string>();
  const covers = photos.filter((p) => {
    if (!p.setName) return true;
    if (seen.has(p.setName)) return false;
    seen.add(p.setName);
    return true;
  });

  return (
    <section className="w-full px-2 pb-2 pt-14 sm:px-3 sm:pb-3 sm:pt-3">
      {/* Contenedor de consulta: alto de fila = ancho de una columna */}
      <div className="@container">
        <div className="grid auto-rows-[calc((100cqw-24px)/4)] grid-cols-4 gap-2 [grid-auto-flow:dense] lg:auto-rows-[calc((100cqw-88px)/12)] lg:grid-cols-12">
          {/* TÍTULO — tile invertido, el de más contraste */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ "--cm": 4, "--rm": 2, "--cd": 8, "--rd": 4 } as Vars}
            className={`${spanClasses} flex flex-col justify-between rounded-2xl bg-black p-5 text-white dark:bg-white dark:text-black sm:p-8`}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              miguel cruz
            </p>
            <h1 className="text-5xl font-bold uppercase leading-[0.9] tracking-tighter sm:text-7xl lg:text-8xl">
              lo que no
              <br />
              salió bien
            </h1>
          </motion.div>

          {/* MÉTRICAS */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ "--cm": 4, "--rm": 1, "--cd": 4, "--rd": 4 } as Vars}
            className={`${spanClasses} relative flex items-center justify-around gap-2 rounded-2xl bg-neutral-100 px-4 dark:bg-neutral-900 lg:flex-col lg:items-start lg:justify-center lg:gap-8 lg:px-8`}
          >
            <span className="absolute right-4 top-4 hidden items-center gap-1.5 lg:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-30 dark:bg-white dark:opacity-40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                live
              </span>
            </span>
            {[
              { value: stats.photoCount, label: "fotos" },
              { value: formatViews(stats.totalViews), label: "views" },
              { value: formatViews(likes), label: "likes" },
              { value: stats.since, label: "desde" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold uppercase leading-none tracking-tighter lg:text-5xl">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* FOTOS — grises; con el mouse o el dedo encima se vuelven a color */}
          {covers.map((photo, i) => (
            <PhotoCell
              key={photo.id}
              photo={photo}
              index={i}
              priority={i < 4}
              groupCount={photo.setName ? counts.get(photo.setName) ?? 1 : 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoCell({
  photo,
  index,
  priority,
  groupCount,
}: {
  photo: Photo;
  index: number;
  priority: boolean;
  groupCount: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [touched, setTouched] = useState(false); // dedo encima (celular)
  const [failed, setFailed] = useState(false); // la imagen no existe (404)
  const s = getSpans(photo.width, photo.heightPx, index);

  // Si el archivo ya no existe en Storage, no dejamos un hueco cargando para siempre
  if (failed) return null;

  return (
    <motion.div
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      id={`photo-${photo.id}`}
      style={{ "--cm": s.cm, "--rm": s.rm, "--cd": s.cd, "--rd": s.rd } as Vars}
      className={`${spanClasses} group relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900`}
    >
      {/* skeleton de la celda mientras carga la imagen */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-black/[0.06] dark:bg-white/[0.08]" />
      )}

      <Link
        href={`/photo/${photo.id}`}
        aria-label={photo.title}
        onClick={() => saveHomeScroll(photo.id)}
        onTouchStart={() => setTouched(true)}
        onTouchEnd={() => setTouched(false)}
        onTouchCancel={() => setTouched(false)}
        className="absolute inset-0 block"
      >
        <Image
          src={photo.src}
          alt={photo.title}
          fill
          priority={priority}
          ref={(img) => {
            if (img?.complete) setLoaded(true); // ya estaba en caché
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          sizes="(max-width: 1024px) 75vw, 50vw"
          className={`object-cover transition duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 ${
            touched ? "scale-105 grayscale-0" : "grayscale"
          }`}
        />
      </Link>

      {/* insignia de carrete: hay más ángulos de esta foto */}
      {groupCount > 1 && (
        <span className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-full border border-white/25 bg-black/35 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-xl">
          <Layers size={11} />
          {groupCount}
        </span>
      )}
    </motion.div>
  );
}