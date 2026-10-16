import React, { useState } from 'react';
import {
  Share2,
  Clock,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Copy,
  ExternalLink,
  Ban,
  Eye,
  Check,
} from 'lucide-react';

import {
  PatientProfile,
  UnifiedMedication,
  UnifiedCondition,
  UnifiedLabObservation,
  UnifiedEncounter,
  EphemeralConsentShare,
} from '../types/fhir';

interface ConsentStudioProps {
  patient: PatientProfile;
  medications: UnifiedMedication[];
  conditions: UnifiedCondition[];
  observations: UnifiedLabObservation[];
  encounters: UnifiedEncounter[];
  consents: EphemeralConsentShare[];
  onCreateConsent: (consent: EphemeralConsentShare) => void;
  onRevokeConsent: (consentId: string) => void;
  onLaunchDoctorView: (consent: EphemeralConsentShare) => void;
}

export const ConsentStudio: React.FC<ConsentStudioProps> = ({
  patient,
  medications,
  conditions,
  observations,
  encounters,
  consents,
  onCreateConsent,
  onRevokeConsent,
  onLaunchDoctorView,
}) => {
  const [recipientLabel, setRecipientLabel] = useState<string>('Dr. Sundaram (Nephrology Second Opinion)');
  const [purpose, setPurpose] = useState<'TREATMENT' | 'SECOND_OPINION' | 'EMERGENCY' | 'INSURANCE_VERIFICATION'>('SECOND_OPINION');
  const [expiryMinutes, setExpiryMinutes] = useState<number>(15);
  const [requirePin, setRequirePin] = useState<boolean>(true);
  const [pinCode, setPinCode] = useState<string>('4821');

  // Multi-select allowed record IDs
  const allRecordItems = [
    ...conditions.map((c) => ({ id: c.id, label: `Condition: ${c.code.text}`, facility: c.diagnosingFacility })),
    ...medications.map((m) => ({ id: m.id, label: `Medication: ${m.brandName} (${m.genericName})`, facility: m.prescribingFacility })),
    ...observations.map((o) => ({ id: o.id, label: `Lab Test: ${o.testName} (${o.value}${o.unit})`, facility: o.performer })),
    ...encounters.map((e) => ({ id: e.id, label: `Encounter: ${e.hospitalName} (${e.doctorName})`, facility: e.hospitalName })),
  ];

  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([
    conditions[0]?.id,
    medications[0]?.id,
    observations[0]?.id,
  ].filter(Boolean));

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const toggleRecord = (id: string) => {
    setSelectedRecordIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleCreateShare = () => {
    const token = `RX-SHARE-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();

    const newConsent: EphemeralConsentShare = {
      id: `cst-${Date.now()}`,
      shareToken: token,
      createdAt: new Date().toISOString(),
      expiresAt,
      purpose,
      sharedWithLabel: recipientLabel || 'Consulting Physician',
      pinRequired: requirePin,
      pinCode: requirePin ? pinCode : undefined,
      allowedRecordIds: selectedRecordIds,
      status: 'active',
      accessCount: 0,
    };

    onCreateConsent(newConsent);
  };

  const activeConsents = consents.filter((c) => c.status === 'active');
  const revokedConsents = consents.filter((c) => c.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Granular Consent & Zero-Login Doctor Sharing</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Share only what is relevant. Limit by clinical purpose, expire automatically in 15 minutes, and protect with a verbal PIN.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-teal-300">
              {activeConsents.length} Active Ephemeral Link{activeConsents.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Create New Granular Consent (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Generate New Ephemeral Share Link</h3>

          {/* Recipient and Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Doctor or Clinic Label</label>
              <input
                type="text"
                value={recipientLabel}
                onChange={(e) => setRecipientLabel(e.target.value)}
                placeholder="e.g. Dr. Sundaram (Nephrology)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Clinical Purpose (DPDP / FHIR)</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="SECOND_OPINION">Second Opinion Consultation</option>
                <option value="TREATMENT">Direct Medical Treatment</option>
                <option value="EMERGENCY">Emergency Care</option>
                <option value="INSURANCE_VERIFICATION">Insurance Claim Review</option>
              </select>
            </div>
          </div>

          {/* Time TTL and PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Self-Destruct TTL Expiry</label>
              <select
                value={expiryMinutes}
                onChange={(e) => setExpiryMinutes(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 font-mono"
              >
                <option value={15}>15 Minutes (OPD Quick Consult)</option>
                <option value={60}>1 Hour</option>
                <option value={1440}>24 Hours</option>
                <option value={10080}>7 Days</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Verbal 4-Digit Security PIN</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-center tracking-widest focus:outline-none focus:border-teal-500"
                />
                <span className="text-[11px] text-slate-500">State this PIN verbally to doctor</span>
              </div>
            </div>
          </div>

          {/* Granular Record Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">
                Select Records to Include ({selectedRecordIds.length} of {allRecordItems.length} selected)
              </span>
              <button
                type="button"
                onClick={() => {
                  if (selectedRecordIds.length === allRecordItems.length) {
                    setSelectedRecordIds([]);
                  } else {
                    setSelectedRecordIds(allRecordItems.map((r) => r.id));
                  }
                }}
                className="text-teal-400 hover:underline text-[11px]"
              >
                {selectedRecordIds.length === allRecordItems.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              {allRecordItems.map((rec) => {
                const isSelected = selectedRecordIds.includes(rec.id);
                return (
                  <label
                    key={rec.id}
                    className={`flex items-start gap-2.5 p-2 rounded-md cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-900/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRecord(rec.id)}
                      className="rounded border-slate-700 bg-slate-800 text-teal-400 focus:ring-teal-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{rec.label}</p>
                      <p className="text-[10px] text-slate-500">{rec.facility}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateShare}
            disabled={selectedRecordIds.length === 0}
            className="w-full py-2.5 px-4 bg-teal-400 hover:bg-teal-300 disabled:opacity-40 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs shadow-sm shadow-teal-900/30"
          >
            <Share2 className="w-4 h-4 text-slate-900" />
            <span>Generate Ephemeral Link & QR</span>
          </button>
        </div>

        {/* Right Column: Active Consents & Quick Clinician View (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Active Ephemeral Links</h3>

          {activeConsents.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">
              No active doctor sharing sessions. Generate one on the left to share with a physician.
            </div>
          ) : (
            activeConsents.map((consent) => (
              <div
                key={consent.id}
                className="bg-slate-900 border border-teal-500/40 rounded-xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{consent.sharedWithLabel}</h4>
                    <p className="text-[11px] text-slate-400">Purpose: {consent.purpose}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    ACTIVE
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Link Token:</span>
                    <span className="text-teal-400 font-bold">{consent.shareToken}</span>
                  </div>
                  {consent.pinCode && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Verbal PIN:</span>
                      <span className="text-amber-300 font-bold tracking-widest">{consent.pinCode}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span>Allowed Records:</span>
                    <span>{consent.allowedRecordIds.length} items</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span>Views:</span>
                    <span className="tabular-nums">{consent.accessCount} view(s)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onLaunchDoctorView(consent)}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-teal-300 rounded-lg border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Doctor View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRevokeConsent(consent.id)}
                    className="py-1.5 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800 text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Instant Revoke Access"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {revokedConsents.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-semibold text-slate-500 px-1">Revoked / Expired History</h4>
              {revokedConsents.map((rc) => (
                <div
                  key={rc.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-500 flex items-center justify-between"
                >
                  <span className="line-through">{rc.sharedWithLabel}</span>
                  <span className="text-[10px] font-mono text-rose-400/80">Revoked</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
