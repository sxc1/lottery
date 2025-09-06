import './App.css'
import { useState } from 'react'
import { 
  Container, 
  Box, 
  Paper
} from '@mui/material'
import AppBar from './components/AppBar'
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
  
  // Generation trigger - incremented each time Generate is clicked
  const [generationTrigger, setGenerationTrigger] = useState(0)

  const handleLotteryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLotteryType(event.target.value)
  }

  const handleRandomnessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRandomnessType(event.target.value)
  }

  const handleGenerateClick = () => {
    setGeneratedLotteryType(lotteryType)
    setGeneratedRandomnessType(randomnessType)
    setGenerationTrigger(prev => prev + 1)
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top App Bar */}
      <AppBar />
      {/* Main Container */}
      <Container maxWidth="md">
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
                ticketCount={5} //TODO: Make this dynamic
                generationTrigger={generationTrigger}
              />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default App
