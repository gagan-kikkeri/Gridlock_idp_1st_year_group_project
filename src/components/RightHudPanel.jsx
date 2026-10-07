import React, { useState } from 'react';
import { 
  Activity, 
  Users, 
  Clock, 
  Thermometer, 
  Wind, 
  Wifi, 
  Volume2, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  GraduationCap, 
  X, 
  Maximize2, 
  Minimize2,
  ExternalLink,
  ShieldAlert,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { FACULTY_ROSTER, STUDENT_ERP } from '../data/campusData.js';

export default function RightHudPanel({
  currentRole = 'student',
  activeDrawer = 'none',
  onSelectDrawer,
  facultyList = FACULTY_ROSTER,
  appointments = [],
  hazardMap = {},
  cleaningReports = [],
  nodes = {},
  onNavigateToNode,
  children
}) {
  const [metricTab, setMetricTab] = useState('metrics'); // 'metrics', 'roster', 'iot'
  const [isExpanded, setIsExpanded] = useState(false);

  // Derive active metrics based on role
  const activeHazards = Object.entries(hazardMap).filter(([_, h]) => h.isBlocked);
  const pendingAppointments = appointments.filter(a => a.status === 'Pending');
  const availableFaculty = facultyList.filter(f => f.status === 'Available');

  // Student Attendance Calculation
  const attendanceRate = React.useMemo(() => {
    if (!STUDENT_ERP?.attendance?.length) return 84.6;
    const avg = STUDENT_ERP.attendance.reduce((sum, item) => sum + item.percentage, 0) / STUDENT_ERP.attendance.length;
    return parseFloat(avg.toFixed(1));
  }, []);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendanceRate / 100) * circumference;

  // Faculty Consultations Calculation
  const facultyRate = 91.2;
  const facultyStrokeDashoffset = circumference - (facultyRate / 100) * circumference;

  // Janitor Hygiene Calculation
  const hygieneRate = Math.max(70, 100 - activeHazards.length * 12);
  const hygieneStrokeDashoffset = circumference - (hygieneRate / 100) * circumference;

  // If a module drawer is active (erp, cabin, grievance, janitorial, admin), render the slide-over drawer
  if (activeDrawer !== 'none') {
    return (
      <div 
        className={`fixed inset-y-0 right-0 z-40 flex flex-col bg-slate-950/95 backdrop-blur-3xl border-l border-slate-800/80 shadow-2xl transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-[calc(100vw-4rem)]' : 'w-full md:w-[620px] lg:w-[680px]'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Active Module Drawer
              </div>
              <h2 className="text-sm font-black text-white capitalize">
                {activeDrawer === 'erp' && 'Campus Academic & Financial ERP'}
                {activeDrawer === 'cabin' && 'Faculty Cabin Radar & Appointments'}
                {activeDrawer === 'grievance' && 'Geo-Tagged Classroom Helpdesk'}
                {activeDrawer === 'janitorial' && 'Janitorial Cleaning & Hazard Control'}
                {activeDrawer === 'admin' && 'Admin Studio & AI Spatial Engine'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title={isExpanded ? "Collapse to standard drawer" : "Expand full screen"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onSelectDrawer('none')}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 border border-slate-700/60 transition"
              title="Close drawer & return to 3D Map Telemetry"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
          {children}
        </div>
      </div>
    );
  }

  // Pure Telemetry Mode: Space Analytics HUD
  return (
    <div className="w-[330px] h-[calc(100vh-2rem)] my-4 mr-4 shrink-0 bg-slate-950/85 backdrop-blur-2xl border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-30 select-none">
      {/* Top Header & Dropdown */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Space Analytics</span>
          </div>
          <h2 className="text-sm font-extrabold text-white mt-0.5">
            Building Metrics
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            LIVE SYNC
          </span>
        </div>
      </div>

      {/* Scrollable Telemetry HUD */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-xs">
        {/* Circular Radial Gauge Card */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {currentRole === 'student' && 'Attendance Health'}
              {(currentRole === 'faculty' || currentRole === 'hod') && 'Department Load'}
              {currentRole === 'janitorial' && 'Floor Hygiene Index'}
              {currentRole === 'admin' && 'Mesh Node Uptime'}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
              {currentRole === 'student' && 'VTU Safe'}
              {(currentRole === 'faculty' || currentRole === 'hod') && 'Optimal'}
              {currentRole === 'janitorial' && 'Safe Zone'}
              {currentRole === 'admin' && '24/24 Online'}
            </span>
          </div>

          <div className="flex items-center justify-center my-3 relative">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Background Track Circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-800/90"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress Gradient Circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={
                  currentRole === 'student' ? 'url(#cyanGrad)' :
                  currentRole === 'janitorial' ? 'url(#amberGrad)' : 'url(#purpleGrad)'
                }
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={
                  currentRole === 'student' ? strokeDashoffset :
                  currentRole === 'janitorial' ? hygieneStrokeDashoffset : facultyStrokeDashoffset
                }
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Ring Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {currentRole === 'student' && `${attendanceRate}%`}
                {(currentRole === 'faculty' || currentRole === 'hod') && `${facultyRate}%`}
                {currentRole === 'janitorial' && `${hygieneRate}%`}
                {currentRole === 'admin' && '100%'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {currentRole === 'student' && 'Average'}
                {(currentRole === 'faculty' || currentRole === 'hod') && 'Efficiency'}
                {currentRole === 'janitorial' && 'Dry Floor'}
                {currentRole === 'admin' && 'Mesh Active'}
              </span>
            </div>
          </div>

          {/* Sub-bar Breakdown for Student */}
          {currentRole === 'student' && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>OS (21CS42)</span>
                <span className="text-emerald-400 font-bold font-mono">88%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }}></div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>DBMS (21CS43)</span>
                <span className="text-emerald-400 font-bold font-mono">85%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>Computer Networks (21CS44)</span>
                <span className="text-amber-400 font-bold font-mono">76%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
          )}

          {/* Quick Open Drawer trigger */}
          <button
            onClick={() => onSelectDrawer('erp')}
            className="w-full mt-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-bold text-[10px] rounded-lg transition flex items-center justify-center gap-1 border border-slate-700/60"
          >
            <span>Open Complete ERP Ledger</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Meeting Room & Faculty Availability Card (Reference layout feature) */}
        {currentRole !== 'janitorial' && (
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Faculty Cabin Availability
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                {availableFaculty.length} Available
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {facultyList.slice(0, 3).map((fac) => {
                const isAvail = fac.status === 'Available';
                const isMeet = fac.status === 'In Meeting';

                return (
                  <div 
                    key={fac.id}
                    className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        isAvail ? 'bg-emerald-400 animate-pulse' :
                        isMeet ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                      <div>
                        <div className="text-white font-bold text-[11px] group-hover:text-cyan-400 transition">
                          {fac.name}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          {fac.designation} • {fac.cabinName || fac.cabin}
                        </div>
                      </div>
                    </div>

                    {fac.cabinNodeId && (
                      <button
                        onClick={() => onNavigateToNode(fac.cabinNodeId)}
                        className="px-2 py-1 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded text-[10px] font-bold transition flex items-center gap-0.5"
                        title={`Navigate to ${fac.cabinName || fac.cabin}`}
                      >
                        <Navigation className="w-2.5 h-2.5" />
                        <span>Go</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onSelectDrawer('cabin')}
              className="w-full mt-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-bold text-[10px] rounded-lg transition flex items-center justify-center gap-1 border border-slate-700/60"
            >
              <span>Manage Radar & Appointments</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Environmental Micro-Climate Telemetry (Reference layout feature) */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Micro-Climate Telemetry
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[9px] text-slate-400">Avg. Temp</div>
                <div className="text-xs font-mono font-bold text-white">21.8°C</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[9px] text-slate-400">Air Quality</div>
                <div className="text-xs font-mono font-bold text-emerald-400">Optimal (AQI 34)</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[9px] text-slate-400">Mesh Signal</div>
                <div className="text-xs font-mono font-bold text-white">-46 dBm (Wi-Fi 6)</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[9px] text-slate-400">Acoustic Noise</div>
                <div className="text-xs font-mono font-bold text-white">41 dB (Quiet)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Notification Stacks: Upcoming Bookings & Directory (From reference image) */}
        <div className="space-y-2">
          {/* Upcoming Consultation / Booking Card */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 hover:border-slate-700 transition">
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-bold text-white">Upcoming Timetable & Consultations</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 text-[10px] text-slate-300">
              <div className="font-semibold text-white">11:30 AM • Cloud Computing Lab</div>
              <div className="text-slate-400 flex items-center justify-between mt-0.5">
                <span>Lab 2 (Ground Floor)</span>
                <span className="font-mono text-cyan-400">Next Slot</span>
              </div>
            </div>
          </div>

          {/* Active Hazard Warning if Mopping in Progress */}
          {activeHazards.length > 0 && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3">
              <div className="flex items-center gap-2 mb-1 text-amber-400 font-bold text-[10px]">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Active Mopping / Custodial Reroute</span>
              </div>
              <p className="text-[9px] text-amber-200/80 leading-relaxed">
                {activeHazards.length} corridor section(s) wet. A* Dijkstra engine automatically avoiding slippery tiles.
              </p>
              <button
                onClick={() => onSelectDrawer('janitorial')}
                className="mt-2 text-[9px] font-bold text-amber-300 hover:text-white underline flex items-center gap-1"
              >
                <span>Inspect Mopping Hazard Log</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
