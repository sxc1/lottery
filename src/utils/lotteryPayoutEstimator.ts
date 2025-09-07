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

export function getLotteryDisplayname(lotteryType: 'powerball' | 'megamillions', multiplierActive: boolean): string {
  return lotteryType === 'powerball' ? 'Powerball' + (multiplierActive ? ' + Power Play' : '') : 'MegaMillions';
}

export function scrapePowerballJackpot(): {jackpot: number, jackpotCash: number} {
    // TODO: Implement
    return {
        jackpot: PB_JACKPOT,
        jackpotCash: PB_JACKPOT_CASH
    }
}

export function scrapeMegaMillionsJackpot(): {jackpot: number, jackpotCash: number} {
    // TODO: Implement
    return {
        jackpot: MM_JACKPOT,
        jackpotCash: MM_JACKPOT_CASH
    }
}

export function getLotteryPayout(lotteryType: 'powerball' | 'megamillions', multiplierActive: boolean, customJackpot?: number): LotteryPayout {
    if (customJackpot) {
        return calculateLotteryPayout(lotteryType, multiplierActive, customJackpot);
    } else {
        var payout = {jackpot: 0, jackpotCash: 0};

        if (lotteryType === 'powerball') {
            payout = scrapePowerballJackpot();
        } else if (lotteryType === 'megamillions') {
            payout = scrapeMegaMillionsJackpot();
        } else {
            throw new Error('Invalid lottery type');
        }

        return calculateLotteryPayout(lotteryType, multiplierActive, payout.jackpot, payout.jackpotCash);
    }
}

export function calculateLotteryPayout(lotteryType: 'powerball' | 'megamillions', multiplierActive: boolean, jackpotValue: number, jackpotCashValue?: number): LotteryPayout {
  const name = getLotteryDisplayname(lotteryType, multiplierActive);
  const jackpotCash = jackpotCashValue ?? jackpotValue * JACKPOT_CASH_RATIO;
  const jackpotTakeHome = jackpotCash * (1 - TAX_RATE);
  const expectedValue = calculateExpectedValue(lotteryType, jackpotTakeHome, multiplierActive);
  return {
    name: name,
    jackpot: jackpotValue,
    jackpotCash: jackpotCash,
    jackpotTakeHome: jackpotTakeHome,
    expectedValue: expectedValue,
  };
}