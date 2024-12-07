import { ButtonHTMLAttributes, FC } from 'react'
import { cn } from '@/lib/utils'

const ToolbarButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  disabled,
  ...reset
}) => {
  return (
    <button
      className={cn(
        'px-6 py-4 flex items-center rounded-lg',
        'transition-colors duration-200 ease-in-out',
        {
          // Default state
          'text-gray-800 hover:text-gray-600 active:text-gray-800 bg-transparent hover:bg-gray-50 active:bg-gray-100':
            !disabled,
          // Dark theme support
          'dark:text-white dark:hover:text-gray-100 dark:active:text-gray-200 dark:hover:bg-blue-500':
            !disabled,
          // Disabled state
          'text-gray-400 cursor-not-allowed': disabled,
          'dark:text-gray-400 dark:cursor-not-allowed': disabled,
        },
        className
      )}
      disabled={disabled}
      {...reset}
    >
      {children}
    </button>
  )
}

export { ToolbarButton }
