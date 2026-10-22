import { supabase } from "./supabase";
import { Video } from "@/types";

interface VideoRow {
  id: number;
  title: string;
  description: string | null;
  src: string;
  poster: string | null;
  duration: string;
  views: number;
  date: string | null;
  tags: string[];
}

function toVideo(row: VideoRow): Video {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    src: row.src,
    poster: row.poster ?? "",
    duration: row.duration,
    views: row.views,
    date: row.date ?? "",
    tags: row.tags,
  };
}

/** Reemplaza el `import { videos } from "@/data/videos"` en tus componentes */
export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return (data as VideoRow[]).map(toVideo);
}

export async function getVideoById(id: number): Promise<Video | null> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? toVideo(data as VideoRow) : null;
}

/** Suma +1 a las views de un video, igual que incrementPhotoViews. */
export async function incrementVideoViews(id: number): Promise<void> {
  const { error } = await supabase.rpc("increment_videos_views", {
    video_id: id,
  });
  if (error) throw error;
}