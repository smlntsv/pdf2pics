import { ButtonHTMLAttributes, FC } from 'react'
import { cn } from '@/lib/utils'

const ToolbarButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...reset
}) => {
  return (
    <button
      className={cn(
        'px-6 py-4 flex items-center rounded-lg',
        'transition-colors duration-200 ease-in-out',
        'hover:bg-gray-200 dark:hover:bg-blue-500',
        'disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent',
        className
      )}
      {...reset}
    >
      {children}
    </button>
  )
}

export { ToolbarButton }
