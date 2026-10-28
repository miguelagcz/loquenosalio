"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";

const OPTIONS = [
  { value: "light", label: "Claro", Icon: Sun },
  { value: "dark", label: "Oscuro", Icon: Moon },
  { value: "system", label: "Automático (según tu dispositivo)", Icon: Monitor },
] as const;

/**
 * Selector de tema flotante (se renderiza una sola vez en layout.tsx):
 *  - Móvil: fijo arriba al centro.
 *  - Escritorio: te sigue en la esquina inferior derecha, discreto
 *    (casi transparente hasta que te acercas).
 *  - Claro / Oscuro / Automático: "automático" sigue el tema de tu dispositivo.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // false en el servidor, true en el navegador (evita el mismatch de hidratación)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const position =
    "fixed left-1/2 top-2 -translate-x-1/2 sm:bottom-6 sm:left-auto sm:right-6 sm:top-auto sm:translate-x-0";

  // Evita el mismatch de hidratación: no se sabe el tema real hasta montar en el navegador
  if (!mounted) {
    return <div aria-hidden className={`${position} z-50 h-9 w-[104px]`} />;
  }

  const active = theme ?? "light";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      role="radiogroup"
      aria-label="Tema de color"
      className={`${position} z-50 flex items-center gap-0.5 rounded-full border border-black/10 bg-white/70 p-1 shadow-lg shadow-black/5 backdrop-blur-xl transition-opacity dark:border-white/15 dark:bg-black/50 sm:opacity-60 sm:hover:opacity-100 sm:focus-within:opacity-100`}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = active === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={`relative flex h-7 w-8 items-center justify-center rounded-full transition-colors ${
              selected
                ? "text-white dark:text-black"
                : "text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            {selected && (
              <motion.span
                layoutId="theme-pill"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
                className="absolute inset-0 rounded-full bg-black dark:bg-white"
              />
            )}
            <Icon size={14} className="relative" />
          </button>
        );
      })}
    </motion.div>
  );
}