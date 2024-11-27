import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PDF to IMG',
    orientation: 'any',
    short_name: 'PDF2IMG',
    description: 'Convert PDF to Images',
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
        label: 'Home screen showing main UI for PDF to IMG conversion',
        src: 'img/screenshots/home-1280x720.png',
        type: 'image/png',
        sizes: '1280x720',
      },
      {
        form_factor: 'narrow',
        label: 'Home screen showing main UI for PDF to IMG conversion',
        src: 'img/screenshots/home-720x1280.png',
        type: 'image/png',
        sizes: '720x1280',
      },
    ],
  }
}
