import { calculateExpectedValue } from './lotteryInfo';

// Federal rate only https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2025
const TAX_RATE = 0.35;
const JACKPOT_CASH_RATIO = 0.45; // Estimated from historical data

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

export function getLotteryPayout(lotteryType: 'powerball' | 'megamillions', multiplierActive: boolean, customJackpot?: number): LotteryPayout {
    if (lotteryType === 'powerball') {
        const jackpot = customJackpot ?? PB_JACKPOT;
        const jackpotCash = customJackpot ? customJackpot * JACKPOT_CASH_RATIO : PB_JACKPOT_CASH;
        const jackpotTakeHome = jackpotCash * (1 - TAX_RATE);
        return {
            name: 'Powerball' + (multiplierActive ? ' + Power Play' : ''),
            jackpot: jackpot,
            jackpotCash: jackpotCash,
            jackpotTakeHome: jackpotTakeHome,
            expectedValue: calculateExpectedValue('powerball', jackpotTakeHome, multiplierActive),
        };
    } else if (lotteryType === 'megamillions') {
        const jackpot = customJackpot ?? MM_JACKPOT;
        const jackpotCash = customJackpot ? customJackpot * JACKPOT_CASH_RATIO : MM_JACKPOT_CASH;
        const jackpotTakeHome = jackpotCash * (1 - TAX_RATE);
        return {
            name: 'MegaMillions',
            jackpot: jackpot,
            jackpotCash: jackpotCash,
            jackpotTakeHome: jackpotTakeHome,
            expectedValue: calculateExpectedValue('megamillions', jackpotTakeHome, true),
        };
    } else {
        throw new Error('Invalid lottery type');
    }
}
