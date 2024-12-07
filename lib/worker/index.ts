import type { PDFTaskDataWithId, PDFWorkerResponseDataWithId } from '@/lib/pdf_worker_pool'
import { PDFWorkerRenderer } from '@/lib/worker/pdf_worker_renderer'

const workerSelf = self as DedicatedWorkerGlobalScope
const pdfWorkerRenderer = new PDFWorkerRenderer()

workerSelf.onmessage = async function ({ data }: MessageEvent<PDFTaskDataWithId>) {
  switch (data.type) {
    case 'loadDocument': {
      try {
        await pdfWorkerRenderer.loadDocument(data.documentBuffer)

        workerSelf.postMessage({
          id: data.id,
          type: 'documentLoaded',
          pageCount: pdfWorkerRenderer.pageCount,
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
        const { arrayBuffer, width, height } = await pdfWorkerRenderer.renderPage(
          data.pageNumber,
          data.scale
        )
        workerSelf.postMessage(
          {
            id: data.id,
            type: 'pageRendered',
            pageNumber: data.pageNumber,
            pageImageArrayBuffer: arrayBuffer,
            width,
            height,
            workerName: workerSelf.name,
          } as PDFWorkerResponseDataWithId,
          [arrayBuffer] // transfer
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
    case 'getPageSize': {
      try {
        const { width, height } = await pdfWorkerRenderer.getPageSize(data.pageNumber, data.scale)
        workerSelf.postMessage({
          id: data.id,
          type: 'pageSizeRetrieved',
          pageNumber: data.pageNumber,
          width,
          height,
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
