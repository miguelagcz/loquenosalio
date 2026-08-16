import { Video } from "@/types";

export const videos: Video[] = [
  {
    id: 1,
    title: "Video 1",
    src: "/videos/video1.mp4",
    poster: "/photos/photo1.jpg",
    duration: "0:30",
    views: 842,
    date: "2026",
    tags: ["visual", "moment"],
  },

  {
    id: 2,
    title: "Video 2",
    src: "/videos/video2.mp4",
    poster: "/photos/photo2.jpg",
    duration: "1:15",
    views: 1542,
    date: "2026",
    tags: ["archive", "motion"],
  },

  {
    id: 3,
    title: "Video 3",
    src: "/videos/video3.mp4",
    poster: "/photos/photo3.jpg",
    duration: "0:45",
    views: 965,
    date: "2026",
    tags: ["visual", "experiment"],
  },
];