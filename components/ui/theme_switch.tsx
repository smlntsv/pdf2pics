'use client'
import { FC } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  className?: string
}

const ThemeSwitch: FC<Props> = ({ className }) => {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>☀️ Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>🌙 Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>🌍 System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeSwitch }
