import { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import '@/lib/polyfills'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme_provider'

export const metadata: Metadata = {
  title: 'PDF to Pics',
  description:
    'Easily convert PDF files to high-quality images with PDF to Pics. This secure PWA works offline, ensuring fast, private, and reliable conversions—all directly in your browser without uploading files to a server.',
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
        <ThemeProvider
          attribute={'class'}
          defaultTheme={'system'}
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
