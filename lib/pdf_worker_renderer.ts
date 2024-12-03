import { getDocument, PDFDocumentProxy, GlobalWorkerOptions } from 'pdfjs-dist'
import { OffscreenCanvasFactory } from '@/lib/offscreen_canvas_factory'

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
      throw new Error('Document is not initialized.')
    }

    return this.#documentProxy.numPages
  }

  async loadDocument(documentData: SharedArrayBuffer) {
    const data = new Uint8Array(documentData)

    const loadingTask = getDocument({
      data,
      CanvasFactory: OffscreenCanvasFactory,
      // disableRange: true,
      // disableStream: true,
      // disableAutoFetch: true,
      // disableFontFace: true,
    })

    this.#documentProxy = await loadingTask.promise
  }

  /**
   * Render a specific page of a PDF document to an OffscreenCanvas and returns the rendered page as an ArrayBuffer.
   * @param pageNumber - Page number to render (1-based index).
   * @param scale - Scaling factor for rendering.
   * @returns A promise resolving to the rendered page's ArrayBuffer
   */
  async renderPage(pageNumber: number, scale: number): Promise<ArrayBuffer> {
    // Validate input
    if (!this.#documentProxy) {
      throw new Error('DocumentProxy is not ready.')
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
    return (await this.#canvas.convertToBlob()).arrayBuffer()
  }
}

export { PDFWorkerRenderer }
