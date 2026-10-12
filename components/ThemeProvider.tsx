"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Envuelve tu app en layout.tsx:
 *
 *   <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *     {children}
 *   </ThemeProvider>
 *
 * - defaultTheme="system" -> respeta prefers-color-scheme del dispositivo
 * - attribute="class"     -> agrega/quita la clase `dark` en <html>,
 *                            que es lo que activan tus utilidades dark: de Tailwind
 * - el toggle manual (ver ThemeToggle.tsx) se guarda solo en localStorage
 *
 * Instalación: npm install next-themes
 * En tailwind.config.ts necesitas: darkMode: "class"
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}