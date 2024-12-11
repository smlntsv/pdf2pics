import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PDFImageData, usePdfStore } from '@/stores/usePdfStore'
import { PDFWorkerPool, PDFWorkerResponseData } from '@/lib/pdf_worker_pool'
import { EXPORT_QUALITY } from '@/lib/constants'
import JSZip from 'jszip'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateScaleFromMaxResolution(
  pageWidth: number,
  pageHeight: number,
  maxWidth: number,
  maxHeight: number
): number {
  const isPortrait = pageHeight > pageWidth

  if (isPortrait) {
    ;[pageWidth, pageHeight] = [pageHeight, pageWidth]
  }

  const scaleX = maxWidth / pageWidth
  const scaleY = maxHeight / pageHeight
  let scale = Math.min(scaleX, scaleY)

  if (scale <= 0) {
    console.error(
      `Failed to calculate target scale for page with width: ${pageWidth} and height: ${pageHeight}.`
    )
    scale = 1
  }

  return scale
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url) // Clean up the object URL
}

export function renderPage(pageNumber: number, scale: number): Promise<PDFImageData> {
  return new Promise(async (resolve, reject) => {
    const pdfWorkerPool: PDFWorkerPool | null = usePdfStore.getState().pdfWorkerPool
    if (!pdfWorkerPool) {
      reject('PDFWorkerPool not ready')
      return
    }

    const responseData = await pdfWorkerPool.renderPage(pageNumber, scale)
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
  })
}

export async function exportSelectedPages(): Promise<void> {
  const { pdfWorkerPool, selectedFileName, selectedPages, exportResolution, exportFormat } =
    usePdfStore.getState()

  // Get information about page sizes
  if (!pdfWorkerPool) {
    throw new Error('The document is not ready.')
  }

  const pageNumbers = [...selectedPages].sort((a, b) => a - b)

  // Retrieve sizes of selected pages with scale =
  const pageSizePromises: Promise<PDFWorkerResponseData>[] = []

  for (const pageNumber of pageNumbers) {
    pageSizePromises.push(pdfWorkerPool.getPageSize(pageNumber, 1))
  }

  const pageSizesResponses = await Promise.all(pageSizePromises)

  // TODO: refactor
  const pageSizes: {
    width: number
    height: number
    pageNumber: number
  }[] = pageSizesResponses.map((response: PDFWorkerResponseData) => {
    if (response.type === 'pageSizeRetrieved') {
      return {
        pageNumber: response.pageNumber,
        width: response.width,
        height: response.height,
      }
    } else {
      return {
        pageNumber: 0,
        width: 0,
        height: 0,
      }
    }
  })

  // Generate final scales and render pages
  const pagesRenderingPromises: Promise<PDFWorkerResponseData>[] = []
  const [exportWidth, exportHeight] = exportResolution.split('x').map((size) => parseInt(size, 10))

  for (const { width, height, pageNumber } of pageSizes) {
    const targetScale = calculateScaleFromMaxResolution(width, height, exportWidth, exportHeight)
    pagesRenderingPromises.push(
      pdfWorkerPool.renderPage(pageNumber, targetScale, exportFormat, EXPORT_QUALITY)
    )
  }
  const pageRenderingResponses: PDFWorkerResponseData[] = await Promise.all(pagesRenderingPromises)

  // Export as image if only one page is selected
  if (pageRenderingResponses.length === 1) {
    if (pageRenderingResponses[0].type === 'pageRendered') {
      const pageNumber = pageRenderingResponses[0].pageNumber
      const arrayBuffer = pageRenderingResponses[0].pageImageArrayBuffer
      const blob = new Blob([arrayBuffer])

      const fileName = `${selectedFileName}_page_${pageNumber}.${exportFormat.split('/')[1]}`
      downloadBlob(blob, fileName)
    }

    return
  }

  // Download generated blobs
  const jsZip = new JSZip()

  for (const response of pageRenderingResponses) {
    if (response.type === 'pageRendered') {
      const pageNumber = response.pageNumber
      const arrayBuffer = response.pageImageArrayBuffer
      // TODO: prepend document name
      const fileName = `page_${pageNumber}.${exportFormat.split('/')[1]}`
      jsZip.file(fileName, arrayBuffer)
    }
  }

  const archive = await jsZip.generateAsync({ type: 'blob' })
  downloadBlob(archive, 'pdf2.pics-pages.zip')
}
