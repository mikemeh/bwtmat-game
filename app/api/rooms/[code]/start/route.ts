import { NextRequest, NextResponse } from 'next/server';
import { fsGet, fsSet } from '@/lib/firestore-rest';
import { drawSeeds } from '@/lib/seeds';

type Params = { params: Promise<{ code: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const room = await fsGet('rooms', code);
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    const seeds: Record<string, unknown> = {};
    Object.keys(room.players as object).forEach(pid => { seeds[pid] = drawSeeds((room.config as any).seedsPerRound); });
    await fsSet('rooms', code, { ...room, status: 'draw', roundSeeds: seeds, submissions: {}, submissionCount: 0, roundStartedAt: null });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
