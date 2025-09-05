import { Typography, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { 
  generateLotteryNumbers, 
  formatAllTickets
} from '../utils/lotteryGenerator'
import type { GeneratedTickets } from '../utils/lotteryGenerator'

interface ResultsDisplayProps {
  lotteryType: string
  randomnessType: string
  ticketCount: number
  generationTrigger: number
}

const ResultsDisplay = ({ lotteryType, randomnessType, ticketCount, generationTrigger }: ResultsDisplayProps) => {
  const [generatedTickets, setGeneratedTickets] = useState<GeneratedTickets | null>(null)

  // Generate tickets only when generationTrigger changes (i.e., when Generate button is clicked)
  useEffect(() => {
    if (generationTrigger > 0 && lotteryType && randomnessType) {
      try {
        const tickets = generateLotteryNumbers(lotteryType, randomnessType, ticketCount)
        setGeneratedTickets(tickets)
      } catch (err) {
        console.log(err instanceof Error ? err.message : 'Unknown error')
        setGeneratedTickets(null)
      }
    }
  }, [generationTrigger, lotteryType, randomnessType, ticketCount])

  const getResultContent = () => {
    if (!generatedTickets) {
      return (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          Click Generate to see your selections
        </Typography>
      )
    }

    try {
      // TODO: Implement stylized formatting
      const formattedTickets = formatAllTickets(generatedTickets)
      
      return (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {formattedTickets.map((ticket, index) => (
              <Typography 
                key={index}
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace',
                  textAlign: 'center'
                }}
              >
                #{index + 1}: {ticket}
              </Typography>
            ))}
          </Box>
        </Box>
      )
    } catch (err) {
      return (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>
          Error formatting tickets: {err instanceof Error ? err.message : 'Unknown error'}
        </Typography>
      )
    }
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Tickets
      </Typography>
      {getResultContent()}
    </>
  )
}

export default ResultsDisplay
