# MediScript (Healthcare AGY) 🌿

> **Longitudinal Healthcare Continuity Platform & Trilingual Voice Health Companion**  
> *ABDM Milestone M1–M3 & DPDP Act 2023 Sovereign Encryption*

MediScript unifies handwritten doctor prescriptions, multi-family health vaults, and trilingual voice-to-voice AI into an **Editorial Vintage Natural-History** interface inspired by a Bulbasaur botanical aesthetic.

---

## ✨ Features & Architecture

### 🌿 Bulbasaur Natural-History Design System
- **Editorial Vintage Aesthetic**: Styled after 19th-century botanical field guides and herbarium compendiums (`#0E2A21` Forest, `#3FA796` Bulbasaur Teal, `#7BC96F` Leaf Green, `#F3EBD3` Aged Parchment, `#D9483B` Seed Coral, `#C9A24B` Gold Leaf).
- **Typography**: Display headings in `Cormorant Garamond` & `Playfair Display`, clean UI in `Inter`, and specimen plates in `JetBrains Mono`.
- **Split-Seed Opening Intro**: Botanical seed pod animation with "ENTER THE HERBARIUM" gating (respects `prefers-reduced-motion` and remembers user choice).
- **Dark Mode ("Night Garden")**: Seamless toggle between Aged Parchment and deep nocturnal forest surfaces, persisted in `localStorage`.
- **Original Botanical Mascot**: 100% custom vector illustration companion ("BulbaCare") with zero copyrighted Pokémon assets.

### 🎙️ Multilingual Voice-to-Voice AI Assistant (BulbaCare)
- **Trilingual Spoken Dialogue**: Real-time voice-to-voice interaction in **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)** with automated language detection.
- **Barge-in / Instant Interruption**: Users can interrupt BulbaCare at any millisecond while speaking; playback halts immediately and transfers control back to the user.
- **Web Audio API Engine**: Dynamic soundwave visualizer driven by `AnalyserNode` with proper lifecycle disposal.
- **Clinical Vault Grounding**: Contextually aware of active prescriptions, allergies, and safety warnings for the currently selected patient profile.
- **Auditory Speech Output**: Natural speech synthesis with client-side Web Speech fallback.

### 🏥 Core Healthcare Continuity & Multi-Patient Vaults
- **Multi-Family Profiles**: Isolated partitions for family members (Rajesh, Sunita, Aarav) with instant topbar switching.
- **Prescription & Lab OCR**: Spatial 1000×1000 coordinate grounding of cursive handwriting powered by Gemini Multimodal Vision.
- **Deterministic Clinical Safety**: Instant bidirectional drug-drug interaction alerts and cross-reactive penicillin allergy guards.
- **Cryptographic Audit Ledger**: SHA-256 verified audit trails with DPDP Section 12 cryptographic shredding confirmation.
- **Time-Bounded Doctor Consents**: Expired share pins are automatically locked and invalidated.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Google AI Studio API Key ([Get a key](https://aistudio.google.com/))

### 2. Installation
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file:
```bash
cp .env.example .env
```
Add your key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in Google Chrome or Microsoft Edge (recommended for Web Audio & Speech Recognition).

### 5. Running Automated Checks
```bash
npm run lint    # TypeScript type-checking
npm run build   # Production Vite bundle build
```

---

## 📜 License
MIT License.
