# MediScript (Healthcare AGY) 🌿

> **Longitudinal Healthcare Continuity Platform & Trilingual Voice Health Companion**  
> *ABDM Milestone M1–M3 & DPDP Act 2023 Sovereign Encryption*

MediScript unifies handwritten doctor prescriptions, multi-family health vaults, and trilingual voice-to-voice AI into an **Editorial Vintage Natural-History** interface inspired by a Bulbasaur botanical aesthetic.

---

## 🎬 3.5-Minute Remotion Product Launch Video

> **Official Video Deliverable**: [`demo-video/out/MediScript-Product-Demo.mp4`](demo-video/out/MediScript-Product-Demo.mp4)  
> **Evaluation Dossier & Scoring Rubrics**: See [**DEMO_VIDEO_GUIDE.md**](DEMO_VIDEO_GUIDE.md) for the complete act-by-act evaluator breakdown.

An end-to-end programmatic product video created with **Remotion 4** (1080p Full HD @ 30 FPS, exactly 6,300 frames, 22.6 MB) showcasing the complete outpatient journey, sovereign vaults, spatial OCR, voice companion, and cryptographic consent.

```
0:00 ─── 0:35 ─── 1:05 ─── 1:35 ────── 2:32 ────── 3:08 ─── 3:30
  │        │        │        │           │           │        │
 Act 1   Act 2    Act 3    Act 4       Act 5       Act 6    Outro
 Crisis  Vaults    OCR     Voice       Consent     Stack
 (OPD)  (Theme)  (RxNorm) (Tri-ling)  (DPDP Sec12) (Arch)
```

### ⏱️ Act-by-Act Timeline & Highlights

| Act | Timestamp | Title | Key Highlights & Hackathon Criteria |
| :---: | :---: | :--- | :--- |
| **Act 1** | **0:00 – 0:35** | **The OPD Clinical Discontinuity Crisis** | Solves India's 70% OPD history dependency & 68% longitudinal record loss; highlights preventable drug-drug interactions (DDI) & cross-reactive penicillin allergy risks in rapid consultations. |
| **Act 2** | **0:35 – 1:05** | **Herbarium Sanctuary & Multi-Vaults** | Editorial Vintage Natural-History UI ("BulbaCare" aesthetic); live toggle to "Night Garden" dark mode; multi-generational family vaults (Rajesh, Sunita, Aarav) with sovereign isolation and zero cross-patient data bleed. |
| **Act 3** | **1:05 – 1:35** | **Spatial Vision OCR & Clinical Safety** | Gemini 1000×1000 spatial coordinate grounding on real doctor cursive handwriting; RxNorm Biguanide/Metformin ontology normalization; deterministic penicillin anaphylaxis interception before ingestion. |
| **Act 4** | **1:35 – 2:32** | **Trilingual Spoken Voice AI Companion** | Real-time voice-to-voice in **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**; sub-second latency with zero-markdown auditory synthesis; Web Audio API spectrum analysis; instant barge-in interruption. |
| **Act 5** | **2:32 – 3:08** | **ABDM Consent Studio & DPDP Shredding** | ABDM M1–M3 compliance; 15-minute ephemeral doctor PIN access; emergency Break-Glass protocol with SHA-256 audit ledger; India DPDP Act 2023 Sec 12 irreversible AES-256 key shredding (Right to Erasure). |
| **Act 6** | **3:08 – 3:30** | **Grand Outro & Open Source Architecture** | Production system architecture summary; full-stack TypeScript/React 19/Bun stack; reproducible hackathon artifact repository. |

### 🏆 Key Hackathon Evaluation Points

1. **ABDM / ABHA Milestones M1, M2, and M3**:
   - **M1 (ABHA Creation & Verification)**: Unique patient health ID and secure authentication.
   - **M2 (Health Information Provider/User - HIP/HIU)**: Linking and sharing FHIR R4 diagnostic and prescription records across disparate facilities.
   - **M3 (Consent Manager & Ephemeral Access)**: Granular, patient-directed 15-minute time-bounded PIN consent and emergency Break-Glass with immutable SHA-256 logging.
2. **Trilingual Voice Health Companion (BulbaCare)**:
   - Voice-first accessibility across **English**, **Hindi**, and **Marathi** with culturally nuanced medical communication and honorifics ("राजेश जी").
   - Integrated with Web Audio API `AnalyserNode` for dynamic harmonic frequency visualization; supports instant barge-in preemption.
   - Contextually grounded in the active patient's clinical vault records (e.g., verifying Telmisartan 40mg dosing and intercepting OTC Ibuprofen/NSAID hazards).
3. **Multimodal Spatial Vision OCR & Clinical Guardrails**:
   - Precision 1000×1000 normalized coordinate grounding (`[ymin, xmin, ymax, xmax]`) for illegible cursive prescription slips.
   - Normalization of brand names to RxNorm Concept Unique Identifiers (CUIs).
   - Deterministic, bidirectional drug-drug interaction and allergy guardrails preventing clinical harm before ingestion.
4. **India DPDP Act 2023 Compliance & Data Sovereignty**:
   - Strict multi-family tenant isolation ensuring sovereign boundary protections.
   - **Section 12 Compliance (Right to Erasure)**: Irreversible AES-256-GCM symmetric key shredding mathematically turns orphaned data into unreconstructible noise.

### 💻 Quickstart for Judges: Preview & Render the Video

Judges and evaluators can immediately view or interactively inspect the video:

```bash
# 1. Zero-latency instant playback of pre-rendered MP4 (Hardware accelerated)
ffplay -fs -autoexit demo-video/out/MediScript-Product-Demo.mp4

# OR launch with VLC
vlc demo-video/out/MediScript-Product-Demo.mp4
```

```bash
# 2. Launch interactive Remotion Studio web console (Scrub all 6,300 frames)
cd demo-video
npm run start
# Open http://localhost:3000 to scrub frames, inspect audio waveforms, and examine component props
```

```bash
# 3. Re-render the full 1080p MP4 from source code
cd demo-video
npx remotion render MediScriptDemo out/MediScript-Product-Demo.mp4
```

👉 **For the complete dossier with scoring rubrics, frame-by-frame still commands, and audio transcripts, refer to [DEMO_VIDEO_GUIDE.md](DEMO_VIDEO_GUIDE.md).**

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
