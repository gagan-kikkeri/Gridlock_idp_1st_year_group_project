import React, { useState } from 'react';
import { INITIAL_GRIEVANCES, SPATIAL_NODES } from '../data/campusData.js';
import { 
  Wrench, 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Camera, 
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function GrievanceDesk({ currentScannedNodeId, userRole }) {
  const [tickets, setTickets] = useState(INITIAL_GRIEVANCES);
  const [showNewModal, setShowNewModal] = useState(false);
  
  // New ticket state
  const currentNode = SPATIAL_NODES[currentScannedNodeId] || SPATIAL_NODES["N_LH_101"];
  const [category, setCategory] = useState('Audio/Visual');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');

  const categories = [
    'Audio/Visual (Projector/Mic)',
    'Networking (LAN/Wi-Fi)',
    'Electrical & Power',
    'HVAC / Air Conditioning',
    'Furniture & Desks',
    'Janitorial & Plumbing'
  ];

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!title) return;

    const newTicket = {
      id: `GRV-${Math.floor(1050 + Math.random() * 50)}`,
      nodeId: currentNode.id,
      room: currentNode.label,
      floor: currentNode.floor,
      title,
      category,
      status: 'Submitted',
      priority,
      reportedBy: 'Gagan N Prasad',
      timestamp: 'Just now',
      description
    };

    setTickets([newTicket, ...tickets]);
    setShowNewModal(false);
    setTitle('');
    setDescription('');
  };

  // Progress pipeline helper
  const pipelineStages = [
    'Submitted',
    'Under Review',
    'Technician Dispatched',
    'Resolved'
  ];

  const getStageIndex = (status) => pipelineStages.indexOf(status);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Geo-Tagged Grievance Helpdesk
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                4-Stage Lifecycle
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Campus equipment faults auto-inherit Cartesian room coordinates, reducing dispatch latency by 70%
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Report Classroom / Lab Fault
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map(ticket => {
          const currentStage = getStageIndex(ticket.status);

          return (
            <div
              key={ticket.id}
              className="flex flex-col gap-3 rounded-xl bg-slate-950/60 p-4 border border-slate-800/80 shadow-md"
            >
              {/* Top Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/20">
                    {ticket.id}
                  </span>
                  <h4 className="text-xs font-bold text-white">{ticket.title}</h4>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    ticket.priority === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {ticket.priority} Priority
                  </span>
                  <span className="text-slate-400 font-mono">{ticket.timestamp}</span>
                </div>
              </div>

              {/* Geo-tag coordinates & room details */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-1 text-emerald-400">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Geo-Node: <strong>{ticket.room}</strong></span>
                </div>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">
                  Floor: <strong>{ticket.floor === 0 ? 'Ground Floor' : '1st Floor'}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Category: {ticket.category}</span>
              </div>

              <p className="text-xs text-slate-400">
                {ticket.description}
              </p>

              {/* 4-Stage Resolution Pipeline Visualizer (Slide 15) */}
              <div className="mt-1 pt-3 border-t border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Resolution Pipeline Progress:
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {pipelineStages.map((stage, idx) => {
                    const isDone = idx <= currentStage;
                    const isCurrent = idx === currentStage;

                    return (
                      <div
                        key={stage}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition ${
                          isDone
                            ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                            : 'bg-slate-900/60 border border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className={`text-[10px] font-bold ${isCurrent ? 'text-white' : ''}`}>
                          {idx + 1}. {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Grievance Modal with Scanned Coordinate Inheritance */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Submit Location-Tagged Maintenance Ticket
                </h4>
                <p className="text-xs text-slate-400">
                  Auto-bound to physical scanned micro-location coordinates
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Inherited Coordinate Banner */}
            <div className="rounded-xl bg-blue-950/40 border border-blue-500/30 p-3 mb-4 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-400 shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-white">
                  Origin Micro-Location: {currentNode.label} ({currentNode.qr})
                </div>
                <div className="text-slate-300 text-[11px] font-mono mt-0.5">
                  Inherited Coordinates: X={currentNode.x}m, Y={currentNode.y}m, Floor={currentNode.floor}
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Equipment / Issue Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Fault Title / Brief Summary:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ceiling Projector Lamp Failure in Lab"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Detailed Diagnostic Description:
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the malfunction, error lights, or hazard conditions..."
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500 shadow-md"
                >
                  <Send className="h-3.5 w-3.5" /> Dispatch Grievance Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
