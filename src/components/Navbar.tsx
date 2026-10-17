import React from 'react';
import { ShieldCheck, Plus, AlertCircle, Share2, Sun, Moon, Mic } from 'lucide-react';
import { BulbSeedIcon } from './BulbasaurThemeAssets';
import { PatientProfileSwitcher } from './PatientProfileSwitcher';
import { PatientProfile, PatientRecordStore } from '../types/fhir';

export type ActiveTabType =
  | 'timeline'
  | 'scanner'
  | 'safety'
  | 'consent'
  | 'emergency'
  | 'audit';

interface NavbarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  onOpenUpload: () => void;
  onOpenVoice?: () => void;
  alertCount: number;
  activeConsentCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isDoctorViewMode?: boolean;
  onExitDoctorView?: () => void;
  currentPatientId: string;
  patientsDatabase: Record<string, PatientRecordStore>;
  onSelectPatient: (patientId: string) => void;
  onCreatePatient: (newProfile: PatientProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenVoice,
  alertCount,
  activeConsentCount,
  isDarkMode,
  onToggleTheme,
  isDoctorViewMode,
  onExitDoctorView,
  currentPatientId,
  patientsDatabase,
  onSelectPatient,
  onCreatePatient,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3 bg-[#FAF6EA]/95 dark:bg-[#0E2A21]/95 backdrop-blur-md border-b border-[#C9A24B]/35 text-[#1B2A22] dark:text-[#F3EBD3] sticky top-0 z-40 transition-colors shadow-sm">
      {/* Zone 1: Wordmark with Bulb Seed emblem + LIVE Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[#3FA796]/15 border border-[#C9A24B]/40 flex items-center justify-center text-[#3FA796] shadow-sm">
          <BulbSeedIcon size={22} />
        </div>
        <div className="flex items-baseline gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className="font-editorial text-xl font-bold tracking-tight text-[#1B2A22] dark:text-[#F3EBD3] whitespace-nowrap hover:text-[#3FA796] transition-colors"
          >
            MediScript
          </button>
          <span className="hidden sm:inline-block label-micro text-[#C9A24B]">
            HERBARIUM
          </span>
        </div>

        {/* Small LIVE Badge with Pulsing Green Dot */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#7BC96F]/15 border border-[#7BC96F]/30 text-[10px] font-mono font-bold text-[#17483A] dark:text-[#C5E99B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7BC96F] animate-live-dot" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#4B6E60] dark:text-[#95BDB0]">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`hover:text-[#0F3D2E] dark:hover:text-[#F4FAF3] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'timeline'
              ? 'text-[#3FA796] border-b-2 border-[#3FA796] font-bold'
              : ''
          }`}
        >
          Health Timeline
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scanner')}
          className={`hover:text-[#0F3D2E] dark:hover:text-[#F4FAF3] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'scanner'
              ? 'text-[#3FA796] border-b-2 border-[#3FA796] font-bold'
              : ''
          }`}
        >
          Prescription & Lab OCR
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('safety')}
          className={`hover:text-[#0F3D2E] dark:hover:text-[#F4FAF3] transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeTab === 'safety'
              ? 'text-[#3FA796] border-b-2 border-[#3FA796] font-bold'
              : ''
          }`}
        >
          <span>Safety & Conflicts</span>
          {alertCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-[#E4572E] text-white tabular-nums shadow-sm">
              {alertCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('consent')}
          className={`hover:text-[#0F3D2E] dark:hover:text-[#F4FAF3] transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeTab === 'consent'
              ? 'text-[#3FA796] border-b-2 border-[#3FA796] font-bold'
              : ''
          }`}
        >
          <span>Consent & Share</span>
          {activeConsentCount > 0 && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded bg-[#3FA796]/20 text-[#3FA796] dark:text-[#B8E986] border border-[#3FA796]/30 tabular-nums">
              {activeConsentCount} active
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emergency')}
          className={`hover:text-[#0F3D2E] dark:hover:text-[#F4FAF3] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'emergency'
              ? 'text-[#3FA796] border-b-2 border-[#3FA796] font-bold'
              : ''
          }`}
        >
          Emergency Card
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`hover:text-[#0F3D2E] dark:hover:text-[#F4FAF3] transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'text-[#3FA796] border-b-2 border-[#3FA796] font-bold'
              : ''
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Audit & DPDP</span>
        </button>
      </nav>

      {/* Zone 3: Patient Profile Switcher + Voice + Actions + Theme Toggle */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Active Patient Profile Switcher */}
        <PatientProfileSwitcher
          currentPatientId={currentPatientId}
          patientsDatabase={patientsDatabase}
          onSelectPatient={onSelectPatient}
          onCreatePatient={onCreatePatient}
        />

        {/* Voice Companion trigger button */}
        {onOpenVoice && (
          <button
            type="button"
            onClick={onOpenVoice}
            className="p-2 rounded-xl bg-[#3FA796]/15 hover:bg-[#3FA796]/25 border border-[#3FA796]/30 text-[#0F3D2E] dark:text-[#B8E986] transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Open Voice Companion"
          >
            <Mic className="w-4 h-4 text-[#3FA796]" />
            <span className="hidden sm:inline">Voice AI</span>
          </button>
        )}

        {/* Theme Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#122B22] border border-[#3FA796]/25 text-[#0F3D2E] dark:text-[#B8E986] hover:scale-105 active:scale-95 transition-all"
          title={isDarkMode ? 'Switch to warm cream light theme' : 'Switch to deep forest dark theme'}
          aria-label="Toggle light/dark theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[#B8E986]" /> : <Moon className="w-4 h-4 text-[#0F3D2E]" />}
        </button>

        {isDoctorViewMode ? (
          <button
            type="button"
            onClick={onExitDoctorView}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#E4572E] hover:bg-[#D0451C] rounded-xl transition-all whitespace-nowrap shrink-0 shadow-sm"
          >
            Exit Doctor View
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenUpload}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0F3D2E] via-[#1A4B3A] to-[#3FA796] rounded-xl hover:opacity-95 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-md shadow-[#0F3D2E]/15"
          >
            <Plus className="w-3.5 h-3.5 text-[#B8E986]" />
            <span>Add Record</span>
          </button>
        )}
      </div>
    </header>
  );
};
