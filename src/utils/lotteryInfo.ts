// Method 1: Static imports (recommended for known data at build time)
import megaMillionsNumbers from '../../config/megamillions/numbers.json';
import megaMillionsPayout from '../../config/megamillions/payout.json';
import megaMillionsMultipliers from '../../config/megamillions/multipliers.json';
import powerballNumbers from '../../config/powerball/numbers.json';
import powerballPayout from '../../config/powerball/payout.json';
import powerballMultipliers from '../../config/powerball/multipliers.json';

// Type definitions for better TypeScript support
export interface LotteryNumberRanges {
  five_draw: number;
  special_draw: number;
}

export interface PayoutValue {
  normal_draw: number;
  special_draw: number;
  payout: number;
}

export interface PayoutMultiplierChance {
  multiplier: number;
  probability_num: number;
  probability_denom: number;
}

// Exported data objects with type safety
export const lotteryData = {
  megamillions: {
    numbers: megaMillionsNumbers as LotteryNumberRanges,
    payouts: megaMillionsPayout as PayoutValue[],
    multipliers: megaMillionsMultipliers as PayoutMultiplierChance[]
  },
  powerball: {
    numbers: powerballNumbers as LotteryNumberRanges,
    payouts: powerballPayout as PayoutValue[],
    multipliers: powerballMultipliers as PayoutMultiplierChance[]
  }
};

// Helper functions to get specific data
export function getLotteryNumberRanges(lotteryType: 'megamillions' | 'powerball'): LotteryNumberRanges {
  return lotteryData[lotteryType].numbers;
}

export function getPayoutValues(lotteryType: 'megamillions' | 'powerball'): PayoutValue[] {
  return lotteryData[lotteryType].payouts;
}

export function getMultiplierChances(lotteryType: 'megamillions' | 'powerball'): PayoutMultiplierChance[] {
  return lotteryData[lotteryType].multipliers;
}

export function factorial(n: number): number {
  var result = 1;
  for (var i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function nChooseK(n: number, k: number): number {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

// normalMatches is 0-5, specialMatch is 0 or 1
export function calculateMatchChance(lotteryType: 'megamillions' | 'powerball', normalMatches: number, specialMatch: number) {
  const numberRanges = getLotteryNumberRanges(lotteryType);
  const normalBallRange = numberRanges.five_draw;
  const specialBallRange = numberRanges.special_draw;
  const normalMatchChance = nChooseK(5, normalMatches) * nChooseK(normalBallRange - 5, 5 - normalMatches) / nChooseK(normalBallRange, 5);
  const specialMatchChance = specialMatch ? (1 / specialBallRange) : 1;
  const probability = normalMatchChance * specialMatchChance;
  return probability;
}

export function calculateJackpotEv(lotteryType: 'megamillions' | 'powerball', jackpotValue: number): number {
  return jackpotValue * calculateMatchChance(lotteryType, 5, 1);
}

// TODO: It starts getting ugly here from coding fatigure, need to refactor
export function calculateDrawEv(lotteryType: 'megamillions' | 'powerball', multiplierValue: number, payoutValue: number, payoutChance: number): number {
    // Powerball Power Play doesn't apply to $1M prize beyond 2X https://www.powerball.com/powerball-prize-chart
    if (lotteryType === 'powerball' && payoutValue === 1000000) {
        return payoutValue * payoutChance * Math.min(multiplierValue, 2);
    } else {
        return payoutValue * payoutChance * multiplierValue;
    }
}

export function calculateExpectedMultiplier(lotteryType: 'megamillions' | 'powerball'): number {
    const multiplierChances = getMultiplierChances(lotteryType);
    const expectedMultiplier = multiplierChances.reduce((acc, curr) => acc + curr.multiplier * curr.probability_num / curr.probability_denom, 0);
    return expectedMultiplier;
}

export function calculateNonJackpotEv(lotteryType: 'megamillions' | 'powerball', multiplierActive: boolean): number {
  const multiplierValue = multiplierActive ? calculateExpectedMultiplier(lotteryType) : 1;
  const payoutTable = getPayoutValues(lotteryType);
  const payoutChances = payoutTable.map(entry => {
    return ({ payout: entry.payout, payoutChance: calculateMatchChance(lotteryType, entry.normal_draw, entry.special_draw) });
  });
  const totalEv = payoutChances.reduce((acc, curr) => acc + calculateDrawEv(lotteryType, multiplierValue, curr.payout, curr.payoutChance), 0);
  return totalEv;
}

// Example usage function
export function calculateExpectedValue(
  lotteryType: 'megamillions' | 'powerball',
  jackpotValueMillions: number,
  multiplierActive: boolean,
): number {
    const jackpotEv = calculateJackpotEv(lotteryType, jackpotValueMillions * 1_000_000);
    const nonJackpotEv = calculateNonJackpotEv(lotteryType, multiplierActive);
    var cost = 0;
    if (lotteryType === 'megamillions') {
        cost = 5;
    } else if (lotteryType === 'powerball') {
        if (multiplierActive) {
            cost = 3;
        } else {
            cost = 2
        }
    } else {
        throw new Error('Invalid lottery type');
    }
    console.log({lotteryType: lotteryType, jackpotEv: jackpotEv, nonJackpotEv: nonJackpotEv, cost: cost});
    return jackpotEv + nonJackpotEv - cost;
}
