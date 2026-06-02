import { NextRequest, NextResponse } from 'next/server';
import { fsGet, fsSet } from '@/lib/firestore-rest';

type Params = { params: Promise<{ code: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const room = await fsGet('rooms', code);
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    await fsSet('rooms', code, { ...room, status: 'reveal', roundStartedAt: Date.now() });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
