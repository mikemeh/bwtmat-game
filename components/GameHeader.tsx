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
      <button
        onClick={handleHome}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
      >
        <span className="text-base">⌂</span>
        <span>Home</span>
      </button>
      {subtitle && (
        <span className="text-slate-500 text-xs">{subtitle}</span>
      )}
    </div>
  );
}
