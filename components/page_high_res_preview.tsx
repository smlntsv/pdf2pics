'use client'

import { FC, useCallback, useState } from 'react'
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

  const renderHighResPreview = useCallback(async () => {
    setIsLoading(true)
    const previewImageData = await renderPage(pageNumber, highResScale)
    setPreviewImageData(previewImageData)
    setIsLoading(false)
  }, [highResScale, pageNumber, setPreviewImageData])

  return (
    <div className={'z-20 fixed inset-0 overflow-auto backdrop-contrast-75'} onClick={onClose}>
      {previewImageData && (
        <div className="relative w-fit mx-auto">
          {/* Loading indicator positioned at the top right */}
          {isLoading && (
            <div className="z-30 absolute top-2 right-2">
              <LoaderCircle className={'animate-spin text-blue-400 w-[32px] h-[32px]'} />
            </div>
          )}
          <motion.img
            layout={false}
            layoutId={`preview-image-${pageNumber}`}
            width={previewImageData.width}
            height={previewImageData.height}
            src={previewImageData.objectURL}
            className={'mx-auto will-change-auto rounded-lg'}
            alt={`Page ${pageNumber} preview`}
            onLayoutAnimationComplete={renderHighResPreview}
          />
        </div>
      )}
    </div>
  )
}

export { PageHighResPreview }
