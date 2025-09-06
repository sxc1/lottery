import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { createTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  themeMode: ThemeMode
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  })

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value = {
    themeMode,
    theme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
