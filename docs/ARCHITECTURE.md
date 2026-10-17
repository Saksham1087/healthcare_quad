# MediScript System Architecture 🏛️

This document details the software architecture, data pipelines, clinical safety engine, and standards compliance for **MediScript** (`healthcare_quad`).

---

## 1. Architectural Philosophy

MediScript is designed around four foundational tenets:

1. **Patient Agency & Sovereignty**: All medical records belong to the patient. Data sharing is granular, time-bound, purpose-tagged, and revokable at any moment.
2. **Clinical Safety by Design**: Prescription transcription is treated as life-critical. AI inferences are never silently accepted; they are paired with bounding-box visual audits, Latin Sig verification, drug-drug interaction screening, and allergy conflict checks.
3. **Multilingual Inclusivity**: Real-world patients in multilingual regions (such as India) converse across English, Hindi, and regional languages. The interface, voice chatbot, and transcription models must seamlessly handle bilingual and code-mixed speech.
4. **Resilient Local & Edge Operation**: When external AI APIs or network connections are unavailable, the platform degrades gracefully to deterministic clinical simulation, offline QR emergency cards, and browser-native speech synthesis.

---

## 2. High-Level Component Topology

```
+-----------------------------------------------------------------------------------+
|                                  Client Browser                                   |
|                                                                                   |
|  +--------------------+   +---------------------+   +--------------------------+  |
|  | Prescription Viewer|   | SaurAssistant       |   | Patient Health Timeline  |  |
|  | - Canvas Overlays  |   | - Audio Visualizer  |   | - Longitudinal FHIR View |  |
|  | - 2D Bounding Boxes|   | - English/Hindi Mic |   | - Medication Adherence   |  |
|  | - Edit Sig / Doses |   | - Interruption/Barge|   | - Diagnostic Observations|  |
|  +---------+----------+   +----------+----------+   +------------+-------------+  |
|            |                         |                           |                |
|  +---------+-------------------------+---------------------------+-------------+  |
|  |                     MediScript Core Context & State                         |  |
|  |  - Active Patient Profile: Rajesh Sharma / Priya Patel                      |  |
|  |  - Clinical Safety Evaluator (Drug Conflicts, Allergies, LASA Flags)        |  |
|  |  - Vintage Botanical Bulbasaur Styling & Animation Store                    |  |
|  +-----------------------------------+-----------------------------------------+  |
+--------------------------------------|--------------------------------------------+
                                       | HTTP & WS
                                       v
+-----------------------------------------------------------------------------------+
|                        Node.js / Express Server (server.ts)                       |
|                                                                                   |
|  +------------------------------------+   +------------------------------------+  |
|  | REST Endpoints                     |   | WebSocket Server                   |  |
|  | - POST /api/scan-prescription      |   | - Path: /ws/live-audio             |  |
|  | - POST /api/chat-voice             |   | - Low-latency audio streaming      |  |
|  | - GET  /api/health                 |   | - Bidirectional speech ping/pong   |  |
|  +-----------------+------------------+   +-----------------+------------------+  |
|                    |                                        |                     |
|                    +--------------------+-------------------+                     |
|                                         |                                         |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                     Google GenAI SDK Integration                            |  |
|  |  - Vision Model: gemini-3.8-flash (Prescription OCR & Sig Decoding)         |  |
|  |  - Chat Model: gemini-3.8-flash (Bilingual Medical Voice Agent)             |  |
|  |  - TTS Model: gemini-3.8-flash-lite-tts (Natural Indian Voice Synthesis)   |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Data Pipeline & FHIR Schema Integration

MediScript models all clinical records using standard **HL7 FHIR R4** primitives:

### Core Schemas (`src/types/fhir.ts`)

- **`PatientProfile`**: Represents patient demographics, national health identifiers (ABHA ID), emergency contacts, and blood group.
- **`UnifiedMedication`**: Synthesizes prescribed pharmaceuticals across providers:
  - `brandName`, `genericName`, `form`, `dosageStrength`, `route`
  - `frequency`, `instructions` (unambiguous plain English & vernacular)
  - `latinSigVerbatim` (e.g., `1 tab PO TID pc`)
  - `prescriber`, `startDate`, `durationDays`, `active`
- **`UnifiedAllergy`**: Documented drug and environmental hypersensitivities:
  - `substance`, `reactionCategory`, `criticality` (`high`, `moderate`, `low`)
  - `verificationStatus`, `manifestations` (e.g. `Anaphylaxis`, `Angioedema`)
- **`UnifiedCondition`**: Active clinical diagnoses, ICD-10 codings, and clinical status.
- **`AuditTrailEvent`**: Cryptographically verifiable access logging with actor, timestamp, purpose-of-use, and outcome.

---

## 4. Clinical Safety Engine (`src/services/clinicalSafety.ts`)

Whenever a new prescription is scanned or reviewed, it passes through the clinical safety matrix:

```
[ Incoming Prescription ] ──> [ Active Medication Store ]
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │    Clinical Safety Rules Engine      │
                      ├──────────────────────────────────────┤
                      │ 1. Direct Drug-Drug Interactions     │
                      │ 2. Substance Allergy Cross-Match     │
                      │ 3. Look-Alike Sound-Alike (LASA)     │
                      │ 4. Max Dose Ceiling Checks           │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │       Generated Safety Verdict       │
                      │ - Severity: CRITICAL / WARN / SAFE   │
                      │ - Clinician Action Recommended       │
                      │ - Patient-friendly Explanation       │
                      └──────────────────────────────────────┘
```

### Safety Rules Covered:
1. **Penicillin Anaphylaxis Intercept**: Blocks Amoxicillin, Ampicillin, and related beta-lactam antibiotics when Penicillin hypersensitivity is flagged.
2. **ACE Inhibitor + Potassium Sparing Conflicts**: Intercepts combination risks leading to hyperkalemia.
3. **Dual Antiplatelet & NSAID Warnings**: Flags gastrointestinal bleeding risk when Aspirin/Ecosprin is co-prescribed with Ibuprofen or Diclofenac.
4. **Metformin Lactic Acidosis Caution**: Flags renal impairment conditions against biguanide therapies.

---

## 5. Vision OCR Pipeline (`server.ts`)

1. **Payload Ingestion**: Accepts up to 35MB base64 payloads to preserve high-resolution ink fidelity from mobile cameras and scanners.
2. **Clinical Pharmacologist System Prompting**: Instructs Gemini 3.8 Flash to act as a board-certified clinical pharmacologist.
3. **Structured Coordinate Geometry**: Outputs normalized bounding boxes `[ymin, xmin, ymax, xmax]` scaled from 0 to 1000.
4. **Latin Sig Decoding**: Translates apothecary and Latin shorthands (`q.d.`, `b.i.d.`, `t.i.d.`, `p.o.`, `p.r.n.`, `h.s.`, `p.c.`) into unambiguous patient instructions.
5. **Interactive UI Verification**: In `TranscriptionInspector.tsx`, doctors and patients can click any bounding box to view alternative readings, edit confidence scores, or approve the entry.
