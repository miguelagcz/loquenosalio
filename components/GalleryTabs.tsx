"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import MasonryGallery from "./MasonryGallery";
import VideoGallery from "./VideoGallery";

type GalleryTab = "photos" | "videos";

export default function GalleryTabs() {
  const [activeTab, setActiveTab] =
    useState<GalleryTab>("photos");

  return (
    <section className="w-full">

      {/* TABS */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          mb-8
        "
      >

        <div
          className="
            relative
            flex
            w-full
            max-w-md
            mx-auto
            rounded-full
            border
            border-white/10
            bg-white/[0.03]
            p-1
            backdrop-blur-md
          "
        >

          {/* ACTIVE INDICATOR */}

          <motion.div
            layoutId="gallery-tab"
            className="
              absolute
              top-1
              bottom-1
              w-1/2
              rounded-full
              bg-white
            "
            animate={{
              left:
                activeTab === "photos"
                  ? "4px"
                  : "50%",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />

          {/* PHOTOS */}

          <button
            type="button"
            onClick={() =>
              setActiveTab("photos")
            }
            className={`
              relative
              z-10
              w-1/2
              rounded-full
              py-3
              text-sm
              font-medium
              transition-colors
              duration-300
              ${
                activeTab === "photos"
                  ? "text-black"
                  : "text-zinc-500 hover:text-white"
              }
            `}
          >
            Photos
          </button>

          {/* VIDEOS */}

          <button
            type="button"
            onClick={() =>
              setActiveTab("videos")
            }
            className={`
              relative
              z-10
              w-1/2
              rounded-full
              py-3
              text-sm
              font-medium
              transition-colors
              duration-300
              ${
                activeTab === "videos"
                  ? "text-black"
                  : "text-zinc-500 hover:text-white"
              }
            `}
          >
            Videos
          </button>

        </div>

      </div>

      {/* CONTENT */}

      <AnimatePresence mode="wait">

        {activeTab === "photos" ? (
          <motion.div
            key="photos"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <MasonryGallery />
          </motion.div>
        ) : (
          <motion.div
            key="videos"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }} 
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <VideoGallery />
          </motion.div>
        )}

      </AnimatePresence>

    </section>
  );
}