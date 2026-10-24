import { BentoGallery } from "@/components/BentoGallery";
import { Footer } from "@/components/Footer";
import { getPhotos } from "@/lib/photos-queries";

export default async function Home() {
  const photos = await getPhotos();
  const totalViews = photos.reduce((sum, p) => sum + p.views, 0);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <BentoGallery
        photos={photos}
        stats={{
          photoCount: photos.length,
          totalViews,
          since: "2026",
        }}
      />
      <Footer />
    </main>
  );
}