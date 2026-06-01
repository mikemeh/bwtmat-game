'use client';

import { useGame } from '@/lib/game-context';
import { MEDAL, LEVEL_NAMES } from '@/lib/seeds';
import GameHeader from './GameHeader';

export default function FinalScreen() {
  const { state, dispatch } = useGame();
  const { players, config, roundResults } = state;

  const ranked = [...players].sort((a, b) =>
    b.firstPlaces - a.firstPlaces || b.secondPlaces - a.secondPlaces || b.thirdPlaces - a.thirdPlaces
  );

  const champion = ranked[0];
  const isTied = ranked.length > 1 && ranked[0].firstPlaces === ranked[1].firstPlaces
    && ranked[0].secondPlaces === ranked[1].secondPlaces;

  return (
    <div className="min-h-screen flex flex-col items-center p-5 overflow-y-auto">
      <div className="w-full max-w-md space-y-6 py-6">
        <GameHeader />
        {/* Champion banner */}
        <div className="text-center space-y-3">
          <div className="text-6xl">🏆</div>
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-widest">Game Over</p>
            <h1 className="text-3xl font-black text-white mt-1">
              {isTied ? 'It\'s a Tie!' : 'BWTmat Champion'}
            </h1>
          </div>

          {isTied ? (
            <div className="flex justify-center gap-3">
              {ranked.slice(0, 2).map(p => (
                <div key={p.id} className="bg-amber-500/20 border border-amber-500/50 rounded-2xl px-5 py-3 text-center">
                  <p className="text-amber-300 font-black text-xl">{p.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl p-5 inline-block mx-auto">
              <p className="text-amber-300 font-black text-3xl">{champion?.name}</p>
              <p className="text-amber-400/70 text-sm mt-1">
                {champion?.firstPlaces ?? 0} First {(champion?.firstPlaces ?? 0) === 1 ? 'Place' : 'Places'}
              </p>
            </div>
          )}
        </div>

        {/* Final standings */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
          <h3 className="text-slate-400 text-xs uppercase tracking-wide font-semibold mb-4">Final Standings</h3>
          <div className="space-y-2">
            {ranked.map((player, i) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-900/40'}`}
              >
                <span className="text-xl w-8">{MEDAL[i] ?? `${i + 1}`}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold">{player.name}</p>
                  <p className="text-slate-400 text-xs">
                    {player.roundPositions.map(p => `${p === 1 ? '🥇' : p === 2 ? '🥈' : p === 3 ? '🥉' : `${p}th`}`).join(' ')}
                  </p>
                </div>
                <div className="text-right text-xs space-y-0.5">
                  {player.firstPlaces > 0 && <p className="text-amber-400 font-bold">★ {player.firstPlaces}×1st</p>}
                  {player.secondPlaces > 0 && <p className="text-slate-300">✦ {player.secondPlaces}×2nd</p>}
                  {player.thirdPlaces > 0 && <p className="text-amber-600">◆ {player.thirdPlaces}×3rd</p>}
                  {player.firstPlaces === 0 && player.secondPlaces === 0 && player.thirdPlaces === 0 && (
                    <p className="text-slate-500">No top 3</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game summary */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-sm text-slate-400">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-white font-bold text-lg">{config.totalRounds}</p>
              <p className="text-xs">Rounds</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{LEVEL_NAMES[config.level].split(' ')[0]}</p>
              <p className="text-xs">Level {config.level}</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{config.seedsPerRound}</p>
              <p className="text-xs">Seeds/Round</p>
            </div>
          </div>
        </div>

        {/* Play again buttons */}
        <div className="space-y-3 pb-4">
          <button
            onClick={() => dispatch({ type: 'SETUP_GAME', players: players.map(p => p.name), config })}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-extrabold text-lg transition-all shadow-lg shadow-amber-500/30"
          >
            Play Again (Same Setup)
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="w-full py-3 rounded-2xl border border-slate-600 text-slate-300 hover:text-white font-semibold text-base transition-all"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
