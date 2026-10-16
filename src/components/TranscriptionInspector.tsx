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
        return { label: 'Medication', icon: Pill, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80' };
      case 'sig_instructions':
        return { label: 'Sig Directions', icon: FileText, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80' };
      case 'patient_info':
        return { label: 'Patient Record', icon: User, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/80' };
      case 'doctor_header':
        return { label: 'Prescriber', icon: Stethoscope, color: 'text-slate-300 bg-slate-800/80 border-slate-700' };
      case 'signature_stamp':
        return { label: 'Signature / Stamp', icon: FileSignature, color: 'text-purple-400 bg-purple-950/60 border-purple-800/80' };
      default:
        return { label: 'Footer / Legal', icon: FileText, color: 'text-slate-400 bg-slate-900 border-slate-800' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Header & Clinical Meta Summary */}
      <div className="p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Transcription & OCR Inspector</span>
              <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                {data.transcriptionLines.length} Segments
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and verify doctor cursive handwriting transcribed by Gemini Vision OCR
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
              Overall OCR Score
            </span>
            <span className="text-2xl font-mono font-bold text-white tabular-nums">
              {data.overallConfidence.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Patient & Doctor Quick Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Patient Identification:</span>
            <span className="font-semibold text-white">
              {data.patient.name}
            </span>
            <span className="text-slate-400 ml-2">({data.patient.age || 'Adult'})</span>
            {data.patient.allergies && (
              <span className="block text-[11px] text-rose-300 font-medium mt-0.5">
                Allergies: {data.patient.allergies}
              </span>
            )}
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Prescribing Physician:</span>
            <span className="font-semibold text-white">{data.doctor.name}</span>
            <span className="text-slate-400 block text-[11px]">
              {data.doctor.clinicOrHospital} · Dated: {data.doctor.date}
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transcript, drug name, or Latin sig..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <Filter className="w-3 h-3 text-slate-400 ml-1.5 mr-0.5" />
            {(['all', 'rx_medication', 'sig_instructions', 'patient_info', 'doctor_header'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
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
          <div className="text-center py-12 text-slate-500 text-sm">
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
                onClick={() => onSelectLine(isSelected ? null : line.id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                {/* Line Meta Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
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
                      <span className="text-[11px] text-slate-400">Confidence:</span>
                      <span
                        className={`font-mono text-xs font-bold tabular-nums ${
                          line.confidence >= 95
                            ? 'text-emerald-400'
                            : line.confidence >= 88
                            ? 'text-amber-400'
                            : 'text-rose-400'
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
                      className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors flex items-center gap-1 border ${
                        isVerified
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isVerified ? 'Verified' : 'Verify'}</span>
                    </button>
                  </div>
                </div>

                {/* Raw Handwritten OCR */}
                <div className="mb-2">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Handwritten Script Recognition:
                  </span>
                  <div className="text-xs font-mono text-slate-300 italic bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800/80 mt-0.5">
                    &ldquo;{line.rawHandwrittenText}&rdquo;
                  </div>
                </div>

                {/* Normalized Medical Translation / Decoded Value */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-cyan-400 font-semibold">
                      Decoded Clinical Transcription:
                    </span>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(line);
                        }}
                        className="text-slate-400 hover:text-white p-0.5 text-xs flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
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
                        className="flex-1 bg-slate-900 border border-cyan-500 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(line.id)}
                        className="p-1 bg-cyan-500 text-slate-950 rounded hover:bg-cyan-400"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-1 bg-slate-800 text-slate-400 rounded hover:text-white"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-white mt-0.5 leading-relaxed">
                      {line.normalizedMedicalText}
                      {line.isEdited && (
                        <span className="ml-2 text-[10px] text-cyan-400 font-mono">(Edited by Pharmacist)</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Alternative readings & uncertainties */}
                {line.alternatives && line.alternatives.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-900 flex items-center gap-1.5 text-[11px] text-amber-300/80">
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
