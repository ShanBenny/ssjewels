/// <reference types="vite/client" />

declare module 'virtual:image-metadata' {
  export interface ImageMetadata {
    filename: string;
    path: string;
    mtimeMs: number;
  }
  const images: ImageMetadata[];
  export default images;
}
