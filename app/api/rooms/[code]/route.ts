import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

type Params = { params: Promise<{ code: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const snap = await adminDb.collection('rooms').doc(code.toUpperCase()).get();
    return NextResponse.json(snap.exists ? snap.data() : null);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const { playerName, playerId } = await req.json();
    const ref = adminDb.collection('rooms').doc(code.toUpperCase());
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ ok: false, error: 'Room not found. Check the code and try again.' });
    const room = snap.data()!;
    if (room.status !== 'lobby') return NextResponse.json({ ok: false, error: 'This game has already started.' });
    if (Object.keys(room.players).length >= 5) return NextResponse.json({ ok: false, error: 'Room is full (max 5 players).' });
    await ref.update({
      [`players.${playerId}`]: {
        id: playerId, name: playerName, isHost: false,
        firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0,
        roundPositions: [], joinedAt: Date.now(),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
