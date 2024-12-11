import { FC } from 'react'
import { usePdfStore } from '@/stores/usePdfStore'
import { NativeSelect } from '@/components/ui/native_select'

type Option<T> = {
  label: string
  value: T
}

export type ExportFormat = 'image/png' | 'image/jpeg'

const EXPORT_FORMAT_OPTIONS: Option<ExportFormat>[] = [
  {
    label: 'PNG',
    value: 'image/png',
  },
  {
    label: 'JPEG',
    value: 'image/jpeg',
  },
]

export type ExportResolution =
  | '2480x3508'
  | '3508x4961'
  | '1748x2480'
  | '7680x4320'
  | '3840x2160'
  | '2560x1440'
  | '2048x1080'
  | '1920x1080'
  | '1280x720'

const EXPORT_RESOLUTION_OPTIONS: Option<ExportResolution>[] = [
  {
    label: 'A4 at 300 DPI',
    value: '2480x3508',
  },
  {
    label: 'A3 at 300 DPI',
    value: '3508x4961',
  },
  {
    label: 'A5 at 300 DPI',
    value: '1748x2480',
  },
  {
    label: '8K Ultra HD',
    value: '7680x4320',
  },
  {
    label: '4K Ultra HD',
    value: '3840x2160',
  },
  {
    label: 'QHD (1440p)',
    value: '2560x1440',
  },
  {
    label: '2K',
    value: '2048x1080',
  },
  {
    label: 'Full HD (1080p)',
    value: '1920x1080',
  },
  {
    label: 'HD (720p)',
    value: '1280x720',
  },
]

const ConversionSettings: FC = () => {
  const exportResolution = usePdfStore((state) => state.exportResolution)
  const setExportResolution = usePdfStore((state) => state.setExportResolution)
  const exportFormat = usePdfStore((state) => state.exportFormat)
  const setExportFormat = usePdfStore((state) => state.setExportFormat)

  return (
    <fieldset
      className={'border border-gray-300 dark:border-gray-500 rounded-lg px-4 pt-2 pb-4 mt-4'}
    >
      <legend className={'px-2 text-gray-800 dark:text-gray-200'}>Setting</legend>
      <div className={'flex items-center justify-between gap-4'}>
        {/* Resolution select */}
        <div className={'flex flex-col w-full'}>
          <span className={' text-gray-500 dark:text-gray-300'}>Resolution</span>
          <NativeSelect
            options={EXPORT_RESOLUTION_OPTIONS}
            value={exportResolution}
            onChange={(e) => setExportResolution(e.target.value as ExportResolution)}
          />
        </div>

        {/* Format select */}
        <div className={'flex flex-col w-full'}>
          <span className={' text-gray-500 dark:text-gray-300'}>Format</span>
          {/* 'Select a format' */}
          <NativeSelect
            options={EXPORT_FORMAT_OPTIONS}
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
          />
        </div>
      </div>
    </fieldset>
  )
}

export { ConversionSettings }
