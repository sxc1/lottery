import megaMillionsNumbers from '../../config/megamillions/numbers.json';
import powerballNumbers from '../../config/powerball/numbers.json';
import Papa from 'papaparse';

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
 * Reads CSV data from a URL and parses it into objects
 */
const readCSVFromFile = async (filePath: string): Promise<any[]> => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transform: (value: string) => {
          // Try to convert to number if possible
          const numValue = Number(value);
          return !isNaN(numValue) && value.trim() !== '' ? numValue : value;
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(results.errors);
          } else {
            resolve(results.data as any[]);
          }
        }
      });
    });
  } catch (error) {
    throw new Error(`Failed to read CSV from ${filePath}: ${error}`);
  }
};

/**
 * Generic function to read ball statistics from CSV file
 */
const readBallStats = async (lotteryType: string, ballType: 'normalball' | 'specialball'): Promise<BallStats[]> => {
  const csvPath = `./data/${lotteryType}/${ballType}.csv`;
  const data = await readCSVFromFile(csvPath);
  
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
export const readDrawStats = async (lotteryType: string): Promise<LotteryStats> => {
  try {
    const [normalBalls, specialBalls] = await Promise.all([
      readBallStats(lotteryType, 'normalball'),
      readBallStats(lotteryType, 'specialball')
    ]);
    
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
export const generateLotteryNumbers = async (
  lotteryType: string,
  randomnessType: string,
  ticketCount: number
): Promise<GeneratedTickets> => {
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
  
  // Generate tickets based on randomness type
  for (let i = 0; i < ticketCount; i++) {
    let ticket: LotteryTicket;
    
    switch (randomnessType) {
      case 'random':
        ticket = generateRandomTicket(config);
        break;
      case 'nash':
        const { normalBalls, specialBalls } = await readDrawStats(lotteryType);
        ticket = generateMixedNashTicket(normalBalls, specialBalls);
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
