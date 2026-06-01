'use client';

interface CountdownTimerProps {
  seconds: number;
  totalSeconds: number;
}

export default function CountdownTimer({ seconds, totalSeconds }: CountdownTimerProps) {
  const pct  = Math.max(0, seconds / totalSeconds);
  const isCritical = seconds <= 5;
  const isLow      = seconds <= 10;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  const ringColor  = isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#22c55e';
  const textColor  = isCritical ? '#fca5a5' : isLow ? '#fcd34d' : '#86efac';
  const glowColor  = isCritical
    ? 'rgba(239,68,68,0.7)'
    : isLow
    ? 'rgba(245,158,11,0.5)'
    : 'rgba(34,197,94,0.4)';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = mins > 0
    ? `${mins}:${secs.toString().padStart(2, '0')}`
    : `${secs}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={isCritical ? 'animate-pulse-red rounded-full' : ''}
        style={{ borderRadius: '50%' }}
      >
        <svg
          viewBox="0 0 120 120"
          width="130" height="130"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          {/* Glow ring (blurred duplicate) */}
          <circle cx="60" cy="60" r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="10"
            strokeOpacity="0.3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `blur(4px)`, transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
          />
          {/* Main ring */}
          <circle cx="60" cy="60" r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
          />
          {/* Center number */}
          <text
            x="60" y="66"
            textAnchor="middle"
            fontSize={display.length > 3 ? '24' : '32'}
            fontWeight="900"
            fontFamily="'Orbitron', monospace"
            fill={textColor}
            style={{
              transform: 'rotate(90deg)',
              transformOrigin: '60px 60px',
              filter: `drop-shadow(0 0 8px ${glowColor})`,
              transition: 'fill 0.4s ease',
            }}
          >
            {display}
          </text>
        </svg>
      </div>
      <p className="text-white/30 text-[11px] font-semibold uppercase tracking-widest">
        {isCritical ? '⚡ Hurry!' : isLow ? 'Almost out!' : 'seconds left'}
      </p>
    </div>
  );
}
