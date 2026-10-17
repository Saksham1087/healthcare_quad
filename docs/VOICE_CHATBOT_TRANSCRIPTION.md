# Multilingual Voice Chatbot & Transcription Architecture 🎙️

This document describes the design, speech pipeline, Devanagari natural language processing, and multimodal integration of **SaurAssistant (सौर-सहायक)**.

---

## 1. Overview & Objectives

SaurAssistant is MediScript's nature-inspired conversational health companion. It serves patients who may have difficulty reading complex medical jargon, small print on medicine strips, or using keyboards on mobile devices.

### Key Capabilities:
- **Speech-to-Text Transcription**: Real-time microphone listening supporting English (`en-IN`), Hindi (`hi-IN`), and Marathi (`mr-IN`).
- **Devanagari Script Handling**: Automatic script detection, Devanagari Unicode processing (`[\u0900-\u097F]`), and vernacular transliteration.
- **FHIR Context Grounding**: Responses are strictly synthesized against the patient's verified health records (active medications, dosages, allergies, emergency contacts).
- **Natural Speech Synthesis**: Gemini Voice TTS (`gemini-3.8-flash-lite-tts` with voice `'Kore'`) with warm Indian cadence, plus browser `window.speechSynthesis` client fallback.
- **Barge-In / Interruption**: Instant cancellation of audio playback and speech synthesis whenever the user taps the microphone or starts speaking.

---

## 2. Speech Pipeline Architecture

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 User Voice Input                       │
                  │             (Microphone / MediaStream)                 │
                  └──────────────────────────┬─────────────────────────────┘
                                             │
                                             ▼
                  ┌────────────────────────────────────────────────────────┐
                  │           Browser Web Audio API & Analyser             │
                  │    - Real-time frequency bin analysis (RMS Level)      │
                  │    - Visual waveform pulse feedback                    │
                  └──────────────────────────┬─────────────────────────────┘
                                             │
                        ┌────────────────────┴────────────────────┐
                        ▼                                         ▼
         ┌───────────────────────────────┐        ┌───────────────────────────────┐
         │     Web Speech Recognition    │        │       WebSocket Stream        │
         │   (webkitSpeechRecognition)   │        │     (ws://.../ws/live-audio)  │
         │  - Languages: en-IN / hi-IN   │        │   - Real-time audio chunks    │
         │  - Interim & Final Transcripts│        │   - Low-latency transport     │
         └──────────────┬────────────────┘        └───────────────┬───────────────┘
                        │                                         │
                        └────────────────────┬────────────────────┘
                                             │
                                             ▼
                  ┌────────────────────────────────────────────────────────┐
                  │               SaurAssistant State Machine              │
                  │   [idle] ──> [listening] ──> [thinking] ──> [speaking] │
                  └──────────────────────────┬─────────────────────────────┘
                                             │
                                             ▼
                  ┌────────────────────────────────────────────────────────┐
                  │            POST /api/chat-voice (server.ts)            │
                  │  Payload: { message, language, patientSummary }        │
                  └──────────────────────────┬─────────────────────────────┘
                                             │
                        ┌────────────────────┴────────────────────┐
                        ▼                                         ▼
         ┌───────────────────────────────┐        ┌───────────────────────────────┐
         │      Gemini 3.8 Flash         │        │    Gemini 3.8 Flash Lite TTS  │
         │  - Clinical safety system     │        │  - Natural spoken cadence     │
         │    prompt                     │        │  - Voice: 'Kore'              │
         │  - 1-3 conversational short   │        │  - Base64 WAV / PCM audio     │
         │    sentences (no markdown)    │        │                               │
         └──────────────┬────────────────┘        └───────────────┬───────────────┘
                        │                                         │
                        └────────────────────┬────────────────────┘
                                             │
                                             ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                    Client Playback                     │
                  │  - HTMLAudioElement (WAV buffer)                       │
                  │  - Fallback: window.speechSynthesis (hi-IN / en-IN)    │
                  │  - Barge-in listener: stop on new input                │
                  └────────────────────────────────────────────────────────┘
```

---

## 3. Bilingual Script & Language Detection

In Indian healthcare settings, patients frequently switch between English and Hindi, or speak Hinglish. The system uses a two-tier language resolution:

### Tier 1: User Language Selector
The UI provides an explicit pill toggle:
- `Auto`: Automatic detection based on spoken phonetics and character ranges.
- `English`: Forces `en-IN` recognition dialect.
- `हिन्दी (Hindi)`: Forces `hi-IN` recognition dialect with Devanagari script output.
- `मराठी (Marathi)`: Forces `mr-IN` recognition dialect.

### Tier 2: Devanagari Unicode Regex Classifier
When processing raw text or server replies, the engine inspects Unicode ranges:
```typescript
const isHindi = /[\u0900-\u097F]/.test(message) || language === 'hi';
const isMarathi = /[\u0900-\u097F]/.test(message) && 
  (message.includes('आहे') || message.includes('माझी') || message.includes('काय') || language === 'mr');
```
This ensures that Marathi specific auxiliary verbs (`आहे`, `नाही`) are properly attributed, while standard Devanagari routes to Hindi models.

---

## 4. Voice UX Guidelines & Safety Grounding

Because synthesized medical answers are spoken aloud to patients, the system prompt enforces strict voice UX rules:

1. **Short, Conversational Sentences**: Limited to 1 to 3 spoken sentences.
2. **Zero Markdown Elements**: No asterisks, bolding, hashes, bullets, or tables, as screen-readers and TTS engines pronounce punctuation awkwardly.
3. **Clinical Guardrails**:
   - Explicitly cites the prescribing physician (e.g., *"According to Dr. Alok Mehta..."*).
   - Never advises changing dosages without consulting the physician.
   - Refuses off-topic questions outside the patient's records.

---

## 5. Interruption & Barge-In Protocol

In conversational voice systems, patients often need to stop an assistant mid-sentence to correct a misunderstanding or ask a follow-up. 

SaurAssistant implements immediate barge-in:
```typescript
const stopAllAudio = () => {
  if (currentAudioRef.current) {
    currentAudioRef.current.pause();
    currentAudioRef.current.currentTime = 0;
    currentAudioRef.current = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (status === 'speaking') {
    setStatus('idle');
  }
};
```
Whenever the user clicks the microphone button, enters text, or when the voice recognition detects input, `stopAllAudio()` terminates all active sound channels instantly.
