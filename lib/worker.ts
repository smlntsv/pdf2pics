import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist'
import type { PDFTaskDataWithId, PDFWorkerResponseDataWithId } from '@/lib/pdf_worker_pool'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const workerSelf = self as DedicatedWorkerGlobalScope
let documentProxy: PDFDocumentProxy | null = null

workerSelf.onmessage = async function ({ data }: MessageEvent<PDFTaskDataWithId>) {
  switch (data.type) {
    case 'loadDocument': {
      try {
        documentProxy = await loadDocument(data.documentBuffer)

        workerSelf.postMessage({
          id: data.id,
          type: 'documentLoaded',
          pageCount: documentProxy.numPages,
          workerName: workerSelf.name,
        } as PDFWorkerResponseDataWithId)
      } catch (e) {
        workerSelf.postMessage({
          id: data.id,
          type: 'error',
          errorMessage: (e as Error).message,
          workerName: workerSelf.name,
        } as PDFWorkerResponseDataWithId)
      }
      break
    }
    case 'renderPage': {
      try {
        const pageImageArrayBuffer = await renderPage(documentProxy, data.pageNumber, data.scale)
        workerSelf.postMessage(
          {
            id: data.id,
            type: 'pageRendered',
            pageNumber: data.pageNumber,
            pageImageArrayBuffer: pageImageArrayBuffer,
            workerName: workerSelf.name,
          } as PDFWorkerResponseDataWithId,
          [pageImageArrayBuffer] // transfer
        )
      } catch (e) {
        workerSelf.postMessage({
          id: data.id,
          type: 'error',
          errorMessage: (e as Error).message,
          workerName: workerSelf.name,
        } as PDFWorkerResponseDataWithId)
      }
      break
    }
    default: {
      workerSelf.postMessage({
        id: -1,
        type: 'error',
        errorMessage: 'Unknown task type.',
        workerName: workerSelf.name,
      } as PDFWorkerResponseDataWithId)
    }
  }
}

let canvas: OffscreenCanvas | null = null
let context: OffscreenCanvasRenderingContext2D | null = null

/**
 * Render a specific page of a PDF document to an OffscreenCanvas and returns the rendered page as an ArrayBuffer.
 * @param documentProxy - PDFDocumentProxy instance representing the PDF document.
 * @param pageNumber - Page number to render (1-based index).
 * @param scale - Scaling factor for rendering.
 * @returns A promise resolving to the rendered page's ArrayBuffer
 */
async function renderPage(
  documentProxy: PDFDocumentProxy | null,
  pageNumber: number,
  scale: number
): Promise<ArrayBuffer> {
  // Validate input
  if (!documentProxy) {
    throw new Error('DocumentProxy is not ready.')
  }
  if (pageNumber <= 0 || pageNumber > documentProxy.numPages) {
    throw new Error('Page number is out of range.')
  }
  if (scale <= 0) {
    throw new Error('Scale factor must be positive.')
  }

  const pageProxy = await documentProxy.getPage(pageNumber)

  // Reuse or initialize canvas and context
  if (!canvas) {
    canvas = new OffscreenCanvas(0, 0)
    context = canvas.getContext('2d')
  }
  if (!context) {
    throw new Error('Failed to get canvas context')
  }

  // Set canvas size to match the viewport dimensions
  const viewport = pageProxy.getViewport({ scale })
  canvas.width = viewport.width
  canvas.height = viewport.height

  // Render the page onto the canvas
  await pageProxy.render({
    // @ts-expect-error PDFJS doesn't know about OffscreenCanvas
    canvasContext: context,
    viewport,
    intent: 'print',
  }).promise

  // Convert canvas content to ArrayBuffer
  return (await canvas.convertToBlob()).arrayBuffer()
}

async function loadDocument(arrayBuffer: SharedArrayBuffer): Promise<PDFDocumentProxy> {
  const data = new Uint8Array(arrayBuffer)

  const loadingTask = getDocument({
    data,
    CanvasFactory: OffscreenCanvasFactory,
    // disableRange: true,
    // disableStream: true,
    // disableAutoFetch: true,
    // disableFontFace: true,
  })
  return loadingTask.promise
}

class OffscreenCanvasFactory {
  create(width: number, height: number) {
    const canvas = new OffscreenCanvas(width, height)
    return {
      canvas,
      context: canvas.getContext('2d')!,
    }
  }

  reset(
    canvasAndContext: { canvas: OffscreenCanvas; context: OffscreenCanvasRenderingContext2D },
    width: number,
    height: number
  ) {
    canvasAndContext.canvas.width = width
    canvasAndContext.canvas.height = height
  }

  destroy(canvasAndContext: {
    canvas: OffscreenCanvas
    context: OffscreenCanvasRenderingContext2D
  }) {
    // No explicit destruction needed for OffscreenCanvas
    canvasAndContext.canvas.width = 0
    canvasAndContext.canvas.height = 0
  }
}
