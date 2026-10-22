import { Video } from "@/types";

const VIDEOS_BASE =
  "https://anotyxlaprxntkbacodq.supabase.co/storage/v1/object/public/loquesaliomalvideos";

const PHOTOS_BASE =
  "https://anotyxlaprxntkbacodq.supabase.co/storage/v1/object/public/loquesaliomal";

export const videos: Video[] = [
  {
    id: 1,
    title: "Video 1",
    src: `${VIDEOS_BASE}/video1.mp4`,
    poster: `${PHOTOS_BASE}/photo1.png`,
    duration: "0:30",
    views: 842,
    date: "2026",
    tags: ["visual", "moment"],
  },

  {
    id: 2,
    title: "Video 2",
    src: `${VIDEOS_BASE}/video2.mp4`,
    poster: `${PHOTOS_BASE}/photo2.png`,
    duration: "1:15",
    views: 1542,
    date: "2026",
    tags: ["archive", "motion"],
  },

  {
    id: 3,
    title: "Video 3",
    src: `${VIDEOS_BASE}/video3.mp4`,
    poster: `${PHOTOS_BASE}/photo3.png`,
    duration: "0:45",
    views: 965,
    date: "2026",
    tags: ["visual", "experiment"],
  },
];