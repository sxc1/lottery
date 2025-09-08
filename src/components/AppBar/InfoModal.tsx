import React, { useState } from 'react'
import { 
  Modal, 
  Box, 
  Tabs, 
  Tab, 
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LotteryCalculatorInfo from './LotteryCalculatorInfo'
import LotteryTicketGeneratorInfo from './LotteryTicketGeneratorInfo'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`info-tabpanel-${index}`}
      aria-labelledby={`info-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `info-tab-${index}`,
    'aria-controls': `info-tabpanel-${index}`,
  }
}

interface InfoModalProps {
  open: boolean
  onClose: () => void
}

export default function InfoModal({ open, onClose }: InfoModalProps) {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    overflow: 'hidden',
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="info-modal-title"
      aria-describedby="info-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Tabs with Close Button */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: 1, 
          borderColor: 'divider' 
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="info tabs"
            variant="fullWidth"
            sx={{ flexGrow: 1 }}
          >
            <Tab label="Calculator" {...a11yProps(0)} />
            <Tab label="Ticket Generator" {...a11yProps(1)} />
          </Tabs>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ 
              color: 'text.secondary',
              mx: 1
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tab Content */}
        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <CustomTabPanel value={tabValue} index={0}>
            <LotteryCalculatorInfo />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={1}>
            <LotteryTicketGeneratorInfo />
          </CustomTabPanel>
        </Box>
      </Box>
    </Modal>
  )
}
