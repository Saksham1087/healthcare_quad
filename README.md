# MediScript (healthcare_quad) 🌿🩺

> **A Patient-Governed Universal Healthcare Continuity & Clinical Safety Platform**  
> *Powered by Gemini 3.8 Flash Multimodal AI, Multilingual Voice Assistant (English & हिन्दी), and the Vintage Botanical Bulbasaur Design System.*

---

## 🌟 Overview

**MediScript** solves one of modern healthcare's most critical problems: **fragmented medical records**. Today, a patient's medical history is scattered across different hospitals, independent clinics, diagnostic labs, and neighbourhood pharmacies. When visiting a new doctor or an emergency room, vital context is often lost — leading to adverse drug interactions, redundant diagnostic tests, and dangerous medication errors.

MediScript unifies this data into a single, cohesive, patient-controlled longitudinal health timeline grounded in **FHIR R4 standards**. Patients can ingest physical prescriptions via high-resolution photos or WhatsApp, have illegible doctor handwriting transcribed by **Gemini 3.8 Flash Vision AI**, query their medical history using **SaurAssistant (सौर-सहायक)** — a voice chatbot speaking fluent English and Hindi — and review their health records wrapped in an organic **Vintage Botanical Bulbasaur** aesthetic.

---

## 🏛️ System Architecture

```
                                  ┌──────────────────────────────────────────┐
                                  │           Patient & Doctor Web UI         │
                                  │   React 19 · Vite · Tailwind CSS v4      │
                                  │      Vintage Botanical Bulbasaur Theme   │
                                  └────────────────────┬─────────────────────┘
                                                       │
                           ┌───────────────────────────┼───────────────────────────┐
                           ▼                           ▼                           ▼
                 ┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
                 │ Prescription OCR  │       │ SaurAssistant     │       │ Clinical Safety & │
                 │ Vision Inspector  │       │ Multilingual Chat │       │ FHIR Continuity   │
                 └─────────┬─────────┘       └─────────┬─────────┘       └─────────┬─────────┘
                           │                           │                           │
                           │ REST / JSON (35MB Limit)  │ HTTP + WebSocket Stream   │ In-Memory Store /
                           │ POST /api/scan-prescription│ /api/chat-voice, /ws/...  │ FHIR R4 Standard
                           │                           │                           │
                           └───────────────────────────┼───────────────────────────┘
                                                       │
                                                       ▼
                                  ┌──────────────────────────────────────────┐
                                  │         MediScript Node / Express        │
                                  │    TypeScript Server (server.ts:3000)    │
                                  │         WebSocket Audio Server           │
                                  └────────────────────┬─────────────────────┘
                                                       │
                                                       ▼
                                  ┌──────────────────────────────────────────┐
                                  │          Google Gemini API               │
                                  │  - gemini-3.8-flash (Vision & OCR)       │
                                  │  - gemini-3.8-flash (Bilingual Chatbot)  │
                                  │  - gemini-3.8-flash-lite-tts (Voice TTS) │
                                  └──────────────────────────────────────────┘
```

---

## 🚀 Core Features

### 1. 🔍 Handwritten Prescription Vision OCR
- **Gemini 3.8 Flash Vision**: Deep extraction of doctor notes, clinic letterheads, patient demographics, and Latin Sig notations (e.g. `"1 tab PO TID pc"` translated to *"Take 1 tablet by mouth three times daily after meals"*).
- **Interactive Bounding Box Inspection**: 2D coordinate segments `[ymin, xmin, ymax, xmax]` overlaid directly on prescription scans for human-in-the-loop audit and correction.
- **Pharmaceutical Verification**: Automatic extraction of Brand names, Generics, strength (mg/mcg/mL), dosage forms, refills, and line-level confidence scoring (0–100%).

### 2. 🎙️ SaurAssistant: Multilingual Voice Chatbot (English & हिन्दी)
- **Bilingual & Multilingual Fluency**: Seamlessly understands and speaks **English**, **Hindi (हिन्दी / Devanagari)**, and dialectal regional variations (Marathi).
- **FHIR Context Grounding**: Answers queries strictly from the patient's verified prescriptions, active conditions, allergies, and emergency records.
- **Voice UX & Barge-In**: Real-time microphone listening, live waveform visualization, Gemini speech synthesis (`gemini-3.8-flash-lite-tts` with voice `'Kore'`), browser SpeechSynthesis fallback, and instant audio barge-in/cancellation.
- **Real-Time WebSocket Streaming**: Dedicated WebSocket endpoint (`/ws/live-audio`) for bidirectional real-time audio interaction.

### 3. 🌿 Vintage Botanical Bulbasaur Design System
- **Parchment & Forest Palette**: Warm herbal parchment (`#FAF6EA`), deep forest emerald (`#14372C`), growth green (`#2D6A4F`), and gilded medicinal gold (`#C9A24B`).
- **Split-Seed Opening Modal**: A botanical seed-pod opening intro animation with persistent `localStorage` memory and strict `prefers-reduced-motion` compliance.
- **Themed Organic UI**: Sprout loaders, vine flourish corner borders, herbarium specimen cards, and botanical security badges.

### 4. 🛡️ Clinical Safety & Interaction Inspector
- **Drug-Drug Conflict Detection**: Automated cross-examination of incoming scripts against active medications (e.g., ACE Inhibitors + Potassium-sparing diuretics, NSAID conflicts).
- **Severe Allergy Intercepts**: Real-time warnings against documented allergies (e.g. Penicillin anaphylaxis).
- **LASA Safeguards**: Automatic flagging of Look-Alike Sound-Alike pharmaceuticals to prevent dispensing errors.

### 5. 🚨 Emergency Break-Glass & Scoped Consent
- **Offline Emergency Card**: Cryptographically verifiable QR code containing life-critical blood group, emergency contacts, active medications, and severe allergies.
- **Audited Break-Glass Mode**: Time-bounded, purpose-declared emergency access protocol for ER clinicians with immutable audit trails.
- **Consent Studio**: Patient-controlled data sharing policies with granular field masks, expiry dates, and single-click access revocation.

### 6. 📱 Multichannel Ingestion & Continuity
- **WhatsApp Simulator**: Experience simulated prescription intake via conversational WhatsApp messaging.
- **Universal Export**: Export lifetime medical records into standard FHIR R4 JSON bundles or human-readable clinical summary PDFs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript 5.8+, Vite 8 |
| **Styling & Theme** | Tailwind CSS v4, Custom CSS Variables, Botanical Glassmorphism |
| **Motion & Audio** | Motion (Framer Motion), Web Audio API, Web Speech Recognition |
| **Icons & Typography** | Lucide React, Google Fonts (Cinzel Decorative, Plus Jakarta Sans, Devanagari support) |
| **Backend Runtime** | Node.js, Express 4.21, TypeScript via `tsx` |
| **Real-Time Networking** | WebSocket (`ws` v8.22), HTTP/REST |
| **Artificial Intelligence** | `@google/genai` (Gemini 3.8 Flash, Gemini Vision, Gemini TTS) |
| **Data Standard** | HL7 FHIR R4 Patient, MedicationStatement, AllergyIntolerance, Condition |

---

## 📂 Project Directory Structure

```
healthcare_quad/
├── .env.example                     # Environment variable blueprint
├── bun.lock                         # Lockfile for Bun package manager
├── index.html                       # HTML5 entrypoint with Google Fonts
├── metadata.json                    # Project manifest & capability declarations
├── package.json                     # NPM dependencies & scripts
├── server.ts                        # Unified Express & WebSocket backend
├── tsconfig.json                    # TypeScript compiler options
├── vite.config.ts                   # Vite bundler configuration
│
├── docs/                            # Deep Architectural & Engineering Documentation
│   ├── ARCHITECTURE.md              # System design, data pipelines, and FHIR models
│   ├── VOICE_CHATBOT_TRANSCRIPTION.md # Speech recognition, Devanagari NLP & TTS guide
│   └── BULBASAUR_THEME.md           # Botanical design tokens, assets & motion spec
│
├── openspec/                        # OpenSpec Specification Framework
│   ├── config.yaml                  # OpenSpec tool configuration
│   └── changes/                     # Active change proposals
│       └── add-voice-chatbot-hindi-english-bulbasaur/
│           ├── proposal.md          # Architectural proposal
│           ├── design.md            # System design & component contracts
│           ├── specs/               # Delta requirement specifications
│           │   ├── voice-assistant-transcription/spec.md
│           │   └── bulbasaur-botanical-theme/spec.md
│           └── tasks.md             # Ordered verification & task DAG
│
└── src/                             # Frontend Source Code
    ├── App.tsx                      # Root component & view coordinator
    ├── main.tsx                     # React DOM bootstrap
    ├── index.css                    # Tailwind CSS v4 directives & theme variables
    │
    ├── components/                  # Modular React Components
    │   ├── BulbasaurThemeAssets.tsx # Botanical icons, Split-Seed modal & sprout loaders
    │   ├── VoiceAssistantChatbot.tsx# Multilingual SaurAssistant voice/text companion
    │   ├── TranscriptionInspector.tsx# Prescription OCR & bounding-box visualizer
    │   ├── ClinicalSafetyInspector.tsx# Drug interactions, allergies & LASA flags
    │   ├── EmergencyBreakGlassCard.tsx# Emergency QR card & ER clinician override
    │   ├── ConsentStudio.tsx        # Granular permissions & access revocation
    │   ├── HealthTimeline.tsx       # Longitudinal patient record timeline
    │   ├── MedicationScheduleCard.tsx# Daily adherence & dosage scheduler
    │   ├── Navbar.tsx               # Botanical header with patient switcher & status
    │   ├── PatientProfileSwitcher.tsx# Multi-patient profile switcher
    │   ├── PrescriptionViewer.tsx   # Prescription inspection modal
    │   ├── UploadModal.tsx          # Multi-source document uploader
    │   ├── WhatsAppIngestionSimulator.tsx # Ingestion simulation via WhatsApp
    │   ├── HeroLandingSection.tsx   # Onboarding hero & feature cards
    │   ├── LifetimeExportModal.tsx  # FHIR & PDF record exporter
    │   ├── ExportReportModal.tsx    # Shareable doctor summary report modal
    │   ├── ModelDiagnosticsPanel.tsx# AI latency, token & model telemetry
    │   └── DoctorCuratedView.tsx    # Clinician view with one-click approval
    │
    ├── data/                        # Sample clinical data & records
    │   ├── patientContinuityRecords.ts # Complete multi-patient FHIR record store
    │   └── samplePrescriptions.ts   # Realistic prescriptions & base64 scans
    │
    ├── services/                    # Domain Business Logic
    │   └── clinicalSafety.ts        # Drug interaction & contraindication evaluator
    │
    └── types/                       # TypeScript Interface Definitions
        ├── fhir.ts                  # FHIR R4 compliant schemas & patient stores
        └── prescription.ts          # OCR bounding box & transcription structures
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (or **Bun** v1.0.0+)
- **Google Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install
```bash
git clone https://github.com/rairahulr1/healthcare_quad.git project
cd project

# Install dependencies with Bun or NPM
bun install
# or
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Populate your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
APP_URL="http://localhost:3000"
```
*(Note: If no API key is provided, MediScript automatically falls back to deterministic simulated clinical OCR and simulated bilingual responses for local testing).*

### 3. Run Development Server
```bash
# Starts both Express API / WebSocket and Vite frontend (auto-detects free port if 3000 is occupied)
npm run dev

# Or specify a custom port:
npm run dev -- --port 8080
# or
PORT=8080 npm run dev

# Enforce strict port without auto-incrementing:
npm run dev -- --port 3000 --strict-port
```
Open your browser at the URL shown in console (e.g., **`http://localhost:3000`** or the auto-assigned port).

---

## 📡 API Reference

### 1. `POST /api/scan-prescription`
Accepts a base64 encoded prescription image and runs clinical OCR.
- **Request Body**:
  ```json
  {
    "imageBase64": "data:image/jpeg;base64,...",
    "mimeType": "image/jpeg",
    "model": "gemini-3.8-flash"
  }
  ```
- **Response**: Full structured prescription JSON including doctor details, patient data, medications, Latin Sig translations, bounding boxes, OCR confidence, and clinical safety flags.

### 2. `POST /api/chat-voice`
Processes conversational voice or text prompts for SaurAssistant.
- **Request Body**:
  ```json
  {
    "message": "मुझे मेरी दवाओं के बारे में बताओ",
    "language": "hi",
    "patientSummary": "Rajesh Sharma, 58yo..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "replyText": "नमस्ते! आप ब्लड प्रेशर के लिए टेलमा-एच और डायबिटीज के लिए ग्लाइकोमेट ले रहे हैं।",
    "detectedLanguage": "hi",
    "audioBase64": "<base64_audio_data>",
    "mimeType": "audio/wav"
  }
  ```

### 3. `WebSocket /ws/live-audio`
Full-duplex WebSocket connection for real-time audio streaming and speech events.
- **Connect**: `ws://localhost:3000/ws/live-audio`
- **Ping/Pong**: Keep-alive and low-latency heartbeat verification.

---

## 📜 License & Compliance

MediScript is released for clinical workflow innovation and healthcare continuity research. All patient health records are modeled according to **HL7 FHIR R4** standards and Indian **ABDM (Ayushman Bharat Digital Mission)** consent frameworks.
