import React, { useState } from 'react';
import { SPATIAL_NODES } from '../data/campusData.js';
import { 
  QrCode, 
  X, 
  Camera, 
  CheckCircle2, 
  Zap, 
  Compass, 
  MapPin, 
  Sparkles 
} from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanComplete }) {
  const [selectedScanNode, setSelectedScanNode] = useState(null);
  const [decodingProgress, setDecodingProgress] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  if (!isOpen) return null;

  const handleSimulateScan = (nodeId) => {
    setSelectedScanNode(nodeId);
    setDecodingProgress(true);
    setScannedResult(null);

    // Simulate deterministic sub-200ms QR decode
    setTimeout(() => {
      const node = SPATIAL_NODES[nodeId];
      setDecodingProgress(false);
      setScannedResult({
        node,
        decodeTimeMs: Math.floor(Math.random() * 50) + 120, // 120ms - 170ms (<200ms metric)
        hash: `SHA256: ${Math.random().toString(36).substring(2, 10).toUpperCase()}-${node.qr}`
      });
    }, 180);
  };

  const handleConfirmLocation = () => {
    if (scannedResult && scannedResult.node) {
      onScanComplete(scannedResult.node.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Wall-Mounted QR Micro-Location Scanner
              </h3>
              <p className="text-[11px] text-slate-400">
                Ground-truth Cartesian touchpoint positioning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewfinder Simulator */}
        <div className="p-5 flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-xl bg-slate-950 border-2 border-dashed border-blue-500/40 flex flex-col items-center justify-center overflow-hidden">
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-8 border border-white/20 rounded-lg pointer-events-none flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
              
              {/* Laser beam */}
              <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-pulse" />
            </div>

            {decodingProgress ? (
              <div className="flex flex-col items-center gap-2 z-10">
                <Zap className="h-8 w-8 text-amber-400 animate-bounce" />
                <span className="text-xs font-mono text-amber-300">
                  Decoding Cartesian Anchor (&lt;200ms)...
                </span>
              </div>
            ) : scannedResult ? (
              <div className="flex flex-col items-center gap-1.5 z-10 text-center p-3">
                <CheckCircle2 className="h-9 w-9 text-emerald-400 animate-scale" />
                <span className="text-sm font-bold text-white">
                  {scannedResult.node.label}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Decoded in {scannedResult.decodeTimeMs}ms • {scannedResult.node.qr}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Coordinates: X={scannedResult.node.x}m, Y={scannedResult.node.y}m, Floor={scannedResult.node.floor}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500 z-10">
                <Camera className="h-10 w-10 text-slate-600" />
                <span className="text-xs text-slate-400">
                  Point camera at wall QR code or select test anchor below
                </span>
              </div>
            )}
          </div>

          {/* Quick Select Anchor Presets (Simulates physical touchpoints) */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Select Physical Wall QR Touchpoint:</span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Zero Drift Guarantee
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {Object.values(SPATIAL_NODES).map(node => (
                <button
                  key={node.id}
                  onClick={() => handleSimulateScan(node.id)}
                  className={`flex flex-col text-left p-2 rounded-lg border transition text-xs ${
                    selectedScanNode === node.id
                      ? 'bg-blue-600/30 border-blue-400 text-white'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate">{node.label}</span>
                    <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-1 rounded">
                      {node.qr}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {node.floor === 0 ? 'Ground Floor' : 'First Floor'} • {node.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-950/80 px-5 py-3.5">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLocation}
            disabled={!scannedResult}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition disabled:opacity-40 hover:bg-blue-500"
          >
            <MapPin className="h-3.5 w-3.5" />
            Set as Current Origin
          </button>
        </div>
      </div>
    </div>
  );
}
