import React from 'react';
import { 
  Compass, 
  ShieldAlert, 
  UserCheck, 
  QrCode, 
  Activity, 
  Layers,
  ChevronDown,
  Sparkles,
  Accessibility
} from 'lucide-react';

export default function Header({ 
  currentRole, 
  onRoleChange, 
  onOpenScanner, 
  onTriggerSos,
  activeHazardCount,
  isAccessibleMode = false,
  onToggleAccessibleMode,
  onOpenAiCopilot
}) {
  const roles = [
    { id: 'student', label: 'Student', icon: '🎓', name: 'Gagan N Prasad', usn: '26UG1BYCS0588-T' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍💻', name: 'Prof. Rajesh K', usn: 'CSE-FAC-08' },
    { id: 'hod', label: 'HOD', icon: '👨‍🏫', name: 'Dr. Harish Kumar N', usn: 'CSE-HOD-01' },
    { id: 'janitorial', label: 'Janitorial / Safety', icon: '🧹', name: 'Ramesh M', usn: 'FAC-JAN-04' },
    { id: 'admin', label: 'Admin', icon: '⚙️', name: 'SuperAdmin', usn: 'SYS-ADM-01' },
  ];

  const activePersona = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <header className="glass-panel sticky top-0 z-30 border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
            <Compass className="h-5 w-5 text-white animate-spin-slow" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                GRIDLOCK <span className="text-blue-400 font-semibold text-xs tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">SUPER-APP</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                &lt;200ms Decode
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              BMSIT CSE Academic Complex • Unified Micro-Location & Campus ERP
            </p>
          </div>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Scan Wall QR Button */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 rounded-lg bg-blue-600/90 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition active:scale-95 border border-blue-400/30"
            title="Scan physical QR Cartesian anchor point"
          >
            <QrCode className="h-4 w-4" />
            <span className="hidden md:inline">Scan QR Anchor</span>
          </button>

          {/* Accessible Mode Indicator / Toggle */}
          {isAccessibleMode && (
            <button
              onClick={onToggleAccessibleMode}
              className="flex items-center gap-1.5 rounded-lg bg-purple-500/25 hover:bg-purple-500/35 border border-purple-400/50 px-2.5 py-1.5 text-xs text-purple-200 transition"
              title="♿ Stair-Free Mode Active (Elevator & Ramp Transit Mandated)"
            >
              <Accessibility className="h-4 w-4 text-purple-400" />
              <span className="hidden sm:inline font-bold text-[11px]">♿ No-Stairs Mode</span>
            </button>
          )}

          {/* Campus AI Copilot Button */}
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-2.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition active:scale-95 border border-indigo-400/40"
            title="Open Campus AI Assistant (Ask about lagging subjects, attendance, leg injury routing, etc.)"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Emergency SOS Button (Triggers confirmation dialog) */}
          <button
            onClick={onTriggerSos}
            className="flex items-center gap-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-red-600/30 transition active:scale-95 border border-red-400/40"
            title="Emergency egress guidance to nearest exit"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>SOS</span>
          </button>

          {/* Active hazard badge */}
          {activeHazardCount > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="font-semibold">{activeHazardCount} Detour Active</span>
            </div>
          )}

          {/* 5-Tier RBAC Persona Switcher */}
          <div className="relative">
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 text-xs text-slate-200 transition shadow-inner">
              <span className="text-xl">{activePersona.icon}</span>
              <div className="text-left">
                <div className="text-[9px] text-blue-400 font-mono uppercase font-bold tracking-wider">
                  ROLE: {activePersona.label}
                </div>
                <div className="font-bold text-white text-xs leading-tight">
                  {activePersona.name}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 pointer-events-none ml-1" />
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Switch 5-Tier RBAC Persona"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id} className="bg-slate-900 text-white py-2">
                    {role.icon} {role.label} — {role.name} ({role.usn})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
