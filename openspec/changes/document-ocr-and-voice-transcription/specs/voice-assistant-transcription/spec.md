# Spec Delta

## Purpose

The voice-assistant-transcription capability converts spoken patient queries into text for the SaurAssistant chat — via the browser's speech engine when available, or server-side Gemini transcription when the browser cannot reach its cloud speech service — so voice input works across browsers.

## ADDED Requirements

### Requirement: push-to-talk speech input

The system SHALL capture speech through a push-to-talk control in the SaurAssistant panel, showing a live waveform while listening and stopping on manual stop or on a detected final utterance.

#### Scenario: listening state

- **WHEN** the user taps the talk control and grants microphone access
- **THEN** the panel enters a listening state with a reactive waveform until stopped

#### Scenario: microphone denied

- **WHEN** microphone access is denied
- **THEN** the panel shows a permission guidance message and never attempts server fallback with empty audio

### Requirement: browser speech recognition as primary path

The system SHALL use the browser's SpeechRecognition engine for transcription with interim results when the browser provides it (Chrome/Edge).

#### Scenario: recognized speech

- **WHEN** the browser recognizer returns a final transcript
- **THEN** the parallel recording is discarded and the finalized text enters the chat pipeline exactly as spoken

### Requirement: server-side Gemini transcription fallback

The system SHALL record microphone audio in parallel with recognition and, when the browser recognizer fails with a connectivity-class error (`network` or `service-not-allowed`), SHALL transcribe the recorded audio server-side via Gemini over the `/ws/live-audio` WebSocket, then forward the transcribed text into the normal chat pipeline.

#### Scenario: browser cloud engine unavailable

- **WHEN** the browser fires a `network` or `service-not-allowed` recognition error and a recording exists
- **THEN** the client streams the recording to the WebSocket, receives a `transcription` message, and treats it as a spoken user query

#### Scenario: fallback failure surfaced honestly

- **WHEN** the WebSocket fallback fails, times out, or returns empty text
- **THEN** the panel shows an actionable error naming both the browser limitation and the fallback outcome, no fake input is injected

#### Scenario: server without Gemini credentials

- **WHEN** no API key is configured and a fallback is attempted
- **THEN** the server responds with an explicit `transcription_error` and the UI surfaces the actionable message

### Requirement: recognition error routing

The system SHALL map recognition error codes to distinct user-visible outcomes: permission denial guidance (`not-allowed`), fallback-enabled or final guidance for connectivity errors (`network`, `service-not-allowed`), silent suppression for `no-speech`, and the raw code surfaced for other codes.

#### Scenario: no speech detected

- **WHEN** the recognizer reports `no-speech`
- **THEN** no error toast is shown beyond the normal idle state

#### Scenario: unusual error code

- **WHEN** the recognizer reports any code outside the mapped set
- **THEN** the UI surfaces the code verbatim in an informational notice

### Requirement: recording lifecycle hygiene

The system SHALL stop and release the parallel recorder and microphone tracks on any listening end (success, stop tap, error, unmount), discarding chunks unless a fallback transcription consumes them.

#### Scenario: teardown after success

- **WHEN** a browser-recognized transcript completes the query
- **THEN** the recorder and microphone tracks are released and the recording chunks are discarded

#### Scenario: teardown after failed fallback

- **WHEN** fallback transcription fails or is abandoned
- **THEN** all audio state is cleaned up without leaking the next session's chunks

### Requirement: multilingual transcription support

The system SHALL transcribe spoken queries in English, Hindi, and Marathi, honoring explicit language selection and auto-detection, and with Devanagari script preserved in transcripts.

#### Scenario: Hindi speech via fallback

- **WHEN** a Hindi query is spoken on a browser using server-side fallback
- **THEN** the returned transcript is in Devanagari and enters the chat pipeline detected as Hindi
