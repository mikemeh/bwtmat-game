import { SeedTemplate, DrawnSeed, Color } from './types';

export const SEED_POOL: SeedTemplate[] = [
  { display: '1',  base: 1,  isSpecial: false, isPenalty: false },
  { display: '2',  base: 2,  isSpecial: false, isPenalty: false },
  { display: '3',  base: 3,  isSpecial: false, isPenalty: false },
  { display: '4',  base: 4,  isSpecial: false, isPenalty: false },
  { display: '5',  base: 5,  isSpecial: false, isPenalty: false },
  { display: '6',  base: 6,  isSpecial: false, isPenalty: false },
  { display: '7',  base: 7,  isSpecial: false, isPenalty: false },
  { display: '8',  base: 8,  isSpecial: false, isPenalty: false },
  { display: '9',  base: 9,  isSpecial: false, isPenalty: false },
  { display: '10', base: 10, isSpecial: false, isPenalty: false },
  // Special versions: 3, 5, 7 each appear twice (regular + special)
  { display: '3³', base: 27, isSpecial: true,  isPenalty: false },
  { display: '5d', base: 10, isSpecial: true,  isPenalty: false },
  { display: '7d', base: 14, isSpecial: true,  isPenalty: false },
  // Penalty seeds
  { display: '-2', base: -2, isSpecial: false, isPenalty: true },
  { display: '-2', base: -2, isSpecial: false, isPenalty: true },
  { display: '-2', base: -2, isSpecial: false, isPenalty: true },
  { display: '-2', base: -2, isSpecial: false, isPenalty: true },
];

const COLORS: Color[] = ['red', 'blue', 'green'];

export function drawSeeds(count: number): DrawnSeed[] {
  const shuffled = [...SEED_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((template, i) => ({
    id: `seed-${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
    ...template,
    color: COLORS[Math.floor(Math.random() * 3)] as Color,
  }));
}

export function calculateSeedValue(seed: DrawnSeed): number {
  if (seed.isPenalty) return -2;
  switch (seed.color) {
    case 'red':  return 0;
    case 'blue': return seed.base;
    case 'green': return seed.base * 2;
    default: return 0;
  }
}

export function calculateTotal(seeds: DrawnSeed[]): number {
  return seeds.reduce((sum, seed) => sum + calculateSeedValue(seed), 0);
}

export const SEEDS_PER_LEVEL: Record<number, number> = {
  1: 3, 2: 5, 3: 7, 4: 9, 5: 11,
};

export const TIME_PER_LEVEL: Record<number, number> = {
  1: 60, 2: 60, 3: 75, 4: 75, 5: 90,
};

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Quick Start',
  2: 'Warming Up',
  3: 'Challenger',
  4: 'Expert',
  5: 'BWTmat Master',
};

export const MEDAL = ['🥇', '🥈', '🥉', '4th', '5th'];
export const ORDINAL = ['1st', '2nd', '3rd', '4th', '5th'];
