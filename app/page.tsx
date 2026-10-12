import { ProofingGallery } from "@/components/ProofingGallery";
import { Footer } from "@/components/Footer";

import { getPhotos } from "@/lib/photos-queries";
import { getVideos } from "@/lib/videos-queries";

export default async function Home() {
  const [photos, videos] = await Promise.all([getPhotos(), getVideos()]);

  const totalViews =
    photos.reduce((sum, p) => sum + p.views, 0) +
    videos.reduce((sum, v) => sum + v.views, 0);

   return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <ProofingGallery
        photos={photos}
        videos={videos}
        stats={{
          photoCount: photos.length,
          videoCount: videos.length,
          totalViews,
          since: "2026",
        }}
      />
      <Footer />
    </main>
  );
}