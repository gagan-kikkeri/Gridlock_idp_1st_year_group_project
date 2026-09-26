import React, { useState } from 'react';
import { 
  auditBuildingTopology, 
  synthesizeAiRoute 
} from '../services/aiSpatialEngine.js';
import { 
  Cpu, 
  QrCode, 
  Map as MapIcon, 
  Printer, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Layers, 
  Navigation, 
  ShieldCheck, 
  FileText, 
  Compass, 
  CornerDownRight, 
  Sliders,
  Send,
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function AdminStudio({ 
  nodes = {}, 
  edges = [], 
  hazardMap = {}, 
  onAddNewNode, 
  onAddNewEdge, 
  onApplyAiRoute 
}) {
  const [activeSubTab, setActiveSubTab] = useState('ai_engine'); // 'ai_engine', 'qr_studio', 'map_improviser'

  // --- AI ENGINE STATE ---
  const [aiPrompt, setAiPrompt] = useState('Create accessible wheelchair route from Main Entrance to HOD Suite avoiding all stairs (Elevator Only)');
  const [aiOutput, setAiOutput] = useState(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [topologyAudit, setTopologyAudit] = useState(() => auditBuildingTopology(nodes, edges, hazardMap));

  // --- QR GENERATOR STATE ---
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeFloor, setNewNodeFloor] = useState(1);
  const [newNodeType, setNewNodeType] = useState('lab');
  const [newNodeX, setNewNodeX] = useState(300);
  const [newNodeY, setNewNodeY] = useState(300);
  const [selectedPrintNodeId, setSelectedPrintNodeId] = useState('N_HOD');
  const [generatedSuccess, setGeneratedSuccess] = useState(null);

  // --- MAP IMPROVISER STATE ---
  const [edgeNodeA, setEdgeNodeA] = useState(Object.keys(nodes)[0] || 'N_ENTRANCE');
  const [edgeNodeB, setEdgeNodeB] = useState(Object.keys(nodes)[1] || 'N_LOBBY');
  const [edgeDistance, setEdgeDistance] = useState(20);
  const [edgeCorridorName, setEdgeCorridorName] = useState('New Connector Passage');
  const [edgeAddedToast, setEdgeAddedToast] = useState(false);
  const [uploadedMapName, setUploadedMapName] = useState(null);

  // Execute AI Route Synthesis
  const handleRunAiRoute = (presetPrompt) => {
    const promptToRun = presetPrompt || aiPrompt;
    setIsAiProcessing(true);
    setAiOutput(null);

    setTimeout(() => {
      const result = synthesizeAiRoute({
        prompt: promptToRun,
        startNodeId: 'N_ENTRANCE',
        targetNodeId: 'N_HOD',
        nodes,
        edges,
        hazardMap
      });
      setAiOutput(result);
      setIsAiProcessing(false);
    }, 400);
  };

  // Re-run Topology Health Audit
  const handleRefreshAudit = () => {
    setTopologyAudit(auditBuildingTopology(nodes, edges, hazardMap));
  };

  // Generate & Register new QR anchor
  const handleGenerateNewQR = (e) => {
    e.preventDefault();
    if (!newNodeLabel) return;

    const newId = `N_CUSTOM_${Math.floor(100 + Math.random() * 900)}`;
    const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const qrTag = `QR-${newNodeFloor}-${randomHash}`;

    const nodePayload = {
      id: newId,
      floor: parseInt(newNodeFloor),
      x: parseInt(newNodeX),
      y: parseInt(newNodeY),
      label: newNodeLabel,
      qr: qrTag,
      type: newNodeType,
      description: `Admin-generated micro-location Cartesian anchor for ${newNodeLabel}.`,
      details: `Registered on ${new Date().toLocaleDateString()} by Admin.`
    };

    onAddNewNode(nodePayload);
    setSelectedPrintNodeId(newId);
    setGeneratedSuccess(nodePayload);
    setNewNodeLabel('');
    setTimeout(() => setGeneratedSuccess(null), 4000);
  };

  // Add Edge Connector
  const handleAddEdge = (e) => {
    e.preventDefault();
    if (edgeNodeA === edgeNodeB) return;

    const newEdge = {
      id: `e-custom-${Math.floor(100 + Math.random() * 900)}`,
      u: edgeNodeA,
      v: edgeNodeB,
      distance: parseInt(edgeDistance) || 20,
      corridor: edgeCorridorName,
      canHaveHazard: true
    };

    onAddNewEdge(newEdge);
    setEdgeAddedToast(true);
    setTimeout(() => setEdgeAddedToast(false), 3000);
  };

  // Handle mock blueprint map upload
  const handleMapUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedMapName(file.name);
      alert(`Map blueprint "${file.name}" uploaded successfully! Graph coordinate space calibrated.`);
    }
  };

  const selectedPrintNode = nodes[selectedPrintNodeId] || nodes['N_HOD'];

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-700 bg-slate-900/95 p-5 sm:p-6 shadow-2xl">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white sm:text-lg">
                ADMIN SPATIAL STUDIO & AI CONTROL HUB
              </h2>
              <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                SUPERADMIN ROLE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate & print physical QR anchors • Improvise map topology • AI autonomous route synthesis
            </p>
          </div>
        </div>

        {/* Studio Sub-Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveSubTab('ai_engine')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'ai_engine'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>AI Spatial Engine</span>
          </button>

          <button
            onClick={() => setActiveSubTab('qr_studio')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'qr_studio'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>QR Generator & Print Studio</span>
          </button>

          <button
            onClick={() => setActiveSubTab('map_improviser')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'map_improviser'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="h-4 w-4" />
            <span>Blueprint & Map Improviser</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: AI SPATIAL BACKEND ENGINE & AUTONOMOUS ROUTE CREATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'ai_engine' && (
        <div className="flex flex-col gap-5">
          {/* AI Query Prompt Console */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/40 p-5 border border-purple-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Natural Language Autonomous Route Synthesizer
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Spatial LLM Parser: Active
              </span>
            </div>

            {/* Prompt input */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask AI to synthesize complex route, avoid obstacles, or inspect topology..."
                className="flex-1 rounded-xl bg-slate-950/90 border border-slate-700/80 px-4 py-2.5 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={() => handleRunAiRoute()}
                disabled={isAiProcessing}
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition active:scale-95 disabled:opacity-50"
              >
                <Zap className="h-4 w-4 text-amber-300" />
                {isAiProcessing ? 'Synthesizing...' : 'Run AI Analysis & Route'}
              </button>
            </div>

            {/* Prompt presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] font-mono text-slate-400">Quick AI Constraints:</span>
              {[
                { label: "Wheelchair / Elevator Only (No Stairs)", prompt: "Create accessible route avoiding all staircases (Elevator Only)" },
                { label: "8-Stop Security Patrol Route", prompt: "Generate multi-point security patrol covering labs and fire exits" },
                { label: "Evacuation to Safest Exit", prompt: "Compute emergency egress avoiding current corridor hazards" }
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAiPrompt(p.prompt);
                    handleRunAiRoute(p.prompt);
                  }}
                  className="rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Execution Output & Reasoning */}
          {aiOutput && aiOutput.route && (
            <div className="rounded-2xl bg-slate-950 p-5 border border-purple-500/40 shadow-xl space-y-4 animate-scale">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      AI Autonomous Route Synthesized Successfully
                    </h4>
                    <span className="text-[11px] text-purple-300 font-mono">
                      Constraint: {aiOutput.constraint.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onApplyAiRoute(aiOutput.route)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/25 transition active:scale-95"
                >
                  <Navigation className="h-4 w-4" />
                  Plot AI Route on Live Map
                </button>
              </div>

              {/* Reasoning Trace */}
              <div className="space-y-1.5 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400 flex items-center gap-1">
                  <Activity className="h-3 w-3 text-purple-400" /> AI Spatial Graph Reasoning Steps:
                </div>
                <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc">
                  {aiOutput.aiReasoning.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>

              {/* Route Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Total Distance</span>
                  <div className="text-lg font-bold text-white mt-0.5">{aiOutput.route.totalDistance}m</div>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Est. Walk Time</span>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    {Math.floor(aiOutput.route.estimatedSeconds / 60)}m {aiOutput.route.estimatedSeconds % 60}s
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Waypoints Visited</span>
                  <div className="text-lg font-bold text-blue-400 mt-0.5">{aiOutput.route.path.length} Nodes</div>
                </div>
              </div>
            </div>
          )}

          {/* Topology Health Audit Section */}
          <div className="rounded-2xl bg-slate-950/70 p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Campus Spatial Topology Health Audit
                </h4>
              </div>
              <button
                onClick={handleRefreshAudit}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                ↻ Re-run Audit
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Graph Connectivity</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">
                  {topologyAudit.orphanNodes.length === 0 ? '100% Connected' : `${topologyAudit.orphanNodes.length} Isolated`}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Accessibility Index</span>
                <span className="text-base font-bold text-blue-400 mt-1 block">
                  {topologyAudit.accessibilityScore}% (Elevator Verified)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Fire Egress Reachability</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">
                  {topologyAudit.egressComplianceScore}% Safe
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Active Hazards Blocked</span>
                <span className="text-base font-bold text-amber-400 mt-1 block">
                  {topologyAudit.activeHazardsCount} Corridors
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-slate-200">AI Recommendations:</span>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-slate-400">
                {topologyAudit.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: QR GENERATOR & PRINT STUDIO */}
      {/* ========================================================================= */}
      {activeSubTab === 'qr_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: QR Generator Form */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-950/70 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Plus className="h-4 w-4 text-purple-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Generate Any New Cartesian QR Anchor
              </h4>
            </div>

            {generatedSuccess && (
              <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-300">
                ✓ Generated <strong>{generatedSuccess.label}</strong> with tag <strong>{generatedSuccess.qr}</strong>! Added to spatial graph.
              </div>
            )}

            <form onSubmit={handleGenerateNewQR} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Location / Room Label:
                </label>
                <input
                  type="text"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="e.g. Cloud Sandbox Lab F-15"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700/80 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Floor Level:</label>
                  <select
                    value={newNodeFloor}
                    onChange={(e) => setNewNodeFloor(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/80 p-2 text-white"
                  >
                    <option value={0}>Ground Floor (GF)</option>
                    <option value={1}>First Floor (1F)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category Type:</label>
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/80 p-2 text-white"
                  >
                    <option value="lab">Research Lab</option>
                    <option value="classroom">Classroom</option>
                    <option value="office">Faculty Office</option>
                    <option value="corridor">Corridor Junction</option>
                    <option value="amenity">Amenity / Lounge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cartesian X (m):</label>
                  <input
                    type="number"
                    value={newNodeX}
                    onChange={(e) => setNewNodeX(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/80 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cartesian Y (m):</label>
                  <input
                    type="number"
                    value={newNodeY}
                    onChange={(e) => setNewNodeY(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/80 p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 font-bold text-white shadow-md shadow-purple-600/30 transition active:scale-95"
                >
                  <QrCode className="h-4 w-4" />
                  Generate & Register QR Anchor
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-800">
              <label className="text-slate-400 font-semibold block mb-1.5 text-[11px]">
                Or Select Existing Anchor to Print:
              </label>
              <select
                value={selectedPrintNodeId}
                onChange={(e) => setSelectedPrintNodeId(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white"
              >
                {Object.values(nodes).map(n => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.qr}) - Floor {n.floor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column: High-Resolution Printable Placard Sheet */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="h-4 w-4 text-purple-400" />
                Official Physical Wall-Mount Placard Template
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md transition active:scale-95"
              >
                <Printer className="h-4 w-4" />
                Print Wall Placard
              </button>
            </div>

            {/* Printable Placard Card */}
            <div 
              id="printable-qr-placard"
              className="rounded-2xl bg-white p-6 text-slate-900 border-4 border-slate-900 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
              style={{ minHeight: '380px' }}
            >
              {/* Institutional Header */}
              <div className="w-full border-b-2 border-slate-900 pb-3 mb-4">
                <div className="text-[11px] font-black tracking-widest text-slate-600 uppercase">
                  BMS INSTITUTE OF TECHNOLOGY & MANAGEMENT
                </div>
                <div className="text-sm font-extrabold text-blue-900 mt-0.5">
                  GRIDLOCK MICRO-LOCATION INDOOR POSITIONING ANCHOR
                </div>
                <div className="text-[9px] font-mono text-slate-500">
                  APEX ACADEMIC COMPLEX • DEPARTMENT OF COMPUTER SCIENCE
                </div>
              </div>

              {/* Large SVG QR Code Mockup */}
              <div className="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-md">
                <svg width="150" height="150" viewBox="0 0 100 100" className="mx-auto">
                  {/* Outer Position Squares */}
                  <rect x="5" y="5" width="26" height="26" fill="black" />
                  <rect x="8" y="8" width="20" height="20" fill="white" />
                  <rect x="12" y="12" width="12" height="12" fill="black" />

                  <rect x="69" y="5" width="26" height="26" fill="black" />
                  <rect x="72" y="8" width="20" height="20" fill="white" />
                  <rect x="76" y="12" width="12" height="12" fill="black" />

                  <rect x="5" y="69" width="26" height="26" fill="black" />
                  <rect x="8" y="72" width="20" height="20" fill="white" />
                  <rect x="12" y="76" width="12" height="12" fill="black" />

                  {/* High density simulated QR bits */}
                  <rect x="36" y="10" width="6" height="6" fill="black" />
                  <rect x="46" y="10" width="6" height="6" fill="black" />
                  <rect x="56" y="14" width="6" height="6" fill="black" />
                  <rect x="36" y="24" width="6" height="6" fill="black" />
                  <rect x="46" y="28" width="6" height="6" fill="black" />
                  <rect x="10" y="40" width="6" height="6" fill="black" />
                  <rect x="22" y="44" width="6" height="6" fill="black" />
                  <rect x="36" y="40" width="28" height="20" fill="black" rx="3" />
                  <rect x="40" y="44" width="20" height="12" fill="white" rx="2" />
                  <text x="50" y="53" textAnchor="middle" fill="black" fontSize="7" fontWeight="bold">GL</text>
                  <rect x="69" y="40" width="6" height="6" fill="black" />
                  <rect x="82" y="44" width="6" height="6" fill="black" />
                  <rect x="38" y="70" width="6" height="6" fill="black" />
                  <rect x="48" y="76" width="6" height="6" fill="black" />
                  <rect x="60" y="82" width="6" height="6" fill="black" />
                  <rect x="74" y="70" width="16" height="16" fill="black" />
                </svg>
              </div>

              {/* QR Tag Identifier */}
              <div className="mt-3 font-mono text-base font-black tracking-widest text-slate-900 bg-slate-100 px-3 py-0.5 rounded border border-slate-300">
                {selectedPrintNode.qr}
              </div>

              {/* Location details */}
              <div className="mt-2 text-center">
                <div className="text-sm font-bold text-slate-900">{selectedPrintNode.label}</div>
                <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                  Cartesian Coordinates: X={selectedPrintNode.x}m, Y={selectedPrintNode.y}m • Floor {selectedPrintNode.floor}
                </div>
              </div>

              {/* Scanning Instructions footer */}
              <div className="w-full mt-4 pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                Point Gridlock PWA camera at this marker to establish ground-truth coordinates (&lt;200ms decode, 0 GPS reliance).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: BLUEPRINT UPLOADER & MAP IMPROVISER */}
      {/* ========================================================================= */}
      {activeSubTab === 'map_improviser' && (
        <div className="flex flex-col gap-5">
          {/* Blueprint Uploader Bar */}
          <div className="rounded-2xl bg-slate-950/70 p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="h-4 w-4 text-purple-400" />
                Upload New Building CAD Blueprint / Vector Map
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Accepts SVG, architectural CAD exports, PNG/JPG floor plans, or JSON spatial datasets
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                id="blueprintFile"
                accept=".svg,.png,.jpg,.jpeg,.json"
                onChange={handleMapUpload}
                className="hidden"
              />
              <label
                htmlFor="blueprintFile"
                className="cursor-pointer flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md transition active:scale-95"
              >
                <Upload className="h-3.5 w-3.5" />
                Select Blueprint File
              </label>
              {uploadedMapName && (
                <span className="text-xs text-emerald-400 font-mono">
                  ✓ {uploadedMapName}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Corridor Edge Connector Form */}
          <div className="rounded-2xl bg-slate-950/70 p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-400" />
                Improvise Graph Topology • Link New Walkway Corridor
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                Total Live Edges: {edges.length}
              </span>
            </div>

            {edgeAddedToast && (
              <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-300">
                ✓ Corridor connection successfully established and incorporated into A* solver!
              </div>
            )}

            <form onSubmit={handleAddEdge} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">From Node A:</label>
                <select
                  value={edgeNodeA}
                  onChange={(e) => setEdgeNodeA(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                >
                  {Object.values(nodes).map(n => (
                    <option key={n.id} value={n.id}>{n.label} (F{n.floor})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">To Node B:</label>
                <select
                  value={edgeNodeB}
                  onChange={(e) => setEdgeNodeB(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                >
                  {Object.values(nodes).map(n => (
                    <option key={n.id} value={n.id}>{n.label} (F{n.floor})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Walk Distance (m):</label>
                <input
                  type="number"
                  value={edgeDistance}
                  onChange={(e) => setEdgeDistance(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 font-bold text-white shadow-md transition active:scale-95"
                >
                  <Plus className="h-4 w-4" /> Add Corridor Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
