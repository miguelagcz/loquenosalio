"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLiveViews } from "@/hooks/useLiveViews";
import { ArrowLeft, Eye, Download, Share2, Check } from "lucide-react";

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
        <Link
          href="/"
          className="mb-6 flex w-fit items-center gap-2 font-voice text-sm text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          volver a la galería
        </Link>

        {/* FOTO — toda la atención aquí, sin botones encima */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[60vh] w-full touch-pan-y overflow-hidden rounded-2xl border border-black/10 dark:border-white/15 sm:h-[72vh]"
        >
          <Image
            src={photo.src}
            alt={photo.title}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </motion.div>

        {/* PANEL FLOTANTE TIPO VIDRIO — único bloque de información, debajo de la foto, sin invadirla */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="relative z-10 mx-auto mt-4 w-full rounded-2xl border border-black/10 bg-white/70 p-5 shadow-lg backdrop-blur-xl dark:border-white/15 dark:bg-black/40 sm:mt-5 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-orbitron text-xl font-medium lowercase tracking-tight sm:text-2xl">
                {photo.title}
              </h1>
              <p className="mt-1 font-voice text-xs text-neutral-500 dark:text-neutral-400">
                {photo.date}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm">
                <Eye size={14} className="text-neutral-400" />
                {views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <Download size={14} className="text-neutral-400" />
                {photo.downloads.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Compartir"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-black/5 transition hover:bg-black/10 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15"
              >
                {copied ? <Check size={14} /> : <Share2 size={14} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}