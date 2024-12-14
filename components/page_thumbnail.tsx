import { FC, MouseEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import { cn, renderPage } from '@/lib/utils'
import { CheckboxIcon } from '@/components/ui/checkbox_icon'
import { motion } from 'motion/react'
import { PDFImageData, usePdfStore } from '@/stores/usePdfStore'
import { LoaderCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { PageNumber } from '@/components/page_number'

interface Props {
  pageNumber: number
  onClick: (pageNumber: number, isShiftPressed: boolean) => void
}

const PageThumbnail: FC<Props> = ({ pageNumber, onClick }) => {
  const selectedPages = usePdfStore((state) => state.selectedPages)
  const previewPageNumber = usePdfStore((state) => state.previewPageNumber)
  const pdfWorkerPool = usePdfStore((state) => state.pdfWorkerPool)
  const setPreviewPageNumber = usePdfStore((state) => state.setPreviewPageNumber)
  const setPreviewImageData = usePdfStore((state) => state.setPreviewImageData)
  const lowResScale = usePdfStore((state) => state.lowResScale)
  const highResScale = usePdfStore((state) => state.highResScale)

  const isSelected = selectedPages.has(pageNumber)
  const inPreview = pageNumber === previewPageNumber
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [alreadyInLine, setAlreadyInLine] = useState<boolean>(false)
  const [imageData, setImageData] = useState<PDFImageData | null>(null)
  const isLoading = !imageData

  // Load image for preview
  const onLongPress = useCallback(
    (pageNumber: number) => {
      if (!imageData) {
        toast({
          title: 'Warning',
          description: `Thumbnail isn't rendered yet.`,
        })
      } else {
        const width = (imageData.width / lowResScale) * highResScale
        const height = (imageData.height / lowResScale) * highResScale
        setPreviewImageData({
          width,
          height,
          objectURL: imageData.objectURL,
        })
        setPreviewPageNumber(pageNumber)
      }
    },
    [highResScale, imageData, lowResScale, setPreviewImageData, setPreviewPageNumber]
  )

  const onLongPressStart = useCallback(
    (page: number) => {
      longPressTimer.current = setTimeout(() => {
        onLongPress(page)
        longPressTimer.current = null
      }, 250)
    },
    [onLongPress]
  )

  const onLongPressEnd = useCallback(() => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  // Render thumbnail when it becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!alreadyInLine && entry.isIntersecting) {
          renderPage(pageNumber, lowResScale)
            .then((imageData) => setImageData(imageData))
            .catch((error) => {
              toast({
                title: 'Error',
                description: `Failed to render page thumbnail.`,
                variant: 'destructive',
              })
              console.error(error)
            })
          setAlreadyInLine(true)
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [pageNumber, alreadyInLine, pdfWorkerPool, lowResScale])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (previewPageNumber > 0) {
        if (e.code === 'Enter') {
          setPreviewPageNumber(0)
        }

        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        onClick(pageNumber, e.shiftKey)
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        onLongPress(pageNumber)
      }
    },
    [onClick, onLongPress, pageNumber, previewPageNumber, setPreviewPageNumber]
  )

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'flex items-center justify-center',
        'relative bg-white dark:bg-gray-600 rounded-lg border',
        'hover:shadow-lg cursor-pointer',
        isSelected ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600',
        !imageData && 'aspect-[8.5/11]'
      )}
      style={{
        // Match the intrinsic behavior of the <img>
        width: imageData?.width,
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: imageData ? `${imageData.width} / ${imageData.height}` : undefined,
      }}
      initial={{ scale: 1 }}
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      onClick={(e: MouseEvent) => onClick(pageNumber, e.shiftKey)}
      onMouseDown={onLongPressStart.bind(null, pageNumber)}
      onMouseUp={onLongPressEnd}
      onMouseLeave={onLongPressEnd}
      onTouchStart={onLongPressStart.bind(null, pageNumber)}
      onTouchEnd={onLongPressEnd}
      onTouchCancel={onLongPressEnd}
      onTouchMove={onLongPressEnd}
      onKeyDown={onKeyDown}
    >
      {/* Checkbox */}
      <div className={cn('absolute top-2 right-2', isLoading && 'invisible')}>
        <CheckboxIcon isSelected={isSelected} />
      </div>

      {/* Loading icon */}
      {isLoading && (
        <div
          className={
            'absolute backdrop-blur-sm rounded-lg  flex w-full h-full items-center justify-center'
          }
        >
          <LoaderCircle className={'animate-spin text-blue-400 w-[32px] h-[32px]'} />
        </div>
      )}

      {/* Page image */}
      {!isLoading && (
        <motion.img
          layoutId={`preview-image-${pageNumber}`}
          className={cn('rounded-lg pointer-events-none will-change-auto', inPreview && 'hidden')}
          alt={`Page ${pageNumber}`}
          width={imageData.width}
          height={imageData.height}
          src={imageData.objectURL}
        />
      )}

      <PageNumber pageNumber={pageNumber} hidden={isLoading} />
    </motion.div>
  )
}

export { PageThumbnail }
