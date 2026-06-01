'use client';

import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/lib/game-context';
import { calculateTotal, LEVEL_NAMES, ORDINAL } from '@/lib/seeds';
import GameHeader from './GameHeader';
import SeedCard from './SeedCard';
import CountdownTimer from './CountdownTimer';

export default function RevealScreen() {
  const { state, dispatch } = useGame();
  const { players, config, currentRound, roundSeeds, currentSubmissions, submissionCount } = state;

  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [seedsVisible, setSeedsVisible] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [wrongPlayers, setWrongPlayers] = useState<Set<string>>(new Set());
  const endedRef = useRef(false);

  // Animate seed reveal on mount
  useEffect(() => {
    const t = setTimeout(() => setSeedsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!seedsVisible) return;
    if (timeLeft <= 0) {
      if (!endedRef.current) { endedRef.current = true; dispatch({ type: 'END_ROUND' }); }
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [seedsVisible, timeLeft, dispatch]);

  // Auto-end when all players submitted correctly
  useEffect(() => {
    if (submissionCount === players.length && !endedRef.current) {
      endedRef.current = true;
      dispatch({ type: 'END_ROUND' });
    }
  }, [submissionCount, players.length, dispatch]);

  const getPlayerPosition = (playerId: string): number | null => {
    const sub = currentSubmissions.find(s => s.playerId === playerId && s.isCorrect);
    return sub ? sub.position : null;
  };

  const hasSubmittedCorrectly = (playerId: string) =>
    currentSubmissions.some(s => s.playerId === playerId && s.isCorrect);

  const handleSubmit = (playerId: string) => {
    const raw = inputValues[playerId] ?? '';
    const val = parseInt(raw, 10);
    if (isNaN(val)) return;

    dispatch({ type: 'SUBMIT_ANSWER', playerId, answer: val });

    // Check optimistically — real result is in state after dispatch
    setTimeout(() => {
      const correct = calculateTotal(state.roundSeeds[playerId] ?? []);
      if (val !== correct) {
        setWrongPlayers(prev => new Set([...prev, playerId]));
        setTimeout(() => {
          setWrongPlayers(prev => { const n = new Set(prev); n.delete(playerId); return n; });
        }, 800);
        setInputValues(prev => ({ ...prev, [playerId]: '' }));
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent, playerId: string) => {
    if (e.key === 'Enter') handleSubmit(playerId);
  };

  const positionBadge = (pos: number) => {
    const colors = ['bg-amber-500 text-black', 'bg-slate-400 text-black', 'bg-amber-700 text-white', 'bg-slate-600 text-white', 'bg-slate-700 text-white'];
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-black ${colors[pos - 1] ?? colors[4]}`}>
        {ORDINAL[pos - 1] ?? `${pos}th`}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <GameHeader />
      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-slate-400 text-xs uppercase tracking-widest">{LEVEL_NAMES[config.level]} · Round {currentRound}/{config.totalRounds}</p>
      </div>

      {/* Timer */}
      <div className="mb-5">
        <CountdownTimer seconds={timeLeft} totalSeconds={config.timeLimit} />
      </div>

      {/* Player sections */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {players.map(player => {
          const seeds = roundSeeds[player.id] ?? [];
          const correct = hasSubmittedCorrectly(player.id);
          const position = getPlayerPosition(player.id);
          const isWrong = wrongPlayers.has(player.id);

          return (
            <div
              key={player.id}
              className={`rounded-2xl border p-4 transition-colors ${
                correct
                  ? 'border-green-600 bg-green-900/20'
                  : isWrong
                  ? 'border-red-600 bg-red-900/20 animate-shake'
                  : 'border-slate-700 bg-slate-800/60'
              }`}
            >
              {/* Player name row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold">{player.name}</span>
                {position !== null && positionBadge(position)}
                {correct && !position && (
                  <span className="text-green-400 text-sm font-bold">✓</span>
                )}
              </div>

              {/* Seeds */}
              <div className="flex flex-wrap gap-2 mb-3">
                {seeds.map((seed, i) => (
                  <SeedCard
                    key={seed.id}
                    seed={seed}
                    revealed={seedsVisible}
                    showValue={seedsVisible && correct}
                    delay={i * 80}
                  />
                ))}
              </div>

              {/* Submit row */}
              {!correct && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={inputValues[player.id] ?? ''}
                    onChange={e => setInputValues(prev => ({ ...prev, [player.id]: e.target.value }))}
                    onKeyDown={e => handleKeyDown(e, player.id)}
                    placeholder="Your total..."
                    className="flex-1 bg-slate-900 border border-slate-600 focus:border-amber-500 rounded-xl px-3 py-2 text-white text-base outline-none transition-colors"
                  />
                  <button
                    onClick={() => handleSubmit(player.id)}
                    disabled={!inputValues[player.id]}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all active:scale-95"
                  >
                    Submit
                  </button>
                </div>
              )}

              {correct && (
                <div className="text-green-400 text-sm font-semibold flex items-center gap-2">
                  <span>✓ Correct!</span>
                  <span className="text-slate-400 text-xs">
                    Total: {calculateTotal(seeds)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* End round manually */}
      <div className="mt-3">
        <button
          onClick={() => { if (!endedRef.current) { endedRef.current = true; dispatch({ type: 'END_ROUND' }); } }}
          className="w-full py-2 rounded-xl border border-slate-600 text-slate-400 hover:text-white text-sm font-medium transition-all"
        >
          End Round Early
        </button>
      </div>
    </div>
  );
}
