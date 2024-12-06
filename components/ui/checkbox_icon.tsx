import { FC, SVGProps } from 'react'
import { cn } from '@/lib/utils'

interface Props extends SVGProps<SVGSVGElement> {
  isSelected?: boolean
}

const CheckboxIcon: FC<Props> = ({ isSelected, ...rest }) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn(isSelected ? 'text-blue-500' : 'text-blue-200')}
      {...rest}
    >
      <rect x="2" y="2" width="60" height="60" rx="30" stroke={'transparent'} strokeWidth="4" />
      {isSelected && (
        <path d="M15 30.5L28.24 45L52 19" stroke={'white'} strokeWidth="4" strokeLinecap="round" />
      )}
    </svg>
  )
}

export { CheckboxIcon }
