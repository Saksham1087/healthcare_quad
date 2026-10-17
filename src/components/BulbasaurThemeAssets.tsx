import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

/**
 * Split-Seed Opening Intro Animation Modal
 * Features two halves of an organic botanical bulb/seed pod that part to reveal the platform.
 * Includes "ENTER" CTA, skippable, remembers choice in localStorage, respects prefers-reduced-motion.
 */
export const SplitSeedIntroModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleEnter = () => {
    setIsOpening(true);
    localStorage.setItem('mediscript-herbarium-intro-seen', 'true');
    setTimeout(() => {
      onClose();
      setIsOpening(false);
    }, 700);
  };

  const handleSkip = () => {
    localStorage.setItem('mediscript-herbarium-intro-seen', 'true');
    onClose();
  };

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2A21]/95 backdrop-blur-md overflow-hidden font-sans transition-opacity duration-500"
    >
      {/* Background Vintage Botanical Lattice */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Main Seed Pod Vault Card */}
      <div className="relative max-w-xl w-full p-8 md:p-12 text-center rounded-3xl bg-[#FAF6EA] dark:bg-[#14372C] border-2 border-[#C9A24B] shadow-2xl space-y-6 overflow-hidden">
        {/* Corner Flourishes */}
        <div className="absolute top-3 left-3 text-[#C9A24B] opacity-60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M2 2h8v2H4v6H2V2z" fill="currentColor" />
            <circle cx="5" cy="5" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-3 right-3 text-[#C9A24B] opacity-60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22 2h-8v2h6v6h2V2z" fill="currentColor" />
            <circle cx="19" cy="5" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-3 left-3 text-[#C9A24B] opacity-60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M2 22h8v-2H4v-6H2v8z" fill="currentColor" />
            <circle cx="5" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-3 right-3 text-[#C9A24B] opacity-60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22 22h-8v-2h6v-6h2v8z" fill="currentColor" />
            <circle cx="19" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </div>

        {/* Skip button with 44x44px touch target & aria-label */}
        <button
          type="button"
          onClick={handleSkip}
          aria-label="Skip introduction"
          className="absolute top-3 right-3 min-w-[44px] min-h-[44px] px-3 flex items-center justify-center text-xs font-mono text-[#3D5A4C] dark:text-[#A3C5B8] hover:text-[#D9483B] dark:hover:text-[#D9483B] uppercase tracking-wider font-semibold transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA796]"
        >
          [ Skip Intro ]
        </button>

        {/* Top Field Guide Stamp */}
        <div className="space-y-1">
          <span className="label-micro text-[#8F6E20] dark:text-[#C9A24B] tracking-widest">
            VOLUME 1 · HEALTHCARE CONTINUITY
          </span>
          <p className="text-[11px] font-mono text-[#3D5A4C] dark:text-[#A3C5B8]">
            YEAR 2026 · DIGITAL HEALTH PLATFORM
          </p>
        </div>

        {/* Animated Split Seed Pod */}
        <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
          {/* Bioluminescent Core Glow */}
          <div className="absolute w-28 h-28 rounded-full bg-[#C5E99B]/30 blur-xl animate-pulse" />

          {/* Left Pod Half */}
          <div
            className={`absolute left-0 w-24 h-40 transition-transform duration-700 ease-out ${
              isOpening ? '-translate-x-12 -rotate-12 opacity-0' : 'translate-x-0 rotate-0'
            }`}
          >
            <svg viewBox="0 0 100 160" fill="none" className="w-full h-full drop-shadow-md">
              <path
                d="M95 10C50 25 10 70 10 110C10 140 45 155 95 155C92 130 92 35 95 10Z"
                fill="url(#podLeftGrad)"
                stroke="#0E2A21"
                strokeWidth="2.5"
              />
              <path
                d="M95 30C65 45 35 80 35 110C35 130 60 140 95 140"
                stroke="#C9A24B"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle cx="50" cy="95" r="4" fill="#C5E99B" opacity="0.8" />
              <circle cx="35" cy="115" r="3" fill="#7BC96F" opacity="0.8" />
              <defs>
                <linearGradient id="podLeftGrad" x1="10" y1="10" x2="95" y2="155" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3FA796" />
                  <stop offset="0.7" stopColor="#17483A" />
                  <stop offset="1" stopColor="#0E2A21" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Right Pod Half */}
          <div
            className={`absolute right-0 w-24 h-40 transition-transform duration-700 ease-out ${
              isOpening ? 'translate-x-12 rotate-12 opacity-0' : 'translate-x-0 rotate-0'
            }`}
          >
            <svg viewBox="0 0 100 160" fill="none" className="w-full h-full drop-shadow-md">
              <path
                d="M5 10C50 25 90 70 90 110C90 140 55 155 5 155C8 130 8 35 5 10Z"
                fill="url(#podRightGrad)"
                stroke="#0E2A21"
                strokeWidth="2.5"
              />
              <path
                d="M5 30C35 45 65 80 65 110C65 130 40 140 5 140"
                stroke="#C9A24B"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle cx="50" cy="95" r="4" fill="#C5E99B" opacity="0.8" />
              <circle cx="65" cy="115" r="3" fill="#7BC96F" opacity="0.8" />
              <defs>
                <linearGradient id="podRightGrad" x1="90" y1="10" x2="5" y2="155" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3FA796" />
                  <stop offset="0.7" stopColor="#17483A" />
                  <stop offset="1" stopColor="#0E2A21" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Inner Sprouting Seed Heart (Unveiled upon click) */}
          <div className="relative z-10 w-16 h-16 flex items-center justify-center">
            <BulbSeedIcon size={42} className="animate-pod-pulse" />
          </div>
        </div>

        {/* Title and Editorial Subtitle */}
        <div className="space-y-2">
          <h2 id="intro-modal-title" className="font-editorial text-3xl md:text-4xl font-bold tracking-tight text-[#1B2A22] dark:text-[#F3EBD3]">
            MediScript Continuity Platform
          </h2>
          <div className="w-32 h-[1px] bg-[#C9A24B] mx-auto opacity-70" />
          <p className="text-xs md:text-sm text-[#3D5A4C] dark:text-[#A3C5B8] max-w-md mx-auto leading-relaxed">
            The Living Healthcare Continuity Platform. Uniting medical records, multimodal prescription deciphering, and sovereign patient consent into one unified history.
          </p>
        </div>

        {/* Ornate Enter Button with 44px+ touch target */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleEnter}
            aria-label="Enter MediScript platform"
            className="group relative inline-flex items-center justify-center gap-3 px-8 min-h-[44px] py-3.5 rounded-2xl bg-gradient-to-r from-[#0E2A21] via-[#17483A] to-[#3FA796] text-[#F3EBD3] font-editorial text-lg font-bold tracking-wider hover:shadow-xl hover:shadow-[#0E2A21]/30 active:scale-95 transition-all border border-[#C9A24B]"
          >
            <span>ENTER MEDISCRIPT</span>
            <ArrowRight className="w-4 h-4 text-[#C5E99B] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Original Handcrafted Plant-Creature Mascot ("Folia-Saur")
 * Inspired by a gentle green quadruped botanical companion carrying a sprouting medicinal bulb.
 * 100% original SVG vector geometry, no official trademarked assets.
 */
export const FoliaSaurMascotIllustration: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = 'w-48 h-48', size = 192 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Folia-Saur Original Plant Companion Mascot"
      role="img"
    >
      {/* Soft Ground Shadow */}
      <ellipse cx="100" cy="178" rx="64" ry="14" fill="#0E2A21" fillOpacity="0.2" />

      {/* Rear Left Foot */}
      <path
        d="M62 145 C60 160 58 174 68 175 C75 175 78 165 76 148 Z"
        fill="#17483A"
        stroke="#0E2A21"
        strokeWidth="2"
      />
      {/* Rear Right Foot */}
      <path
        d="M138 145 C140 160 142 174 132 175 C125 175 122 165 124 148 Z"
        fill="#17483A"
        stroke="#0E2A21"
        strokeWidth="2"
      />

      {/* Main Body Torso (Jade Teal Bulbasaur Skin Tone #3FA796) */}
      <path
        d="M55 125 C45 95 70 70 100 70 C130 70 155 95 145 125 C142 155 130 168 100 168 C70 168 58 155 55 125 Z"
        fill="url(#mascotSkinGrad)"
        stroke="#0E2A21"
        strokeWidth="2.5"
      />

      {/* Organic Botanical Leaf Spots */}
      <path
        d="M68 115 C62 110 65 102 72 106 C78 110 74 120 68 115 Z"
        fill="#17483A"
        opacity="0.8"
      />
      <path
        d="M82 135 C76 130 78 122 86 125 C92 128 88 140 82 135 Z"
        fill="#17483A"
        opacity="0.75"
      />
      <path
        d="M132 115 C138 110 135 102 128 106 C122 110 126 120 132 115 Z"
        fill="#17483A"
        opacity="0.8"
      />

      {/* Back Bulb / Medicinal Seed Pod */}
      <g transform="translate(0, -6)">
        {/* Outer Bulb Petals */}
        <path
          d="M100 28 C125 28 145 52 140 82 C135 102 118 112 100 112 C82 112 65 102 60 82 C55 52 75 28 100 28 Z"
          fill="url(#mascotBulbGrad)"
          stroke="#0E2A21"
          strokeWidth="2.5"
        />
        {/* Central Sprouting Petal / Bulb-Red Accent */}
        <path
          d="M100 40 C114 40 125 58 122 78 C118 92 108 98 100 98 C92 98 82 92 78 78 C75 58 86 40 100 40 Z"
          fill="#D9483B"
          opacity="0.9"
        />
        {/* Tender Sprout Leaf Shoot on top */}
        <path
          d="M100 28 C92 10 72 16 68 28 C74 36 90 34 100 28 Z"
          fill="#7BC96F"
          stroke="#0E2A21"
          strokeWidth="1.5"
        />
        <path
          d="M100 28 C108 10 128 16 132 28 C126 36 110 34 100 28 Z"
          fill="#C5E99B"
          stroke="#0E2A21"
          strokeWidth="1.5"
        />
        {/* Tendril Vines curling from bulb */}
        <path
          d="M72 82 C60 78 48 85 45 95 C43 102 48 108 55 104"
          stroke="#7BC96F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M128 82 C140 78 152 85 155 95 C157 102 152 108 145 104"
          stroke="#7BC96F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Head & Leaf Ears */}
      {/* Left Leaf Ear */}
      <path
        d="M70 82 C56 68 54 52 64 54 C74 56 76 70 70 82 Z"
        fill="#7BC96F"
        stroke="#0E2A21"
        strokeWidth="1.8"
      />
      {/* Right Leaf Ear */}
      <path
        d="M130 82 C144 68 146 52 136 54 C126 56 124 70 130 82 Z"
        fill="#7BC96F"
        stroke="#0E2A21"
        strokeWidth="1.8"
      />

      {/* Friendly Eyes */}
      <ellipse cx="84" cy="106" rx="6" ry="8" fill="#0E2A21" />
      <circle cx="86" cy="104" r="2.5" fill="#FFFFFF" />
      <ellipse cx="116" cy="106" rx="6" ry="8" fill="#0E2A21" />
      <circle cx="118" cy="104" r="2.5" fill="#FFFFFF" />

      {/* Gentle Smiling Snout */}
      <path
        d="M93 120 C97 124 103 124 107 120"
        stroke="#0E2A21"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Front Feet */}
      {/* Front Left Foot */}
      <path
        d="M72 150 C70 166 68 178 80 178 C88 178 90 168 88 152 Z"
        fill="#3FA796"
        stroke="#0E2A21"
        strokeWidth="2"
      />
      {/* Front Right Foot */}
      <path
        d="M128 150 C130 166 132 178 120 178 C112 178 110 168 112 152 Z"
        fill="#3FA796"
        stroke="#0E2A21"
        strokeWidth="2"
      />

      {/* Toes Claws Accent */}
      <circle cx="74" cy="177" r="1.5" fill="#FAF6EA" />
      <circle cx="80" cy="178" r="1.5" fill="#FAF6EA" />
      <circle cx="120" cy="178" r="1.5" fill="#FAF6EA" />
      <circle cx="126" cy="177" r="1.5" fill="#FAF6EA" />

      <defs>
        <linearGradient id="mascotSkinGrad" x1="60" y1="70" x2="140" y2="168" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4CB8A4" />
          <stop offset="0.5" stopColor="#3FA796" />
          <stop offset="1" stopColor="#17483A" />
        </linearGradient>
        <linearGradient id="mascotBulbGrad" x1="70" y1="28" x2="130" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7BC96F" />
          <stop offset="0.6" stopColor="#3FA796" />
          <stop offset="1" stopColor="#0E2A21" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/**
 * Original Bulbasaur-inspired plant bulb icon.
 */
export const BulbSeedIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size = 24,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Glow / Seed Base */}
      <path
        d="M16 28C22.6274 28 27 23.2 27 17.5C27 12.2 21.8 7 16 4C10.2 7 5 12.2 5 17.5C5 23.2 9.37258 28 16 28Z"
        fill="url(#bulbaBulbGrad)"
        stroke="#0E2A21"
        strokeWidth="1.5"
      />
      {/* Seed Core Accent in warm red-pink #D9483B */}
      <path
        d="M16 25C19.3137 25 21.5 21.8 21.5 18C21.5 14.5 18.2 10.8 16 9C13.8 10.8 10.5 14.5 10.5 18C10.5 21.8 12.6863 25 16 25Z"
        fill="#D9483B"
        opacity="0.9"
      />
      {/* Sprouting Tender Leaves on Top */}
      <path
        d="M16 4C14 1.5 10 2 9 4.5C8 7 11.5 8 16 4Z"
        fill="#7BC96F"
        stroke="#0E2A21"
        strokeWidth="1"
      />
      <path
        d="M16 4C18 1.5 22 2 23 4.5C24 7 20.5 8 16 4Z"
        fill="#C5E99B"
        stroke="#0E2A21"
        strokeWidth="1"
      />
      <ellipse cx="12" cy="14" rx="2" ry="4" transform="rotate(-25 12 14)" fill="#FFFFFF" opacity="0.4" />
      <defs>
        <linearGradient id="bulbaBulbGrad" x1="5" y1="4" x2="27" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3FA796" />
          <stop offset="0.6" stopColor="#17483A" />
          <stop offset="1" stopColor="#0E2A21" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/**
 * Natural Vine Curved Divider SVG
 */
export const VineDivider: React.FC<{ className?: string }> = ({ className = 'w-full h-4 text-[#3FA796]/40' }) => {
  return (
    <svg
      viewBox="0 0 1200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 12C150 20 300 4 450 12C600 20 750 4 900 12C1050 20 1125 8 1200 12"
        stroke="#C9A24B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Leaf buds along the vine */}
      <path d="M220 15C225 10 235 12 232 18C228 17 222 17 220 15Z" fill="#7BC96F" />
      <path d="M520 9C525 4 535 6 532 12C528 11 522 11 520 9Z" fill="#C5E99B" />
      <path d="M820 15C825 10 835 12 832 18C828 17 822 17 820 15Z" fill="#7BC96F" />
      <circle cx="450" cy="12" r="2.5" fill="#D9483B" />
      <circle cx="900" cy="12" r="2.5" fill="#D9483B" />
    </svg>
  );
};

/**
 * Growing Sprout Animated Loader
 */
export const ThemedSproutLoader: React.FC<{ label?: string }> = ({ label = 'Loading clinical medical records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#3FA796]/20 animate-ping opacity-60" />
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0E2A21] via-[#17483A] to-[#3FA796] p-2.5 shadow-lg shadow-[#0E2A21]/20 flex items-center justify-center animate-sprout border border-[#C9A24B]">
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#C5E99B]" stroke="currentColor" strokeWidth="2">
            <path d="M7 20h10" strokeLinecap="round" />
            <path d="M12 20v-8" strokeLinecap="round" />
            <path d="M12 12c-3-2-6-1-7 2 2 1 5 0 7-2z" fill="#7BC96F" fillOpacity="0.8" />
            <path d="M12 9c3-2 6-1 7 2-2 1-5 0-7-2z" fill="#C5E99B" fillOpacity="0.9" />
          </svg>
        </div>
      </div>
      <p className="text-xs font-mono font-bold text-[#1E6556] dark:text-[#C5E99B] tracking-wide uppercase">
        {label}
      </p>
    </div>
  );
};

/**
 * Organic decorative background blob for Hero & Sections
 */
export const OrganicBackgroundBlobs: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-70 dark:opacity-25">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#3FA796]/15 blur-3xl" />
      <div className="absolute top-1/4 -right-28 w-80 h-80 rounded-full bg-[#7BC96F]/15 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-[#C9A24B]/10 blur-3xl" />
    </div>
  );
};
