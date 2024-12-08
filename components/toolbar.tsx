import { cn, exportSelectedPages } from '@/lib/utils'
import { Download, LoaderCircle, X } from 'lucide-react'
import { ToolbarButton } from '@/components/ui/toolbar_button'
import { FC, useState } from 'react'
import { usePdfStore } from '@/stores/usePdfStore'

const Toolbar: FC = () => {
  const [isExportInProgress, setIsExportInProgress] = useState<boolean>(false)
  const { selectedPages, setSelectedPages } = usePdfStore()

  const onExportSelectedClicked = async () => {
    setIsExportInProgress(true)
    await exportSelectedPages()
    setIsExportInProgress(false)
  }

  return (
    <div className={cn('sticky mt-6 w-full max-w-6xl bottom-4 right-0 left-0 mx-auto')}>
      <div
        className={cn(
          'flex justify-between items-center rounded-lg',
          'bg-white dark:bg-gray-500 dark:text-white',
          'border border-gray-200  dark:border-gray-500',
          'text-sm'
        )}
      >
        <ToolbarButton onClick={onExportSelectedClicked} disabled={selectedPages.size === 0}>
          {isExportInProgress ? (
            <>
              <LoaderCircle className={'animate-spin mr-2'} />
              Exporting...
            </>
          ) : (
            <>
              <Download className={'mr-2'} />
              Export Selected
            </>
          )}
        </ToolbarButton>
        <p className={'text-center'}>
          Selected: <span className="font-bold">{selectedPages.size}</span>
        </p>
        <ToolbarButton
          onClick={setSelectedPages.bind(null, new Set())}
          disabled={selectedPages.size === 0}
        >
          Clear Selection
          <X className={'ml-2'} />
        </ToolbarButton>
      </div>
    </div>
  )
}

export { Toolbar }
