import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Route not found',
}

export default function NotFoundPage() {
  return (
    <div className={'text-center'}>
      <h1 className="mt-8 text-2xl font-medium text-slate-500 dark:text-slate-200">Not found</h1>
      <p className={'mt-2'}>Could not find requested resource</p>
      <Link
        href="/"
        className="mt-6 bg-blue-600 text-white px-10 py-2 rounded-md hover:bg-blue-500 inline-block"
      >
        Return Home
      </Link>
    </div>
  )
}
