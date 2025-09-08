import { useState } from 'react'
import { AppBar as MuiAppBar, IconButton, Toolbar, Typography } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline'
import { useTheme } from '../../contexts/ThemeContext'
import InfoModal from './InfoModal'

export default function AppBar() {
    const { themeMode, toggleTheme } = useTheme()
    const [infoModalOpen, setInfoModalOpen] = useState(false)

    const handleInfoClick = () => {
        setInfoModalOpen(true)
    }

    const handleInfoModalClose = () => {
        setInfoModalOpen(false)
    }

    return (
      <>
        <MuiAppBar position="static" sx={{ mb: 4 }} enableColorOnDark>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Lottery Calculator by sxc1
            </Typography>
            <IconButton 
              color="inherit"
              onClick={handleInfoClick}
              aria-label="Info"
            >
              <InfoOutlineIcon />
            </IconButton>
            <IconButton
                size="large"
                aria-label={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
                edge="end"
                color="inherit"
                onClick={toggleTheme}
            >
                {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </MuiAppBar>
        
        <InfoModal open={infoModalOpen} onClose={handleInfoModalClose} />
      </>
    )
}