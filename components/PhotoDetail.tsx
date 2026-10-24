"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLiveViews } from "@/hooks/useLiveViews";
import { useLikes } from "@/hooks/useLikes";
import { downloadMedia, trackPhotoDownload } from "@/lib/media-actions";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Check,
  Heart,
} from "lucide-react";

import { Photo } from "@/types";

interface Props {
  photo: Photo; // la foto de la URL (portada del carrete)
  group: Photo[]; // todas las fotos del carrete (1 si no hay grupo)
  initialIndex: number;
  previousPhoto: Photo;
  nextPhoto: Photo;
}

const glass =
  "flex items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-xl transition hover:bg-white hover:text-black";

export default function PhotoDetail({
  photo,
  group,
  initialIndex,
  previousPhoto,
  nextPhoto,
}: Props) {
  const isReel = group.length > 1;
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const [index, setIndex] = useState(initialIndex);
  const [copied, setCopied] = useState(false);
  const [extraDownloads, setExtraDownloads] = useState<Record<number, number>>({});

  const current = group[index] ?? photo;

  // Las visitas se cuentan una vez por apertura de la página (la foto de la URL),
  // no cada vez que pasas de foto dentro del carrete.
  const views = useLiveViews("photos", photo.id, photo.views);
  const { liked, toggle } = useLikes();
  const likeKey = `p-${current.id}`;
  const downloads = current.downloads + (extraDownloads[current.id] ?? 0);

  /* ------- carrete ------- */
  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const next = Math.min(group.length - 1, Math.max(0, i));
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    },
    [group.length]
  );

  // Posición inicial (sin animación)
  useEffect(() => {
    const el = trackRef.current;
    if (el && initialIndex > 0) el.scrollTo({ left: initialIndex * el.clientWidth });
  }, [initialIndex]);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  /* ------- navegación entre páginas (solo si NO hay carrete: el carrete usa su propio swipe) ------- */
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isReel) return;
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isReel || touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 70) return;
    window.location.href =
      deltaX > 0 ? `/photo/${previousPhoto.id}` : `/photo/${nextPhoto.id}`;
  };

  // Teclado: ← → recorren el carrete; en el borde pasan a la foto anterior/siguiente
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        if (isReel && index > 0) goTo(index - 1);
        else window.location.href = `/photo/${previousPhoto.id}`;
      }
      if (event.key === "ArrowRight") {
        if (isReel && index < group.length - 1) goTo(index + 1);
        else window.location.href = `/photo/${nextPhoto.id}`;
      }
      if (event.key === "Escape") window.location.href = "/";
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isReel, index, group.length, goTo, previousPhoto.id, nextPhoto.id]);

  /* ------- acciones ------- */
  const handleDownload = () => {
    downloadMedia(current.src, current.title);
    trackPhotoDownload(current.id);
    setExtraDownloads((d) => ({ ...d, [current.id]: (d[current.id] ?? 0) + 1 }));
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/photo/${photo.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: photo.title, url });
        return;
      } catch {
        // canceló: seguimos al fallback
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const round =
    "flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-black/5 transition hover:bg-black hover:text-white dark:border-white/15 dark:bg-white/10 dark:hover:bg-white dark:hover:text-black";

  return (
    <motion.main
      className="min-h-screen bg-white text-black dark:bg-black dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* NAV */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            <ArrowLeft size={14} />
            galería
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
            #{String(current.id).padStart(4, "0")}
          </span>
        </div>

        {/* MARCO */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-md border border-black/20 bg-black/[0.02] p-1.5 dark:border-white/10 dark:bg-white/[0.03] sm:p-2"
        >
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative h-[58vh] w-full overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-950 sm:h-[68vh]"
          >
            {/* CARRETE: scroll horizontal con snap (swipe nativo, fluido) */}
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {group.map((p, i) => (
                <div key={p.id} className="relative h-full w-full flex-none snap-center">
                  <Image
                    src={p.src}
                    alt={p.title}
                    fill
                    className="object-contain"
                    priority={i === initialIndex}
                    sizes="100vw"
                  />
                </div>
              ))}
            </div>

            {isReel && (
              <>
                {/* contador tipo insta */}
                <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-xl">
                  {index + 1} / {group.length}
                </span>

                {/* flechas (escritorio) */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => goTo(index - 1)}
                    aria-label="Anterior"
                    className={`${glass} absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 sm:flex`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                {index < group.length - 1 && (
                  <button
                    type="button"
                    onClick={() => goTo(index + 1)}
                    aria-label="Siguiente"
                    className={`${glass} absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 sm:flex`}
                  >
                    <ChevronRight size={18} />
                  </button>
                )}

                {/* puntos de vidrio */}
                <div className="absolute inset-x-0 bottom-3 flex justify-center">
                  <div className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/35 px-3 py-2 backdrop-blur-xl">
                    {group.map((p, i) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Ir a la foto ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          i === index ? "w-5 bg-white" : "w-1.5 bg-white/45 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-3 px-2 pb-2 pt-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold uppercase tracking-wide">
                {current.title}
              </h1>
              <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500 dark:text-white/60">
                {current.description || photo.description || current.date}
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-white/70">
              <span className="flex items-center gap-1.5 rounded-full border border-black/15 bg-black/5 px-2.5 py-1.5 dark:border-white/15 dark:bg-white/10">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {views.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-black/15 bg-black/5 px-2.5 py-1.5 dark:border-white/15 dark:bg-white/10">
                <Download size={11} />
                {downloads.toLocaleString()}
              </span>
              <span className="rounded-full border border-black/15 bg-black/5 px-2.5 py-1.5 dark:border-white/15 dark:bg-white/10">
                {current.date}
              </span>
              <button type="button" onClick={handleDownload} aria-label="Descargar" className={round}>
                <Download size={13} />
              </button>
              <button type="button" onClick={handleShare} aria-label="Compartir" className={round}>
                {copied ? <Check size={13} /> : <Share2 size={13} />}
              </button>
              <button type="button" onClick={() => toggle(likeKey)} aria-label="Favorito" className={round}>
                <Heart size={13} fill={liked.has(likeKey) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}