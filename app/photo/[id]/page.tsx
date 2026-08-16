import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { photos } from "@/data/photos";
import PhotoDetail from "@/components/PhotoDetail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const photo = photos.find(
    (p) => p.id === Number(id)
  );

  if (!photo) {
    return {
      title: "Photo not found",
      description: "The requested photo could not be found.",
    };
  }

  return {
    title: `${photo.title} — Visual Archive`,
    description: photo.description,

    openGraph: {
      title: `${photo.title} — Visual Archive`,
      description: photo.description,
      type: "article",
      images: [
        {
          url: photo.src,
          alt: photo.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${photo.title} — Visual Archive`,
      description: photo.description,
      images: [photo.src],
    },
  };
}

export default async function PhotoPage({
  params,
}: Props) {
  const { id } = await params;

  const photoIndex = photos.findIndex(
    (p) => p.id === Number(id)
  );

  if (photoIndex === -1) {
    notFound();
  }

  const photo = photos[photoIndex];

  const previousPhoto =
    photos[
      (photoIndex - 1 + photos.length) %
        photos.length
    ];

  const nextPhoto =
    photos[
      (photoIndex + 1) % photos.length
    ];

  return (
    <PhotoDetail
      photo={photo}
      previousPhoto={previousPhoto}
      nextPhoto={nextPhoto}
    />
  );
}