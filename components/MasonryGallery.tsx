"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Photo } from "@/types";
import { getGridSpan, getOrientation } from "@/lib/masonry";
import Skeleton from "./Skeleton";

export default function MasonryGallery({ photos }: { photos: Photo[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = ["All", ...new Set(photos.map((photo) => photo.category))];

  const filteredPhotos = photos.filter((photo) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      searchTerm === "" ||
      photo.title.toLowerCase().includes(searchTerm) ||
      photo.category.toLowerCase().includes(searchTerm) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

    const matchesCategory = category === "All" || photo.category === category;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      {/* Un único botón en la esquina agrupa búsqueda + categorías, sin
          barra ancha ni fila de pills — la atención queda en las fotos */}
      <div className="relative mb-4 flex items-center justify-between">
        {filteredPhotos.length > 0 && (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? "photo" : "photos"}
            {category !== "All" && ` · ${category.toLowerCase()}`}
            {search && ` · "${search}"`}
          </p>
        )}

        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          aria-label="Buscar y filtrar por categoría"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-400 transition hover:border-white/25 hover:text-white"
        >
          {filterOpen ? <X size={14} /> : <SlidersHorizontal size={14} />}
        </button>

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
                  aria-label="Buscar fotos"
                  autoFocus
                  className="w-full rounded-md border border-white/10 bg-white/5 py-1.5 pl-8 pr-2 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
                />
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

      {filteredPhotos.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-zinc-500">no se encontraron fotos.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-md border border-white/15 bg-white/5 px-5 py-2 text-sm text-white transition hover:bg-white/10"
          >
            limpiar filtros
          </button>
        </div>
      )}

      {/* GRID — mismo lenguaje que BentoHero: 6 columnas, dense, bordes marcados */}
      <div className="grid grid-cols-3 gap-2 [grid-auto-flow:dense] sm:grid-cols-4 md:auto-rows-[44px] md:grid-cols-6">
        {filteredPhotos.map((photo, i) => {
          const { colSpan, rowSpan } = getGridSpan(photo.width, photo.heightPx);
          const orientation = getOrientation(photo.width, photo.heightPx);

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.6) }}
              className="col-span-3 sm:col-span-2"
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
              }}
            >
              <Link
                href={`/photo/${photo.id}`}
                className="group relative block h-full min-h-[110px] overflow-hidden rounded-xl border border-white/15 bg-white/5 transition-colors duration-300 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {!loadedImages.includes(photo.id) && (
                  <Skeleton className="absolute inset-0" />
                )}

                <span className="absolute left-2 top-2 z-10 font-mono text-[10px] text-white/70">
                  {String(i + 1).padStart(2, "0")} · {orientation}
                </span>

                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  placeholder="blur"
                  blurDataURL={photo.blur}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  priority={i === 0}
                  onLoad={() =>
                    setLoadedImages((prev) =>
                      prev.includes(photo.id) ? prev : [...prev, photo.id]
                    )
                  }
                  className={`object-cover transition-all duration-700 ${
                    loadedImages.includes(photo.id)
                      ? "scale-100 opacity-100 blur-0"
                      : "scale-105 opacity-0 blur-md"
                  }`}
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/20 to-transparent p-4"
                >
                  <h3 className="font-orbitron text-sm lowercase text-white sm:text-base">
                    {photo.title}
                  </h3>
                  <p className="mt-1 text-xs lowercase text-zinc-300">
                    {photo.views.toLocaleString()} views · {photo.category.toLowerCase()}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}