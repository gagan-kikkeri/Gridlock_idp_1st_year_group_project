import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import BuildingMap from './components/BuildingMap.jsx';
import NavigationPanel from './components/NavigationPanel.jsx';
import QRScannerModal from './components/QRScannerModal.jsx';
import ErpHub from './components/ErpHub.jsx';
import CabinRadar from './components/CabinRadar.jsx';
import GrievanceDesk from './components/GrievanceDesk.jsx';
import JanitorialControls from './components/JanitorialControls.jsx';
import SosModal from './components/SosModal.jsx';

import { 
  SPATIAL_NODES, 
  FACULTY_ROSTER, 
  INITIAL_APPOINTMENTS 
} from './data/campusData.js';
import { 
  findShortestPath, 
  findNearestEmergencyExit 
} from './services/pathfinding.js';

import { 
  Navigation, 
  GraduationCap, 
  Users, 
  Wrench, 
  Sparkles,
  AlertTriangle,
  Layers,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';

export default function App() {
  // Navigation & Spatial States
  const [activeTab, setActiveTab] = useState('wayfinding'); // 'wayfinding', 'erp', 'cabin', 'grievance', 'janitorial'
  const [userRole, setUserRole] = useState('student'); // 'student', 'faculty', 'hod', 'janitorial', 'admin'
  const [activeFloor, setActiveFloor] = useState(0); // 0 = Ground Floor, 1 = First Floor
  
  const [startNodeId, setStartNodeId] = useState('N_ENTRANCE');
  const [targetNodeId, setTargetNodeId] = useState('N_HOD');
  
  // Real-time Hazard Map
  const [hazardMap, setHazardMap] = useState({});

  // Shared Faculty & Appointments State
  const [facultyList, setFacultyList] = useState(FACULTY_ROSTER);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  // Modals & SOS States
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);
  const [notification, setNotification] = useState(null);

  // Auto-clear notification toast
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Compute A* Pathfinding Route dynamically
  const activeRoute = useMemo(() => {
    if (!startNodeId || !targetNodeId) return null;
    return findShortestPath(startNodeId, targetNodeId, hazardMap);
  }, [startNodeId, targetNodeId, hazardMap]);

  // Compute Emergency Egress Route
  const egressRoute = useMemo(() => {
    return findNearestEmergencyExit(startNodeId, hazardMap);
  }, [startNodeId, hazardMap]);

  // Handler for QR Scan confirmation
  const handleScanComplete = (nodeId) => {
    setStartNodeId(nodeId);
    const node = SPATIAL_NODES[nodeId];
    if (node) {
      setActiveFloor(node.floor);
      setNotification(`Cartesian Position locked to ${node.label} (${node.qr}) in <180ms!`);
    }
  };

  // Handler for clicking a node directly on the SVG map
  const handleMapSelectNode = (nodeId) => {
    const node = SPATIAL_NODES[nodeId];
    if (!node) return;

    if (!startNodeId) {
      setStartNodeId(nodeId);
      setNotification(`Origin set to ${node.label}`);
    } else {
      setTargetNodeId(nodeId);
      setNotification(`Destination set to ${node.label}`);
    }
  };

  // Handler for Janitorial hazard toggle
  const handleToggleHazard = (edgeId, isBlocked) => {
    setHazardMap(prev => ({
      ...prev,
      [edgeId]: { isBlocked, type: isBlocked ? 'WET_FLOOR' : null }
    }));

    setNotification(
      isBlocked 
        ? `⚠️ Wet floor hazard activated. Edge solver inflated cost ($W_{active} = W_{base} + \infty$). Detour recalculated!`
        : `✓ Corridor marked clear. Standard edge weights restored.`
    );
  };

  const handleClearAllHazards = () => {
    setHazardMap({});
    setNotification('All corridor hazards cleared. Optimal walking paths restored.');
  };

  // Handler for Cabin Radar navigate-to
  const handleNavigateToNode = (nodeId) => {
    const node = SPATIAL_NODES[nodeId];
    if (node) {
      setTargetNodeId(nodeId);
      setActiveFloor(node.floor);
      setActiveTab('wayfinding');
      setNotification(`Target set to ${node.label}. Generating turn-by-turn guidance.`);
    }
  };

  // Handler for Faculty accepting an appointment
  const handleAcceptAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return { ...a, status: 'Accepted' };
      }
      return a;
    }));
    const app = appointments.find(a => a.id === appointmentId);
    setNotification(`✓ Consultation with ${app?.studentName || 'Student'} ACCEPTED. Confirmed for ${app?.slot}.`);
  };

  // Handler for Faculty rejecting an appointment
  const handleRejectAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return { ...a, status: 'Rejected' };
      }
      return a;
    }));
    const app = appointments.find(a => a.id === appointmentId);
    setNotification(`✗ Consultation request for ${app?.studentName || 'Student'} DECLINED.`);
  };

  // Handler for Student booking an appointment
  const handleBookAppointment = (newApp) => {
    setAppointments(prev => [newApp, ...prev]);
    setNotification(`Application submitted to ${newApp.facultyName}. Awaiting faculty review.`);
  };

  // Handler for updating faculty cabin presence status
  const handleUpdateFacultyStatus = (facultyId, newStatus) => {
    setFacultyList(prev => prev.map(f => {
      if (f.id === facultyId) {
        return {
          ...f,
          status: newStatus,
          statusMessage: newStatus === 'Available' 
            ? 'Available in cabin for student consultation' 
            : newStatus === 'In Meeting' 
            ? 'In Department Review Meeting' 
            : 'Out of station'
        };
      }
      return f;
    }));
    const fac = facultyList.find(f => f.id === facultyId);
    setNotification(`${fac?.name || 'Faculty'} status updated to: ${newStatus.toUpperCase()}`);
  };

  // Handler for Emergency SOS route display
  const handleFollowSosRoute = () => {
    if (egressRoute && egressRoute.targetExit) {
      setTargetNodeId(egressRoute.targetExit.id);
      setIsSosActive(true);
      setActiveFloor(SPATIAL_NODES[startNodeId]?.floor ?? 0);
      setActiveTab('wayfinding');
      setNotification('🚨 Emergency evacuation route active! Follow safe exit trajectory.');
    }
  };

  const activeHazardCount = Object.values(hazardMap).filter(h => h.isBlocked).length;
  const pendingAppointmentsCount = appointments.filter(a => a.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 max-w-md animate-bounce">
          <div className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 border border-blue-400">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Global Application Header */}
      <Header
        currentRole={userRole}
        onRoleChange={(newRole) => {
          setUserRole(newRole);
          setNotification(`Switched persona to: ${newRole.toUpperCase()}`);
        }}
        onOpenScanner={() => setIsScannerOpen(true)}
        onTriggerSos={() => setIsSosOpen(true)}
        activeHazardCount={activeHazardCount}
      />

      {/* Role-Specific Module Navigation Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {/* TAB 1: Indoor Navigation */}
          <button
            onClick={() => setActiveTab('wayfinding')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'wayfinding'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Navigation className="h-4 w-4" />
            <span>Indoor Navigation & Map</span>
          </button>

          {/* TAB 2: Role-based ERP Tab Label */}
          <button
            onClick={() => setActiveTab('erp')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'erp'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>
              {userRole === 'student' && 'Academic & Financial ERP'}
              {userRole === 'faculty' && 'Grading & Attendance Ledger'}
              {userRole === 'hod' && 'Department ERP & Condonation'}
              {userRole === 'janitorial' && 'Custodial Facilities Ledger'}
              {userRole === 'admin' && 'Institutional ERP Administration'}
            </span>
          </button>

          {/* TAB 3: Role-based Cabin / Appointments Tab Label */}
          <button
            onClick={() => setActiveTab('cabin')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'cabin'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>
              {userRole === 'student' && 'Faculty Cabin Radar (Book Slot)'}
              {(userRole === 'faculty' || userRole === 'hod') && 'Cabin Desk & Student Appointments'}
              {userRole === 'janitorial' && 'Staff Cabin Registry'}
              {userRole === 'admin' && 'All Cabin Bookings Log'}
            </span>
            {(userRole === 'faculty' || userRole === 'hod') && pendingAppointmentsCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                {pendingAppointmentsCount}
              </span>
            )}
          </button>

          {/* TAB 4: Helpdesk */}
          <button
            onClick={() => setActiveTab('grievance')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'grievance'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Wrench className="h-4 w-4" />
            <span>Geo-Tagged Helpdesk</span>
          </button>

          {/* TAB 5: Janitorial Controls */}
          <button
            onClick={() => setActiveTab('janitorial')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'janitorial'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Janitorial Detour Controls</span>
            {activeHazardCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {activeHazardCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-4 sm:p-6">
        {activeTab === 'wayfinding' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Interactive Vector Building Map Viewport */}
            <div className="lg:col-span-8 flex flex-col">
              <BuildingMap
                activeFloor={activeFloor}
                onFloorChange={setActiveFloor}
                startNodeId={startNodeId}
                targetNodeId={targetNodeId}
                onSelectNode={handleMapSelectNode}
                activeRoute={activeRoute}
                hazardMap={hazardMap}
                isSosActive={isSosActive}
              />
            </div>

            {/* Micro-Location Wayfinding Navigation Controls */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <NavigationPanel
                startNodeId={startNodeId}
                targetNodeId={targetNodeId}
                onSelectStart={setStartNodeId}
                onSelectTarget={setTargetNodeId}
                activeRoute={activeRoute}
                onOpenScanner={() => setIsScannerOpen(true)}
                onClearRoute={() => {
                  setTargetNodeId(null);
                  setIsSosActive(false);
                }}
                onSwapEndpoints={() => {
                  const temp = startNodeId;
                  setStartNodeId(targetNodeId);
                  setTargetNodeId(temp);
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Role-based ERP Hub */}
        {activeTab === 'erp' && (
          <ErpHub userRole={userRole} />
        )}

        {/* Tab 3: Dynamic Cabin Occupancy Radar & Student Appointments Desk */}
        {activeTab === 'cabin' && (
          <CabinRadar
            userRole={userRole}
            appointments={appointments}
            onAcceptAppointment={handleAcceptAppointment}
            onRejectAppointment={handleRejectAppointment}
            onBookAppointment={handleBookAppointment}
            facultyList={facultyList}
            onUpdateFacultyStatus={handleUpdateFacultyStatus}
            onNavigateToNode={handleNavigateToNode}
          />
        )}

        {/* Tab 4: Location-Aware Grievance Desk */}
        {activeTab === 'grievance' && (
          <GrievanceDesk
            currentScannedNodeId={startNodeId}
            userRole={userRole}
          />
        )}

        {/* Tab 5: Janitorial Facilities Hazard Controls */}
        {activeTab === 'janitorial' && (
          <JanitorialControls
            hazardMap={hazardMap}
            onToggleHazard={handleToggleHazard}
            onClearAllHazards={handleClearAllHazards}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>GRIDLOCK SUPER-APP</strong> • Department of Computer Science & Engineering, BMSIT&M
          </div>
          <div>
            Team Apex Achievers: Gagan N Prasad • Manav Redhu • Chimbili Manju Ganesh • Machal Ritesh Govardhan
          </div>
        </div>
      </footer>

      {/* QR Micro-Location Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {/* Emergency SOS Evacuation Modal with Confirmation Prompt */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        egressRoute={egressRoute}
        onFollowRoute={handleFollowSosRoute}
      />
    </div>
  );
}
