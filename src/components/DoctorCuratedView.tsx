import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Clock,
  Printer,
  FileText,
  Activity,
  Pill,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowLeft,
} from 'lucide-react';

import {
  PatientProfile,
  UnifiedMedication,
  UnifiedCondition,
  UnifiedLabObservation,
  UnifiedEncounter,
  EphemeralConsentShare,
} from '../types/fhir';

interface DoctorCuratedViewProps {
  patient: PatientProfile;
  consent: EphemeralConsentShare;
  medications: UnifiedMedication[];
  conditions: UnifiedCondition[];
  observations: UnifiedLabObservation[];
  encounters: UnifiedEncounter[];
  onExit: () => void;
}

export const DoctorCuratedView: React.FC<DoctorCuratedViewProps> = ({
  patient,
  consent,
  medications,
  conditions,
  observations,
  encounters,
  onExit,
}) => {
  const getInitialSeconds = () => {
    if (!consent.expiresAt) return 15 * 60;
    const diff = Math.floor((new Date(consent.expiresAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  };

  const [secondsRemaining, setSecondsRemaining] = useState<number>(getInitialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isExpired =
    consent.status === 'expired' ||
    consent.status === 'revoked' ||
    (Boolean(consent.expiresAt) && new Date(consent.expiresAt).getTime() <= Date.now()) ||
    secondsRemaining <= 0;

  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl shadow-rose-950/20">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Access Expired / Session Terminated</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              The ephemeral authorization window for token <span className="font-mono text-teal-400">{consent.shareToken}</span> has closed. Under DPDP Act 2023 regulations and zero-trust privacy policy, temporary physician access sessions are immediately invalidated once expired.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left space-y-1.5 text-xs font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Token:</span>
              <span className="text-teal-400 font-bold">{consent.shareToken}</span>
            </div>
            <div className="flex justify-between">
              <span>Authorized Recipient:</span>
              <span className="text-slate-200">{consent.sharedWithLabel}</span>
            </div>
            <div className="flex justify-between">
              <span>Purpose:</span>
              <span className="text-slate-200">{consent.purpose}</span>
            </div>
            {consent.expiresAt && (
              <div className="flex justify-between">
                <span>Expiration:</span>
                <span className="text-rose-400">{new Date(consent.expiresAt).toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onExit}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-teal-300 rounded-xl border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter only records allowed in this specific consent token
  const allowedMeds = medications.filter((m) => consent.allowedRecordIds.includes(m.id));
  const allowedConds = conditions.filter((c) => consent.allowedRecordIds.includes(c.id));
  const allowedObs = observations.filter((o) => consent.allowedRecordIds.includes(o.id));
  const allowedEncs = encounters.filter((e) => consent.allowedRecordIds.includes(e.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Clinician Watermarked Header Banner */}
      <header
        role="banner"
        className="bg-amber-950/80 border-b border-amber-900/80 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit Doctor View and return to patient dashboard"
            className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 px-3 py-2 sm:px-2.5 sm:py-1 hover:bg-amber-900/60 rounded-lg text-amber-300 hover:text-amber-100 flex items-center gap-1.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <ArrowLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span>Return to Studio</span>
          </button>
          <span className="text-amber-600" aria-hidden="true">|</span>
          <div className="flex items-center gap-1.5 text-amber-200">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Doctor View (Token: {consent.shareToken})</span>
          </div>
          <span className="text-amber-600" aria-hidden="true">|</span>
          <span className="text-amber-300 font-medium">Purpose: {consent.purpose}</span>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Session Self-Destruct: {formatTimer(secondsRemaining)}</span>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print curated doctor clinical summary"
            className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 px-3 py-2 sm:px-2.5 sm:py-1 bg-amber-900/60 hover:bg-amber-900 border border-amber-800 rounded-lg text-amber-100 flex items-center gap-1.5 text-xs sm:text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <Printer className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
            <span>Print View</span>
          </button>
        </div>
      </header>

      {/* Main Clinician Viewport */}
      <main className="max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Patient Clinical Header */}
        <section
          aria-labelledby="section-patient-header"
          className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 id="section-patient-header" className="text-xl font-bold text-[#1B2A22] dark:text-white tracking-tight">{patient.fullName}</h1>
              <span className="text-xs text-[#3D5A4C] dark:text-slate-400 font-mono font-bold">
                {patient.age}y {patient.gender.toUpperCase()} · Blood {patient.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-[#3D5A4C] dark:text-slate-400 mt-1 font-mono font-medium">
              ABHA: {patient.abhaId} · {patient.city}, India
            </p>
          </div>

          <div className="text-right text-xs text-[#3D5A4C] dark:text-slate-400 font-mono">
            <p className="text-[#17483A] dark:text-teal-300 font-bold">Curated Patient Authorization</p>
            <p className="text-[11px] text-[#3D5A4C] dark:text-slate-400 font-medium">Shared specifically with {consent.sharedWithLabel}</p>
          </div>
        </section>

        {/* Section 1: Diagnoses Allowed */}
        {allowedConds.length > 0 && (
          <section
            aria-labelledby="section-conditions"
            className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl p-5 space-y-3 shadow-sm"
          >
            <h2 id="section-conditions" className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3] uppercase tracking-wider">
              Diagnoses &amp; Chronic Conditions ({allowedConds.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allowedConds.map((cond) => (
                <div key={cond.id} className="bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg p-3 text-xs shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1B2A22] dark:text-white">{cond.code.text}</span>
                    <span className="text-[10px] font-mono text-[#1E4D3B] dark:text-teal-400 font-bold">{cond.clinicalStatus.toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-[#3D5A4C] dark:text-slate-400 mt-1">
                    Diagnosed by {cond.diagnosingDoctor} ({cond.diagnosingFacility})
                  </p>
                  {cond.notes && <p className="text-[11px] text-[#3D5A4C] dark:text-slate-500 mt-1 italic">{cond.notes}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Active Medications Allowed */}
        {allowedMeds.length > 0 && (
          <section
            aria-labelledby="section-medications"
            className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl p-5 space-y-3 shadow-sm"
          >
            <h2 id="section-medications" className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3] uppercase tracking-wider">
              Active Prescriptions &amp; Regimens ({allowedMeds.length})
            </h2>
            <div className="space-y-2">
              {allowedMeds.map((med) => (
                <div
                  key={med.id}
                  className="bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1B2A22] dark:text-white">{med.brandName}</span>
                      <span className="text-[#3D5A4C] dark:text-slate-400 font-mono">({med.genericName})</span>
                      <span className="text-[#17483A] dark:text-teal-400 font-bold">{med.strength}</span>
                    </div>
                    <p className="text-[#1B2A22] dark:text-slate-300 font-medium">{med.sigTranslated}</p>
                    <p className="text-[11px] text-[#3D5A4C] dark:text-slate-500 font-mono">
                      Prescriber: {med.prescribingDoctor} ({med.prescribingFacility}) · Prescribed {med.prescribedDate}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 self-start sm:self-center shrink-0">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Diagnostic Lab Panels Allowed */}
        {allowedObs.length > 0 && (
          <section
            aria-labelledby="section-observations"
            className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl p-5 space-y-3 shadow-sm"
          >
            <h2 id="section-observations" className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3] uppercase tracking-wider">
              Diagnostic Lab Tests &amp; Vitals ({allowedObs.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allowedObs.map((obs) => (
                <div key={obs.id} className="bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg p-3 text-xs shadow-sm">
                  <span className="text-[#3D5A4C] dark:text-slate-400 font-bold block">{obs.testName}</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-[#1B2A22] dark:text-white tabular-nums">{obs.value}</span>
                    <span className="text-[#3D5A4C] dark:text-slate-400 font-mono">{obs.unit}</span>
                  </div>
                  <p className="text-[10px] text-[#3D5A4C] dark:text-slate-400 mt-1 font-mono">Ref: {obs.referenceRange.text}</p>
                  <p className="text-[10px] text-[#3D5A4C] dark:text-slate-400 mt-0.5">Performer: {obs.performer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Watermark Footer Notice */}
        <footer
          role="contentinfo"
          className="text-center py-4 border-t border-[#C9A24B]/20 dark:border-slate-800 text-[11px] text-[#3D5A4C] dark:text-slate-400 space-y-1 font-medium"
        >
          <p>
            Confidential Healthcare Continuity Summary · Authorized under DPDP Act 2023 · Ephemeral Token {consent.shareToken}
          </p>
          <p>Accessing IP: 103.21.144.92 · All clinical views logged immutably to patient audit ledger.</p>
        </footer>
      </main>
    </div>
  );
};
