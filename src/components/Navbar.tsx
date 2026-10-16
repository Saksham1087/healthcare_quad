import React from 'react';
import { ShieldCheck, Plus, AlertCircle, Share2, HeartPulse } from 'lucide-react';

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
  alertCount: number;
  activeConsentCount: number;
  isDoctorViewMode?: boolean;
  onExitDoctorView?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  alertCount,
  activeConsentCount,
  isDoctorViewMode,
  onExitDoctorView,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
          <HeartPulse className="w-4 h-4" />
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap hover:text-teal-300 transition-colors"
        >
          MediScript
        </button>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'timeline'
              ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
              : 'text-slate-400'
          }`}
        >
          Health Timeline
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scanner')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'scanner'
              ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
              : 'text-slate-400'
          }`}
        >
          Prescription & Lab OCR
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('safety')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeTab === 'safety'
              ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
              : 'text-slate-400'
          }`}
        >
          <span>Safety & Conflicts</span>
          {alertCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 tabular-nums">
              {alertCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('consent')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeTab === 'consent'
              ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
              : 'text-slate-400'
          }`}
        >
          <span>Consent & Share</span>
          {activeConsentCount > 0 && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 tabular-nums">
              {activeConsentCount} active
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emergency')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'emergency'
              ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
              : 'text-slate-400'
          }`}
        >
          Emergency Card
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
              : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Audit & Privacy</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {isDoctorViewMode ? (
          <button
            type="button"
            onClick={onExitDoctorView}
            className="px-3.5 py-1.5 text-xs font-semibold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 rounded-lg transition-all whitespace-nowrap shrink-0"
          >
            Exit Doctor View
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenUpload}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-teal-400 rounded-lg hover:bg-teal-300 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-teal-900/30"
          >
            <Plus className="w-3.5 h-3.5 text-slate-900" />
            <span>Add Record</span>
          </button>
        )}
      </div>
    </header>
  );
};
