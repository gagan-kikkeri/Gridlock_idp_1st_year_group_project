import React, { useState, useMemo } from 'react';
import { 
  BUILDING_METADATA, 
  SPATIAL_NODES, 
  FLOOR_ROOMS 
} from '../data/campusData.js';
import { 
  Search, 
  ChevronDown, 
  Layers, 
  Navigation, 
  MapPin, 
  Flag, 
  RotateCw, 
  Footprints, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Wifi, 
  ShieldAlert, 
  Accessibility, 
  Sparkles,
  QrCode,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function LeftHudPanel({
  currentRole = 'student',
  activeFloor = 0,
  onFloorChange,
  startNodeId,
  targetNodeId,
  onSelectStart,
  onSelectTarget,
  activeRoute,
  isAccessibleMode = false,
  onToggleAccessibleMode,
  mapLayers = {},
  onToggleMapLayer,
  nodes = SPATIAL_NODES,
  onOpenScanner
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'labs', 'cabins', 'classrooms', 'amenities', 'emergency'
  const [showDirections, setShowDirections] = useState(false);

  // Filtered nodes based on search and category
  const allNodesList = Object.values(nodes);

  const filteredNodes = useMemo(() => {
    return allNodesList.filter(n => {
      const matchesSearch = !searchQuery.trim() || 
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.qr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.description && n.description.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory === 'labs') matchesCat = n.type === 'lab';
      else if (selectedCategory === 'cabins') matchesCat = n.type === 'office' || n.id.includes('HOD') || n.id.includes('FACULTY');
      else if (selectedCategory === 'classrooms') matchesCat = n.type === 'classroom' || n.type === 'hall';
      else if (selectedCategory === 'amenities') matchesCat = n.type === 'amenity' || n.type === 'lobby';
      else if (selectedCategory === 'emergency') matchesCat = n.type === 'emergency' || n.type === 'exit';

      return matchesSearch && matchesCat;
    });
  }, [allNodesList, searchQuery, selectedCategory]);

  const startNode = nodes[startNodeId];
  const targetNode = nodes[targetNodeId];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'labs', label: 'Labs' },
    { id: 'cabins', label: 'Cabins' },
    { id: 'classrooms', label: 'Classrooms' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'emergency', label: 'Safety' }
  ];

  return (
    <div className="w-[340px] h-[calc(100vh-2rem)] my-4 ml-4 shrink-0 bg-slate-950/85 backdrop-blur-2xl border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-30 select-none">
      {/* Top Header & Role Indicator */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Indoor Spatial Navigation</span>
          </div>
          <h2 className="text-sm font-extrabold text-white mt-0.5">
            Apex Spatial Command
          </h2>
        </div>
        <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-300 font-mono border border-slate-700/60 uppercase">
          {currentRole}
        </span>
      </div>

      {/* Scrollable HUD Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-xs">
        {/* Search Bar with Autocomplete suggestions */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations, labs, cabins, rooms..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}

          {/* Autocomplete Dropdown if typing */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl z-50 divide-y divide-slate-800/60">
              {filteredNodes.length > 0 ? (
                filteredNodes.map(n => (
                  <button
                    key={n.id}
                    onClick={() => {
                      onSelectTarget(n.id);
                      onFloorChange(n.floor);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-cyan-600/20 text-slate-200 hover:text-white transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs">{n.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{n.qr} • Floor {n.floor === 0 ? 'GF' : '1F'}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                ))
              ) : (
                <div className="p-3 text-[11px] text-slate-500 text-center">
                  No matching rooms or facilities found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vertical Floor Stepper & Altitude Selector (Inspired by Reference Image) */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Building Levels (Altitude)</span>
            <span className="text-cyan-400 font-bold">{activeFloor === 0 ? '0.0m' : '+4.2m'}</span>
          </div>

          <div className="space-y-1.5">
            {/* Floor 1 */}
            <button
              onClick={() => onFloorChange(1)}
              className={`w-full flex items-center justify-between p-2 rounded-lg border transition ${
                activeFloor === 1
                  ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/30 border-purple-500/60 shadow-md shadow-purple-500/10'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 rounded-md font-mono font-black text-xs flex items-center justify-center ${
                  activeFloor === 1 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  1F
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">First Floor (+4.2m)</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[160px]">HOD Suite, Faculty, LH 101/102, Library</div>
                </div>
              </div>
              {targetNode && targetNode.floor === 1 && (
                <Flag className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>

            {/* Vertical connector line */}
            <div className="ml-5 h-3 border-l-2 border-dashed border-slate-700/80" />

            {/* Floor 0 */}
            <button
              onClick={() => onFloorChange(0)}
              className={`w-full flex items-center justify-between p-2 rounded-lg border transition ${
                activeFloor === 0
                  ? 'bg-gradient-to-r from-cyan-900/50 to-blue-900/30 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 rounded-md font-mono font-black text-xs flex items-center justify-center ${
                  activeFloor === 0 ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  GF
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">Ground Floor (0.0m)</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[160px]">Entrance, AI & ML Lab, Systems, Seminar</div>
                </div>
              </div>
              {targetNode && targetNode.floor === 0 && (
                <Flag className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Map Layers Toggles (Direct reference neon switches) */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3 space-y-2.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Map Telemetry Layers
            </span>
          </div>

          {/* Layer 1: Universal Stair-Free Accessibility Mode */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Accessibility className={`w-4 h-4 ${isAccessibleMode ? 'text-purple-400' : 'text-slate-400'}`} />
              <span className={isAccessibleMode ? 'text-purple-300 font-semibold' : 'text-slate-300'}>
                Stair-Free (Elevator & Ramps)
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleAccessibleMode}
              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                isAccessibleMode ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ${
                isAccessibleMode ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Layer 2: Custodial Hazard & Cleaning Detour */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${mapLayers.cleaning ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className={mapLayers.cleaning ? 'text-amber-200 font-semibold' : 'text-slate-300'}>
                Cleaning & Detour Overlay
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleMapLayer('cleaning')}
              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                mapLayers.cleaning ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ${
                mapLayers.cleaning ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Layer 3: WiFi Mesh & IoT Beacons */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Wifi className={`w-4 h-4 ${mapLayers.wifi ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className={mapLayers.wifi ? 'text-cyan-200 font-semibold' : 'text-slate-300'}>
                WiFi Mesh & IoT Coverage
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleMapLayer('wifi')}
              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                mapLayers.wifi ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ${
                mapLayers.wifi ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Layer 4: QR Wall Anchors */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <QrCode className={`w-4 h-4 ${mapLayers.qr ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className={mapLayers.qr ? 'text-blue-200 font-semibold' : 'text-slate-300'}>
                Cartesian QR Touchpoints
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleMapLayer('qr')}
              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                mapLayers.qr ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ${
                mapLayers.qr ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Layer 5: Safety & Emergency Exits */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Flame className={`w-4 h-4 ${mapLayers.emergency ? 'text-red-400' : 'text-slate-400'}`} />
              <span className={mapLayers.emergency ? 'text-red-200 font-semibold' : 'text-slate-300'}>
                Fire Egress & Muster Areas
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleMapLayer('emergency')}
              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                mapLayers.emergency ? 'bg-red-500' : 'bg-slate-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ${
                mapLayers.emergency ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* Quick Category Filters */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Filter Directory
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  selectedCategory === c.id
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wayfinding Route Selectors & Telemetry */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              Route Calculator
            </span>
            <button
              onClick={onOpenScanner}
              className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <QrCode className="w-3 h-3" />
              <span>Scan QR</span>
            </button>
          </div>

          {/* Origin */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <MapPin className="w-3 h-3" />
            </div>
            <select
              value={startNodeId || ''}
              onChange={(e) => onSelectStart(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="" disabled>Select origin...</option>
              {allNodesList.map(n => (
                <option key={n.id} value={n.id}>
                  {n.label} ({n.qr}) - {n.floor === 0 ? 'GF' : '1F'}
                </option>
              ))}
            </select>
          </div>

          {/* Swap divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full h-px bg-slate-800" />
            <button
              onClick={() => {
                const temp = startNodeId;
                onSelectStart(targetNodeId);
                onSelectTarget(temp);
              }}
              className="absolute p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              title="Swap Origin and Destination"
            >
              <RotateCw className="w-3 h-3" />
            </button>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Flag className="w-3 h-3" />
            </div>
            <select
              value={targetNodeId || ''}
              onChange={(e) => onSelectTarget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="" disabled>Select destination...</option>
              {allNodesList.map(n => (
                <option key={n.id} value={n.id}>
                  {n.label} ({n.qr}) - {n.floor === 0 ? 'GF' : '1F'}
                </option>
              ))}
            </select>
          </div>

          {/* Active Route Result Telemetry */}
          {activeRoute && activeRoute.success && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Footprints className="w-3 h-3 text-cyan-400" /> Distance
                  </div>
                  <div className="text-sm font-black text-white mt-0.5">
                    {activeRoute.totalDistance}m
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> Transit Time
                  </div>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">
                    {Math.floor(activeRoute.estimatedSeconds / 60)}m {activeRoute.estimatedSeconds % 60}s
                  </div>
                </div>
              </div>

              {/* Detour or Stair-Free Notices */}
              {activeRoute.detoured && (
                <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Hazard Detour active: Route bypasses wet floors.</span>
                </div>
              )}

              {(activeRoute.isAccessible || isAccessibleMode) && (
                <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-200 text-[11px] flex items-center gap-2">
                  <Accessibility className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Stair-free route: Navigating via Passenger Elevator 1.</span>
                </div>
              )}

              {/* Turn-by-turn guidance toggle */}
              <button
                onClick={() => setShowDirections(!showDirections)}
                className="w-full text-center text-[10px] font-bold text-cyan-400 hover:text-cyan-300 pt-1"
              >
                {showDirections ? 'Hide Turn-by-Turn Guidance ▲' : `Show Turn-by-Turn Guidance (${activeRoute.directions?.length || 0} steps) ▼`}
              </button>

              {showDirections && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activeRoute.directions?.map((step, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-slate-950/40 border border-slate-800/60 text-[10px] text-slate-300 flex items-start gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[8px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
