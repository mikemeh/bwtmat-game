import { DrawnSeed, GameConfig } from './types';

export interface OnlinePlayer {
  id: string;
  name: string;
  isHost: boolean;
  firstPlaces: number;
  secondPlaces: number;
  thirdPlaces: number;
  roundPositions: number[];
  joinedAt: number;
}

export interface OnlineSubmission {
  answer: number;
  isCorrect: boolean;
  position: number;
}

export interface OnlineRoom {
  code: string;
  status: 'lobby' | 'draw' | 'reveal' | 'round-results' | 'final';
  hostId: string;
  config: GameConfig;
  currentRound: number;
  roundStartedAt: number | null;
  players: Record<string, OnlinePlayer>;
  roundSeeds: Record<string, DrawnSeed[]>;
  submissions: Record<string, OnlineSubmission>;
  submissionCount: number;
  roundResults: {
    round: number;
    correctAnswers: Record<string, number>;
    submissions: Array<{ playerId: string; answer: number; isCorrect: boolean; position: number }>;
  }[];
  createdAt: number;
}
