'use client'
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = '/static/js/pdf.worker.min.mjs'

async function readFileClient(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target) {
        reject(new Error('Failed to load file'))

        return
      }

      resolve(event.target.result as ArrayBuffer)
    }

    reader.readAsArrayBuffer(file)
  })
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) {
        return reject(new Error('Failed to load file'))
      }

      resolve(blob)
    }, 'image/png')
  })
}

function blobToImg(blob: Blob): HTMLImageElement {
  const img: HTMLImageElement = document.createElement('img')
  img.src = URL.createObjectURL(blob)

  return img
}

async function loadDocument(file: File): Promise<PDFDocumentProxy> {
  const arrayBuffer = await readFileClient(file)
  const loadingTask = getDocument({ data: arrayBuffer })
  return await loadingTask.promise
}

export { readFileClient, canvasToBlob, blobToImg, loadDocument }
