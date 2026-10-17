import React from 'react';
import {
  Pill,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Info,
  Calendar,
  Repeat,
  CheckCircle2,
  Sun,
  Sunrise,
  Sunset,
  Moon,
} from 'lucide-react';
import { MedicationItem } from '../types/prescription';

interface MedicationScheduleProps {
  medications: MedicationItem[];
  criticalAlerts: string[];
}

export const MedicationScheduleCard: React.FC<MedicationScheduleProps> = ({
  medications,
  criticalAlerts,
}) => {
  // Infer daily dosage schedule times based on frequency text
  const parseSchedule = (frequency: string = '', sig: string = '') => {
    const text = (frequency + ' ' + sig).toLowerCase();
    const morning = text.includes('qam') || text.includes('bid') || text.includes('tid') || text.includes('morning') || text.includes('qd') || text.includes('daily');
    const noon = text.includes('tid') || text.includes('qid') || text.includes('noon');
    const evening = text.includes('bid') || text.includes('tid') || text.includes('evening') || text.includes('dinner');
    const bedtime = text.includes('qhs') || text.includes('bedtime') || text.includes('night');

    return { morning, noon, evening, bedtime };
  };

  return (
    <div className="space-y-6">
      {/* Critical Pharmacist Alerts Banner */}
      {criticalAlerts && criticalAlerts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600/50 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Clinical Pharmacist Safety &amp; Interaction Alerts
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs text-amber-900 dark:text-amber-300/90 font-medium">
                {criticalAlerts.map((alert, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-700 dark:text-amber-500 font-bold">•</span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Medication Cards List */}
      <div className="space-y-4">
        {medications.map((med, index) => {
          const schedule = parseSchedule(med.frequency, med.sigRaw);

          return (
            <div
              key={med.id || index}
              className="p-5 rounded-xl bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 shadow-sm"
            >
              {/* Header: Drug Name & Form */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#C9A24B]/20 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2D6A4F]/15 border border-[#2D6A4F]/30 flex items-center justify-center text-[#1E4D3B] dark:text-[#52B788] shrink-0 mt-0.5">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-lg font-bold text-[#1B2A22] dark:text-white tracking-tight">
                        {med.brandName}
                      </h3>
                      <span className="text-sm font-bold text-[#17483A] dark:text-cyan-400 font-mono">
                        {med.dosageStrength}
                      </span>
                    </div>
                    {med.genericName && (
                      <p className="text-xs text-[#3D5A4C] dark:text-slate-400">
                        Generic: <span className="text-[#1B2A22] dark:text-slate-300 font-bold">{med.genericName}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded bg-white dark:bg-slate-800 text-[#1B2A22] dark:text-slate-300 border border-[#C9A24B]/35 dark:border-slate-700 font-semibold shadow-sm">
                    {med.form || 'Oral Formulation'}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded bg-[#2D6A4F]/15 dark:bg-cyan-950/60 text-[#1E4D3B] dark:text-cyan-300 border border-[#2D6A4F]/25 dark:border-cyan-800/80 font-mono font-bold">
                    {med.route || 'Oral (PO)'}
                  </span>
                </div>
              </div>

              {/* Patient Sig: Raw vs Translated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="p-3 rounded-lg bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 shadow-sm">
                  <span className="text-[11px] uppercase tracking-wider text-[#3D5A4C] dark:text-slate-400 font-bold block mb-1">
                    Verbatim Handwritten Doctor Sig (Latin Notation)
                  </span>
                  <div className="font-mono text-xs text-amber-900 dark:text-amber-200/90 font-semibold italic">
                    {med.sigRaw || 'Sig not specified verbatim'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F3EBD3]/70 dark:bg-cyan-950/30 border border-[#2D6A4F]/30 dark:border-cyan-800/40 shadow-sm">
                  <span className="text-[11px] uppercase tracking-wider text-[#17483A] dark:text-cyan-400 font-bold block mb-1">
                    Deciphered Patient Directions
                  </span>
                  <div className="text-xs font-bold text-[#1B2A22] dark:text-white leading-relaxed">
                    {med.sigTranslated}
                  </div>
                </div>
              </div>

              {/* Dosage Schedule Timeline */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 mb-4 shadow-sm">
                <span className="text-[11px] uppercase tracking-wider text-[#3D5A4C] dark:text-slate-400 font-bold block mb-2">
                  Suggested Administration Windows
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div
                    className={`flex items-center gap-2 p-2 rounded border text-xs ${
                      schedule.morning
                        ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/50 text-amber-950 dark:text-amber-200 font-bold'
                        : 'bg-[#FAF6EA] dark:bg-slate-900 border-[#C9A24B]/20 dark:border-slate-800 text-[#3D5A4C] dark:text-slate-500 font-medium'
                    }`}
                  >
                    <Sunrise className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400" />
                    <div>
                      <div className="font-bold text-[11px]">Morning</div>
                      <div className="text-[10px] text-[#3D5A4C] dark:text-slate-400">08:00 AM</div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded border text-xs ${
                      schedule.noon
                        ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/50 text-amber-950 dark:text-amber-200 font-bold'
                        : 'bg-[#FAF6EA] dark:bg-slate-900 border-[#C9A24B]/20 dark:border-slate-800 text-[#3D5A4C] dark:text-slate-500 font-medium'
                    }`}
                  >
                    <Sun className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400" />
                    <div>
                      <div className="font-bold text-[11px]">Noon</div>
                      <div className="text-[10px] text-[#3D5A4C] dark:text-slate-400">12:30 PM</div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded border text-xs ${
                      schedule.evening
                        ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/50 text-amber-950 dark:text-amber-200 font-bold'
                        : 'bg-[#FAF6EA] dark:bg-slate-900 border-[#C9A24B]/20 dark:border-slate-800 text-[#3D5A4C] dark:text-slate-500 font-medium'
                    }`}
                  >
                    <Sunset className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400" />
                    <div>
                      <div className="font-bold text-[11px]">Evening</div>
                      <div className="text-[10px] text-[#3D5A4C] dark:text-slate-400">06:30 PM</div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded border text-xs ${
                      schedule.bedtime
                        ? 'bg-indigo-100 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-500/50 text-indigo-950 dark:text-indigo-200 font-bold'
                        : 'bg-[#FAF6EA] dark:bg-slate-900 border-[#C9A24B]/20 dark:border-slate-800 text-[#3D5A4C] dark:text-slate-500 font-medium'
                    }`}
                  >
                    <Moon className="w-4 h-4 shrink-0 text-indigo-700 dark:text-indigo-400" />
                    <div>
                      <div className="font-bold text-[11px]">Bedtime</div>
                      <div className="text-[10px] text-[#3D5A4C] dark:text-slate-400">10:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity, Duration, Refills Row */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#C9A24B]/20 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[#3D5A4C] dark:text-slate-400 block text-[11px] font-bold">Dispense Quantity:</span>
                  <span className="font-bold text-[#1B2A22] dark:text-white font-mono mt-0.5 block">
                    {med.quantity || 'As prescribed'}
                  </span>
                </div>
                <div>
                  <span className="text-[#3D5A4C] dark:text-slate-400 block text-[11px] font-bold">Therapy Duration:</span>
                  <span className="font-bold text-[#1B2A22] dark:text-white font-mono mt-0.5 block">
                    {med.duration || 'Per clinical course'}
                  </span>
                </div>
                <div>
                  <span className="text-[#3D5A4C] dark:text-slate-400 block text-[11px] font-bold">Authorized Refills:</span>
                  <span className="font-bold text-[#1B2A22] dark:text-white font-mono mt-0.5 block">
                    {med.refills || '0 (Zero)'}
                  </span>
                </div>
              </div>

              {/* Safety Warnings & Indications */}
              {med.safetyWarnings && med.safetyWarnings.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#3D5A4C] dark:text-slate-400 uppercase tracking-wider block">
                    Clinical Warnings &amp; Patient Counseling:
                  </span>
                  {med.safetyWarnings.map((warn, i) => (
                    <div
                      key={i}
                      className="text-xs text-[#1B2A22] dark:text-slate-300 flex items-start gap-2 bg-white dark:bg-[#071711] p-2.5 rounded-lg border border-[#C9A24B]/30 dark:border-slate-800/80 shadow-sm font-medium"
                    >
                      <Info className="w-3.5 h-3.5 text-[#17483A] dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
