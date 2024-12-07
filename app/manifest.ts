import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PDF to Pics',
    orientation: 'any',
    short_name: 'PDF2PICS',
    description: 'Convert PDFs to Pictures effortlessly',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: 'img/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'img/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        form_factor: 'wide',
        label: 'Home screen showcasing the main interface for converting PDFs to images',
        src: 'img/screenshots/home-1280x720.png',
        type: 'image/png',
        sizes: '1280x720',
      },
      {
        form_factor: 'narrow',
        label: 'Home screen showcasing the main interface for converting PDFs to images',
        src: 'img/screenshots/home-720x1280.png',
        type: 'image/png',
        sizes: '720x1280',
      },
    ],
  }
}
