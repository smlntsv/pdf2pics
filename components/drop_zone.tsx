'use client'

import { FC, useCallback, useState } from 'react'
import { useDropzone, FileRejection, FileWithPath } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { FileInput, LoaderCircle } from 'lucide-react'
import { usePdfStore } from '@/stores/usePdfStore'

interface Props {
  className?: string
}

const DropZone: FC<Props> = ({ className }) => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const initializePdfWorkerPool = usePdfStore((state) => state.initializePdfWorkerPool)

  const onFileSelected = useCallback(
    async (file: FileWithPath) => {
      try {
        await initializePdfWorkerPool(file)
      } catch (err) {
        toast({
          title: 'Error',
          description: `Failed to load document: ${(err as Error).message}`,
          variant: 'destructive',
        })
      }
    },
    [initializePdfWorkerPool]
  )

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      fileRejections.forEach(({ file, errors }) => {
        toast({
          title: `File ${file.name} rejected`,
          description: errors[0]?.message,
          variant: 'warning',
        })
      })

      if (acceptedFiles.length) {
        setIsLoading(true)
        onFileSelected(acceptedFiles[0]).finally(() => setIsLoading(false))
      }
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500 MB
    multiple: false,
    disabled: isLoading,
  })

  return (
    <div
      className={cn('flex w-full relative', className)}
      {...getRootProps()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Loading Icon */}
      <div
        className={cn(
          'absolute w-full h-full rounded-lg backdrop-blur',
          'flex flex-col items-center justify-center text-slate-500 dark:text-slate-200',
          !isLoading && 'hidden'
        )}
      >
        <LoaderCircle className={' animate-spin text-blue-400 w-[32px] h-[32px]'} />
        <span>Opening...</span>
      </div>

      <label
        htmlFor="dropzone-file"
        className={cn(
          'flex flex-col items-center justify-center w-full h-40 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer',
          'dark:bg-slate-700 hover:bg-gray-100 dark:border-blue-400 dark:hover:border-blue-200 dark:hover:bg-slate-600',
          isDragActive && 'bg-gray-100 dark:border-gray-500 dark:bg-gray-600'
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <FileInput className={'text-blue-500 mb-2'} size={48} strokeWidth={1.2} />
          {isDragActive ? (
            <>
              <p className="mb-2 dark:text-gray-300">Drop file here</p>
            </>
          ) : (
            <>
              <p className="mb-2 dark:text-gray-300">Drag and drop or click to choose PDF file</p>
              <p className=" text-gray-500 dark:text-gray-400">
                You can choose at most one PDF file
              </p>
            </>
          )}
        </div>
        <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
      </label>
    </div>
  )
}

export { DropZone }
