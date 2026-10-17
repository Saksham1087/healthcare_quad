# Spec Delta: bulbasaur-botanical-theme

## Purpose

Provides a soothing 19th-century vintage botanical aesthetic inspired by Bulbasaur to alleviate clinical anxiety and present medical continuity through organic metaphors.

## ADDED Requirements

### Requirement: Vintage Botanical Color Palette Tokens
The system SHALL apply parchment background (#FAF6EA), deep forest green (#14372C), moss (#0E2A21), herbal emerald (#2D6A4F), and medicinal gold (#C9A24B) tokens across all UI surfaces.

#### Scenario: Visual theme rendering
- **WHEN** the patient accesses the MediScript interface
- **THEN** the layout renders with warm herbal parchment background, dark forest panels, and gold botanical accents conforming to WCAG AA contrast standards

### Requirement: Split-Seed Pod Entry Animation
The system SHALL provide an interactive split-seed opening intro modal featuring two organic seed halves parting along a curved axis to reveal the healthcare platform.

#### Scenario: First-time user enters portal
- **WHEN** a user visits without a prior visit flag in localStorage
- **THEN** the split-seed modal displays with an Enter CTA and parted halves reveal the dashboard upon interaction

#### Scenario: User skips or has previously visited
- **WHEN** user clicks Skip or localStorage records that the intro was already viewed
- **THEN** the modal is dismissed and subsequent visits bypass the intro animation

### Requirement: Organic Sprout Loading Feedback
The system SHALL render an animated botanical seedling sprouting from soil in place of generic circular loading spinners during async OCR and AI inference operations.

#### Scenario: Prescription OCR scanning in progress
- **WHEN** a prescription image is submitted for Gemini analysis
- **THEN** the system displays the themed sprout loader with pulsing leaf growth animations

### Requirement: Reduced Motion Accessibility Compliance
The system SHALL respect the user's prefers-reduced-motion operating system setting by disabling seed pod parting and leaf pulsing transitions.

#### Scenario: Reduced motion enabled
- **WHEN** the user agent reports prefers-reduced-motion as reduce
- **THEN** the intro modal and sprout loader skip animated translations and appear statically
