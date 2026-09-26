"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLiveViews } from "@/hooks/useLiveViews";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Download } from "lucide-react";

import { Photo } from "@/types";

interface Props {
  photo: Photo;
  previousPhoto: Photo;
  nextPhoto: Photo;
  index?: number;
  total?: number;
}

export default function PhotoDetail({
  photo,
  previousPhoto,
  nextPhoto,
  index,
  total,
}: Props) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") window.location.href = `/photo/${previousPhoto.id}`;
      if (event.key === "ArrowRight") window.location.href = `/photo/${nextPhoto.id}`;
      if (event.key === "Escape") window.location.href = "/";
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previousPhoto.id, nextPhoto.id]);

  return (
    <motion.main
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {/* NAV — mismo lenguaje que el bento del homepage */}
        <div className="mb-6 flex items-center justify-between text-xs text-zinc-500 sm:mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            <span className="font-voice lowercase">volver a la galería</span>
          </Link>
          {index !== undefined && total !== undefined && (
            <span className="font-mono text-[10px]">
              {String(index).padStart(2, "0")} / {total}
            </span>
          )}
        </div>

        {/* IMAGE */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[55vh] w-full touch-pan-y overflow-hidden rounded-xl border border-white/15 bg-white/[0.02] sm:h-[65vh] lg:h-[75vh]"
        >
          <Image src={photo.src} alt={photo.title} fill className="object-contain" priority sizes="100vw" />
        </motion.div>

        {/* INFO */}
        <div className="mt-8 sm:mt-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="font-orbitron text-3xl font-medium lowercase tracking-tight text-white sm:text-4xl lg:text-5xl">
                {photo.title}
              </h1>
              <p className="mt-3 font-voice text-sm text-zinc-500">
                {photo.category.toLowerCase()} · {photo.location} · {photo.date}
              </p>
            </div>

            {/* STATS — mismas dos métricas, ahora con bordes marcados como el bento */}
            <div className="flex gap-3">
              <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-right">
                <p className="flex items-center justify-end gap-1.5 font-orbitron text-lg font-medium text-white">
                  <Eye size={13} className="text-zinc-500" />
                  {views.toLocaleString()}
                </p>
                <p className="text-[9px] uppercase tracking-wider text-zinc-600">views</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-right">
                <p className="flex items-center justify-end gap-1.5 font-orbitron text-lg font-medium text-white">
                  <Download size={13} className="text-zinc-500" />
                  {photo.downloads.toLocaleString()}
                </p>
                <p className="text-[9px] uppercase tracking-wider text-zinc-600">downloads</p>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-300 sm:mt-8 sm:text-lg sm:leading-8">
            {photo.description}
          </p>
        </div>

        {/* TAGS */}
        <div className="mt-7 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
          {photo.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] lowercase text-zinc-400 sm:px-4 sm:py-2 sm:text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* DATOS TÉCNICOS — no son métricas, por eso van en minúsculas y sin números destacados */}
        <p className="mt-8 text-[10px] uppercase tracking-widest text-zinc-600 sm:mt-10">
          datos técnicos
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
          <InfoCard label="camera" value={photo.camera} />
          <InfoCard label="lens" value={photo.lens} />
          <InfoCard label="iso" value={String(photo.iso)} />
          <InfoCard label="aperture" value={photo.aperture} />
          <InfoCard label="shutter" value={photo.shutter} />
          <InfoCard label="location" value={photo.location} />
        </div>

        {/* PREVIOUS / NEXT */}
        <div className="mt-10 border-t border-white/10 pt-6 sm:mt-16 sm:pt-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <Link
              href={`/photo/${previousPhoto.id}`}
              className="group rounded-xl border border-white/15 bg-white/5 p-4 transition hover:bg-white/10 sm:rounded-2xl sm:p-6"
            >
              <div className="flex items-center gap-2 text-zinc-500">
                <ChevronLeft size={16} />
                <p className="font-voice text-xs sm:text-sm">anterior</p>
              </div>
              <h3 className="mt-2 truncate font-orbitron text-sm font-medium lowercase transition group-hover:text-zinc-300 sm:text-xl">
                {previousPhoto.title}
              </h3>
            </Link>

            <Link
              href={`/photo/${nextPhoto.id}`}
              className="group rounded-xl border border-white/15 bg-white/5 p-4 text-right transition hover:bg-white/10 sm:rounded-2xl sm:p-6"
            >
              <div className="flex items-center justify-end gap-2 text-zinc-500">
                <p className="font-voice text-xs sm:text-sm">siguiente</p>
                <ChevronRight size={16} />
              </div>
              <h3 className="mt-2 truncate font-orbitron text-sm font-medium lowercase transition group-hover:text-zinc-300 sm:text-xl">
                {nextPhoto.title}
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-3 sm:rounded-xl sm:p-5">
      <p className="text-[10px] uppercase tracking-wider text-zinc-600 sm:text-xs">{label}</p>
      <p className="mt-1 break-words font-mono text-xs text-zinc-200 sm:mt-2 sm:text-base">{value}</p>
    </div>
  );
}