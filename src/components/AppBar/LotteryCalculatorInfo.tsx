import { Divider, Link, Typography } from "@mui/material";

export default function LotteryCalculatorInfo() {
    return (
        <>
            <Typography variant="h5" gutterBottom>
                Jackpot Values
            </Typography>
            <Divider />
            <br />
            <Typography variant="h6" gutterBottom>
                Advertised Jackpot
            </Typography>
            <Typography paragraph>
                The lottery jackpot values are pulled live from the official <Link href="https://www.powerball.com/">Powerball</Link> and <Link href="https://www.megamillions.com/">Mega Millions</Link> data.
                You can also click on the cell to edit the jackpot value.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Jackpot - Lump Sum Cash
            </Typography>
            <Typography paragraph>
                The lump sum cash value initially populated from the live data. With a user input Jackpot, the lump sum cash value is extrapolated based on historical data - for both Powerball and Mega Millions,
                it's approximately 45% of the advertised jackpot, which gives us:
                <pre>Jackpot (Lump Sum Cash) = 0.45 * Jackpot (Advertised)</pre>
            </Typography>
            <Typography variant="h6" gutterBottom>
                Jackpot - Actual Take-Home
            </Typography>
            <Typography paragraph>
                Since the advertised jackpot is paid over 30 years, our EV (expected value)
                calculations are based on the lump sum cash value, post-tax. With anexpected federal tax rate of 35%, we have:
                <pre>Jackpot (Take-Home) = 0.65 * Jackpot (Lump Sum Cash)</pre>
            </Typography>
            <Typography variant="h5" gutterBottom>
            Expected Value (EV) Calculation
            </Typography>
            <Divider />
            <br />
            <Typography component="div">
                Explanation coming soon!
            </Typography>
        </>
    );
}
