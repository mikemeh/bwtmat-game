'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/lib/game-context';
import HowToPlayModal from './HowToPlayModal';

const FLOATERS = [
  { color: 'bg-red-500',   cls: 'float-1', top: '8%',  left: '5%',  rot: 15  },
  { color: 'bg-green-500', cls: 'float-2', top: '20%', left: '88%', rot: -10 },
  { color: 'bg-blue-500',  cls: 'float-3', top: '55%', left: '3%',  rot: 8   },
  { color: 'bg-green-500', cls: 'float-4', top: '70%', left: '91%', rot: -15 },
  { color: 'bg-red-500',   cls: 'float-5', top: '40%', left: '93%', rot: 20  },
  { color: 'bg-blue-500',  cls: 'float-6', top: '82%', left: '7%',  rot: -8  },
  { color: 'bg-green-500', cls: 'float-7', top: '15%', left: '50%', rot: 12  },
  { color: 'bg-red-500',   cls: 'float-8', top: '88%', left: '55%', rot: -5  },
];

export default function HomeScreen() {
  const { dispatch } = useGame();
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* ── Background: logo image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/logo.jpg')" }}
      />
      {/* gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85" />
      <div className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(109,40,217,0.12) 0%, transparent 70%),' +
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(245,158,11,0.10) 0%, transparent 70%)',
        }}
      />

      {/* ── Floating seed decorations ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATERS.map((f, i) => (
          <div
            key={i}
            className={`absolute rounded-2xl ${f.color} ${f.cls}`}
            style={{ width: 52, height: 68, top: f.top, left: f.left, transform: `rotate(${f.rot}deg)` }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-10">
        <div className="w-full max-w-sm space-y-8 text-center">

          {/* Logo hero */}
          <div className="animate-pop" style={{ animationDelay: '0ms' }}>
            <img
              src="/logo.jpg"
              alt="BWTmat Game"
              className="w-full max-w-[300px] mx-auto rounded-3xl animate-logo-pulse"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
            />
          </div>

          {/* Tagline */}
          <div className="animate-pop" style={{ animationDelay: '80ms' }}>
            <p className="text-white/60 text-sm tracking-wide">
              Fast-thinking &nbsp;·&nbsp; Color-coded &nbsp;·&nbsp; Strategy
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex justify-center gap-2 flex-wrap animate-pop" style={{ animationDelay: '160ms' }}>
            {[
              { label: '1–5 Players', icon: '👥' },
              { label: 'Ages 6+',     icon: '🎯' },
              { label: '60–90 sec',   icon: '⚡' },
              { label: '5 Levels',    icon: '🏆' },
            ].map(({ label, icon }) => (
              <span
                key={label}
                className="glass flex items-center gap-1 text-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-500/25"
              >
                <span>{icon}</span> {label}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-3 animate-pop" style={{ animationDelay: '240ms' }}>
            <button
              onClick={() => dispatch({ type: 'GO_SETUP' })}
              className="btn-shimmer w-full py-4 rounded-2xl text-black font-black text-xl transition-all active:scale-95 shadow-2xl glow-amber"
            >
              🎮 Local Game
            </button>
            <Link
              href="/online"
              className="glass flex items-center justify-center w-full py-4 rounded-2xl text-white font-black text-lg transition-all active:scale-95 border border-white/20 hover:border-white/30"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            >
              🌐 Online Multiplayer
            </Link>
            <button
              onClick={() => setShowRules(true)}
              className="glass w-full py-3 rounded-2xl text-white font-bold text-base transition-all hover:border-white/25 active:scale-95 border border-white/15"
            >
              How to Play
            </button>
          </div>

          {/* Footer */}
          <p className="text-white/20 text-xs animate-pop" style={{ animationDelay: '320ms' }}>
            From the codes of Bomsy Wall Tennis
          </p>
        </div>
      </div>

      {showRules && <HowToPlayModal onClose={() => setShowRules(false)} />}
    </div>
  );
}
