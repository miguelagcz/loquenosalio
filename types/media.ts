export interface MediaItem {
  id: string;
  title: string;
  description: string;
  date: string;
  src: string;
  views: number;
  type: "photo" | "video";
}