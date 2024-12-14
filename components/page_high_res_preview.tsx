'use client'

import { FC, useCallback, useEffect, useState } from 'react'
import { usePdfStore } from '@/stores/usePdfStore'
import { motion } from 'motion/react'
import { renderPage } from '@/lib/utils'
import { LoaderCircle } from 'lucide-react'

interface Props {
  onClose: () => void
  pageNumber: number
}

const PageHighResPreview: FC<Props> = ({ onClose, pageNumber }) => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const previewImageData = usePdfStore((state) => state.previewImageData)
  const setPreviewImageData = usePdfStore((state) => state.setPreviewImageData)
  const highResScale = usePdfStore((state) => state.highResScale)

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = scrollbarWidth + 'px'

    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyPress)

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''

      document.removeEventListener('keydown', onKeyPress)
    }
  }, [onClose])

  const renderHighResPreview = useCallback(async () => {
    setIsLoading(true)
    const previewImageData = await renderPage(pageNumber, highResScale)
    setPreviewImageData(previewImageData)
    setIsLoading(false)
  }, [highResScale, pageNumber, setPreviewImageData])

  if (!previewImageData) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ willChange: 'opacity' }}
        className="z-10 fixed inset-0 bg-black pointer-events-auto"
        onClick={onClose}
      />

      {/* Preview image */}
      <div className="fixed inset-0 overflow-auto z-20 p-8" onClick={onClose}>
        <div className={'relative w-fit mx-auto'}>
          {isLoading && (
            <div className="z-50 absolute top-2 right-2">
              <LoaderCircle className={'animate-spin text-blue-400 w-[32px] h-[32px]'} />
            </div>
          )}

          <motion.img
            layoutId={`preview-image-${pageNumber}`}
            width={previewImageData.width}
            height={previewImageData.height}
            src={previewImageData.objectURL}
            style={{
              willChange: 'transform, opacity',
            }}
            alt={`Page ${pageNumber} preview`}
            onLayoutAnimationComplete={renderHighResPreview}
          />
        </div>
      </div>
    </>
  )
}

export { PageHighResPreview }
