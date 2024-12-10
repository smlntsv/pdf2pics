import withSerwistInit from '@serwist/next'

const revision = crypto.randomUUID()

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: 'lib/service_worker/index.ts',
  swDest: 'public/sw.js',
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
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
}

export default withSerwist(nextConfig)
