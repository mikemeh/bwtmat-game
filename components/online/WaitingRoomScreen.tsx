'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useOnline } from '@/lib/online-context';
import { updateRoomConfig, startGame } from '@/lib/room-service';
import { SEEDS_PER_LEVEL, TIME_PER_LEVEL, LEVEL_NAMES } from '@/lib/seeds';
import { GameConfig } from '@/lib/types';

const LEVEL_ICONS = ['', '⚡', '🔥', '💡', '🧠', '🏆'];
const AVATAR_COLORS = ['#7c3aed', '#0891b2', '#be185d', '#065f46', '#92400e'];

export default function WaitingRoomScreen() {
  const { room, myId, isHost } = useOnline();
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!room) return null;
  const { code, players, config } = room;
  const playerList = Object.values(players).sort((a, b) => a.joinedAt - b.joinedAt);

  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfig(partial: Partial<GameConfig>) {
    const newConfig: GameConfig = { ...config, ...partial };
    if (partial.level) {
      newConfig.seedsPerRound = SEEDS_PER_LEVEL[partial.level];
      newConfig.timeLimit = TIME_PER_LEVEL[partial.level];
    }
    updateRoomConfig(code, newConfig);
  }

  async function handleStart() {
    setStarting(true);
    await startGame(code);
  }

  return (
    <div className="min-h-screen flex flex-col p-5">
      {/* Nav */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-white/40 hover:text-white transition-colors text-xl leading-none">⌂</Link>
        <p className="flex-1 text-center text-white/30 text-xs font-bold uppercase tracking-widest">
          Online Lobby
        </p>
      </div>

      {/* Room code */}
      <div
        className="glass rounded-2xl p-5 mb-4 text-center"
        style={{ border: '1px solid rgba(245,158,11,0.30)' }}
      >
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
          Share this code with friends
        </p>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-amber-300 font-black text-4xl tracking-[0.15em] font-mono">{code}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: copied ? 'rgba(34,197,94,0.20)' : 'rgba(255,255,255,0.08)',
              color: copied ? '#4ade80' : '#fff',
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
        <p className="text-white/20 text-xs">
          Others go to the game → Online → Join Room
        </p>
      </div>

      {/* Players */}
      <div
        className="glass rounded-2xl p-4 mb-4"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
          Players ({playerList.length}/5)
        </p>
        <div className="space-y-2">
          {playerList.map((player, i) => {
            const isMe = player.id === myId;
            return (
              <div
                key={player.id}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                style={{
                  background: isMe ? 'rgba(245,158,11,0.08)' : 'transparent',
                  border: isMe ? '1px solid rgba(245,158,11,0.20)' : '1px solid transparent',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {player.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white font-bold flex-1 text-sm">{player.name}</span>
                {player.isHost && (
                  <span className="text-amber-400 text-xs font-black">HOST</span>
                )}
                {isMe && !player.isHost && (
                  <span className="text-white/30 text-xs">You</span>
                )}
              </div>
            );
          })}
        </div>
        {playerList.length < 2 && (
          <p className="text-white/25 text-xs text-center mt-3 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            Need at least 2 players to start
          </p>
        )}
      </div>

      {/* Settings (host) */}
      {isHost && (
        <div
          className="glass rounded-2xl p-4 mb-4"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">
            Game Settings
          </p>

          <p className="text-white/50 text-xs mb-2">Level</p>
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {[1, 2, 3, 4, 5].map(l => (
              <button
                key={l}
                onClick={() => handleConfig({ level: l })}
                className="py-2.5 rounded-xl text-base font-black transition-all"
                style={{
                  background: config.level === l ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)',
                  border: config.level === l ? '1px solid rgba(245,158,11,0.55)' : '1px solid rgba(255,255,255,0.07)',
                  color: config.level === l ? '#fcd34d' : '#ffffff50',
                }}
              >
                {LEVEL_ICONS[l]}
              </button>
            ))}
          </div>

          <p className="text-white/50 text-xs mb-2">Rounds</p>
          <div className="flex gap-2 mb-3">
            {[3, 5, 7, 10].map(r => (
              <button
                key={r}
                onClick={() => handleConfig({ totalRounds: r })}
                className="flex-1 py-2 rounded-xl text-sm font-black transition-all"
                style={{
                  background: config.totalRounds === r ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)',
                  border: config.totalRounds === r ? '1px solid rgba(245,158,11,0.55)' : '1px solid rgba(255,255,255,0.07)',
                  color: config.totalRounds === r ? '#fcd34d' : '#ffffff50',
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <p className="text-white/25 text-xs text-center">
            {LEVEL_NAMES[config.level]} · {config.seedsPerRound} seeds · {config.timeLimit}s per round
          </p>
        </div>
      )}

      {/* Settings (non-host) */}
      {!isHost && (
        <div
          className="glass rounded-2xl p-3 mb-4 text-center"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-white/30 text-xs">
            {LEVEL_NAMES[config.level]} &nbsp;·&nbsp; Level {config.level} &nbsp;·&nbsp; {config.seedsPerRound} seeds &nbsp;·&nbsp; {config.timeLimit}s &nbsp;·&nbsp; {config.totalRounds} rounds
          </p>
        </div>
      )}

      {/* CTA */}
      {isHost ? (
        <button
          onClick={handleStart}
          disabled={playerList.length < 2 || starting}
          className="btn-shimmer w-full py-5 rounded-2xl text-black font-black text-xl transition-all active:scale-95 shadow-2xl glow-amber disabled:opacity-40"
        >
          {starting ? 'Starting…' : '▶ Start Game'}
        </button>
      ) : (
        <div
          className="glass rounded-2xl py-5 text-center"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
            <p className="text-white/50 font-semibold">Waiting for host to start…</p>
          </div>
        </div>
      )}
    </div>
  );
}
