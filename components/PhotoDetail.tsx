"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Photo } from "@/types";

interface Props {
  photo: Photo;
  previousPhoto: Photo;
  nextPhoto: Photo;
}

export default function PhotoDetail({
  photo,
  previousPhoto,
  nextPhoto,
}: Props) {
  /*
   * TOUCH NAVIGATION
   */

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // Ignorar scroll vertical
    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    // Ignorar movimientos pequeños
    if (Math.abs(deltaX) < 70) {
      return;
    }

    // Swipe derecha → anterior
    if (deltaX > 0) {
      window.location.href = `/photo/${previousPhoto.id}`;
      return;
    }

    // Swipe izquierda → siguiente
    window.location.href = `/photo/${nextPhoto.id}`;
  };

  /*
   * KEYBOARD NAVIGATION
   */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        window.location.href = `/photo/${previousPhoto.id}`;
      }

      if (event.key === "ArrowRight") {
        window.location.href = `/photo/${nextPhoto.id}`;
      }

      if (event.key === "Escape") {
        window.location.href = "/";
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [previousPhoto.id, nextPhoto.id]);

  return (
    <motion.main
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* BACK */}

        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-2
            mb-6
            sm:mb-8
            text-sm
            sm:text-base
            text-zinc-400
            hover:text-white
            transition
          "
        >
          <ArrowLeft size={18} />
          Back to Gallery
        </Link>

        {/* IMAGE */}

        <motion.div
          initial={{
            scale: 0.96,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            delay: 0.15,
            duration: 0.5,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="
            relative
            w-full
            h-[55vh]
            sm:h-[65vh]
            lg:h-[75vh]
            rounded-2xl
            sm:rounded-3xl
            overflow-hidden
            border
            border-white/10
            bg-white/[0.02]
            touch-pan-y
          "
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

        {/* INFORMATION */}

        <div className="mt-8 sm:mt-12">

          <div
            className="
              flex
              flex-col
              gap-6
              md:flex-row
              md:items-start
              md:justify-between
            "
          >

            <div>
              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  tracking-tight
                "
              >
                {photo.title}
              </h1>

              <p className="text-zinc-400 mt-3">
                {photo.location} • {photo.date}
              </p>
            </div>

            {/* STATS */}

            <div
              className="
                flex
                gap-6
                md:flex-col
                md:gap-2
                md:text-right
                text-sm
              "
            >
              <p className="text-zinc-400">
                👁 {photo.views.toLocaleString()}
              </p>

              <p className="text-zinc-400">
                ⬇ {photo.downloads.toLocaleString()}
              </p>
            </div>

          </div>

          {/* DESCRIPTION */}

          <p
            className="
              mt-6
              sm:mt-8
              max-w-3xl
              text-zinc-300
              leading-7
              sm:leading-8
              text-base
              sm:text-lg
            "
          >
            {photo.description}
          </p>

        </div>

        {/* TAGS */}

        <div
          className="
            mt-7
            sm:mt-8
            flex
            flex-wrap
            gap-2
            sm:gap-3
          "
        >
          {photo.tags.map((tag) => (
            <span
              key={tag}
              className="
                px-3
                sm:px-4
                py-1.5
                sm:py-2
                rounded-full
                bg-white/10
                border
                border-white/10
                text-xs
                sm:text-sm
                text-zinc-200
              "
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* CAMERA INFORMATION */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            gap-3
            sm:gap-5
            mt-8
            sm:mt-10
          "
        >
          <InfoCard
            label="Camera"
            value={photo.camera}
          />

          <InfoCard
            label="Lens"
            value={photo.lens}
          />

          <InfoCard
            label="ISO"
            value={String(photo.iso)}
          />

          <InfoCard
            label="Aperture"
            value={photo.aperture}
          />

          <InfoCard
            label="Shutter"
            value={photo.shutter}
          />

          <InfoCard
            label="Location"
            value={photo.location}
          />
        </div>

        {/* STATISTICS */}

        <div
          className="
            mt-8
            sm:mt-10
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-5
            border-t
            border-white/10
            pt-6
            sm:pt-8
          "
        >
          <div>
            <p className="text-zinc-500 text-xs sm:text-sm">
              Views
            </p>

            <p className="text-lg sm:text-xl font-semibold">
              {photo.views.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-zinc-500 text-xs sm:text-sm">
              Downloads
            </p>

            <p className="text-lg sm:text-xl font-semibold">
              {photo.downloads.toLocaleString()}
            </p>
          </div>
        </div>

        {/* PREVIOUS / NEXT */}

        <div
          className="
            mt-10
            sm:mt-16
            border-t
            border-white/10
            pt-6
            sm:pt-8
          "
        >
          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:gap-6
            "
          >

            {/* PREVIOUS */}

            <Link
              href={`/photo/${previousPhoto.id}`}
              className="
                group
                rounded-xl
                sm:rounded-2xl
                border
                border-white/10
                bg-white/5
                p-4
                sm:p-6
                hover:bg-white/10
                transition
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-zinc-500
                "
              >
                <ChevronLeft size={16} />

                <p className="text-xs sm:text-sm">
                  Previous
                </p>
              </div>

              <h3
                className="
                  mt-2
                  text-sm
                  sm:text-xl
                  font-semibold
                  truncate
                  group-hover:text-zinc-300
                  transition
                "
              >
                {previousPhoto.title}
              </h3>
            </Link>

            {/* NEXT */}

            <Link
              href={`/photo/${nextPhoto.id}`}
              className="
                group
                rounded-xl
                sm:rounded-2xl
                border
                border-white/10
                bg-white/5
                p-4
                sm:p-6
                text-right
                hover:bg-white/10
                transition
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-2
                  text-zinc-500
                "
              >
                <p className="text-xs sm:text-sm">
                  Next
                </p>

                <ChevronRight size={16} />
              </div>

              <h3
                className="
                  mt-2
                  text-sm
                  sm:text-xl
                  font-semibold
                  truncate
                  group-hover:text-zinc-300
                  transition
                "
              >
                {nextPhoto.title}
              </h3>
            </Link>

          </div>
        </div>

      </div>
    </motion.main>
  );
}

/* INFO CARD */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        sm:rounded-2xl
        bg-white/5
        border
        border-white/10
        p-3
        sm:p-5
      "
    >
      <p
        className="
          text-zinc-500
          text-[10px]
          sm:text-xs
          uppercase
          tracking-wider
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          sm:mt-2
          text-xs
          sm:text-base
          text-zinc-200
          break-words
        "
      >
        {value}
      </p>
    </div>
  );
}