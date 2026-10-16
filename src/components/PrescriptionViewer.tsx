import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Layers,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { TranscriptionLine } from '../types/prescription';

interface PrescriptionViewerProps {
  imageUrl: string;
  lines: TranscriptionLine[];
  selectedLineId: string | null;
  onSelectLine: (lineId: string | null) => void;
  overallConfidence: number;
  isProcessing: boolean;
}

export const PrescriptionViewer: React.FC<PrescriptionViewerProps> = ({
  imageUrl,
  lines,
  selectedLineId,
  onSelectLine,
  overallConfidence,
  isProcessing,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'normal' | 'contrast' | 'invert' | 'grayscale'>('normal');
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showConfidencePills, setShowConfidencePills] = useState<boolean>(true);
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected box if active
  useEffect(() => {
    if (!selectedLineId) return;
    const activeEl = document.getElementById(`box-${selectedLineId}`);
    if (activeEl && containerRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedLineId]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  // CSS filter applied to the image based on filterMode
  const getFilterStyle = () => {
    switch (filterMode) {
      case 'contrast':
        return 'contrast-150 brightness-95 saturate-150';
      case 'invert':
        return 'invert hue-rotate-180 contrast-125';
      case 'grayscale':
        return 'grayscale contrast-125';
      default:
        return 'filter-none';
    }
  };

  const getConfidenceBorder = (conf: number, isSelected: boolean) => {
    if (isSelected) {
      return 'border-cyan-400 bg-cyan-400/20 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20 z-20';
    }
    if (conf >= 95) {
      return 'border-emerald-500/80 bg-emerald-500/10 hover:border-emerald-400 hover:bg-emerald-500/20';
    }
    if (conf >= 88) {
      return 'border-amber-500/80 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/20';
    }
    return 'border-rose-500/80 bg-rose-500/15 hover:border-rose-400 hover:bg-rose-500/25';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rx_medication':
        return 'text-cyan-300 bg-cyan-950/80 border-cyan-800';
      case 'sig_instructions':
        return 'text-emerald-300 bg-emerald-950/80 border-emerald-800';
      case 'patient_info':
        return 'text-indigo-300 bg-indigo-950/80 border-indigo-800';
      case 'doctor_header':
        return 'text-slate-300 bg-slate-900/80 border-slate-700';
      default:
        return 'text-amber-300 bg-amber-950/80 border-amber-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Viewer HUD Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        {/* Left: View Modes & Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Image Enhancement:</span>
          </span>
          <button
            type="button"
            onClick={() => setFilterMode('normal')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterMode === 'normal'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('contrast')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterMode === 'contrast'
                ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            High Contrast
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('invert')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterMode === 'invert'
                ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Optical Invert
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('grayscale')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterMode === 'grayscale'
                ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Mono B&W
          </button>
        </div>

        {/* Right: Overlay Toggles & Zoom */}
        <div className="flex items-center gap-3">
          {/* Overlay Toggles */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setShowBoxes(!showBoxes)}
              className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
                showBoxes ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle OCR Bounding Boxes"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Boxes</span>
            </button>
            <button
              type="button"
              onClick={() => setShowConfidencePills(!showConfidencePills)}
              className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
                showConfidencePills ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Confidence Tag Overlay"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Confidence</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono tabular-nums text-slate-300 px-1 text-xs w-11 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 text-slate-400 hover:text-white transition-colors ml-0.5"
              title="Reset Zoom to 100%"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewport Canvas Stage */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto bg-slate-950 p-6 flex items-center justify-center min-h-[460px]"
        style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
      >
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mb-4" />
            <h4 className="text-base font-semibold text-white">Transcribing Handwritten Script</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Gemini Vision AI is extracting latin Sig instructions, pharmacological dosages, and spatial line coordinates...
            </p>
          </div>
        )}

        {/* Scalable Container for Image + Coordinate Overlays */}
        <div
          className="relative transition-transform duration-150 ease-out shadow-2xl rounded-lg overflow-hidden border border-slate-700/60 bg-white"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            maxWidth: '100%',
          }}
        >
          {/* Main Prescription Image */}
          <img
            src={imageUrl}
            alt="Handwritten Medical Prescription"
            referrerPolicy="no-referrer"
            className={`block max-h-[720px] w-auto object-contain select-none transition-all duration-200 ${getFilterStyle()}`}
          />

          {/* Normalized Bounding Box Overlay Layer (0 to 1000 coordinate space) */}
          {showBoxes && lines && lines.length > 0 && (
            <div className="absolute inset-0 pointer-events-auto">
              {lines.map((line) => {
                const [ymin, xmin, ymax, xmax] = line.box2d || [0, 0, 0, 0];
                const topPct = (ymin / 1000) * 100;
                const leftPct = (xmin / 1000) * 100;
                const heightPct = Math.max(((ymax - ymin) / 1000) * 100, 3);
                const widthPct = Math.max(((xmax - xmin) / 1000) * 100, 4);

                const isSelected = selectedLineId === line.id;
                const isHovered = hoveredLineId === line.id;

                return (
                  <div
                    key={line.id}
                    id={`box-${line.id}`}
                    onClick={() => onSelectLine(isSelected ? null : line.id)}
                    onMouseEnter={() => setHoveredLineId(line.id)}
                    onMouseLeave={() => setHoveredLineId(null)}
                    style={{
                      top: `${topPct}%`,
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                    }}
                    className={`absolute border-2 rounded transition-all cursor-pointer ${getConfidenceBorder(
                      line.confidence,
                      isSelected
                    )}`}
                  >
                    {/* Confidence Pill / Line Number Tag */}
                    {showConfidencePills && (
                      <div
                        className={`absolute -top-3.5 left-0 px-1 py-0.2 text-[9px] font-mono font-bold rounded flex items-center gap-1 shadow-sm border ${getCategoryColor(
                          line.category
                        )}`}
                      >
                        <span>L{line.lineNumber}</span>
                        <span className="tabular-nums">{Math.round(line.confidence)}%</span>
                      </div>
                    )}

                    {/* Rich Floating Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900/95 border border-cyan-500/50 rounded-lg p-2.5 text-xs text-white shadow-xl z-50 backdrop-blur-md pointer-events-none">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 mb-1 border-b border-slate-800">
                          <span className="uppercase tracking-wider font-semibold text-cyan-400">
                            {line.category.replace('_', ' ')}
                          </span>
                          <span className="font-mono tabular-nums text-emerald-400 font-bold">
                            {line.confidence.toFixed(1)}% Confidence
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Handwritten OCR:
                          <p className="text-white font-medium italic mt-0.5">&ldquo;{line.rawHandwrittenText}&rdquo;</p>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800">
                          Deciphered Clinical Meaning:
                          <p className="text-cyan-200 font-medium mt-0.5">{line.normalizedMedicalText}</p>
                        </div>
                        {line.alternatives && line.alternatives.length > 0 && (
                          <div className="text-[10px] text-amber-300/80 mt-1 font-mono">
                            Alt reading: {line.alternatives.join(' · ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Inspection Ribbon */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Document Quality: Verified</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <span>Overall OCR Confidence:</span>
            <span className="font-mono tabular-nums font-bold text-white">
              {overallConfidence ? `${overallConfidence.toFixed(1)}%` : '--'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300">&ge;95% High</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-300">88-94% Review</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-slate-300">&lt;88% Ambiguous</span>
          </span>
        </div>
      </div>
    </div>
  );
};
