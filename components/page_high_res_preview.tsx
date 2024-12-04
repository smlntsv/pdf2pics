'use client'

import { FC } from 'react'
import { usePdfStore } from '@/stores/usePdfStore'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface Props {
  onClose: () => void
}

const PageHighResPreview: FC<Props> = ({ onClose }) => {
  const { previewPageNumber, previewImageData } = usePdfStore()

  return (
    <div className={'fixed inset-0 z-10 flex items-center justify-center p-4'} onClick={onClose}>
      <motion.div
        className={cn(
          'bg-slate-200 dark:bg-gray-600 shadow-lg rounded-lg',
          'mx-auto p-4 max-h-full max-w-6xl   overflow-auto '
        )}
        layoutId={`img-${previewPageNumber?.toString()}`}
      >
        {previewImageData && (
          <img
            width={previewImageData.width}
            height={previewImageData.height}
            src={previewImageData.objectURL}
            className={'object-contain'}
            alt={'Page preview'}
          />
        )}
      </motion.div>
    </div>
  )
}

export { PageHighResPreview }
