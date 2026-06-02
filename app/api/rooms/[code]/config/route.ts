import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { getServerDb } from '@/lib/firebase-server';

type Params = { params: Promise<{ code: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const { config } = await req.json();
    await updateDoc(doc(getServerDb(), 'rooms', code), { config });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
