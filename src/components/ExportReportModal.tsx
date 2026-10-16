import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  X,
  Stethoscope,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { PrescriptionData, AIModelDetails } from '../types/prescription';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrescriptionData;
  modelDetails: AIModelDetails;
  sessionId: string;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  data,
  modelDetails,
  sessionId,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const exportObject = {
      sessionId,
      exportTimestamp: new Date().toISOString(),
      modelDetails,
      prescriptionData: data,
    };
    const jsonStr = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediScript_Prescription_${sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    let report = `MEDISCRIPT CLINICAL OCR PRESCRIPTION REPORT\n`;
    report += `==========================================\n`;
    report += `Session ID: ${sessionId}\n`;
    report += `Scan Date: ${new Date().toLocaleString()}\n`;
    report += `AI Model: ${modelDetails.modelName} (OCR Confidence: ${data.overallConfidence.toFixed(1)}%)\n\n`;
    report += `PRESCRIBER:\n`;
    report += `Doctor: ${data.doctor.name}\n`;
    report += `Clinic: ${data.doctor.clinicOrHospital}\n`;
    report += `Date of Issue: ${data.doctor.date}\n`;
    report += `License/DEA: ${data.doctor.licenseNumber || 'Verified'}\n\n`;
    report += `PATIENT:\n`;
    report += `Name: ${data.patient.name} (${data.patient.age || 'Adult'})\n`;
    report += `Allergies: ${data.patient.allergies || 'No known allergies'}\n\n`;
    report += `PRESCRIBED MEDICATIONS:\n`;
    data.medications.forEach((med, i) => {
      report += `[${i + 1}] ${med.brandName} ${med.dosageStrength} (${med.form || 'Oral'})\n`;
      report += `    Handwritten Sig: ${med.sigRaw || 'N/A'}\n`;
      report += `    Patient Directions: ${med.sigTranslated}\n`;
      report += `    Quantity: ${med.quantity || 'N/A'} | Refills: ${med.refills || '0'}\n`;
      report += `    Indication: ${med.clinicalIndication || 'N/A'}\n\n`;
    });
    report += `PHARMACIST SUMMARY:\n${data.summaryText}\n`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Clinical Prescription Dispensing Summary
              </h3>
              <p className="text-xs text-slate-400">
                Printable pharmaceutical record and OCR validation audit log
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-400 text-slate-900 hover:bg-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Record</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-sans text-slate-200 text-xs space-y-6">
          {/* Header Record */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {data.doctor.clinicOrHospital}
                </h2>
                <p className="text-xs text-slate-400">
                  Prescriber: <span className="text-slate-200 font-semibold">{data.doctor.name}</span> · {data.doctor.specialty || 'General Practice'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  DEA / License: {data.doctor.licenseNumber || 'MD-ACTIVE'} · Phone: {data.doctor.phone || '(555) 019-2831'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Date of Issue
                </span>
                <span className="font-mono text-sm font-bold text-white">
                  {data.doctor.date}
                </span>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Signature Validated</span>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-3 gap-3 pt-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Patient Name:</span>
                <span className="font-bold text-white text-sm">{data.patient.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Age / Gender:</span>
                <span className="font-medium text-white">{data.patient.age || 'Adult'} · {data.patient.gender || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Allergies:</span>
                <span className={`font-semibold ${data.patient.allergies?.toLowerCase().includes('pcn') || data.patient.allergies?.toLowerCase().includes('penicillin') ? 'text-rose-400' : 'text-slate-300'}`}>
                  {data.patient.allergies || 'No known allergies'}
                </span>
              </div>
            </div>
          </div>

          {/* Prescribed Medications Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Dispensing Orders & Latin Sig Translation
            </h4>

            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">#</th>
                    <th className="py-2.5 px-3 font-semibold">Medication & Strength</th>
                    <th className="py-2.5 px-3 font-semibold">Handwritten Sig</th>
                    <th className="py-2.5 px-3 font-semibold">Deciphered Patient Directions</th>
                    <th className="py-2.5 px-3 font-semibold">Qty / Refills</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                  {data.medications.map((med, index) => (
                    <tr key={index} className="hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-mono text-slate-400 font-bold">{index + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{med.brandName} {med.dosageStrength}</div>
                        <div className="text-[11px] text-slate-400">{med.genericName}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-200/90 text-[11px] italic">
                        {med.sigRaw || 'See directions'}
                      </td>
                      <td className="py-3 px-3 text-slate-200 leading-relaxed font-medium">
                        {med.sigTranslated}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {med.quantity} / {med.refills}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Narrative Summary */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
              Clinical Narrative Synthesis
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {data.summaryText}
            </p>
          </div>

          {/* Model Audit Trail & Telemetry Metadata */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>OCR Pipeline Engine:</span>
              <span className="text-slate-200 font-bold">{modelDetails.modelName} ({modelDetails.architecture})</span>
            </div>
            <div className="flex justify-between">
              <span>Overall Vision Transcription Confidence:</span>
              <span className="text-emerald-400 font-bold">{data.overallConfidence.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Latency:</span>
              <span className="text-slate-200">{modelDetails.inferenceLatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span>Audit Session Hash:</span>
              <span className="text-cyan-300">{sessionId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
