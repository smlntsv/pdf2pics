import Link from 'next/link'
import { IconGitHub } from '@/components/icons/icon_github'
import { IconLinkedIn } from '@/components/icons/icon_linkedin'
import { IconX } from '@/components/icons/icon_x'

const GITHUB_REPO_URL = process.env.NEXT_PUBLIC_GITHUB_REPO_URL
const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL
const TWITTER_X_URL = process.env.NEXT_PUBLIC_TWITTER_X_URL
const EMAIL = process.env.NEXT_PUBLIC_EMAIL

const Footer = () => {
  const iconsClasses = 'w-6 h-6 hover:text-gray-600 dark:hover:text-blue-400'

  return (
    <footer className="mt-auto pt-10 text-muted-foreground">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          This project is open-sourced and available on{' '}
          <Link href={GITHUB_REPO_URL} target="_blank" className="text-blue-400 hover:underline">
            GitHub
          </Link>
          .
        </p>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mt-4">
          <Link href={GITHUB_REPO_URL} target="_blank" aria-label="GitHub">
            <IconGitHub className={iconsClasses} />
          </Link>
          <Link href={LINKEDIN_URL} target="_blank" aria-label="LinkedIn">
            <IconLinkedIn className={iconsClasses} />
          </Link>

          <Link href={TWITTER_X_URL} target="_blank" aria-label="X (Twitter)">
            <IconX className={iconsClasses} />
          </Link>
        </div>

        {/* Star Button */}
        <div className={'mt-4'}>
          <Link
            href={GITHUB_REPO_URL}
            target="_blank"
            className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-md hover:bg-yellow-300 inline-block"
          >
            ⭐ Star this project
          </Link>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Made with ❤️ by Dima using Next.js &copy; {new Date().getFullYear()}. All rights reserved.
        </p>

        <p className="mt-2 text-sm text-blue-400">
          <Link href={`mailto:${EMAIL}`} className="hover:underline">
            Currently open to job opportunities! Let&#39;s connect.
          </Link>
        </p>
      </div>
    </footer>
  )
}

export { Footer }
