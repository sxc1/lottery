// Types and interfaces for lottery generation
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

// TODO: Pull config from files
const LOTTERY_CONFIGS: Record<string, LotteryConfig> = {
  powerball: {
    fiveDraw: 69,
    specialDraw: 26
  },
  megamillions: {
    fiveDraw: 70,
    specialDraw: 25
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
  
  // Generate tickets based on randomness type
  for (let i = 0; i < ticketCount; i++) {
    let ticket: LotteryTicket;
    
    switch (randomnessType) {
      case 'random':
        ticket = generateRandomTicket(config);
        break;
      case 'nash':
        ticket = generateRandomTicket(config);
        // TODO: Implement mixed nash generation
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

/**
 * Utility function to format a ticket for display
 */
export const formatTicket = (ticket: LotteryTicket, lotteryType: string): string => {
  const mainNumbersStr = ticket.mainNumbers.join(' - ');
  const specialLabel = lotteryType === 'powerball' ? 'PB' : 'MB';
  
  return `${mainNumbersStr} | ${specialLabel}: ${ticket.specialNumber}`;
};

/**
 * Utility function to format all tickets for display
 */
export const formatAllTickets = (generatedTickets: GeneratedTickets): string[] => {
  return generatedTickets.tickets.map(ticket => 
    formatTicket(ticket, generatedTickets.lotteryType)
  );
};