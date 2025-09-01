import './App.css'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Paper
} from '@mui/material'

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top App Bar */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Lottery App
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 3, 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: 400, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Typography variant="h5" gutterBottom>
                Container 1
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This is the first container
              </Typography>
            </Paper>
          </Box>
        </Box>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 3, 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch',
            mt: 3
          }}
        >
          
          <Box sx={{ flex: 1 }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: 400, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Typography variant="h5" gutterBottom>
                Container 2
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This is the second container
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: 400, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Typography variant="h5" gutterBottom>
                Container 3
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This is the third container
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default App
