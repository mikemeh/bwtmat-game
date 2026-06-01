'use client';

export default function GameBoard() {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ maxWidth: 340, margin: '0 auto' }}>

      {/* Seed Bag Zone — dark navy with number circles */}
      <div className="relative px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(180deg,#0a0f2e 0%,#111827 100%)' }}>
        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Seed Bag</p>
        <div className="flex flex-wrap justify-center gap-2 mb-1">
          {[3,5,10,7,3,7,9,5,1,2,8,6,4].map((n, i) => (
            <div key={i}
              className="flex items-center justify-center rounded-full bg-white font-black text-[11px]"
              style={{ width: 26, height: 26, color: '#0a0f2e', flexShrink: 0 }}>
              {n}
            </div>
          ))}
          {/* Special seeds */}
          {['3³','5d','7d'].map((n, i) => (
            <div key={`sp-${i}`}
              className="flex items-center justify-center rounded-full font-black text-[10px]"
              style={{ width: 26, height: 26, background: '#fde68a', color: '#78350f', flexShrink: 0 }}>
              {n}
            </div>
          ))}
        </div>
        <p className="text-center text-white/15 text-[9px] mt-2">BOMSY WALL TENNIS</p>
      </div>

      {/* No Score Zone — orange X */}
      <div className="relative flex items-center justify-center overflow-hidden"
        style={{ background: '#f5f0e8', minHeight: 80 }}>
        {/* X arms */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            position: 'absolute', width: '140%', height: 32,
            background: 'linear-gradient(90deg,#e8541a,#f97316)',
            transform: 'rotate(25deg)', opacity: 0.85, borderRadius: 4,
          }} />
          <div style={{
            position: 'absolute', width: '140%', height: 32,
            background: 'linear-gradient(90deg,#e8541a,#f97316)',
            transform: 'rotate(-25deg)', opacity: 0.85, borderRadius: 4,
          }} />
        </div>
        <div className="relative z-10 text-center">
          <p className="font-black text-sm" style={{ color: '#7f1d1d', textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}>
            No Score Zone
          </p>
          <p className="text-[10px] font-bold" style={{ color: '#9a3412', opacity: 0.8 }}>Seeds here = 0 points</p>
        </div>
      </div>

      {/* Comfort Zone — white/cream */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ background: '#fff', borderTop: '2px solid #e5e7eb', borderBottom: '2px solid #e5e7eb' }}>
        <div>
          <p className="font-black text-sm text-gray-800">Comfort Zone</p>
          <p className="text-[10px] text-gray-400 font-semibold">Face value of number</p>
        </div>
        {/* -2 tile */}
        <div className="flex items-center justify-center rounded-lg font-black text-white text-sm"
          style={{ width: 36, height: 36, background: '#dc2626', boxShadow: '0 0 10px rgba(220,38,38,0.5)' }}>
          −2
        </div>
      </div>

      {/* Banger Zone — teal */}
      <div className="flex items-center justify-center py-5"
        style={{ background: 'linear-gradient(180deg,#0f766e 0%,#134e4a 100%)' }}>
        <div className="text-center">
          <p className="font-black text-xl" style={{ color: '#a7f3d0', letterSpacing: '0.05em', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            Banger Zone
          </p>
          <p className="text-teal-300/60 text-[11px] font-semibold mt-0.5">Seeds score DOUBLE ★</p>
        </div>
      </div>
    </div>
  );
}
