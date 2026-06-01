'use client';

import { useGame } from '@/lib/game-context';

interface GameHeaderProps {
  subtitle?: string;
}

export default function GameHeader({ subtitle }: GameHeaderProps) {
  const { dispatch } = useGame();

  const handleHome = () => {
    if (confirm('Return to home? Your current game progress will be lost.')) {
      dispatch({ type: 'RESET' });
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={handleHome}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold transition-all px-3 py-1.5 rounded-xl hover:bg-white/05"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-base">⌂</span>
        <span>Home</span>
      </button>
      {subtitle && <span className="text-white/25 text-xs font-semibold">{subtitle}</span>}
    </div>
  );
}
