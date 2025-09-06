import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import App from './App.tsx'
import { CustomThemeProvider, useTheme } from './contexts/ThemeContext'

function AppWithTheme() {
  const { theme } = useTheme()
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <AppWithTheme />
    </CustomThemeProvider>
  </React.StrictMode>
)