import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  FileCheck,
  Mic,
  Activity,
  ArrowRight,
  Sun,
  Moon,
  Leaf,
  Layers,
  FileText,
  Lock,
  Heart,
  ChevronDown,
  Plus,
  Minus,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import {
  BulbSeedIcon,
  OrganicBackgroundBlobs,
  VineDivider,
  FoliaSaurMascotIllustration,
} from './BulbasaurThemeAssets';

interface HeroLandingSectionProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenScan: () => void;
  onOpenVoice: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const HeroLandingSection: React.FC<HeroLandingSectionProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenScan,
  onOpenVoice,
  onNavigateToTab,
}) => {
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqItems = [
    {
      q: 'How does MediScript organize fragmented records across multiple hospitals?',
      a: 'Using India NRCES and HL7 FHIR R4 interoperability standards, MediScript normalizes outpatient records, discharge summaries, and lab diagnostic reports from Apollo, Max, Fortis, and neighborhood clinics into one unified longitudinal root timeline under the patient\'s ABHA account.',
    },
    {
      q: 'How does the Gemini Multimodal OCR preserve clinician safety?',
      a: 'The vision engine maps normalized [ymin, xmin, ymax, xmax] coordinates to each written prescription line, pairing OCR transcription with token confidence scores and Indian pharmacopeia cross-referencing to eliminate Look-Alike Sound-Alike (LASA) errors.',
    },
    {
      q: 'What is the "Night Garden" and "Herbarium" visual philosophy?',
      a: 'Inspired by botanical field encyclopedias and the Bulbasaur flora palette, MediScript treats health history not as cold static files, but as a living specimen tree that requires continuous cultivation, clear provenance, and sovereign protection.',
    },
    {
      q: 'Can patients revoke doctor access or delete data under the DPDP Act 2023?',
      a: 'Yes. Every ephemeral consent link generated has a strict purpose constraint, optional 4-digit PIN, and can be revoked in one tap. Under DPDP Act Section 12, patients can also simulate cryptographic key shredding for sovereign erasure.',
    },
  ];

  return (
    <div className="space-y-10 font-sans">
      {/* SECTION 1: INDEX RERUM · HERO FIELD-GUIDE BANNER */}
      <div className="relative overflow-hidden rounded-3xl specimen-card p-6 md:p-10 shadow-xl transition-all duration-300">
        <OrganicBackgroundBlobs />

        {/* Top Field Plate Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C9A24B]/30 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="label-micro text-[#C9A24B]">
              INDEX RERUM · TABULA CONTINUITATIS
            </span>
            <span className="text-slate-400 font-mono text-[10px]">·</span>
            <span className="text-[11px] font-mono text-[#3D5A4C] dark:text-[#A3C5B8]">
              HERBARIUM CLINICUM MMXXVI
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Indicator */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7BC96F]/15 border border-[#7BC96F]/30 text-[10px] font-mono font-bold text-[#17483A] dark:text-[#C5E99B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7BC96F] animate-live-dot" />
              <span>NEXUS VIVUS</span>
            </div>

            {/* Dark / Night Garden Switcher */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl bg-[#FAF6EA] dark:bg-[#0E2A21] border border-[#C9A24B]/40 text-[#1B2A22] dark:text-[#C5E99B] hover:scale-105 transition-transform flex items-center gap-1 text-[11px] font-mono font-bold"
              title="Toggle Night Garden / Aged Parchment Theme"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#C5E99B]" />
                  <span>NOCTIS</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#1B2A22]" />
                  <span>HERBARIUM</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left 8 Cols: Serif Headline & Naturalist Philosophy */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3FA796]/15 border border-[#C9A24B]/40 text-[#0E2A21] dark:text-[#C5E99B] text-xs font-semibold">
              <BulbSeedIcon size={16} />
              <span className="font-editorial text-sm tracking-wide">
                Living Healthcare Continuity · Cultivated for India
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B2A22] dark:text-[#F3EBD3] leading-[1.08]">
              One living medical history.{' '}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#17483A] via-[#3FA796] to-[#7BC96F] dark:from-[#3FA796] dark:via-[#7BC96F] dark:to-[#C5E99B]">
                Rooted in trust.
              </span>
            </h1>

            <p className="text-sm md:text-base text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed max-w-2xl font-sans">
              Your health records are scattered across hospitals, clinics, labs, and pharmacies. MediScript gathers every prescription, lab panel, and allergy into an unbroken botanical ledger with verified provenance, AI vision deciphering, and sovereign consent.
            </p>

            {/* Natural Vine Curved Divider */}
            <div className="py-1">
              <VineDivider className="w-full h-3 text-[#3FA796]/30" />
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenScan}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#0E2A21] via-[#17483A] to-[#3FA796] text-[#F3EBD3] font-editorial text-base font-bold hover:shadow-lg hover:shadow-[#0E2A21]/20 active:scale-[0.98] transition-all flex items-center gap-2 border border-[#C9A24B]"
              >
                <FileCheck className="w-4 h-4 text-[#C5E99B]" />
                <span>Cultivate Prescription Script</span>
              </button>

              <button
                type="button"
                onClick={onOpenVoice}
                className="px-5 py-3 rounded-2xl bg-[#3FA796] hover:bg-[#4CB8A4] text-white font-editorial text-base font-bold hover:shadow-lg hover:shadow-[#3FA796]/30 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Mic className="w-4 h-4 text-[#FAF6EA]" />
                <span>Speak to SaurAssistant Voice</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab('emergency')}
                className="px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-[#D9483B]/40 text-[#D9483B] font-editorial text-sm font-bold transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Offline Emergency Pass</span>
              </button>
            </div>
          </div>

          {/* Right 4 Cols: Naturalist Specimen Emblem Card */}
          <div className="lg:col-span-4 bg-[#FAF6EA]/90 dark:bg-[#14372C]/90 border-2 border-[#C9A24B]/40 rounded-2xl p-5 space-y-4 shadow-lg text-center relative">
            <div className="label-micro text-[#C9A24B]">SPECIMEN HERBARIUM NO. 001</div>
            
            {/* Mascot Preview */}
            <div className="flex justify-center py-1">
              <FoliaSaurMascotIllustration size={130} />
            </div>

            <div className="space-y-1">
              <h3 className="font-editorial text-xl font-bold text-[#1B2A22] dark:text-[#F3EBD3]">
                Folia-Saur Guardian
              </h3>
              <p className="text-[11px] font-mono text-[#3D5A4C] dark:text-[#A3C5B8]">
                Bioluminescent Herbarium Mascot
              </p>
            </div>

            <div className="gold-rule" />

            <div className="text-[11px] font-mono text-left space-y-1.5 text-[#3D5A4C] dark:text-[#A3C5B8]">
              <div className="flex justify-between">
                <span>Core Registry:</span>
                <span className="font-bold text-[#1B2A22] dark:text-[#F3EBD3]">HL7 FHIR R4</span>
              </div>
              <div className="flex justify-between">
                <span>Data Residency:</span>
                <span className="font-bold text-[#3FA796]">India Sovereign (ABDM)</span>
              </div>
              <div className="flex justify-between">
                <span>Safety Invariants:</span>
                <span className="font-bold text-[#7BC96F]">Deterministic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SPECIMEN PLATES (FEATURE CARDS) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#C9A24B]/30 pb-2">
          <div>
            <span className="label-micro text-[#C9A24B]">TABULAE SPECIMINUM</span>
            <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#1B2A22] dark:text-[#F3EBD3]">
              Four Pillars of Continuous Care
            </h2>
          </div>
          <span className="text-xs font-mono text-[#3D5A4C] dark:text-[#A3C5B8]">
            [ Field Plates I through IV ]
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* PLATE I */}
          <div
            onClick={() => onNavigateToTab('timeline')}
            className="specimen-card rounded-2xl p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-[#C9A24B]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="label-micro text-[#C9A24B]">PLATE I</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3FA796]/15 text-[#17483A] dark:text-[#C5E99B]">
                  #Continuity
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#3FA796]/15 border border-[#C9A24B]/30 flex items-center justify-center text-[#3FA796] group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#1B2A22] dark:text-[#F3EBD3] group-hover:text-[#3FA796] transition-colors">
                Longitudinal Root Timeline
              </h3>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
                Connects Apollo, Max, Fortis, and local clinics into one chronologically coherent root history with multi-tier provenance scoring.
              </p>
            </div>
            <div className="pt-4 border-t border-[#C9A24B]/20 flex items-center justify-between text-xs font-mono font-bold text-[#3FA796]">
              <span>Inspect Timeline</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* PLATE II */}
          <div
            onClick={() => onNavigateToTab('scanner')}
            className="specimen-card rounded-2xl p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-[#C9A24B]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="label-micro text-[#C9A24B]">PLATE II</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3FA796]/15 text-[#17483A] dark:text-[#C5E99B]">
                  #MultimodalOCR
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#3FA796]/15 border border-[#C9A24B]/30 flex items-center justify-center text-[#3FA796] group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#1B2A22] dark:text-[#F3EBD3] group-hover:text-[#3FA796] transition-colors">
                Doctor Script Deciphering
              </h3>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
                Gemini Vision OCR maps cursive physician scrawls into normalized 2D coordinate boxes with token confidence and Latin Sig translation.
              </p>
            </div>
            <div className="pt-4 border-t border-[#C9A24B]/20 flex items-center justify-between text-xs font-mono font-bold text-[#3FA796]">
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* PLATE III */}
          <div
            onClick={() => onNavigateToTab('safety')}
            className="specimen-card rounded-2xl p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-[#C9A24B]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="label-micro text-[#C9A24B]">PLATE III</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3FA796]/15 text-[#17483A] dark:text-[#C5E99B]">
                  #SafetyInvariants
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#3FA796]/15 border border-[#C9A24B]/30 flex items-center justify-center text-[#D9483B] group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#1B2A22] dark:text-[#F3EBD3] group-hover:text-[#D9483B] transition-colors">
                Pharmacology Safety Layer
              </h3>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
                Detects accidental duplicate active molecules (e.g. Paracetamol in Combiflam vs Dolo) and cross-checks beta-lactam drug allergies.
              </p>
            </div>
            <div className="pt-4 border-t border-[#C9A24B]/20 flex items-center justify-between text-xs font-mono font-bold text-[#D9483B]">
              <span>Review Conflicts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* PLATE IV */}
          <div
            onClick={() => onNavigateToTab('consent')}
            className="specimen-card rounded-2xl p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:border-[#C9A24B]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="label-micro text-[#C9A24B]">PLATE IV</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3FA796]/15 text-[#17483A] dark:text-[#C5E99B]">
                  #SovereignConsent
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#3FA796]/15 border border-[#C9A24B]/30 flex items-center justify-center text-[#7BC96F] group-hover:scale-105 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#1B2A22] dark:text-[#F3EBD3] group-hover:text-[#7BC96F] transition-colors">
                Ephemeral Doctor View
              </h3>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
                Generate 15-minute PIN-protected zero-friction QR links for visiting physicians with instant revocation and DPDP Act audit logging.
              </p>
            </div>
            <div className="pt-4 border-t border-[#C9A24B]/20 flex items-center justify-between text-xs font-mono font-bold text-[#7BC96F]">
              <span>Generate Share</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: METHODUS CONTINUITATIS (TIMELINE PROCESS SECTION) */}
      <div className="specimen-card rounded-3xl p-6 md:p-8 space-y-6">
        <div className="border-b border-[#C9A24B]/30 pb-3 flex items-baseline justify-between">
          <div>
            <span className="label-micro text-[#C9A24B]">METHODUS OPERANDI</span>
            <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#1B2A22] dark:text-[#F3EBD3]">
              The Lifecycle of a Clinical Record
            </h2>
          </div>
          <span className="text-xs font-mono text-[#3D5A4C] dark:text-[#A3C5B8]">
            Ingest · Verify · Harmonize · Share
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="space-y-2 relative">
            <div className="w-10 h-10 rounded-full bg-[#3FA796]/20 border-2 border-[#C9A24B] flex items-center justify-center font-mono font-bold text-sm text-[#0E2A21] dark:text-[#C5E99B]">
              01
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#1B2A22] dark:text-[#F3EBD3]">
              Ingestion from Any Source
            </h4>
            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
              Patient photos via WhatsApp, PDF lab downloads from Dr. Lal PathLabs, or hospital discharge summaries.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2 relative">
            <div className="w-10 h-10 rounded-full bg-[#3FA796]/20 border-2 border-[#C9A24B] flex items-center justify-center font-mono font-bold text-sm text-[#0E2A21] dark:text-[#C5E99B]">
              02
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#1B2A22] dark:text-[#F3EBD3]">
              Multimodal Vision Parsing
            </h4>
            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
              Gemini Vision AI extracts dosages, frequency, Latin Sig notation, and doctor identifiers into structured FHIR resources.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2 relative">
            <div className="w-10 h-10 rounded-full bg-[#3FA796]/20 border-2 border-[#C9A24B] flex items-center justify-center font-mono font-bold text-sm text-[#0E2A21] dark:text-[#C5E99B]">
              03
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#1B2A22] dark:text-[#F3EBD3]">
              Human Review &amp; Profiling
            </h4>
            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
              The patient confirms the extraction against the visual script bounding boxes and assigns records to their respective family profile.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-2 relative">
            <div className="w-10 h-10 rounded-full bg-[#3FA796]/20 border-2 border-[#C9A24B] flex items-center justify-center font-mono font-bold text-sm text-[#0E2A21] dark:text-[#C5E99B]">
              04
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#1B2A22] dark:text-[#F3EBD3]">
              Purpose-Limited Access
            </h4>
            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
              Records are shared ephemerally with attending doctors or made accessible during acute ER emergencies via verified break-glass.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: CHRONICA & ANNOTATIONES (NATURALIST'S FIELD LEDGER) */}
      <div className="specimen-card rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#C9A24B]/30 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C9A24B]" />
            <span className="label-micro text-[#C9A24B]">
              CHRONICA &amp; ANNOTATIONES · NATURALIST&apos;S LEDGER
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#3D5A4C] dark:text-[#A3C5B8]">
            VERIFIED PROVENANCE AUDIT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#FAF6EA] dark:bg-[#0E2A21] border border-[#C9A24B]/30 space-y-1">
            <span className="text-[10px] text-[#C9A24B] block uppercase tracking-wider">Provenance Tier 3</span>
            <p className="font-bold text-[#1B2A22] dark:text-[#F3EBD3]">Hospital EMR Cryptographic Signatures</p>
            <p className="text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8]">Direct bridge from Fortis &amp; Max Super Speciality bridges.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6EA] dark:bg-[#0E2A21] border border-[#C9A24B]/30 space-y-1">
            <span className="text-[10px] text-[#C9A24B] block uppercase tracking-wider">Provenance Tier 2</span>
            <p className="font-bold text-[#1B2A22] dark:text-[#F3EBD3]">OCR-Human Confirmed Records</p>
            <p className="text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8]">Scanned via Gemini Vision and verified line-by-line by patient.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6EA] dark:bg-[#0E2A21] border border-[#C9A24B]/30 space-y-1">
            <span className="text-[10px] text-[#C9A24B] block uppercase tracking-wider">Provenance Tier 1</span>
            <p className="font-bold text-[#1B2A22] dark:text-[#F3EBD3]">Patient Self-Reported Logs</p>
            <p className="text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8]">Symptom notes and historical allergies entered without original script.</p>
          </div>
        </div>
      </div>

      {/* SECTION 5: QUAESTIONES FREQUENTES (FAQ ACCORDION) */}
      <div className="specimen-card rounded-3xl p-6 md:p-8 space-y-4">
        <div className="border-b border-[#C9A24B]/30 pb-3">
          <span className="label-micro text-[#C9A24B]">QUAESTIONES FREQUENTES</span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#1B2A22] dark:text-[#F3EBD3]">
            Frequently Answered Questions
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#C9A24B]/30 bg-[#FAF6EA] dark:bg-[#0E2A21] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-editorial text-lg font-bold text-[#1B2A22] dark:text-[#F3EBD3] hover:text-[#3FA796] transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#3FA796]/15 text-[#3FA796] shrink-0">
                    {isOpen ? '[-]' : '[+]'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs md:text-sm text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed border-t border-[#C9A24B]/20 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 6: EXEMPLAR HERBARIUM · THE FOLIA-SAUR GUARDIAN (BIG FINAL CTA) */}
      <div className="specimen-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden bg-gradient-to-b from-[#FAF6EA] to-[#EFE6CD] dark:from-[#14372C] dark:to-[#0E2A21] border-2 border-[#C9A24B] space-y-6">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="label-micro text-[#C9A24B]">EXEMPLAR HERBARIUM NO. 001</span>
          
          <div className="flex justify-center my-2">
            <FoliaSaurMascotIllustration size={160} />
          </div>

          <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#1B2A22] dark:text-[#F3EBD3]">
            Begin Cultivating Your Sovereign Health History
          </h2>
          <p className="text-xs md:text-sm text-[#3D5A4C] dark:text-[#A3C5B8] max-w-lg mx-auto leading-relaxed">
            Scan your first prescription or speak to SaurAssistant in English, Hindi, or Marathi to harmonize your care records today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={onOpenScan}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0E2A21] via-[#17483A] to-[#3FA796] text-[#F3EBD3] font-editorial text-base font-bold shadow-md hover:shadow-lg hover:shadow-[#0E2A21]/30 transition-all border border-[#C9A24B] flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4 text-[#C5E99B]" />
              <span>Transcribe Clinical Paper</span>
            </button>
            <button
              type="button"
              onClick={onOpenVoice}
              className="px-6 py-3 rounded-2xl bg-[#3FA796] hover:bg-[#4CB8A4] text-white font-editorial text-base font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Voice Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
