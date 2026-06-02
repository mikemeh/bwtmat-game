import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

type Params = { params: Promise<{ code: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const { config } = await req.json();
    await getAdminDb().collection('rooms').doc(code).update({ config });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
