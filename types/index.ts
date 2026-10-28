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

  // Carrete: las fotos con el mismo valor se muestran juntas
  setName?: string | null;
}