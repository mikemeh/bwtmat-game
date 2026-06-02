import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

type Params = { params: Promise<{ code: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    await adminDb.collection('rooms').doc(code).update({ status: 'reveal', roundStartedAt: Date.now() });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
