import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // En tu computadora (dev) las fotos se cargan directo desde Supabase, sin pasar
    // por el optimizador de Next, que se agota con conexiones lentas (timeout).
    // En producción (Vercel) sí se optimizan: más ligeras y rápidas.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anotyxlaprxntkbacodq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;