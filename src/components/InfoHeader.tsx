import {
  Table,
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react';
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

  
  const theme = useTheme();
  const [greenColor, setGreenColor] = useState(theme.palette.success.main);
  const [redColor, setRedColor] = useState(theme.palette.error.main);

  useEffect(() => {
    setGreenColor(theme.palette.mode === 'light' ? theme.palette.success.dark : theme.palette.success.light);
    setRedColor(theme.palette.mode === 'light' ? theme.palette.error.dark : theme.palette.error.light);
  }, [theme.palette.mode]);

  return (
    <>
      <TableContainer sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Jackpot</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Jackpot, Lump Sum After Taxes</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Expected Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[powerballPayout, powerballPowerplayPayout, megamillionsPayout].map((lottery, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: 'bold' }}>{lottery.name}</TableCell>
                <TableCell align="center">{'$ ' + lottery.jackpot.toLocaleString() + ' M'}</TableCell>
                <TableCell align="center">{'$ ' + (lottery.jackpotTakeHome).toLocaleString() + ' M'}</TableCell>
                <TableCell align="center" sx={{ color: lottery.expectedValue >= 0 ? greenColor : redColor }}>
                  {'$ ' + lottery.expectedValue.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Infoheader
