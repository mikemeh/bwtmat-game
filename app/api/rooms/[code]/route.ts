import { NextRequest, NextResponse } from 'next/server';
import { fsGet, fsSet } from '@/lib/firestore-rest';

type Params = { params: Promise<{ code: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const room = await fsGet('rooms', code.toUpperCase());
    return NextResponse.json(room);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const { playerName, playerId } = await req.json();
    const room = await fsGet('rooms', code.toUpperCase());
    if (!room) return NextResponse.json({ ok: false, error: 'Room not found. Check the code and try again.' });
    if (room.status !== 'lobby') return NextResponse.json({ ok: false, error: 'This game has already started.' });
    if (Object.keys(room.players as object).length >= 5) return NextResponse.json({ ok: false, error: 'Room is full (max 5 players).' });
    const updated = {
      ...room,
      players: {
        ...(room.players as object),
        [playerId]: { id: playerId, name: playerName, isHost: false, firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0, roundPositions: [], joinedAt: Date.now() },
      },
    };
    await fsSet('rooms', code.toUpperCase(), updated);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
