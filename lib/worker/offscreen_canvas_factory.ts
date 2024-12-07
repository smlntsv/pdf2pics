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

export { OffscreenCanvasFactory }
