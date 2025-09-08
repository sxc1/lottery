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
                Live Data
            </Typography>
            <Typography paragraph>
                The lottery jackpot values are pulled live from the official <Link href="https://www.powerball.com/">Powerball</Link> and <Link href="https://www.megamillions.com/">Mega Millions</Link> data.
                Two values are pulled for each lottery: the advertised jackpot value and the lump sum cash value.
                <br />
                <br />
                Since the advertised jackpot is paid over 30 years, our EV (expected value)
                calculations are based on the lump sum cash value, post-tax:
                <pre>Jackpot (Take-Home) = Jackpot (Lump Sum Cash) * (1 - Tax Rate)</pre>
                With an expected federal tax rate of 35%, we have:
                <pre>Jackpot (Take-Home) = 0.65 * Jackpot (Lump Sum Cash)</pre>
            </Typography>
            <Typography variant="h6" gutterBottom>
                User Input Jackpot Values
            </Typography>
            <Typography paragraph>
                To use your own (advertised) jackpot values, you can input them into the table by clicking on the relevant cell and entering the value.
                <br />
                <br />
                The take-home jackpot and EV values will be updated automatically. The lump sum cash value is estimated based on historical data - for both Powerball and Mega Millions,
                it's approximately 45% of the advertised jackpot, which gives us:
                <br />
                <br />
                <pre>Jackpot (Take-Home) = Jackpot (Advertised) * Lump Sum Cash Ratio * (1 - Tax Rate)</pre>
                <pre> = Jackpot (Advertised) * 0.45 * (1 - 0.35)</pre>
                <pre> = 0.2925 * Jackpot (Advertised)</pre>
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
