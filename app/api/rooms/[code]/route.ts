import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getServerDb } from '@/lib/firebase-server';

type Params = { params: Promise<{ code: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const db = getServerDb();
    const snap = await getDoc(doc(db, 'rooms', code.toUpperCase()));
    return NextResponse.json(snap.exists() ? snap.data() : null);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const { playerName, playerId } = await req.json();
    const db = getServerDb();
    const ref = doc(db, 'rooms', code.toUpperCase());
    const snap = await getDoc(ref);
    if (!snap.exists()) return NextResponse.json({ ok: false, error: 'Room not found. Check the code and try again.' });
    const room = snap.data()!;
    if (room.status !== 'lobby') return NextResponse.json({ ok: false, error: 'This game has already started.' });
    if (Object.keys(room.players).length >= 5) return NextResponse.json({ ok: false, error: 'Room is full (max 5 players).' });
    await updateDoc(ref, {
      [`players.${playerId}`]: { id: playerId, name: playerName, isHost: false, firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0, roundPositions: [], joinedAt: Date.now() },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
