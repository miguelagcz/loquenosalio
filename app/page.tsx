import GalleryTabs from "@/components/GalleryTabs";
import { BentoHero } from "@/components/BentoHero";
import { CategoryIndex } from "@/components/CategoryIndex";

import { getPhotos } from "@/lib/photos-queries";
import { getVideos } from "@/lib/videos-queries";

export default async function Home() {
  const [photos, videos] = await Promise.all([getPhotos(), getVideos()]);

  const totalViews =
    photos.reduce((sum, p) => sum + p.views, 0) +
    videos.reduce((sum, v) => sum + v.views, 0);

  const categoryMap = new Map<string, number>();
  for (const photo of photos) {
    categoryMap.set(photo.category, (categoryMap.get(photo.category) ?? 0) + 1);
  }
  const categories = Array.from(categoryMap, ([name, count]) => ({
    name,
    count,
  }));

  return (
    <main className="min-h-screen bg-black text-white">
      <BentoHero
        photos={photos}
        featuredVideo={videos[0]}
        stats={{
          photoCount: photos.length,
          videoCount: videos.length,
          totalViews,
          since: "2026",
        }}
      />

      <CategoryIndex categories={categories} />

      <GalleryTabs photos={photos} videos={videos} />
    </main>
  );
}