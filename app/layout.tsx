import { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import '@/lib/polyfills'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme_provider'
import { Footer } from '@/components/footer'
import { ThemeSwitch } from '@/components/ui/theme_switch'
import { Logo } from '@/components/logo'
import { startupImage } from '@/lib/apple_splash_screens'
import Script from 'next/script'

const APP_NAME = 'PDF to Pics'

export const metadata: Metadata = {
  title: {
    template: `%s - ${APP_NAME}`,
    default: APP_NAME,
  },
  description:
    'Easily convert PDF files to high-quality images with PDF to Pics. This secure PWA works offline, ensuring fast, private, and reliable conversions—all directly in your browser without uploading files to a server.',
  icons: {
    apple: [
      {
        url: 'img/icons/apple-touch-icon-180.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    startupImage,
    statusBarStyle: 'black-translucent',
  },
  other: {
    // Required for splashscreen to work
    'apple-mobile-web-app-capable': 'yes',
  },
  // public/js/update_manifest.js controls android=true query param
  manifest: 'manifest.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex flex-col mx-auto',
          'min-h-dvh w-full max-w-6xl p-4',
          'bg-gradient-to-bl  dark:from-slate-900 dark:to-slate-600'
        )}
      >
        <Script src={'js/update_manifest.js'} strategy={'beforeInteractive'} />
        <ThemeProvider
          attribute={'class'}
          defaultTheme={'system'}
          enableSystem
          disableTransitionOnChange
        >
          <ThemeSwitch className={'absolute right-4 top-4'} />

          <header className={'mt-auto'}>
            <Logo className={'mx-auto'} />
          </header>

          {children}

          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
