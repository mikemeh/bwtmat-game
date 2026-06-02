import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { drawSeeds } from '@/lib/seeds';

type Params = { params: Promise<{ code: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const snap = await getAdminDb().collection('rooms').doc(code).get();
    const room = snap.data()!;
    const seeds: Record<string, unknown> = {};
    Object.keys(room.players).forEach(pid => { seeds[pid] = drawSeeds(room.config.seedsPerRound); });
    await getAdminDb().collection('rooms').doc(code).update({
      status: 'draw', roundSeeds: seeds, submissions: {}, submissionCount: 0, roundStartedAt: null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
