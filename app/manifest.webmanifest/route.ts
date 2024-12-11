import { type NextRequest } from 'next/server'
import { type Manifest } from 'next/dist/lib/metadata/types/manifest-types'

export async function GET(request: NextRequest) {
  const isAndroid = request.headers.get('user-agent')?.indexOf('Android') !== -1
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
    // TODO: implement
    // share_target: {},
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
        form_factor: 'narrow',
        src: 'https://pdf2.pics/img/screenshots/conversion-dark.png',
        sizes: '599x1119',
        type: 'image/png',
      },
      {
        form_factor: 'narrow',
        src: 'https://pdf2.pics/img/screenshots/conversion-light.png',
        sizes: '599x1119',
        type: 'image/png',
      },
      {
        form_factor: 'wide',
        src: 'img/screenshots/home-1280x720.png',
        type: 'image/png',
        sizes: '1280x720',
      },
    ],
  } as Manifest)
}
