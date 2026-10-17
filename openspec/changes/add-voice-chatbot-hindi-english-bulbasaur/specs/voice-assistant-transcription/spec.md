# Spec Delta: voice-assistant-transcription

## Purpose

Enables patients to query their longitudinal medical history, prescriptions, and allergies through natural conversational voice and text in English and Hindi with clinical safety grounding.

## ADDED Requirements

### Requirement: Bilingual Speech-to-Text Transcription
The system SHALL capture user microphone input and transcribe spoken utterances into text in English (en-IN) and Hindi (hi-IN) with support for regional vernacular.

#### Scenario: Transcribing spoken English medication query
- **WHEN** user speaks "What medications am I taking for blood pressure?" in English
- **THEN** the system generates an interim and final English transcription and displays it in the message stream

#### Scenario: Transcribing spoken Hindi medication query
- **WHEN** user speaks "मेरी ब्लड प्रेशर की दवाई कौन सी है" in Hindi
- **THEN** the system transcribes the speech into Devanagari script text accurately

### Requirement: FHIR Context Grounded Clinical Dialogue
The system SHALL answer patient health queries strictly using the patient's verified FHIR records (active medications, allergies, diagnoses, emergency contacts) and SHALL NOT invent clinical advice.

#### Scenario: Querying active medications
- **WHEN** patient Rajesh Sharma asks about his current prescriptions
- **THEN** the assistant lists Telma-H and Glycomet-GP 2 and warns about consulting Dr. Alok Mehta before changing doses

#### Scenario: Querying documented drug allergies
- **WHEN** patient asks if they can take an antibiotic
- **THEN** the assistant highlights the documented severe Penicillin allergy and warns against beta-lactam antibiotics

### Requirement: Conversational Voice UX and Speech Synthesis
The system SHALL synthesize responses using natural spoken audio limited to 1 to 3 conversational sentences without markdown or bullet characters that impair audio playback.

#### Scenario: Spoken answer delivery
- **WHEN** the assistant generates a reply for speech delivery
- **THEN** the system plays natural audio via Gemini TTS or browser speech synthesis and renders clean text without asterisks or bullet marks

### Requirement: Immediate Barge-in Audio Cancellation
The system SHALL instantly terminate ongoing audio playback and speech synthesis when the user speaks, clicks the microphone button, or submits a new query.

#### Scenario: User interrupts speaking assistant
- **WHEN** the user presses the microphone button while SaurAssistant is actively speaking
- **THEN** audio playback stops immediately, speech synthesis cancels, and the assistant enters listening state

### Requirement: Full-Duplex WebSocket Audio Streaming
The system SHALL provide a WebSocket endpoint at `/ws/live-audio` supporting bi-directional connection, ping-pong heartbeat verification, and low-latency audio transmission.

#### Scenario: WebSocket client connection and heartbeat
- **WHEN** a client opens a connection to `/ws/live-audio` and sends a ping payload
- **THEN** the server accepts the connection and returns a pong acknowledgment payload
