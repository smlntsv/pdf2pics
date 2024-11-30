import { useCallback, useEffect, useRef } from 'react'
import { usePdfStore } from '@/stores/usePdfStore'
import { canvasToBlob } from '@/lib/pdf'
import { PDFDocumentProxy } from 'pdfjs-dist'

const PDFRenderer = () => {
  const {
    pdfDocument,
    renderQueue,
    removeFromRenderQueue,
    setPageThumbnail,
    isRendering,
    setIsRendering,
  } = usePdfStore()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null)
  const renderPage = useCallback(async (documentProxy: PDFDocumentProxy, pageNumber: number) => {
    if (!window.document) {
      throw new Error('DOM is not ready yet')
    }

    if (pageNumber < 1 || pageNumber > documentProxy.numPages) {
      throw new Error(`Page number is out of range: ${pageNumber}`)
    }

    const pageProxy = await documentProxy.getPage(pageNumber)
    if (!canvasRef.current) {
      canvasRef.current = window.document.createElement('canvas')
      canvasContextRef.current = canvasRef.current.getContext('2d')
    }

    if (!canvasContextRef.current) {
      throw new Error('Failed to get canvas context')
    }

    const viewport = pageProxy.getViewport({ scale: 0.5 })
    canvasRef.current.width = viewport.width
    canvasRef.current.height = viewport.height

    const renderTask = pageProxy.render({
      canvasContext: canvasContextRef.current,
      viewport,
    })

    // Wait until the page is rendered
    await renderTask.promise

    return await canvasToBlob(canvasRef.current)
  }, [])

  useEffect(() => {
    const processQueue = async () => {
      if (pdfDocument === null || renderQueue.length === 0 || isRendering) return
      const start = performance.now()
      try {
        setIsRendering(true)
        const pageNumber = renderQueue[0]
        const pageBlob = await renderPage(pdfDocument, pageNumber)
        const objectURL = URL.createObjectURL(pageBlob)

        setPageThumbnail(pageNumber, objectURL)
        removeFromRenderQueue(pageNumber)
        console.log(`Page ${pageNumber} render time is: ${performance.now() - start}`)
      } catch (err) {
        console.error(err)
      } finally {
        setIsRendering(false)
      }
    }

    if (renderQueue.length > 0) {
      processQueue().catch((e) => console.error(e))
    }
  }, [
    renderQueue,
    setPageThumbnail,
    removeFromRenderQueue,
    renderPage,
    pdfDocument,
    isRendering,
    setIsRendering,
  ])

  return null
}

export { PDFRenderer }
