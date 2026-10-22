"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Botón sol/luna, mismo comportamiento que viste en el render:
 * - Si el sistema del visitante está en oscuro, abre en oscuro sin tocar nada.
 * - El click anula esa preferencia manualmente y se recuerda entre visitas.
 *
 * `mounted` evita el mismatch de hidratación de Next.js: en el primer render
 * de servidor no sabemos el tema real (depende del sistema del cliente),
 * así que no pintamos el ícono hasta montar en el navegador.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="h-8 w-8 rounded-full border border-white/10 bg-white/5"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-black/5 text-current transition-colors hover:bg-black/10 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}