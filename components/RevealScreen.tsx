'use client';

import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/lib/game-context';
import { calculateTotal, LEVEL_NAMES, ORDINAL } from '@/lib/seeds';
import SeedCard from './SeedCard';
import CountdownTimer from './CountdownTimer';
import GameHeader from './GameHeader';
import ZoneBreakdown from './ZoneBreakdown';

const AVATAR_COLORS = ['#7c3aed','#0891b2','#be185d','#065f46','#92400e'];
const POS_BADGE = [
  { bg: '#d97706', text: '#000', label: '1st 🥇' },
  { bg: '#475569', text: '#fff', label: '2nd 🥈' },
  { bg: '#92400e', text: '#fff', label: '3rd 🥉' },
  { bg: '#1e293b', text: '#94a3b8', label: '4th' },
  { bg: '#0f172a', text: '#64748b', label: '5th' },
];

export default function RevealScreen() {
  const { state, dispatch } = useGame();
  const { players, config, currentRound, roundSeeds, currentSubmissions, submissionCount } = state;

  const [timeLeft, setTimeLeft]       = useState(config.timeLimit);
  const [seedsVisible, setSeedsVisible] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [wrongPlayers, setWrongPlayers] = useState<Set<string>>(new Set());
  const endedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setSeedsVisible(true), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!seedsVisible) return;
    if (timeLeft <= 0) {
      if (!endedRef.current) { endedRef.current = true; dispatch({ type: 'END_ROUND' }); }
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [seedsVisible, timeLeft, dispatch]);

  useEffect(() => {
    if (submissionCount === players.length && !endedRef.current) {
      endedRef.current = true;
      dispatch({ type: 'END_ROUND' });
    }
  }, [submissionCount, players.length, dispatch]);

  const getPosition = (playerId: string) =>
    currentSubmissions.find(s => s.playerId === playerId && s.isCorrect)?.position ?? null;

  const isCorrect = (playerId: string) =>
    currentSubmissions.some(s => s.playerId === playerId && s.isCorrect);

  const handleSubmit = (playerId: string) => {
    const val = parseInt(inputValues[playerId] ?? '', 10);
    if (isNaN(val)) return;
    dispatch({ type: 'SUBMIT_ANSWER', playerId, answer: val });
    setTimeout(() => {
      const correct = calculateTotal(state.roundSeeds[playerId] ?? []);
      if (val !== correct) {
        setWrongPlayers(prev => new Set([...prev, playerId]));
        setTimeout(() => setWrongPlayers(prev => { const n = new Set(prev); n.delete(playerId); return n; }), 800);
        setInputValues(prev => ({ ...prev, [playerId]: '' }));
      }
    }, 50);
  };

  const handleKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') handleSubmit(id);
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <GameHeader />

      {/* Round label */}
      <div className="text-center mb-3">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">
          {LEVEL_NAMES[config.level]} · Round {currentRound}/{config.totalRounds}
        </p>
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-4">
        <CountdownTimer seconds={timeLeft} totalSeconds={config.timeLimit} />
      </div>

      {/* Player sections */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {players.map((player, pi) => {
          const seeds    = roundSeeds[player.id] ?? [];
          const correct  = isCorrect(player.id);
          const position = getPosition(player.id);
          const isWrong  = wrongPlayers.has(player.id);
          const initials = player.name.slice(0, 2).toUpperCase();
          const avatarColor = AVATAR_COLORS[pi % AVATAR_COLORS.length];
          const posBadge = position !== null ? POS_BADGE[position - 1] : null;

          return (
            <div
              key={player.id}
              className={`rounded-2xl p-4 transition-all ${isWrong ? 'animate-shake' : ''}`}
              style={{
                background: correct
                  ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(21,128,61,0.06))'
                  : isWrong
                  ? 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(153,27,27,0.06))'
                  : 'rgba(255,255,255,0.05)',
                border: correct
                  ? '1px solid rgba(34,197,94,0.35)'
                  : isWrong
                  ? '1px solid rgba(239,68,68,0.40)'
                  : '1px solid rgba(255,255,255,0.09)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Header row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0"
                  style={{ background: avatarColor, boxShadow: `0 0 14px ${avatarColor}55` }}>
                  {initials}
                </div>
                <span className="text-white font-black flex-1">{player.name}</span>
                {posBadge && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black"
                    style={{ background: posBadge.bg, color: posBadge.text }}>
                    {posBadge.label}
                  </span>
                )}
              </div>

              {/* Seeds */}
              <div className="flex flex-wrap gap-2 mb-3">
                {seeds.map((seed, i) => (
                  <SeedCard key={seed.id} seed={seed} revealed={seedsVisible} showValue={correct} delay={i * 80} />
                ))}
              </div>

              {/* Submit or result */}
              {!correct ? (
                <div className="flex gap-2">
                  <input
                    type="number" inputMode="numeric"
                    value={inputValues[player.id] ?? ''}
                    onChange={e => setInputValues(p => ({ ...p, [player.id]: e.target.value }))}
                    onKeyDown={e => handleKey(e, player.id)}
                    placeholder="Your total…"
                    className="flex-1 rounded-xl px-4 py-2.5 text-white font-bold text-base outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: `1.5px solid ${isWrong ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.12)'}`,
                    }}
                    onFocus={e => (e.target.style.border = '1.5px solid rgba(245,158,11,0.7)')}
                    onBlur={e => (e.target.style.border = `1.5px solid ${isWrong ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.12)'}`)}
                  />
                  <button
                    onClick={() => handleSubmit(player.id)}
                    disabled={!inputValues[player.id]}
                    className="px-5 py-2.5 rounded-xl font-black text-sm text-black transition-all active:scale-95 disabled:opacity-30"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
                  >
                    GO!
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-black text-sm">✓ Correct!</span>
                    <span className="text-white/40 text-xs">Total = {calculateTotal(seeds)}</span>
                  </div>
                  <ZoneBreakdown seeds={seeds} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* End round early */}
      <button
        onClick={() => { if (!endedRef.current) { endedRef.current = true; dispatch({ type: 'END_ROUND' }); } }}
        className="mt-3 w-full py-2.5 rounded-xl text-white/30 hover:text-white/60 text-sm font-semibold transition-all"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        End Round Early
      </button>
    </div>
  );
}
