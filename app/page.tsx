'use client'

import { DropZone } from '@/components/drop_zone'
import { FileWithPath } from 'react-dropzone'
import { useCallback, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { PagesSelector } from '@/components/pages_selector'
import { Toolbar } from '@/components/toolbar'
import { usePdfStore } from '@/stores/usePdfStore'
import { ConversionSettings } from '@/components/conversion_settings'
import { PDFWorkerPool } from '@/lib/pdf_worker_pool'
import { FeatureSupportChecker } from '@/components/feature_support_checker'

export default function Home() {
  const [isDocumentLoading, setIsDocumentLoading] = useState<boolean>(false)
  const {
    setSelectedFileName,
    pdfWorkerPool,
    pageCount,
    setPageCount,
    setPdfWorkerPool,
    setPreviewPageNumber,
    setSelectedPages,
  } = usePdfStore()

  const cleanup = useCallback(() => {
    setPageCount(0)
    setPreviewPageNumber(0)
    setSelectedPages(new Set())
    setSelectedFileName(null)
  }, [setPageCount, setPreviewPageNumber, setSelectedFileName, setSelectedPages])

  const onFileSelected = useCallback(
    async (file: FileWithPath) => {
      setIsDocumentLoading(true)

      try {
        cleanup()

        // Convert to SharedArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const sharedArrayBuffer = new SharedArrayBuffer(arrayBuffer.byteLength)
        const sharedView = new Uint8Array(sharedArrayBuffer)
        sharedView.set(new Uint8Array(arrayBuffer))

        // Initialize workers
        // TODO: rewrite
        if (!pdfWorkerPool) {
          const workerPool = new PDFWorkerPool()

          // Load document to all workers at once
          const documentsPageCount = await workerPool.initializeDocument(sharedArrayBuffer)
          setPageCount(documentsPageCount[0])
          setPdfWorkerPool(workerPool)
        } else {
          // Load document to all workers at once
          const pagesCount = await pdfWorkerPool.initializeDocument(sharedArrayBuffer)
          setPageCount(pagesCount[0])
        }

        setSelectedFileName(file.name)
      } catch (err) {
        toast({
          title: 'Error',
          description: `Failed to load document: ${(err as Error).message}`,
          variant: 'destructive',
        })
      } finally {
        setIsDocumentLoading(false)
      }
    },
    [cleanup, pdfWorkerPool, setPageCount, setPdfWorkerPool, setSelectedFileName]
  )

  return (
    <main>
      <section>
        <DropZone
          onFileSelected={onFileSelected}
          className={'mt-4'}
          isLoading={isDocumentLoading}
        />
      </section>

      <FeatureSupportChecker />

      <section>
        {pageCount > 0 ? (
          <>
            <ConversionSettings />
            <PagesSelector className={'mt-6'} />
            <Toolbar />
          </>
        ) : (
          <p className={'mt-4 text-gray-600 dark:text-gray-300 text-center'}>
            Easily convert PDF files to <strong>high-quality images</strong> with PDF to Pics. This
            secure <strong>PWA</strong> works <strong>offline</strong>, ensuring fast, private, and
            reliable conversions—all directly in your browser without uploading files to a server.
          </p>
        )}
      </section>
    </main>
  )
}
