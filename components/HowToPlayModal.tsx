'use client';

interface HowToPlayModalProps {
  onClose: () => void;
}

export default function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full my-8 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">How to Play BWTmat</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="p-5 space-y-5 text-sm text-slate-300">
          <section>
            <h3 className="text-amber-400 font-bold uppercase tracking-wide mb-2">Objective</h3>
            <p>Be the first to correctly calculate your seed total using color zone rules. Most 1st-place finishes across all rounds wins.</p>
          </section>

          <section>
            <h3 className="text-amber-400 font-bold uppercase tracking-wide mb-2">Levels & Seeds</h3>
            <div className="grid grid-cols-5 gap-1 text-center text-xs">
              {[1,2,3,4,5].map(l => (
                <div key={l} className="bg-slate-800 rounded-lg p-2">
                  <div className="text-white font-bold">Lv {l}</div>
                  <div className="text-slate-400">{[3,5,7,9,11][l-1]} seeds</div>
                  <div className="text-slate-400">{[60,60,75,75,90][l-1]}s</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-amber-400 font-bold uppercase tracking-wide mb-2">Color Zones</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-lg bg-red-600 shrink-0" />
                <div><span className="text-white font-semibold">Red — No Score Zone:</span> Any number = 0</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-lg bg-blue-600 shrink-0" />
                <div><span className="text-white font-semibold">Blue — Comfort Zone:</span> Face value of the number</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-lg bg-green-600 shrink-0" />
                <div><span className="text-white font-semibold">Green — Banger Zone:</span> Double the value</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-amber-400 font-bold uppercase tracking-wide mb-2">Special Seeds</h3>
            <div className="space-y-1">
              <div className="flex justify-between bg-slate-800 rounded-lg px-3 py-2">
                <span className="text-yellow-300 font-bold">3³</span>
                <span>Red=0 &nbsp; Blue=27 &nbsp; Green=54</span>
              </div>
              <div className="flex justify-between bg-slate-800 rounded-lg px-3 py-2">
                <span className="text-yellow-300 font-bold">5d</span>
                <span>Red=0 &nbsp; Blue=10 &nbsp; Green=20</span>
              </div>
              <div className="flex justify-between bg-slate-800 rounded-lg px-3 py-2">
                <span className="text-yellow-300 font-bold">7d</span>
                <span>Red=0 &nbsp; Blue=14 &nbsp; Green=28</span>
              </div>
              <div className="flex justify-between bg-slate-800 rounded-lg px-3 py-2">
                <span className="text-red-300 font-bold">-2</span>
                <span>Always deduct 2 from total</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-amber-400 font-bold uppercase tracking-wide mb-2">Formula</h3>
            <div className="bg-slate-800 rounded-lg p-3 font-mono text-center">
              <span className="text-white">Score = </span>
              <span className="text-green-400">Banger</span>
              <span className="text-white"> + </span>
              <span className="text-blue-400">Comfort</span>
              <span className="text-white"> − </span>
              <span className="text-red-400">Penalties</span>
            </div>
          </section>

          <section>
            <h3 className="text-amber-400 font-bold uppercase tracking-wide mb-2">How to Win</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Seeds are dealt face-down. Everyone reveals at once.</li>
              <li>Calculate your total using the color zone rules.</li>
              <li>Submit your answer — first correct answer wins the round!</li>
              <li>Player with the most 1st-place finishes is the BWTmat Champion.</li>
            </ol>
          </section>
        </div>

        <div className="p-5 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-base transition-colors"
          >
            Got it, Let&apos;s Play!
          </button>
        </div>
      </div>
    </div>
  );
}
