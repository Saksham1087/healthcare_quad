import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  Heart,
  Phone,
  QrCode,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  User,
  Clock,
  Send,
  Building2,
  FileText,
  Printer,
  Ban,
} from 'lucide-react';

import {
  PatientProfile,
  UnifiedMedication,
  UnifiedAllergy,
  BreakGlassLogEntry,
} from '../types/fhir';

interface EmergencyBreakGlassCardProps {
  patient: PatientProfile;
  allergies: UnifiedAllergy[];
  medications: UnifiedMedication[];
  breakGlassLogs: BreakGlassLogEntry[];
  onTriggerBreakGlass: (entry: BreakGlassLogEntry) => void;
  onRevokeBreakGlass: (logId: string) => void;
}

export const EmergencyBreakGlassCard: React.FC<EmergencyBreakGlassCardProps> = ({
  patient,
  allergies,
  medications,
  breakGlassLogs,
  onTriggerBreakGlass,
  onRevokeBreakGlass,
}) => {
  const [isBreakGlassModalOpen, setIsBreakGlassModalOpen] = useState<boolean>(false);
  const [responderName, setResponderName] = useState<string>('Dr. Anand Verma, MD');
  const [responderRole, setResponderRole] = useState<string>('Emergency Department Attending Physician');
  const [regNumber, setRegNumber] = useState<string>('DMC-R-84920');
  const [facility, setFacility] = useState<string>('Fortis Memorial Research Institute, Trauma Bay 1');
  const [justification, setJustification] = useState<string>('Unconscious trauma admission; verifying acute drug allergies and cardiac stent history');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [recentEmergencyNotice, setRecentEmergencyNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isBreakGlassModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBreakGlassModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBreakGlassModalOpen]);

  const criticalAllergies = allergies.filter((a) => a.criticality === 'high' || a.criticality === 'medium');
  const activeEmergencyMeds = medications.filter((m) => m.status === 'active').slice(0, 4);

  const handleSubmitBreakGlass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/break-glass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responderName,
          responderRole,
          medicalRegistrationNumber: regNumber,
          hospitalFacility: facility,
          justification,
          patientId: patient.id,
        }),
      });

      const result = await response.json();

      const newEntry: BreakGlassLogEntry = {
        id: result.auditEventId || `BG-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        responderName,
        responderRole,
        medicalRegistrationNumber: regNumber,
        hospitalFacility: facility,
        justification,
        ipAddress: '103.21.144.92 (Emergency Dept Fiber)',
        location: 'New Delhi, India',
        alertDispatchedTo: [patient.emergencyContact.phone, patient.phone],
        sessionDurationMinutes: 30,
      };

      onTriggerBreakGlass(newEntry);
      setIsBreakGlassModalOpen(false);
      setRecentEmergencyNotice(
        `Emergency access unlocked for 30 minutes! High-priority SMS alert dispatched to ${patient.emergencyContact.name} (${patient.emergencyContact.phone}).`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1B2A22] dark:text-[#F3EBD3] tracking-tight">Offline Emergency Card & Audited Break-Glass</h2>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
                Life-critical allergies and emergency contacts accessible offline. Full medical records require verified medical registration and trigger real-time family SMS alerts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-[#1B2A22] dark:text-[#F3EBD3] bg-white dark:bg-[#0E2A21] hover:bg-[#F3EBD3] dark:hover:bg-[#17483A] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap self-end md:self-center shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#3D5A4C] dark:text-[#A3C5B8]" />
            <span>Print Physical Card</span>
          </button>
        </div>
      </div>

      {recentEmergencyNotice && (
        <div className="bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800/80 p-4 rounded-xl text-xs text-rose-900 dark:text-rose-200 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0" />
            <span>{recentEmergencyNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setRecentEmergencyNotice(null)}
            aria-label="Dismiss emergency notice"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-rose-700 dark:text-rose-400 font-bold hover:text-rose-950 dark:hover:text-white rounded-lg hover:bg-rose-200/50 dark:hover:bg-rose-900/40 transition-colors text-lg"
          >
            &times;
          </button>
        </div>
      )}

      {/* Grid: Emergency Badge + Break Glass Action (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Physical Emergency Card Badge (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-rose-100/70 via-[#FAF6EA] to-white dark:from-rose-950/60 dark:via-[#14372C] dark:to-[#14372C] border-2 border-rose-300 dark:border-rose-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Red Emergency Header Bar */}
            <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-black text-white text-base">
                  +
                </div>
                <div>
                  <h3 className="text-sm font-black text-rose-950 dark:text-white tracking-wider uppercase">EMERGENCY MEDICAL BADGE</h3>
                  <p className="text-[10px] font-mono text-rose-700 dark:text-rose-300 font-bold">GOVERNMENT ABHA: {patient.abhaId}</p>
                </div>
              </div>

              {/* Blood Group Pill */}
              <div className="text-right">
                <span className="text-[10px] text-[#3D5A4C] dark:text-slate-400 uppercase tracking-widest block font-bold">BLOOD GROUP</span>
                <span className="text-2xl font-black font-mono text-rose-700 dark:text-rose-400 tabular-nums">{patient.bloodGroup}</span>
              </div>
            </div>

            {/* Patient Name & Critical Metrics */}
            <div className="py-4 space-y-3">
              <div>
                <span className="text-[10px] text-[#3D5A4C] dark:text-[#A3C5B8] uppercase tracking-wider font-bold">PATIENT IDENTITY</span>
                <h4 className="text-lg font-bold text-[#1B2A22] dark:text-white tracking-tight">{patient.fullName}</h4>
                <p className="text-xs text-[#3D5A4C] dark:text-slate-300 font-mono">
                  DOB: {patient.dateOfBirth} ({patient.age} yrs) · {patient.gender.toUpperCase()} · New Delhi, India
                </p>
              </div>

              {/* Critical Allergies Box (Life-Threatening) */}
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>LIFE-THREATENING ALLERGIES (ANAPHYLAXIS RISK)</span>
                </span>
                {criticalAllergies.map((alg) => (
                  <p key={alg.id} className="text-xs font-bold text-rose-950 dark:text-white">
                    {alg.substance} &mdash; <span className="font-semibold text-rose-800 dark:text-rose-200">{alg.manifestation}</span>
                  </p>
                ))}
              </div>

              {/* Chronic Regimens */}
              <div>
                <span className="text-[10px] text-[#3D5A4C] dark:text-[#A3C5B8] uppercase tracking-wider block mb-1 font-bold">
                  CRITICAL MAINTENANCE MEDICATIONS
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {activeEmergencyMeds.map((med) => (
                    <div key={med.id} className="bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg p-2 font-mono shadow-sm">
                      <p className="font-bold text-[#1B2A22] dark:text-white truncate">{med.brandName}</p>
                      <p className="text-[10px] text-[#3D5A4C] dark:text-slate-400">{med.genericName}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="border-t border-[#C9A24B]/30 dark:border-slate-800 pt-3">
                <span className="text-[10px] text-[#3D5A4C] dark:text-[#A3C5B8] uppercase tracking-wider block mb-1 font-bold">
                  IN CASE OF EMERGENCY (I.C.E. CONTACT)
                </span>
                <div className="flex items-center justify-between text-xs bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg p-2.5 shadow-sm">
                  <div>
                    <p className="font-bold text-[#1B2A22] dark:text-white">{patient.emergencyContact.name}</p>
                    <p className="text-[11px] text-[#3D5A4C] dark:text-slate-400 font-medium">{patient.emergencyContact.relationship}</p>
                  </div>
                  <a
                    href={`tel:${patient.emergencyContact.phone}`}
                    className="flex items-center gap-1 font-mono font-bold text-[#17483A] dark:text-teal-400 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{patient.emergencyContact.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Offline QR Code Block */}
            <div className="pt-3 border-t border-[#C9A24B]/30 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#3D5A4C] dark:text-slate-400 font-mono font-bold">OFFLINE SIGNED HEALTH BADGE</span>
                <p className="text-[11px] text-[#1B2A22] dark:text-slate-300">Scan for immediate responder triage</p>
              </div>

              <div className="w-14 h-14 bg-white border border-[#C9A24B]/35 dark:border-none rounded-lg p-1 flex items-center justify-center shrink-0 shadow-sm">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Responder Break-Glass Trigger & Audit Log (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Unlock className="w-4 h-4" />
              <span>Emergency Responder Portal</span>
            </div>

            <h3 className="text-sm font-bold text-[#1B2A22] dark:text-white tracking-tight">Need Full Medical History for Acute Resuscitation?</h3>
            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
              If the patient is unconscious, disoriented, or unable to provide verbal PIN consent, authorized emergency doctors may break glass to access surgical history, cardiology records, and past lab panels.
            </p>

            <button
              type="button"
              onClick={() => setIsBreakGlassModalOpen(true)}
              className="w-full min-h-[44px] py-3 px-4 bg-rose-700 hover:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs shadow-md shadow-rose-950/20"
            >
              <AlertOctagon className="w-4 h-4 text-white" />
              <span>Activate Audited Emergency Break-Glass</span>
            </button>
          </div>

          {/* Break Glass Audit History */}
          <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl p-5 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3] tracking-tight flex items-center justify-between">
              <span>Audited Emergency Access Ledger</span>
              <span className="text-[10px] font-mono text-[#3D5A4C] dark:text-[#A3C5B8]">{breakGlassLogs.length} Events Logged</span>
            </h4>

            {breakGlassLogs.length === 0 ? (
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] py-3">No emergency break-glass activations on record.</p>
            ) : (
              <div className="space-y-2.5">
                {breakGlassLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg p-3 text-xs space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[#1B2A22] dark:text-slate-300">
                      <span className="font-bold text-rose-700 dark:text-rose-400">{log.responderName}</span>
                      <span className="font-mono text-[10px] text-[#3D5A4C] dark:text-[#A3C5B8]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8]">
                      Reg #: <span className="font-mono text-[#1B2A22] dark:text-slate-200 font-bold">{log.medicalRegistrationNumber}</span> · {log.hospitalFacility}
                    </p>
                    <p className="text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8] italic">&ldquo;{log.justification}&rdquo;</p>

                    <div className="flex items-center justify-between pt-1 border-t border-[#C9A24B]/20 dark:border-slate-800 text-[10px] text-[#3D5A4C] dark:text-[#A3C5B8] font-mono">
                      <span>SMS Alert Sent to Caregiver</span>
                      {!log.revokedEarly ? (
                        <button
                          type="button"
                          onClick={() => onRevokeBreakGlass(log.id)}
                          aria-label={`Revoke emergency access for ${log.responderName}`}
                          className="min-h-[44px] px-3 py-1.5 text-rose-700 dark:text-rose-400 hover:underline font-bold inline-flex items-center"
                        >
                          Revoke Access
                        </button>
                      ) : (
                        <span className="text-amber-700 dark:text-amber-400 font-bold">Access Revoked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Break Glass Modal */}
      {isBreakGlassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="break-glass-modal-title"
            className="bg-[#FAF6EA] dark:bg-[#14372C] border-2 border-rose-300 dark:border-rose-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400">
                <AlertOctagon className="w-5 h-5" aria-hidden="true" />
                <h3 id="break-glass-modal-title" className="text-base font-bold text-[#1B2A22] dark:text-white">Emergency Break-Glass Attestation</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBreakGlassModalOpen(false)}
                aria-label="Close dialog"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#3D5A4C] dark:text-slate-400 hover:text-rose-600 dark:hover:text-white font-bold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-lg"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
              Under DPDP Act 2023 and the National Medical Commission (NMC) regulations, emergency access without prior consent is legally permitted strictly for life-threatening medical emergencies. All queries are watermarked and logged immutably.
            </p>

            <form onSubmit={handleSubmitBreakGlass} className="space-y-3 text-xs">
              <div>
                <label htmlFor="attending-doctor-name" className="text-[#1B2A22] dark:text-slate-300 font-semibold block mb-1">Attending Clinician Full Name</label>
                <input
                  id="attending-doctor-name"
                  name="attending-doctor-name"
                  type="text"
                  required
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  className="w-full bg-white dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-slate-800 rounded-lg px-3 py-2 text-[#1B2A22] dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="nmc-reg-number" className="text-[#1B2A22] dark:text-slate-300 font-semibold block mb-1">Medical Registration # (NMC)</label>
                  <input
                    id="nmc-reg-number"
                    name="nmc-reg-number"
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-white dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-slate-800 rounded-lg px-3 py-2 text-[#1B2A22] dark:text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label htmlFor="hospital-facility" className="text-[#1B2A22] dark:text-slate-300 font-semibold block mb-1">Hospital / Trauma Center</label>
                  <input
                    id="hospital-facility"
                    name="hospital-facility"
                    type="text"
                    required
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full bg-white dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-slate-800 rounded-lg px-3 py-2 text-[#1B2A22] dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="clinical-justification" className="text-[#1B2A22] dark:text-slate-300 font-semibold block mb-1">Clinical Emergency Justification</label>
                <textarea
                  id="clinical-justification"
                  name="clinical-justification"
                  rows={2}
                  required
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full bg-white dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-slate-800 rounded-lg px-3 py-2 text-[#1B2A22] dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg text-[11px] text-rose-900 dark:text-rose-300 flex items-start gap-2">
                <Send className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>
                  By tapping proceed, an immediate SMS broadcast will be dispatched to the patient and primary caregiver{' '}
                  <strong>{patient.emergencyContact.name} ({patient.emergencyContact.phone})</strong> with full physician details and instant revocation link.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBreakGlassModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 bg-white dark:bg-slate-800 hover:bg-[#F3EBD3] dark:hover:bg-slate-750 text-[#1B2A22] dark:text-slate-300 rounded-lg font-semibold border border-[#C9A24B]/35 dark:border-slate-700 flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-4 py-2 bg-rose-700 hover:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Verifying Registration...' : 'Authorize Break-Glass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
