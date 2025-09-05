import { Typography } from '@mui/material'

interface ResultsDisplayProps {
  lotteryType: string
  randomnessType: string
}

const ResultsDisplay = ({ lotteryType, randomnessType }: ResultsDisplayProps) => {

  const getResultText = () => {
    if (!lotteryType || !randomnessType) {
      return 'Click Generate to see your selections'
    }

    return `Selected: ${lotteryType} with ${randomnessType}`
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Results
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
        {getResultText()}
      </Typography>
    </>
  )
}

export default ResultsDisplay
