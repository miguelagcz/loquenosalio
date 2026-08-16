export interface Photo {
  id: number;

  title: string;
  description: string;

  src: string;
  blur: string;

  width: number;
  heightPx: number;

  height: string;

  category: string;
  tags: string[];

  views: number;
  downloads: number;

  date: string;
  location: string;

  camera: string;
  lens: string;
  iso: number;
  aperture: string;
  shutter: string;
}
export interface Video {
  id: number;

  title: string;

  src: string;
  poster: string;

  duration: string;

  views: number;

  date: string;

  tags: string[];
}