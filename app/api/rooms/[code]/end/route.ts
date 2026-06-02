import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { calculateTotal } from '@/lib/seeds';
import { DrawnSeed } from '@/lib/types';

type Params = { params: Promise<{ code: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const snap = await getAdminDb().collection('rooms').doc(code).get();
    const room = snap.data()!;
    const submissions = room.submissions ?? {};
    const correctSubs = Object.entries(submissions)
      .filter(([, s]: any) => s.isCorrect)
      .map(([pid, s]: any) => ({ playerId: pid, ...s }));
    const submittedIds = new Set(correctSubs.map((s: any) => s.playerId));
    let nextPos = correctSubs.length + 1;
    const allSubs = [...correctSubs];
    Object.keys(room.players).forEach(pid => {
      if (!submittedIds.has(pid)) allSubs.push({ playerId: pid, answer: 0, isCorrect: false, position: nextPos++ });
    });
    const correctAnswers: Record<string, number> = {};
    Object.keys(room.players).forEach(pid => {
      correctAnswers[pid] = calculateTotal((room.roundSeeds?.[pid] ?? []) as DrawnSeed[]);
    });
    const updatedPlayers = { ...room.players };
    allSubs.forEach((sub: any) => {
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
    await getAdminDb().collection('rooms').doc(code).update({
      status: 'round-results',
      players: updatedPlayers,
      roundResults: [...(room.roundResults ?? []), { round: room.currentRound, correctAnswers, submissions: allSubs }],
      submissions: allSubs.reduce((acc: any, s: any) => ({ ...acc, [s.playerId]: s }), {}),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
