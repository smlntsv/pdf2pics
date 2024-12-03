if (!Promise.withResolvers) {
  Promise.withResolvers = function <T>(): {
    promise: Promise<T>
    resolve: (value: T | PromiseLike<T>) => void
    reject: (reason?: unknown) => void
  } {
    let resolve: (value: T | PromiseLike<T>) => void
    let reject: (reason?: unknown) => void

    const promise = new Promise<T>((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })

    // Return the promise along with resolve and reject functions
    return { promise, resolve: resolve!, reject: reject! }
  }
}
