'use client';

import { useState } from 'react';
import { useOnline } from '@/lib/online-context';
import { beginReveal } from '@/lib/room-service';
import { LEVEL_NAMES } from '@/lib/seeds';
import GameBoard from '../GameBoard';

const AVATAR_COLORS = ['#7c3aed', '#0891b2', '#be185d', '#065f46', '#92400e'];

export default function OnlineDrawScreen() {
  const { room, myId, me, isHost } = useOnline();
  const [showBoard, setShowBoard] = useState(false);

  if (!room || !me) return null;
  const { code, config, currentRound, players, roundSeeds } = room;
  const mySeeds = roundSeeds[myId] ?? [];
  const playerList = Object.values(players).sort((a, b) => a.joinedAt - b.joinedAt);

  return (
    <div className="min-h-screen flex flex-col p-5">
      {/* Level / Round badge */}
      <div className="text-center mb-5">
        <span
          className="glass border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
        >
          {LEVEL_NAMES[config.level]} · Level {config.level}
        </span>
        <h2 className="text-2xl font-black text-white mt-3">
          Round <span className="text-amber-400">{currentRound}</span>
          <span className="text-white/30"> / {config.totalRounds}</span>
        </h2>
        <p className="text-white/30 text-xs mt-1">
          {config.seedsPerRound} seeds · {config.timeLimit}s timer
        </p>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowBoard(false)}
          className="flex-1 py-2 rounded-xl text-sm font-black transition-all"
          style={{
            background: !showBoard ? 'rgba(245,158,11,0.20)' : 'rgba(255,255,255,0.05)',
            border: !showBoard ? '1px solid rgba(245,158,11,0.50)' : '1px solid rgba(255,255,255,0.08)',
            color: !showBoard ? '#fcd34d' : '#ffffff60',
          }}
        >
          ✊ Your Seeds
        </button>
        <button
          onClick={() => setShowBoard(true)}
          className="flex-1 py-2 rounded-xl text-sm font-black transition-all"
          style={{
            background: showBoard ? 'rgba(245,158,11,0.20)' : 'rgba(255,255,255,0.05)',
            border: showBoard ? '1px solid rgba(245,158,11,0.50)' : '1px solid rgba(255,255,255,0.08)',
            color: showBoard ? '#fcd34d' : '#ffffff60',
          }}
        >
          🎯 Game Board
        </button>
      </div>

      {showBoard ? (
        <div className="flex-1 overflow-y-auto">
          <GameBoard />
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto">
          {/* Instruction */}
          <div
            className="glass border border-amber-500/20 rounded-2xl p-3 text-center"
            style={{ background: 'rgba(245,158,11,0.06)' }}
          >
            <p className="text-2xl mb-1">✊</p>
            <p className="text-amber-300 font-bold text-sm">Your seeds are dealt! Hold your fist closed.</p>
            <p className="text-white/40 text-xs mt-1">
              {isHost
                ? 'Tap Reveal & Start Timer when everyone is ready.'
                : 'Wait for the host to reveal the seeds.'}
            </p>
          </div>

          {/* My hidden seeds */}
          <div
            className="glass rounded-2xl p-4"
            style={{ border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <p className="text-white font-bold text-sm mb-3">
              {me.name} <span className="text-amber-400 text-xs font-bold">(You)</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mySeeds.map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl flex items-center justify-center"
                  style={{
                    width: 44, height: 56,
                    background: 'linear-gradient(145deg,#1e293b,#0f172a)',
                    border: '2px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.20)', fontWeight: 900 }}>?</span>
                </div>
              ))}
            </div>
          </div>

          {/* Other players */}
          <div
            className="glass rounded-2xl p-4"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Other Players</p>
            <div className="space-y-2">
              {playerList
                .filter(p => p.id !== myId)
                .map((player, i) => (
                  <div key={player.id} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0"
                      style={{ background: AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length] }}
                    >
                      {player.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-white/60 text-sm flex-1">{player.name}</span>
                    <span className="text-white/20 text-xs">
                      {(roundSeeds[player.id] ?? []).length} seeds
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-5">
        {isHost ? (
          <>
            <button
              onClick={() => beginReveal(code)}
              className="btn-shimmer w-full py-5 rounded-2xl text-black font-black text-xl transition-all active:scale-95 shadow-2xl glow-amber"
            >
              ▶ Reveal &amp; Start Timer
            </button>
            <p className="text-center text-white/25 text-xs mt-2">All seeds flip simultaneously for everyone</p>
          </>
        ) : (
          <div
            className="glass rounded-2xl py-5 text-center"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
              <p className="text-white/50 font-semibold text-sm">Waiting for host to reveal…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
