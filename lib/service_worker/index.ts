import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist, StaleWhileRevalidate } from 'serwist'

interface WorkerGlobalScope extends SerwistGlobalConfig {
  // Change this attribute's name to your `injectionPoint`.
  // `injectionPoint` is an InjectManifest option.
  // See https://serwist.pages.dev/docs/build/configuring
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
}

declare const self: WorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      handler: new StaleWhileRevalidate(),
      matcher: () => true,
    },
  ],
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document'
        },
      },
    ],
  },
})

serwist.addToPrecacheList([
  {
    url: 'manifest.webmanifest',
    revision: '1',
  },
])

serwist.addEventListeners()
