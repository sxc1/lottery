import { AppBar as MuiAppBar, IconButton, Toolbar, Typography } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function AppBar() {
    return (
      <MuiAppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Lottery App
        </Typography>
        <IconButton
            size="large"
            aria-label="display more actions"
            edge="end"
            color="inherit"
        >
            <DarkModeIcon />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
    )
}