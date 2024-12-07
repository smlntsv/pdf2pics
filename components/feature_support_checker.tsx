'use client'

import { useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'

const FeatureSupportChecker = () => {
  const [unsupportedFeatures, setUnsupportedFeatures] = useState<string[]>([])

  // Check required features
  useEffect(() => {
    const unsupported: string[] = []

    if (typeof Worker === 'undefined') {
      unsupported.push('Web Workers are not supported')
    }

    if (typeof SharedArrayBuffer === 'undefined') {
      unsupported.push('SharedArrayBuffer is not supported')
    }

    setUnsupportedFeatures(unsupported)

    return () => {
      setUnsupportedFeatures([]) // Clear the state on component unmount
    }
  }, [])

  // Do not render if all features are supported
  if (unsupportedFeatures.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4 backdrop-brightness-75">
      <div className="flex flex-col p-6 rounded-lg max-w-lg shadow-lg text-gray-700 dark:text-gray-200 bg-white  dark:bg-gray-600">
        <h1 className="text-lg font-semibold">Feature Compatibility Issue</h1>
        <div className="mt-4">
          {unsupportedFeatures.map((feature, index) => (
            <div key={index} className="flex items-center px-3 py-2 bg-yellow-100 rounded-md mb-2">
              <TriangleAlert className="mr-2 text-yellow-600" />
              <span className="text-gray-800">{feature}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 0">
          Your browser does not support all the required features. Please update your browser or use
          a different one for the best experience.
        </p>
        <button
          onClick={() => setUnsupportedFeatures([])}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-md  hover:bg-gray-200 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Proceed at your own risk
        </button>
      </div>
    </div>
  )
}

export { FeatureSupportChecker }
