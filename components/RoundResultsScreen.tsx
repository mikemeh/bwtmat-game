'use client';

import { useGame } from '@/lib/game-context';
import { MEDAL, ORDINAL } from '@/lib/seeds';
import GameHeader from './GameHeader';
import SeedCard from './SeedCard';

const POS_COLORS = [
  'text-amber-400',
  'text-slate-300',
  'text-amber-600',
  'text-slate-400',
  'text-slate-500',
];

export default function RoundResultsScreen() {
  const { state, dispatch } = useGame();
  const { players, currentRound, config, roundResults, currentSubmissions } = state;

  const isLastRound = currentRound >= config.totalRounds;
  const lastResult = roundResults[roundResults.length - 1];

  const sortedSubmissions = [...currentSubmissions].sort((a, b) => {
    if (a.isCorrect && !b.isCorrect) return -1;
    if (!a.isCorrect && b.isCorrect) return 1;
    return a.position - b.position;
  });

  const getPlayer = (id: string) => players.find(p => p.id === id);

  return (
    <div className="min-h-screen flex flex-col p-5 overflow-y-auto">
      <GameHeader />
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">Round {currentRound} Results</p>
        <h2 className="text-2xl font-black text-white mt-1">
          {sortedSubmissions[0]?.isCorrect
            ? `${getPlayer(sortedSubmissions[0].playerId)?.name ?? ''} wins the round!`
            : 'Round Over'}
        </h2>
      </div>

      {/* Round rankings */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 mb-5 space-y-2">
        <h3 className="text-slate-400 text-xs uppercase tracking-wide font-semibold mb-3">Round Standings</h3>
        {sortedSubmissions.map((sub, i) => {
          const player = getPlayer(sub.playerId);
          if (!player) return null;
          const pos = sub.isCorrect ? sub.position : null;
          return (
            <div key={sub.playerId} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 && sub.isCorrect ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-900/40'}`}>
              <span className={`text-xl font-black w-8 ${POS_COLORS[i] ?? 'text-slate-500'}`}>
                {pos !== null ? MEDAL[pos - 1] ?? `${pos}` : '—'}
              </span>
              <span className="text-white font-semibold flex-1">{player.name}</span>
              {sub.isCorrect ? (
                <span className="text-green-400 text-sm font-bold">
                  = {lastResult?.correctAnswers[player.id] ?? '?'}
                  &nbsp;✓
                </span>
              ) : (
                <span className="text-red-400 text-sm">Did not submit</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Correct answers breakdown */}
      {lastResult && (
        <div className="space-y-3 mb-6">
          <h3 className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Seeds &amp; Correct Answers</h3>
          {players.map(player => {
            const seeds = lastResult.seeds[player.id] ?? [];
            const correct = lastResult.correctAnswers[player.id] ?? 0;
            return (
              <div key={player.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">{player.name}</span>
                  <span className="text-amber-300 font-bold text-sm">Total: {correct}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {seeds.map(seed => (
                    <SeedCard key={seed.id} seed={seed} revealed showValue />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Overall standings */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 mb-6">
        <h3 className="text-slate-400 text-xs uppercase tracking-wide font-semibold mb-3">Overall After {currentRound} Rounds</h3>
        {[...players]
          .sort((a, b) => b.firstPlaces - a.firstPlaces || b.secondPlaces - a.secondPlaces || b.thirdPlaces - a.thirdPlaces)
          .map((player, i) => (
            <div key={player.id} className="flex items-center gap-3 py-2 border-b border-slate-700/50 last:border-0">
              <span className={`text-sm font-black w-6 ${POS_COLORS[i] ?? 'text-slate-500'}`}>{ORDINAL[i]}</span>
              <span className="text-white font-medium flex-1">{player.name}</span>
              <span className="text-slate-400 text-xs">
                {player.firstPlaces > 0 && <span className="text-amber-400">★×{player.firstPlaces} </span>}
                {player.secondPlaces > 0 && <span className="text-slate-300">✦×{player.secondPlaces} </span>}
                {player.thirdPlaces > 0 && <span className="text-amber-600">◆×{player.thirdPlaces}</span>}
                {player.firstPlaces === 0 && player.secondPlaces === 0 && player.thirdPlaces === 0 && '—'}
              </span>
            </div>
          ))}
      </div>

      {/* Action button */}
      <button
        onClick={() => dispatch({ type: 'NEXT_ROUND' })}
        className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-extrabold text-xl transition-all shadow-lg shadow-amber-500/30"
      >
        {isLastRound ? 'See Final Results' : `Next Round →`}
      </button>
    </div>
  );
}
