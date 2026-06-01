'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OnlineRoom, OnlinePlayer, subscribeToRoom, getOrCreatePlayerId } from './room-service';

interface OnlineCtx {
  room: OnlineRoom | null;
  myId: string;
  me: OnlinePlayer | null;
  isHost: boolean;
}

const OnlineContext = createContext<OnlineCtx | null>(null);

export function OnlineProvider({ code, children }: { code: string; children: ReactNode }) {
  const [room, setRoom] = useState<OnlineRoom | null>(null);
  const myId = getOrCreatePlayerId();

  useEffect(() => {
    const unsub = subscribeToRoom(code, setRoom);
    return unsub;
  }, [code]);

  const me = room?.players[myId] ?? null;
  const isHost = room?.hostId === myId;

  return (
    <OnlineContext.Provider value={{ room, myId, me, isHost }}>
      {children}
    </OnlineContext.Provider>
  );
}

export function useOnline() {
  const ctx = useContext(OnlineContext);
  if (!ctx) throw new Error('useOnline must be used within OnlineProvider');
  return ctx;
}
