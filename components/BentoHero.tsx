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
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
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
        className="mb-8 flex items-center justify-between text-xs text-zinc-500"
      >
        <span className="font-orbitron tracking-wide text-white">mc</span>
        <div className="flex gap-5">
          <span>fotos</span>
          <span>videos</span>
          <span>index</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
        <motion.div
          variants={item}
          className="col-span-1 flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-6 md:col-span-3"
        >
          <h1 className="font-orbitron text-4xl font-medium leading-[0.92] tracking-tight text-white lowercase sm:text-5xl">
            lo que
            <br />
            no salió
            <br />
            bien
          </h1>
        </motion.div>

        {p1 && (
          <motion.div
            variants={item}
            className="relative col-span-1 row-span-2 min-h-[220px] overflow-hidden rounded-xl border border-white/10 md:col-span-3"
          >
            <Image
              src={p1.src}
              alt={p1.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute left-2 top-2 font-mono text-[10px] text-white/70">
              01 · {p1.category.toLowerCase()}
            </span>
          </motion.div>
        )}

        <motion.div
          variants={item}
          className="relative col-span-1 flex flex-col justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-1"
        >
          <span className="absolute right-3 top-3 flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-[8px] text-zinc-500">live</span>
          </span>
          <div>
            <p className="font-orbitron text-xl font-medium text-white">
              {stats.photoCount}
            </p>
            <p className="text-[9px] text-zinc-500">photos</p>
          </div>
          <div>
            <p className="font-orbitron text-xl font-medium text-white">
              {stats.videoCount}
            </p>
            <p className="text-[9px] text-zinc-500">videos</p>
          </div>
          <div>
            <p className="font-orbitron text-xl font-medium text-white">
              {stats.since}
            </p>
            <p className="text-[9px] text-zinc-500">since</p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="col-span-1 flex flex-col justify-center rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2"
        >
          <p className="font-orbitron text-2xl font-medium text-white">
            {formatViews(stats.totalViews)}
          </p>
          <p className="text-[9px] text-zinc-500">views totales</p>
        </motion.div>

        {p2 && (
          <motion.div
            variants={item}
            className="relative col-span-1 min-h-[110px] overflow-hidden rounded-xl border border-white/10 md:col-span-2"
          >
            <Image src={p2.src} alt={p2.title} fill sizes="33vw" className="object-cover" />
            <span className="absolute left-2 top-2 font-mono text-[10px] text-white/70">02</span>
          </motion.div>
        )}

        {featuredVideo && (
          <motion.div
            variants={item}
            className="relative col-span-1 flex min-h-[110px] items-center justify-center overflow-hidden rounded-xl border border-white/10 md:col-span-1"
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
            <span className="absolute left-2 top-2 font-mono text-[10px] text-white/70">
              video
            </span>
          </motion.div>
        )}

        {p3 && (
          <motion.div
            variants={item}
            className="relative col-span-1 min-h-[110px] overflow-hidden rounded-xl border border-white/10 md:col-span-2"
          >
            <Image src={p3.src} alt={p3.title} fill sizes="33vw" className="object-cover" />
            <span className="absolute left-2 top-2 font-mono text-[10px] text-white/70">03</span>
          </motion.div>
        )}

        {p4 && (
          <motion.div
            variants={item}
            className="relative col-span-1 min-h-[110px] overflow-hidden rounded-xl border border-white/10 md:col-span-3"
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