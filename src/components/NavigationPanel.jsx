import React, { useState } from 'react';
import { 
  SPATIAL_NODES 
} from '../data/campusData.js';
import { 
  Navigation, 
  MapPin, 
  Flag, 
  ArrowRight, 
  Footprints, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw, 
  CornerDownRight, 
  Sparkles,
  QrCode
} from 'lucide-react';

export default function NavigationPanel({
  startNodeId,
  targetNodeId,
  onSelectStart,
  onSelectTarget,
  activeRoute,
  onOpenScanner,
  onClearRoute,
  onSwapEndpoints,
  nodes = SPATIAL_NODES
}) {
  const [showDirections, setShowDirections] = useState(true);

  // Group nodes by floor and category
  const allNodes = Object.values(nodes);
  const groundFloorNodes = allNodes.filter(n => n.floor === 0);
  const firstFloorNodes = allNodes.filter(n => n.floor === 1);

  const startNode = nodes[startNodeId];
  const targetNode = nodes[targetNodeId];

  // Quick preset shortcuts
  const presets = [
    { label: "HOD Suite (Dr. Harish)", target: "N_HOD" },
    { label: "AI & ML Lab 02", target: "N_AI_LAB" },
    { label: "Digital Library", target: "N_LIBRARY" },
    { label: "Systems Lab 01", target: "N_SYS_LAB" },
    { label: "Seminar Hall", target: "N_SEMINAR" }
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
            <Navigation className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Micro-Location Wayfinding
          </h2>
        </div>

        {activeRoute && (
          <button
            onClick={onClearRoute}
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Origin & Destination Selectors */}
      <div className="relative flex flex-col gap-3 rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80">
        {/* Origin (Start) */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
            <MapPin className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase font-mono text-slate-400 block leading-tight">
              Origin (Scanned QR / Point)
            </label>
            <select
              value={startNodeId || ""}
              onChange={(e) => onSelectStart(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer mt-0.5"
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">Select starting location...</option>
              <optgroup label="Ground Floor" className="bg-slate-900 text-slate-200 font-semibold">
                {groundFloorNodes.map(n => (
                  <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                    {n.label} ({n.qr})
                  </option>
                ))}
              </optgroup>
              <optgroup label="First Floor" className="bg-slate-900 text-slate-200 font-semibold">
                {firstFloorNodes.map(n => (
                  <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                    {n.label} ({n.qr})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <button
            onClick={onOpenScanner}
            className="shrink-0 p-1.5 rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white transition"
            title="Scan QR code at your current physical location"
          >
            <QrCode className="h-4 w-4" />
          </button>
        </div>

        {/* Swap divider */}
        <div className="relative flex items-center justify-center my-0.5">
          <div className="h-px w-full bg-slate-800"></div>
          <button
            onClick={onSwapEndpoints}
            className="absolute rounded-full bg-slate-800 p-1 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title="Swap Origin and Destination"
          >
            <RotateCw className="h-3 w-3" />
          </button>
        </div>

        {/* Destination (Target) */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Flag className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase font-mono text-slate-400 block leading-tight">
              Target Destination
            </label>
            <select
              value={targetNodeId || ""}
              onChange={(e) => onSelectTarget(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer mt-0.5"
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">Select destination room/facility...</option>
              <optgroup label="Ground Floor" className="bg-slate-900 text-slate-200 font-semibold">
                {groundFloorNodes.map(n => (
                  <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                    {n.label} ({n.qr})
                  </option>
                ))}
              </optgroup>
              <optgroup label="First Floor" className="bg-slate-900 text-slate-200 font-semibold">
                {firstFloorNodes.map(n => (
                  <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                    {n.label} ({n.qr})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Destination Presets */}
      <div>
        <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-400" />
          Frequent Navigation Targets
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map(p => (
            <button
              key={p.target}
              onClick={() => onSelectTarget(p.target)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                targetNodeId === p.target
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Route Summary Metric Box */}
      {activeRoute && activeRoute.success && (
        <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 p-4 border border-blue-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Optimal A* Route Solved
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Heuristic Euclidean
            </span>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-slate-800/70 p-2 border border-slate-700/50">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Footprints className="h-3 w-3 text-blue-400" /> Walking Distance
              </div>
              <div className="text-lg font-extrabold text-white mt-0.5">
                {activeRoute.totalDistance} <span className="text-xs font-normal text-slate-400">meters</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-800/70 p-2 border border-slate-700/50">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Clock className="h-3 w-3 text-emerald-400" /> Est. Transit Time
              </div>
              <div className="text-lg font-extrabold text-emerald-400 mt-0.5">
                {Math.floor(activeRoute.estimatedSeconds / 60)}m {activeRoute.estimatedSeconds % 60}s
              </div>
            </div>
          </div>

          {/* Hazard Detour Notification */}
          {activeRoute.detoured && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-500/15 border border-amber-500/40 p-2.5 text-xs text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold">Cleaning Detour Active:</span> Custodial staff uploaded active cleaning/wet floor for this section. The app has dynamically recalculated your route to bypass the affected corridor safely.
              </div>
            </div>
          )}

          {/* Turn-by-Turn Guidance toggle */}
          <div>
            <button
              onClick={() => setShowDirections(!showDirections)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 py-1 hover:text-white"
            >
              <span>Turn-by-Turn Guidance ({activeRoute.directions.length} steps)</span>
              <span className="text-[10px] text-blue-400 font-mono">
                {showDirections ? 'Hide ▲' : 'Show ▼'}
              </span>
            </button>

            {showDirections && (
              <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {activeRoute.directions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
