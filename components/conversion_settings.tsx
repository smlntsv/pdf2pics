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

export type ExportResolution = '1920x1080' | '1280x720' | '800x600' //(typeof EXPORT_RESOLUTION_OPTIONS)[number]['value']

const EXPORT_RESOLUTION_OPTIONS: Option<ExportResolution>[] = [
  {
    label: '1920x1080 or 1080x1920',
    value: '1920x1080',
  },
  {
    label: '1280x720 or 720x1280',
    value: '1280x720',
  },
  {
    label: '800x600 or 600x800',
    value: '800x600',
  },
]

const ConversionSettings: FC = () => {
  const { exportResolution, setExportResolution, exportFormat, setExportFormat } = usePdfStore()

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
