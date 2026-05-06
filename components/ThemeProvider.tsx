'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, ...props }) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
