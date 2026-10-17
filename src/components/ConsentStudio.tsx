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
      <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 flex items-center justify-center text-[#2D6A4F] dark:text-[#52B788] shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1B2A22] dark:text-[#F3EBD3] tracking-tight">Granular Consent &amp; Zero-Login Doctor Sharing</h2>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
                Share only what is relevant. Limit by clinical purpose, expire automatically in 15 minutes, and protect with a verbal PIN.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-[#2D6A4F]/15 text-[#17483A] dark:text-[#C5E99B] border border-[#2D6A4F]/25">
              {activeConsents.length} Active Ephemeral Link{activeConsents.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Create New Granular Consent (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1B2A22] dark:text-[#F3EBD3] tracking-tight">Generate New Ephemeral Share Link</h3>

          {/* Recipient and Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="consent-recipient-label" className="text-[#1B2A22] dark:text-[#F3EBD3] font-bold block mb-1">Doctor or Clinic Label</label>
              <input
                id="consent-recipient-label"
                name="consent-recipient-label"
                type="text"
                value={recipientLabel}
                onChange={(e) => setRecipientLabel(e.target.value)}
                placeholder="e.g. Dr. Sundaram (Nephrology)"
                className="w-full bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/40 dark:border-slate-800 rounded-xl px-3 py-2 text-[#1B2A22] dark:text-[#F3EBD3] placeholder:text-[#3D5A4C]/60 focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div>
              <label htmlFor="consent-purpose-select" className="text-[#1B2A22] dark:text-[#F3EBD3] font-bold block mb-1">Clinical Purpose (DPDP / FHIR)</label>
              <select
                id="consent-purpose-select"
                name="consent-purpose-select"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/40 dark:border-slate-800 rounded-xl px-3 py-2 text-[#1B2A22] dark:text-[#F3EBD3] focus:outline-none focus:border-[#2D6A4F]"
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
              <label htmlFor="consent-ttl-expiry" className="text-[#1B2A22] dark:text-[#F3EBD3] font-bold block mb-1">Self-Destruct TTL Expiry</label>
              <select
                id="consent-ttl-expiry"
                name="consent-ttl-expiry"
                value={expiryMinutes}
                onChange={(e) => setExpiryMinutes(parseInt(e.target.value, 10))}
                className="w-full bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/40 dark:border-slate-800 rounded-xl px-3 py-2 text-[#1B2A22] dark:text-[#F3EBD3] focus:outline-none focus:border-[#2D6A4F] font-mono font-semibold"
              >
                <option value={15}>15 Minutes (OPD Quick Consult)</option>
                <option value={60}>1 Hour</option>
                <option value={1440}>24 Hours</option>
                <option value={10080}>7 Days</option>
              </select>
            </div>

            <div>
              <label htmlFor="consent-verbal-pin" className="text-[#1B2A22] dark:text-[#F3EBD3] font-bold block mb-1">Verbal 4-Digit Security PIN</label>
              <div className="flex items-center gap-2">
                <input
                  id="consent-verbal-pin"
                  name="consent-verbal-pin"
                  type="text"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-24 bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/40 dark:border-slate-800 rounded-xl px-3 py-2 text-[#1B2A22] dark:text-[#F3EBD3] font-mono font-bold text-center tracking-widest focus:outline-none focus:border-[#2D6A4F]"
                />
                <span className="text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8] font-medium">State this PIN verbally to doctor</span>
              </div>
            </div>
          </div>

          {/* Granular Record Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#1B2A22] dark:text-[#F3EBD3] font-bold">
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
                className="min-h-[44px] inline-flex items-center text-[#2D6A4F] dark:text-[#52B788] hover:underline text-[11px] font-bold"
              >
                {selectedRecordIds.length === allRecordItems.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 p-2 bg-white dark:bg-[#0E2A21] rounded-xl border border-[#C9A24B]/35 dark:border-slate-800 text-xs shadow-inner">
              {allRecordItems.map((rec) => {
                const isSelected = selectedRecordIds.includes(rec.id);
                return (
                  <label
                    key={rec.id}
                    className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FAF6EA] dark:bg-[#194336] text-[#1B2A22] dark:text-[#F3EBD3] border border-[#2D6A4F]/30 font-semibold' : 'text-[#3D5A4C] dark:text-[#A3C5B8] hover:bg-[#FAF6EA]/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRecord(rec.id)}
                      className="rounded border-[#C9A24B] text-[#2D6A4F] focus:ring-[#2D6A4F] mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-[#1B2A22] dark:text-[#F3EBD3]">{rec.label}</p>
                      <p className="text-[10px] text-[#3D5A4C] dark:text-[#A3C5B8]">{rec.facility}</p>
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
            className="w-full min-h-[44px] py-2.5 px-4 bg-gradient-to-r from-[#0F3D2E] to-[#2D6A4F] hover:opacity-95 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md"
          >
            <Share2 className="w-4 h-4 text-[#C5E99B]" />
            <span>Generate Ephemeral Link &amp; QR</span>
          </button>
        </div>

        {/* Right Column: Active Consents & Quick Clinician View (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-[#1B2A22] dark:text-[#F3EBD3] tracking-tight">Active Ephemeral Links</h3>

          {activeConsents.length === 0 ? (
            <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl p-8 text-center text-xs text-[#3D5A4C] dark:text-[#A3C5B8] font-medium shadow-sm">
              No active doctor sharing sessions. Generate one on the left to share with a physician.
            </div>
          ) : (
            activeConsents.map((consent) => (
              <div
                key={consent.id}
                className="bg-white dark:bg-[#14372C] border-2 border-[#2D6A4F]/40 dark:border-[#3FA796]/40 rounded-2xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3]">{consent.sharedWithLabel}</h4>
                    <p className="text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8] font-medium">Purpose: {consent.purpose}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-[#2D6A4F]/15 text-[#17483A] dark:text-[#C5E99B] border border-[#2D6A4F]/30">
                    ACTIVE
                  </span>
                </div>

                <div className="bg-[#FAF6EA] dark:bg-[#0E2A21] p-2.5 rounded-xl border border-[#C9A24B]/35 dark:border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#1B2A22] dark:text-slate-300">
                    <span>Link Token:</span>
                    <span className="text-[#2D6A4F] dark:text-[#52B788] font-bold">{consent.shareToken}</span>
                  </div>
                  {consent.pinCode && (
                    <div className="flex items-center justify-between text-[#3D5A4C] dark:text-slate-400">
                      <span>Verbal PIN:</span>
                      <span className="text-[#92400E] dark:text-amber-300 font-bold tracking-widest">{consent.pinCode}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[#3D5A4C] dark:text-slate-400 text-[10px]">
                    <span>Allowed Records:</span>
                    <span className="font-semibold">{consent.allowedRecordIds.length} items</span>
                  </div>
                  <div className="flex items-center justify-between text-[#3D5A4C] dark:text-slate-400 text-[10px]">
                    <span>Views:</span>
                    <span className="tabular-nums font-semibold">{consent.accessCount} view(s)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onLaunchDoctorView(consent)}
                    aria-label={`Open doctor view for ${consent.sharedWithLabel}`}
                    className="flex-1 min-h-[44px] py-1.5 px-2 bg-[#FAF6EA] dark:bg-[#0E2A21] hover:bg-[#EFE6CD] text-[#17483A] dark:text-[#52B788] rounded-xl border border-[#C9A24B]/40 dark:border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Open Doctor View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRevokeConsent(consent.id)}
                    aria-label={`Revoke access for ${consent.sharedWithLabel}`}
                    className="min-h-[44px] min-w-[44px] py-1.5 px-3 bg-[#991B1B]/10 hover:bg-[#991B1B]/20 text-[#991B1B] dark:text-[#F87171] rounded-xl border border-[#991B1B]/30 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    title="Instant Revoke Access"
                  >
                    <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Revoke</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {revokedConsents.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-bold text-[#3D5A4C] dark:text-[#A3C5B8] px-1 font-mono">Revoked / Expired History</h4>
              {revokedConsents.map((rc) => (
                <div
                  key={rc.id}
                  className="bg-[#FAF6EA]/70 dark:bg-[#14372C]/60 border border-[#C9A24B]/30 rounded-xl p-2.5 text-xs text-[#3D5A4C] dark:text-slate-400 flex items-center justify-between shadow-sm"
                >
                  <span className="line-through">{rc.sharedWithLabel}</span>
                  <span className="text-[10px] font-mono font-bold text-[#991B1B] dark:text-rose-400/80">Revoked</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
