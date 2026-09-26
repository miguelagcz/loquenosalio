"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Photo, Video } from "@/types";

interface BentoHeroProps {
  photos: Photo[]; // usa las primeras 4 para el bento
  stats: {
    photoCount: number;
    videoCount: number;
    totalViews: number;
    since: string;
  };
  featuredVideo?: Video;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 0.68, 0, 1.01] as const },
  },
};

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

/**
 * Posiciones EXACTAS del render (grid de 6 columnas, auto-rows de 52px):
 *
 *   título        → col 1/4, row span 2
 *   foto 01       → col 4/6, row span 3
 *   stats         → col 6/7, row span 3
 *   views totales → col 1/3, row span 2
 *   foto 02       → col 3/5, row span 2
 *   video         → col 6/7, row span 3  (se acomoda debajo de stats solo)
 *   foto 03       → col 1/3, row span 2
 *   foto 04       → col 3/6, row span 2
 *
 * En mobile todo se apila en una sola columna (sin spans).
 */
export function BentoHero({ photos, stats, featuredVideo }: BentoHeroProps) {
  const [p1, p2, p3, p4] = photos;

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
    >
      <motion.div
        variants={item}
        className="mb-6 flex items-center justify-between text-xs text-zinc-500"
      >
        <span className="font-orbitron tracking-wide text-white">mc</span>
        <div className="flex gap-5">
          <span>fotos</span>
          <span>videos</span>
          <span>index</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-2 md:auto-rows-[52px] md:grid-cols-6">
        {/* TÍTULO — col 1/4, row span 2 */}
        <motion.div
          variants={item}
          className="flex items-center rounded-xl border border-white/15 bg-white/5 px-5 py-6 md:[grid-column:1/4] md:[grid-row:span_2]"
        >
          <h1 className="font-orbitron text-3xl font-medium leading-[0.92] tracking-tight text-white lowercase sm:text-4xl">
            lo que
            <br />
            no salió
            <br />
            bien
          </h1>
        </motion.div>

        {/* FOTO 01 — col 4/6, row span 3 */}
        {p1 && (
          <motion.div
            variants={item}
            className="relative min-h-[160px] overflow-hidden rounded-xl border border-white/15 md:[grid-column:4/6] md:[grid-row:span_3]"
          >
            <Image
              src={p1.src}
              alt={p1.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <span className="absolute left-2 top-2 font-mono text-[10px] text-white/70">
              01 · {p1.category.toLowerCase()}
            </span>
          </motion.div>
        )}

        {/* STATS — col 6/7, row span 3 */}
        <motion.div
          variants={item}
          className="relative flex flex-col justify-center gap-2.5 rounded-xl border border-white/15 bg-white/5 p-4 md:[grid-column:6/7] md:[grid-row:span_3]"
        >
          <span className="absolute right-3 top-3 flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-[8px] text-zinc-500">live</span>
          </span>
          <div>
            <p className="font-orbitron text-xl font-medium text-white">{stats.photoCount}</p>
            <p className="text-[9px] text-zinc-500">photos</p>
          </div>
          <div>
            <p className="font-orbitron text-xl font-medium text-white">{stats.videoCount}</p>
            <p className="text-[9px] text-zinc-500">videos</p>
          </div>
          <div>
            <p className="font-orbitron text-xl font-medium text-white">{stats.since}</p>
            <p className="text-[9px] text-zinc-500">since</p>
          </div>
        </motion.div>

        {/* VIEWS TOTALES — col 1/3, row span 2 */}
        <motion.div
          variants={item}
          className="flex flex-col justify-center rounded-xl border border-white/15 bg-white/5 p-4 md:[grid-column:1/3] md:[grid-row:span_2]"
        >
          <p className="font-orbitron text-2xl font-medium text-white">
            {formatViews(stats.totalViews)}
          </p>
          <p className="text-[9px] text-zinc-500">views totales</p>
        </motion.div>

        {/* FOTO 02 — col 3/5, row span 2 */}
        {p2 && (
          <motion.div
            variants={item}
            className="relative min-h-[100px] overflow-hidden rounded-xl border border-white/15 md:[grid-column:3/5] md:[grid-row:span_2]"
          >
            <Image src={p2.src} alt={p2.title} fill sizes="33vw" className="object-cover" />
            <span className="absolute left-2 top-2 font-mono text-[10px] text-white/70">02</span>
          </motion.div>
        )}

        {/* VIDEO — col 6/7, row span 3 (se acomoda solo debajo de stats) */}
        {featuredVideo && (
          <motion.div
            variants={item}
            className="relative flex min-h-[100px] items-center justify-center overflow-hidden rounded-xl border border-white/15 md:[grid-column:6/7] md:[grid-row:span_3]"
          >
            <Image
              src={featuredVideo.poster}
              alt={featuredVideo.title}
              fill
              sizes="20vw"
              className="object-cover"
            />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black/40">
              <div className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-white" />
            </div>
            <span className="absolute left-2 top-2 font-mono text-[10px] text-white/70">video</span>
          </motion.div>
        )}

        {/* FOTO 03 — col 1/3, row span 2 */}
        {p3 && (
          <motion.div
            variants={item}
            className="relative min-h-[100px] overflow-hidden rounded-xl border border-white/15 md:[grid-column:1/3] md:[grid-row:span_2]"
          >
            <Image src={p3.src} alt={p3.title} fill sizes="33vw" className="object-cover" />
            <span className="absolute left-2 top-2 font-mono text-[10px] text-white/70">03</span>
          </motion.div>
        )}

        {/* FOTO 04 — col 3/6, row span 2 */}
        {p4 && (
          <motion.div
            variants={item}
            className="relative min-h-[100px] overflow-hidden rounded-xl border border-white/15 md:[grid-column:3/6] md:[grid-row:span_2]"
          >
            <Image src={p4.src} alt={p4.title} fill sizes="50vw" className="object-cover" />
            <span className="absolute left-2 top-2 font-mono text-[10px] text-white/70">
              04 · {p4.category.toLowerCase()}
            </span>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}