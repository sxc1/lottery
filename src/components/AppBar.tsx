import { AppBar as MuiAppBar, IconButton, Toolbar, Typography } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useTheme } from '../contexts/ThemeContext'

export default function AppBar() {
    const { themeMode, toggleTheme } = useTheme()

    return (
      <MuiAppBar position="static" sx={{ mb: 4 }} enableColorOnDark>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Lottery Calculator by sxc1
        </Typography>
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
    )
}