'use client';

interface CountdownTimerProps {
  seconds: number;
  totalSeconds: number;
}

export default function CountdownTimer({ seconds, totalSeconds }: CountdownTimerProps) {
  const pct = (seconds / totalSeconds) * 100;
  const isLow = seconds <= 10;
  const isCritical = seconds <= 5;

  const color = isCritical
    ? 'text-red-400'
    : isLow
    ? 'text-amber-400'
    : 'text-emerald-400';

  const barColor = isCritical
    ? 'bg-red-500'
    : isLow
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = mins > 0
    ? `${mins}:${secs.toString().padStart(2, '0')}`
    : `${secs}`;

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs mx-auto">
      <div className={`font-mono font-black text-5xl tabular-nums ${color} ${isCritical ? 'animate-pulse' : ''}`}>
        {display}
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-slate-400 text-xs uppercase tracking-widest">seconds remaining</p>
    </div>
  );
}
