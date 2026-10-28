"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, Heart, Link2 } from "lucide-react";

type Kind = "like" | "link" | "download";

/** Cada acción tiene su color suave; en claro y en oscuro se mantienen legibles. */
const TONES: Record<Kind, { hover: string; on: string; dot: string; label: string }> = {
  like: {
    hover:
      "hover:border-rose-500/40 hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-400",
    on: "border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
    label: "Me gusta",
  },
  link: {
    hover:
      "hover:border-sky-500/40 hover:bg-sky-500/15 hover:text-sky-600 dark:hover:text-sky-400",
    on: "border-sky-500/40 bg-sky-500/15 text-sky-600 dark:text-sky-400",
    dot: "bg-sky-500",
    label: "Copiar enlace",
  },
  download: {
    hover:
      "hover:border-emerald-500/40 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-400",
    on: "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Descargar",
  },
};

interface Props {
  kind: Kind;
  onClick: () => void;
  /** like: ya le diste like. link: acabas de copiar el enlace. */
  active?: boolean;
}

const SPARKS = Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2);

export function ActionButton({ kind, onClick, active = false }: Props) {
  const tone = TONES[kind];
  const [pulse, setPulse] = useState(0); // reinicia la animación en cada clic

  const handleClick = () => {
    setPulse((p) => p + 1);
    onClick();
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={tone.label}
      title={tone.label}
      aria-pressed={kind === "like" ? active : undefined}
      whileHover={{ scale: 1.1, y: -1 }}
      whileTap={{ scale: 0.86 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
        active
          ? tone.on
          : `border-black/15 bg-black/5 text-neutral-600 dark:border-white/15 dark:bg-white/10 dark:text-white/80 ${tone.hover}`
      }`}
    >
      {/* chispitas al dar like */}
      {kind === "like" && active && pulse > 0 &&
        SPARKS.map((angle, i) => (
          <motion.span
            key={`${pulse}-${i}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{
              x: Math.cos(angle) * 20,
              y: Math.sin(angle) * 20,
              opacity: 0,
              scale: 1,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className={`pointer-events-none absolute h-1 w-1 rounded-full ${tone.dot}`}
          />
        ))}

      {kind === "like" && (
        <motion.span
          key={`h-${pulse}`}
          initial={false}
          animate={active ? { scale: [1, 1.5, 0.9, 1] } : { scale: 1 }}
          transition={{ duration: 0.45 }}
          className="flex"
        >
          <Heart size={14} fill={active ? "currentColor" : "none"} />
        </motion.span>
      )}

      {kind === "link" && (
        <motion.span
          key={`l-${pulse}`}
          whileHover={{ rotate: -18 }}
          animate={active ? { rotate: [0, -25, 15, 0] } : { rotate: 0 }}
          transition={{ duration: 0.4 }}
          className="flex"
        >
          {active ? <Check size={14} /> : <Link2 size={14} />}
        </motion.span>
      )}

      {kind === "download" && (
        <motion.span
          key={`d-${pulse}`}
          whileHover={{ y: 2 }}
          animate={pulse > 0 ? { y: [0, 7, -2, 0] } : { y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex"
        >
          <Download size={14} />
        </motion.span>
      )}
    </motion.button>
  );
}