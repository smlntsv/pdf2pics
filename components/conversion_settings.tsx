import { FC, useMemo } from 'react'
import { ExportFormat, ExportResolution, usePdfStore } from '@/stores/usePdfStore'
import { NativeSelect } from '@/components/ui/native_select'

const ConversionSettings: FC = () => {
  const {
    exportResolution,
    availableExportResolutionGroups,
    setExportResolution,
    exportFormat,
    availableExportFormats,
    setExportFormat,
  } = usePdfStore()

  const exportResolutionOptions = useMemo(
    () =>
      availableExportResolutionGroups.map(({ group, resolutions }) => ({
        label: group,
        options: resolutions.map((resolution) => ({
          value: resolution,
          label: resolution,
        })),
      })),
    [availableExportResolutionGroups]
  )

  const exportFormatOptions = useMemo(
    () =>
      availableExportFormats.map((format) => ({
        label: format.toUpperCase(),
        value: format,
      })),
    [availableExportFormats]
  )

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
            options={exportResolutionOptions}
            value={exportResolution}
            onChange={(e) => setExportResolution(e.target.value as ExportResolution)}
          />
        </div>

        {/* Format select */}
        <div className={'flex flex-col w-full'}>
          <span className={' text-gray-500 dark:text-gray-300'}>Format</span>
          {/* 'Select a format' */}
          <NativeSelect
            options={exportFormatOptions}
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
          />
        </div>
      </div>
    </fieldset>
  )
}

export { ConversionSettings }
