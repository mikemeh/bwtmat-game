import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { calculateTotal } from '@/lib/seeds';
import { DrawnSeed } from '@/lib/types';

type Params = { params: Promise<{ code: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const { playerId, answer } = await req.json();
    const ref = adminDb.collection('rooms').doc(code);
    await adminDb.runTransaction(async tx => {
      const snap = await tx.get(ref);
      const room = snap.data()!;
      if (room.submissions?.[playerId]?.isCorrect) return;
      const seeds = (room.roundSeeds?.[playerId] ?? []) as DrawnSeed[];
      const correctAnswer = calculateTotal(seeds);
      const isCorrect = answer === correctAnswer;
      const correctSoFar = Object.values(room.submissions ?? {}).filter((s: any) => s.isCorrect).length;
      const position = isCorrect ? correctSoFar + 1 : 0;
      const newSubs = { ...(room.submissions ?? {}), [playerId]: { answer, isCorrect, position } };
      const newCount = Object.values(newSubs).filter((s: any) => s.isCorrect).length;
      tx.update(ref, {
        [`submissions.${playerId}`]: { answer, isCorrect, position },
        submissionCount: newCount,
      });
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
