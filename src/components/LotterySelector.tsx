import { useState } from 'react'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormHelperText
} from '@mui/material'

interface LotterySelectorProps {
  lotteryType: string
  randomnessType: string
  onLotteryChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRandomnessChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onGenerate: () => void
}

const LotterySelector = ({
  lotteryType,
  randomnessType,
  onLotteryChange,
  onRandomnessChange,
  onGenerate
}: LotterySelectorProps) => {
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState('')

  const handleLotteryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLotteryChange(event)
    // Clear error when user makes a selection
    if (error) {
      setError(false)
      setHelperText('')
    }
  }

  const handleGenerate = () => {
    if (!lotteryType) {
      setError(true)
      setHelperText('Please select a lottery type.')
      return
    }
    
    // Clear any previous error and call parent's generate function
    setError(false)
    setHelperText('')
    onGenerate()
  }

  return (
    <>
      <FormControl error={error}>
        <FormLabel id="lottery-group-label">Lottery</FormLabel>
        <RadioGroup
          aria-labelledby="lottery-group-label"
          name="lottery-group"
          value={lotteryType}
          onChange={handleLotteryChange}
        >
          <FormControlLabel value="powerball" control={<Radio />} label="Powerball" />
          <FormControlLabel value="megamillions" control={<Radio />} label="MegaMillions" />
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel id="randomness-group-label">Randomness</FormLabel>
        <RadioGroup
          aria-labelledby="randomness-group-label"
          name="randomness-group"
          value={randomnessType}
          onChange={onRandomnessChange}
        >
          <FormControlLabel value="nash" control={<Radio />} label="Mixed Nash" />
          <FormControlLabel value="random" control={<Radio />} label="Fully Random" />
        </RadioGroup>
      </FormControl>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleGenerate}
        sx={{ mt: 2 }}
        size="large"
      >
        Generate
      </Button>
    </>
  )
}

export default LotterySelector
