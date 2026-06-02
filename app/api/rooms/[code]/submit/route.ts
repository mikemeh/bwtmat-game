import { NextRequest, NextResponse } from 'next/server';
import { doc, runTransaction } from 'firebase/firestore';
import { getServerDb } from '@/lib/firebase-server';
import { calculateTotal } from '@/lib/seeds';
import { DrawnSeed } from '@/lib/types';

type Params = { params: Promise<{ code: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const { playerId, answer } = await req.json();
    const db = getServerDb();
    const ref = doc(db, 'rooms', code);
    await runTransaction(db, async tx => {
      const snap = await tx.get(ref);
      const room = snap.data()!;
      if (room.submissions?.[playerId]?.isCorrect) return;
      const seeds = (room.roundSeeds?.[playerId] ?? []) as DrawnSeed[];
      const isCorrect = answer === calculateTotal(seeds);
      const correctSoFar = Object.values(room.submissions ?? {}).filter((s: any) => s.isCorrect).length;
      const position = isCorrect ? correctSoFar + 1 : 0;
      const newSubs = { ...(room.submissions ?? {}), [playerId]: { answer, isCorrect, position } };
      const newCount = Object.values(newSubs).filter((s: any) => s.isCorrect).length;
      tx.update(ref, { [`submissions.${playerId}`]: { answer, isCorrect, position }, submissionCount: newCount });
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
