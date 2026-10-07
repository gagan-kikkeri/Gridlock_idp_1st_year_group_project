import React, { useState, useEffect, useMemo } from 'react';
import NavRail from './components/NavRail.jsx';
import LeftHudPanel from './components/LeftHudPanel.jsx';
import IsometricBuildingMap from './components/IsometricBuildingMap.jsx';
import RightHudPanel from './components/RightHudPanel.jsx';

import QRScannerModal from './components/QRScannerModal.jsx';
import ErpHub from './components/ErpHub.jsx';
import CabinRadar from './components/CabinRadar.jsx';
import GrievanceDesk from './components/GrievanceDesk.jsx';
import JanitorialControls from './components/JanitorialControls.jsx';
import SosModal from './components/SosModal.jsx';
import AdminStudio from './components/AdminStudio.jsx';
import CampusAiCopilot from './components/CampusAiCopilot.jsx';

import { 
  SPATIAL_NODES, 
  GRAPH_EDGES,
  FACULTY_ROSTER, 
  INITIAL_APPOINTMENTS,
  STUDENT_ERP,
  FACULTY_CLASS_ROSTER,
  REGISTERED_STUDENTS
} from './data/campusData.js';
import { 
  findShortestPath, 
  findNearestEmergencyExit 
} from './services/pathfinding.js';

import { 
  Compass, 
  Navigation, 
  CheckCircle2, 
  Accessibility, 
  QrCode, 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle,
  ChevronRight,
  User,
  Activity
} from 'lucide-react';

export default function App() {
  // Navigation & Spatial Cockpit States
  const [activeDrawer, setActiveDrawer] = useState('none'); // 'none' (pure 3D map telemetry), 'erp', 'cabin', 'grievance', 'janitorial', 'admin'
  const [userRole, setUserRole] = useState('student'); // 'student', 'faculty', 'hod', 'janitorial', 'admin'
  const [activeFloor, setActiveFloor] = useState(0); // 0 = Ground Floor, 1 = First Floor
  
  // Dynamic Spatial Nodes and Graph Edges (Extensible by Admin Studio)
  const [nodes, setNodes] = useState(SPATIAL_NODES);
  const [edges, setEdges] = useState(GRAPH_EDGES);

  // Student Physical Mobility & Disability/Injury Profile (Universal Accessibility)
  const [mobilityProfile, setMobilityProfile] = useState(STUDENT_ERP.profile.mobilityProfile);
  const [isAccessibleMode, setIsAccessibleMode] = useState(false);

  const [startNodeId, setStartNodeId] = useState('N_ENTRANCE');
  const [targetNodeId, setTargetNodeId] = useState('N_HOD');
  
  // Real-time Hazard Map & Cleaning Reports
  const [hazardMap, setHazardMap] = useState({
    'e-gf-06': { isBlocked: true, type: 'Deep Mopping & Wet Floor' }
  });

  const [cleaningReports, setCleaningReports] = useState([
    {
      id: "CLN-801",
      edgeId: "e-gf-06",
      locationName: "Ground Central Corridor West",
      floor: 0,
      cleaningType: "Deep Mopping & Wet Floor",
      durationMinutes: "25",
      notes: "Detergent mopping in progress. High slipping risk. Cones placed.",
      photoUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&auto=format&fit=crop&q=80",
      photoLabel: "Wet Floor Warning Cones Placed",
      startedAt: "10:15 AM",
      janitorName: "Ramesh M",
      status: "In Progress"
    }
  ]);

  // Shared Faculty & Appointments State
  const [facultyList, setFacultyList] = useState(FACULTY_ROSTER);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  // Map Telemetry Layers Toggle State
  const [mapLayers, setMapLayers] = useState({
    accessibility: true,
    cleaning: true,
    wifi: true,
    qr: true,
    emergency: true
  });

  const handleToggleMapLayer = (layerKey) => {
    setMapLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

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

  // Compute A* Pathfinding Route dynamically (enforces stair-free elevator transit when isAccessibleMode is true)
  const activeRoute = useMemo(() => {
    if (!startNodeId || !targetNodeId) return null;
    return findShortestPath(startNodeId, targetNodeId, hazardMap, nodes, edges, isAccessibleMode);
  }, [startNodeId, targetNodeId, hazardMap, nodes, edges, isAccessibleMode]);

  // Compute Emergency Egress Route
  const egressRoute = useMemo(() => {
    return findNearestEmergencyExit(startNodeId, hazardMap, nodes, edges);
  }, [startNodeId, hazardMap, nodes, edges]);

  // Handler for declaring/updating student disability or temporary leg injury
  const handleUpdateMobilityProfile = (conditionType, notes = '') => {
    const isImpaired = conditionType !== 'None';
    setMobilityProfile({
      hasMobilityImpairment: isImpaired,
      conditionType,
      requiresRampOrLift: isImpaired,
      declaredAt: isImpaired ? new Date().toISOString().split('T')[0] : null,
      notes: notes || (isImpaired ? `Declared ${conditionType}` : 'Standard mobility')
    });
    setIsAccessibleMode(isImpaired);
    setNotification(
      isImpaired 
        ? `♿ Accessibility: ${conditionType} declared. Navigation now mandates Elevator 1 & Ramps with zero stairs!` 
        : `🚶 Standard walking mobility restored. Standard stairs & walkways active.`
    );
  };

  // Handler for QR Scan confirmation
  const handleScanComplete = (nodeId) => {
    setStartNodeId(nodeId);
    const node = nodes[nodeId];
    if (node) {
      setActiveFloor(node.floor);
      setNotification(`Cartesian Position locked to ${node.label} (${node.qr}) in <180ms!`);
    }
  };

  // Handler for clicking a node directly on the SVG map
  const handleMapSelectNode = (nodeId) => {
    const node = nodes[nodeId];
    if (!node) return;

    if (!startNodeId) {
      setStartNodeId(nodeId);
      setNotification(`Origin set to ${node.label}`);
    } else {
      setTargetNodeId(nodeId);
      setNotification(`Destination set to ${node.label}`);
    }
  };

  // Handlers for Admin Studio & AI Spatial Engine
  const handleAddNewNode = (newNode) => {
    setNodes(prev => ({
      ...prev,
      [newNode.id]: newNode
    }));
    setNotification(`✅ New Cartesian QR Anchor registered: ${newNode.label} (${newNode.qr})`);
  };

  const handleAddNewEdge = (newEdge) => {
    setEdges(prev => [...prev, newEdge]);
    setNotification(`✅ Map Corridor improvised: ${newEdge.corridor} (${newEdge.distance}m)`);
  };

  const handleApplyAiRoute = (aiRouteResult) => {
    if (aiRouteResult && aiRouteResult.route && aiRouteResult.route.path) {
      const path = aiRouteResult.route.path;
      if (path.length >= 2) {
        setStartNodeId(path[0]);
        setTargetNodeId(path[path.length - 1]);
        const firstNode = nodes[path[0]];
        if (firstNode) setActiveFloor(firstNode.floor);
        setActiveDrawer('none');
        setNotification(`🤖 AI Generated Route applied to 3D Live Map!`);
      }
    }
  };

  // Handler for Janitorial cleaning upload (blocks route)
  const handleUploadCleaning = (newReport) => {
    setCleaningReports(prev => [newReport, ...prev]);
    setHazardMap(prev => ({
      ...prev,
      [newReport.edgeId]: { isBlocked: true, type: newReport.cleaningType }
    }));
    setNotification(`🧹 Cleaning uploaded for ${newReport.locationName}. Route automatically blocked in navigation!`);
  };

  // Handler for Janitorial cleaning completion (reopens route)
  const handleCompleteCleaning = (reportId, edgeId) => {
    setCleaningReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { 
          ...r, 
          status: 'Completed', 
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
      }
      return r;
    }));
    setHazardMap(prev => {
      const copy = { ...prev };
      delete copy[edgeId];
      return copy;
    });
    setNotification(`✓ Corridor marked Cleaned & Reopened! Optimal route restored in app.`);
  };

  const handleToggleHazard = (edgeId, isBlocked) => {
    setHazardMap(prev => ({
      ...prev,
      [edgeId]: { isBlocked, type: isBlocked ? 'WET_FLOOR' : null }
    }));

    setNotification(
      isBlocked 
        ? `⚠️ Cleaning hazard flagged. Route automatically avoided in navigation.`
        : `✓ Corridor marked clear. Standard route restored.`
    );
  };

  const handleClearAllHazards = () => {
    setHazardMap({});
    setCleaningReports(prev => prev.map(r => ({
      ...r,
      status: 'Completed',
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })));
    setNotification('All corridor cleaning zones cleared. All routes reopened in app.');
  };

  // Handler for Cabin Radar navigate-to
  const handleNavigateToNode = (nodeId) => {
    const node = nodes[nodeId];
    if (node) {
      setTargetNodeId(nodeId);
      setActiveFloor(node.floor);
      setActiveDrawer('none');
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
      setActiveFloor(nodes[startNodeId]?.floor ?? 0);
      setActiveDrawer('none');
      setNotification('🚨 Emergency evacuation route active! Follow safe exit trajectory.');
    }
  };

  // Role details
  const roleLabels = {
    student: { name: 'Gagan N Prasad', role: 'Student (CSE 4th Sem)', badge: '26UG1BYCS0588-T' },
    faculty: { name: 'Prof. Rajesh K', role: 'Assistant Professor', badge: 'CSE-FAC-08' },
    hod: { name: 'Dr. Harish Kumar N', role: 'Professor & HOD', badge: 'CSE-HOD-01' },
    janitorial: { name: 'Ramesh M', role: 'Custodial & Safety Lead', badge: 'FAC-JAN-04' },
    admin: { name: 'SuperAdmin', role: 'System Administrator', badge: 'SYS-ADM-01' }
  };

  const activeHazardCount = Object.values(hazardMap).filter(h => h.isBlocked).length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#070b13] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-14 right-6 z-50 max-w-md animate-bounce pointer-events-none">
          <div className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 border border-blue-400">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Sleek Top Spatial Status Bar (Height: 48px) */}
      <header className="h-12 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-40">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 ring-1 ring-white/20">
            <Compass className="h-4 w-4 animate-spin-slow" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-white">
              GRIDLOCK
            </span>
            <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyan-400">
              SPATIAL COCKPIT
            </span>
            <span className="hidden md:inline text-slate-500 text-xs">•</span>
            <span className="hidden md:inline text-slate-400 text-xs font-medium">
              BMSIT CSE Apex Complex
            </span>
          </div>
        </div>

        {/* Center Live Telemetry Strip */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1 text-xs">
          {activeRoute ? (
            <div className="flex items-center gap-2 text-cyan-300">
              <Navigation className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span className="font-medium text-[11px]">
                Route: <strong className="text-white">{nodes[startNodeId]?.label || startNodeId}</strong> → <strong className="text-white">{nodes[targetNodeId]?.label || targetNodeId}</strong>
              </span>
              <span className="text-slate-500 font-mono">|</span>
              <span className="font-mono text-emerald-400 font-bold text-[11px]">
                {activeRoute.totalDistance}m ({activeRoute.estimatedSeconds}s)
              </span>
              {isAccessibleMode && (
                <span className="rounded bg-purple-500/20 text-purple-300 px-1.5 py-0.2 text-[10px] font-semibold border border-purple-500/40">
                  ♿ Elevator 1 Only
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>A* Dijkstra &lt;180ms Engine Ready</span>
              <span className="text-slate-600">•</span>
              <span>Cartesian Mesh 24 Nodes Online</span>
              {activeHazardCount > 0 && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {activeHazardCount} Wet Floor Detours
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Tools & Active Persona Pill */}
        <div className="flex items-center gap-2">
          {/* Accessible No-Stairs Mode Toggle */}
          <button
            onClick={() => setIsAccessibleMode(prev => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              isAccessibleMode
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 border border-purple-400/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
            title="Toggle ♿ Stair-Free Accessibility Mode"
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">♿ No-Stairs</span>
          </button>

          {/* Quick Scan QR Anchor */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-semibold transition"
            title="Scan Physical QR Anchor"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Scan QR</span>
          </button>

          {/* Quick Emergency SOS */}
          <button
            onClick={() => setIsSosOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/30 text-xs font-semibold transition"
            title="Emergency Evacuation Egress"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline text-[11px]">SOS</span>
          </button>

          {/* Role Pill Switcher */}
          <button
            onClick={() => {
              const roles = ['student', 'faculty', 'hod', 'janitorial', 'admin'];
              const nextRole = roles[(roles.indexOf(userRole) + 1) % roles.length];
              setUserRole(nextRole);
              setNotification(`Switched persona to: ${nextRole.toUpperCase()}`);
            }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition text-xs"
            title="Click to cycle role persona"
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-[10px] font-black text-white">
              {userRole[0].toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-bold text-white leading-tight capitalize">
                {roleLabels[userRole]?.name || userRole}
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">
                {userRole.toUpperCase()}
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Main Spatial Stage Cockpit Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 1. Left Nav Rail (64px) */}
        <NavRail
          currentRole={userRole}
          onRoleChange={(newRole) => {
            setUserRole(newRole);
            setNotification(`Switched persona to: ${newRole.toUpperCase()}`);
          }}
          activeDrawer={activeDrawer}
          onSelectDrawer={(drawerId) => {
            setActiveDrawer(prev => prev === drawerId ? 'none' : drawerId);
          }}
          onOpenScanner={() => setIsScannerOpen(true)}
          onTriggerSos={() => setIsSosOpen(true)}
          isAccessibleMode={isAccessibleMode}
          onToggleAccessibleMode={() => setIsAccessibleMode(prev => !prev)}
          onOpenAiCopilot={() => {
            const aiBtn = document.querySelector('button[title="Open Gridlock Campus AI Assistant"]');
            if (aiBtn) aiBtn.click();
          }}
        />

        {/* 2. Left Floating HUD Panel (340px) */}
        <LeftHudPanel
          currentRole={userRole}
          activeFloor={activeFloor}
          onFloorChange={setActiveFloor}
          startNodeId={startNodeId}
          targetNodeId={targetNodeId}
          onSelectStart={setStartNodeId}
          onSelectTarget={setTargetNodeId}
          activeRoute={activeRoute}
          isAccessibleMode={isAccessibleMode}
          onToggleAccessibleMode={() => setIsAccessibleMode(prev => !prev)}
          mapLayers={mapLayers}
          onToggleMapLayer={handleToggleMapLayer}
          nodes={nodes}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        {/* 3. Center Interactive 3D Digital Twin Map Viewport */}
        <div className="flex-1 h-full relative overflow-hidden flex flex-col">
          <IsometricBuildingMap
            activeFloor={activeFloor}
            onFloorChange={setActiveFloor}
            startNodeId={startNodeId}
            targetNodeId={targetNodeId}
            onSelectNode={handleMapSelectNode}
            activeRoute={activeRoute}
            hazardMap={hazardMap}
            isSosActive={isSosActive}
            isAccessibleMode={isAccessibleMode}
            nodes={nodes}
            edges={edges}
            mapLayers={mapLayers}
          />
        </div>

        {/* 4. Right Telemetry HUD / Slide-over Module Drawer */}
        <RightHudPanel
          currentRole={userRole}
          activeDrawer={activeDrawer}
          onSelectDrawer={setActiveDrawer}
          facultyList={facultyList}
          appointments={appointments}
          hazardMap={hazardMap}
          cleaningReports={cleaningReports}
          nodes={nodes}
          onNavigateToNode={handleNavigateToNode}
        >
          {/* Module Drawer Content */}
          {activeDrawer === 'erp' && (
            <ErpHub 
              userRole={userRole}
              mobilityProfile={mobilityProfile}
              onUpdateMobilityProfile={handleUpdateMobilityProfile}
              isAccessibleMode={isAccessibleMode}
              onToggleAccessibleMode={() => setIsAccessibleMode(prev => !prev)}
            />
          )}

          {activeDrawer === 'cabin' && userRole !== 'janitorial' && (
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

          {activeDrawer === 'grievance' && (
            <GrievanceDesk
              currentScannedNodeId={startNodeId}
              userRole={userRole}
            />
          )}

          {activeDrawer === 'janitorial' && (
            <JanitorialControls
              hazardMap={hazardMap}
              onToggleHazard={handleToggleHazard}
              onClearAllHazards={handleClearAllHazards}
              cleaningReports={cleaningReports}
              onUploadCleaning={handleUploadCleaning}
              onCompleteCleaning={handleCompleteCleaning}
            />
          )}

          {activeDrawer === 'admin' && (userRole === 'admin' || userRole === 'hod') && (
            <AdminStudio
              nodes={nodes}
              edges={edges}
              hazardMap={hazardMap}
              onAddNewNode={handleAddNewNode}
              onAddNewEdge={handleAddNewEdge}
              onApplyAiRoute={handleApplyAiRoute}
            />
          )}
        </RightHudPanel>
      </div>

      {/* Universal Campus AI Copilot Assistant */}
      <CampusAiCopilot
        userRole={userRole}
        studentErp={STUDENT_ERP}
        facultyRoster={facultyList}
        facultyClassRoster={FACULTY_CLASS_ROSTER}
        appointments={appointments}
        hazardMap={hazardMap}
        nodes={nodes}
        edges={edges}
        isAccessibleMode={isAccessibleMode}
        mobilityProfile={mobilityProfile}
        onNavigate={(start, target, accessible) => {
          if (start) setStartNodeId(start);
          if (target) setTargetNodeId(target);
          if (accessible !== undefined) setIsAccessibleMode(accessible);
          const targetNode = nodes[target];
          if (targetNode) setActiveFloor(targetNode.floor);
          setActiveDrawer('none');
          setNotification(`📍 Route loaded: ${nodes[start]?.label || 'Start'} to ${nodes[target]?.label || 'Destination'}`);
        }}
        onSetTab={(tab) => {
          if (tab === 'wayfinding') setActiveDrawer('none');
          else if (tab === 'admin_studio') setActiveDrawer('admin');
          else setActiveDrawer(tab);
        }}
        onUpdateMobilityProfile={handleUpdateMobilityProfile}
        onToggleAccessibleMode={() => setIsAccessibleMode(prev => !prev)}
      />

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
