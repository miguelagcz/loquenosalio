"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLiveViews } from "@/hooks/useLiveViews";
import { ArrowLeft, Download, Share2, Check, Heart } from "lucide-react";
import { useLikes } from "@/hooks/useLikes";
import { downloadMedia, trackPhotoDownload } from "@/lib/media-actions";

import { Photo } from "@/types";

interface Props {
  photo: Photo;
  previousPhoto: Photo;
  nextPhoto: Photo;
}

export default function PhotoDetail({ photo, previousPhoto, nextPhoto }: Props) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);

  const views = useLiveViews("photos", photo.id, photo.views);
  const { liked, toggle } = useLikes();
  const likeKey = `p-${photo.id}`;
  const [downloads, setDownloads] = useState(photo.downloads);

  const handleDownload = () => {
    downloadMedia(photo.src, photo.title);
    trackPhotoDownload(photo.id);
    setDownloads((d) => d + 1);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (Math.abs(deltaX) < 70) return;

    if (deltaX > 0) {
      window.location.href = `/photo/${previousPhoto.id}`;
      return;
    }
    window.location.href = `/photo/${nextPhoto.id}`;
  };

  // Navegación por teclado — sigue activa, sin botón visible
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") window.location.href = `/photo/${previousPhoto.id}`;
      if (event.key === "ArrowRight") window.location.href = `/photo/${nextPhoto.id}`;
      if (event.key === "Escape") window.location.href = "/";
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previousPhoto.id, nextPhoto.id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: photo.title, url });
        return;
      } catch {
        // el usuario canceló el share nativo, seguimos al fallback
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

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
            #{String(photo.id).padStart(4, "0")}
          </span>
        </div>

        {/* MARCO — mismo lenguaje que las tarjetas del home */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-md border border-black/20 bg-black/[0.02] p-1.5 dark:border-white/10 dark:bg-white/[0.03] sm:p-2"
        >
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative h-[58vh] w-full touch-pan-y overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-950 sm:h-[68vh]"
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </div>

          {/* INFO DEBAJO DE LA FOTO — igual que el visor de video */}
          <div className="flex flex-col gap-3 px-2 pb-2 pt-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold uppercase tracking-wide">
                {photo.title}
              </h1>
              <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500 dark:text-white/60">
                {photo.description || photo.date}
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
                {photo.date}
              </span>
              <button
                type="button"
                onClick={handleDownload}
                aria-label="Descargar"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-black/5 transition hover:bg-black hover:text-white dark:border-white/15 dark:bg-white/10 dark:hover:bg-white dark:hover:text-black"
              >
                <Download size={13} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Compartir"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-black/5 transition hover:bg-black hover:text-white dark:border-white/15 dark:bg-white/10 dark:hover:bg-white dark:hover:text-black"
              >
                {copied ? <Check size={13} /> : <Share2 size={13} />}
              </button>
              <button
                type="button"
                onClick={() => toggle(likeKey)}
                aria-label="Favorito"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-black/5 transition hover:bg-black hover:text-white dark:border-white/15 dark:bg-white/10 dark:hover:bg-white dark:hover:text-black"
              >
                <Heart size={13} fill={liked.has(likeKey) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}