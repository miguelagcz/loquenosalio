"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLiveViews } from "@/hooks/useLiveViews";
import { useLikes } from "@/hooks/useLikes";
import { downloadMedia, trackPhotoDownload } from "@/lib/media-actions";
import { changePhotoLikes } from "@/lib/site-stats";
import { ActionButton } from "@/components/ActionButton";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
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

  // Un carrete comparte UNA sola descripción: la de la portada, o la primera que
  // tenga texto dentro del grupo. No cambia al pasar de foto.
  const description =
    group[0]?.description?.trim() ||
    group.find((p) => p.description?.trim())?.description?.trim() ||
    "";

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

  const handleLike = () => {
    const wasLiked = liked.has(likeKey);
    toggle(likeKey);
    // suma/resta al total de likes del sitio (la caja principal del home)
    changePhotoLikes(current.id, wasLiked ? -1 : 1);
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

  // Proporción de la foto de la URL. El marco se ajusta a ella: una foto vertical
  // de celular ocupa un marco angosto y alto (sin franjas vacías a los lados) y
  // la información pasa a un panel lateral en escritorio.
  const ratio = photo.width / photo.heightPx;
  const portrait = ratio < 0.95;
  const maxVh = portrait ? 84 : 72;
  // Nunca más ancho que la foto original: así no se amplía y no se ve borrosa.
  const frameWidth = `min(100%, calc(${maxVh}vh * ${ratio.toFixed(4)}), ${photo.width}px)`;


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
            scroll={false}
            className="flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            <ArrowLeft size={14} />
            galería
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
            #{String(current.id).padStart(4, "0")}
          </span>
        </div>

        <div
          className={`flex flex-col items-center gap-3 ${
            portrait ? "lg:flex-row lg:items-start lg:justify-center lg:gap-4" : ""
          }`}
        >
          {/* MARCO — se ajusta a la proporción de la foto */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{ width: frameWidth }}
            className="flex-none rounded-md border border-black/20 bg-black/[0.02] p-1.5 dark:border-white/10 dark:bg-white/[0.03] sm:p-2"
          >
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ aspectRatio: ratio }}
              className="relative w-full overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-950"
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
                      quality={90}
                      className="object-contain"
                      priority={i === initialIndex}
                      sizes="(max-width: 1024px) 100vw, 700px"
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
          </motion.div>

          {/* INFO — debajo de la foto; en escritorio, panel lateral si la foto es vertical */}
          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className={`w-full overflow-hidden rounded-2xl border border-black/10 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950 ${
              portrait ? "max-w-[min(100%,36rem)] lg:w-80 lg:flex-none" : "max-w-5xl"
            }`}
          >
            <div className={portrait ? "" : "sm:grid sm:grid-cols-[1fr_auto] sm:items-stretch"}>
              {/* título + descripción */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  <span>#{String(current.id).padStart(4, "0")}</span>
                  <span className="h-px w-4 bg-current opacity-40" />
                  <span>{current.date}</span>
                  {current.location && (
                    <>
                      <span className="h-px w-4 bg-current opacity-40" />
                      <span className="truncate">{current.location}</span>
                    </>
                  )}
                </div>
                <h1 className="mt-3 text-2xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-3xl">
                  {current.title}
                </h1>
                {description && (
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {description}
                  </p>
                )}
              </div>

              {/* stats + acciones */}
              <div
                className={`flex flex-col border-t border-black/10 dark:border-white/10 ${
                  portrait ? "" : "sm:border-l sm:border-t-0"
                }`}
              >
                <div className="grid grid-cols-2 divide-x divide-black/10 dark:divide-white/10">
                  <div className="px-5 py-4 sm:px-6">
                    <p className="flex items-center gap-1.5 text-xl font-bold leading-none tracking-tighter">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      {views.toLocaleString()}
                    </p>
                    <p className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                      views
                    </p>
                  </div>
                  <div className="px-5 py-4 sm:px-6">
                    <p className="flex items-center gap-1.5 text-xl font-bold leading-none tracking-tighter">
                      <Download size={14} className="opacity-50" />
                      {downloads.toLocaleString()}
                    </p>
                    <p className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                      descargas
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 items-center gap-2 border-t border-black/10 px-5 py-4 dark:border-white/10 sm:px-6">
                  <ActionButton kind="like" active={liked.has(likeKey)} onClick={handleLike} />
                  <ActionButton kind="link" active={copied} onClick={handleShare} />
                  <ActionButton kind="download" onClick={handleDownload} />
                  <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                    {copied ? "link copiado" : isReel ? `${index + 1} / ${group.length}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </motion.main>
  );
}