import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckboxIcon } from '@/components/ui/checkbox_icon'
import { motion } from 'motion/react'
import { PDFImageData, usePdfStore } from '@/stores/usePdfStore'
import { LoaderCircle } from 'lucide-react'
import { PDFWorkerPool } from '@/lib/pdf_worker_pool'
import { toast } from '@/hooks/use-toast'

const PAGE_THUMBNAIL_SCALE = 0.8

interface Props {
  pageNumber: number
  onClick: (pageNumber: number, isShiftPressed: boolean) => void
}

const PageThumbnail: FC<Props> = ({ pageNumber, onClick }) => {
  const {
    selectedPages,
    previewIsVisible,
    previewPageNumber,
    pdfWorkerPool,
    setPreviewPageNumber,
    setPreviewIsVisible,
    setPreviewImageData,
  } = usePdfStore()

  const isSelected = selectedPages.has(pageNumber)
  const inPreview = pageNumber === previewPageNumber && previewIsVisible
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [alreadyInLine, setAlreadyInLine] = useState<boolean>(false)
  // const [imageObjectURL, setImageObjectURL] = useState<string | null>(null)
  const [imageData, setImageData] = useState<PDFImageData | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false)

  const renderPage = useCallback(
    (
      pdfWorkerPool: PDFWorkerPool,
      pageNumber: number,
      scale: number = 0.8
    ): Promise<PDFImageData> =>
      new Promise(async (resolve, reject) => {
        const responseData = await pdfWorkerPool?.renderPage(pageNumber, scale)
        if (responseData.type === 'pageRendered') {
          const blob = new Blob([responseData.pageImageArrayBuffer])
          const objectURL = URL.createObjectURL(blob)

          resolve({
            objectURL,
            width: responseData.width,
            height: responseData.height,
          })
        } else {
          reject('Unexpected response type.')
        }
      }),
    []
  )

  // Load image for preview
  const onLongPress = useCallback(
    async (pageNumber: number) => {
      if (!pdfWorkerPool) {
        toast({
          title: 'Error',
          description: 'Renderer is not ready yet',
        })
        return
      }
      setIsPreviewLoading(true)
      setPreviewPageNumber(pageNumber)
      const previewImageData = await renderPage(
        pdfWorkerPool,
        pageNumber,
        window.devicePixelRatio || 1
      )
      setPreviewImageData(previewImageData)
      setIsPreviewLoading(false)
      setPreviewIsVisible(true)
    },
    [pdfWorkerPool, renderPage, setPreviewImageData, setPreviewIsVisible, setPreviewPageNumber]
  )

  const onLongPressStart = useCallback(
    (page: number) => {
      longPressTimer.current = setTimeout(() => {
        onLongPress(page).catch(() => {})
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

  // Add page to render queue when it becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!alreadyInLine && entry.isIntersecting && pdfWorkerPool) {
          renderPage(pdfWorkerPool, pageNumber, PAGE_THUMBNAIL_SCALE)
            .then((imageData) => setImageData(imageData))
            .catch((error) => {
              console.error(error)
              toast({
                title: 'Error',
                description: `Failed to render page thumbnail.`,
                variant: 'destructive',
              })
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
  }, [pageNumber, alreadyInLine, pdfWorkerPool, renderPage])

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex items-center justify-center',
        'relative bg-white rounded-lg border',
        'hover:shadow-lg cursor-pointer',
        isSelected ? 'border-blue-500' : 'border-gray-300',
        !imageData && 'aspect-[8.5/11]'
      )}
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

      {/* Loading icon */}
      {isPreviewLoading && (
        <div
          className={
            'absolute backdrop-blur-sm rounded-md  flex w-full h-full items-center justify-center'
          }
        >
          <LoaderCircle className={'animate-spin text-blue-400 w-[32px] h-[32px]'} />
        </div>
      )}

      {/* Page image */}
      {!imageData ? (
        <div className={'flex w-full h-full items-center justify-center'}>
          <LoaderCircle className={'animate-spin text-blue-400 w-[32px] h-[32px]'} />
        </div>
      ) : (
        <motion.img
          className={'rounded-lg'}
          layoutId={`img-${pageNumber.toString()}`}
          alt={`Page ${pageNumber}`}
          width={imageData.width}
          height={imageData.height}
          src={imageData.objectURL}
        />
      )}

      {/* Page number */}
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
