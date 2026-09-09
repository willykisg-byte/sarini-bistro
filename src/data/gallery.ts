export interface GalleryImage {
  id: string
  src: string
  caption: string
}

export const galleryImages: GalleryImage[] = [
  { id: 'latte-art', src: '/images/latte-art.jpg', caption: 'Latte Art' },
  { id: 'oreo-shake', src: '/images/oreo-shake.jpg', caption: 'Oreo Bliss' },
  { id: 'loaded-burger', src: '/images/loaded-burger.jpg', caption: 'Loaded Burger' },
]
