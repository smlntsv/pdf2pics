import type { NextConfig } from 'next'
import CopyPlugin from 'copy-webpack-plugin'
import path from 'node:path'

const nextConfig: NextConfig = {
  // reactStrictMode: true,
  webpack: (config) => {
    // To make it work with Next.js 15 install `ajv` package
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: require.resolve('pdfjs-dist/build/pdf.worker.mjs'),
            to: path.resolve(__dirname, `public/static/js/pdf.worker.min.mjs`),
          },
        ],
      })
    )

    return config
  },
}

export default nextConfig
