# Tasks

## 1. Voice transcription verification (code exists; track validation)

- [x] 1.1 Restart the dev server and confirm `/api/health` reports `hasApiKey: true` through the preview tunnel
- [x] 1.2 Run `bun scripts/test-voice-ws.mjs` and verify the WS transcription round-trip returns the expected transcript
- [x] 1.3 Verify tap-to-talk in a Brave/BrowserOS session falls back to server transcription and flows into the chat pipeline (manual check via the preview tunnel)
- [x] 1.4 Run `tsc --noEmit` and `vite build` with zero errors
- [x] 1.5 Commit the voice transcription implementation (server.ts, VoiceAssistantChatbot.tsx, test script) and push

## 2. OCR explicit simulated-data notice

- [x] 2.1 In the OCR error path (`src/App.tsx`), change the success-path labeling so simulated fallback data is explicitly announced as simulated, not real transcription
- [x] 2.2 Surface the simulated-data state on the Scanner review banner so clinicians see the provenance before commit
- [x] 2.3 Verify: disable network access to the transcription backend in dev and observe the labeled simulated mode; re-enable and observe real transcription

## 3. Workflow follow-up (reference bullets, not tracked)

- Archive the change with `/opsx-archive` so both specs become durable project capabilities.
