"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Search, Heart, Play, X, Share2, Check } from "lucide-react";
import { Photo, Video } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLiveViews } from "@/hooks/useLiveViews";
import { useLikes } from "@/hooks/useLikes";
import { downloadMedia, shareMedia, trackPhotoDownload } from "@/lib/media-actions";

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

/** Botón redondo de vidrio para el overlay interior de cada tarjeta */
const glassBtn =
  "flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-black";

/** Descripción corta: usa `description` si existe en tus datos; si no, categoría/fecha */
function getDescription(media: unknown, fallback = ""): string {
  const m = media as { description?: string; category?: string };
  return m.description || m.category || fallback;
}

export function ProofingGallery({ photos, videos, stats }: ProofingGalleryProps) {
  const [contentType, setContentType] = useState<ContentType>("all");
  const { liked, toggle: toggleLike } = useLikes();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openVideo, setOpenVideo] = useState<Video | null>(null);
  const [openToken, setOpenToken] = useState(0);

  const liveViews = useLiveViews(
    "videos",
    openVideo?.id ?? null,
    openVideo?.views ?? 0,
    openToken
  );

  const handleShare = async (key: string, title: string, url: string) => {
    const result = await shareMedia(title, url);
    if (result === "copied") {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800);
    }
  };

  const handlePhotoDownload = (photo: Photo) => {
    downloadMedia(photo.src, photo.title);
    trackPhotoDownload(photo.id);
  };

  const shareUrl = (path = "") =>
    typeof window === "undefined" ? path : `${window.location.origin}${path}`;

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

      {/* TODAS / FOTOS / VIDEOS */}
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

      {/* GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-8 columns-2 gap-4 sm:columns-3"
      >
        {/* VIDEOS */}
        {showVideos &&
          videos.map((video) => {
            const key = `v-${video.id}`;
            return (
              <motion.div key={key} variants={item} className="mb-4 break-inside-avoid">
                <div className="group overflow-hidden rounded-md border border-black/20 bg-black/[0.02] p-1.5 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-neutral-200 dark:bg-neutral-900">
                    <Image
                      src={video.poster}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Click en toda la tarjeta abre el video */}
                    <button
                      type="button"
                      aria-label={`Reproducir ${video.title}`}
                      onClick={() => {
                        setOpenVideo(video);
                        setOpenToken((t) => t + 1);
                      }}
                      className="absolute inset-0 z-10"
                    />

                    {/* Play central */}
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>

                    {/* Overlay interior: título, descripción, botones */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 pt-14 text-white opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                      <div className="flex items-baseline gap-2">
                        <p className="truncate text-xs font-bold uppercase tracking-wide">
                          {video.title}
                        </p>
                        <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-white/50">
                          {video.duration}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/70">
                        {getDescription(video)}
                      </p>
                      <div className="pointer-events-auto mt-2.5 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => downloadMedia(video.src, video.title)}
                          aria-label="Descargar"
                          className={glassBtn}
                        >
                          <Download size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShare(key, video.title, shareUrl())}
                          aria-label="Compartir"
                          className={glassBtn}
                        >
                          {copiedKey === key ? <Check size={13} /> : <Share2 size={13} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleLike(key)}
                          aria-label="Favorito"
                          className={glassBtn}
                        >
                          <Heart size={13} fill={liked.has(key) ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

        {/* FOTOS */}
        {showPhotos &&
          photos.map((photo) => {
            const key = `p-${photo.id}`;
            return (
              <motion.div key={key} variants={item} className="mb-4 break-inside-avoid">
                <div className="group overflow-hidden rounded-md border border-black/20 bg-black/[0.02] p-1.5 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-neutral-200 dark:bg-neutral-900">
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Click en toda la tarjeta abre la foto */}
                    <Link
                      href={`/photo/${photo.id}`}
                      aria-label={`Ver ${photo.title}`}
                      className="absolute inset-0 z-10"
                    />

                    {/* Overlay interior: título, descripción, botones */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 pt-14 text-white opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                      <div className="flex items-baseline gap-2">
                        <p className="truncate text-xs font-bold uppercase tracking-wide">
                          {photo.title}
                        </p>
                        <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-white/50">
                          #{String(photo.id).padStart(4, "0")}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/70">
                        {getDescription(photo)}
                      </p>

                      <div className="pointer-events-auto mt-2.5 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePhotoDownload(photo)}
                          aria-label="Descargar"
                          className={glassBtn}
                        >
                          <Download size={13} />
                        </button>
                        <Link
                          href={`/photo/${photo.id}`}
                          aria-label="Ver en grande"
                          className={glassBtn}
                        >
                          <Search size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            handleShare(key, photo.title, shareUrl(`/photo/${photo.id}`))
                          }
                          aria-label="Compartir"
                          className={glassBtn}
                        >
                          {copiedKey === key ? <Check size={13} /> : <Share2 size={13} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleLike(key)}
                          aria-label="Favorito"
                          className={glassBtn}
                        >
                          <Heart size={13} fill={liked.has(key) ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </motion.div>

      {/* MODAL DE VIDEO */}
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
              className="w-full max-w-4xl rounded-md border border-white/15 bg-white/[0.04] p-1.5 sm:p-2"
            >
              <div className="relative overflow-hidden rounded-sm bg-black">
                <video
                  src={openVideo.src}
                  poster={openVideo.poster}
                  controls
                  autoPlay
                  playsInline
                  className="block max-h-[70vh] w-full bg-black object-contain"
                />
              </div>
              <div className="flex items-end justify-between gap-3 px-2 pb-2 pt-3 text-white">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold uppercase tracking-wide">
                    {openVideo.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-white/60">
                    {getDescription(openVideo)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider text-white/70">
                  <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    {liveViews.toLocaleString()} views
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5">
                    {openVideo.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() => downloadMedia(openVideo.src, openVideo.title)}
                    aria-label="Descargar"
                    className={glassBtn}
                  >
                    <Download size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(`v-${openVideo.id}`, openVideo.title, shareUrl())}
                    aria-label="Compartir"
                    className={glassBtn}
                  >
                    {copiedKey === `v-${openVideo.id}` ? <Check size={13} /> : <Share2 size={13} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLike(`v-${openVideo.id}`)}
                    aria-label="Favorito"
                    className={glassBtn}
                  >
                    <Heart size={13} fill={liked.has(`v-${openVideo.id}`) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}