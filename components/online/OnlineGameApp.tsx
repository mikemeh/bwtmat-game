'use client';

import { useEffect, useState } from 'react';
import { useOnline } from '@/lib/online-context';
import WaitingRoomScreen from './WaitingRoomScreen';
import OnlineDrawScreen from './OnlineDrawScreen';
import OnlineRevealScreen from './OnlineRevealScreen';
import OnlineRoundResultsScreen from './OnlineRoundResultsScreen';
import OnlineFinalScreen from './OnlineFinalScreen';
import Link from 'next/link';

export default function OnlineGameApp() {
  const { room } = useOnline();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (room) return;
    const timer = setTimeout(() => setNotFound(true), 6000);
    return () => clearTimeout(timer);
  }, [room]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          {notFound ? (
            <>
              <div className="text-5xl">😕</div>
              <p className="text-white font-black text-xl">Room Not Found</p>
              <p className="text-white/40 text-sm">Check the code and try again.</p>
              <Link
                href="/online"
                className="inline-block mt-4 px-6 py-3 rounded-xl text-black font-black transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
              >
                Try Again
              </Link>
            </>
          ) : (
            <>
              <div className="text-4xl animate-spin">⚡</div>
              <p className="text-white/50 font-semibold">Connecting to room…</p>
            </>
          )}
        </div>
      </div>
    );
  }

  switch (room.status) {
    case 'lobby':          return <WaitingRoomScreen />;
    case 'draw':           return <OnlineDrawScreen />;
    case 'reveal':         return <OnlineRevealScreen />;
    case 'round-results':  return <OnlineRoundResultsScreen />;
    case 'final':          return <OnlineFinalScreen />;
    default:               return <WaitingRoomScreen />;
  }
}
