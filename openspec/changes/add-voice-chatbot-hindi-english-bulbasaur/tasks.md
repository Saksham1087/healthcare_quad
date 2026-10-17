# Tasks

## 1. Backend Voice Services & Streaming Infrastructure

- [x] 1.1 Implement `/api/chat-voice` endpoint in `server.ts` with Gemini 3.8 Flash and TTS synthesis and verify with API curl test
- [x] 1.2 Implement bilingual language detector supporting Devanagari script regex and verify with Hindi and English payload tests
- [x] 1.3 Implement WebSocket server at `/ws/live-audio` with ping/pong heartbeat and verify WebSocket connection lifecycle

## 2. Frontend Voice Assistant Component (SaurAssistant)

- [x] 2.1 Build `VoiceAssistantChatbot.tsx` with Web Speech API transcription supporting `en-IN` and `hi-IN` and verify speech input rendering
- [x] 2.2 Implement Web Audio Analyser RMS level visualizer and verify reactive microphone waveform pulses
- [x] 2.3 Implement immediate barge-in audio interruption in `VoiceAssistantChatbot.tsx` and verify audio stops on microphone trigger
- [x] 2.4 Ground voice assistant context with active FHIR patient profile, medications, and allergies and verify clinical responses

## 3. Bulbasaur Botanical Visual Theme & Design Tokens

- [x] 3.1 Configure Tailwind CSS v4 botanical color tokens (`#FAF6EA`, `#14372C`, `#2D6A4F`, `#C9A24B`) in `src/index.css` and verify styling
- [x] 3.2 Build `SplitSeedIntroModal` with curved seed pod parting animations in `BulbasaurThemeAssets.tsx` and verify localStorage persistence
- [x] 3.3 Build `ThemedSproutLoader` animated seedling indicator and verify loader displays during async operations
- [x] 3.4 Implement `prefers-reduced-motion` media queries across botanical components and verify animations halt when enabled

## 4. Documentation & Verification

- [x] 4.1 Author comprehensive project `README.md` and verify all setup steps, architecture diagrams, and API endpoints are documented
- [x] 4.2 Author `docs/ARCHITECTURE.md`, `docs/VOICE_CHATBOT_TRANSCRIPTION.md`, and `docs/BULBASAUR_THEME.md` and verify cross-links
- [x] 4.3 Run TypeScript linting (`tsc --noEmit`) and Vite production build (`vite build`) and verify zero errors
