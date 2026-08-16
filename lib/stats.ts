import { photos } from "@/data/photos";
import { videos } from "@/data/videos";

/* -------------------------------- */
/* TOTAL PHOTOS */
/* -------------------------------- */

export const totalPhotos = photos.length;

/* -------------------------------- */
/* TOTAL VIDEOS */
/* -------------------------------- */

export const totalVideos = videos.length;

/* -------------------------------- */
/* TOTAL VIEWS */
/* -------------------------------- */

export const totalViews =
  photos.reduce(
    (total, photo) => total + photo.views,
    0
  ) +
  videos.reduce(
    (total, video) => total + video.views,
    0
  );

/* -------------------------------- */
/* TOTAL DOWNLOADS */
/* -------------------------------- */

export const totalDownloads = photos.reduce(
  (total, photo) => total + photo.downloads,
  0
);

/* -------------------------------- */
/* PROJECT START YEAR */
/* -------------------------------- */

const photoYears = photos
  .map((photo) => Number(photo.date.slice(-4)))
  .filter((year) => !Number.isNaN(year));

export const sinceYear =
  photoYears.length > 0
    ? Math.min(...photoYears)
    : 2026;