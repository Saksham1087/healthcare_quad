import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Check,
  X,
  Stethoscope,
  User,
  Pill,
  FileSignature,
  FileText,
} from 'lucide-react';
import { PrescriptionData, TranscriptionLine, LineCategory } from '../types/prescription';

interface TranscriptionInspectorProps {
  data: PrescriptionData;
  selectedLineId: string | null;
  onSelectLine: (id: string | null) => void;
  onUpdateLine: (lineId: string, newText: string) => void;
}

export const TranscriptionInspector: React.FC<TranscriptionInspectorProps> = ({
  data,
  selectedLineId,
  onSelectLine,
  onUpdateLine,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [verifiedLines, setVerifiedLines] = useState<Record<string, boolean>>({});

  const toggleVerify = (lineId: string) => {
    setVerifiedLines((prev) => ({
      ...prev,
      [lineId]: !prev[lineId],
    }));
  };

  const startEditing = (line: TranscriptionLine) => {
    setEditingLineId(line.id);
    setEditValue(line.normalizedMedicalText);
  };

  const saveEdit = (lineId: string) => {
    if (editValue.trim()) {
      onUpdateLine(lineId, editValue.trim());
      setVerifiedLines((prev) => ({ ...prev, [lineId]: true }));
    }
    setEditingLineId(null);
  };

  const cancelEdit = () => {
    setEditingLineId(null);
  };

  // Filter lines
  const filteredLines = data.transcriptionLines.filter((line) => {
    const matchesCategory = categoryFilter === 'all' || line.category === categoryFilter;
    const matchesSearch =
      searchTerm === '' ||
      line.rawHandwrittenText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.normalizedMedicalText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category: LineCategory) => {
    switch (category) {
      case 'rx_medication':
        return { label: 'Medication', icon: Pill, color: 'text-[#17483A] dark:text-cyan-300 bg-[#2D6A4F]/15 dark:bg-cyan-950/60 border-[#2D6A4F]/30 dark:border-cyan-800/80' };
      case 'sig_instructions':
        return { label: 'Sig Directions', icon: FileText, color: 'text-[#1B4332] dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800/80' };
      case 'patient_info':
        return { label: 'Patient Record', icon: User, color: 'text-indigo-900 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800/80' };
      case 'doctor_header':
        return { label: 'Prescriber', icon: Stethoscope, color: 'text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700' };
      case 'signature_stamp':
        return { label: 'Signature / Stamp', icon: FileSignature, color: 'text-purple-900 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800/80' };
      default:
        return { label: 'Footer / Legal', icon: FileText, color: 'text-[#3D5A4C] dark:text-slate-400 bg-[#EFE6CD] dark:bg-slate-900 border-[#C9A24B]/30 dark:border-slate-800' };
    }
  };

  return (
    <div className="hidden sm:flex flex-col h-full bg-[#FAF6EA] dark:bg-[#14372C] rounded-xl border border-[#C9A24B]/35 dark:border-[#3FA796]/30 overflow-hidden shadow-sm">
      {/* Header & Clinical Meta Summary */}
      <div className="p-4 bg-[#FAF6EA] dark:bg-[#14372C] border-b border-[#C9A24B]/30 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-[#1B2A22] dark:text-white tracking-tight flex items-center gap-2">
              <span>Transcription &amp; OCR Inspector</span>
              <span className="text-xs font-mono font-bold text-[#17483A] dark:text-cyan-400 bg-[#2D6A4F]/15 dark:bg-cyan-950/80 px-2 py-0.5 rounded border border-[#2D6A4F]/30 dark:border-cyan-800/60">
                {data.transcriptionLines.length} Segments
              </span>
            </h3>
            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
              Review and verify doctor cursive handwriting transcribed by Gemini Vision OCR
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-[#3D5A4C] dark:text-slate-400 block font-bold">
              Overall OCR Score
            </span>
            <span className="text-2xl font-mono font-bold text-[#1B2A22] dark:text-white tabular-nums">
              {data.overallConfidence.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Patient & Doctor Quick Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3 rounded-lg bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 text-xs shadow-sm">
          <div>
            <span className="text-[#3D5A4C] dark:text-slate-400 font-bold block">Patient Identification:</span>
            <span className="font-bold text-[#1B2A22] dark:text-white">
              {data.patient.name}
            </span>
            <span className="text-[#3D5A4C] dark:text-slate-400 ml-2 font-medium">({data.patient.age || 'Adult'})</span>
            {data.patient.allergies && (
              <span className="block text-[11px] text-rose-700 dark:text-rose-300 font-bold mt-0.5">
                Allergies: {data.patient.allergies}
              </span>
            )}
          </div>
          <div>
            <span className="text-[#3D5A4C] dark:text-slate-400 font-bold block">Prescribing Physician:</span>
            <span className="font-bold text-[#1B2A22] dark:text-white">{data.doctor.name}</span>
            <span className="text-[#3D5A4C] dark:text-slate-400 block text-[11px]">
              {data.doctor.clinicOrHospital} · Dated: {data.doctor.date}
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#3D5A4C] dark:text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transcript, drug name, or Latin sig..."
              aria-label="Search transcription lines and medications"
              className="w-full bg-white dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-slate-700/80 rounded-lg pl-8 pr-3 py-2 sm:py-1.5 text-xs text-[#1B2A22] dark:text-white placeholder:text-[#3D5A4C]/60 dark:placeholder-slate-500 focus:outline-none focus:border-[#2D6A4F] dark:focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-[#071711] p-1 rounded-lg border border-[#C9A24B]/30 dark:border-slate-800">
            <Filter className="w-3 h-3 text-[#3D5A4C] dark:text-slate-400 ml-1.5 mr-0.5" />
            {(['all', 'rx_medication', 'sig_instructions', 'patient_info', 'doctor_header'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  aria-label={`Filter transcription by ${cat}`}
                  className={`min-h-[44px] sm:min-h-0 px-3 py-1.5 sm:px-2.5 sm:py-1 text-xs rounded font-semibold transition-colors whitespace-nowrap flex items-center justify-center ${
                    categoryFilter === cat
                      ? 'bg-[#17483A] dark:bg-[#3FA796] text-white dark:text-[#0E2A21] shadow-sm'
                      : 'text-[#3D5A4C] dark:text-slate-400 hover:text-[#1B2A22] dark:hover:text-white'
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
      </div>

      {/* Line-by-Line Transcription List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredLines.length === 0 ? (
          <div className="text-center py-12 text-[#3D5A4C] dark:text-slate-500 text-sm">
            No transcription lines match the search criteria.
          </div>
        ) : (
          filteredLines.map((line) => {
            const isSelected = selectedLineId === line.id;
            const isVerified = verifiedLines[line.id];
            const isEditing = editingLineId === line.id;
            const badge = getCategoryBadge(line.category);
            const Icon = badge.icon;

            return (
              <div
                key={line.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Transcription line ${line.lineNumber}: ${line.normalizedMedicalText}, confidence ${line.confidence.toFixed(1)} percent`}
                onClick={() => onSelectLine(isSelected ? null : line.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                      e.preventDefault();
                      onSelectLine(isSelected ? null : line.id);
                    }
                  }
                }}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-cyan-500 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800/90 border-[#2D6A4F] dark:border-cyan-500/80 ring-1 ring-[#2D6A4F]/40 dark:ring-cyan-500/40 shadow-md'
                    : 'bg-white dark:bg-[#071711] border-[#C9A24B]/30 dark:border-slate-800/80 hover:bg-[#FAF6EA] dark:hover:bg-slate-800/50 shadow-sm'
                }`}
              >
                {/* Line Meta Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1B2A22] dark:text-slate-400 bg-[#EFE6CD] dark:bg-slate-900 px-1.5 py-0.5 rounded border border-[#C9A24B]/35 dark:border-slate-800">
                      L{line.lineNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${badge.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Confidence percentage */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#3D5A4C] dark:text-slate-400 font-bold">Confidence:</span>
                      <span
                        className={`font-mono text-xs font-bold tabular-nums ${
                          line.confidence >= 95
                            ? 'text-[#1E4D3B] dark:text-emerald-400'
                            : line.confidence >= 88
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {line.confidence.toFixed(1)}%
                      </span>
                    </div>

                    {/* Verification button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVerify(line.id);
                      }}
                      aria-label={isVerified ? `Mark line ${line.lineNumber} unverified` : `Verify line ${line.lineNumber}`}
                      className={`min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 px-2.5 py-1.5 sm:px-2 sm:py-0.5 text-[11px] font-semibold rounded transition-colors flex items-center justify-center gap-1 border ${
                        isVerified
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold'
                          : 'bg-white dark:bg-slate-900 text-[#3D5A4C] dark:text-slate-400 border-[#C9A24B]/30 dark:border-slate-800 hover:text-[#1B2A22] dark:hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                      <span>{isVerified ? 'Verified' : 'Verify'}</span>
                    </button>
                  </div>
                </div>

                {/* Raw Handwritten OCR */}
                <div className="mb-2">
                  <span className="text-[11px] text-[#3D5A4C] dark:text-slate-400 block font-bold">
                    Handwritten Script Recognition:
                  </span>
                  <div className="text-xs font-mono text-[#1B2A22] dark:text-slate-300 italic bg-[#FAF6EA] dark:bg-slate-900/80 px-2.5 py-1.5 rounded border border-[#C9A24B]/30 dark:border-slate-800/80 mt-0.5">
                    &ldquo;{line.rawHandwrittenText}&rdquo;
                  </div>
                </div>

                {/* Normalized Medical Translation / Decoded Value */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#17483A] dark:text-cyan-400 font-bold">
                      Decoded Clinical Transcription:
                    </span>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(line);
                        }}
                        aria-label={`Edit transcription for line ${line.lineNumber}`}
                        className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-0.5 text-[#3D5A4C] dark:text-slate-400 hover:text-[#17483A] dark:hover:text-white text-xs flex items-center justify-center gap-1 font-semibold"
                      >
                        <Edit2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div
                      className="mt-1 flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        aria-label={`Edit text for line ${line.lineNumber}`}
                        className="flex-1 bg-white dark:bg-slate-900 border border-[#2D6A4F] dark:border-cyan-500 rounded px-2.5 py-1 text-xs text-[#1B2A22] dark:text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(line.id)}
                        className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1 bg-[#17483A] dark:bg-cyan-500 text-white dark:text-slate-950 rounded hover:bg-[#2D6A4F] flex items-center justify-center"
                        title="Save Changes"
                        aria-label={`Save edits for line ${line.lineNumber}`}
                      >
                        <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1 bg-white dark:bg-slate-800 text-[#3D5A4C] dark:text-slate-400 border border-[#C9A24B]/30 dark:border-none rounded hover:text-white flex items-center justify-center"
                        title="Cancel"
                        aria-label={`Cancel editing line ${line.lineNumber}`}
                      >
                        <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-[#1B2A22] dark:text-white mt-0.5 leading-relaxed">
                      {line.normalizedMedicalText}
                      {line.isEdited && (
                        <span className="ml-2 text-[10px] text-[#17483A] dark:text-cyan-400 font-mono font-bold">(Edited by Pharmacist)</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Alternative readings & uncertainties */}
                {line.alternatives && line.alternatives.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#C9A24B]/20 dark:border-slate-900 flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300/80 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Alternative decipher: {line.alternatives.join(' · ')}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
