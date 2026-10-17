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

  const [mobileTab, setMobileTab] = useState<'script' | 'lines'>('script');
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const [mobileCategoryFilter, setMobileCategoryFilter] = useState<string>('all');

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

  // Filtered lines for mobile inspection tab
  const filteredMobileLines = lines.filter((line) => {
    const matchesCategory = mobileCategoryFilter === 'all' || line.category === mobileCategoryFilter;
    const matchesSearch =
      mobileSearchTerm === '' ||
      line.rawHandwrittenText.toLowerCase().includes(mobileSearchTerm.toLowerCase()) ||
      line.normalizedMedicalText.toLowerCase().includes(mobileSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#FAF6EA] dark:bg-slate-950 rounded-xl border border-[#C9A24B]/35 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Mobile Viewport Segmented Mode Switcher (<640px / sm:hidden) */}
      <div className="sm:hidden flex items-center justify-between p-2.5 bg-[#F3EBD3]/90 dark:bg-slate-900 border-b border-[#C9A24B]/30 dark:border-slate-800">
        <span className="text-xs font-bold text-[#1B2A22] dark:text-slate-300">
          Scanner View:
        </span>
        <div
          role="tablist"
          aria-label="Prescription Scanner View Mode"
          className="inline-flex rounded-lg bg-white/90 dark:bg-slate-950 p-1 border border-[#C9A24B]/30 dark:border-slate-800 shadow-sm"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'script'}
            aria-label="View Prescription Script Image Canvas"
            onClick={() => setMobileTab('script')}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              mobileTab === 'script'
                ? 'bg-[#17483A] dark:bg-cyan-600 text-white shadow-sm'
                : 'text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Prescription Script</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'lines'}
            aria-label="View Transcription Lines List"
            onClick={() => setMobileTab('lines')}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              mobileTab === 'lines'
                ? 'bg-[#17483A] dark:bg-cyan-600 text-white shadow-sm'
                : 'text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Transcription Lines</span>
          </button>
        </div>
      </div>

      {/* Viewer HUD Toolbar (Script canvas view) */}
      <div
        className={`${
          mobileTab === 'lines' ? 'hidden sm:flex' : 'flex'
        } flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#F3EBD3]/60 dark:bg-slate-900 border-b border-[#C9A24B]/30 dark:border-slate-800 text-xs`}
      >
        {/* Left: View Modes & Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#3D5A4C] dark:text-slate-400 font-bold mr-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Image Enhancement:</span>
          </span>
          <button
            type="button"
            onClick={() => setFilterMode('normal')}
            aria-label="Enhancement filter: Original"
            className={`min-h-[44px] sm:min-h-0 px-2.5 py-1.5 sm:py-1 rounded font-semibold transition-colors flex items-center justify-center ${
              filterMode === 'normal'
                ? 'bg-[#17483A] dark:bg-slate-700 text-white'
                : 'text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('contrast')}
            aria-label="Enhancement filter: High Contrast"
            className={`min-h-[44px] sm:min-h-0 px-2.5 py-1.5 sm:py-1 rounded font-semibold transition-colors flex items-center justify-center ${
              filterMode === 'contrast'
                ? 'bg-[#17483A] dark:bg-cyan-900/60 text-white dark:text-cyan-200 border border-[#2D6A4F] dark:border-cyan-700/50'
                : 'text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            High Contrast
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('invert')}
            aria-label="Enhancement filter: Optical Invert"
            className={`min-h-[44px] sm:min-h-0 px-2.5 py-1.5 sm:py-1 rounded font-semibold transition-colors flex items-center justify-center ${
              filterMode === 'invert'
                ? 'bg-[#17483A] dark:bg-cyan-900/60 text-white dark:text-cyan-200 border border-[#2D6A4F] dark:border-cyan-700/50'
                : 'text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            Optical Invert
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('grayscale')}
            aria-label="Enhancement filter: Mono Black and White"
            className={`min-h-[44px] sm:min-h-0 px-2.5 py-1.5 sm:py-1 rounded font-semibold transition-colors flex items-center justify-center ${
              filterMode === 'grayscale'
                ? 'bg-[#17483A] dark:bg-cyan-900/60 text-white dark:text-cyan-200 border border-[#2D6A4F] dark:border-cyan-700/50'
                : 'text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            Mono B&amp;W
          </button>
        </div>

        {/* Right: Overlay Toggles & Zoom */}
        <div className="flex items-center gap-3">
          {/* Overlay Toggles */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-0.5 rounded-lg border border-[#C9A24B]/30 dark:border-slate-800 shadow-sm">
            <button
              type="button"
              onClick={() => setShowBoxes(!showBoxes)}
              aria-label="Toggle OCR Bounding Boxes"
              className={`min-h-[44px] sm:min-h-0 flex items-center gap-1 px-2.5 py-1.5 sm:px-2 sm:py-1 rounded font-semibold transition-colors ${
                showBoxes ? 'bg-[#17483A] text-white dark:bg-cyan-500/20 dark:text-cyan-300' : 'text-[#3D5A4C] dark:text-slate-500 hover:text-[#1B2A22] dark:hover:text-slate-300'
              }`}
              title="Toggle OCR Bounding Boxes"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Boxes</span>
            </button>
            <button
              type="button"
              onClick={() => setShowConfidencePills(!showConfidencePills)}
              aria-label="Toggle Confidence Tag Overlay"
              className={`min-h-[44px] sm:min-h-0 flex items-center gap-1 px-2.5 py-1.5 sm:px-2 sm:py-1 rounded font-semibold transition-colors ${
                showConfidencePills ? 'bg-[#17483A] text-white dark:bg-cyan-500/20 dark:text-cyan-300' : 'text-[#3D5A4C] dark:text-slate-500 hover:text-[#1B2A22] dark:hover:text-slate-300'
              }`}
              title="Toggle Confidence Tag Overlay"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Confidence</span>
            </button>
          </div>

          {/* Zoom controls with min 44x44px touch targets on mobile */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-950 px-1 py-0.5 rounded-lg border border-[#C9A24B]/30 dark:border-slate-800 shadow-sm">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              aria-label="Zoom out prescription image"
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1 text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-white disabled:opacity-30 transition-colors flex items-center justify-center"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono tabular-nums text-[#1B2A22] dark:text-slate-300 font-bold px-1 text-xs w-11 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              aria-label="Zoom in prescription image"
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1 text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-white disabled:opacity-30 transition-colors flex items-center justify-center"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              aria-label="Reset zoom to 100%"
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1 text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-white transition-colors ml-0.5 flex items-center justify-center"
              title="Reset Zoom to 100%"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewport Canvas Stage: shown on desktop and on mobile when mobileTab === 'script' */}
      <div
        ref={containerRef}
        className={`${
          mobileTab === 'lines' ? 'hidden sm:flex' : 'flex'
        } relative flex-1 overflow-auto bg-slate-950 p-6 items-center justify-center min-h-[460px]`}
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

          {/* Normalized Bounding Box Overlay Layer (0 to 1000 coordinate space) - Accessible button elements */}
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
                  <button
                    key={line.id}
                    id={`box-${line.id}`}
                    type="button"
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Transcription line ${line.lineNumber}: ${line.normalizedMedicalText || line.rawHandwrittenText}, ${Math.round(line.confidence)}% confidence`}
                    onClick={() => onSelectLine(isSelected ? null : line.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectLine(isSelected ? null : line.id);
                      }
                    }}
                    onFocus={() => setHoveredLineId(line.id)}
                    onBlur={() => setHoveredLineId(null)}
                    onMouseEnter={() => setHoveredLineId(line.id)}
                    onMouseLeave={() => setHoveredLineId(null)}
                    style={{
                      top: `${topPct}%`,
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                    }}
                    className={`absolute border-2 rounded transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 focus:ring-offset-slate-950 ${getConfidenceBorder(
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
                      <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900/95 border border-cyan-500/50 rounded-lg p-2.5 text-xs text-white shadow-xl z-50 backdrop-blur-md pointer-events-none text-left">
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
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dedicated Transcription Lines View (<640px / sm:hidden when mobileTab === 'lines') */}
      {mobileTab === 'lines' && (
        <div className="sm:hidden flex-1 flex flex-col p-3 bg-[#FAF6EA] dark:bg-slate-950 overflow-y-auto space-y-3">
          {/* Quick Search & Filter Controls */}
          <div className="space-y-2">
            <input
              type="text"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
              placeholder="Search transcription lines and medications..."
              aria-label="Search transcription lines and medications"
              className="w-full bg-white dark:bg-slate-900 border border-[#C9A24B]/35 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-[#1B2A22] dark:text-white placeholder:text-[#3D5A4C]/60 dark:placeholder-slate-500 focus:outline-none focus:border-[#2D6A4F]"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'rx_medication', 'sig_instructions', 'patient_info', 'doctor_header'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMobileCategoryFilter(cat)}
                    aria-label={`Filter by ${cat}`}
                    className={`min-h-[44px] px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      mobileCategoryFilter === cat
                        ? 'bg-[#17483A] dark:bg-cyan-600 text-white'
                        : 'bg-white dark:bg-slate-900 text-[#3D5A4C] dark:text-slate-400 border border-[#C9A24B]/30 dark:border-slate-800'
                    }`}
                  >
                    {cat === 'all'
                      ? 'All'
                      : cat === 'rx_medication'
                      ? 'Meds'
                      : cat === 'sig_instructions'
                      ? 'Sig'
                      : cat === 'patient_info'
                      ? 'Patient'
                      : 'Doctor'}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Line Cards */}
          <div className="space-y-2.5">
            {filteredMobileLines.length === 0 ? (
              <div className="text-center py-8 text-[#3D5A4C] dark:text-slate-500 text-xs">
                No transcription lines match your search criteria.
              </div>
            ) : (
              filteredMobileLines.map((line) => {
                const isSelected = selectedLineId === line.id;
                return (
                  <button
                    key={line.id}
                    type="button"
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Transcription line ${line.lineNumber}: ${line.normalizedMedicalText}, confidence ${Math.round(line.confidence)} percent`}
                    onClick={() => onSelectLine(isSelected ? null : line.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-[#2D6A4F] dark:border-cyan-500 ring-2 ring-[#2D6A4F]/30 dark:ring-cyan-500/30 shadow-md'
                        : 'bg-white dark:bg-slate-900/90 border-[#C9A24B]/30 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-[#1B2A22] dark:text-slate-400 bg-[#EFE6CD] dark:bg-slate-950 px-1.5 py-0.5 rounded border border-[#C9A24B]/35 dark:border-slate-800">
                          L{line.lineNumber}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(line.category)}`}>
                          {line.category.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`font-mono text-xs font-bold tabular-nums ${line.confidence >= 95 ? 'text-emerald-700 dark:text-emerald-400' : line.confidence >= 88 ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>
                        {Math.round(line.confidence)}%
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#1B2A22] dark:text-white leading-relaxed">
                      {line.normalizedMedicalText}
                    </p>

                    <p className="text-[11px] font-mono italic text-[#3D5A4C] dark:text-slate-400 mt-1 bg-[#FAF6EA] dark:bg-slate-950 p-1.5 rounded border border-[#C9A24B]/20 dark:border-slate-800">
                      &ldquo;{line.rawHandwrittenText}&rdquo;
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Bottom Inspection Ribbon */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#F3EBD3]/60 dark:bg-slate-900 border-t border-[#C9A24B]/30 dark:border-slate-800 text-xs text-[#3D5A4C] dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4D3B] dark:text-emerald-400 font-bold" />
            <span className="font-semibold text-[#1B2A22] dark:text-slate-300">Document Quality: Verified</span>
          </div>
          <span className="text-[#C9A24B]/40 dark:text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Overall OCR Confidence:</span>
            <span className="font-mono tabular-nums font-bold text-[#1B2A22] dark:text-white">
              {overallConfidence ? `${overallConfidence.toFixed(1)}%` : '--'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
            <span className="text-[#1B2A22] dark:text-slate-300">&ge;95% High</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500" />
            <span className="text-[#1B2A22] dark:text-slate-300">88-94% Review</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-500" />
            <span className="text-[#1B2A22] dark:text-slate-300">&lt;88% Ambiguous</span>
          </span>
        </div>
      </div>
    </div>
  );
};
