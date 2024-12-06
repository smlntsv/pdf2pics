'use client'

import { AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { FC, useCallback } from 'react'
import { usePdfStore } from '@/stores/usePdfStore'
import { PageThumbnail } from '@/components/page_thumbnail'
import { PageHighResPreview } from '@/components/page_high_res_preview'

interface PagesSelectorProps {
  className?: string
}

const PagesSelector: FC<PagesSelectorProps> = ({ className }) => {
  const {
    pageCount,
    selectedPages,
    setSelectedPages,
    lastSelectedPages,
    setLastSelectedPages,
    previewIsVisible,
    setPreviewIsVisible,
  } = usePdfStore()

  const onPageClick = useCallback(
    (clickedPage: number, isShiftKeyPressed: boolean) => {
      // Modify state
      const set = new Set(selectedPages)
      let updatedLastSelectedPages = [...lastSelectedPages]

      if (isShiftKeyPressed) {
        // Get last selected page
        const lastSelectedPage =
          updatedLastSelectedPages.length > 0 ? updatedLastSelectedPages.at(-1)! : 1

        const startPoint = Math.min(clickedPage, lastSelectedPage)
        const endPoint = Math.max(clickedPage, lastSelectedPage)

        for (let i = startPoint; i <= endPoint; i++) {
          set.add(i)
        }

        updatedLastSelectedPages.push(clickedPage) // unsure about this
      } else {
        if (set.has(clickedPage)) {
          set.delete(clickedPage)
          updatedLastSelectedPages = updatedLastSelectedPages.filter((page) => page !== clickedPage)
        } else {
          set.add(clickedPage)
          updatedLastSelectedPages.push(clickedPage)
        }
      }

      // Update state
      setSelectedPages(set)
      updatedLastSelectedPages = updatedLastSelectedPages.filter((page) => set.has(page))
      setLastSelectedPages(updatedLastSelectedPages)
    },
    [lastSelectedPages, selectedPages, setLastSelectedPages, setSelectedPages]
  )

  const onHighResPreviewClose = () => {
    setPreviewIsVisible(false)
  }

  // Prevent scroll when overlay is visible
  // useEffect(() => {
  //   document.body.style.overflow = previewIsVisible > 0 ? 'hidden' : 'auto'
  // }, [previewIsVisible])

  return (
    <div
      className={cn(
        'select-none w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4',
        className
      )}
      style={{
        WebkitUserSelect: 'none',
      }}
    >
      {/* Pages Thumbnails */}
      {Array.from({ length: pageCount }).map((_, pageIdx) => (
        <PageThumbnail key={pageIdx} pageNumber={pageIdx + 1} onClick={onPageClick} />
      ))}

      {/* High-Res Preview */}
      <AnimatePresence mode={'wait'}>
        {previewIsVisible && <PageHighResPreview onClose={onHighResPreviewClose} />}
      </AnimatePresence>
    </div>
  )
}

export { PagesSelector }
