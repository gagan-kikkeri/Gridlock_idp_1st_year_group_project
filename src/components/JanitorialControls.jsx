import React from 'react';
import { GRAPH_EDGES } from '../data/campusData.js';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Radio, 
  RotateCcw,
  Zap
} from 'lucide-react';

export default function JanitorialControls({ hazardMap, onToggleHazard, onClearAllHazards }) {
  const hazardEligibleEdges = GRAPH_EDGES.filter(e => e.canHaveHazard);
  const activeCount = Object.values(hazardMap).filter(h => h.isBlocked).length;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Janitorial Facilities & Detour Control
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Live Edge Weight Inflation
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Custodial corridor state toggling: updates A* graph weights in real time ($W_&#123;active&#125; = W_&#123;base&#125; + \infty$)
            </p>
          </div>
        </div>

        {activeCount > 0 && (
          <button
            onClick={onClearAllHazards}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white px-3 py-1.5 text-xs font-semibold border border-emerald-500/40 transition active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Active Hazards ({activeCount})
          </button>
        )}
      </div>

      {/* Mathematical Algorithm Callout (Slide 12) */}
      <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800 text-xs text-slate-300 space-y-1.5 font-mono">
        <div className="text-blue-400 font-bold flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          A* Algorithmic Cost Override Protocol (Slide 12):
        </div>
        <p className="text-[11px] text-slate-400">
          When janitorial staff flags a wet floor or physical obstruction, the edge solver inflates graph cost:
          <span className="text-amber-300 font-bold ml-1">W_active = W_base + ∞ (10^8)</span>.
          Active student navigation recalculates clean detours without spatial drift.
        </p>
      </div>

      {/* Corridor Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hazardEligibleEdges.map(edge => {
          const isBlocked = !!hazardMap[edge.id]?.isBlocked;

          return (
            <div
              key={edge.id}
              className={`flex flex-col justify-between rounded-xl p-4 border transition-all ${
                isBlocked
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{edge.corridor}</h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase font-mono border ${
                      isBlocked
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isBlocked ? '⚠️ Wet Floor Closed' : '✓ Corridor Clear'}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-400 space-y-1">
                  <div>Base Length: <strong className="text-slate-200">{edge.distance} meters</strong></div>
                  <div>
                    Effective Solver Weight:{' '}
                    <strong className={isBlocked ? 'text-amber-400' : 'text-emerald-400'}>
                      {isBlocked ? '∞ (Infinity Detour)' : `${edge.distance}m (Nominal)`}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex gap-2">
                <button
                  onClick={() => onToggleHazard(edge.id, !isBlocked)}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition active:scale-95 ${
                    isBlocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                  }`}
                >
                  {isBlocked ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Mark Cleaned & Reopen Route
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      Toggle "Wet Floor / Cleaning" Hazard
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
