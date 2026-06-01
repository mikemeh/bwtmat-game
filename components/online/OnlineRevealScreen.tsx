'use client';

import { useEffect, useRef, useState } from 'react';
import { useOnline } from '@/lib/online-context';
import { submitAnswer, endRound } from '@/lib/room-service';
import { calculateTotal, LEVEL_NAMES } from '@/lib/seeds';
import SeedCard from '../SeedCard';
import CountdownTimer from '../CountdownTimer';
import ZoneBreakdown from '../ZoneBreakdown';

const AVATAR_COLORS = ['#7c3aed', '#0891b2', '#be185d', '#065f46', '#92400e'];
const POS_BADGE = [
  { bg: '#d97706', text: '#000', label: '1st 🥇' },
  { bg: '#475569', text: '#fff', label: '2nd 🥈' },
  { bg: '#92400e', text: '#fff', label: '3rd 🥉' },
  { bg: '#1e293b', text: '#94a3b8', label: '4th' },
  { bg: '#0f172a', text: '#64748b', label: '5th' },
];

export default function OnlineRevealScreen() {
  const { room, myId, isHost } = useOnline();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [seedsVisible, setSeedsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const endedRef = useRef(false);

  const roundStartedAt = room?.roundStartedAt ?? null;
  const timeLimit = room?.config.timeLimit ?? 60;

  // Sync timer to server timestamp on mount
  useEffect(() => {
    if (roundStartedAt === null) return;
    const elapsed = Math.floor((Date.now() - roundStartedAt) / 1000);
    setTimeLeft(Math.max(0, timeLimit - elapsed));
    const t = setTimeout(() => setSeedsVisible(true), 250);
    return () => clearTimeout(t);
  }, [roundStartedAt, timeLimit]);

  // Tick timer
  useEffect(() => {
    if (!seedsVisible || timeLeft === null || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => (t !== null ? t - 1 : t)), 1000);
    return () => clearInterval(id);
  }, [seedsVisible, timeLeft]);

  // Host ends round when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && isHost && !endedRef.current) {
      endedRef.current = true;
      endRound(room!.code);
    }
  }, [timeLeft, isHost, room]);

  // Host ends round when all players submitted correctly
  useEffect(() => {
    if (!room || endedRef.current) return;
    const playerCount = Object.keys(room.players).length;
    const correctCount = Object.values(room.submissions).filter(s => s.isCorrect).length;
    if (correctCount === playerCount && playerCount > 0 && isHost) {
      endedRef.current = true;
      endRound(room.code);
    }
  }, [room, isHost]);

  if (!room || timeLeft === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">⚡</div>
      </div>
    );
  }

  const mySeeds = room.roundSeeds[myId] ?? [];
  const mySubmission = room.submissions[myId];
  const myIsCorrect = mySubmission?.isCorrect ?? false;
  const myPosition = myIsCorrect ? mySubmission.position : null;
  const playerList = Object.values(room.players).sort((a, b) => a.joinedAt - b.joinedAt);
  const posBadge = myPosition !== null ? POS_BADGE[myPosition - 1] : null;

  function handleSubmit() {
    const val = parseInt(inputValue, 10);
    if (isNaN(val) || myIsCorrect) return;
    const correct = calculateTotal(mySeeds);
    if (val !== correct) {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 800);
      setInputValue('');
    }
    submitAnswer(room!.code, myId, val);
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Round label */}
      <div className="text-center mb-3">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">
          {LEVEL_NAMES[room.config.level]} · Round {room.currentRound}/{room.config.totalRounds}
        </p>
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-4">
        <CountdownTimer seconds={timeLeft} totalSeconds={room.config.timeLimit} />
      </div>

      {/* My seeds + input */}
      <div
        className={`rounded-2xl p-4 mb-4 transition-all ${isWrong ? 'animate-shake' : ''}`}
        style={{
          background: myIsCorrect
            ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(21,128,61,0.06))'
            : isWrong
            ? 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(153,27,27,0.06))'
            : 'rgba(255,255,255,0.05)',
          border: myIsCorrect
            ? '1px solid rgba(34,197,94,0.35)'
            : isWrong
            ? '1px solid rgba(239,68,68,0.40)'
            : '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0"
            style={{ background: AVATAR_COLORS[0], boxShadow: `0 0 14px ${AVATAR_COLORS[0]}55` }}
          >
            {(room.players[myId]?.name ?? 'ME').slice(0, 2).toUpperCase()}
          </div>
          <span className="text-white font-black flex-1">
            {room.players[myId]?.name ?? 'You'}{' '}
            <span className="text-amber-400 text-xs font-bold">(You)</span>
          </span>
          {posBadge && (
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-black"
              style={{ background: posBadge.bg, color: posBadge.text }}
            >
              {posBadge.label}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {mySeeds.map((seed, i) => (
            <SeedCard key={seed.id} seed={seed} revealed={seedsVisible} showValue={myIsCorrect} delay={i * 80} />
          ))}
        </div>

        {!myIsCorrect ? (
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
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
              onClick={handleSubmit}
              disabled={!inputValue}
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
              <span className="text-white/40 text-xs">Total = {calculateTotal(mySeeds)}</span>
            </div>
            <ZoneBreakdown seeds={mySeeds} />
          </div>
        )}
      </div>

      {/* Other players status */}
      <div
        className="glass rounded-2xl p-4 flex-1"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">All Players</p>
        <div className="space-y-2">
          {playerList.map((player, i) => {
            const sub = room.submissions[player.id];
            const correct = sub?.isCorrect ?? false;
            const pos = correct ? sub.position : null;
            const badge = pos !== null ? POS_BADGE[pos - 1] : null;
            return (
              <div key={player.id} className="flex items-center gap-3 py-1">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {player.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white/70 text-sm flex-1">
                  {player.name}
                  {player.id === myId && <span className="text-white/30 text-xs ml-1">(You)</span>}
                </span>
                {correct && badge ? (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-black"
                    style={{ background: badge.bg, color: badge.text }}
                  >
                    {badge.label}
                  </span>
                ) : sub ? (
                  <span className="text-white/20 text-xs">Submitted…</span>
                ) : (
                  <span className="text-white/20 text-xs">Thinking…</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Host-only: end early */}
      {isHost && (
        <button
          onClick={() => {
            if (!endedRef.current) {
              endedRef.current = true;
              endRound(room.code);
            }
          }}
          className="mt-3 w-full py-2.5 rounded-xl text-white/30 hover:text-white/60 text-sm font-semibold transition-all"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          End Round Early
        </button>
      )}
    </div>
  );
}
