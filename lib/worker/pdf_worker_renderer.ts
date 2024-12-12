import { getDocument, PDFDocumentProxy, GlobalWorkerOptions } from 'pdfjs-dist'
import { OffscreenCanvasFactory } from '@/lib/worker/offscreen_canvas_factory'
import { ExportFormat } from '@/components/conversion_settings'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

class PDFWorkerRenderer {
  #documentProxy: PDFDocumentProxy | null
  #canvas: OffscreenCanvas | null
  #canvasContext: OffscreenCanvasRenderingContext2D | null

  constructor() {
    this.#documentProxy = null
    this.#canvas = null
    this.#canvasContext = null
  }

  get pageCount(): number {
    if (this.#documentProxy == null) {
      throw new Error('The document is not initialized.')
    }

    return this.#documentProxy.numPages
  }

  async loadDocument(documentData: SharedArrayBuffer): Promise<void> {
    const data = new Uint8Array(documentData)

    const loadingTask = getDocument({
      data,
      CanvasFactory: OffscreenCanvasFactory,
      disableRange: true,
      disableStream: true,
      disableAutoFetch: true,
      verbosity: 0, // Hide unnecessary messages
    })

    this.#documentProxy = await loadingTask.promise
  }

  /**
   * Render a specific page of a PDF document to an OffscreenCanvas and returns the rendered page as an ArrayBuffer.
   * @param pageNumber - Page number to render (1-based index).
   * @param scale - Scaling factor for rendering.
   * @param format - Image format: PNG/JPEG.
   * @param quality - Rendered image quality (0 - 1)
   * @returns A promise resolving to the rendered page's ArrayBuffer
   */
  async renderPage(
    pageNumber: number,
    scale: number,
    format: ExportFormat,
    quality: number
  ): Promise<{
    arrayBuffer: ArrayBuffer
    width: number
    height: number
  }> {
    // Validate input
    if (!this.#documentProxy) {
      throw new Error('The documentProxy is not ready.')
    }
    if (pageNumber <= 0 || pageNumber > this.#documentProxy.numPages) {
      throw new Error('Page number is out of range.')
    }
    if (scale <= 0) {
      throw new Error('Scale factor must be positive.')
    }

    const pageProxy = await this.#documentProxy.getPage(pageNumber)

    // Reuse or initialize canvas and context
    if (!this.#canvas) {
      this.#canvas = new OffscreenCanvas(0, 0)
      this.#canvasContext = this.#canvas.getContext('2d')
    }
    if (!this.#canvasContext) {
      throw new Error('Failed to get canvas context.')
    }

    // Set canvas size to match the viewport dimensions
    const viewport = pageProxy.getViewport({ scale })
    this.#canvas.width = viewport.width
    this.#canvas.height = viewport.height

    // Render the page onto the canvas
    await pageProxy.render({
      // @ts-expect-error PDFJS doesn't know about OffscreenCanvas
      canvasContext: this.#canvasContext,
      viewport,
      intent: 'print',
    }).promise

    // Convert canvas content to ArrayBuffer
    const arrayBuffer = await (
      await this.#canvas.convertToBlob({
        type: format,
        quality,
      })
    ).arrayBuffer()

    return {
      arrayBuffer,
      width: viewport.width,
      height: viewport.height,
    }
  }

  async getPageSize(
    pageNumber: number,
    scale: number = 1.0
  ): Promise<{
    width: number
    height: number
  }> {
    // Validate input
    if (!this.#documentProxy) {
      throw new Error('The documentProxy is not ready.')
    }
    if (pageNumber <= 0 || pageNumber > this.#documentProxy.numPages) {
      throw new Error('Page number is out of range.')
    }

    const pageProxy = await this.#documentProxy.getPage(pageNumber)
    const viewport = pageProxy.getViewport({ scale })

    return {
      height: viewport.height,
      width: viewport.width,
    }
  }
}

export { PDFWorkerRenderer }
