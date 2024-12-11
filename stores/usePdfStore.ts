'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { PDFWorkerPool } from '@/lib/pdf_worker_pool'
import { ExportFormat, ExportResolution } from '@/components/conversion_settings'
import { FileWithPath } from 'react-dropzone'

// TODO: refactor?
export type PDFImageData = {
  objectURL: string
  width: number
  height: number
}

type PdfStoreState = {
  selectedFileName: string | null
  pdfWorkerPool: PDFWorkerPool | null
  pageCount: number
  selectedPages: Set<number>
  lastSelectedPages: number[]
  // Export settings
  exportResolution: ExportResolution
  exportFormat: ExportFormat
  // Rendering
  previewPageNumber: number
  previewImageData: PDFImageData | null
  highResScale: number
  lowResScale: number
}

type PdfStoreActions = {
  setSelectedFileName: (selectedFileName: string | null) => void
  initializePdfWorkerPool: (file: FileWithPath) => Promise<void>
  terminatePdfWorkerPool: () => void
  setPageCount: (newCount: number) => void
  setSelectedPages(newSelectedPages: Set<number>): void
  setLastSelectedPages: (newLastSelectedPages: number[]) => void
  setExportResolution(newExportResolution: ExportResolution): void
  setExportFormat(newExportFormat: ExportFormat): void
  // Rendering
  setPreviewPageNumber: (pageNumber: number) => void
  setPreviewImageData: (imageData: PDFImageData | null) => void
}

type PdfStore = PdfStoreState & PdfStoreActions

const usePdfStore = create<PdfStore>()(
  immer((set, get) => ({
    selectedFileName: null,
    setSelectedFileName: (selectedFileName: string | null) => {
      set((state) => {
        state.selectedFileName = selectedFileName
      })
    },
    pdfWorkerPool: null,
    initializePdfWorkerPool: async (file: FileWithPath) => {
      // Reset
      set((state) => {
        state.pageCount = 0
        state.selectedPages = new Set<number>()
        state.previewPageNumber = 0
        state.selectedFileName = null
      })

      // Convert to SharedArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const sharedArrayBuffer = new SharedArrayBuffer(arrayBuffer.byteLength)
      const sharedView = new Uint8Array(sharedArrayBuffer)
      sharedView.set(new Uint8Array(arrayBuffer))

      let pool = get().pdfWorkerPool
      if (!pool) pool = new PDFWorkerPool()
      const pageCounts = await pool.initializeDocument(sharedArrayBuffer)

      set((state) => {
        state.pageCount = pageCounts[0]
        state.selectedPages = new Set<number>()
        state.pdfWorkerPool = pool
        state.previewPageNumber = 0
        state.selectedFileName = file.name
      })
    },
    terminatePdfWorkerPool: () => {
      const pool = get().pdfWorkerPool
      if (pool) pool.terminate()
    },
    pageCount: 0,
    setPageCount: (newPageCount: number): void => {
      set((state) => {
        state.pageCount = newPageCount
      })
    },
    selectedPages: new Set<number>(),
    setSelectedPages: (newSelectedPages: Set<number>) => {
      set((state) => {
        state.selectedPages = newSelectedPages
      })
    },
    lastSelectedPages: [],
    setLastSelectedPages: (newLastSelectedPages: number[]) => {
      set((state) => {
        state.lastSelectedPages = newLastSelectedPages
      })
    },
    exportFormat: 'image/png',
    exportResolution: '2480x3508',
    setExportFormat: (newExportFormat: ExportFormat) => {
      set((state) => {
        state.exportFormat = newExportFormat
      })
    },
    setExportResolution: (newExportResolution: ExportResolution) => {
      set((state) => {
        state.exportResolution = newExportResolution
      })
    },
    // Rendering
    previewPageNumber: 0,
    setPreviewPageNumber: (pageNumber: number) => {
      set((state) => {
        state.previewPageNumber = pageNumber
      })
    },
    previewImageData: null,
    setPreviewImageData: (imageData: PDFImageData | null) => {
      set((state) => {
        state.previewImageData = imageData
      })
    },
    highResScale: typeof window !== 'undefined' ? window.devicePixelRatio : 2,
    lowResScale: 0.6,
  }))
)

export { usePdfStore }
