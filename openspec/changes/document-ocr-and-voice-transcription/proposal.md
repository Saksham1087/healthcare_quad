# Proposal: document-ocr-and-voice-transcription

## Why

MediScript has two capabilities — Prescription & Lab OCR and voice-assistant transcription — with no durable OpenSpec anchors, and the voice transcription fix (server-side Gemini STT fallback for browsers without cloud speech engines) is implemented in the working tree but untracked by any change. Capturing both as one change records the observed behavior as a contract before it drifts, and routes the voice fallback code through verification so it lands as a tracked, archived capability.

## What Changes

- Capture the Prescription & Lab OCR behavior as a new durable spec: entry points (navbar tab, Add Record button, hero CTA, footer index), transcription contract (Gemini Vision -> structured data), auto patient matching, audit provenance (`ocr-unconfirmed`), and the review/commit flow.
- Change fallback behavior for OCR transcription errors: the current silent "calibrated fallback" swap becomes an explicit simulated-data mode, clearly labeled in the UI.
- Capture the voice assistant transcription pipeline as a new durable spec: browser SpeechRecognition as primary path, parallel mic recording, and server-side Gemini transcription over `/ws/live-audio` when the browser cloud speech engine is unavailable (Brave, BrowserOS, Chromium builds without bundled speech keys).
- Document the transcription error routing: `not-allowed`, `network`/`service-not-allowed` (falls back to server transcription), `no-speech`, and other codes.
- Verify the just-implemented WebSocket transcription path end-to-end and commit it (code already exists; tasks are verification-only).

## Capabilities

**New Capabilities:**
- `prescription-ocr` — scanning handwritten prescriptions and lab reports with Gemini Vision, reviewing structured results, and committing them into patient records.
- `voice-assistant-transcription` — converting spoken queries to text via browser STT with a server-side Gemini transcription fallback over the live-audio WebSocket.

**Modified Capabilities:** none (both are new; `openspec list --specs` is empty).

## Impact

- `src/App.tsx` — OCR upload flow, patient auto-match, simulated-data labeling (verification of existing behavior; fallback-notice change).
- `src/components/UploadModal.tsx`, `src/components/PrescriptionViewer.tsx`, `src/components/TranscriptionInspector.tsx` — review surface referenced by the spec.
- `server.ts` — `/api/scan-prescription`, `/api/voice-chat`, `/ws/live-audio` transcription path (already implemented; verification only).
- `src/components/VoiceAssistantChatbot.tsx` — parallel recorder + WS fallback (already implemented; verification only).
- `scripts/test-voice-ws.mjs` — round-trip test added with the voice transcription implementation.
- Backend dependencies unchanged; no data migrations; audit trail format unchanged.
