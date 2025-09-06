import {
  Table,
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow
} from '@mui/material'
import { calculateExpectedValue } from '../utils/lotteryInfo'
import { useEffect, useState } from 'react';

const Infoheader = () => {
  const TAX_RATE = 0.35; // Federal rate only https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2025

  // TODO: Pull these values from an API
  const [powerballJackpot, setPowerballJackpot] = useState(1800);
  const [powerballJackpotCash, setPowerballJackpotCash] = useState(826);
  const [powerballJackpotTakeHome, setPowerballJackpotTakeHome] = useState(powerballJackpotCash * (1 - TAX_RATE));
  const [megamillionsJackpot, setMegamillionsJackpot] = useState(336);
  const [megamillionsJackpotCash, setMegamillionsJackpotCash] = useState(151);
  const [megamillionsJackpotTakeHome, setMegamillionsJackpotTakeHome] = useState(megamillionsJackpotCash * (1 - TAX_RATE));

  const [powerballExpectedValue, setPowerballExpectedValue] = useState(0);
  const [powerballPowerplayExpectedValue, setPowerballPowerplayExpectedValue] = useState(0);
  const [megamillionsExpectedValue, setMegamillionsExpectedValue] = useState(0);
  useEffect(() => {
    setPowerballExpectedValue(calculateExpectedValue('powerball', powerballJackpotTakeHome, false));
    setPowerballPowerplayExpectedValue(calculateExpectedValue('powerball', powerballJackpotTakeHome, true));
    // MegaMillions Multiplier is free/always active
    setMegamillionsExpectedValue(calculateExpectedValue('megamillions', megamillionsJackpotTakeHome, true));
  }, [powerballJackpotTakeHome, megamillionsJackpotTakeHome]);

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
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Powerball</TableCell>
              <TableCell align="center">{'$ ' + powerballJackpot.toLocaleString() + ' M'}</TableCell>
              <TableCell align="center">{'$ ' + (powerballJackpotTakeHome).toLocaleString() + ' M'}</TableCell>
              <TableCell align="center" sx={{ color: powerballExpectedValue >= 0 ? 'green' : 'red' }}>
                {'$ ' + powerballExpectedValue.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Powerball + Power Play</TableCell>
              <TableCell align="center">{'$ ' + powerballJackpot.toLocaleString() + ' M'}</TableCell>
              <TableCell align="center">{'$ ' + (powerballJackpotTakeHome).toLocaleString() + ' M'}</TableCell>
              <TableCell align="center" sx={{ color: powerballPowerplayExpectedValue >= 0 ? 'green' : 'red' }}>
                {'$ ' + powerballPowerplayExpectedValue.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>MegaMillions</TableCell>
              <TableCell align="center">{'$ ' + megamillionsJackpot.toLocaleString() + ' M'}</TableCell>
              <TableCell align="center">{'$ ' + megamillionsJackpotTakeHome.toLocaleString() + ' M' }</TableCell>
              <TableCell align="center" sx={{ color: megamillionsExpectedValue >= 0 ? 'green' : 'red' }}>
                {'$ ' + megamillionsExpectedValue.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Infoheader
