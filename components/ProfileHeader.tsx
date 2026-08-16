"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfileHeader() {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          sm:rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-md
          p-5
          sm:p-8
          lg:p-10
        "
      >

        {/* DECORACIÓN */}

        <div
          className="
            pointer-events-none
            absolute
            -top-32
            -right-32
            h-64
            w-64
            rounded-full
            bg-white/[0.04]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-32
            -left-32
            h-64
            w-64
            rounded-full
            bg-white/[0.03]
            blur-3xl
          "
        />

        {/* PROFILE */}

        <div
          className="
            relative
            flex
            flex-col
            gap-6
            sm:gap-8
            sm:flex-row
            sm:items-center
          "
        >

          {/* AVATAR */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              relative
              mx-auto
              h-24
              w-24
              shrink-0
              sm:mx-0
              sm:h-32
              sm:w-32
            "
          >

            <div
              className="
                absolute
                inset-0
                rounded-full
                border
                border-white/20
                p-1
              "
            >

              <div
                className="
                  relative
                  h-full
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-zinc-900
                "
              >

                <Image
                  src="/profile.jpg"
                  alt="Miguel Cruz"
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />

              </div>

            </div>

          </motion.div>

          {/* INFORMATION */}

          <motion.div
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="
              min-w-0
              flex-1
              text-center
              sm:text-left
            "
          >

            {/* NAME */}

            <div
              className="
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-center
                sm:gap-4
              "
            >

              <h1
                className="
                  font-orbitron
                  text-2xl
                  sm:text-3xl
                  lg:text-4xl
                  font-semibold
                  tracking-tight
                "
              >
                Miguel Cruz
              </h1>

              <span
                className="
                  mx-auto
                  w-fit
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  px-3
                  py-1
                  text-[9px]
                  sm:text-[10px]
                  uppercase
                  tracking-[0.18em]
                  sm:tracking-[0.2em]
                  text-zinc-500
                  sm:mx-0
                "
              >
                Visual Journal
              </span>

            </div>

            {/* DESCRIPTION */}

            <p
              className="
                mt-3
                max-w-2xl
                mx-auto
                sm:mx-0
                text-sm
                sm:text-base
                leading-6
                sm:leading-7
                text-zinc-400
              "
            >
              Photography, visual experiments and moments
              captured through my perspective.
            </p>

            {/* META */}

            <div
              className="
                mt-4
                sm:mt-5
                flex
                flex-wrap
                items-center
                justify-center
                gap-x-4
                gap-y-2
                text-[9px]
                sm:text-xs
                uppercase
                tracking-[0.15em]
                sm:tracking-[0.18em]
                text-zinc-600
                sm:justify-start
              "
            >

              <span>
                Since 2026
              </span>

              <span className="hidden sm:block">
                /
              </span>

              <span>
                Mexico City
              </span>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}