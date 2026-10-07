import React, { useState, useMemo, useRef } from 'react';
import { 
  BUILDING_METADATA, 
  SPATIAL_NODES, 
  GRAPH_EDGES, 
  FLOOR_ROOMS 
} from '../data/campusData.js';
import { 
  Layers, 
  Compass, 
  Eye, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  MapPin, 
  Flag, 
  ArrowUpDown, 
  Footprints, 
  AlertTriangle, 
  Wifi, 
  Flame, 
  DoorOpen, 
  Terminal, 
  Cpu, 
  Users, 
  BookOpen, 
  Coffee, 
  Droplet, 
  ShieldAlert, 
  Sparkles,
  Accessibility,
  Sliders,
  Box
} from 'lucide-react';

export default function IsometricBuildingMap({
  activeFloor = 0,
  onFloorChange,
  startNodeId,
  targetNodeId,
  onSelectNode,
  activeRoute,
  hazardMap = {},
  isSosActive = false,
  isAccessibleMode = false,
  nodes = SPATIAL_NODES,
  edges = GRAPH_EDGES,
  mapLayers = {
    accessibility: true,
    cleaning: true,
    wifi: true,
    qr: true,
    emergency: true
  }
}) {
  // 3D Isometric View & Camera Controls
  const [viewMode, setViewMode] = useState('3d'); // '3d' (isometric) or '2d' (flat plan)
  const [explodedSpacing, setExplodedSpacing] = useState(220); // vertical separation between floors in px
  const [focusFloor, setFocusFloor] = useState('all'); // 'all', 0, 1
  const [zoom, setZoom] = useState(0.92);
  const [pan, setPan] = useState({ x: 0, y: -20 });
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Canvas bounds & center
  const SVG_WIDTH = 1100;
  const SVG_HEIGHT = 760;
  const CENTER_X = SVG_WIDTH / 2;
  const CENTER_Y = SVG_HEIGHT / 2 + 50;

  // Isometric Projection Math
  // Projects (x, y, floor, heightOffset) -> { px, py }
  const projectIso = (x, y, floor = 0, h = 0) => {
    if (viewMode === '2d') {
      // Flat Top-Down 2D Projection
      const scale2D = 0.95;
      const offsetX = (SVG_WIDTH - 1000 * scale2D) / 2;
      const offsetY = (SVG_HEIGHT - 600 * scale2D) / 2;
      return {
        px: offsetX + x * scale2D,
        py: offsetY + y * scale2D
      };
    }

    // 3D Isometric Projection
    // Scale canvas [0, 1000] x [0, 600] around center
    const u = (x - 500) * 0.95;
    const v = (y - 320) * 0.95;

    // Angle theta = 30 deg, foreshortening tilt = 0.58
    const cos30 = 0.866;
    const sin30 = 0.5;
    const tilt = 0.62;

    const isoX = CENTER_X + (u - v) * cos30;
    const isoYBase = CENTER_Y + (u + v) * sin30 * tilt;

    // Vertical displacement based on floor level and exploded spacing
    const floorElevation = floor * explodedSpacing;
    const prismHeight = h * 0.85;

    return {
      px: isoX,
      py: isoYBase - floorElevation - prismHeight
    };
  };

  // Pan interaction
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Room icon helper
  const renderRoomIcon = (iconName, size = 13) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-3.5 h-3.5" />;
      case 'Terminal': return <Terminal className="w-3.5 h-3.5" />;
      case 'Users': return <Users className="w-3.5 h-3.5" />;
      case 'BookOpen': return <BookOpen className="w-3.5 h-3.5" />;
      case 'Coffee': return <Coffee className="w-3.5 h-3.5" />;
      case 'Droplet': return <Droplet className="w-3.5 h-3.5" />;
      case 'DoorOpen': return <DoorOpen className="w-3.5 h-3.5" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5" />;
      case 'ArrowUpDown': return <ArrowUpDown className="w-3.5 h-3.5" />;
      default: return <Compass className="w-3.5 h-3.5" />;
    }
  };

  // Generate 3D Prism Paths for each room
  // Room has rect (x, y, w, h), height H
  const generatePrismFaces = (room, floor) => {
    const H = viewMode === '2d' ? 0 : 26; // 3D wall extrusion height
    const { x, y, w, h } = room;

    const p0 = projectIso(x, y, floor, 0); // bottom back
    const p1 = projectIso(x + w, y, floor, 0); // bottom right
    const p2 = projectIso(x + w, y + h, floor, 0); // bottom front
    const p3 = projectIso(x, y + h, floor, 0); // bottom left

    const t0 = projectIso(x, y, floor, H); // top back
    const t1 = projectIso(x + w, y, floor, H); // top right
    const t2 = projectIso(x + w, y + h, floor, H); // top front
    const t3 = projectIso(x, y + h, floor, H); // top left

    // South/Front Face: p3 -> p2 -> t2 -> t3
    const frontFace = `${p3.px},${p3.py} ${p2.px},${p2.py} ${t2.px},${t2.py} ${t3.px},${t3.py}`;
    // East/Right Face: p2 -> p1 -> t1 -> t2
    const rightFace = `${p2.px},${p2.py} ${p1.px},${p1.py} ${t1.px},${t1.py} ${t2.px},${t2.py}`;
    // Top Roof Face: t0 -> t1 -> t2 -> t3
    const topFace = `${t0.px},${t0.py} ${t1.px},${t1.py} ${t2.px},${t2.py} ${t3.px},${t3.py}`;

    // Center point for 3D label
    const center = projectIso(x + w / 2, y + h / 2, floor, H + 4);

    return { frontFace, rightFace, topFace, center };
  };

  // Generate 3D Glass Floor Slab Outline
  const generateFloorSlab = (floor) => {
    if (viewMode === '2d') return null;
    const pad = 35;
    const p0 = projectIso(60 - pad, 80 - pad, floor, -4);
    const p1 = projectIso(960 + pad, 80 - pad, floor, -4);
    const p2 = projectIso(960 + pad, 560 + pad, floor, -4);
    const p3 = projectIso(60 - pad, 560 + pad, floor, -4);
    return `${p0.px},${p0.py} ${p1.px},${p1.py} ${p2.px},${p2.py} ${p3.px},${p3.py}`;
  };

  // Render 3D Pathfinding Trajectory Polyline
  const routePolylines = useMemo(() => {
    if (!activeRoute || !activeRoute.path || activeRoute.path.length < 2) return [];

    const segments = [];
    const pathNodes = activeRoute.path.map(id => nodes[id]).filter(Boolean);

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const u = pathNodes[i];
      const v = pathNodes[i + 1];

      const pU = projectIso(u.x, u.y, u.floor, 14);
      const pV = projectIso(v.x, v.y, v.floor, 14);

      const isVertical = u.floor !== v.floor;
      segments.push({
        id: `seg-${i}`,
        x1: pU.px,
        y1: pU.py,
        x2: pV.px,
        y2: pV.py,
        isVertical,
        floor: u.floor
      });
    }

    return segments;
  }, [activeRoute, nodes, viewMode, explodedSpacing, zoom, pan]);

  // Which floors to display
  const floorsToRender = focusFloor === 'all' 
    ? (viewMode === '2d' ? [activeFloor] : [0, 1]) 
    : [focusFloor];

  return (
    <div 
      className="relative flex-1 w-full h-full bg-[#070b13] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Ambient Grid Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.25) 0%, transparent 70%), linear-gradient(rgba(15, 23, 42, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.4) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      />

      {/* Floating Center Viewport Header / Mode Indicators */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-slate-950/80 border border-slate-800/80 px-3.5 py-1.5 backdrop-blur-xl shadow-2xl">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {viewMode === '3d' ? 'Interactive 3D Isometric Digital Twin' : '2D Architectural Plan View'}
          </span>
          <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
            BMSIT APEX BLOCK
          </span>
        </div>

        {/* 3D Isometric <-> 2D Blueprint Switcher */}
        <div className="flex rounded-xl bg-slate-950/80 border border-slate-800/80 p-0.5 backdrop-blur-xl shadow-xl">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition ${
              viewMode === '3d'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Isometric</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition ${
              viewMode === '2d'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2D Plan</span>
          </button>
        </div>
      </div>

      {/* Camera & Exploded View Controls (Bottom Right of Center Stage) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-2.5">
        {/* Exploded View Slider (Only in 3D) */}
        {viewMode === '3d' && (
          <div className="flex items-center gap-3 rounded-xl bg-slate-950/85 border border-slate-800/80 px-3.5 py-2 backdrop-blur-xl shadow-2xl">
            <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exploded Multi-Level:</span>
            </span>
            <input 
              type="range"
              min="0"
              max="340"
              value={explodedSpacing}
              onChange={(e) => setExplodedSpacing(parseInt(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              title="Adjust multi-floor vertical separation in 3D"
            />
            <span className="text-[10px] font-mono text-cyan-300 min-w-8 text-right">
              {explodedSpacing}px
            </span>
          </div>
        )}

        {/* Zoom & Reset Floating Pill */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-950/85 border border-slate-800/80 p-1 backdrop-blur-xl shadow-2xl">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom In"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom Out"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(0.92);
              setPan({ x: 0, y: -20 });
              setExplodedSpacing(220);
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Reset 3D Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main SVG Vector Canvas */}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out'
        }}
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="neon-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neon-glow-purple" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="route-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="elevator-shaft-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="stair-shaft-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="route-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* 1. RENDER VERTICAL CONNECTORS (Elevator Shaft & Staircase) in 3D */}
        {viewMode === '3d' && (
          <g className="vertical-connectors-3d">
            {/* Passenger Elevator 1 Glass Shaft Column */}
            {(() => {
              const liftGF = projectIso(520, 390, 0, 0);
              const lift1F = projectIso(520, 390, 1, 26);
              const liftW = 55;
              const liftH = 55;
              const b0 = projectIso(520, 390, 0, 0);
              const b1 = projectIso(520 + liftW, 390, 0, 0);
              const b2 = projectIso(520 + liftW, 390 + liftH, 0, 0);
              const b3 = projectIso(520, 390 + liftH, 0, 0);

              const t0 = projectIso(520, 390, 1, 26);
              const t1 = projectIso(520 + liftW, 390, 1, 26);
              const t2 = projectIso(520 + liftW, 390 + liftH, 1, 26);
              const t3 = projectIso(520, 390 + liftH, 1, 26);

              return (
                <g className="elevator-shaft">
                  {/* Shaft Glass Column Faces */}
                  <polygon
                    points={`${b3.px},${b3.py} ${b2.px},${b2.py} ${t2.px},${t2.py} ${t3.px},${t3.py}`}
                    fill="url(#elevator-shaft-grad)"
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                    strokeDasharray="4 2"
                  />
                  <polygon
                    points={`${b2.px},${b2.py} ${b1.px},${b1.py} ${t1.px},${t1.py} ${t2.px},${t2.py}`}
                    fill="url(#elevator-shaft-grad)"
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                    strokeDasharray="4 2"
                  />

                  {/* Mid-flight Elevator Cab Indicator */}
                  {(() => {
                    const cabCenter = projectIso(520 + liftW / 2, 390 + liftH / 2, 0.5, 0);
                    return (
                      <g transform={`translate(${cabCenter.px}, ${cabCenter.py})`}>
                        <rect x="-16" y="-14" width="32" height="28" rx="6" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
                        <ArrowUpDown className="w-3.5 h-3.5 text-purple-300" x="-7" y="-7" />
                        {isAccessibleMode && (
                          <circle cx="12" cy="-10" r="5" fill="#10b981" />
                        )}
                      </g>
                    );
                  })()}
                </g>
              );
            })()}

            {/* Central Staircase 1 Flight Column */}
            {(() => {
              const b0 = projectIso(420, 390, 0, 0);
              const b2 = projectIso(420 + 55, 390 + 55, 0, 0);
              const t0 = projectIso(420, 390, 1, 26);
              const t2 = projectIso(420 + 55, 390 + 55, 1, 26);

              return (
                <g className="staircase-flight" opacity={isAccessibleMode ? 0.35 : 0.8}>
                  <line 
                    x1={b0.px} y1={b0.py} x2={t0.px} y2={t0.py} 
                    stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" 
                  />
                  <line 
                    x1={b2.px} y1={b2.py} x2={t2.px} y2={t2.py} 
                    stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" 
                  />
                </g>
              );
            })()}
          </g>
        )}

        {/* 2. RENDER MULTI-FLOOR SLABS & ROOM PRISMS (Bottom-up: Floor 0 then Floor 1) */}
        {floorsToRender.map((floor) => {
          const rooms = FLOOR_ROOMS[floor] || [];
          const slabPoly = generateFloorSlab(floor);

          return (
            <g key={`floor-group-${floor}`} className={`floor-layer-${floor}`}>
              {/* 3D Glass Floor Slab Surface */}
              {slabPoly && (
                <g className="floor-slab">
                  <polygon
                    points={slabPoly}
                    fill={floor === 0 ? "rgba(15, 23, 42, 0.45)" : "rgba(30, 41, 59, 0.35)"}
                    stroke={floor === 0 ? "rgba(56, 189, 248, 0.4)" : "rgba(168, 85, 247, 0.45)"}
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                  />
                  {/* Floor Level Stamp floating at edge */}
                  {(() => {
                    const stampPos = projectIso(70, 530, floor, 0);
                    return (
                      <text
                        x={stampPos.px}
                        y={stampPos.py}
                        fill={floor === 0 ? "#38bdf8" : "#c084fc"}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        letterSpacing="1.5"
                      >
                        {floor === 0 ? "• GROUND FLOOR (0.0M)" : "• FIRST FLOOR (+4.2M)"}
                      </text>
                    );
                  })()}
                </g>
              )}

              {/* Corridors on this floor */}
              {edges
                .filter(e => {
                  const u = nodes[e.u];
                  const v = nodes[e.v];
                  return u && v && u.floor === floor && v.floor === floor && !e.isVertical;
                })
                .map(edge => {
                  const u = nodes[edge.u];
                  const v = nodes[edge.v];
                  const pU = projectIso(u.x, u.y, floor, 2);
                  const pV = projectIso(v.x, v.y, floor, 2);

                  const isBlocked = hazardMap[edge.id]?.isBlocked;

                  return (
                    <g key={edge.id} className="corridor-path">
                      <line
                        x1={pU.px}
                        y1={pU.py}
                        x2={pV.px}
                        y2={pV.py}
                        stroke={isBlocked ? "#ef4444" : "rgba(100, 116, 139, 0.35)"}
                        strokeWidth={isBlocked ? 4 : 2}
                        strokeDasharray={isBlocked ? "4 3" : undefined}
                      />
                      {/* Hazard Caution Cone Marker if Blocked */}
                      {isBlocked && mapLayers.cleaning && (
                        <g transform={`translate(${(pU.px + pV.px) / 2}, ${(pU.py + pV.py) / 2})`}>
                          <circle r="9" fill="#ef4444" opacity="0.9" />
                          <AlertTriangle className="w-3 h-3 text-white" x="-6" y="-6" />
                        </g>
                      )}
                    </g>
                  );
                })}

              {/* 3D Room Prisms on this floor */}
              {rooms.map(room => {
                const { frontFace, rightFace, topFace, center } = generatePrismFaces(room, floor);
                const isHovered = hoveredEntity === room.id;

                // Color themes based on room type
                let roofFill = room.color;
                let strokeColor = room.border;

                if (room.id.includes('AI') || room.id.includes('SYS') || room.id.includes('IOT')) {
                  roofFill = isHovered ? "rgba(99, 102, 241, 0.5)" : "rgba(30, 58, 138, 0.4)";
                  strokeColor = "#6366f1";
                } else if (room.id.includes('HOD') || room.id.includes('FACULTY')) {
                  roofFill = isHovered ? "rgba(236, 72, 153, 0.45)" : "rgba(131, 24, 67, 0.35)";
                  strokeColor = "#f43f5e";
                } else if (room.id.includes('LH')) {
                  roofFill = isHovered ? "rgba(245, 158, 11, 0.4)" : "rgba(120, 53, 15, 0.3)";
                  strokeColor = "#eab308";
                } else if (room.id.includes('LIBRARY')) {
                  roofFill = isHovered ? "rgba(16, 185, 129, 0.4)" : "rgba(6, 78, 59, 0.35)";
                  strokeColor = "#10b981";
                }

                return (
                  <g 
                    key={room.id}
                    className="room-prism group cursor-pointer"
                    onMouseEnter={() => setHoveredEntity(room.id)}
                    onMouseLeave={() => setHoveredEntity(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Find closest node to this room
                      const matchedNode = Object.values(nodes).find(n => n.floor === floor && Math.abs(n.x - (room.x + room.w / 2)) < 80 && Math.abs(n.y - (room.y + room.h / 2)) < 80);
                      if (matchedNode) {
                        onSelectNode(matchedNode.id);
                      }
                    }}
                  >
                    {/* Front Wall */}
                    {frontFace && (
                      <polygon
                        points={frontFace}
                        fill="rgba(15, 23, 42, 0.75)"
                        stroke={strokeColor}
                        strokeWidth="1"
                        strokeOpacity="0.6"
                      />
                    )}

                    {/* Right Wall */}
                    {rightFace && (
                      <polygon
                        points={rightFace}
                        fill="rgba(30, 41, 59, 0.85)"
                        stroke={strokeColor}
                        strokeWidth="1"
                        strokeOpacity="0.6"
                      />
                    )}

                    {/* Top Roof Surface */}
                    <polygon
                      points={topFace}
                      fill={roofFill}
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      filter={isHovered ? "url(#neon-glow-cyan)" : undefined}
                      className="transition-all duration-200"
                    />

                    {/* Room Floating 3D Badge & Label */}
                    <g transform={`translate(${center.px}, ${center.py})`} className="pointer-events-none">
                      {/* Glass label pill */}
                      <rect
                        x="-48"
                        y="-12"
                        width="96"
                        height="20"
                        rx="6"
                        fill="rgba(7, 11, 19, 0.85)"
                        stroke={strokeColor}
                        strokeWidth="1"
                        strokeOpacity="0.8"
                      />
                      {/* Label Text */}
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="9"
                        fontWeight="bold"
                        letterSpacing="0.3"
                      >
                        {room.label.length > 15 ? room.label.slice(0, 14) + '…' : room.label}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Spatial Nodes & QR Anchors on this floor */}
              {Object.values(nodes)
                .filter(n => n.floor === floor)
                .map(node => {
                  const p = projectIso(node.x, node.y, floor, 14);
                  const isStart = node.id === startNodeId;
                  const isTarget = node.id === targetNodeId;

                  return (
                    <g 
                      key={node.id} 
                      className="spatial-node-anchor cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectNode(node.id);
                      }}
                    >
                      {/* Start Node Pin */}
                      {isStart && (
                        <g transform={`translate(${p.px}, ${p.py - 12})`}>
                          <circle r="14" fill="#3b82f6" opacity="0.3" className="animate-ping" />
                          <circle r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                          <MapPin className="w-3.5 h-3.5 text-white" x="-7" y="-7" />
                        </g>
                      )}

                      {/* Target Destination Pin */}
                      {isTarget && (
                        <g transform={`translate(${p.px}, ${p.py - 12})`}>
                          <circle r="14" fill="#10b981" opacity="0.3" className="animate-ping" />
                          <circle r="8" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                          <Flag className="w-3.5 h-3.5 text-white" x="-7" y="-7" />
                        </g>
                      )}

                      {/* Standard QR Anchor Marker */}
                      {mapLayers.qr && !isStart && !isTarget && (
                        <circle
                          cx={p.px}
                          cy={p.py}
                          r="3"
                          fill="rgba(56, 189, 248, 0.7)"
                          stroke="#0284c7"
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  );
                })}
            </g>
          );
        })}

        {/* 3. RENDER ANIMATED 3D PATHFINDING TRAJECTORY LINE */}
        {routePolylines.length > 0 && (
          <g className="active-route-trajectory-3d" filter="url(#route-glow)">
            {routePolylines.map((seg) => (
              <line
                key={seg.id}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke={seg.isVertical ? (isAccessibleMode ? "#a855f7" : "#3b82f6") : "#06b6d4"}
                strokeWidth={seg.isVertical ? 4.5 : 4}
                strokeLinecap="round"
                strokeDasharray={seg.isVertical ? "6 3" : "12 4"}
                className={seg.isVertical ? "animate-pulse" : "animate-dash"}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
