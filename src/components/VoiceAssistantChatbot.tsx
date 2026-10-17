import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Trash2,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Languages,
  Square,
} from 'lucide-react';
import { BulbSeedIcon, ThemedSproutLoader } from './BulbasaurThemeAssets';
import { PatientProfile, UnifiedMedication, UnifiedAllergy, UnifiedCondition } from '../types/fhir';

export type SupportedLanguage = 'auto' | 'en' | 'hi' | 'mr';

interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  lang?: 'en' | 'hi' | 'mr';
  timestamp: string;
}

interface VoiceAssistantChatbotProps {
  patient: PatientProfile;
  medications: UnifiedMedication[];
  allergies: UnifiedAllergy[];
  conditions: UnifiedCondition[];
}

export const VoiceAssistantChatbot: React.FC<VoiceAssistantChatbotProps> = ({
  patient,
  medications,
  allergies,
  conditions,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('auto');
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Namaste! I am SaurAssistant (सौर-सहायक), your nature-inspired health companion. Ask me about your medications, allergies, or lab results in English, हिन्दी, or मराठी.',
      lang: 'en',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Audio Context and Recognition Refs
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const pendingAudioChunksRef = useRef<Blob[]>([]);
  const finalResultRef = useRef(false);
  const recordingCapRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');

  // Keep statusRef in sync so async closures tear down against live status
  useEffect(() => {
    statusRef.current = status;
  });

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, interimTranscript, status]);

  // Escape key listener to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopAllAudio();
        void finalizeRecording();
        stopListening();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (recordingCapRef.current) {
        clearTimeout(recordingCapRef.current);
        recordingCapRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
        mediaRecorderRef.current = null;
        pendingAudioChunksRef.current = [];
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Stop any playing audio immediately (Barge-in / Interruption)
  const stopAllAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (statusRef.current === 'speaking') {
      setStatus('idle');
    }
  };

  // Setup Web Speech Recognition with chosen or detected language
  const getRecognitionLang = (lang: SupportedLanguage): string => {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'mr':
        return 'mr-IN';
      case 'en':
        return 'en-IN';
      default:
        // Default to en-IN with multilingual tolerance
        return 'en-IN';
    }
  };

  // Finalize the parallel recording and hand its blob back for fallback transcription
  const finalizeRecording = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        mediaRecorderRef.current = null;
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const blob = new Blob(pendingAudioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        mediaRecorderRef.current = null;
        pendingAudioChunksRef.current = [];
        resolve(blob.size > 0 ? blob : null);
      };
      try {
        recorder.stop();
      } catch {
        mediaRecorderRef.current = null;
        resolve(null);
      }
    });

  // Server-side transcription over /ws/live-audio (Gemini, when browser STT fails)
  const transcribeWithGemini = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${proto}//${window.location.host}/ws/live-audio`);
      let settled = false;

      const fail = (message: string) => {
        if (settled) return;
        settled = true;
        try {
          ws.close();
        } catch {}
        reject(new Error(message));
      };
      const done = (text: string) => {
        if (settled) return;
        settled = true;
        try {
          ws.close();
        } catch {}
        resolve(text);
      };
      const guard = setTimeout(() => fail('Transcription timed out'), 20000);

      ws.onerror = () => {
        clearTimeout(guard);
        fail('Transcription connection failed');
      };
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'transcribe-start',
            lang: selectedLang,
            mimeType: blob.type.split(';')[0] || 'audio/webm',
          })
        );
        blob.arrayBuffer().then((buf) => ws.send(buf));
      };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'transcription') {
            clearTimeout(guard);
            done(String(msg.text || ''));
          } else if (msg.type === 'transcription_error') {
            clearTimeout(guard);
            fail(String(msg.error || 'Transcription failed'));
          }
        } catch {
          // Ignore malformed frames
        }
      };
      ws.onclose = () => {
        clearTimeout(guard);
        fail('Connection closed before transcription completed');
      };
    });

  // Manual stop (tap/cap): finalize the recording FIRST, then tear the
  // session down. If no browser final transcript arrived, transcribe the
  // recording via Gemini; a null blob (recorder never started) stops silently.
  const handleStopTap = async () => {
    const finalArrived = finalResultRef.current;
    const blob = await finalizeRecording();
    stopListening();
    if (finalArrived) return;
    if (!blob) return;
    setStatus('thinking');
    try {
      const text = (await transcribeWithGemini(blob)).trim();
      if (text) {
        handleUserQuery(text);
        return;
      }
    } catch (e) {
      console.warn('Manual stop transcription notice:', e);
    }
    setStatus('idle');
    setErrorMessage('Voice input stopped without a recognized phrase. Please try again in Google Chrome or re-record.');
  };

  // Start Mic Listening with Audio Waveform Visualizer
  const startListening = async () => {
    stopAllAudio();
    if (statusRef.current === 'listening') return;
    finalResultRef.current = false;
    setErrorMessage(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition && selectedLang !== 'auto') {
      setErrorMessage('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    try {
      // Connect Microphone for AnalyserNode Visualizer
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      microphoneStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Record mic audio in parallel so Gemini server-side transcription can be
      // used when the browser's cloud SpeechRecognition is unavailable
      // (Brave, BrowserOS, or Chromium builds without bundled speech keys)
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm')) {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
        const recorder = new MediaRecorder(stream, { mimeType });
        pendingAudioChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) pendingAudioChunksRef.current.push(e.data);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        recordingCapRef.current = setTimeout(async () => {
          if (statusRef.current !== 'listening') return;
          await handleStopTap();
        }, 4 * 60 * 1000);
      }

      // Enter the listening state immediately — recognition.onstart also sets
      // it where browser STT is active; 'auto' mode relies on this line alone.
      setStatus('listening');

      // Loop to update audio waveform level
      const updateWaveform = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      updateWaveform();

      // Configure Speech Recognition — skipped entirely in 'auto' mode:
      // browser cloud STT is not used, only the parallel recording is kept and
      // finalized via the manual stop tap (handleStopTap) or the 4-minute cap.
      if (selectedLang !== 'auto') {
        const recognition = new SpeechRecognition();
        recognition.lang = getRecognitionLang(selectedLang);
        recognition.interimResults = true;
        recognition.continuous = false;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
          setStatus('listening');
          setInterimTranscript('');
        };

        recognition.onresult = (event: any) => {
          let final = '';
          let interim = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          setInterimTranscript(interim);

          if (final.trim()) {
            finalResultRef.current = true;
            void finalizeRecording();
            stopListening();
            handleUserQuery(final.trim());
          }
        };

        recognition.onerror = async (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          // Finalize the parallel recording before stopListening tears it down
          const recordedBlob = await finalizeRecording();
          stopListening();
          if (event.error === 'not-allowed') {
            setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser settings.');
          } else if (event.error === 'network' || event.error === 'service-not-allowed') {
            // Brave / BrowserOS / Chromium builds lack the browser cloud speech
            // engine — fall back to Gemini transcription of the recorded audio
            try {
              if (recordedBlob) {
                setStatus('thinking');
                const text = (await transcribeWithGemini(recordedBlob)).trim();
                if (text) {
                  handleUserQuery(text);
                  return;
                }
              }
            } catch (fallbackErr) {
              console.warn('Gemini transcription fallback notice:', fallbackErr);
            }
            setStatus('idle');
            setErrorMessage(
              'Voice input is unavailable in this browser: its cloud speech engine was unreachable (common in Brave, BrowserOS, and some Chromium builds), and Gemini transcription did not return a result. Type your question below, or open MediScript in Google Chrome for voice input.'
            );
          } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setErrorMessage(`Audio input notice: ${event.error}`);
          }
        };

        recognition.onend = () => {
          if (statusRef.current === 'listening') {
            stopListening();
          }
        };

        recognition.start();
      }
    } catch (err: any) {
      console.error('Mic access error:', err);
      stopListening();
      setErrorMessage('Could not open microphone. Please check system permissions.');
    }
  };

  // Stop Listening and Release Stream
  const stopListening = () => {
    if (recordingCapRef.current) {
      clearTimeout(recordingCapRef.current);
      recordingCapRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      mediaRecorderRef.current = null;
      pendingAudioChunksRef.current = [];
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
    }
    setAudioLevel(0);
    setInterimTranscript('');
    if (statusRef.current === 'listening') {
      setStatus('idle');
    }
    finalResultRef.current = false;
  };

  // Send Query to Backend & Speak Back Response
  const handleUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    // Detect user query language
    let userLang: 'en' | 'hi' | 'mr' = 'en';
    if (/[\u0900-\u097F]/.test(queryText)) {
      if (queryText.includes('आहे') || queryText.includes('माझे') || queryText.includes('काय') || selectedLang === 'mr') {
        userLang = 'mr';
      } else {
        userLang = 'hi';
      }
    } else if (selectedLang !== 'auto') {
      userLang = selectedLang as any;
    }

    const userMessage: VoiceMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      lang: userLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setStatus('thinking');

    try {
      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: selectedLang,
          patientContext: {
            name: patient.fullName,
            age: patient.age,
            bloodGroup: patient.bloodGroup,
            medications: medications.map((m) => `${m.brandName} (${m.genericName} ${m.strength}) - ${m.sigTranslated}`),
            allergies: allergies.map((a) => `${a.substance} (${a.manifestation})`),
            conditions: conditions.map((c) => c.code.text),
            recentLabs: 'HbA1c: 6.9%, BP: 128/82, Serum Creatinine: 1.12 mg/dL',
            emergencyContact: `${patient.emergencyContact.name} (${patient.emergencyContact.phone})`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      const replyText = result.replyText || 'I have noted your request.';
      const detectedReplyLang: 'en' | 'hi' | 'mr' = result.detectedLanguage || userLang;

      const botMessage: VoiceMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        lang: detectedReplyLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Play Voice Output (Gemini TTS audio or Browser SpeechSynthesis)
      if (!isMuted) {
        setStatus('speaking');
        if (result.audioBase64) {
          playBase64WavAudio(result.audioBase64);
        } else {
          speakWithBrowserTts(replyText, detectedReplyLang);
        }
      } else {
        setStatus('idle');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setStatus('idle');
      const errReply: VoiceMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I could not process the voice request right now. Please check your internet connection or type your question.',
        lang: 'en',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errReply]);
    }
  };

  // Play Base64 WAV from Gemini TTS
  const playBase64WavAudio = (base64Audio: string) => {
    stopAllAudio();
    const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
    currentAudioRef.current = audio;

    audio.onended = () => {
      setStatus('idle');
      currentAudioRef.current = null;
    };

    audio.onerror = () => {
      console.warn('Audio playback error, falling back to browser speech synthesis');
      setStatus('idle');
    };

    audio.play().catch((err) => {
      console.warn('Autoplay notice:', err);
      setStatus('idle');
    });
  };

  // Fallback to browser SpeechSynthesis in matching language
  const speakWithBrowserTts = (text: string, lang: 'en' | 'hi' | 'mr') => {
    if (!('speechSynthesis' in window)) {
      setStatus('idle');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    if (lang === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setStatus('idle');
    };

    utterance.onerror = () => {
      setStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Chatbot Leaf/Bulb Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-tr from-[#0F3D2E] via-[#3FA796] to-[#7BC96F] text-white shadow-2xl animate-bulb-glow hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 group"
          aria-label="Open SaurAssistant Voice Companion"
        >
          <div className="relative">
            <BulbSeedIcon size={26} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#E4572E] border-2 border-[#0F3D2E]" />
          </div>
          <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline text-[#F4FAF3]">
            SaurAssistant Voice
          </span>
        </button>
      )}

      {/* Floating Chat Panel (Glassmorphism & Nature Theming) */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[85vh] h-[640px] flex flex-col rounded-3xl glass-panel shadow-2xl border border-[#3FA796]/30 overflow-hidden font-sans">
          {/* Top Bar Header with Bulb Branding */}
          <div className="p-4 bg-gradient-to-r from-[#0F3D2E] via-[#12382B] to-[#1E4D3C] text-white flex items-center justify-between border-b border-[#3FA796]/30">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-[#3FA796]/20 border border-[#4CB8A4]/40 flex items-center justify-center">
                <BulbSeedIcon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-[#F4FAF3]">SaurAssistant</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#7BC96F]/20 text-[#B8E986] border border-[#7BC96F]/30">
                    Voice-to-Voice
                  </span>
                </div>
                <p className="text-[10px] text-[#95BDB0]">
                  Multilingual AI (EN · हिन्दी · मराठी)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title={isMuted ? 'Unmute voice replies' : 'Mute voice replies'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#7BC96F]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopAllAudio();
                  setMessages([]);
                }}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  stopAllAudio();
                  setIsOpen(false);
                }}
                className="p-1.5 text-slate-300 hover:text-[#E4572E] rounded-lg hover:bg-white/10 transition-colors font-bold"
                aria-label="Close voice assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language Selector Bar (English, Hindi, Marathi, Auto-Detect) */}
          <div className="px-4 py-2 bg-[#EDF7F1]/80 dark:bg-[#0E241C] border-b border-[#3FA796]/15 flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-[#4B6E60] dark:text-[#95BDB0] flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-[#3FA796]" />
              <span>Speaking Language:</span>
            </span>

            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'auto', label: 'Auto' },
                  { id: 'en', label: 'EN' },
                  { id: 'hi', label: 'हिन्दी' },
                  { id: 'mr', label: 'मराठी' },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelectedLang(lang.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    selectedLang === lang.id
                      ? 'bg-[#3FA796] text-white shadow-sm'
                      : 'text-[#4B6E60] dark:text-[#95BDB0] hover:bg-[#3FA796]/15'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Stream */}
          <div
            ref={chatScrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4FAF3]/60 dark:bg-[#0B1F18]/80 text-xs"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed space-y-1 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#0F3D2E] to-[#1E4D3C] text-white rounded-tr-none'
                      : 'bg-white dark:bg-[#122B22] border border-[#3FA796]/20 text-[#0F3D2E] dark:text-[#F4FAF3] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-between gap-2 pt-1 text-[10px] opacity-75 font-mono">
                    <span className="uppercase font-bold tracking-wider">{msg.lang || 'EN'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Interim Transcript while speaking */}
            {interimTranscript && (
              <div className="flex flex-col items-end">
                <div className="max-w-[85%] rounded-2xl p-2.5 bg-[#3FA796]/20 border border-[#3FA796]/40 text-[#0F3D2E] dark:text-[#F4FAF3] text-xs italic">
                  <span>{interimTranscript}</span>
                  <span className="inline-block w-1.5 h-3 ml-1 bg-[#3FA796] animate-pulse" />
                </div>
              </div>
            )}

            {/* Thinking / Sprout Loading State */}
            {status === 'thinking' && (
              <ThemedSproutLoader label="Consulting medical records in English, हिन्दी, मराठी..." />
            )}

            {/* Speaking State Indicator */}
            {status === 'speaking' && (
              <div className="flex items-center gap-2 text-xs text-[#3FA796] dark:text-[#7BC96F] p-2 bg-[#3FA796]/10 rounded-xl border border-[#3FA796]/20">
                <Volume2 className="w-4 h-4 animate-bounce text-[#3FA796]" />
                <span className="font-semibold">SaurAssistant is speaking (Tap Stop or Mic to interrupt)</span>
                <button
                  type="button"
                  onClick={stopAllAudio}
                  className="ml-auto p-1 text-rose-500 hover:text-rose-600 font-bold text-xs"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Error Message Toast */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-400 hover:text-rose-200 font-bold"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* Voice-First Primary Controller: Large Push-to-Talk Button & Waveform */}
          <div className="p-4 bg-white/90 dark:bg-[#122B22]/95 border-t border-[#3FA796]/20 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-full relative">
              {/* Animated Waveform Rings when listening */}
              {status === 'listening' && (
                <div
                  className="absolute w-20 h-20 rounded-full bg-[#3FA796]/30 animate-ping pointer-events-none"
                  style={{ transform: `scale(${1 + audioLevel / 100})` }}
                />
              )}

              {/* Large Push-To-Talk Mic Button */}
              {status === 'speaking' ? (
                <button
                  type="button"
                  onClick={stopAllAudio}
                  className="w-16 h-16 rounded-full bg-[#E4572E] text-white flex flex-col items-center justify-center shadow-lg hover:bg-[#D0451C] transition-all hover:scale-105"
                  title="Interrupt speaking"
                >
                  <Square className="w-6 h-6 fill-white" />
                  <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Stop</span>
                </button>
              ) : status === 'listening' ? (
                <button
                  type="button"
                  onClick={stopListening}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#3FA796] to-[#7BC96F] text-white flex flex-col items-center justify-center shadow-lg shadow-[#3FA796]/50 animate-pulse hover:scale-105 transition-transform"
                  title="Tap when finished speaking"
                >
                  <Mic className="w-6 h-6" />
                  <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Listening</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startListening}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0F3D2E] via-[#3FA796] to-[#7BC96F] text-white flex flex-col items-center justify-center shadow-lg shadow-[#0F3D2E]/30 hover:scale-105 active:scale-95 transition-all group"
                  title="Tap to speak in English, Hindi, or Marathi"
                >
                  <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider text-[#B8E986]">
                    Tap to Talk
                  </span>
                </button>
              )}
            </div>

            {/* Quick Context Prompt Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-[#4B6E60] dark:text-[#95BDB0]">
              <button
                type="button"
                onClick={() => handleUserQuery('What active medicines am I taking?')}
                className="px-2 py-0.5 rounded-full bg-[#3FA796]/10 hover:bg-[#3FA796]/20 text-[#0F3D2E] dark:text-[#F4FAF3] transition-colors"
              >
                "My medications?"
              </button>
              <button
                type="button"
                onClick={() => handleUserQuery('मेरी कौन सी दवाओं से एलर्जी है?')}
                className="px-2 py-0.5 rounded-full bg-[#3FA796]/10 hover:bg-[#3FA796]/20 text-[#0F3D2E] dark:text-[#F4FAF3] transition-colors"
              >
                "मेरी एलर्जी?" (हिन्दी)
              </button>
              <button
                type="button"
                onClick={() => handleUserQuery('माझी रक्तातील साखरेची पातळी काय आहे?')}
                className="px-2 py-0.5 rounded-full bg-[#3FA796]/10 hover:bg-[#3FA796]/20 text-[#0F3D2E] dark:text-[#F4FAF3] transition-colors"
              >
                "माझी साखर?" (मराठी)
              </button>
            </div>

            {/* Secondary Text Input Fallback */}
            <div className="w-full flex items-center gap-2 pt-1 border-t border-[#3FA796]/15">
              <input
                type="text"
                placeholder="Or type in English, हिन्दी, मराठी..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && textInput.trim()) {
                    handleUserQuery(textInput);
                    setTextInput('');
                  }
                }}
                className="flex-1 bg-[#F4FAF3] dark:bg-[#0B1F18] border border-[#3FA796]/25 rounded-xl px-3 py-1.5 text-xs text-[#0F3D2E] dark:text-[#F4FAF3] placeholder:text-[#4B6E60]/60 dark:placeholder:text-[#95BDB0]/60 focus:outline-none focus:border-[#3FA796]"
              />
              <button
                type="button"
                onClick={() => {
                  if (textInput.trim()) {
                    handleUserQuery(textInput);
                    setTextInput('');
                  }
                }}
                className="p-2 rounded-xl bg-[#3FA796] hover:bg-[#4CB8A4] text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
