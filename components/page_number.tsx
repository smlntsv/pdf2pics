import { FC, HTMLProps } from 'react'
import { cn } from '@/lib/utils'

interface PageNumberProps extends HTMLProps<HTMLParagraphElement> {
  pageNumber: number
  hidden: boolean
}

const PageNumber: FC<PageNumberProps> = ({ pageNumber, hidden, className, ...rest }) => {
  return (
    <p
      className={cn(
        'absolute left-2 bottom-2 px-3 py-1 bg-white text-gray-500 rounded-full border text-sm',
        hidden && 'invisible',
        className
      )}
      {...rest}
    >
      Page {pageNumber}
    </p>
  )
}

export { PageNumber }
