import React, { useState } from 'react';
import { ShieldCheck, Plus, AlertCircle, Share2, Sun, Moon, Mic, Menu, X } from 'lucide-react';
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const topNavTabs: {
    id: ActiveTabType;
    label: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
  }[] = [
    { id: 'timeline', label: 'Health Timeline' },
    { id: 'scanner', label: 'Prescription & Lab OCR' },
  ];

  const allNavTabs: {
    id: ActiveTabType;
    label: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
  }[] = [
    { id: 'timeline', label: 'Health Timeline' },
    { id: 'scanner', label: 'Prescription & Lab OCR' },
    {
      id: 'safety',
      label: 'Safety & Conflicts',
      badge:
        alertCount > 0 ? (
          <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-bold rounded-full bg-[#E4572E] text-white tabular-nums shadow-xs">
            {alertCount}
          </span>
        ) : null,
    },
    {
      id: 'consent',
      label: 'Consent & Share',
      badge:
        activeConsentCount > 0 ? (
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#2D6A4F]/15 dark:bg-[#52B788]/20 text-[#17483A] dark:text-[#C5E99B] border border-[#2D6A4F]/25 tabular-nums">
            {activeConsentCount} active
          </span>
        ) : null,
    },
    { id: 'emergency', label: 'Emergency Card' },
    { id: 'audit', label: 'Audit & DPDP', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  const handleTabClick = (id: ActiveTabType) => {
    setActiveTab(id);
    if (id === 'timeline') {
      setTimeout(() => {
        const el = document.getElementById('health-timeline-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMobileTabClick = (id: ActiveTabType) => {
    setActiveTab(id);
    setMobileNavOpen(false);
    if (id === 'timeline') {
      setTimeout(() => {
        const el = document.getElementById('health-timeline-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="relative flex items-center justify-between gap-3 md:gap-6 px-4 md:px-8 py-2.5 bg-[#FAF6EA]/95 dark:bg-[#0E2A21]/95 backdrop-blur-md border-b border-[#C9A24B]/35 text-[#1B2A22] dark:text-[#F3EBD3] sticky top-0 z-40 transition-colors shadow-xs">
      {/* Zone 1: Wordmark with Bulb Seed emblem + LIVE Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[#3FA796]/15 border border-[#C9A24B]/40 flex items-center justify-center text-[#3FA796] shadow-sm">
          <BulbSeedIcon size={22} />
        </div>
        <div className="flex items-baseline gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('timeline');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-editorial text-xl font-bold tracking-tight text-[#1B2A22] dark:text-[#F3EBD3] whitespace-nowrap hover:text-[#3FA796] transition-colors cursor-pointer"
          >
            MediScript
          </button>
          <span className="hidden sm:inline-block label-micro text-[#8F6E20] dark:text-[#C9A24B]">
            CONTINUITY PLATFORM
          </span>
        </div>

        {/* Small LIVE Badge with Pulsing Green Dot */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#7BC96F]/15 border border-[#7BC96F]/30 text-[10px] font-mono font-bold text-[#17483A] dark:text-[#C5E99B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7BC96F] animate-live-dot" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Zone 2: Minimal, compact top Nav menu (strictly Health Timeline & Prescription OCR) */}
      <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-medium">
        {topNavTabs.map(({ id, label, icon, badge }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleTabClick(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`px-3.5 py-1.5 min-h-[40px] rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'text-[#17483A] dark:text-[#F3EBD3] bg-[#17483A]/10 dark:bg-[#3FA796]/20 font-semibold shadow-xs ring-1 ring-[#C9A24B]/35'
                  : 'text-[#1E4D3B]/90 dark:text-[#A3C5B8] hover:text-[#0E2A21] dark:hover:text-[#F3EBD3] hover:bg-[#17483A]/5 dark:hover:bg-white/5'
              }`}
            >
              {icon}
              <span>{label}</span>
              {badge}
            </button>
          );
        })}
      </nav>

      {/* Mobile navigation dropdown: minimal, sleek, and fully accessible */}
      {mobileNavOpen && (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile Navigation"
          className="sm:hidden absolute top-full left-0 right-0 z-40 flex flex-col gap-1 border-b border-[#C9A24B]/35 bg-[#FAF6EA] dark:bg-[#0E2A21] p-3 shadow-xl backdrop-blur-md"
        >
          {allNavTabs.map(({ id, label, icon, badge }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleMobileTabClick(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center justify-between gap-3 px-3.5 min-h-[44px] rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#17483A]/15 text-[#17483A] dark:bg-[#3FA796]/20 dark:text-[#C5E99B] font-bold ring-1 ring-[#C9A24B]/30'
                    : 'text-[#1E4D3B] dark:text-[#A3C5B8] hover:bg-[#2D6A4F]/5 dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5 whitespace-nowrap">
                  {icon}
                  {label}
                </span>
                {badge}
              </button>
            );
          })}
        </nav>
      )}

      {/* Zone 3: Patient Profile Switcher + Voice + Actions + Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Mobile navigation toggle */}
        <button
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-nav-panel"
          className="sm:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#3FA796]/15 hover:bg-[#3FA796]/25 border border-[#3FA796]/30 text-[#0F3D2E] dark:text-[#B8E986] transition-colors"
          aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          title="Open navigation menu"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

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
            className="min-h-[44px] px-3 rounded-xl bg-[#3FA796]/15 hover:bg-[#3FA796]/25 border border-[#3FA796]/30 text-[#0F3D2E] dark:text-[#B8E986] transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Open Voice Companion"
            aria-label="Open Voice Companion"
          >
            <Mic className="w-4 h-4 text-[#3FA796]" />
            <span className="hidden sm:inline">Voice AI</span>
          </button>
        )}

        {/* Theme Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#122B22] border border-[#3FA796]/25 text-[#0F3D2E] dark:text-[#B8E986] hover:scale-105 active:scale-95 transition-all"
          title={isDarkMode ? 'Switch to warm cream light theme' : 'Switch to deep forest dark theme'}
          aria-label="Toggle light/dark theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[#B8E986]" /> : <Moon className="w-4 h-4 text-[#0F3D2E]" />}
        </button>

        {isDoctorViewMode ? (
          <button
            type="button"
            onClick={onExitDoctorView}
            className="min-h-[44px] px-3.5 py-1.5 text-xs font-bold text-white bg-[#E4572E] hover:bg-[#D0451C] rounded-xl transition-all whitespace-nowrap shrink-0 shadow-sm flex items-center"
          >
            Exit Doctor View
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenUpload}
            className="min-h-[44px] px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0F3D2E] via-[#1A4B3A] to-[#3FA796] rounded-xl hover:opacity-95 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-md shadow-[#0F3D2E]/15"
          >
            <Plus className="w-3.5 h-3.5 text-[#B8E986]" />
            <span>Add Record</span>
          </button>
        )}
      </div>
    </header>
  );
};
