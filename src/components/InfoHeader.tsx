import { useEffect, useState } from 'react';
import EditableTable from './EditableTable';
import { calculateLotteryPayout, getLotteryPayout } from '../utils/lotteryPayoutEstimator';
interface LotteryPayout {
  name: string;
  jackpot: number;
  jackpotCash: number;
  jackpotTakeHome: number;
  expectedValue: number;
};

const Infoheader = () => {
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

  return (
    <>
      <EditableTable
        header={['Name', 'Jackpot', 'Jackpot, Lump Sum After Taxes', 'Expected Value']}
        rows={[powerballPayout, powerballPowerplayPayout, megamillionsPayout]}
        onJackpotChange={handleJackpotChange}
      />
    </>
  )
}

export default Infoheader
