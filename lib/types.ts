export type Color = 'red' | 'blue' | 'green';
export type GamePhase = 'home' | 'setup' | 'draw' | 'reveal' | 'round-results' | 'final';

export interface SeedTemplate {
  display: string;
  base: number;
  isSpecial: boolean;
  isPenalty: boolean;
}

export interface DrawnSeed {
  id: string;
  display: string;
  base: number;
  isSpecial: boolean;
  isPenalty: boolean;
  color: Color;
}

export interface Player {
  id: string;
  name: string;
  firstPlaces: number;
  secondPlaces: number;
  thirdPlaces: number;
  roundPositions: number[];
}

export interface RoundSubmission {
  playerId: string;
  answer: number;
  isCorrect: boolean;
  position: number;
}

export interface RoundResult {
  round: number;
  seeds: Record<string, DrawnSeed[]>;
  correctAnswers: Record<string, number>;
  submissions: RoundSubmission[];
}

export interface GameConfig {
  level: number;
  seedsPerRound: number;
  timeLimit: number;
  totalRounds: number;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  config: GameConfig;
  currentRound: number;
  roundSeeds: Record<string, DrawnSeed[]>;
  roundResults: RoundResult[];
  currentSubmissions: RoundSubmission[];
  submissionCount: number;
}

export type GameAction =
  | { type: 'GO_SETUP' }
  | { type: 'SETUP_GAME'; players: string[]; config: GameConfig }
  | { type: 'BEGIN_REVEAL' }
  | { type: 'SUBMIT_ANSWER'; playerId: string; answer: number }
  | { type: 'END_ROUND' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET' };
