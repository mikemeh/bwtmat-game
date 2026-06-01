'use client';

import { useOnline } from '@/lib/online-context';
import { nextRound } from '@/lib/room-service';
import { MEDAL, ORDINAL } from '@/lib/seeds';
import SeedCard from '../SeedCard';
import ZoneBreakdown from '../ZoneBreakdown';

const POS_STYLE = [
  { bg: 'linear-gradient(135deg,#d97706,#92400e)', glow: '0 0 30px rgba(245,158,11,0.40)', text: '#fff' },
  { bg: 'linear-gradient(135deg,#475569,#1e293b)', glow: '0 0 20px rgba(148,163,184,0.20)', text: '#e2e8f0' },
  { bg: 'linear-gradient(135deg,#92400e,#451a03)', glow: '0 0 20px rgba(146,64,14,0.30)',   text: '#fcd34d' },
  { bg: 'rgba(30,41,59,0.6)',  glow: 'none', text: '#94a3b8' },
  { bg: 'rgba(15,23,42,0.6)',  glow: 'none', text: '#64748b' },
];

export default function OnlineRoundResultsScreen() {
  const { room, isHost } = useOnline();

  if (!room) return null;
  const { code, players, config, currentRound, roundResults, roundSeeds, submissions } = room;

  const playerList = Object.values(players).sort((a, b) => a.joinedAt - b.joinedAt);
  const isLastRound = currentRound >= config.totalRounds;
  const lastResult = roundResults[roundResults.length - 1];

  const sorted = Object.entries(submissions)
    .map(([playerId, sub]) => ({ playerId, ...sub }))
    .sort((a, b) => {
      if (a.isCorrect && !b.isCorrect) return -1;
      if (!a.isCorrect && b.isCorrect) return 1;
      return (a.position || 99) - (b.position || 99);
    });

  const winner = sorted[0]?.isCorrect ? players[sorted[0].playerId] : null;

  const overallRanked = [...playerList].sort((a, b) =>
    b.firstPlaces - a.firstPlaces || b.secondPlaces - a.secondPlaces
  );

  return (
    <div className="min-h-screen flex flex-col p-5 overflow-y-auto">
      {/* Winner announcement */}
      <div className="text-center mb-5">
        {winner ? (
          <>
            <div className="text-4xl mb-2">🏅</div>
            <h2 className="text-2xl font-black text-white">
              <span className="text-amber-400">{winner.name}</span> wins round {currentRound}!
            </h2>
          </>
        ) : (
          <h2 className="text-2xl font-black text-white/60">Round {currentRound} Over</h2>
        )}
      </div>

      {/* Round rankings */}
      <div
        className="glass rounded-2xl p-4 mb-4 space-y-2"
        style={{ border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Round Positions</p>
        {sorted.map((sub, i) => {
          const player = players[sub.playerId];
          if (!player) return null;
          const style = POS_STYLE[i] ?? POS_STYLE[4];
          return (
            <div
              key={sub.playerId}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: style.bg, boxShadow: style.glow }}
            >
              <span className="text-xl w-8 font-black">
                {sub.isCorrect ? (MEDAL[sub.position - 1] ?? `${sub.position}`) : '—'}
              </span>
              <span className="font-black flex-1" style={{ color: style.text }}>{player.name}</span>
              {sub.isCorrect ? (
                <span className="text-green-300 text-sm font-bold">
                  = {lastResult?.correctAnswers[player.id] ?? '?'} ✓
                </span>
              ) : (
                <span className="text-red-400/70 text-xs">No answer</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Seed breakdown per player */}
      <div className="space-y-2 mb-4">
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Seeds &amp; Answers</p>
        {playerList.map(player => {
          const seeds = roundSeeds[player.id] ?? [];
          const correct = lastResult?.correctAnswers[player.id] ?? 0;
          return (
            <div
              key={player.id}
              className="glass rounded-2xl p-3"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-sm">{player.name}</span>
                <span className="text-amber-300 font-black text-sm">= {correct}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {seeds.map(seed => (
                  <SeedCard key={seed.id} seed={seed} revealed showValue />
                ))}
              </div>
              <ZoneBreakdown seeds={seeds} />
            </div>
          );
        })}
      </div>

      {/* Overall standings */}
      <div
        className="glass rounded-2xl p-4 mb-5"
        style={{ border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
          Overall · {currentRound} of {config.totalRounds} rounds
        </p>
        {overallRanked.map((player, i) => (
          <div
            key={player.id}
            className="flex items-center gap-3 py-2.5 border-b last:border-0"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <span className="text-sm font-black w-6" style={{ color: POS_STYLE[i]?.text ?? '#64748b' }}>
              {ORDINAL[i]}
            </span>
            <span className="text-white font-semibold flex-1">{player.name}</span>
            <span className="text-xs space-x-1">
              {player.firstPlaces  > 0 && <span className="text-amber-400 font-bold">★×{player.firstPlaces}</span>}
              {player.secondPlaces > 0 && <span className="text-slate-300 font-bold">✦×{player.secondPlaces}</span>}
              {player.thirdPlaces  > 0 && <span className="text-amber-600 font-bold">◆×{player.thirdPlaces}</span>}
              {!player.firstPlaces && !player.secondPlaces && !player.thirdPlaces && (
                <span className="text-white/20">—</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Host: next round | Non-host: waiting */}
      {isHost ? (
        <button
          onClick={() => nextRound(code)}
          className="btn-shimmer w-full py-4 rounded-2xl text-black font-black text-xl transition-all active:scale-95 shadow-2xl glow-amber"
        >
          {isLastRound ? '🏆 See Final Results' : 'Next Round →'}
        </button>
      ) : (
        <div
          className="glass rounded-2xl py-4 text-center"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
            <p className="text-white/50 font-semibold text-sm">Waiting for host to continue…</p>
          </div>
        </div>
      )}
    </div>
  );
}
