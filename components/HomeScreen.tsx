'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-context';
import HowToPlayModal from './HowToPlayModal';

export default function HomeScreen() {
  const { dispatch } = useGame();
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background seeds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['red','green','blue','green','red','blue','green'].map((c, i) => (
          <div
            key={i}
            className={`absolute rounded-2xl opacity-10 ${
              c === 'red' ? 'bg-red-500' : c === 'green' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{
              width: 56, height: 72,
              top: `${10 + (i * 13) % 80}%`,
              left: `${5 + (i * 17) % 90}%`,
              transform: `rotate(${i % 2 === 0 ? 12 : -8}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-sm w-full">
        {/* Logo image */}
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="BWTmat Game"
            className="w-full max-w-xs drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 24px rgba(251,191,36,0.35))' }}
          />
        </div>

        {/* Tagline */}
        <p className="text-slate-400 text-sm leading-relaxed">
          Fast-thinking · Number-crunching · Color-coded strategy
        </p>

        {/* Feature pills */}
        <div className="flex justify-center gap-2 flex-wrap">
          {['1–5 Players', 'Ages 6+', '60–90 sec', '5 Levels'].map(f => (
            <span key={f} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium px-3 py-1 rounded-full">
              {f}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => dispatch({ type: 'GO_SETUP' })}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-extrabold text-xl transition-all shadow-lg shadow-amber-500/30"
          >
            Start Game
          </button>
          <button
            onClick={() => setShowRules(true)}
            className="w-full py-3 rounded-2xl border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-base transition-all"
          >
            How to Play
          </button>
        </div>

        <p className="text-slate-600 text-xs">From the codes of Bomsy Wall Tennis</p>
      </div>

      {showRules && <HowToPlayModal onClose={() => setShowRules(false)} />}
    </div>
  );
}
