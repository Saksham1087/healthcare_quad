import React, { useState, useEffect } from 'react';
import {
  Download,
  FileCode,
  FileText,
  Printer,
  X,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

import {
  PatientProfile,
  UnifiedMedication,
  UnifiedCondition,
  UnifiedAllergy,
  UnifiedLabObservation,
  UnifiedEncounter,
} from '../types/fhir';

interface LifetimeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  medications: UnifiedMedication[];
  conditions: UnifiedCondition[];
  allergies: UnifiedAllergy[];
  observations: UnifiedLabObservation[];
  encounters: UnifiedEncounter[];
}

export const LifetimeExportModal: React.FC<LifetimeExportModalProps> = ({
  isOpen,
  onClose,
  patient,
  medications,
  conditions,
  allergies,
  observations,
  encounters,
}) => {
  const [exportFormat, setExportFormat] = useState<'fhir' | 'summary'>('fhir');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadFhirJson = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export-fhir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient,
          conditions,
          medications,
          allergies,
          observations,
          encounters,
        }),
      });

      const data = await response.json();
      const jsonString = JSON.stringify(data.bundle || data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MediScript_FHIR_R4_${patient.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lifetime-export-modal-title"
        className="bg-[#FAF6EA] dark:bg-[#14372C] border-2 border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#C9A24B]/30 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/15 border border-[#2D6A4F]/30 flex items-center justify-center text-[#1E4D3B] dark:text-[#52B788]">
              <Download className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3 id="lifetime-export-modal-title" className="text-base font-bold text-[#1B2A22] dark:text-white tracking-tight">Lifetime Portable Health Export</h3>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8]">Compliant with HL7 FHIR R4 and NRCES / ABDM Guidelines</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#3D5A4C] dark:text-slate-400 hover:text-rose-600 dark:hover:text-white font-bold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            type="button"
            onClick={() => setExportFormat('fhir')}
            className={`p-4 rounded-xl border text-left transition-all ${
              exportFormat === 'fhir'
                ? 'bg-white dark:bg-[#071711] border-[#2D6A4F] dark:border-[#3FA796] shadow-md ring-1 ring-[#2D6A4F]/30'
                : 'bg-white/60 dark:bg-[#071711]/60 border-[#C9A24B]/30 dark:border-slate-800 hover:border-[#2D6A4F]/60'
            }`}
          >
            <FileCode className="w-5 h-5 text-[#2D6A4F] dark:text-[#3FA796] mb-2" />
            <h4 className="font-bold text-[#1B2A22] dark:text-white">Standard FHIR R4 JSON Bundle</h4>
            <p className="text-[#3D5A4C] dark:text-[#A3C5B8] mt-1">
              Machine-readable HL7 standard file for importing into hospital EHRs, Apple Health, or ABDM PHRs.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setExportFormat('summary')}
            className={`p-4 rounded-xl border text-left transition-all ${
              exportFormat === 'summary'
                ? 'bg-white dark:bg-[#071711] border-[#2D6A4F] dark:border-[#3FA796] shadow-md ring-1 ring-[#2D6A4F]/30'
                : 'bg-white/60 dark:bg-[#071711]/60 border-[#C9A24B]/30 dark:border-slate-800 hover:border-[#2D6A4F]/60'
            }`}
          >
            <FileText className="w-5 h-5 text-amber-700 dark:text-amber-400 mb-2" />
            <h4 className="font-bold text-[#1B2A22] dark:text-white">Clinical Summary Document</h4>
            <p className="text-[#3D5A4C] dark:text-[#A3C5B8] mt-1">
              Formatted, readable PDF summary of all active conditions, medications, allergies, and lab tests.
            </p>
          </button>
        </div>

        {/* Details based on format */}
        {exportFormat === 'fhir' ? (
          <div className="bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg p-3.5 space-y-2 text-xs shadow-sm">
            <div className="flex items-center justify-between text-[#1B2A22] dark:text-slate-300 font-mono">
              <span className="font-semibold text-[#3D5A4C] dark:text-slate-400">Standard:</span>
              <span className="text-[#1E4D3B] dark:text-teal-400 font-bold">HL7 FHIR Release 4.0.1</span>
            </div>
            <div className="flex items-center justify-between text-[#1B2A22] dark:text-slate-300 font-mono">
              <span className="font-semibold text-[#3D5A4C] dark:text-slate-400">Included Resources:</span>
              <span className="font-bold">
                {conditions.length} Conditions, {medications.length} Medications, {allergies.length} Allergies,{' '}
                {observations.length} Observations
              </span>
            </div>
            <div className="flex items-center justify-between text-[#1B2A22] dark:text-slate-300 font-mono">
              <span className="font-semibold text-[#3D5A4C] dark:text-slate-400">Patient Identifier:</span>
              <span className="text-[#3D5A4C] dark:text-slate-400 font-bold">ABHA {patient.abhaId}</span>
            </div>
            <p className="text-[11px] text-[#3D5A4C] dark:text-slate-400 pt-2 border-t border-[#C9A24B]/20 dark:border-slate-900 font-semibold">
              No proprietary vendor lock-in. You own your medical record forever.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg p-3.5 space-y-2 text-xs shadow-sm">
            <p className="text-[#1B2A22] dark:text-slate-300 leading-relaxed">
              Generates a printable clinical report designed for new doctor consultations. Includes physician signatures, provenance footnotes, and emergency contacts.
            </p>
            <p className="text-[11px] text-[#17483A] dark:text-teal-400 font-bold">
              Tip: In the browser print dialog, select &ldquo;Save as PDF&rdquo; to preserve a permanent copy.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 bg-white dark:bg-slate-800 hover:bg-[#F3EBD3] dark:hover:bg-slate-750 text-[#1B2A22] dark:text-slate-300 rounded-lg text-xs font-semibold border border-[#C9A24B]/35 dark:border-slate-700 flex items-center justify-center"
          >
            Cancel
          </button>

          {exportFormat === 'fhir' ? (
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadFhirJson}
              className="min-h-[44px] px-4 py-2 bg-[#17483A] dark:bg-[#3FA796] hover:bg-[#2D6A4F] dark:hover:bg-[#4CB8A4] disabled:opacity-50 text-white dark:text-[#0E2A21] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#17483A]/30"
            >
              <Download className="w-4 h-4 text-white dark:text-[#0E2A21]" />
              <span>{isExporting ? 'Generating FHIR Bundle...' : 'Download FHIR R4 JSON'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrintSummary}
              className="min-h-[44px] px-4 py-2 bg-[#17483A] dark:bg-[#3FA796] hover:bg-[#2D6A4F] dark:hover:bg-[#4CB8A4] text-white dark:text-[#0E2A21] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#17483A]/30"
            >
              <Printer className="w-4 h-4 text-white dark:text-[#0E2A21]" />
              <span>Print / Save Summary PDF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
