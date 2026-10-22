import Link from "next/link";
import Image from "next/image";
import { Photo } from "@/types";

interface Props {
  currentPhoto: Photo;
  photos: Photo[];
}

export default function RelatedPhotos({
  currentPhoto,
  photos,
}: Props) {
  const relatedPhotos = photos
    .filter(
      (photo) =>
        photo.id !== currentPhoto.id &&
        photo.category === currentPhoto.category
    )
    .slice(0, 3);

  if (relatedPhotos.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        Related Photos
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {relatedPhotos.map((photo) => (
          <Link
            key={photo.id}
            href={`/photo/${photo.id}`}
            className="
              group
              rounded-2xl
              overflow-hidden
              border
              border-white/10
              bg-white/5
              hover:bg-white/10
              transition
            "
          >
            <div className="relative h-72">
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className="
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg">
                {photo.title}
              </h3>

              <p className="text-zinc-400 text-sm mt-2">
                {photo.location}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}