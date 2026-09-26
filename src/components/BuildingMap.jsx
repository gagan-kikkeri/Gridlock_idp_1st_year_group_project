import React, { useState } from 'react';
import { 
  BUILDING_METADATA, 
  SPATIAL_NODES, 
  GRAPH_EDGES, 
  FLOOR_ROOMS 
} from '../data/campusData.js';
import { 
  Compass, 
  Layers, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  MapPin, 
  Flag, 
  QrCode,
  Flame,
  ArrowUpRight,
  Footprints,
  Eye
} from 'lucide-react';

export default function BuildingMap({
  activeFloor,
  onFloorChange,
  startNodeId,
  targetNodeId,
  onSelectNode,
  activeRoute,
  hazardMap = {},
  isSosActive = false,
  highlightedNodeId = null,
  nodes = SPATIAL_NODES,
  edges = GRAPH_EDGES
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showQrAnchors, setShowQrAnchors] = useState(true);

  // Filter nodes and rooms by current floor
  const currentFloorRooms = FLOOR_ROOMS[activeFloor] || [];
  const currentFloorNodes = Object.values(nodes).filter(n => n.floor === activeFloor);

  // Filter edges where either u or v is on current floor
  const currentFloorEdges = edges.filter(e => {
    const u = nodes[e.u];
    const v = nodes[e.v];
    if (e.isVertical) {
      return (u && u.floor === activeFloor) || (v && v.floor === activeFloor);
    }
    return u && v && u.floor === activeFloor && v.floor === activeFloor;
  });

  // Calculate route polyline points for current floor
  const routePoints = [];
  if (activeRoute && activeRoute.path && activeRoute.path.length > 1) {
    const routeNodeList = activeRoute.path.map(id => nodes[id]);
    for (let i = 0; i < routeNodeList.length; i++) {
      const node = routeNodeList[i];
      if (node && node.floor === activeFloor) {
        routePoints.push(`${node.x},${node.y}`);
      }
    }
  }

  // Handle Zoom
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.7));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const startNode = SPATIAL_NODES[startNodeId];
  const targetNode = SPATIAL_NODES[targetNodeId];

  return (
    <div className="relative flex flex-col h-full w-full rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/70 px-4 py-3 backdrop-blur-md">
        {/* Floor Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            Floor Level:
          </span>
          <div className="flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700/60">
            {BUILDING_METADATA.floors.map(floor => (
              <button
                key={floor.id}
                onClick={() => onFloorChange(floor.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
                  activeFloor === floor.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{floor.code}</span>
                <span className="hidden sm:inline text-[11px] opacity-80">({floor.name})</span>
              </button>
            ))}
          </div>
        </div>

        {/* View toggles & status */}
        <div className="flex items-center gap-2">
          {/* QR Anchor overlay toggle */}
          <button
            onClick={() => setShowQrAnchors(!showQrAnchors)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border transition ${
              showQrAnchors 
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' 
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title="Toggle wall-mounted QR code anchor markers"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">QR Anchors</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center rounded-lg bg-slate-800/80 border border-slate-700/60 p-0.5">
            <button
              onClick={handleZoomIn}
              className="px-2 py-1 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
              title="Zoom In"
            >
              +
            </button>
            <span className="text-[10px] font-mono px-1.5 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={handleZoomOut}
              className="px-2 py-1 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={handleReset}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition ml-0.5"
              title="Reset View"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Blueprint Viewport */}
      <div className="relative flex-1 w-full h-[420px] sm:h-[500px] lg:h-[580px] bg-[#070b13] overflow-hidden select-none cursor-grab active:cursor-grabbing">
        {/* Dynamic Watermark / Floor Elevation */}
        <div className="absolute top-4 left-4 pointer-events-none z-10">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            <div>
              <div className="text-xs font-bold text-white tracking-wide">
                {BUILDING_METADATA.floors[activeFloor]?.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Altitude: {BUILDING_METADATA.floors[activeFloor]?.elevation} • Cartesian Plane
              </div>
            </div>
          </div>
        </div>

        {/* Hovered node floating badge */}
        {hoveredNode && (
          <div className="absolute bottom-4 left-4 pointer-events-none z-10 max-w-sm">
            <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/40 px-3 py-2 rounded-xl shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-blue-400">{hoveredNode.label}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {hoveredNode.qr}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">{hoveredNode.description}</p>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Coord: ({hoveredNode.x}, {hoveredNode.y}) • Floor: {hoveredNode.floor}
              </div>
            </div>
          </div>
        )}

        {/* SVG Architectural Canvas */}
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out'
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>

            {/* Caution Hazard Stripe Pattern for Blocked Corridors */}
            <pattern id="hazardStripe" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="10" height="20" fill="rgba(245, 158, 11, 0.3)" />
              <rect x="10" y="0" width="10" height="20" fill="rgba(15, 23, 42, 0.5)" />
            </pattern>

            {/* Glowing filter for navigation path */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="620" fill="url(#grid)" />

          {/* Outer Building Structural Perimeter */}
          <rect
            x="40"
            y="70"
            width="920"
            height="500"
            rx="16"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Architectural Rooms */}
          {currentFloorRooms.map(room => (
            <g key={room.id} className="transition-all duration-200">
              <rect
                x={room.x}
                y={room.y}
                width={room.w}
                height={room.h}
                rx="8"
                fill={room.color}
                stroke={room.border}
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
              <text
                x={room.x + 12}
                y={room.y + 24}
                fill="#f8fafc"
                fontSize="12"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
                opacity="0.95"
              >
                {room.label}
              </text>
            </g>
          ))}

          {/* Corridors / Graph Edges */}
          {currentFloorEdges.map(edge => {
            const u = SPATIAL_NODES[edge.u];
            const v = SPATIAL_NODES[edge.v];
            if (!u || !v) return null;

            const isBlocked = hazardMap[edge.id]?.isBlocked;
            const isVertical = edge.isVertical;

            // Coordinates on current floor
            const x1 = u.x;
            const y1 = u.y;
            const x2 = v.x;
            const y2 = v.y;

            return (
              <g key={edge.id}>
                {/* Edge line */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isBlocked ? '#f59e0b' : '#334155'}
                  strokeWidth={isBlocked ? '8' : '3'}
                  strokeDasharray={isVertical ? '4 4' : undefined}
                  opacity={isBlocked ? 0.9 : 0.6}
                />

                {/* If blocked with hazard, render animated caution badge */}
                {isBlocked && (
                  <g transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2})`}>
                    <rect
                      x="-75"
                      y="-14"
                      width="150"
                      height="28"
                      rx="6"
                      fill="#78350f"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#fef3c7"
                      fontSize="8.5"
                      fontWeight="800"
                      fontFamily="system-ui"
                    >
                      🧹 CLEANING IN PROGRESS (AVOID)
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Active Navigation Path Polyline */}
          {routePoints.length > 1 && (
            <g>
              {/* Outer glow stroke */}
              <polyline
                points={routePoints.join(' ')}
                fill="none"
                stroke={isSosActive ? '#ef4444' : '#3b82f6'}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
                filter="url(#glow)"
              />
              {/* Core animated dashing line */}
              <polyline
                points={routePoints.join(' ')}
                fill="none"
                stroke={isSosActive ? '#fca5a5' : '#60a5fa'}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 6"
                className="animate-dash"
              />
            </g>
          )}

          {/* Wall-Mounted QR Anchor Micro-Location Nodes */}
          {currentFloorNodes.map(node => {
            const isStart = startNodeId === node.id;
            const isTarget = targetNodeId === node.id;
            const isHighlighted = highlightedNodeId === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onClick={() => onSelectNode(node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Pulse halo if start or target */}
                {(isStart || isTarget || isHighlighted) && (
                  <circle
                    r="22"
                    fill={isStart ? 'rgba(59, 130, 246, 0.3)' : isTarget ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}
                    className="animate-ping"
                  />
                )}

                {/* Node Outer Ring */}
                <circle
                  r={isStart || isTarget ? '13' : '9'}
                  fill={
                    isStart 
                      ? '#2563eb' 
                      : isTarget 
                      ? '#16a34a' 
                      : node.type === 'emergency' 
                      ? '#dc2626' 
                      : node.type === 'stair' || node.type === 'lift'
                      ? '#7c3aed'
                      : '#1e293b'
                  }
                  stroke={
                    isStart 
                      ? '#93c5fd' 
                      : isTarget 
                      ? '#86efac' 
                      : node.type === 'emergency'
                      ? '#fca5a5'
                      : '#475569'
                  }
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Inner symbol or QR tag */}
                {isStart ? (
                  <circle r="4" fill="#ffffff" />
                ) : isTarget ? (
                  <circle r="4" fill="#ffffff" />
                ) : (
                  <circle r="3" fill="#94a3b8" />
                )}

                {/* QR Wall Anchor Label */}
                {showQrAnchors && (
                  <g transform="translate(0, -16)">
                    <rect
                      x="-22"
                      y="-9"
                      width="44"
                      height="16"
                      rx="3"
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      fill="#93c5fd"
                      fontSize="8"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      {node.qr}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Legend / Quick Status Footer */}
        <div className="absolute bottom-3 right-3 flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 shadow-xl pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
            <span>Origin (You)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span>Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
            <span>Stair / Lift</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
            <span>Fire Exit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span>Hazard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
