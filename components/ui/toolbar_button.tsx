import { ButtonHTMLAttributes, FC } from 'react'
import { cn } from '@/lib/utils'

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ToolbarButton: FC<ToolbarButtonProps> = ({ className, children, ...reset }) => {
  return (
    <button
      className={cn(
        'px-6 py-4 flex items-center font-medium',
        'text-gray-500 hover:text-gray-600 active:text-gray-800',
        'dark:text-white dark:hover:text-gray-100 dark:active:text-gray-200',
        ' dark:hover:bg-blue-500 hover:bg-gray-50 active:bg-gray-100 rounded-lg',
        className
      )}
      {...reset}
    >
      {children}
    </button>
  )
}

export { ToolbarButton }
