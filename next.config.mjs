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
