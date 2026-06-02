import { OnlineRoom, OnlinePlayer, OnlineSubmission } from './room-service-types';
import { GameConfig } from './types';

export type { OnlineRoom, OnlinePlayer, OnlineSubmission };

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

async function api(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function createRoom(playerName: string): Promise<string> {
  const playerId = getOrCreatePlayerId();
  const data = await api('/api/rooms', 'POST', { playerName, playerId });
  if (data.error) throw new Error(data.error);
  return data.code;
}

export async function joinRoom(code: string, playerName: string): Promise<{ ok: boolean; error?: string }> {
  const playerId = getOrCreatePlayerId();
  return api(`/api/rooms/${code.toUpperCase()}`, 'POST', { playerName, playerId });
}

export async function updateRoomConfig(code: string, config: GameConfig): Promise<void> {
  await api(`/api/rooms/${code}/config`, 'PATCH', { config });
}

export async function startGame(code: string): Promise<void> {
  await api(`/api/rooms/${code}/start`, 'POST');
}

export async function beginReveal(code: string): Promise<void> {
  await api(`/api/rooms/${code}/reveal`, 'POST');
}

export async function submitAnswer(code: string, playerId: string, answer: number): Promise<void> {
  await api(`/api/rooms/${code}/submit`, 'POST', { playerId, answer });
}

export async function endRound(code: string): Promise<void> {
  await api(`/api/rooms/${code}/end`, 'POST');
}

export async function nextRound(code: string): Promise<void> {
  await api(`/api/rooms/${code}/next`, 'POST');
}

export async function getRoom(code: string): Promise<OnlineRoom | null> {
  const data = await api(`/api/rooms/${code}`);
  return data ?? null;
}
