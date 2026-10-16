import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Lifetime Portable Health Export</h3>
              <p className="text-xs text-slate-400">Compliant with HL7 FHIR R4 and NRCES / ABDM Guidelines</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            type="button"
            onClick={() => setExportFormat('fhir')}
            className={`p-4 rounded-xl border text-left transition-all ${
              exportFormat === 'fhir'
                ? 'bg-slate-850 border-teal-500/80'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <FileCode className="w-5 h-5 text-teal-400 mb-2" />
            <h4 className="font-bold text-white">Standard FHIR R4 JSON Bundle</h4>
            <p className="text-slate-400 mt-1">
              Machine-readable HL7 standard file for importing into hospital EHRs, Apple Health, or ABDM PHRs.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setExportFormat('summary')}
            className={`p-4 rounded-xl border text-left transition-all ${
              exportFormat === 'summary'
                ? 'bg-slate-850 border-teal-500/80'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <FileText className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="font-bold text-white">Clinical Summary Document</h4>
            <p className="text-slate-400 mt-1">
              Formatted, readable PDF summary of all active conditions, medications, allergies, and lab tests.
            </p>
          </button>
        </div>

        {/* Details based on format */}
        {exportFormat === 'fhir' ? (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-mono">
              <span>Standard:</span>
              <span className="text-teal-400">HL7 FHIR Release 4.0.1</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 font-mono">
              <span>Included Resources:</span>
              <span>
                {conditions.length} Conditions, {medications.length} Medications, {allergies.length} Allergies,{' '}
                {observations.length} Observations
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300 font-mono">
              <span>Patient Identifier:</span>
              <span className="text-slate-400">ABHA {patient.abhaId}</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-900">
              No proprietary vendor lock-in. You own your medical record forever.
            </p>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2 text-xs">
            <p className="text-slate-300 leading-relaxed">
              Generates a printable clinical report designed for new doctor consultations. Includes physician signatures, provenance footnotes, and emergency contacts.
            </p>
            <p className="text-[11px] text-teal-400">
              Tip: In the browser print dialog, select "Save as PDF" to preserve a permanent copy.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold"
          >
            Cancel
          </button>

          {exportFormat === 'fhir' ? (
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadFhirJson}
              className="px-4 py-2 bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-900/30"
            >
              <Download className="w-4 h-4 text-slate-900" />
              <span>{isExporting ? 'Generating FHIR Bundle...' : 'Download FHIR R4 JSON'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrintSummary}
              className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-900/30"
            >
              <Printer className="w-4 h-4 text-slate-900" />
              <span>Print / Save Summary PDF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
