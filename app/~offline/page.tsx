import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `No Internet Connection`,
}

export default function OfflinePage() {
  return (
    <main className={'text-center'}>
      <h1 className="mt-8 text-2xl font-medium text-slate-500 dark:text-slate-200">
        No Internet Connection
      </h1>
      <p className={'mt-2'}>
        It looks like you&#39;re offline. Please check your internet connection and try again.
      </p>
      <p>If you believe your internet should be working, try reloading the page.</p>
      <Link
        href="/"
        className="mt-6 bg-blue-600 text-white px-10 py-2 rounded-md hover:bg-blue-500 inline-block"
      >
        Return Home
      </Link>
    </main>
  )
}
