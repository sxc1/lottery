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

const THEME_STORAGE_KEY = 'lottery-app-theme'

const getStoredTheme = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return (stored === 'light' || stored === 'dark') ? stored : 'dark'
  } catch {
    return 'dark'
  }
}

const setStoredTheme = (theme: ThemeMode): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    console.error('Error setting theme in localStorage')
  }
}

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
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredTheme)

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  })

  const toggleTheme = () => {
    setThemeMode(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      setStoredTheme(newTheme)
      return newTheme
    })
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
