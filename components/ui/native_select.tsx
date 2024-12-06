import { cn } from '@/lib/utils'
import { FC, SelectHTMLAttributes } from 'react'

interface Option {
  value: string | number
  label: string
}

interface OptGroup {
  label: string
  options: Option[]
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: (Option | OptGroup)[]
}

const NativeSelect: FC<Props> = ({ options, className, ...rest }) => {
  return (
    <select
      className={cn(
        'border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        className
      )}
      {...rest}
    >
      {options.map((option, index) => {
        if ('options' in option) {
          return (
            <optgroup key={index} label={option.label}>
              {option.options.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </optgroup>
          )
        }

        const { value, label } = option as Option
        return (
          <option key={value} value={value}>
            {label}
          </option>
        )
      })}
    </select>
  )
}

export { NativeSelect }
