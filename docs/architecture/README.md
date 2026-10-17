# MediScript Architecture Documentation & Vector Exports

This directory contains the authoritative architecture diagrams and distribution exports for the **MediScript Healthcare Continuity Platform**.

## Export Artifacts
- **Vector PDF Document:** [stack_communication_architecture.pdf](./stack_communication_architecture.pdf)
- **Standalone HTML Report:** [index.html](./index.html)
- **Specification Source:** [stack_communication_architecture.md](./stack_communication_architecture.md)

## Standalone Vector SVG Diagrams
1. **[high_level_stack_architecture.svg](./high_level_stack_architecture.svg)** - High-level system architecture and integration topology.
2. **[multimodal_prescription_ocr_flow.svg](./multimodal_prescription_ocr_flow.svg)** - Multimodal OCR ingestion sequence and 2D coordinate box parsing.
3. **[voice_assistant_push_to_talk_flow.svg](./voice_assistant_push_to_talk_flow.svg)** - Real-time WebSocket audio streaming and multilingual voice Q&A.
4. **[doctor_ephemeral_consent_flow.svg](./doctor_ephemeral_consent_flow.svg)** - Time-to-live consent grant and verbal PIN doctor view.
5. **[emergency_break_glass_flow.svg](./emergency_break_glass_flow.svg)** - Break-glass offline emergency pass and audit dispatch.
6. **[security_identity_boundaries.svg](./security_identity_boundaries.svg)** - Security, identity, and DPDP 2023 regulatory boundaries.

## Re-generating Exports
To re-compile all SVG diagrams, HTML, and PDF distribution files:
```bash
npm run export:docs
```
