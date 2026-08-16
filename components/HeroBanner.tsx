"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="w-full px-3 sm:px-6 pt-3 sm:pt-4 pb-5 sm:pb-6">

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
        }}
        className="
          relative
          mx-auto
          max-w-7xl
          h-[52vh]
          sm:h-[45vh]
          min-h-[360px]
          sm:min-h-[320px]
          max-h-[520px]
          overflow-hidden
          rounded-2xl
          sm:rounded-3xl
          border
          border-white/10
          bg-black
        "
      >

        {/* BACKGROUND */}

        <Image
          src="/photos/photo1.jpg"
          alt="Miguel Cruz Visual Archive"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 1280px"
          className="
            object-cover
            scale-105
            opacity-70
          "
        />

        {/* DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-black/20
            via-black/30
            to-black
          "
        />

        {/* SIDE GRADIENT */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/50
            via-transparent
            to-black/40
          "
        />

        {/* CONTENT */}

        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            justify-end
            p-5
            sm:p-10
            lg:p-14
          "
        >

          {/* LABEL */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.5,
            }}
            className="
              mb-3
              sm:mb-4
              flex
              items-center
              gap-3
            "
          >

            <span
              className="
                h-px
                w-6
                sm:w-8
                bg-white/40
              "
            />

            <span
              className="
                text-[9px]
                sm:text-xs
                uppercase
                tracking-[0.25em]
                sm:tracking-[0.3em]
                text-zinc-300
              "
            >
              Visual Archive
            </span>

          </motion.div>

          {/* TITLE */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
              duration: 0.6,
            }}
            className="
              font-orbitron
              max-w-3xl
              text-3xl
              sm:text-5xl
              lg:text-6xl
              font-semibold
              tracking-tight
              leading-tight
              text-white
            "
          >
            Moments captured.
          </motion.h1>

          {/* DESCRIPTION */}

          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
              duration: 0.5,
            }}
            className="
              mt-3
              sm:mt-4
              max-w-xl
              text-sm
              sm:text-base
              leading-6
              sm:leading-7
              text-zinc-300
            "
          >
            A personal collection of photographs,
            visual experiments and short moving moments.
          </motion.p>

          {/* FOOTER */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.55,
              duration: 0.5,
            }}
            className="
              mt-5
              sm:mt-6
              flex
              flex-wrap
              items-center
              gap-3
              sm:gap-4
              text-[9px]
              sm:text-xs
              uppercase
              tracking-[0.15em]
              sm:tracking-[0.2em]
              text-zinc-500
            "
          >

            <span>
              Since 2026
            </span>

            <span className="text-zinc-700">
              /
            </span>

            <span>
              Mexico City
            </span>

          </motion.div>

        </div>

      </motion.div>

    </section>
  );
}