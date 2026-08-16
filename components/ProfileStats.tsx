"use client";

import {
  totalPhotos,
  totalVideos,
  totalViews,
  sinceYear,
} from "@/lib/stats";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function ProfileStats() {
  const stats = [
    {
      label: "Photos",
      value: totalPhotos,
    },
    {
      label: "Videos",
      value: totalVideos,
    },
    {
      label: "Views",
      value: totalViews,
    },
    {
      label: "Since",
      value: Number(sinceYear),
    },
  ];

  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-3
        sm:px-6
        py-4
        sm:py-6
      "
    >

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-3
          sm:gap-5
        "
      >

        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            whileHover={{
              y: -4,
            }}
            className="
              group
              min-w-0
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              backdrop-blur-md
              p-4
              sm:p-6
              text-center
              transition-colors
              duration-300
              hover:border-white/20
              hover:bg-white/[0.05]
            "
          >

            {/* VALUE */}

            <h2
              className="
                font-orbitron
                truncate
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-semibold
                tracking-tight
                text-white
              "
            >
              <CountUp
                end={item.value}
                duration={1.8}
                separator=","
              />
            </h2>

            {/* LABEL */}

            <p
              className="
                mt-2
                text-[9px]
                sm:text-xs
                uppercase
                tracking-[0.16em]
                sm:tracking-[0.2em]
                text-zinc-500
                transition-colors
                duration-300
                group-hover:text-zinc-300
              "
            >
              {item.label}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
}