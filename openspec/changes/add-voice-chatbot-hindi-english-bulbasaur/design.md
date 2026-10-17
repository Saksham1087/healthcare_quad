# Design: Multilingual Voice Chatbot & Bulbasaur Theme

## Context

MediScript unifies scattered medical records into a FHIR R4-compliant longitudinal timeline with handwritten prescription OCR via Gemini 3.8 Flash. To enhance patient comprehension and alleviate clinical anxiety, this design specifies the integration of **SaurAssistant** (a real-time voice and text conversational assistant supporting English and Hindi) and the **Vintage Botanical Bulbasaur** visual theme.

See `proposal.md` for motivation and background.

## Goals / Non-Goals

**Goals:**
- Provide real-time bilingual speech-to-text recognition supporting English (`en-IN`) and Hindi (`hi-IN`) with interim visual feedback.
- Ground all conversational responses in the active patient's FHIR record (medications, allergies, conditions, doctor notes).
- Enforce strict voice UX rules (1–3 short spoken sentences, zero markdown punctuation) suitable for spoken audio delivery.
- Implement Gemini Voice TTS synthesis with browser SpeechSynthesis fallback and immediate barge-in audio interruption.
- Maintain full-duplex WebSocket streaming infrastructure at `/ws/live-audio`.
- Establish the Vintage Botanical Bulbasaur design system with parchment palettes, gold accents, Split-Seed modal animations, and sprout loaders.
- Guarantee WCAG AA contrast compliance and support `prefers-reduced-motion`.

**Non-Goals:**
- Providing automated diagnostic medical opinions or altering prescription dosages autonomously without doctor intervention.
- Building a full offline speech recognition neural network inside the client bundle (leverages Web Speech API and server-side Gemini audio).
- Full multi-speaker diarization for multi-doctor conferences.

## Decisions

### 1. Hybrid Web Speech API and Gemini Multimodal Audio Streaming
- **Decision**: Use the browser's native `webkitSpeechRecognition` with language toggles (`en-IN`, `hi-IN`, `mr-IN`) for zero-latency client transcription, paired with server-side Gemini 3.8 Flash for reasoning and `gemini-3.8-flash-lite-tts` for natural vocal cadence.
- **Alternatives Considered**: 
  - *Client-side Whisper WebAssembly*: High memory overhead (>150MB model download) and poor low-end mobile performance.
  - *Text-only chatbot*: Fails patients with low literacy or visual impairments.

### 2. Strict FHIR Grounding & No-Markdown Voice Output
- **Decision**: Inject active patient continuity records into the system instruction prompt and instruct Gemini to return 1–3 short sentences without markdown formatting (no asterisks, hash signs, or bullets).
- **Alternatives Considered**: 
  - *Standard markdown conversational replies*: Screen readers and audio TTS engines awkwardly articulate asterisks and formatting symbols aloud.

### 3. Immediate Barge-in & Audio Lifecycle Control
- **Decision**: Maintain direct references (`currentAudioRef`, `window.speechSynthesis`) and trigger `stopAllAudio()` immediately on any microphone activation or user input event.
- **Alternatives Considered**:
  - *Allowing audio to finish*: Frustrates users trying to ask follow-up questions or correct a query.

### 4. Vintage Botanical Design System over Generic Clinical Blue
- **Decision**: Implement a warm apothecary parchment aesthetic (`#FAF6EA`, `#14372C`, `#2D6A4F`, `#C9A24B`) with organic curved geometries, split-seed pod entry animations, and sprout loaders.
- **Alternatives Considered**:
  - *Standard corporate hospital blue/white*: Induces clinical anxiety and white-coat syndrome.

## Risks / Trade-offs

- **[Risk: Browser Web Speech API fragmentation]** → *Mitigation*: Fall back gracefully to manual text typing and server-side speech analysis if microphone permissions are denied or unsupported.
- **[Risk: Latency in Gemini TTS generation]** → *Mitigation*: Deliver conversational text response immediately to the chat log while streaming audio synthesis, falling back to browser `speechSynthesis` if TTS generation takes longer than 2.5s.
- **[Risk: Animation motion sensitivity]** → *Mitigation*: Honor `prefers-reduced-motion` at the CSS and component levels, and persist intro dismissal in `localStorage`.
