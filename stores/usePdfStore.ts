'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { PDFDocumentProxy } from 'pdfjs-dist'

type ExportFormat = 'png' | 'jpeg'
const availableExportFormats: ExportFormat[] = ['png', 'jpeg']

type ExportResolution = '600x800' | '720x1280' | '1080x1920' | '800x600' | '1280x720' | '1920x1080'
type ExportResolutionGroup = {
  group: 'Portrait' | 'Landscape'
  resolutions: ExportResolution[]
}
const availableExportResolutionGroups: ExportResolutionGroup[] = [
  {
    group: 'Portrait',
    resolutions: ['600x800', '720x1280', '1080x1920'],
  },
  {
    group: 'Landscape',
    resolutions: ['800x600', '1280x720', '1920x1080'],
  },
]

type PdfStoreState = {
  isDocumentLoading: boolean
  document: PDFDocumentProxy | null
  pageCount: number
  selectedPages: Set<number>
  exportResolution: ExportResolution
  exportFormat: ExportFormat
  availableExportFormats: ExportFormat[]
  availableExportResolutionGroups: ExportResolutionGroup[]
}

type PdfStoreActions = {
  setIsDocumentLoading: (isLoading: boolean) => void
  setDocument(newDocument: PDFDocumentProxy | null): void
  setSelectedPages(newSelectedPages: Set<number>): void
  setExportResolution(newExportResolution: ExportResolution): void
  setExportFormat(newExportFormat: ExportFormat): void
}

type PdfStore = PdfStoreState & PdfStoreActions

const usePdfStore = create<PdfStore>()(
  immer((set) => ({
    isDocumentLoading: false,
    setIsDocumentLoading: (newIsLoading) => {
      set((state) => {
        state.isDocumentLoading = newIsLoading
      })
    },
    document: null,
    setDocument: (newDocument: PDFDocumentProxy | null) => {
      set((state) => {
        // @ts-expect-error Due to PDFDocumentProxy and WritableDraft<PDFDocumentProxy> incompatibility
        state.document = newDocument

        if (newDocument) {
          state.pageCount = newDocument.numPages
        } else {
          state.pageCount = 0
        }
        state.isDocumentLoading = false
      })
    },
    pageCount: 0,
    selectedPages: new Set<number>(),
    setSelectedPages: (newSelectedPages) => {
      set((state) => {
        state.selectedPages = newSelectedPages
      })
    },
    exportFormat: 'png',
    availableExportFormats,
    exportResolution: '1280x720',
    availableExportResolutionGroups,
    setExportFormat: (newExportFormat) => {
      set((state) => {
        state.exportFormat = newExportFormat
      })
    },
    setExportResolution: (newExportResolution) => {
      set((state) => {
        state.exportResolution = newExportResolution
      })
    },
  }))
)

export { usePdfStore }
