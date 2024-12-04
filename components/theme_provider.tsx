'use client'

import { FC } from 'react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export { ThemeProvider }
