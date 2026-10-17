// Round-trip test for /ws/live-audio Gemini transcription:
// 1. Ask /api/voice-chat for a reply (pairs with Gemini TTS audio)
// 2. Send that audio to the WS transcriber
// 3. Confirm the transcription comes back
const base = 'http://localhost:3004';

const chat = await fetch(base + '/api/voice-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'What active medicines am I taking?', language: 'en' }),
}).then((r) => r.json());

console.log('replyText:', chat.replyText);
console.log('mimeType:', chat.mimeType, 'audio bytes:', chat.audioBase64?.length ?? 0);

if (!chat.audioBase64) {
  console.error('no audio from TTS - cannot round-trip');
  process.exit(1);
}
const audio = Buffer.from(chat.audioBase64, 'base64');

const ws = new WebSocket('ws://localhost:3004/ws/live-audio');
ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'transcribe-start', lang: 'en', mimeType: 'audio/wav' }));
  ws.send(audio);
};
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  console.log('WS:', msg);
  if (msg.type === 'transcription' || msg.type === 'transcription_error') {
    process.exit(msg.type === 'transcription' && msg.text ? 0 : 1);
  }
};
ws.onerror = () => {
  console.error('ws error');
  process.exit(1);
};
setTimeout(() => {
  console.error('timeout waiting for transcription');
  process.exit(1);
}, 45000);
