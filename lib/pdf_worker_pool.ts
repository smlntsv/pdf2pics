import { ExportFormat } from '@/components/conversion_settings'

export type PDFTaskData =
  | { type: 'loadDocument'; documentBuffer: SharedArrayBuffer }
  | {
      type: 'renderPage'
      pageNumber: number
      scale: number
      format: ExportFormat
      quality: number
    }
  | { type: 'getPageSize'; pageNumber: number; scale: number }

export type PDFTaskDataWithId = { id: number } & PDFTaskData

export type PDFWorkerResponseData =
  | { type: 'documentLoaded'; pageCount: number }
  | {
      type: 'pageRendered'
      pageNumber: number
      pageImageArrayBuffer: ArrayBuffer
      width: number
      height: number
      format: ExportFormat
      quality: number
    }
  | {
      type: 'pageSizeRetrieved'
      pageNumber: number
      width: number
      height: number
    }
  | { type: 'error'; errorMessage: string }

export type PDFWorkerResponseDataWithId = { id: number; workerName: string } & PDFWorkerResponseData

type WorkerReadyMessageType = {
  action: 'ready'
  data: null
  sourceName: 'worker'
  targetName: 'main'
}

function isReadyMessage(data: unknown): data is WorkerReadyMessageType {
  return (data as WorkerReadyMessageType).action === 'ready'
}

class PDFWorkerPool {
  #autoIncrement: number = 0
  readonly #poolSize: number
  #workers: Worker[] = []
  #taskQueue: PDFTaskDataWithId[] = []
  #taskPromises: Map<
    number,
    {
      resolve: (value: PDFWorkerResponseData) => void
      reject: (reason: Error) => void
    }
  > = new Map()
  #freeWorkers: Worker[] = []
  #workerReadiness: Map<Worker, boolean> = new Map()

  constructor(poolSize?: number) {
    const MAX_POOL_SIZE = 4

    if (!poolSize) {
      this.#poolSize = Math.min(MAX_POOL_SIZE, navigator.hardwareConcurrency || 1)
    } else {
      this.#poolSize = Math.min(MAX_POOL_SIZE, poolSize)
    }

    // Initialize the pool with workers
    for (let i = 0; i < this.#poolSize; i++) {
      const worker = new Worker(new URL('./worker', import.meta.url), {
        name: `Worker ${i + 1}`,
      })
      this.#workers.push(worker)
      this.#freeWorkers.push(worker)
      this.#workerReadiness.set(worker, false)

      // Listen for worker responses and handle task completion
      worker.onmessage = ({ data }: MessageEvent<PDFWorkerResponseDataWithId>) => {
        if (isReadyMessage(data)) return
        if (data.type === 'documentLoaded') return

        const taskId = data.id
        const taskPromises = this.#taskPromises.get(taskId)
        if (!taskPromises)
          throw new Error('Failed to get promise methods associated with current task')

        if (data.type !== 'error') {
          taskPromises.resolve(data)
        } else {
          taskPromises.reject(new Error(data.errorMessage))
        }

        // Mark worker as free and process the next task
        this.#taskPromises.delete(taskId)
        this.#freeWorkers.push(worker)
        this.#processNextTask()
      }
    }
  }

  async initializeDocument(documentBuffer: SharedArrayBuffer): Promise<number[]> {
    const promises = this.#workers.map(
      (worker: Worker) =>
        new Promise<number>((resolve) => {
          const listener = ({ data }: MessageEvent<PDFWorkerResponseDataWithId>) => {
            if (data.type === 'documentLoaded') {
              worker.removeEventListener('message', listener)
              resolve(data.pageCount)
            }
          }

          worker.addEventListener('message', listener)
          worker.postMessage({
            id: Number.MAX_SAFE_INTEGER,
            type: 'loadDocument',
            documentBuffer,
          } as PDFTaskDataWithId)
        })
    )

    return await Promise.all(promises)
  }

  /**
   * Render page
   * @param pageNumber
   * @param scale
   * @param format
   * @param quality
   */
  renderPage(
    pageNumber: number,
    scale: number = 1,
    format: ExportFormat = 'image/png',
    quality: number = 1
  ): Promise<PDFWorkerResponseData> {
    return new Promise((resolve, reject) => {
      const taskData: PDFTaskDataWithId = {
        id: this.#autoIncrement++ + 1,
        type: 'renderPage',
        pageNumber,
        scale,
        format,
        quality,
      }

      this.#taskPromises.set(taskData.id, { resolve, reject })
      this.#taskQueue.push(taskData)

      this.#processNextTask()
    })
  }

  /**
   * Get size of the page.
   * @param pageNumber
   * @param scale
   */
  async getPageSize(pageNumber: number, scale: number = 1): Promise<PDFWorkerResponseData> {
    return new Promise((resolve, reject) => {
      const taskData: PDFTaskDataWithId = {
        id: this.#autoIncrement++ + 1,
        type: 'getPageSize',
        pageNumber,
        scale,
      }

      this.#taskPromises.set(taskData.id, { resolve, reject })
      this.#taskQueue.push(taskData)

      this.#processNextTask()
    })
  }

  /**
   * Process next task if available
   * @private
   */
  #processNextTask(): void {
    if (this.#taskQueue.length > 0 && this.#freeWorkers.length > 0) {
      const task = this.#taskQueue.shift()!
      const worker = this.#freeWorkers.pop()!

      worker.postMessage(task)
    }
  }

  /**
   * Terminate and cleanup.
   */
  terminate(): void {
    this.#workers.forEach((worker: Worker) => worker.terminate())
    this.#workers.length = 0
    this.#freeWorkers.length = 0
    this.#taskQueue.length = 0
  }
}

export { PDFWorkerPool }
