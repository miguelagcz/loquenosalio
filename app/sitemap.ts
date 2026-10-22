import type { MetadataRoute } from "next";

import { photos } from "@/data/photos";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://TU-DOMINIO.com";

  const photoPages = photos.map((photo) => ({
    url: `${baseUrl}/photo/${photo.id}`,
    lastModified: new Date(photo.date),
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