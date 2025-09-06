import { Typography, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import CircleNumber from './CircleNumber'
import { generateLotteryNumbers } from '../utils/lotteryGenerator'
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
        console.log(err instanceof Error ? err.message : 'ResultsDisplay: unknown error')
        setGeneratedTickets(null)
      }
    }
  }, [generationTrigger, lotteryType, randomnessType, ticketCount])

  // TODO: Refactor this goof
  const getResultContent = () => {
    if (!generatedTickets) {
      return (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          Click Generate to see your selections
        </Typography>
      )
    }

    try {
      let specialBallTextColor = '';
      let specialBallBackgroundColor = '';
      if (generatedTickets.lotteryType === 'powerball') {
        specialBallTextColor = "white";
        specialBallBackgroundColor = "red";
      } else if (generatedTickets.lotteryType === 'megamillions') {
        specialBallTextColor = "black";
        specialBallBackgroundColor = "yellow";
      }
      
      return (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            {generatedTickets.tickets.map((ticket, ticketIndex) => (
              <Box key={ticketIndex} sx={{ display: 'flex', gap: 1}}>
                {ticket.mainNumbers.map((num, numIndex) => (
                  <CircleNumber key={`main-${ticketIndex}-${numIndex}`} numberValue={num} textColor="black" backgroundColor="white" />
                ))}
                <CircleNumber key={`special-${ticketIndex}`} numberValue={ticket.specialNumber} textColor={specialBallTextColor} backgroundColor={specialBallBackgroundColor} />
              </Box>
            ))}
          </Box>
        </Box>
      )
    } catch (err) {
      console.log(err instanceof Error ? err.message : 'ResultsDisplay: unknown error')
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
