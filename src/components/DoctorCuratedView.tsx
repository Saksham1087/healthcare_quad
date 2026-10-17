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
      <div className="bg-amber-950/70 border-b border-amber-900/80 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="p-1 hover:bg-amber-900/50 rounded text-amber-300 flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
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
            className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-900 border border-amber-800 rounded text-amber-100 flex items-center gap-1 text-[11px]"
          >
            <Printer className="w-3 h-3" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Main Clinician Viewport */}
      <main className="max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Patient Clinical Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">{patient.fullName}</h1>
              <span className="text-xs text-slate-400 font-mono">
                {patient.age}y {patient.gender.toUpperCase()} · Blood {patient.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              ABHA: {patient.abhaId} · {patient.city}, India
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono">
            <p className="text-teal-300 font-semibold">Curated Patient Authorization</p>
            <p className="text-[11px] text-slate-500">Shared specifically with {consent.sharedWithLabel}</p>
          </div>
        </div>

        {/* Section 1: Diagnoses Allowed */}
        {allowedConds.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Diagnoses & Chronic Conditions ({allowedConds.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allowedConds.map((cond) => (
                <div key={cond.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{cond.code.text}</span>
                    <span className="text-[10px] font-mono text-teal-400">{cond.clinicalStatus.toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Diagnosed by {cond.diagnosingDoctor} ({cond.diagnosingFacility})
                  </p>
                  {cond.notes && <p className="text-[11px] text-slate-500 mt-1 italic">{cond.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Active Medications Allowed */}
        {allowedMeds.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Prescriptions & Regimens ({allowedMeds.length})
            </h2>
            <div className="space-y-2">
              {allowedMeds.map((med) => (
                <div
                  key={med.id}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{med.brandName}</span>
                      <span className="text-slate-400 font-mono">({med.genericName})</span>
                      <span className="text-teal-400 font-bold">{med.strength}</span>
                    </div>
                    <p className="text-slate-300">{med.sigTranslated}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Prescriber: {med.prescribingDoctor} ({med.prescribingFacility}) · Prescribed {med.prescribedDate}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 self-start sm:self-center shrink-0">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Diagnostic Lab Panels Allowed */}
        {allowedObs.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Diagnostic Lab Tests & Vitals ({allowedObs.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allowedObs.map((obs) => (
                <div key={obs.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
                  <span className="text-slate-400 block">{obs.testName}</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-white tabular-nums">{obs.value}</span>
                    <span className="text-slate-400 font-mono">{obs.unit}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Ref: {obs.referenceRange.text}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Performer: {obs.performer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Watermark Footer Notice */}
        <div className="text-center py-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
          <p>
            Confidential Healthcare Continuity Summary · Authorized under DPDP Act 2023 · Ephemeral Token {consent.shareToken}
          </p>
          <p>Accessing IP: 103.21.144.92 · All clinical views logged immutably to patient audit ledger.</p>
        </div>
      </main>
    </div>
  );
};
