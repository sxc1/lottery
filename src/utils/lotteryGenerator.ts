import Papa from 'papaparse';
import megaMillionsNumbers from '../../config/megamillions/numbers.json';
import powerballNumbers from '../../config/powerball/numbers.json';
import megaMillionsNormalBallStats from '../../data/megamillions/normalball.csv?raw';
import megaMillionsSpecialBallStats from '../../data/megamillions/specialball.csv?raw';
import powerballNormalBallStats from '../../data/powerball/normalball.csv?raw';
import powerballSpecialBallStats from '../../data/powerball/specialball.csv?raw';
export interface LotteryConfig {
  fiveDraw: number;
  specialDraw: number;
}

export interface LotteryTicket {
  mainNumbers: number[];
  specialNumber: number;
}

export interface GeneratedTickets {
  tickets: LotteryTicket[];
  lotteryType: string;
  randomnessType: string;
  ticketCount: number;
}
export interface BallStats {
  number: number;
  timesDrawn: number;
  percentOfDrawings: string;
  lastDrawn: string;
}

export interface LotteryStats {
  normalBalls: BallStats[];
  specialBalls: BallStats[];
}

// TODO: Pull config from files
const LOTTERY_CONFIGS: Record<string, LotteryConfig> = {
  powerball: {
    fiveDraw: powerballNumbers.five_draw,
    specialDraw: powerballNumbers.special_draw
  },
  megamillions: {
    fiveDraw: megaMillionsNumbers.five_draw,
    specialDraw: megaMillionsNumbers.special_draw
  }
};


/**
 * Parses CSV string data into objects
 */
const parseCSVString = (csvText: string): any[] => {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transform: (value: string) => {
      // Try to convert to number if possible
      const numValue = Number(value);
      return !isNaN(numValue) && value.trim() !== '' ? numValue : value;
    }
  });
  
  if (result.errors.length > 0) {
    throw new Error(`CSV parsing errors: ${result.errors.map(e => e.message).join(', ')}`);
  }
  
  return result.data as any[];
};

/**
 * Mapping of CSV data by lottery type and ball type
 */
const CSV_DATA_MAP = {
  megamillions: {
    normalball: megaMillionsNormalBallStats,
    specialball: megaMillionsSpecialBallStats
  },
  powerball: {
    normalball: powerballNormalBallStats,
    specialball: powerballSpecialBallStats
  }
} as const;

/**
 * Generic function to read ball statistics from imported CSV data
 */
const readBallStats = (lotteryType: string, ballType: 'normalball' | 'specialball'): BallStats[] => {
  const csvText = CSV_DATA_MAP[lotteryType as keyof typeof CSV_DATA_MAP]?.[ballType];
  
  if (!csvText) {
    throw new Error(`No CSV data found for ${lotteryType} ${ballType}`);
  }
  
  const data = parseCSVString(csvText);
  
  return data.map((row: any) => ({
    number: Number(row.Number),
    timesDrawn: Number(row['Times drawn']),
    percentOfDrawings: row['Percent of drawings'],
    lastDrawn: row['Last drawn']
  }));
};

/**
 * Reads draw statistics for both normal and special balls
 */
export const readDrawStats = (lotteryType: string): LotteryStats => {
  try {
    const normalBalls = readBallStats(lotteryType, 'normalball');
    const specialBalls = readBallStats(lotteryType, 'specialball');
    
    return { normalBalls, specialBalls };
  } catch (error) {
    throw new Error(`Failed to read draw stats for ${lotteryType}: ${error}`);
  }
};

/**
 * Generates a random integer between min and max (inclusive)
 */
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a set of unique random numbers within a range
 */
const generateUniqueNumbers = (count: number, min: number, max: number): number[] => {
  const numbers: Set<number> = new Set();
  
  while (numbers.size < count) {
    numbers.add(getRandomInt(min, max));
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
};

const getWeightedRandomInt = (ballStats: BallStats[]) => {
  const totalWeight = ballStats.reduce((acc, curr) => acc + curr.timesDrawn, 0);
  const randomThreshold = Math.random() * totalWeight;
  let cumulativeWeight = 0;
  for (const ballStat of ballStats) {
    cumulativeWeight += ballStat.timesDrawn;
    if (randomThreshold <= cumulativeWeight) {
      return ballStat.number;
    }
  }
  return ballStats[ballStats.length - 1].number;
}

const generateUniqueNumbersWeighted = (count: number, ballStats: BallStats[]) => {
  const numbers: Set<number> = new Set();
  while (numbers.size < count) {
    numbers.add(getWeightedRandomInt(ballStats));
  }
  return Array.from(numbers).sort((a, b) => a - b);
}


/**
 * Generates random lottery numbers for a single ticket
 */
const generateRandomTicket = (config: LotteryConfig): LotteryTicket => {
  const mainNumbers = generateUniqueNumbers(5, 1, config.fiveDraw);
  const specialNumber = getRandomInt(1, config.specialDraw);
  
  return {
    mainNumbers,
    specialNumber
  };
};

const generateMixedNashTicket = (normalBalls: BallStats[], specialBalls: BallStats[]): LotteryTicket => {
  const mainNumbers = generateUniqueNumbersWeighted(5, normalBalls);
  const specialNumber = getWeightedRandomInt(specialBalls);
  
  return {
    mainNumbers,
    specialNumber
  };
}

/**
 * Main function to generate lottery tickets
 */
export const generateLotteryNumbers = (
  lotteryType: string,
  randomnessType: string,
  ticketCount: number
): GeneratedTickets => {
  // Validate lottery type
  if (!LOTTERY_CONFIGS[lotteryType]) {
    throw new Error(`Unsupported lottery type: ${lotteryType}`);
  }
  
  // Validate ticket count
  if (ticketCount < 1 || ticketCount > 10) {
    throw new Error('Ticket count must be between 1 and 10');
  }
  
  const config = LOTTERY_CONFIGS[lotteryType];
  const tickets: LotteryTicket[] = [];
  
  // Load draw stats once if needed for nash generation
  let lotteryStats: LotteryStats | null = null;
  if (randomnessType === 'nash') {
    lotteryStats = readDrawStats(lotteryType);
  }
  
  // Generate tickets based on randomness type
  for (let i = 0; i < ticketCount; i++) {
    let ticket: LotteryTicket;
    
    switch (randomnessType) {
      case 'random':
        ticket = generateRandomTicket(config);
        break;
      case 'nash':
        if (!lotteryStats) {
          throw new Error('Lottery stats not loaded for nash generation');
        }
        ticket = generateMixedNashTicket(lotteryStats.normalBalls, lotteryStats.specialBalls);
        break;
      default:
        throw new Error(`Unsupported randomness type: ${randomnessType}`);
    }
    
    tickets.push(ticket);
  }
  
  return {
    tickets,
    lotteryType,
    randomnessType,
    ticketCount
  };
};
