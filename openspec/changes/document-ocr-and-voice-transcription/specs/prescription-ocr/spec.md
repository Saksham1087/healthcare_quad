# Spec Delta

## Purpose

The Prescription & Lab OCR capability lets a patient capture a handwritten prescription or lab report (file or camera) and receive a structured transcription from Gemini Vision, which is reviewed and committed into their health record under clinical safety checks.

## ADDED Requirements

### Requirement: OCR entry points

The system SHALL provide Prescription OCR from at least four entry points: the "Prescription & Lab OCR" main navigation link, the header "Add Record" action (available from any active tab), the hero action cards, and the footer section index.

#### Scenario: opening the scanner from the header

- **WHEN** the user activates the scanner nav link or the Add Record action from any tab
- **THEN** an upload surface opens (modal or scanner tab) accepting image input

#### Scenario: mobile menu parity

- **WHEN** the viewport is below the desktop breakpoint and the navigation menu is opened
- **THEN** the OCR tab is reachable from the menu list

### Requirement: Gemini Vision transcription contract

The system SHALL submit the scanned image to the server-side Gemini Vision endpoint and receive a structured transcription containing, at minimum: patient identity, prescribing doctor and clinic, medication list with dosages, lab observations where present, and follow-up guidance.

#### Scenario: successful transcription

- **WHEN** a legible prescription image is submitted
- **THEN** the server returns a structured transcription rendered in the review studio with line-level detail

#### Scenario: transcription service unavailable

- **WHEN** the transcription backend is unreachable or fails
- **THEN** the UI explicitly presents the resulting data as simulated/not real transcription, never silently substitutes it as a genuine result

### Requirement: automatic patient profile matching

The system SHALL reconcile the transcribed patient name against existing patient profiles, auto-selecting a match or generating a new profile, and SHALL show which profile the transcription targets before commit.

#### Scenario: matching an existing patient

- **WHEN** a transcribed name matches an existing profile
- **THEN** the matched profile is selected and labeled as an existing match with its age and blood group

#### Scenario: creating a new patient

- **WHEN** no existing profile matches the transcribed name
- **THEN** a new profile is auto-generated and marked as newly created

### Requirement: unconfirmed provenance audit trail

The system SHALL log a `RECORD_INGEST` audit event with provenance tier `ocr-unconfirmed` at transcription time, before any human commit.

#### Scenario: audit before commit

- **WHEN** a transcription completes
- **THEN** an audit event records the ingest with the `ocr-unconfirmed` provenance tier on the target profile

### Requirement: review and commit flow

The system SHALL require human review of transcriptions in the scanner tab review studio (Prescription Viewer line inspection, Transcription Inspector, model diagnostics) before they are committed to the health record, with clinical safety checks applied at commit time.

#### Scenario: reviewing before commit

- **WHEN** a transcription is returned
- **THEN** the user can inspect, edit, and commit it in the scanner review studio; no transcription is auto-committed
