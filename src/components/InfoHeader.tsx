import { useEffect, useState } from 'react';
import EditableTable from './EditableTable';
import { getLotteryPayout } from '../utils/lotteryPayoutEstimator';
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
    setPowerballPayout(getLotteryPayout('powerball', false));
    setPowerballPowerplayPayout(getLotteryPayout('powerball', true));
    // MegaMillions multiplier is free/always active
    setMegamillionsPayout(getLotteryPayout('megamillions', true));
  }, []);

  return (
    <>
      <EditableTable
        header={['Name', 'Jackpot', 'Jackpot, Lump Sum After Taxes', 'Expected Value']}
        rows={[powerballPayout, powerballPowerplayPayout, megamillionsPayout]}
      />
    </>
  )
}

export default Infoheader
