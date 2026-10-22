"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Photo, Video } from "@/types";
import { getGridSpan, getOrientation } from "@/lib/masonry";
import { useLiveViews } from "@/hooks/useLiveViews";
import Skeleton from "./Skeleton";

interface GalleryProps {
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

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

const tile =
  "relative overflow-hidden rounded-xl border border-white/15 bg-white/5 transition-colors duration-300 hover:border-white/25";

/**
 * Una sola grilla bento continua: título, stats, fotos y videos comparten
 * el mismo grid de 6 columnas y el mismo lenguaje visual (badge numerado +
 * orientación en la esquina, borde blanco/15, sin secciones separadas).
 * Búsqueda y categoría viven en un único botón en la esquina, no en una
 * barra ancha ni en pills en medio de la página.
 */
export function Gallery({ photos, videos, stats }: GalleryProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [contentType, setContentType] = useState<ContentType>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const [loadedVideos, setLoadedVideos] = useState<number[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [openToken, setOpenToken] = useState(0);

  const categories = ["All", ...new Set(photos.map((p) => p.category))];
  const term = search.toLowerCase().trim();

  const filteredPhotos =
    contentType === "videos"
      ? []
      : photos.filter((p) => {
          const matchesSearch =
            term === "" ||
            p.title.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            p.tags.some((t) => t.toLowerCase().includes(term));
          const matchesCategory = category === "All" || p.category === category;
          return matchesSearch && matchesCategory;
        });

  const filteredVideos =
    contentType === "photos"
      ? []
      : videos.filter((v) => {
          return (
            term === "" ||
            v.title.toLowerCase().includes(term) ||
            v.tags.some((t) => t.toLowerCase().includes(term))
          );
        });

  const hasResults = filteredPhotos.length > 0 || filteredVideos.length > 0;

  const currentIndex = selectedVideo
    ? filteredVideos.findIndex((v) => v.id === selectedVideo.id)
    : -1;

  const previousVideo = () => {
    if (currentIndex === -1) return;
    const index = (currentIndex - 1 + filteredVideos.length) % filteredVideos.length;
    setSelectedVideo(filteredVideos[index]);
  };

  const nextVideo = () => {
    if (currentIndex === -1) return;
    const index = (currentIndex + 1) % filteredVideos.length;
    setSelectedVideo(filteredVideos[index]);
  };

  const liveViews = useLiveViews(
    "videos",
    selectedVideo?.id ?? null,
    selectedVideo?.views ?? 0,
    openToken
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedVideo) return;
      if (event.key === "Escape") setSelectedVideo(null);
      if (event.key === "ArrowLeft") previousVideo();
      if (event.key === "ArrowRight") nextVideo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideo, currentIndex, filteredVideos]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setContentType("all");
  };

  const renderPhoto = (
    photo: Photo,
    badge: number,
    positionClass: string,
    priority = false,
    style?: React.CSSProperties
  ) => {
    const orientation = getOrientation(photo.width, photo.heightPx);
    return (
      <motion.div
        key={`photo-${photo.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: Math.min(badge * 0.03, 0.6) }}
        className={positionClass}
        style={style}
      >
        <Link
          href={`/photo/${photo.id}`}
          className={`${tile} group block h-full min-h-[110px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40`}
        >
          {!loadedImages.includes(photo.id) && <Skeleton className="absolute inset-0" />}

          <span className="absolute left-2 top-2 z-10 font-mono text-[10px] text-white/70">
            {String(badge).padStart(2, "0")} · {orientation}
          </span>

          <Image
            src={photo.src}
            alt={photo.title}
            fill
            placeholder="blur"
            blurDataURL={photo.blur}
            sizes="(max-width: 768px) 50vw, 33vw"
            priority={priority}
            onLoad={() =>
              setLoadedImages((prev) => (prev.includes(photo.id) ? prev : [...prev, photo.id]))
            }
            className={`object-cover transition-all duration-700 group-hover:scale-[1.02] ${
              loadedImages.includes(photo.id)
                ? "scale-100 opacity-100 blur-0"
                : "scale-105 opacity-0 blur-md"
            }`}
          />
        </Link>
      </motion.div>
    );
  };

  const renderVideo = (video: Video, badge: number, positionClass: string) => (
    <motion.div
      key={`video-${video.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(badge * 0.03, 0.6) }}
      className={positionClass}
    >
      <button
        type="button"
        onClick={() => {
          setSelectedVideo(video);
          setOpenToken((t) => t + 1);
        }}
        className={`${tile} group flex h-full min-h-[140px] w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40`}
      >
        {!loadedVideos.includes(video.id) && <Skeleton className="absolute inset-0" />}

        <span className="absolute left-2 top-2 z-10 font-mono text-[10px] text-white/70">
          {String(badge).padStart(2, "0")} · video
        </span>

        <Image
          src={video.poster}
          alt={video.title}
          fill
          sizes="33vw"
          onLoad={() =>
            setLoadedVideos((prev) => (prev.includes(video.id) ? prev : [...prev, video.id]))
          }
          className={`object-cover transition-all duration-700 group-hover:scale-[1.02] ${
            loadedVideos.includes(video.id) ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md">
          <Play size={16} fill="white" className="ml-0.5" />
        </div>
      </button>
    </motion.div>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* NAV + BÚSQUEDA/FILTRO — un solo botón en la esquina */}
      <div className="relative mb-6 flex items-center justify-between text-xs text-zinc-500">
        <span className="font-orbitron tracking-wide text-white">mc</span>

        <div className="flex items-center gap-4">
          {hasResults && (
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 sm:block">
              {filteredPhotos.length + filteredVideos.length} items
              {category !== "All" && ` · ${category.toLowerCase()}`}
            </p>
          )}

          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            aria-label="Buscar y filtrar"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-400 transition hover:border-white/25 hover:text-white"
          >
            {filterOpen ? <X size={14} /> : <SlidersHorizontal size={14} />}
          </button>
        </div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 z-20 w-56 rounded-lg border border-white/15 bg-black/95 p-2 backdrop-blur-md"
            >
              <div className="relative mb-2">
                <Search
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar..."
                  aria-label="Buscar fotos o videos"
                  autoFocus
                  className="w-full rounded-md border border-white/10 bg-white/5 py-1.5 pl-8 pr-2 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
                />
              </div>

              <div className="mb-2 flex gap-1 border-t border-white/10 pt-2">
                {(["all", "photos", "videos"] as ContentType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setContentType(t)}
                    className={`flex-1 rounded-md px-2 py-1 font-voice text-[11px] lowercase transition-colors ${
                      contentType === t
                        ? "bg-white/10 text-white"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1 border-t border-white/10 pt-1">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-md px-3 py-1.5 text-left font-voice text-xs lowercase transition-colors ${
                      category === item
                        ? "bg-white/10 text-white"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!hasResults && (
        <div className="py-20 text-center">
          <p className="text-lg text-zinc-500">no se encontró nada.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-md border border-white/15 bg-white/5 px-5 py-2 text-sm text-white transition hover:bg-white/10"
          >
            limpiar filtros
          </button>
        </div>
      )}

      {/* UNA SOLA GRILLA — posiciones fijas por span relativo (igual que el
          BentoHero original que sí funcionaba): el navegador coloca cada
          celda en la primera fila libre para su rango de columnas, así
          es imposible que se encimen dos celdas. */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:auto-rows-[52px] md:grid-cols-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* FOTO 01 — vertical, alta */}
        {filteredPhotos[0] &&
          renderPhoto(
            filteredPhotos[0],
            1,
            "md:[grid-column:4/6] md:[grid-row:span_3]",
            true
          )}

        {/* STATS — photos / videos / since apiladas en una sola celda */}
        <div
          className={`${tile} relative flex flex-col justify-center gap-2.5 p-4 md:[grid-column:6/7] md:[grid-row:span_3]`}
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
        </div>

        {/* VIEWS TOTALES */}
        <div
          className={`${tile} flex flex-col justify-center p-4 md:[grid-column:1/3] md:[grid-row:span_2]`}
        >
          <p className="font-orbitron text-2xl font-medium text-white">
            {formatViews(stats.totalViews)}
          </p>
          <p className="text-[9px] text-zinc-500">views totales</p>
        </div>

        {/* FOTO 02 */}
        {filteredPhotos[1] &&
          renderPhoto(filteredPhotos[1], 2, "md:[grid-column:3/5] md:[grid-row:span_2]")}

        {/* VIDEO 01 */}
        {filteredVideos[0] &&
          renderVideo(filteredVideos[0], 3, "md:[grid-column:6/7] md:[grid-row:span_3]")}

        {/* FOTO 03 */}
        {filteredPhotos[2] &&
          renderPhoto(filteredPhotos[2], 4, "md:[grid-column:1/3] md:[grid-row:span_2]")}

        {/* FOTO 04 — horizontal, ancha */}
        {filteredPhotos[3] &&
          renderPhoto(filteredPhotos[3], 5, "md:[grid-column:3/6] md:[grid-row:span_2]")}

        {/* FOTO 05 */}
        {filteredPhotos[4] &&
          renderPhoto(filteredPhotos[4], 6, "md:[grid-column:1/3] md:[grid-row:span_2]")}

        {/* VIDEO 02 */}
        {filteredVideos[1] &&
          renderVideo(filteredVideos[1], 7, "md:[grid-column:3/5] md:[grid-row:span_2]")}

        {/* VIDEO 03 */}
        {filteredVideos[2] &&
          renderVideo(filteredVideos[2], 8, "md:[grid-column:5/7] md:[grid-row:span_2]")}

        {/* Extra: más de 5 fotos o 3 videos siguen aquí, tamaño por aspect ratio */}
        {filteredPhotos.slice(5).map((photo, i) => {
          const { colSpan, rowSpan } = getGridSpan(photo.width, photo.heightPx);
          return renderPhoto(photo, i + 6, "", false, {
            gridColumn: `span ${colSpan}`,
            gridRow: `span ${rowSpan}`,
          });
        })}
        {filteredVideos
          .slice(3)
          .map((video, i) =>
            renderVideo(video, i + 9, "md:[grid-column:span_2] md:[grid-row:span_2]")
          )}
      </div>

      {/* MODAL DE VIDEO */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              aria-label="Cerrar video"
              className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition hover:bg-white/10 sm:right-6 sm:top-6"
            >
              <X size={20} />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previousVideo();
              }}
              aria-label="Video anterior"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:bg-white/10"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextVideo();
              }}
              aria-label="Siguiente video"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:bg-white/10"
            >
              <ChevronRight size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl border border-white/15 bg-black"
            >
              <video
                src={selectedVideo.src}
                poster={selectedVideo.poster}
                controls
                autoPlay
                playsInline
                className="block max-h-[75vh] w-full bg-black object-contain"
              />

              <div className="p-5">
                <h2 className="font-orbitron text-xl font-medium lowercase text-white">
                  {selectedVideo.title}
                </h2>
                <p className="mt-2 font-voice text-sm text-zinc-500">
                  {selectedVideo.date} · {selectedVideo.duration}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedVideo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] lowercase text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex gap-3 border-t border-white/10 pt-5">
                  <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5">
                    <p className="font-orbitron text-lg font-medium text-white">
                      {liveViews.toLocaleString()}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-zinc-600">views</p>
                  </div>
                  <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5">
                    <p className="font-orbitron text-lg font-medium text-white">
                      {selectedVideo.duration}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-zinc-600">
                      duration
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}