import React, { useState } from 'react';
import {
  FileText,
  Pill,
  Activity,
  AlertTriangle,
  Building2,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Search,
  ChevronRight,
  TrendingUp,
  Shield,
  Download,
  Share2,
} from 'lucide-react';

import {
  PatientProfile,
  UnifiedMedication,
  UnifiedCondition,
  UnifiedAllergy,
  UnifiedLabObservation,
  UnifiedEncounter,
  VerificationTier,
  PatientRecordStore,
} from '../types/fhir';
import { Users, UserPlus } from 'lucide-react';

interface HealthTimelineProps {
  patient: PatientProfile;
  medications: UnifiedMedication[];
  conditions: UnifiedCondition[];
  allergies: UnifiedAllergy[];
  observations: UnifiedLabObservation[];
  encounters: UnifiedEncounter[];
  onInspectDocument?: (docName: string) => void;
  onOpenShareModal?: (recordId: string) => void;
  onOpenExportModal?: () => void;
  onNavigateToTab?: (tab: any) => void;
  currentPatientId?: string;
  patientsDatabase?: Record<string, PatientRecordStore>;
  onSelectPatient?: (patientId: string) => void;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  patient,
  medications,
  conditions,
  allergies,
  observations,
  encounters,
  onInspectDocument,
  onOpenShareModal,
  onOpenExportModal,
  onNavigateToTab,
  currentPatientId,
  patientsDatabase,
  onSelectPatient,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'medication' | 'condition' | 'observation' | 'encounter'>('all');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique facilities
  const facilities = Array.from(
    new Set([
      ...medications.map((m) => m.prescribingFacility),
      ...conditions.map((c) => c.diagnosingFacility),
      ...observations.map((o) => o.performer),
      ...encounters.map((e) => e.hospitalName),
    ])
  ).filter(Boolean);

  // Build unified chronological timeline feed
  interface TimelineItem {
    id: string;
    type: 'medication' | 'condition' | 'observation' | 'encounter';
    date: string;
    title: string;
    subtitle: string;
    facility: string;
    doctorName?: string;
    tier: VerificationTier;
    confidence: number;
    details: string;
    tag?: string;
    isCritical?: boolean;
    sourceDoc?: string;
  }

  const timelineItems: TimelineItem[] = [
    ...medications.map((m) => ({
      id: m.id,
      type: 'medication' as const,
      date: m.prescribedDate,
      title: `${m.brandName} (${m.genericName})`,
      subtitle: `${m.strength} · ${m.dosageForm} · ${m.sigTranslated}`,
      facility: m.prescribingFacility,
      doctorName: m.prescribingDoctor,
      tier: m.provenance.tier,
      confidence: m.provenance.confidenceScore,
      details: `Active Ingredients: ${m.activeIngredients.map((a) => `${a.name} ${a.strengthMg}${a.unit}`).join(', ')}`,
      tag: m.therapeuticClass,
      sourceDoc: m.provenance.sourceDocumentName,
    })),
    ...conditions.map((c) => ({
      id: c.id,
      type: 'condition' as const,
      date: c.recordedDate,
      title: c.code.text,
      subtitle: `SNOMED: ${c.code.coding[0]?.code || '404684003'} · Status: ${c.clinicalStatus.toUpperCase()}`,
      facility: c.diagnosingFacility,
      doctorName: c.diagnosingDoctor,
      tier: c.provenance.tier,
      confidence: c.provenance.confidenceScore,
      details: c.notes || 'Documented in hospital clinical history',
      tag: 'Clinical Diagnosis',
      sourceDoc: c.provenance.sourceDocumentName,
    })),
    ...observations.map((o) => ({
      id: o.id,
      type: 'observation' as const,
      date: o.effectiveDate,
      title: `${o.testName}: ${o.value} ${o.unit}`,
      subtitle: `Reference: ${o.referenceRange.text} · LOINC: ${o.loincCode}`,
      facility: o.performer,
      tier: o.provenance.tier,
      confidence: o.provenance.confidenceScore,
      details: `Lab Panel: ${o.panelName}`,
      tag: o.interpretation.toUpperCase(),
      isCritical: o.interpretation === 'high' || o.interpretation === 'critical-high',
      sourceDoc: o.provenance.sourceDocumentName,
    })),
    ...encounters.map((e) => ({
      id: e.id,
      type: 'encounter' as const,
      date: e.date,
      title: `${e.encounterType} Consultation: ${e.reasonForVisit}`,
      subtitle: `${e.doctorName} · ${e.specialty}`,
      facility: e.hospitalName,
      doctorName: e.doctorName,
      tier: e.provenance.tier,
      confidence: e.provenance.confidenceScore,
      details: e.summary,
      tag: e.encounterType,
      sourceDoc: e.provenance.sourceDocumentName,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filtered timeline
  const filteredItems = timelineItems.filter((item) => {
    if (selectedCategory !== 'all' && item.type !== selectedCategory) return false;
    if (selectedFacility !== 'all' && item.facility !== selectedFacility) return false;
    if (selectedTier !== 'all' && item.tier !== selectedTier) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.facility.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getTierBadge = (tier: VerificationTier, confidence: number) => {
    switch (tier) {
      case 'provider-verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Hospital Verified ({confidence}%)</span>
          </span>
        );
      case 'ocr-human-confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patient Confirmed ({confidence}%)</span>
          </span>
        );
      case 'ocr-unconfirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>AI Pending Review ({confidence}%)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <span>Patient Self-Reported</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Patient Switcher Bar if database is provided */}
      {patientsDatabase && onSelectPatient && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/70 dark:bg-[#122B22]/70 rounded-2xl border border-[#3FA796]/30 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#3FA796]" />
            <span className="text-xs font-bold text-[#0F3D2E] dark:text-[#F4FAF3]">
              Active Health Profile:
            </span>
            <span className="text-xs text-[#4B6E60] dark:text-[#95BDB0]">
              Click to view another patient&apos;s records:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(patientsDatabase).map(([id, store]) => {
              const isSelected = id === currentPatientId || patient.id === store.patient.id;
              const p = store.patient;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectPatient(id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#3FA796] text-white shadow-sm ring-2 ring-[#3FA796]/40 scale-[1.02]'
                      : 'bg-[#F4FAF3] dark:bg-[#071711] text-[#0F3D2E] dark:text-[#F4FAF3] border border-[#3FA796]/20 hover:border-[#3FA796]/60'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#3FA796]/20 text-[#3FA796]'
                    }`}
                  >
                    {p.fullName.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <span>{p.fullName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {store.medications.length} meds
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Patient Unified Health Identity Strip */}
      <div className="bg-[var(--bg-card)] border border-[#3FA796]/25 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F3D2E] to-[#3FA796] flex items-center justify-center font-bold text-white text-xl shadow-md shadow-[#0F3D2E]/15">
            {patient.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-[#0F3D2E] dark:text-[#F4FAF3] tracking-tight">
                {patient.fullName}
              </h2>
              <span className="text-xs text-[#4B6E60] dark:text-[#95BDB0] font-mono px-2 py-0.5 rounded-full bg-[#3FA796]/15 font-semibold">
                {patient.age}y · {patient.gender.toUpperCase()} · Blood {patient.bloodGroup}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#4B6E60] dark:text-[#95BDB0]">
              <span className="font-mono font-bold text-[#3FA796] dark:text-[#B8E986]">
                ABHA: {patient.abhaId}
              </span>
              <span aria-hidden="true">·</span>
              <span>{patient.abhaAddress}</span>
              <span aria-hidden="true">·</span>
              <span>{patient.city}, India</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#E4572E] font-medium">
                {allergies.length > 0
                  ? `Allergies: ${allergies.map((a) => a.substance).join(', ')}`
                  : 'NKDA'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onOpenExportModal}
            className="px-3.5 py-2 text-xs font-semibold text-[#0F3D2E] dark:text-[#F4FAF3] bg-white/80 dark:bg-[#122B22] hover:bg-white dark:hover:bg-[#17382D] border border-[#3FA796]/30 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#3FA796]" />
            <span>Export FHIR & PDF</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateToTab?.('consent')}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0F3D2E] to-[#3FA796] hover:opacity-95 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-[#0F3D2E]/15"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Records</span>
          </button>
        </div>
      </div>

      {/* Longitudinal Glycemic & Blood Pressure Trend Glance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>HbA1c Trajectory</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">6.9%</span>
            <span className="text-xs text-emerald-400 font-medium">Down from 7.6% (In Control)</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Dr. Lal PathLabs · Tested 08-Oct-2026</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Resting Blood Pressure</span>
            <Activity className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">128/82</span>
            <span className="text-xs text-slate-400 font-mono">mmHg</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Apollo Hospitals · Target achieved on Telma-H</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Medications</span>
            <Pill className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{medications.length}</span>
            <span className="text-xs text-amber-400 font-medium">Across 4 Prescribers</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => onNavigateToTab?.('safety')}
              className="text-amber-400 hover:underline"
            >
              2 Clinical Alerts detected &rarr;
            </button>
          </p>
        </div>
      </div>

      {/* Filter Toolbar (Domain Guidelines: functional buttons, clean unboxed metadata) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Segmented Control */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          {(
            [
              { id: 'all', label: 'All Records' },
              { id: 'medication', label: 'Medications' },
              { id: 'condition', label: 'Diagnoses' },
              { id: 'observation', label: 'Lab Reports' },
              { id: 'encounter', label: 'Visits' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Provider Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 w-44"
            />
          </div>

          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Healthcare Providers</option>
            {facilities.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Verification Tiers</option>
            <option value="provider-verified">Hospital Verified</option>
            <option value="ocr-human-confirmed">Patient Confirmed</option>
            <option value="ocr-unconfirmed">AI Unconfirmed</option>
          </select>
        </div>
      </div>

      {/* Longitudinal Feed Cards */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">No records match the selected filter criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFacility('all');
                setSelectedTier('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-teal-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 tabular-nums">{item.date}</span>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span>{item.facility}</span>
                    </span>
                    {item.doctorName && (
                      <>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-xs text-slate-400">{item.doctorName}</span>
                      </>
                    )}
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    {getTierBadge(item.tier, item.confidence)}
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="text-xs text-slate-300">{item.subtitle}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.details}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                  {item.sourceDoc && (
                    <button
                      type="button"
                      onClick={() => onInspectDocument?.(item.sourceDoc!)}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-md transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-teal-400" />
                      <span>Source Scan</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenShareModal?.(item.id)}
                    className="p-1.5 text-slate-400 hover:text-teal-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors"
                    title="Share this record"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
