import { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import '@/lib/polyfills'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme_provider'

export const metadata: Metadata = {
  title: 'PDF to IMG',
  description: 'Convert PDF to Images',
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
