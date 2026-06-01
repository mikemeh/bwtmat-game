import {
  doc, setDoc, getDoc, updateDoc, onSnapshot,
  serverTimestamp, arrayUnion, runTransaction, deleteField,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { drawSeeds, calculateTotal } from './seeds';
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
  roundStartedAt: number | null; // ms timestamp
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

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function getOrCreatePlayerId(): string {
  if (typeof window === 'undefined') return 'server';
  const key = 'bwtmat_pid';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export async function createRoom(playerName: string): Promise<string> {
  const code = generateCode();
  const playerId = getOrCreatePlayerId();
  const room: OnlineRoom = {
    code,
    status: 'lobby',
    hostId: playerId,
    config: { level: 1, seedsPerRound: 3, timeLimit: 60, totalRounds: 5 },
    currentRound: 1,
    roundStartedAt: null,
    players: {
      [playerId]: {
        id: playerId,
        name: playerName,
        isHost: true,
        firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0,
        roundPositions: [],
        joinedAt: Date.now(),
      },
    },
    roundSeeds: {},
    submissions: {},
    submissionCount: 0,
    roundResults: [],
    createdAt: Date.now(),
  };
  await setDoc(doc(db, 'rooms', code), room);
  return code;
}

export async function joinRoom(code: string, playerName: string): Promise<{ ok: boolean; error?: string }> {
  const playerId = getOrCreatePlayerId();
  const ref = doc(db, 'rooms', code.toUpperCase());
  const snap = await getDoc(ref);
  if (!snap.exists()) return { ok: false, error: 'Room not found. Check the code and try again.' };
  const room = snap.data() as OnlineRoom;
  if (room.status !== 'lobby') return { ok: false, error: 'This game has already started.' };
  if (Object.keys(room.players).length >= 5) return { ok: false, error: 'Room is full (max 5 players).' };
  await updateDoc(ref, {
    [`players.${playerId}`]: {
      id: playerId,
      name: playerName,
      isHost: false,
      firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0,
      roundPositions: [],
      joinedAt: Date.now(),
    },
  });
  return { ok: true };
}

export async function updateRoomConfig(code: string, config: GameConfig): Promise<void> {
  await updateDoc(doc(db, 'rooms', code), { config });
}

export async function startGame(code: string): Promise<void> {
  const ref = doc(db, 'rooms', code);
  const snap = await getDoc(ref);
  const room = snap.data() as OnlineRoom;
  const seeds: Record<string, DrawnSeed[]> = {};
  Object.keys(room.players).forEach(pid => {
    seeds[pid] = drawSeeds(room.config.seedsPerRound);
  });
  await updateDoc(ref, {
    status: 'draw',
    roundSeeds: seeds,
    submissions: {},
    submissionCount: 0,
    roundStartedAt: null,
  });
}

export async function beginReveal(code: string): Promise<void> {
  await updateDoc(doc(db, 'rooms', code), {
    status: 'reveal',
    roundStartedAt: Date.now(),
  });
}

export async function submitAnswer(code: string, playerId: string, answer: number): Promise<void> {
  const ref = doc(db, 'rooms', code);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const room = snap.data() as OnlineRoom;
    if (room.submissions[playerId]?.isCorrect) return;

    const correctAnswer = calculateTotal(room.roundSeeds[playerId] ?? []);
    const isCorrect = answer === correctAnswer;
    const correctSoFar = Object.values(room.submissions).filter(s => s.isCorrect).length;
    const position = isCorrect ? correctSoFar + 1 : 0;

    const newSubs = { ...room.submissions, [playerId]: { answer, isCorrect, position } };
    const newCount = Object.values(newSubs).filter(s => s.isCorrect).length;

    tx.update(ref, {
      [`submissions.${playerId}`]: { answer, isCorrect, position },
      submissionCount: newCount,
    });
  });
}

export async function endRound(code: string): Promise<void> {
  const ref = doc(db, 'rooms', code);
  const snap = await getDoc(ref);
  const room = snap.data() as OnlineRoom;

  const correctSubs = Object.entries(room.submissions)
    .filter(([, s]) => s.isCorrect)
    .map(([pid, s]) => ({ playerId: pid, ...s }));
  const submittedIds = new Set(correctSubs.map(s => s.playerId));
  let nextPos = correctSubs.length + 1;

  const allSubs = [...correctSubs];
  Object.keys(room.players).forEach(pid => {
    if (!submittedIds.has(pid)) {
      allSubs.push({ playerId: pid, answer: 0, isCorrect: false, position: nextPos++ });
    }
  });

  const correctAnswers: Record<string, number> = {};
  Object.keys(room.players).forEach(pid => {
    correctAnswers[pid] = calculateTotal(room.roundSeeds[pid] ?? []);
  });

  const updatedPlayers = { ...room.players };
  allSubs.forEach(sub => {
    const p = updatedPlayers[sub.playerId];
    if (!p) return;
    updatedPlayers[sub.playerId] = {
      ...p,
      roundPositions: [...p.roundPositions, sub.position],
      firstPlaces:  p.firstPlaces  + (sub.position === 1 ? 1 : 0),
      secondPlaces: p.secondPlaces + (sub.position === 2 ? 1 : 0),
      thirdPlaces:  p.thirdPlaces  + (sub.position === 3 ? 1 : 0),
    };
  });

  await updateDoc(ref, {
    status: 'round-results',
    players: updatedPlayers,
    roundResults: arrayUnion({
      round: room.currentRound,
      correctAnswers,
      submissions: allSubs,
    }),
    submissions: allSubs.reduce((acc, s) => ({ ...acc, [s.playerId]: s }), {}),
  });
}

export async function nextRound(code: string): Promise<void> {
  const ref = doc(db, 'rooms', code);
  const snap = await getDoc(ref);
  const room = snap.data() as OnlineRoom;

  const next = room.currentRound + 1;
  if (next > room.config.totalRounds) {
    await updateDoc(ref, { status: 'final' });
    return;
  }

  const seeds: Record<string, DrawnSeed[]> = {};
  Object.keys(room.players).forEach(pid => {
    seeds[pid] = drawSeeds(room.config.seedsPerRound);
  });

  await updateDoc(ref, {
    status: 'draw',
    currentRound: next,
    roundSeeds: seeds,
    submissions: {},
    submissionCount: 0,
    roundStartedAt: null,
  });
}

export function subscribeToRoom(code: string, callback: (room: OnlineRoom | null) => void) {
  return onSnapshot(doc(db, 'rooms', code), snap => {
    callback(snap.exists() ? (snap.data() as OnlineRoom) : null);
  });
}
