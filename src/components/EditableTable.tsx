import {
    Table,
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow
  } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
  
interface LotteryPayout {
    name: string;
    jackpot: number;
    jackpotCash: number;
    jackpotTakeHome: number;
    expectedValue: number;
  };

interface EditableTableProps {
    header: string[],
    rows: LotteryPayout[],
}

export default function EditableTable({ header, rows }: EditableTableProps) {
  // I apologize for pivoting away from divorcing the business logic from the "abstracted" code
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
                  {header.map((h) => <TableCell key={h} align="center" sx={{ fontWeight: 'bold' }}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((lottery, index) => (
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
    );
  }