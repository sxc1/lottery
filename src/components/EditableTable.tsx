import {
    Table,
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    TextField,
    InputAdornment
  } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react'
import type { KeyboardEvent } from 'react'
  
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
    onJackpotChange?: (rowIndex: number, newJackpot: number) => void;
}

export default function EditableTable({ header, rows, onJackpotChange }: EditableTableProps) {
  // Not my proudest work
  const theme = useTheme();
  const [greenColor, setGreenColor] = useState(theme.palette.success.main);
  const [redColor, setRedColor] = useState(theme.palette.error.main);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    setGreenColor(theme.palette.mode === 'light' ? theme.palette.success.dark : theme.palette.success.light);
    setRedColor(theme.palette.mode === 'light' ? theme.palette.error.dark : theme.palette.error.light);
  }, [theme.palette.mode]);

  const handleCellClick = (rowIndex: number, currentValue: number) => {
    setEditingIndex(rowIndex);
    setEditValue(currentValue.toString());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, rowIndex: number) => {
    if (event.key === 'Enter') {
      handleSubmitEdit(rowIndex);
    }
  };

  const handleSubmitEdit = (rowIndex: number) => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue)) {
      onJackpotChange?.(rowIndex, newValue);
    }
    setEditingIndex(null);
    setEditValue('');
  };

    return (
        <>
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {header.map((h, index) => (
                    <TableCell 
                      key={h} 
                      align="center" 
                      sx={{ 
                        fontWeight: 'bold',
                        display: index === 2 ? { xs: 'none', sm: 'table-cell' } : 'table-cell'
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((lottery, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{lottery.name}</TableCell>
                    {/* Editable cell*/}
                    <TableCell 
                      align="center" 
                      onClick={() => handleCellClick(rowIndex, lottery.jackpot)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {editingIndex === rowIndex ? (
                        <TextField
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex)}
                          onBlur={() => handleSubmitEdit(rowIndex)}
                          autoFocus
                          size="small"
                          variant="outlined"
                          type="number"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            endAdornment: <InputAdornment position="end">M</InputAdornment>,
                          }}
                          sx={{ 
                            width: '110px',
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                              'WebkitAppearance': 'none',
                              margin: 0,
                            }
                          }}
                        />
                      ) : (
                        lottery.jackpot > 0 ? '$ ' + lottery.jackpot.toLocaleString() + ' M' : <EditIcon fontSize="small"/>
                      )}
                    </TableCell>
                    {/* Cell hiddon on mobile/xs displays*/}
                    <TableCell 
                      align="center" 
                      sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                    >
                      {'$ ' + lottery.jackpotTakeHome.toFixed(0).toLocaleString() + ' M'}
                    </TableCell>
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