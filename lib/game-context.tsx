'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  GameState, GameAction, GamePhase, Player, GameConfig, RoundSubmission, DrawnSeed,
} from './types';
import { drawSeeds, calculateTotal } from './seeds';

function createPlayer(name: string, id: string): Player {
  return { id, name, firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0, roundPositions: [] };
}

function dealSeeds(players: Player[], count: number): Record<string, DrawnSeed[]> {
  const seeds: Record<string, DrawnSeed[]> = {};
  players.forEach(p => { seeds[p.id] = drawSeeds(count); });
  return seeds;
}

const initialState: GameState = {
  phase: 'home',
  players: [],
  config: { level: 1, seedsPerRound: 3, timeLimit: 60, totalRounds: 5 },
  currentRound: 1,
  roundSeeds: {},
  roundResults: [],
  currentSubmissions: [],
  submissionCount: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GO_SETUP':
      return { ...initialState, phase: 'setup' };

    case 'SETUP_GAME': {
      const players = action.players.map((name, i) => createPlayer(name, `player-${i}`));
      return {
        ...initialState,
        phase: 'draw',
        players,
        config: action.config,
        currentRound: 1,
        roundSeeds: dealSeeds(players, action.config.seedsPerRound),
        currentSubmissions: [],
        submissionCount: 0,
      };
    }

    case 'BEGIN_REVEAL': {
      return { ...state, phase: 'reveal' };
    }

    case 'SUBMIT_ANSWER': {
      const { playerId, answer } = action;
      const alreadyCorrect = state.currentSubmissions.some(
        s => s.playerId === playerId && s.isCorrect
      );
      if (alreadyCorrect) return state;

      const correctAnswer = calculateTotal(state.roundSeeds[playerId] ?? []);
      const isCorrect = answer === correctAnswer;
      const correctSoFar = state.currentSubmissions.filter(s => s.isCorrect).length;
      const position = isCorrect ? correctSoFar + 1 : 0;

      const newSub: RoundSubmission = { playerId, answer, isCorrect, position };
      const newSubs = [...state.currentSubmissions.filter(
        s => !(s.playerId === playerId && !s.isCorrect) // replace wrong with new attempt
      ), newSub];

      const newCorrectCount = newSubs.filter(s => s.isCorrect).length;
      return { ...state, currentSubmissions: newSubs, submissionCount: newCorrectCount };
    }

    case 'END_ROUND': {
      const correctSubs = state.currentSubmissions.filter(s => s.isCorrect);
      const submittedIds = new Set(correctSubs.map(s => s.playerId));
      let nextPos = correctSubs.length + 1;

      const allSubs: RoundSubmission[] = [...correctSubs];
      state.players.forEach(p => {
        if (!submittedIds.has(p.id)) {
          allSubs.push({ playerId: p.id, answer: 0, isCorrect: false, position: nextPos++ });
        }
      });

      const correctAnswers: Record<string, number> = {};
      state.players.forEach(p => {
        correctAnswers[p.id] = calculateTotal(state.roundSeeds[p.id] ?? []);
      });

      const roundResult = {
        round: state.currentRound,
        seeds: state.roundSeeds,
        correctAnswers,
        submissions: allSubs,
      };

      const updatedPlayers = state.players.map(player => {
        const sub = allSubs.find(s => s.playerId === player.id);
        const pos = sub?.position ?? state.players.length;
        return {
          ...player,
          roundPositions: [...player.roundPositions, pos],
          firstPlaces:  player.firstPlaces  + (pos === 1 ? 1 : 0),
          secondPlaces: player.secondPlaces + (pos === 2 ? 1 : 0),
          thirdPlaces:  player.thirdPlaces  + (pos === 3 ? 1 : 0),
        };
      });

      return {
        ...state,
        phase: 'round-results',
        players: updatedPlayers,
        roundResults: [...state.roundResults, roundResult],
        currentSubmissions: allSubs,
      };
    }

    case 'NEXT_ROUND': {
      const next = state.currentRound + 1;
      if (next > state.config.totalRounds) {
        return { ...state, phase: 'final' };
      }
      return {
        ...state,
        phase: 'draw',
        currentRound: next,
        roundSeeds: dealSeeds(state.players, state.config.seedsPerRound),
        currentSubmissions: [],
        submissionCount: 0,
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

type Ctx = { state: GameState; dispatch: React.Dispatch<GameAction> };
const GameContext = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
