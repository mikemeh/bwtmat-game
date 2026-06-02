import { NextRequest, NextResponse } from 'next/server';
import { fsGet, fsSet } from '@/lib/firestore-rest';
import { calculateTotal } from '@/lib/seeds';
import { DrawnSeed } from '@/lib/types';

type Params = { params: Promise<{ code: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const room = await fsGet('rooms', code);
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    const submissions = (room.submissions ?? {}) as Record<string, any>;
    const players = room.players as Record<string, any>;
    const correctSubs = Object.entries(submissions).filter(([, s]) => s.isCorrect).map(([pid, s]) => ({ playerId: pid, ...s }));
    const submittedIds = new Set(correctSubs.map(s => s.playerId));
    let nextPos = correctSubs.length + 1;
    const allSubs = [...correctSubs];
    Object.keys(players).forEach(pid => {
      if (!submittedIds.has(pid)) allSubs.push({ playerId: pid, answer: 0, isCorrect: false, position: nextPos++ });
    });
    const correctAnswers: Record<string, number> = {};
    Object.keys(players).forEach(pid => {
      correctAnswers[pid] = calculateTotal(((room.roundSeeds as any)?.[pid] ?? []) as DrawnSeed[]);
    });
    const updatedPlayers = { ...players };
    allSubs.forEach(sub => {
      const p = updatedPlayers[sub.playerId];
      if (!p) return;
      updatedPlayers[sub.playerId] = { ...p, roundPositions: [...p.roundPositions, sub.position], firstPlaces: p.firstPlaces + (sub.position === 1 ? 1 : 0), secondPlaces: p.secondPlaces + (sub.position === 2 ? 1 : 0), thirdPlaces: p.thirdPlaces + (sub.position === 3 ? 1 : 0) };
    });
    await fsSet('rooms', code, {
      ...room, status: 'round-results', players: updatedPlayers,
      roundResults: [...((room.roundResults as any[]) ?? []), { round: room.currentRound, correctAnswers, submissions: allSubs }],
      submissions: allSubs.reduce((acc, s) => ({ ...acc, [s.playerId]: s }), {}),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
