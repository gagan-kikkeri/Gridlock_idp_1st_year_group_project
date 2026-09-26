import React, { useState } from 'react';
import { GRAPH_EDGES } from '../data/campusData.js';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Upload, 
  Camera, 
  Clock, 
  RotateCcw, 
  Zap, 
  MapPin, 
  Eye, 
  FileText,
  Check,
  X,
  Droplets,
  Layers
} from 'lucide-react';

export default function JanitorialControls({ 
  hazardMap = {}, 
  onToggleHazard, 
  onClearAllHazards,
  cleaningReports = [],
  onUploadCleaning,
  onCompleteCleaning
}) {
  // Form states for uploading a new cleaning report
  const hazardEligibleEdges = GRAPH_EDGES.filter(e => e.canHaveHazard);

  const [selectedEdgeId, setSelectedEdgeId] = useState(hazardEligibleEdges[0]?.id || 'e-gf-06');
  const [cleaningType, setCleaningType] = useState('Deep Mopping & Wet Floor');
  const [durationMinutes, setDurationMinutes] = useState('25');
  const [notes, setNotes] = useState('Detergent mopping in progress. High slipping risk. Barricade cones placed.');
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState('caution_cones');
  const [uploadedFilePreview, setUploadedFilePreview] = useState(null);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  // Photo evidence presets
  const photoPresets = [
    { id: 'caution_cones', label: 'Wet Floor Warning Cones Placed', icon: '⚠️', preview: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&auto=format&fit=crop&q=80' },
    { id: 'mopping_bucket', label: 'Detergent Mopping & Buckets Active', icon: '🪣', preview: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80' },
    { id: 'caution_tape', label: 'Yellow Barrier Tape Mounted', icon: '🚧', preview: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80' },
    { id: 'spill_clean', label: 'Liquid Spill Absorption in Progress', icon: '🧪', preview: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=80' }
  ];

  // Handle mock file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFilePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const edge = GRAPH_EDGES.find(e => e.id === selectedEdgeId);
    if (!edge) return;

    const chosenPhoto = uploadedFilePreview || photoPresets.find(p => p.id === selectedPhotoPreset)?.preview;

    const newReport = {
      id: `CLN-${Math.floor(100 + Math.random() * 900)}`,
      edgeId: selectedEdgeId,
      locationName: edge.corridor,
      floor: edge.id.includes('1f') ? 1 : 0,
      cleaningType,
      durationMinutes,
      notes,
      photoUrl: chosenPhoto,
      photoLabel: photoPresets.find(p => p.id === selectedPhotoPreset)?.label || 'Custodial Photo Upload',
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      janitorName: 'Ramesh M',
      status: 'In Progress'
    };

    onUploadCleaning(newReport);
    setUploadSuccessToast(true);
    setTimeout(() => setUploadSuccessToast(false), 3000);
  };

  const activeReports = cleaningReports.filter(r => r.status === 'In Progress');
  const completedReports = cleaningReports.filter(r => r.status === 'Completed');

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-amber-500/30 bg-slate-900/95 p-5 sm:p-6 shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10">
            🧹
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Ramesh M • Janitorial Sanitation & Safety Portal
              </h3>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                ACTIVE ON DUTY
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Upload active cleaning zones • App pathfinding algorithm automatically avoids blocked corridors
            </p>
          </div>
        </div>

        {activeReports.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-xs text-amber-300">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold">{activeReports.length} Corridor Route{activeReports.length > 1 ? 's' : ''} Blocked for Cleaning</span>
          </div>
        )}
      </div>

      {uploadSuccessToast && (
        <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3.5 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Cleaning report uploaded successfully! Route weight inflated ($W_{'{active}'} = W_{'{base}'} + \infty$). Indoor navigation now automatically diverts students around this area.</span>
        </div>
      )}

      {/* SECTION 1: UPLOAD CLEANING ACTIVITY FORM */}
      <div className="rounded-2xl bg-slate-950/70 border border-amber-500/30 p-5 shadow-inner space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Upload className="h-4 w-4 text-amber-400" />
            Upload New Cleaning Session & Block Route
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Auto Detour Protocol
          </span>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Location selection */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                Select Corridor / Place Being Cleaned:
              </label>
              <select
                value={selectedEdgeId}
                onChange={(e) => setSelectedEdgeId(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 p-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {hazardEligibleEdges.map(edge => {
                  const isAlreadyBlocked = !!hazardMap[edge.id]?.isBlocked;
                  return (
                    <option key={edge.id} value={edge.id} className="bg-slate-900 text-white py-1">
                      {edge.corridor} ({edge.id.includes('1f') ? '1st Floor' : 'Ground Floor'}) {isAlreadyBlocked ? '— [ALREADY BLOCKED]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Cleaning Type */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-blue-400" />
                Cleaning / Hazard Activity Type:
              </label>
              <select
                value={cleaningType}
                onChange={(e) => setCleaningType(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 p-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Deep Mopping & Wet Floor">🧼 Deep Mopping & Wet Floor (Slipping Risk)</option>
                <option value="Chemical Sanitization & Floor Buffing">🧪 Chemical Sanitization & Floor Buffing</option>
                <option value="Liquid Spill / Physical Obstruction">⚠️ Liquid Spill / Pathway Obstruction</option>
                <option value="Restroom Deep Hygiene Cleaning">🚿 Restroom & Hygiene Wing Deep Clean</option>
              </select>
            </div>
          </div>

          {/* 3. Duration & Photo Upload Proof */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                Estimated Cleaning Duration:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['15', '25', '45', '60'].map(mins => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-2 rounded-xl text-center font-bold text-xs border transition ${
                      durationMinutes === mins
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>

              <div className="mt-3">
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Custodial Notes & Safety Instructions:
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Detergent applied on tiles. Extreme slipping risk..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-700/80 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>
            </div>

            {/* Photo Proof Selection */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-blue-400" />
                Attach Photo Evidence / Warning Proof:
              </label>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                {photoPresets.map(preset => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => {
                      setSelectedPhotoPreset(preset.id);
                      setUploadedFilePreview(null);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                      selectedPhotoPreset === preset.id && !uploadedFilePreview
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <span className="text-[11px] font-medium leading-tight truncate">{preset.label}</span>
                  </button>
                ))}
              </div>

              {/* Custom File Upload Option */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <input
                  type="file"
                  id="customPhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="customPhoto"
                  className="cursor-pointer flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition"
                >
                  <Upload className="h-3.5 w-3.5 text-amber-400" />
                  Upload from Device
                </label>
                <span className="text-[11px] text-slate-400 truncate">
                  {uploadedFilePreview ? '✓ Custom Photo Selected' : 'Or use preset evidence above'}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/25 transition active:scale-95"
            >
              <ShieldAlert className="h-4 w-4" />
              Upload Cleaning Status & Block Route in App
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: ACTIVE CLEANING IN PROGRESS (ROUTES CURRENTLY BLOCKED) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Active Cleaning Zones (App Routes Blocked)
            </h4>
            <span className="rounded-full bg-amber-500/20 text-amber-300 px-2 py-0.5 text-[10px] font-mono font-bold">
              {activeReports.length} Active
            </span>
          </div>

          {activeReports.length > 0 && (
            <button
              onClick={onClearAllHazards}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <RotateCcw className="h-3 w-3" /> Clear All
            </button>
          )}
        </div>

        {activeReports.length === 0 ? (
          <div className="rounded-xl bg-slate-950/40 p-6 text-center text-xs text-slate-400 border border-slate-800">
            ✓ All corridors are clean and unobstructed. No active detours in place.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReports.map(report => (
              <div
                key={report.id}
                className="flex flex-col justify-between rounded-xl bg-slate-950 border border-amber-500/50 p-4 shadow-xl space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                          {report.id}
                        </span>
                        <h5 className="text-sm font-bold text-white">{report.locationName}</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Floor: {report.floor === 0 ? 'Ground Floor' : '1st Floor'} • Started: {report.startedAt} (~{report.durationMinutes} mins)
                      </p>
                    </div>

                    <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse shrink-0">
                      🚫 ROUTE BLOCKED
                    </span>
                  </div>

                  <div className="mt-3 flex gap-3 items-center bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    {report.photoUrl && (
                      <img
                        src={report.photoUrl}
                        alt="Cleaning proof"
                        className="h-16 w-20 object-cover rounded-lg border border-slate-700 shrink-0"
                      />
                    )}
                    <div className="text-xs text-slate-300 space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-1">
                        <span>{report.cleaningType}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 italic">
                        "{report.notes}"
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-1">
                        A* Weight Override: W = ∞ (Detour Active)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complete & Reopen Button */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onCompleteCleaning(report.id, report.edgeId)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 text-xs font-bold shadow-md shadow-emerald-600/30 transition active:scale-95"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Cleaned & Reopen Route in App
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: COMPLETED CLEANING AUDIT HISTORY */}
      {completedReports.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed Sanitation History Today ({completedReports.length})
          </div>
          <div className="space-y-2">
            {completedReports.map(report => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300"
              >
                <div>
                  <span className="font-bold text-white">{report.locationName}</span>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {report.cleaningType} • Reopened at {report.completedAt || 'Recently'} by {report.janitorName}
                  </div>
                </div>
                <span className="rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                  ✓ Reopened & Safe
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
