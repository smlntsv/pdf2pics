import withSerwistInit from '@serwist/next'

const revision = crypto.randomUUID()

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: 'lib/service_worker/index.ts',
  swDest: 'public/sw.js',
  additionalPrecacheEntries: [
    { url: '/', revision },
    { url: '/~offline', revision },
    // Icons
    { url: 'img/icons/apple-touch-icon-180.png', revision },
    { url: 'img/icons/icon.svg', revision },
    { url: 'img/icons/icon-32.png', revision },
    { url: 'img/icons/icon-192x192.png', revision },
    { url: 'img/icons/icon-512x512.png', revision },
    { url: 'img/icons/icon-android-192x192.png', revision },
    { url: 'img/icons/icon-android-512x512.png', revision },
    // Screenshots
    { url: 'img/screenshots/conversion-dark.png', revision },
    { url: 'img/screenshots/conversion-light.png', revision },
    { url: 'img/screenshots/home-1280x720.png', revision },
  ],
  // Prevent selected document reset on reconnect
  reloadOnOnline: false,
})

/** @type {import("next").NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ]
  },
  // https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
  output: 'standalone',
  /**
   * @param {import('webpack').Configuration} config
   * @returns {import('webpack').Configuration}
   */
  webpack: (config) => {
    config.optimization.minimize = false
    return config
  },
}

export default withSerwist(nextConfig)
