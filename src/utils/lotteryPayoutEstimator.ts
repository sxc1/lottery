import { calculateExpectedValue } from './lotteryInfo';

// Federal rate only https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2025
const TAX_RATE = 0.35;
const JACKPOT_CASH_RATIO = 0.45; // Estimated from historical data

interface LotteryPayout {
    name: string;
    jackpot: number;
    jackpotCash: number;
    jackpotTakeHome: number;
    expectedValue: number;
  }

interface LotteryFetchResult {
  jackpot: number;
  jackpotCash: number;
}

export function getLotteryDisplayname(lotteryType: 'powerball' | 'megamillions', multiplierActive: boolean): string {
  return lotteryType === 'powerball' ? 'Powerball' + (multiplierActive ? ' + Power Play' : '') : 'MegaMillions';
}

export function scrapePowerballJackpot(rawHtml: string): LotteryFetchResult {
  // Example HTML scraping implementation
  try {
    // Create a temporary DOM parser (in browser environment)
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');
    
    // Look for jackpot values using specific selectors from powerball.com
    const jackpotElement = doc.querySelector('.game-jackpot-number.text-xxxl');
    const cashElement = doc.querySelector('.game-jackpot-number.text-lg');
    
    // Extract text content
    const jackpotText = jackpotElement?.textContent?.trim() || '';
    const cashText = cashElement?.textContent?.trim() || '';
    
    // Parse jackpot amount (handle $ and Million)
    const jackpotMatch = jackpotText.match(/\$?([0-9,]+(?:\.[0-9]+)?)\s*Million/i);
    const cashMatch = cashText.match(/\$?([0-9,]+(?:\.[0-9]+)?)\s*Million/i);
    
    // Convert to numbers (multiply by 1 for millions)
    const jackpot = jackpotMatch ? parseFloat(jackpotMatch[1].replace(/,/g, '')) : 0;
    const jackpotCash = cashMatch ? parseFloat(cashMatch[1].replace(/,/g, '')) : 0;
    
    return { jackpot, jackpotCash };
  } catch (error) {
    console.error('Error scraping Powerball jackpot:', error);
    return { jackpot: 0, jackpotCash: 0 };
  }
}

export async function fetchPowerballJackpot(): Promise<LotteryFetchResult> {
  try {
    const response = await fetch("https://proxy.corsfix.com/?https://www.powerball.com/", {
      headers: {
        "x-corsfix-cache": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawHtml = await response.text();

    return scrapePowerballJackpot(rawHtml);
  } catch (error) {
    console.error('Error fetching Powerball jackpot:', error);
    return { jackpot: 0, jackpotCash: 0 };
  }
}

export async function fetchMegaMillionsJackpot(): Promise<LotteryFetchResult> {
  try {
    const response = await fetch("https://proxy.corsfix.com/?https://www.megamillions.com/cmspages/utilservice.asmx/GetLatestDrawData", {
      headers: {
        "x-corsfix-cache": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const jsonString = xmlDoc.documentElement?.textContent || '';
    
    if (!jsonString) {
      throw new Error('No JSON data found in XML response');
    }
    
    const data = JSON.parse(jsonString);
    const jackpotData = data.Jackpot;
    const jackpot = jackpotData.NextPrizePool / 1_000_000;
    const jackpotCash = jackpotData.NextCashValue / 1_000_000;
    
    return { jackpot, jackpotCash };
  } catch (error) {
    console.error('Error fetching MegaMillions jackpot:', error);
    return { jackpot: 0, jackpotCash: 0 };
  }
}

export async function getLotteryPayout(lotteryType: 'powerball' | 'megamillions', multiplierActive: boolean, customJackpot?: number): Promise<LotteryPayout> {
    if (customJackpot) {
        return calculateLotteryPayout(lotteryType, multiplierActive, customJackpot);
    } else {
        var payout = {jackpot: 0, jackpotCash: 0};

        if (lotteryType === 'powerball') {
            payout = await fetchPowerballJackpot();
        } else if (lotteryType === 'megamillions') {
            payout = await fetchMegaMillionsJackpot();
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