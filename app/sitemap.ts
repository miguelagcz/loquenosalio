import type { MetadataRoute } from "next";

import { getPhotos } from "@/lib/photos-queries";
import type { Photo } from "@/types";

// Cambia esto por tu dominio real cuando publiques
const baseUrl = "https://TU-DOMINIO.com";

// Se regenera cada hora con las fotos que haya en Supabase
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const photos = await getPhotos();

  const photoPages = photos.map((photo: Photo) => ({
    url: `${baseUrl}/photo/${photo.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...photoPages,
  ];
}