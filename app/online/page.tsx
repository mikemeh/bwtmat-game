'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createRoom, joinRoom } from '@/lib/room-service';

type View = 'choose' | 'create' | 'join';

export default function OnlinePage() {
  const router = useRouter();
  const [view, setView] = useState<View>('choose');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), ms)
      ),
    ]);
  }

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const roomCode = await withTimeout(createRoom(name.trim()), 60000);
      router.push(`/online/${roomCode}`);
    } catch (e) {
      const msg = e instanceof Error && e.message === 'timeout'
        ? 'Connection timed out. If you have an ad blocker or VPN, try disabling it for this site.'
        : 'Failed to create room. Check your internet connection.';
      setError(msg);
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!name.trim() || !code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await withTimeout(joinRoom(code.trim(), name.trim()), 60000);
      if (!result.ok) {
        setError(result.error ?? 'Failed to join room.');
        setLoading(false);
        return;
      }
      router.push(`/online/${code.trim().toUpperCase()}`);
    } catch (e) {
      const msg = e instanceof Error && e.message === 'timeout'
        ? 'Connection timed out. If you have an ad blocker or VPN, try disabling it for this site.'
        : 'Failed to join room. Check your internet connection.';
      setError(msg);
      setLoading(false);
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: '#060a14' }}
    >
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-pop">
          <div className="text-5xl mb-2">🌐</div>
          <h1 className="text-2xl font-black text-white">Online Multiplayer</h1>
          <p className="text-white/40 text-sm">Play with friends from anywhere in the world</p>
        </div>

        {view === 'choose' && (
          <div className="space-y-3 animate-pop">
            <button
              onClick={() => setView('create')}
              className="btn-shimmer w-full py-4 rounded-2xl text-black font-black text-lg transition-all active:scale-95 shadow-2xl glow-amber"
            >
              🏠 Create Room
            </button>
            <button
              onClick={() => setView('join')}
              className="glass w-full py-4 rounded-2xl text-white font-black text-lg transition-all active:scale-95"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            >
              🔗 Join Room
            </button>
            <Link
              href="/"
              className="block text-center text-white/30 text-sm py-2 hover:text-white/50 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        )}

        {view === 'create' && (
          <div className="space-y-4 animate-pop">
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-2 block">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Enter your name…"
                maxLength={20}
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-white font-bold outline-none transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.border = '1.5px solid rgba(245,158,11,0.7)')}
                onBlur={e => (e.target.style.border = '1.5px solid rgba(255,255,255,0.12)')}
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              onClick={handleCreate}
              disabled={!name.trim() || loading}
              className="btn-shimmer w-full py-4 rounded-2xl text-black font-black text-lg transition-all active:scale-95 disabled:opacity-40"
            >
              {loading ? 'Creating…' : '🏠 Create Room'}
            </button>
            <button
              onClick={() => { setView('choose'); setError(''); }}
              className="w-full text-white/30 text-sm py-2 hover:text-white/50 transition-colors"
            >
              ← Back
            </button>
          </div>
        )}

        {view === 'join' && (
          <div className="space-y-4 animate-pop">
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-2 block">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name…"
                maxLength={20}
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-white font-bold outline-none transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.border = '1.5px solid rgba(245,158,11,0.7)')}
                onBlur={e => (e.target.style.border = '1.5px solid rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-2 block">
                Room Code
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                placeholder="e.g. BWT4X2"
                maxLength={6}
                className="w-full rounded-xl px-4 py-3 text-white font-black text-xl tracking-widest outline-none text-center transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.border = '1.5px solid rgba(245,158,11,0.7)')}
                onBlur={e => (e.target.style.border = '1.5px solid rgba(255,255,255,0.12)')}
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={!name.trim() || !code.trim() || loading}
              className="btn-shimmer w-full py-4 rounded-2xl text-black font-black text-lg transition-all active:scale-95 disabled:opacity-40"
            >
              {loading ? 'Joining…' : '🔗 Join Room'}
            </button>
            <button
              onClick={() => { setView('choose'); setError(''); }}
              className="w-full text-white/30 text-sm py-2 hover:text-white/50 transition-colors"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
