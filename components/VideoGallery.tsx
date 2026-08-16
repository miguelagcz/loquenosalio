"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { videos } from "@/data/videos";
import GalleryToolbar from "./GalleryToolbar";
import Skeleton from "./Skeleton";

export default function VideoGallery() {
  const [search, setSearch] = useState("");

  const [selectedVideo, setSelectedVideo] =
    useState<(typeof videos)[number] | null>(null);

  const [loadedVideos, setLoadedVideos] =
    useState<number[]>([]);

  /* -------------------------------- */
  /* FILTER */
  /* -------------------------------- */

  const filteredVideos = videos.filter((video) => {
    const searchTerm = search
      .toLowerCase()
      .trim();

    return (
      searchTerm === "" ||
      video.title
        .toLowerCase()
        .includes(searchTerm) ||
      video.tags.some((tag) =>
        tag
          .toLowerCase()
          .includes(searchTerm)
      )
    );
  });

  /* -------------------------------- */
  /* CLEAR SEARCH */
  /* -------------------------------- */

  const clearSearch = () => {
    setSearch("");
  };
  const currentIndex = selectedVideo
  ? filteredVideos.findIndex(
      (video) => video.id === selectedVideo.id
    )
  : -1;

const previousVideo = () => {
  if (currentIndex === -1) return;

  const index =
    (currentIndex - 1 + filteredVideos.length) %
    filteredVideos.length;

  setSelectedVideo(filteredVideos[index]);
};

const nextVideo = () => {
  if (currentIndex === -1) return;

  const index =
    (currentIndex + 1) %
    filteredVideos.length;

  setSelectedVideo(filteredVideos[index]);
  
};

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setSelectedVideo(null);
    }

    if (event.key === "ArrowLeft") {
      previousVideo();
    }

    if (event.key === "ArrowRight") {
      nextVideo();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [currentIndex, filteredVideos]);

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

      {/* RESULT COUNT */}

      {filteredVideos.length > 0 && (
        <div className="mb-6">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-zinc-600
            "
          >
            {filteredVideos.length}{" "}
            {filteredVideos.length === 1
              ? "Video"
              : "Videos"}
          </p>

        </div>
      )}

      {/* EMPTY STATE */}

      {filteredVideos.length === 0 && (
        <div className="py-20 text-center">

          <p className="text-zinc-500 text-lg">
            No videos found.
          </p>

          <button
            type="button"
            onClick={clearSearch}
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
            Clear search
          </button>

        </div>
        
      )}

      {/* VIDEO GRID */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
        "
      >

        {filteredVideos.map(
          (video, index) => (

            <motion.article
              key={video.id}
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.07,
              }}
              onClick={() =>
                setSelectedVideo(video)
              }
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/5
                cursor-pointer
                shadow-xl
                transition-all
                duration-500
                hover:scale-[1.02]
                hover:border-white/20
              "
            >

              {/* VIDEO PREVIEW */}

              <div
                className="
                  relative
                  aspect-[9/16]
                  overflow-hidden
                "
              >

                {/* SKELETON */}

                {!loadedVideos.includes(
                  video.id
                ) && (
                  <Skeleton
                    className="
                      absolute
                      inset-0
                    "
                  />
                )}

                {/* VIDEO */}

<video
  src={video.src}
  poster={video.poster}
  muted
  playsInline
  preload="metadata"
  onMouseEnter={(event) => {
    event.currentTarget.play().catch(() => {});
  }}
  onMouseLeave={(event) => {
    event.currentTarget.pause();
    event.currentTarget.currentTime = 0;
  }}
  onLoadedData={() => {
    setLoadedVideos((prev) =>
      prev.includes(video.id)
        ? prev
        : [...prev, video.id]
    );
  }}
  className={`
    h-full
    w-full
    object-cover
    transition-all
    duration-700
    ${
      loadedVideos.includes(video.id)
        ? "opacity-100 scale-100"
        : "opacity-0 scale-105"
    }
  `}
/>
                {/* OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/90
                    via-black/10
                    to-transparent
                  "
                />

                {/* PLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                  "
                >

                  <motion.div
                    whileHover={{
                      scale: 1.1,
                    }}
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-white/15
                      border
                      border-white/20
                      backdrop-blur-md
                    "
                  >
                    <Play
                      size={22}
                      fill="white"
                      className="ml-1"
                    />
                  </motion.div>

                </div>

                {/* INFORMATION */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    p-5
                  "
                >

                  <h3
                    className="
                      font-orbitron
                      text-base
                      sm:text-lg
                      font-medium
                    "
                  >
                    {video.title}
                  </h3>

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      justify-between
                      gap-3
                      text-xs
                      text-zinc-300
                    "
                  >

                    <span>
                      {video.duration}
                    </span>

                    <span>
                      {video.views.toLocaleString()}{" "}
                      Views
                    </span>

                  </div>

                </div>

              </div>

            </motion.article>

          )
        )}

      </div>
<button
  onClick={previousVideo}
  className="
    absolute
    left-3
    top-1/2
    -translate-y-1/2
    z-20
    h-11
    w-11
    rounded-full
    bg-black/60
    border
    border-white/10
    flex
    items-center
    justify-center
    hover:bg-white/10
    transition
  "
>
  <ChevronLeft size={22} />
</button>
<button
  onClick={nextVideo}
  className="
    absolute
    right-3
    top-1/2
    -translate-y-1/2
    z-20
    h-11
    w-11
    rounded-full
    bg-black/60
    border
    border-white/10
    flex
    items-center
    justify-center
    hover:bg-white/10
    transition
  "
>
  <ChevronRight size={22} />
</button>
      {/* VIDEO MODAL */}

      <AnimatePresence>
        {selectedVideo && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setSelectedVideo(null)
            }
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/90
              backdrop-blur-md
              p-4
            "
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setSelectedVideo(null)
              }
              aria-label="Close video"
              className="
                absolute
                right-4
                top-4
                sm:right-6
                sm:top-6
                z-50
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-black/60
                border
                border-white/10
                text-white
                hover:bg-white/10
                transition
              "
            >
              <X size={20} />
            </button>

            {/* MODAL CONTENT */}

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="
  relative
  w-full
  max-w-5xl
  max-h-[90vh]
  overflow-hidden
  rounded-3xl
  border
  border-white/10
  bg-black
  shadow-2xl
"
            >
              {/* PREVIOUS VIDEO */}

<button
  type="button"
  onClick={previousVideo}
  aria-label="Previous video"
  className="
    absolute
    left-3
    top-1/2
    z-20
    -translate-y-1/2
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-full
    border
    border-white/10
    bg-black/60
    text-white
    backdrop-blur-md
    transition
    hover:bg-white/10
  "
>
  <ChevronLeft size={20} />
</button>

{/* NEXT VIDEO */}

<button
  type="button"
  onClick={nextVideo}
  aria-label="Next video"
  className="
    absolute
    right-3
    top-1/2
    z-20
    -translate-y-1/2
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-full
    border
    border-white/10
    bg-black/60
    text-white
    backdrop-blur-md
    transition
    hover:bg-white/10
  "
>
  <ChevronRight size={20} />
</button>

              {/* VIDEO */}

              <video
                src={selectedVideo.src}
                poster={selectedVideo.poster}
                controls
                autoPlay
                playsInline
              className="
  block
  w-full
  max-h-[75vh]
  object-contain
  bg-black
"
              />

              {/* INFO */}

              <div className="p-5">

                <h2
                  className="
                    text-xl
                    font-semibold
                  "
                >
                  {selectedVideo.title}
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-zinc-500
                  "
                >
                  {selectedVideo.date}
                  {" • "}
                  {selectedVideo.duration}
                </p>

                {/* TAGS */}

                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {selectedVideo.tags.map(
                    (tag) => (
                      <span
                        key={tag}
                        className="
                          rounded-full
                          bg-white/10
                          border
                          border-white/10
                          px-3
                          py-1
                          text-xs
                          text-zinc-300
                        "
                      >
                        #{tag}
                      </span>
                    )
                  )}

                </div>

                {/* STATS */}

                <div
                  className="
                    mt-5
                    flex
                    justify-between
                    border-t
                    border-white/10
                    pt-4
                    text-xs
                    text-zinc-500
                  "
                >

                  <span>
                    {selectedVideo.views.toLocaleString()}{" "}
                    Views
                  </span>

                  <span>
                    {selectedVideo.date}
                  </span>

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}
      </AnimatePresence>

    </section>
  );
}