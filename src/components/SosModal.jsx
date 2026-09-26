import React from 'react';
import { 
  ShieldAlert, 
  Flame, 
  X, 
  PhoneCall, 
  Navigation, 
  AlertOctagon, 
  ArrowRight,
  Footprints,
  Clock
} from 'lucide-react';

export default function SosModal({ isOpen, onClose, egressRoute, onFollowRoute }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-red-500 bg-slate-950 p-6 shadow-2xl shadow-red-500/20 text-white">
        {/* Flashing SOS Header */}
        <div className="flex items-center justify-between border-b border-red-500/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/40 animate-pulse">
              <ShieldAlert className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-wider text-red-500 uppercase">
                  EMERGENCY SOS ACTIVE
                </h3>
              </div>
              <p className="text-xs text-slate-300">
                Automated shortest egress trajectory to safe assembly muster point
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Evacuation Target Route */}
        {egressRoute && egressRoute.success ? (
          <div className="mt-5 rounded-xl bg-red-950/40 border border-red-500/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-300 flex items-center gap-1.5 uppercase font-mono">
                <Flame className="h-4 w-4 text-red-400" /> Nearest Safe Egress Point:
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                VERIFIED CLEAR
              </span>
            </div>

            <div className="text-base font-extrabold text-white">
              {egressRoute.targetExit?.label || "Safe Assembly Zone A"}
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-black/40 p-2.5 border border-red-500/30">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Footprints className="h-3 w-3 text-red-400" /> Distance to Safety
                </div>
                <div className="text-base font-extrabold text-white mt-0.5">
                  {egressRoute.totalDistance} meters
                </div>
              </div>
              <div className="rounded-lg bg-black/40 p-2.5 border border-red-500/30">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3 text-red-400" /> Rapid Egress Time
                </div>
                <div className="text-base font-extrabold text-amber-300 mt-0.5">
                  ~{egressRoute.estimatedSeconds} seconds
                </div>
              </div>
            </div>

            {/* Quick directions */}
            <div className="text-xs text-slate-300 space-y-1 pt-1">
              <div className="font-semibold text-white">Evacuation Instructions:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
                {egressRoute.directions.slice(0, 3).map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-4 rounded-xl bg-red-950/40 text-center text-xs text-red-200">
            Scanning perimeter for nearest safe exit point...
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="mt-4 rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 space-y-2 text-xs">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <PhoneCall className="h-3.5 w-3.5 text-blue-400" /> 24/7 Campus Emergency Dispatch:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase font-mono">BMSIT Security Gate</span>
              <strong>+91 80 2856 1575</strong>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase font-mono">Infirmary / Medical</span>
              <strong>+91 94480 88200</strong>
            </div>
          </div>
        </div>

        {/* Modal actions */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            Dismiss SOS Alert
          </button>
          <button
            onClick={() => {
              onFollowRoute();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/40 transition active:scale-95"
          >
            <Navigation className="h-4 w-4" />
            Display Route on Map
          </button>
        </div>
      </div>
    </div>
  );
}
