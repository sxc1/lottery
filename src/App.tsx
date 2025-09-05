import './App.css'
import { useState } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Paper
} from '@mui/material'
import Infoheader from './components/InfoHeader'
import LotterySelector from './components/LotterySelector'
import ResultsDisplay from './components/ResultsDisplay'

function App() {
  // Perpetually updated radio button values
  const [lotteryType, setLotteryType] = useState('')
  const [randomnessType, setRandomnessType] = useState('random')
  
  // Snapshot values captured when Generate is clicked
  const [generatedLotteryType, setGeneratedLotteryType] = useState('')
  const [generatedRandomnessType, setGeneratedRandomnessType] = useState('')

  const handleLotteryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLotteryType(event.target.value)
  }

  const handleRandomnessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRandomnessType(event.target.value)
  }

  const handleGenerateClick = () => {
    // Capture current values as snapshots
    setGeneratedLotteryType(lotteryType)
    setGeneratedRandomnessType(randomnessType)
  }
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
        {/* Top Container */}
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
              <Infoheader />
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
          {/* Bottom Left Container */}
          <Box sx={{ flex: 1 }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: 400, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start', 
                justifyContent: 'flex-start',
                gap: 3
              }}
            >
              <LotterySelector
                lotteryType={lotteryType}
                randomnessType={randomnessType}
                onLotteryChange={handleLotteryChange}
                onRandomnessChange={handleRandomnessChange}
                onGenerate={handleGenerateClick}
              />
            </Paper>
          </Box>
          
          {/* Bottom Right Container */}
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
              <ResultsDisplay 
                lotteryType={generatedLotteryType}
                randomnessType={generatedRandomnessType}
              />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default App
