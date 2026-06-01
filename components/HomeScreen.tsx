'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-context';
import HowToPlayModal from './HowToPlayModal';

export default function HomeScreen() {
  const { dispatch } = useGame();
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Full-screen background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/logo.jpg')" }}
      />
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center space-y-8 max-w-sm w-full">

          {/* Logo image — hero */}
          <div className="flex justify-center">
            <img
              src="/logo.jpg"
              alt="BWTmat Game"
              className="w-full max-w-xs rounded-2xl shadow-2xl"
              style={{ filter: 'drop-shadow(0 0 32px rgba(251,191,36,0.5))' }}
            />
          </div>

          {/* Tagline */}
          <p className="text-slate-300 text-sm leading-relaxed">
            Fast-thinking · Number-crunching · Color-coded strategy
          </p>

          {/* Feature pills */}
          <div className="flex justify-center gap-2 flex-wrap">
            {['1–5 Players', 'Ages 6+', '60–90 sec', '5 Levels'].map(f => (
              <span key={f} className="bg-black/50 border border-yellow-500/40 text-yellow-200 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => dispatch({ type: 'GO_SETUP' })}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-extrabold text-xl transition-all shadow-xl shadow-amber-500/40"
            >
              Start Game
            </button>
            <button
              onClick={() => setShowRules(true)}
              className="w-full py-3 rounded-2xl border border-white/30 hover:border-white/60 bg-black/30 backdrop-blur-sm text-white hover:text-white font-semibold text-base transition-all"
            >
              How to Play
            </button>
          </div>

          <p className="text-white/30 text-xs">From the codes of Bomsy Wall Tennis</p>
        </div>
      </div>

      {showRules && <HowToPlayModal onClose={() => setShowRules(false)} />}
    </div>
  );
}
