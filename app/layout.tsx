import { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import '@/lib/polyfills'

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
    <html lang="en" className={''}>
      <body className={''}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
