import { FC, MouseEvent, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { CheckboxIcon } from '@/components/ui/checkbox_icon'
import { motion } from 'motion/react'
import { usePdfStore } from '@/stores/usePdfStore'

interface Props {
  pageNumber: number
  onClick: (pageNumber: number, isShiftPressed: boolean) => void
  onLongPress: (pageNumber: number) => void
}

const PageThumbnail: FC<Props> = ({ pageNumber, onClick, onLongPress }) => {
  const { selectedPages, previewPageNumber } = usePdfStore()
  const isSelected = selectedPages.has(pageNumber)
  const inPreview = pageNumber === previewPageNumber
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const onLongPressStart = useCallback(
    (page: number) => {
      longPressTimer.current = setTimeout(() => {
        onLongPress(page)
        longPressTimer.current = null
      }, 200)
    },
    [onLongPress]
  )

  const onLongPressEnd = useCallback(() => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  return (
    <div
      className={cn(
        `relative bg-gray-200 rounded-lg border`,
        `shadow hover:shadow-lg cursor-pointer`,
        isSelected ? 'border-blue-500' : 'border-gray-300'
      )}
      style={{ aspectRatio: '8.5 / 11' }}
      onClick={(e: MouseEvent) => onClick(pageNumber, e.shiftKey)}
      onMouseDown={onLongPressStart.bind(null, pageNumber)}
      onMouseUp={onLongPressEnd}
      onMouseLeave={onLongPressEnd}
      onTouchStart={onLongPressStart.bind(null, pageNumber)}
      onTouchEnd={onLongPressEnd}
    >
      {/* Checkbox */}
      <div className={cn('absolute top-2 right-2', inPreview && 'hidden')}>
        <CheckboxIcon isSelected={isSelected} />
      </div>

      {/* Page image */}
      <motion.img
        className={'rounded-lg'}
        layoutId={`img-${pageNumber.toString()}`}
        alt={`Page ${pageNumber}`}
        src={'/demo/page-screenshot.png'}
      />

      {/* Placeholder for PDF page */}
      <p
        className={cn(
          'absolute left-2 bottom-2 flex  bg-white text-gray-500 px-3 py-1 rounded-full border',
          inPreview && 'hidden'
        )}
      >
        Page {pageNumber}
      </p>
    </div>
  )
}

export { PageThumbnail }
