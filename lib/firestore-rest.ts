const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const API_KEY  = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
const BASE     = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

// ---------- type conversion JS <-> Firestore REST format ----------

function toVal(v: unknown): unknown {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number')  return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string')  return { stringValue: v };
  if (Array.isArray(v))       return { arrayValue: { values: v.map(toVal) } };
  if (typeof v === 'object')  return { mapValue: { fields: toFields(v as Record<string, unknown>) } };
  return { nullValue: null };
}

function toFields(data: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, toVal(v)]));
}

function fromVal(v: unknown): unknown {
  const f = v as Record<string, unknown>;
  if ('nullValue'    in f) return null;
  if ('booleanValue' in f) return f.booleanValue;
  if ('integerValue' in f) return parseInt(f.integerValue as string);
  if ('doubleValue'  in f) return f.doubleValue;
  if ('stringValue'  in f) return f.stringValue;
  if ('arrayValue'   in f) return ((f.arrayValue as any).values || []).map(fromVal);
  if ('mapValue'     in f) return fromFields((f.mapValue as any).fields || {});
  return null;
}

function fromFields(fields: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, fromVal(v)]));
}

// ---------- public helpers ----------

export async function fsGet(collection: string, id: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${BASE}/${collection}/${id}?key=${API_KEY}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore GET failed: ${res.status} ${await res.text()}`);
  const doc = await res.json();
  return fromFields(doc.fields || {});
}

export async function fsSet(collection: string, id: string, data: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${BASE}/${collection}/${id}?key=${API_KEY}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFields(data) }),
  });
  if (!res.ok) throw new Error(`Firestore SET failed: ${res.status} ${await res.text()}`);
}

export async function fsPatch(collection: string, id: string, data: Record<string, unknown>): Promise<void> {
  const mask = Object.keys(data).map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const res = await fetch(`${BASE}/${collection}/${id}?key=${API_KEY}&${mask}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFields(data) }),
  });
  if (!res.ok) throw new Error(`Firestore PATCH failed: ${res.status} ${await res.text()}`);
}

export async function fsGetRaw(collection: string, id: string) {
  const res = await fetch(`${BASE}/${collection}/${id}?key=${API_KEY}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore GET failed: ${res.status}`);
  return res.json();
}

export async function fsSetRaw(collection: string, id: string, body: unknown): Promise<void> {
  const res = await fetch(`${BASE}/${collection}/${id}?key=${API_KEY}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Firestore SET failed: ${res.status} ${await res.text()}`);
}
