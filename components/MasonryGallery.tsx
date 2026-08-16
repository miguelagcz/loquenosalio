"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { photos } from "@/data/photos";
import Skeleton from "./Skeleton";
import GalleryToolbar from "./GalleryToolbar";

export default function MasonryGallery() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loadedImages, setLoadedImages] = useState<number[]>([]);

  /* -------------------------------- */
  /* CATEGORIES */
  /* -------------------------------- */

  const categories = [
    "All",
    ...new Set(
      photos.map((photo) => photo.category)
    ),
  ];

  /* -------------------------------- */
  /* FILTER */
  /* -------------------------------- */

  const filteredPhotos = photos.filter((photo) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      searchTerm === "" ||
      photo.title
        .toLowerCase()
        .includes(searchTerm) ||
      photo.category
        .toLowerCase()
        .includes(searchTerm) ||
      photo.tags.some((tag) =>
        tag
          .toLowerCase()
          .includes(searchTerm)
      );

    const matchesCategory =
      category === "All" ||
      photo.category === category;

    return (
      matchesSearch &&
      matchesCategory
    );
  });

  /* -------------------------------- */
  /* CLEAR FILTERS */
  /* -------------------------------- */

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        pb-20
      "
    >

      {/* TOOLBAR */}

      <GalleryToolbar
        search={search}
        setSearch={setSearch}
      />

      {/* CATEGORIES */}

      <div className="flex flex-wrap gap-3 mb-8">

        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              setCategory(item)
            }
            className={`
              px-4
              py-2
              rounded-full
              text-sm
              transition-all
              duration-300
              ${
                category === item
                  ? `
                    bg-white
                    text-black
                  `
                  : `
                    bg-zinc-900
                    text-zinc-400
                    hover:bg-zinc-800
                    hover:text-white
                  `
              }
            `}
          >
            {item}
          </button>
        ))}

      </div>

      {/* RESULT COUNT */}

      {filteredPhotos.length > 0 && (
        <div className="mb-6">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-zinc-600
            "
          >
            {filteredPhotos.length}{" "}
            {filteredPhotos.length === 1
              ? "Photo"
              : "Photos"}
          </p>

        </div>
      )}

      {/* EMPTY STATE */}

      {filteredPhotos.length === 0 && (
        <div className="py-20 text-center">

          <p className="text-zinc-500 text-lg">
            No photos found.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="
              mt-4
              px-5
              py-2
              rounded-full
              bg-white
              text-black
              hover:bg-zinc-200
              transition
            "
          >
            Clear filters
          </button>

        </div>
      )}

      {/* MASONRY GRID */}

      <div
        className="
          columns-1
          md:columns-2
          xl:columns-3
          gap-6
        "
      >

        {filteredPhotos.map(
          (photo, index) => (

            <motion.article
              key={photo.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="
                mb-6
                break-inside-avoid
              "
            >

              <Link
                href={`/photo/${photo.id}`}
                className="
                  block
                  rounded-3xl
                  overflow-hidden
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-md
                  shadow-xl
                  transition-all
                  duration-500
                  hover:scale-[1.02]
                  hover:border-white/20
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white/40
                "
              >

                {/* IMAGE */}

                <div
                  className={`
                    relative
                    w-full
                    overflow-hidden
                    group
                    ${photo.height}
                  `}
                >

                  {/* SKELETON */}

                  {!loadedImages.includes(
                    photo.id
                  ) && (
                    <Skeleton
                      className="
                        absolute
                        inset-0
                      "
                    />
                  )}

                  {/* IMAGE */}

                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    placeholder="blur"
                    blurDataURL={photo.blur}
                    sizes="
                      (max-width: 768px) 100vw,
                      (max-width: 1280px) 50vw,
                      33vw
                    "
                    priority={
                      photo.id === 1
                    }
                    onLoad={() => {
                      setLoadedImages(
                        (prev) =>
                          prev.includes(
                            photo.id
                          )
                            ? prev
                            : [
                                ...prev,
                                photo.id,
                              ]
                      );
                    }}
                    className={`
                      object-cover
                      transition-all
                      duration-700
                      ${
                        loadedImages.includes(
                          photo.id
                        )
                          ? `
                            opacity-100
                            scale-100
                            blur-0
                          `
                          : `
                            opacity-0
                            scale-105
                            blur-md
                          `
                      }
                    `}
                  />

                  {/* HOVER OVERLAY */}

                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    whileHover={{
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="
                      absolute
                      inset-0
                      flex
                      flex-col
                      justify-end
                      bg-gradient-to-t
                      from-black/85
                      via-black/30
                      to-transparent
                      p-6
                    "
                  >

                    <h3
                      className="
                        font-orbitron
                        text-lg
                        text-white
                      "
                    >
                      {photo.title}
                    </h3>

                    <p
                      className="
                        text-sm
                        text-zinc-300
                        mt-2
                      "
                    >
                      {photo.views.toLocaleString()}{" "}
                      Views
                      {" • "}
                      {photo.date}
                    </p>

                    <p
                      className="
                        text-xs
                        text-zinc-400
                        mt-1
                      "
                    >
                      {photo.category}
                    </p>

                  </motion.div>

                </div>

              </Link>

            </motion.article>

          )
        )}

      </div>

    </section>
  );
}