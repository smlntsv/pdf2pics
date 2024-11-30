import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

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
  pageCount: number
  selectedPages: Set<number>
  exportResolution: ExportResolution
  exportFormat: ExportFormat
  availableExportFormats: ExportFormat[]
  availableExportResolutionGroups: ExportResolutionGroup[]
}

type PdfStoreActions = {
  setPageCount(newPageCount: number): void
  setSelectedPages(newSelectedPages: Set<number>): void
  setExportResolution(newExportResolution: ExportResolution): void
  setExportFormat(newExportFormat: ExportFormat): void
}

type PdfStore = PdfStoreState & PdfStoreActions

const usePdfStore = create<PdfStore>()(
  immer((set) => ({
    pageCount: 0,
    setPageCount: (newPageCount) => {
      set((state) => {
        state.pageCount = newPageCount
      })
    },
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
