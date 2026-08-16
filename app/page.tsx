import ProfileHeader from "@/components/ProfileHeader";
import GalleryTabs from "@/components/GalleryTabs";
import HeroBanner from "@/components/HeroBanner";
import ProfileStats from "@/components/ProfileStats";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroBanner />

      <ProfileHeader />

      <ProfileStats />

      <GalleryTabs />
    </main>
  );
}