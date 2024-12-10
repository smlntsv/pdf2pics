import type { PDFTaskDataWithId, PDFWorkerResponseDataWithId } from '@/lib/pdf_worker_pool'
import { PDFWorkerRenderer } from '@/lib/worker/pdf_worker_renderer'

declare const self: DedicatedWorkerGlobalScope

const pdfWorkerRenderer = new PDFWorkerRenderer()

self.onmessage = async function ({ data }: MessageEvent<PDFTaskDataWithId>) {
  switch (data.type) {
    case 'loadDocument': {
      try {
        await pdfWorkerRenderer.loadDocument(data.documentBuffer)

        self.postMessage({
          id: data.id,
          type: 'documentLoaded',
          pageCount: pdfWorkerRenderer.pageCount,
          workerName: self.name,
        } as PDFWorkerResponseDataWithId)
      } catch (e) {
        self.postMessage({
          id: data.id,
          type: 'error',
          errorMessage: (e as Error).message,
          workerName: self.name,
        } as PDFWorkerResponseDataWithId)
      }
      break
    }
    case 'renderPage': {
      try {
        const { arrayBuffer, width, height } = await pdfWorkerRenderer.renderPage(
          data.pageNumber,
          data.scale,
          data.format,
          data.quality
        )
        self.postMessage(
          {
            id: data.id,
            type: 'pageRendered',
            pageNumber: data.pageNumber,
            pageImageArrayBuffer: arrayBuffer,
            width,
            height,
            format: data.format,
            quality: data.quality,
            workerName: self.name,
          } as PDFWorkerResponseDataWithId,
          [arrayBuffer] // transfer
        )
      } catch (e) {
        self.postMessage({
          id: data.id,
          type: 'error',
          errorMessage: (e as Error).message,
          workerName: self.name,
        } as PDFWorkerResponseDataWithId)
      }
      break
    }
    case 'getPageSize': {
      try {
        const { width, height } = await pdfWorkerRenderer.getPageSize(data.pageNumber, data.scale)
        self.postMessage({
          id: data.id,
          type: 'pageSizeRetrieved',
          pageNumber: data.pageNumber,
          width,
          height,
          workerName: self.name,
        } as PDFWorkerResponseDataWithId)
      } catch (e) {
        self.postMessage({
          id: data.id,
          type: 'error',
          errorMessage: (e as Error).message,
          workerName: self.name,
        } as PDFWorkerResponseDataWithId)
      }
      break
    }
    default: {
      self.postMessage({
        id: -1,
        type: 'error',
        errorMessage: 'Unknown task type.',
        workerName: self.name,
      } as PDFWorkerResponseDataWithId)
    }
  }
}
