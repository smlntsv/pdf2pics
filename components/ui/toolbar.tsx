import { cn } from '@/lib/utils'
import { Download, X } from 'lucide-react'
import { ToolbarButton } from '@/components/ui/toolbar_button'
import { FC } from 'react'
import { usePdfStore } from '@/stores/usePdfStore'

interface ToolbarProps {
  selectedPages: number
  onExportSelectedClicked: () => void
}

const Toolbar: FC<ToolbarProps> = ({ onExportSelectedClicked }) => {
  const { selectedPages, setSelectedPages } = usePdfStore()

  return (
    <div className={cn('fixed w-full max-w-6xl bottom-4 right-0 left-0 px-4 mx-auto')}>
      <div
        className={cn(
          'flex justify-between items-center rounded-lg',
          'bg-white dark:bg-gray-500 dark:text-white',
          'border border-gray-100 shadow-sm dark:border-gray-500'
        )}
      >
        <ToolbarButton onClick={onExportSelectedClicked}>
          <Download className={'mr-2'} />
          Export Selected
        </ToolbarButton>
        <p className={'text-gray-500 dark:text-white'}>
          Selected: <span className="font-bold">{selectedPages.size}</span>
        </p>
        <ToolbarButton onClick={setSelectedPages.bind(null, new Set())}>
          Clear Selection
          <X className={'ml-2'} />
        </ToolbarButton>
      </div>
    </div>
  )
}

export { Toolbar }
