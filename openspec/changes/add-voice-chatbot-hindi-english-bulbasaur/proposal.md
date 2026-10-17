# Proposal: Add Multilingual Voice Chatbot (English & Hindi) and Bulbasaur Botanical Theme

## Why

Patients navigating chronic illnesses or complex medical regimens frequently struggle with clinical jargon, dense medication schedules, and small handwriting on prescription packaging. In diverse linguistic landscapes like India, patient comprehension drops dramatically when healthcare applications are restricted to English text-only interfaces. Furthermore, sterile, clinical hospital aesthetics induce anxiety and disengagement. 

Introducing **SaurAssistant** — an empathetic, multilingual voice assistant capable of real-time speech transcription in both English and Hindi — combined with a calming, organic **Vintage Botanical Bulbasaur** aesthetic transforms MediScript from an impersonal records database into an accessible, comforting health companion for patients and families.

## What Changes

- **Bilingual Voice & Text Health Companion**: Implements SaurAssistant (`VoiceAssistantChatbot.tsx`) capable of conversational speech interactions in English (`en-IN`) and Hindi (`hi-IN`), with dialectal tolerance for regional variations (Marathi).
- **Live Transcription & Audio Waveform**: Integrates client-side Web Audio frequency analysis, live microphone listening, waveform level visualizers, and interim speech transcription.
- **Backend Multimodal AI & Audio Synthesis**: Adds a dedicated voice API endpoint (`POST /api/chat-voice`) and full-duplex WebSocket streaming server (`/ws/live-audio`) connected to Google Gemini 3.8 Flash and Gemini Voice TTS (`gemini-3.8-flash-lite-tts`).
- **Clinical Grounding & Voice Safety**: Restricts assistant knowledge strictly to the patient's verified FHIR records (active medications, allergies, diagnoses, emergency contacts) and enforces voice UX rules (short 1-3 spoken sentences, zero markdown punctuation).
- **Immediate Barge-in & Interruption**: Provides instant audio cancellation when a user begins speaking or inputs a new query.
- **Vintage Botanical Bulbasaur Visual Theme**: Replaces sterile UI styling with a warm apothecary parchment aesthetic (`#FAF6EA`, `#14372C`, `#2D6A4F`, `#C9A24B`).
- **Interactive Botanical Assets**: Introduces the Split-Seed Opening Intro Modal (`SplitSeedIntroModal`), Themed Sprout Loaders (`ThemedSproutLoader`), and botanical corner flourishes.

## Capabilities

### New Capabilities
- `voice-assistant-transcription`: Real-time multilingual voice and text conversational health assistant supporting English and Hindi transcription, audio streaming, Devanagari script processing, and clinical record grounding.
- `bulbasaur-botanical-theme`: Vintage botanical Bulbasaur aesthetic system featuring parchment and forest green color tokens, animated split-seed pod entry modals, sprout loading indicators, and accessibility safeguards.

### Modified Capabilities
<!-- No prior formal OpenSpec capabilities existed in the repository prior to this initialization -->

## Impact

- **Frontend**: Adds `src/components/VoiceAssistantChatbot.tsx` and `src/components/BulbasaurThemeAssets.tsx`; updates `src/App.tsx`, `src/components/Navbar.tsx`, `src/index.css`, and `index.html`.
- **Backend**: Updates `server.ts` with `/api/chat-voice` route, Gemini TTS integration, and `/ws/live-audio` WebSocket server via `ws`.
- **Dependencies**: Adds `@types/ws`, `ws`, `motion`, `lucide-react`, `@google/genai`.
- **External APIs**: Requires Google Gemini API key (`GEMINI_API_KEY`) for Gemini 3.8 Flash Vision, Chat, and TTS, with seamless fallback to simulated clinical dialog and browser speech synthesis.
