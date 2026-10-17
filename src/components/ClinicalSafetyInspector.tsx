import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Pill,
  CheckCircle2,
  HelpCircle,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

import {
  UnifiedMedication,
  UnifiedAllergy,
  ClinicalSafetyAlert,
} from '../types/fhir';
import {
  INDIAN_DRUG_DATABASE,
  IndianDrugDefinition,
  lookupDrugDefinition,
} from '../services/clinicalSafety';

interface ClinicalSafetyInspectorProps {
  alerts: ClinicalSafetyAlert[];
  medications: UnifiedMedication[];
  allergies: UnifiedAllergy[];
  onResolveAlert: (alertId: string, actionNote: string) => void;
  onDiscontinueMedication: (medId: string) => void;
}

export const ClinicalSafetyInspector: React.FC<ClinicalSafetyInspectorProps> = ({
  alerts,
  medications,
  allergies,
  onResolveAlert,
  onDiscontinueMedication,
}) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(alerts[0]?.id || null);
  const [searchDrugQuery, setSearchDrugQuery] = useState<string>('');
  const [selectedDrugDef, setSelectedDrugDef] = useState<IndianDrugDefinition | null>(INDIAN_DRUG_DATABASE[0]);
  const [resolutionInput, setResolutionInput] = useState<string>('');

  const activeAlerts = alerts.filter((a) => !a.isResolved);
  const resolvedAlerts = alerts.filter((a) => a.isResolved);

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || activeAlerts[0] || null;

  // Search filtered Indian drug formulary
  const filteredDrugs = INDIAN_DRUG_DATABASE.filter((d) => {
    if (!searchDrugQuery.trim()) return true;
    const q = searchDrugQuery.toLowerCase();
    return (
      d.brandName.toLowerCase().includes(q) ||
      d.genericName.toLowerCase().includes(q) ||
      d.therapeuticClass.toLowerCase().includes(q) ||
      d.activeIngredients.some((ing) => ing.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#991B1B]/10 border border-[#991B1B]/30 flex items-center justify-center text-[#991B1B] dark:text-[#F87171] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1B2A22] dark:text-[#F3EBD3] tracking-tight">Clinical Safety &amp; Medication Reconciliation Engine</h2>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
                Evaluates active drug ingredients, cross-provider duplicate prescriptions, and beta-lactam/NSAID allergy cross-reactivities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <div className="flex items-center gap-1.5 text-[#991B1B] dark:text-[#F87171]">
              <AlertTriangle className="w-4 h-4" />
              <span>{activeAlerts.length} Active Safety Invariants</span>
            </div>
            <span className="text-[#C9A24B]" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5 text-[#17483A] dark:text-[#52B788]">
              <CheckCircle2 className="w-4 h-4" />
              <span>{resolvedAlerts.length} Reconciled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Safety & Reconciliation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Alerts Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17483A] dark:text-[#A3C5B8] px-1 font-mono">
            Detected Alerts ({activeAlerts.length})
          </h3>

          {activeAlerts.length === 0 ? (
            <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl p-8 text-center shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-[#2D6A4F] dark:text-[#52B788] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3]">All Prescriptions Reconciled</p>
              <p className="text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8] mt-1">No duplicate active molecules or allergy clashes detected.</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <button
                key={alert.id}
                type="button"
                onClick={() => setSelectedAlertId(alert.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all shadow-sm ${
                  selectedAlert?.id === alert.id
                    ? 'bg-white dark:bg-[#194336] border-2 border-[#2D6A4F] dark:border-[#52B788] ring-2 ring-[#2D6A4F]/20'
                    : 'bg-[#FAF6EA] dark:bg-[#14372C] border-[#C9A24B]/35 dark:border-slate-800 hover:border-[#2D6A4F]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#991B1B] dark:text-[#F87171]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{alert.severity.toUpperCase()} ALERT</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#3D5A4C] dark:text-[#A3C5B8] tabular-nums font-semibold">
                    {new Date(alert.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3] mt-1.5">{alert.title}</h4>
                <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-1 line-clamp-2 leading-relaxed">{alert.description}</p>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#C9A24B]/20 dark:border-slate-800 text-[11px] text-[#17483A] dark:text-[#7BC96F] font-mono font-semibold">
                  <span>Meds: {alert.involvedMedications.join(' + ')}</span>
                </div>
              </button>
            ))
          )}

          {/* Reconciled Alerts History */}
          {resolvedAlerts.length > 0 && (
            <div className="pt-4 space-y-2">
              <h4 className="text-xs font-bold text-[#3D5A4C] dark:text-[#A3C5B8] px-1 font-mono">Reconciled History</h4>
              {resolvedAlerts.map((res) => (
                <div
                  key={res.id}
                  className="bg-[#FAF6EA]/80 dark:bg-[#14372C]/70 border border-[#C9A24B]/30 rounded-xl p-3 text-xs text-[#3D5A4C] dark:text-[#A3C5B8] flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#52B788] shrink-0" />
                    <span className="line-through text-[#3D5A4C] dark:text-[#A3C5B8]">{res.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#2D6A4F] dark:text-[#52B788]">Resolved</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Alert Resolution Workspace (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl p-5 space-y-5 shadow-sm">
          {selectedAlert ? (
            <>
              <div className="border-b border-[#C9A24B]/30 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#991B1B] dark:text-[#F87171]">
                  <span className="px-2 py-0.5 rounded-lg bg-[#991B1B]/15 border border-[#991B1B]/30">
                    {selectedAlert.severity.toUpperCase()} RISK
                  </span>
                  <span>Detected via Deterministic Pharmacology Rules</span>
                </div>
                <h3 className="text-base font-bold text-[#1B2A22] dark:text-[#F3EBD3] mt-2 tracking-tight">{selectedAlert.title}</h3>
                <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-1 leading-relaxed">{selectedAlert.description}</p>
              </div>

              {/* Clinical Rationale Box */}
              <div className="bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/35 dark:border-slate-800 rounded-xl p-3.5 space-y-2 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E] dark:text-amber-400">
                  <Info className="w-3.5 h-3.5" />
                  <span>Clinical Rationale</span>
                </div>
                <p className="text-xs text-[#1B2A22] dark:text-[#F3EBD3] leading-relaxed">{selectedAlert.clinicalRationale}</p>
                <div className="pt-2 border-t border-[#C9A24B]/20 dark:border-slate-800/80 text-xs text-[#17483A] dark:text-[#52B788] font-medium">
                  <span className="font-bold text-[#1B2A22] dark:text-[#F3EBD3]">Recommended Directive: </span>
                  {selectedAlert.recommendedAction}
                </div>
              </div>

              {/* Involved Medication Prescribers breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3]">Involved Prescriptions Across Facilities</h4>
                <div className="space-y-2">
                  {medications
                    .filter((m) =>
                      selectedAlert.involvedMedications.some((name) =>
                        m.brandName.toLowerCase().includes(name.toLowerCase())
                      )
                    )
                    .map((med) => (
                      <div
                        key={med.id}
                        className="bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/35 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1B2A22] dark:text-[#F3EBD3]">{med.brandName}</span>
                            <span className="text-[#3D5A4C] dark:text-[#A3C5B8] font-mono">({med.genericName})</span>
                            <span className="text-[#3D5A4C] dark:text-[#A3C5B8]">· {med.strength}</span>
                          </div>
                          <p className="text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
                            Prescribed by <span className="font-semibold text-[#1B2A22] dark:text-[#F3EBD3]">{med.prescribingDoctor}</span> at{' '}
                            <span className="text-[#2D6A4F] dark:text-[#52B788] font-bold">{med.prescribingFacility}</span> on {med.prescribedDate}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onDiscontinueMedication(med.id);
                            onResolveAlert(
                              selectedAlert.id,
                              `Discontinued ${med.brandName} prescribed by ${med.prescribingDoctor}`
                            );
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#991B1B] dark:text-[#F87171] bg-[#991B1B]/10 hover:bg-[#991B1B]/20 border border-[#991B1B]/30 rounded-xl transition-colors whitespace-nowrap shrink-0"
                        >
                          Discontinue This Med
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Human-in-the-Loop Resolution Form */}
              <div className="pt-4 border-t border-[#C9A24B]/20 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3]">Doctor / Patient Confirmation Note</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Consulted Dr. Rajiv Nanda; stop Dolo 650 while taking Combiflam"
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/40 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[#1B2A22] dark:text-[#F3EBD3] placeholder:text-[#3D5A4C]/60 focus:outline-none focus:border-[#2D6A4F]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onResolveAlert(
                        selectedAlert.id,
                        resolutionInput || 'Reconciled and acknowledged by consulting clinician'
                      );
                      setResolutionInput('');
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0F3D2E] to-[#2D6A4F] hover:opacity-95 rounded-xl transition-all whitespace-nowrap shadow-sm"
                  >
                    Confirm Reconciliation
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-[#3D5A4C] dark:text-[#A3C5B8] font-medium">
              Select an alert from the left column to view its clinical breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Indian Drug Brand -> Generic Explorer */}
      <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#1B2A22] dark:text-[#F3EBD3] tracking-tight">Indian Brand &rarr; Generic Pharmacology Dictionary</h3>
            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
              Inspect active molecules, Fixed-Dose Combinations (FDCs), SNOMED concepts, and daily therapeutic dosage limits.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#3D5A4C] dark:text-[#A3C5B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Indian brand (e.g. Pan-D, Telma-H)..."
              value={searchDrugQuery}
              onChange={(e) => setSearchDrugQuery(e.target.value)}
              className="bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/40 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#1B2A22] dark:text-[#F3EBD3] placeholder:text-[#3D5A4C]/60 focus:outline-none focus:border-[#2D6A4F] w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredDrugs.slice(0, 6).map((drug) => (
            <button
              key={drug.brandName}
              type="button"
              onClick={() => setSelectedDrugDef(drug)}
              className={`text-left p-3.5 rounded-xl border transition-all shadow-sm ${
                selectedDrugDef?.brandName === drug.brandName
                  ? 'bg-white dark:bg-[#194336] border-2 border-[#2D6A4F] dark:border-[#52B788]'
                  : 'bg-white/80 dark:bg-[#0E2A21] border-[#C9A24B]/30 dark:border-slate-800 hover:border-[#2D6A4F]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1B2A22] dark:text-[#F3EBD3] text-xs">{drug.brandName}</span>
                <span className="text-[10px] font-mono font-bold text-[#2D6A4F] dark:text-[#52B788]">SNOMED {drug.snomedConcept}</span>
              </div>
              <p className="text-[11px] font-semibold text-[#17483A] dark:text-[#7BC96F] mt-1">{drug.genericName}</p>
              <p className="text-[10px] text-[#3D5A4C] dark:text-[#A3C5B8] mt-1">{drug.therapeuticClass}</p>

              <div className="mt-2 pt-2 border-t border-[#C9A24B]/20 dark:border-slate-800 flex flex-wrap gap-1 text-[10px] text-[#3D5A4C] dark:text-[#A3C5B8]">
                {drug.activeIngredients.map((ing) => (
                  <span key={ing.name} className="font-mono font-medium text-[#1B2A22] dark:text-[#F3EBD3]">
                    {ing.name} ({ing.strengthMg}{ing.unit})
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
