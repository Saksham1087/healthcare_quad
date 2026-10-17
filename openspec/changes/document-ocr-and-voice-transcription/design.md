# Design

## Context

The OCR capability is complete in code (`/api/scan-prescription` + scanner review studio) but was silent on error semantics — it falls back to simulated "calibrated fallback" data without telling the user the data is not their transcription. The voice assistant previously relied solely on the browser's cloud `SpeechRecognition`, which always fails with `network` in Brave/BrowserOS-style Chromium builds. The server-side Gemini transcription fallback (`/ws/live-audio` binary audio → text), the parallel mic recorder, and a round-trip test (`scripts/test-voice-ws.mjs`) were implemented in the working tree and verified at testing time. This change is mostly capture; the only behavioral code decisions are duplicated here from those discussions. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Record the transcription contract, entry-point map, and review flow as a testable spec.
- Make the OCR simulated-data fallback explicit in the UI (labeled simulated, not silent).
- Document the exact WebSocket transcription protocol the client and server now share.
- Route transcription errors deterministically so users see actionable guidance instead of raw codes.

**Non-Goals:**
- Streaming/interim server-side transcription (fallback is batch; the recorder holds audio until the "stop" event resolves).
- Bidirectional live-audio sessions over the WebSocket (it stays request/response per recording).
- Pending-OCR navigation badge (deferred thread, open for a later change).
- Changing the `/api/voice-chat` reply/TTS contract.

## Decisions

- **Fallback transcription rides the existing `/ws/live-audio` socket rather than a new REST endpoint.** The endpoint already exists and is the documented realtime surface; adding `transcribe-start` metadata then one binary frame keeps one protocol shape. Alternative: `POST /api/voice-transcribe` with base64 JSON — rejected as redundant surface and heavier payloads.
- **One recording per connection.** `transcribe-start` metadata (mimeType, language hint) and the binary audio share a per-connection `pendingMeta` keyed by connection, not by a map of upload ids. Seconds-long lifetime makes connection-scoped state sufficient.
- **Parallel recorder instead of switch-on-failure after the fact.** MediaRecorder starts alongside SpeechRecognition; finalizing before teardown in error paths guarantees audio exists for fallback. Alternative: start recording only after the recognizer errors — rejected, the captured speech is already gone by then.
- **Batch, not streaming, for fallback.** Brave fires `network` near-instantly; the interim transferability of a streaming session is not worth the protocol growth. Interim results in fallback are "thinking" state, not transcript.
- **Error routing table is a behavioral contract** (`not-allowed` / `network`+`service-not-allowed` / `no-speech` / anything else), spec'd because the UI meaning is observable.
- **OCR simulated fallback becomes explicit.** On transcription failure the UI notifies and labels the injected data as simulated so audit/clinician review never confuses fallback with real transcription.
- **Round-trip test reuses server TTS as STT input** — one Gemini call produces audio whose transcript is known text, giving a deterministic end-to-end check for `scripts/test-voice-ws.mjs` without audio fixtures.
- **Auto language routes cloud-first.** The browser SpeechRecognition engine cannot auto-detect a mid-session language switch (e.g. the user selecting Auto but speaking Hindi produces `en-IN`-biased results with transliterated or wrong-language text), so when the language selector is Auto the client skips the browser engine entirely and records directly to the server for Gemini transcription with language auto-detection; the parallel mic recorder becomes the primary input for Auto. Correctness beats having a native engine recognize nothing. Alternative: keep the browser engine and restart it in `hi-IN` whenever a Devanagari interim transcript appears — rejected as a fragile heuristic that fires on false positives and still misses every non-Devanagari language switch.
- **Teardown discipline: finalize before teardown, `statusRef` in place of stale state closures.** The audit showed a stale status closure in the recognizer's `onend` handler could re-open a session that manual stop had just torn down, and that garbage collection was missing on manual stop/Escape/unmount. Fixed by finalizing any pending recording immediately before teardown, gating end paths through a `statusRef` that always reflects the current state (never a captured closure), and adding an unmount effect that stops recognition and the recorder. Alternative: keep event-driven cleanup (`onend` self-manages stops) fire-and-forget — rejected, it leaves dangling mic sessions whenever events are delayed or dropped.
- **Bounded recording length: 4-minute soft cap auto-finalizes and attempts server transcription.** Without a `timeslice` cap, `MediaRecorder` can accumulate one ever-growing blob that becomes a single huge base64 payload on fallback, risking the ~20 MB Gemini inline-data limit and long upload stalls. A 4-minute soft cap finalizes the recording automatically and sends it to the server so speech is preserved. Alternative: a hard cut with no transcription (just stop and show "stopped at cap") — rejected because losing the patient's spoken query mid-sentence is worse than a slightly longer batch upload.

## Risks / Trade-offs

- [Browser sends `audio/webm; codecs=opus`] → Gemini expects plain MIME; the client strips codec params before sending (`split(';')[0]`).
- [One-off latency on fallback vs browser STT] → acceptable for a push-to-talk single utterance; interim remains browser-only.
- [User blocks WebSocket egress] → round-trip test and the actionable error message distinguish "browser limitation" from "server unreachable".
- [MIME mismatch on wav from TTS test] → ws test sends explicit `audio/wav` in `transcribe-start`.
- [Timezone of recording] → recorder chunk buffer cleared every listening start; stale-buffer bug avoided by resetting on start and on teardown.

## Migration Plan

- No schema or API migrations; the WS contract extends an existing endpoint.
- Ship client + server together: older clients send only ping frames, unaffected.
- Rollback: revert the two files; WS reverts to ping-only, browser STT unchanged.

## Open Questions

- None blocking. Future thread: stream interim server transcripts once Brave-style browsers are the primary target.
