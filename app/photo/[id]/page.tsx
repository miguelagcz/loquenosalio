import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPhotos } from "@/lib/photos-queries";
import type { Photo } from "@/types";
import PhotoDetail from "@/components/PhotoDetail";

// Siempre datos frescos de Supabase (views correctas al abrir)
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const photos = await getPhotos();
  const photo = photos.find((p: Photo) => p.id === Number(id));

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

  const photo = photos.find((p: Photo) => p.id === Number(id));
  if (!photo) notFound();

  // Carrete: todas las fotos del mismo grupo (mismo set_name), en orden de id.
  // Si la foto no tiene grupo, el carrete es solo ella.
  const group = photo.setName
    ? photos.filter((p: Photo) => p.setName === photo.setName)
    : [photo];
  const initialIndex = Math.max(0, group.findIndex((p: Photo) => p.id === photo.id));

  // Anterior / siguiente se mueven entre "portadas" (una por grupo),
  // igual que el home, así no se repite el mismo carrete.
  const seen = new Set<string>();
  const covers = photos.filter((p: Photo) => {
    if (!p.setName) return true;
    if (seen.has(p.setName)) return false;
    seen.add(p.setName);
    return true;
  });
  const coverIndex = Math.max(
    0,
    covers.findIndex((p: Photo) => p.id === photo.id || (p.setName && p.setName === photo.setName))
  );
  const previousPhoto = covers[(coverIndex - 1 + covers.length) % covers.length];
  const nextPhoto = covers[(coverIndex + 1) % covers.length];

  return (
    <PhotoDetail
      photo={photo}
      group={group}
      initialIndex={initialIndex}
      previousPhoto={previousPhoto}
      nextPhoto={nextPhoto}
    />
  );
}