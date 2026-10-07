import React from 'react';
import { 
  Navigation, 
  GraduationCap, 
  Users, 
  Wrench, 
  AlertTriangle, 
  Cpu, 
  QrCode, 
  ShieldAlert, 
  Accessibility, 
  Sparkles,
  ChevronRight,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function NavRail({
  currentRole = 'student',
  onRoleChange,
  activeDrawer = 'none', // 'none' (pure 3d map), 'erp', 'cabin', 'grievance', 'janitorial', 'admin'
  onSelectDrawer,
  onOpenScanner,
  onTriggerSos,
  isAccessibleMode = false,
  onToggleAccessibleMode,
  onOpenAiCopilot
}) {
  const roles = [
    { id: 'student', label: 'Student', initials: 'GP', name: 'Gagan N Prasad', color: 'from-blue-600 to-indigo-600' },
    { id: 'faculty', label: 'Faculty', initials: 'RK', name: 'Prof. Rajesh K', color: 'from-indigo-600 to-purple-600' },
    { id: 'hod', label: 'HOD', initials: 'HK', name: 'Dr. Harish Kumar N', color: 'from-purple-600 to-pink-600' },
    { id: 'janitorial', label: 'Janitor', initials: 'RM', name: 'Ramesh M', color: 'from-amber-600 to-orange-600' },
    { id: 'admin', label: 'Admin', initials: 'SA', name: 'SuperAdmin', color: 'from-emerald-600 to-teal-600' }
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];

  const handleCycleRole = () => {
    const currentIndex = roles.findIndex(r => r.id === currentRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    onRoleChange(roles[nextIndex].id);
  };

  const navItems = [
    { id: 'none', label: '3D Spatial Map', icon: Navigation, desc: 'Real-time multi-floor isometric digital twin' },
    { id: 'erp', label: 'Campus ERP', icon: GraduationCap, desc: 'Attendance, CIE marks, fees, hall ticket' },
    { id: 'cabin', label: 'Cabin Radar', icon: Users, desc: 'Faculty presence & student consultations', hideForJanitor: true },
    { id: 'grievance', label: 'Geo-Helpdesk', icon: Wrench, desc: 'Classroom & hardware maintenance reports' },
    { id: 'janitorial', label: 'Cleaning Log', icon: AlertTriangle, desc: 'Custodial hazard avoidance & mopping logs' },
    ...(currentRole === 'admin' || currentRole === 'hod' ? [
      { id: 'admin', label: 'Admin Studio', icon: Cpu, desc: 'QR wall placards & CAD map improviser' }
    ] : [])
  ];

  return (
    <aside className="w-16 h-screen shrink-0 bg-slate-950/95 border-r border-slate-800/80 flex flex-col items-center justify-between py-4 z-40 select-none">
      {/* Top: Avatar & Role Switcher */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleCycleRole}
          className="relative group p-0.5 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 hover:scale-105 active:scale-95 transition"
          title={`Active Persona: ${currentRoleObj.label} (${currentRoleObj.name}) - Click to switch persona`}
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${currentRoleObj.color} flex items-center justify-center text-xs font-black text-white shadow-lg shadow-black/50`}>
            {currentRoleObj.initials}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 ring-2 ring-slate-950"></span>
          </span>
        </button>

        {/* Divider */}
        <div className="w-8 h-px bg-slate-800/80 my-1" />

        {/* Nav Workspace Icons */}
        <div className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            if (item.hideForJanitor && currentRole === 'janitorial') return null;
            const Icon = item.icon;
            const isActive = activeDrawer === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectDrawer(item.id)}
                className={`relative group p-2.5 rounded-xl transition flex items-center justify-center ${
                  isActive
                    ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
                title={`${item.label} - ${item.desc}`}
              >
                <Icon className="w-5 h-5" />

                {/* Left Active Glow Indicator */}
                {isActive && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-cyan-400 rounded-r-full shadow-lg shadow-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Utility Triggers */}
      <div className="flex flex-col items-center gap-2">
        {/* Universal Accessibility / No-Stairs Mode Toggle */}
        <button
          onClick={onToggleAccessibleMode}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            isAccessibleMode
              ? 'bg-purple-600/30 text-purple-300 border border-purple-400/50 shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
          }`}
          title={isAccessibleMode ? "♿ No-Stairs Mode ACTIVE (Elevator & Ramps only)" : "Toggle ♿ Stair-Free Accessibility Mode"}
        >
          <Accessibility className="w-5 h-5" />
          {isAccessibleMode && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        {/* Scan Wall QR Anchor */}
        <button
          onClick={onOpenScanner}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 transition"
          title="Scan Physical Cartesian QR Anchor (<200ms)"
        >
          <QrCode className="w-5 h-5" />
        </button>

        {/* Campus AI Copilot Launcher */}
        <button
          onClick={onOpenAiCopilot}
          className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 text-indigo-300 hover:text-white border border-indigo-400/30 hover:scale-105 active:scale-95 transition shadow-lg shadow-indigo-600/20"
          title="Open Campus AI Copilot Assistant"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
        </button>

        {/* Emergency SOS Evacuation */}
        <button
          onClick={onTriggerSos}
          className="p-2.5 rounded-xl bg-red-600/20 text-red-400 hover:text-white hover:bg-red-600 border border-red-500/30 hover:scale-105 active:scale-95 transition shadow-lg shadow-red-600/20"
          title="Emergency SOS Evacuation"
        >
          <ShieldAlert className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
