import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isAndroid = searchParams.has('android') && searchParams.get('android') === 'true'
  const iconSrcSuffix = isAndroid ? 'android-' : ''

  // if query params contains Android, then we use square icons
  return Response.json({
    id: 'pdf2pics',
    name: 'PDF to Pics',
    orientation: 'any',
    short_name: 'PDF to Pics',
    description: 'Convert PDFs to Pictures effortlessly',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: `img/icons/icon-${iconSrcSuffix}192x192.png`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `img/assets/icon-${iconSrcSuffix}512x512.png`,
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
  })
}
