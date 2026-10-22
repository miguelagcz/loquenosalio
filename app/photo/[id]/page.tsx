import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPhotos } from "@/lib/photos-queries";
import PhotoDetail from "@/components/PhotoDetail";

// Siempre datos frescos de Supabase (views correctas al abrir)
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const photos = await getPhotos();
  const photo = photos.find((p) => p.id === Number(id));

  if (!photo) {
    return {
      title: "Foto no encontrada",
      description: "La foto solicitada no existe.",
    };
  }

  const description = photo.description || photo.title;

  return {
    title: `${photo.title} — lo que no salió bien`,
    description,
    openGraph: {
      title: `${photo.title} — lo que no salió bien`,
      description,
      type: "article",
      images: [{ url: photo.src, alt: photo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${photo.title} — lo que no salió bien`,
      description,
      images: [photo.src],
    },
  };
}

export default async function PhotoPage({ params }: Props) {
  const { id } = await params;
  const photos = await getPhotos();

  const photoIndex = photos.findIndex((p) => p.id === Number(id));
  if (photoIndex === -1) notFound();

  const photo = photos[photoIndex];
  const previousPhoto = photos[(photoIndex - 1 + photos.length) % photos.length];
  const nextPhoto = photos[(photoIndex + 1) % photos.length];

  return (
    <PhotoDetail
      photo={photo}
      previousPhoto={previousPhoto}
      nextPhoto={nextPhoto}
    />
  );
}