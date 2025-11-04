import { Link, Typography } from "@mui/material";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function LotteryExpectedValueInfo() {
    return (
        <>
            <Typography component="div" paragraph>
                The Expected Value (EV) of a lottery ticket represents the average amount of money you can expect to win (or lose) per ticket purchased.
            </Typography>

            <Typography component="div" sx={{ my: 2, textAlign: 'center' }}>
                <BlockMath math="EV = (\ \sum_{i=1}^{n} P(\text{prize}_i) \times \text{prize}_i\ ) - \text{ticket cost}" />
            </Typography>
            
            <Typography component="div" paragraph>
                Where:
            </Typography>
            <Typography component="div" sx={{ ml: 2 }}>
                • <InlineMath math="P(\text{prize}_i)" /> is the probability of winning prize <InlineMath math="i" />
                <br />
                • <InlineMath math="\text{prize}_i" /> is the monetary amount of prize <InlineMath math="i" />
                <br />
                • <InlineMath math="n" /> is the total number of prize tiers
            </Typography>
            
            <Typography component="div" paragraph sx={{ mt: 2 }}>
                A positive EV means the ticket is theoretically profitable on average, while a negative EV means you can expect to lose money over time.
            </Typography>
            
            <Typography component="div" paragraph sx={{ mt: 2 }}>
               Here is the prize breakdown for the <Link href="https://www.powerball.com/powerball-prize-chart">Powerball</Link> and <Link href="https://www.megamillions.com/How-to-Play">Mega Millions</Link> lotteries.
            </Typography>
        </>
    );
}
