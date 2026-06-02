import { NextRequest, NextResponse } from 'next/server';
import { fsGet, fsSet } from '@/lib/firestore-rest';
import { calculateTotal } from '@/lib/seeds';
import { DrawnSeed } from '@/lib/types';

type Params = { params: Promise<{ code: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const { playerId, answer } = await req.json();
    const room = await fsGet('rooms', code);
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    const submissions = (room.submissions ?? {}) as Record<string, any>;
    if (submissions[playerId]?.isCorrect) return NextResponse.json({ ok: true });
    const seeds = ((room.roundSeeds as any)?.[playerId] ?? []) as DrawnSeed[];
    const isCorrect = answer === calculateTotal(seeds);
    const correctSoFar = Object.values(submissions).filter(s => s.isCorrect).length;
    const position = isCorrect ? correctSoFar + 1 : 0;
    const newSubs = { ...submissions, [playerId]: { answer, isCorrect, position } };
    const newCount = Object.values(newSubs).filter((s: any) => s.isCorrect).length;
    await fsSet('rooms', code, { ...room, submissions: newSubs, submissionCount: newCount });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
