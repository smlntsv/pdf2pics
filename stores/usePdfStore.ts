'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { PDFWorkerPool } from '@/lib/pdf_worker_pool'
import { ExportFormat, ExportResolution } from '@/components/conversion_settings'

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
}

type PdfStoreActions = {
  setSelectedFileName: (selectedFileName: string | null) => void
  setPdfWorkerPool: (pdfWorkerPool: PDFWorkerPool) => void
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
  immer((set) => ({
    selectedFileName: null,
    setSelectedFileName: (selectedFileName: string | null) => {
      set((state) => {
        state.selectedFileName = selectedFileName
      })
    },
    pdfWorkerPool: null,
    setPdfWorkerPool: (newPdfWorkerPool: PDFWorkerPool): void => {
      set((state) => {
        state.pdfWorkerPool = newPdfWorkerPool
      })
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
  }))
)

export { usePdfStore }
