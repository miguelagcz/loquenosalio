import type { Metadata } from "next";
// Fuente local (se instala con npm): no depende de internet para correr el sitio
import "@fontsource-variable/inter";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: {
    default: "Miguel Cruz — Visual Archive",
    template: "%s — Miguel Cruz",
  },

  description:
    "Miguel Cruz — Personal Visual Archive. Photography, visual experiments and short moving moments.",

  keywords: [
    "Miguel Cruz",
    "Visual Archive",
    "Photography",
    "Visual Journal",
    "Photography Portfolio",
    "Mexico City",
  ],

  authors: [
    {
      name: "Miguel Cruz",
    },
  ],

  creator: "Miguel Cruz",

  openGraph: {
    title: "Miguel Cruz — Visual Archive",
    description:
      "Photography, visual experiments and short moving moments.",
    type: "website",
    locale: "en_US",
    siteName: "Miguel Cruz — Visual Archive",
  },

  twitter: {
    card: "summary_large_image",
    title: "Miguel Cruz — Visual Archive",
    description:
      "Photography, visual experiments and short moving moments.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
  <body>
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem
    storageKey="lqnsb-theme"
  >
    <ThemeToggle />
    <LenisProvider>{children}</LenisProvider>
  </ThemeProvider>
</body>
    </html>
  );
}