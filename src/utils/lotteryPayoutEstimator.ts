import { calculateExpectedValue } from './lotteryInfo';

// Federal rate only https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2025
const TAX_RATE = 0.35;

// TODO: Pull these values from an API
const PB_JACKPOT = 1800;
const PB_JACKPOT_CASH = 826;
const MM_JACKPOT = 336;
const MM_JACKPOT_CASH = 151;

interface LotteryPayout {
    name: string;
    jackpot: number;
    jackpotCash: number;
    jackpotTakeHome: number;
    expectedValue: number;
  }

export function getLotteryPayout(lotteryType: 'powerball' | 'megamillions', multiplierActive: boolean): LotteryPayout {
    if (lotteryType === 'powerball') {
        const jackpotTakeHome = PB_JACKPOT_CASH * (1 - TAX_RATE);
        return {
            name: 'Powerball' + (multiplierActive ? ' + Power Play' : ''),
            jackpot: PB_JACKPOT,
            jackpotCash: PB_JACKPOT_CASH,
            jackpotTakeHome: jackpotTakeHome,
            expectedValue: calculateExpectedValue('powerball', jackpotTakeHome, multiplierActive),
        };
    } else if (lotteryType === 'megamillions') {
        const jackpotTakeHome = MM_JACKPOT_CASH * (1 - TAX_RATE);
        return {
            name: 'MegaMillions',
            jackpot: MM_JACKPOT,
            jackpotCash: MM_JACKPOT_CASH,
            jackpotTakeHome: jackpotTakeHome,
            expectedValue: calculateExpectedValue('megamillions', jackpotTakeHome, true),
        };
    } else {
        throw new Error('Invalid lottery type');
    }
}
