"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Search, Heart, Play, X } from "lucide-react";
import { Photo, Video } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLiveViews } from "@/hooks/useLiveViews";

interface ProofingGalleryProps {
  photos: Photo[];
  videos: Video[];
  stats: {
    photoCount: number;
    videoCount: number;
    totalViews: number;
    since: string;
  };
}

type ContentType = "all" | "photos" | "videos";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 0.68, 0, 1.01] as const },
  },
};

export function ProofingGallery({ photos, videos, stats }: ProofingGalleryProps) {
  const [contentType, setContentType] = useState<ContentType>("all");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [openVideo, setOpenVideo] = useState<Video | null>(null);
  const [openToken, setOpenToken] = useState(0);

  const liveViews = useLiveViews(
    "videos",
    openVideo?.id ?? null,
    openVideo?.views ?? 0,
    openToken
  );

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const showPhotos = contentType === "all" || contentType === "photos";
  const showVideos = contentType === "all" || contentType === "videos";

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* NAV — solo el toggle de tema */}
      <div className="mb-10 flex items-center justify-end">
        <ThemeToggle />
      </div>

      {/* BREADCRUMB + TÍTULO GRANDE */}
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
        home / galería
      </p>
      <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
        lo que no
        <br />
        salió bien
      </h1>

      {/* TODAS / FOTOS / VIDEOS — en el lugar de las categorías, misma tipografía */}
      <div className="mt-8 flex items-center gap-5 border-b border-black/10 pb-4 dark:border-white/10">
        {(["todas", "fotos", "videos"] as const).map((label) => {
          const type: ContentType =
            label === "todas" ? "all" : label === "fotos" ? "photos" : "videos";
          return (
            <button
              key={label}
              type="button"
              onClick={() => setContentType(type)}
              className={`text-xs font-bold uppercase tracking-wider transition ${
                contentType === type
                  ? "text-black dark:text-white"
                  : "text-neutral-400 hover:text-black dark:text-neutral-600 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* GRID MASONRY — fotos y/o videos según lo elegido en el nav */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-8 columns-2 gap-4 sm:columns-3"
      >
        {showVideos &&
          videos.map((video) => (
            <motion.div key={`v-${video.id}`} variants={item} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => {
                  setOpenVideo(video);
                  setOpenToken((t) => t + 1);
                }}
                className="block w-full overflow-hidden rounded-md border border-black/20 bg-black/[0.02] p-1.5 text-left dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="relative overflow-hidden rounded-sm">
                  <Image
                    src={video.poster}
                    alt={video.title}
                    width={1000}
                    height={1400}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="w-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black">
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </div>
              </button>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="truncate text-xs font-bold uppercase tracking-wide">
                  {video.title}
                </p>
                <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
                  {video.duration}
                </span>
              </div>
            </motion.div>
          ))}

        {showPhotos &&
          photos.map((photo) => (
            <motion.div key={photo.id} variants={item} className="group mb-4 break-inside-avoid">
              <div className="overflow-hidden rounded-md border border-black/20 bg-black/[0.02] p-1.5 transition-colors dark:border-white/10 dark:bg-white/[0.03]">
                <Link href={`/photo/${photo.id}`} className="block overflow-hidden rounded-sm">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    width={photo.width}
                    height={photo.heightPx}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="w-full"
                  />
                </Link>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-baseline gap-2">
                  <p className="truncate text-xs font-bold uppercase tracking-wide">
                    {photo.title}
                  </p>
                  <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
                    #{String(photo.id).padStart(4, "2")}
                  </span>
                </div>

                <div className="flex flex-shrink-0 items-center gap-1">
                  <a
                    href={photo.src}
                    download
                    aria-label="Descargar"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 transition hover:bg-black/5 hover:text-black dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <Download size={12} />
                  </a>
                  <Link
                    href={`/photo/${photo.id}`}
                    aria-label="Ver en grande"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 transition hover:bg-black/5 hover:text-black dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <Search size={12} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleLike(photo.id)}
                    aria-label="Favorito"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 transition hover:bg-black/5 hover:text-black dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <Heart size={12} fill={liked.has(photo.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
      </motion.div>

      {/* MODAL DE VIDEO — mismo contador en vivo que ya tenías */}
      <AnimatePresence>
        {openVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenVideo(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setOpenVideo(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-md border border-white/10 bg-black"
            >
              <video
                src={openVideo.src}
                poster={openVideo.poster}
                controls
                autoPlay
                playsInline
                className="block max-h-[75vh] w-full bg-black object-contain"
              />
              <div className="p-4">
                <p className="text-sm font-bold uppercase tracking-wide text-white">
                  {openVideo.title}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {liveViews.toLocaleString()} views · {openVideo.duration}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}