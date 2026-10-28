import { BentoGallery } from "@/components/BentoGallery";
import { Footer } from "@/components/Footer";
import { getPhotos } from "@/lib/photos-queries";
import { getTotalLikes } from "@/lib/site-stats";

// Se actualiza solo cada 60 s cuando agregues o borres fotos en Supabase
export const revalidate = 60;

export default async function Home() {
  const [photos, totalLikes] = await Promise.all([getPhotos(), getTotalLikes()]);
  const totalViews = photos.reduce((sum, p) => sum + p.views, 0);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <BentoGallery
        photos={photos}
        stats={{
          photoCount: photos.length,
          totalViews,
          totalLikes,
          since: "2026",
        }}
      />
      <Footer />
    </main>
  );
}