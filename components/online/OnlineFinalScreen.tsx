'use client';

import { useRouter } from 'next/navigation';
import { useOnline } from '@/lib/online-context';
import { MEDAL, LEVEL_NAMES } from '@/lib/seeds';

const RANK_STYLE = [
  { bg: 'linear-gradient(135deg,rgba(245,158,11,0.18),rgba(120,53,15,0.10))', border: 'rgba(245,158,11,0.40)', glow: '0 0 40px rgba(245,158,11,0.30)' },
  { bg: 'linear-gradient(135deg,rgba(148,163,184,0.10),rgba(30,41,59,0.10))', border: 'rgba(148,163,184,0.25)', glow: 'none' },
  { bg: 'linear-gradient(135deg,rgba(180,83,9,0.12),rgba(69,26,3,0.08))',     border: 'rgba(180,83,9,0.30)',   glow: 'none' },
  { bg: 'rgba(15,23,42,0.50)', border: 'rgba(51,65,85,0.40)',  glow: 'none' },
  { bg: 'rgba(9,15,30,0.50)',  border: 'rgba(30,41,59,0.40)',  glow: 'none' },
];

export default function OnlineFinalScreen() {
  const router = useRouter();
  const { room } = useOnline();

  if (!room) return null;
  const { players, config } = room;

  const ranked = Object.values(players).sort((a, b) =>
    b.firstPlaces - a.firstPlaces ||
    b.secondPlaces - a.secondPlaces ||
    b.thirdPlaces - a.thirdPlaces
  );

  const champion = ranked[0];
  const isTied =
    ranked.length > 1 &&
    ranked[0].firstPlaces === ranked[1].firstPlaces &&
    ranked[0].secondPlaces === ranked[1].secondPlaces;

  return (
    <div className="min-h-screen flex flex-col items-center p-5 overflow-y-auto">
      <div className="w-full max-w-md py-4 space-y-6">

        {/* Champion banner */}
        <div className="text-center space-y-4">
          <div style={{ fontSize: 64, lineHeight: 1 }}>🏆</div>
          <div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Game Over</p>
            <h1 className="text-3xl font-black text-white mt-1">
              {isTied ? "It's a Tie!" : 'BWTmat Champion'}
            </h1>
          </div>

          {isTied ? (
            <div className="flex justify-center gap-3">
              {ranked.slice(0, 2).map(p => (
                <div
                  key={p.id}
                  className="px-6 py-4 rounded-2xl text-center"
                  style={{
                    background: RANK_STYLE[0].bg,
                    border: `1px solid ${RANK_STYLE[0].border}`,
                    boxShadow: RANK_STYLE[0].glow,
                  }}
                >
                  <p className="text-amber-300 font-black text-xl">{p.name}</p>
                  <p className="text-amber-400/60 text-xs mt-1">
                    {p.firstPlaces} first place{p.firstPlaces !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="mx-auto inline-block rounded-2xl px-8 py-5 text-center animate-pop"
              style={{
                background: RANK_STYLE[0].bg,
                border: `2px solid ${RANK_STYLE[0].border}`,
                boxShadow: RANK_STYLE[0].glow,
              }}
            >
              <p className="text-4xl font-black text-amber-300 leading-none">{champion?.name}</p>
              <p className="text-amber-400/60 text-sm mt-2 font-semibold">
                {champion?.firstPlaces} First Place{champion?.firstPlaces !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Final standings */}
        <div
          className="glass rounded-2xl p-4 space-y-2"
          style={{ border: '1px solid rgba(255,255,255,0.09)' }}
        >
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Final Standings</p>
          {ranked.map((player, i) => {
            const s = RANK_STYLE[i] ?? RANK_STYLE[4];
            return (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: s.bg, border: `1px solid ${s.border}`, boxShadow: s.glow }}
              >
                <span className="text-xl w-8">{MEDAL[i] ?? `${i + 1}`}</span>
                <div className="flex-1">
                  <p className="text-white font-black">{player.name}</p>
                  <p className="text-white/30 text-xs mt-0.5">
                    {player.roundPositions.map(p =>
                      p === 1 ? '🥇' : p === 2 ? '🥈' : p === 3 ? '🥉' : `${p}th`
                    ).join(' ')}
                  </p>
                </div>
                <div className="text-right text-xs space-y-0.5">
                  {player.firstPlaces  > 0 && <p className="text-amber-400 font-black">★ ×{player.firstPlaces}</p>}
                  {player.secondPlaces > 0 && <p className="text-slate-300 font-bold">✦ ×{player.secondPlaces}</p>}
                  {player.thirdPlaces  > 0 && <p className="text-amber-600 font-bold">◆ ×{player.thirdPlaces}</p>}
                  {!player.firstPlaces && !player.secondPlaces && !player.thirdPlaces && (
                    <p className="text-white/20">—</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Game summary */}
        <div
          className="glass rounded-2xl p-4"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { val: config.totalRounds,  label: 'Rounds' },
              { val: `Lv ${config.level}`, label: LEVEL_NAMES[config.level] },
              { val: config.seedsPerRound, label: 'Seeds/Round' },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-white font-black text-lg">{val}</p>
                <p className="text-white/30 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pb-4">
          <button
            onClick={() => router.push('/')}
            className="btn-shimmer w-full py-4 rounded-2xl text-black font-black text-lg transition-all active:scale-95 shadow-2xl glow-amber"
          >
            🏠 Back to Home
          </button>
          <button
            onClick={() => router.push('/online')}
            className="glass w-full py-3 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            🌐 New Online Game
          </button>
        </div>
      </div>
    </div>
  );
}
