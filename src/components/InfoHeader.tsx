import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import EditableTable from './EditableTable';
import { calculateLotteryPayout, getLotteryPayout } from '../utils/lotteryPayoutEstimator';
interface LotteryPayout {
  name: string;
  jackpot: number;
  jackpotCash: number;
  jackpotTakeHome: number;
  expectedValue: number;
};

interface InfoHeaderProps {
  onBestLotteryChange?: (bestLottery: 'powerball' | 'megamillions') => void;
}

const Infoheader = ({ onBestLotteryChange }: InfoHeaderProps) => {
  const DEFAULT_PAYOUT = {
    name: '',
    jackpot: 0,
    jackpotCash: 0,
    jackpotTakeHome: 0,
    expectedValue: 0,
  };

  const [powerballPayout, setPowerballPayout] = useState<LotteryPayout>(DEFAULT_PAYOUT);
  const [powerballPowerplayPayout, setPowerballPowerplayPayout] = useState<LotteryPayout>(DEFAULT_PAYOUT);
  const [megamillionsPayout, setMegamillionsPayout] = useState<LotteryPayout>(DEFAULT_PAYOUT);
  const [isLoading, setIsLoading] = useState(true);

  const determineBestLottery = (powerball: LotteryPayout, powerballPowerplay: LotteryPayout, megamillions: LotteryPayout): 'powerball' | 'megamillions' => {
    const bestPowerballExpectedValue = Math.max(powerball.expectedValue, powerballPowerplay.expectedValue);
    {/* Tie goes to MegaMillions since it has higher jackpot odds */}
    return bestPowerballExpectedValue > megamillions.expectedValue ? 'powerball' : 'megamillions';
  };

  // Effect to notify parent when best lottery changes
  useEffect(() => {
    if (!isLoading && onBestLotteryChange) {
      const bestLottery = determineBestLottery(powerballPayout, powerballPowerplayPayout, megamillionsPayout);
      onBestLotteryChange(bestLottery);
    }
  }, [powerballPayout.expectedValue, powerballPowerplayPayout.expectedValue, megamillionsPayout.expectedValue, isLoading, onBestLotteryChange]);

  useEffect(() => {
    const loadPayouts = async () => {
      try {
        const [powerball, powerballPowerplay, megamillions] = await Promise.all([
          // TODO: reduce powerball API calls from 2 to 1
          getLotteryPayout('powerball', false),
          getLotteryPayout('powerball', true),
          // MegaMillions multiplier is free/always active
          getLotteryPayout('megamillions', true)
        ]);
        
        setPowerballPayout(powerball);
        setPowerballPowerplayPayout(powerballPowerplay);
        setMegamillionsPayout(megamillions);
      } catch (error) {
        console.error('Error loading lottery payouts:', error);
        // Keep default values on error
      } finally {
        setIsLoading(false);
      }
    };

    loadPayouts();
  }, []);

  const handleJackpotChange = (rowIndex: number, newJackpot: number) => {
    if (rowIndex === 0) {
      setPowerballPayout(calculateLotteryPayout('powerball', false, newJackpot));
    } else if (rowIndex === 1) {
      setPowerballPowerplayPayout(calculateLotteryPayout('powerball', true, newJackpot));
    } else if (rowIndex === 2) {
      setMegamillionsPayout(calculateLotteryPayout('megamillions', true, newJackpot));
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="body2" color="text.secondary">
          Loading lottery information...
        </Typography>
      </Box>
    );
  } else {
    return (
      <EditableTable
        header={['', 'Jackpot', 'Jackpot (Take Home)', 'Expected Value']}
        rows={[powerballPayout, powerballPowerplayPayout, megamillionsPayout]}
        onJackpotChange={handleJackpotChange}
      />
    );
  }
}

export default Infoheader
