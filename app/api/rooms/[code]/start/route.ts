import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getServerDb } from '@/lib/firebase-server';
import { drawSeeds } from '@/lib/seeds';

type Params = { params: Promise<{ code: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const db = getServerDb();
    const snap = await getDoc(doc(db, 'rooms', code));
    const room = snap.data()!;
    const seeds: Record<string, unknown> = {};
    Object.keys(room.players).forEach(pid => { seeds[pid] = drawSeeds(room.config.seedsPerRound); });
    await updateDoc(doc(db, 'rooms', code), { status: 'draw', roundSeeds: seeds, submissions: {}, submissionCount: 0, roundStartedAt: null });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
