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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Clinical Safety & Medication Reconciliation Engine</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates active drug ingredients, cross-provider duplicate prescriptions, and beta-lactam/NSAID allergy cross-reactivities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{activeAlerts.length} Active Safety Invariants</span>
            </div>
            <span className="text-slate-700" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
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
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Detected Alerts ({activeAlerts.length})
          </h3>

          {activeAlerts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">All Prescriptions Reconciled</p>
              <p className="text-[11px] text-slate-500 mt-1">No duplicate active molecules or allergy clashes detected.</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <button
                key={alert.id}
                type="button"
                onClick={() => setSelectedAlertId(alert.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedAlert?.id === alert.id
                    ? 'bg-slate-850 border-teal-500/80 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{alert.severity.toUpperCase()} ALERT</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                    {new Date(alert.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-white mt-1.5">{alert.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.description}</p>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  <span>Meds: {alert.involvedMedications.join(' + ')}</span>
                </div>
              </button>
            ))
          )}

          {/* Reconciled Alerts History */}
          {resolvedAlerts.length > 0 && (
            <div className="pt-4 space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 px-1">Reconciled History</h4>
              {resolvedAlerts.map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="line-through text-slate-500">{res.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Resolved</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Alert Resolution Workspace (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          {selectedAlert ? (
            <>
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                    {selectedAlert.severity.toUpperCase()} RISK
                  </span>
                  <span>Detected via Deterministic Pharmacology Rules</span>
                </div>
                <h3 className="text-base font-bold text-white mt-2 tracking-tight">{selectedAlert.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedAlert.description}</p>
              </div>

              {/* Clinical Rationale Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <Info className="w-3.5 h-3.5" />
                  <span>Clinical Rationale</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedAlert.clinicalRationale}</p>
                <div className="pt-2 border-t border-slate-800/80 text-xs text-teal-300">
                  <span className="font-semibold text-slate-400">Recommended Directive: </span>
                  {selectedAlert.recommendedAction}
                </div>
              </div>

              {/* Involved Medication Prescribers breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400">Involved Prescriptions Across Facilities</h4>
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
                        className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{med.brandName}</span>
                            <span className="text-slate-400 font-mono">({med.genericName})</span>
                            <span className="text-slate-400">· {med.strength}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Prescribed by <span className="text-slate-300">{med.prescribingDoctor}</span> at{' '}
                            <span className="text-teal-400">{med.prescribingFacility}</span> on {med.prescribedDate}
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
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 rounded-md transition-colors whitespace-nowrap shrink-0"
                        >
                          Discontinue This Med
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Human-in-the-Loop Resolution Form */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300">Doctor / Patient Confirmation Note</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Consulted Dr. Rajiv Nanda; stop Dolo 650 while taking Combiflam"
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
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
                    className="px-4 py-2 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Confirm Reconciliation
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              Select an alert from the left column to view its clinical breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Indian Drug Brand -> Generic Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Indian Brand $\rightarrow$ Generic Pharmacology Dictionary</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect active molecules, Fixed-Dose Combinations (FDCs), SNOMED concepts, and daily therapeutic dosage limits.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Indian brand (e.g. Pan-D, Telma-H)..."
              value={searchDrugQuery}
              onChange={(e) => setSearchDrugQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredDrugs.slice(0, 6).map((drug) => (
            <button
              key={drug.brandName}
              type="button"
              onClick={() => setSelectedDrugDef(drug)}
              className={`text-left p-3.5 rounded-lg border transition-all ${
                selectedDrugDef?.brandName === drug.brandName
                  ? 'bg-slate-850 border-teal-500'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{drug.brandName}</span>
                <span className="text-[10px] font-mono text-teal-400">SNOMED {drug.snomedConcept}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">{drug.genericName}</p>
              <p className="text-[10px] text-slate-500 mt-1">{drug.therapeuticClass}</p>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1 text-[10px] text-slate-400">
                {drug.activeIngredients.map((ing) => (
                  <span key={ing.name} className="font-mono text-slate-300">
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
