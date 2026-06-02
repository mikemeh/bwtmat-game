import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { drawSeeds } from '@/lib/seeds';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(req: NextRequest) {
  try {
    const { playerName, playerId } = await req.json();
    const code = generateCode();
    await getAdminDb().collection('rooms').doc(code).set({
      code,
      status: 'lobby',
      hostId: playerId,
      config: { level: 1, seedsPerRound: 3, timeLimit: 60, totalRounds: 5 },
      currentRound: 1,
      roundStartedAt: null,
      players: {
        [playerId]: {
          id: playerId, name: playerName, isHost: true,
          firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0,
          roundPositions: [], joinedAt: Date.now(),
        },
      },
      roundSeeds: {},
      submissions: {},
      submissionCount: 0,
      roundResults: [],
      createdAt: Date.now(),
    });
    return NextResponse.json({ code });
  } catch (e) {
    console.error('createRoom error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

