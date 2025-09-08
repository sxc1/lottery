import { Typography } from "@mui/material";

export default function LotteryTicketGeneratorInfo() {
    return (
        <>
            <Typography variant="h5" gutterBottom>
              Lottery Selection
            </Typography>
            <Typography paragraph>
              Initial lottery selection is automatically set to the lottery with the highest expected value (EV) based on the jackpot values.
            </Typography>
            <Typography variant="h5" gutterBottom>
              Randomness Selection
            </Typography>
            <Typography variant="h6" gutterBottom>
              Mixed Nash
            </Typography>
            <Typography paragraph>
              For users who believe that the archaic lottery-drawing methods lead to a deviation from true randomness, we offer a mixed-strategy Nash equilibrium selection. 
              This selection semi-randomly generates tickets, weighted accordingly with historical data.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Fully Random
            </Typography>
            <Typography paragraph>
              This selection fully randomly generates tickets, without any weighting.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Remember to play responsibly. This tool is for informational purposes only.
            </Typography>
        </>
    )
}