import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Image as ImageIcon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface WhatsAppIngestionSimulatorProps {
  onLoadScriptToStudio: (sampleId: string) => void;
  onUploadImage: (base64: string, mimeType: string) => void;
  isProcessing: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  timestamp: string;
  text?: string;
  imageUrl?: string;
  isDocument?: boolean;
  docTitle?: string;
  botPayload?: {
    qualityCheck: string;
    compressionWarning?: string;
    extractedPrescriber: string;
    extractedMeds: string[];
    confidence: number;
    safetyFlag?: string;
    actionSampleId: string;
  };
}

export const WhatsAppIngestionSimulator: React.FC<WhatsAppIngestionSimulatorProps> = ({
  onLoadScriptToStudio,
  onUploadImage,
  isProcessing,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      timestamp: '11:42 AM',
      imageUrl: 'https://placehold.co/600x400/1e293b/white?text=Apollo+Hospitals+Cardiology+Prescription',
      docTitle: 'Apollo_Cardiology_Oct2026.jpg',
      text: 'Hi Sutra / MediScript, here is the new prescription from Dr. Alok Mehta at Apollo. Please add it to my father’s record.',
    },
    {
      id: 'msg-2',
      sender: 'bot',
      timestamp: '11:42 AM',
      text: 'Received! Analyzing medical document with Gemini Multimodal Vision AI...',
      botPayload: {
        qualityCheck: 'Resolution: 1840x2400 (300 DPI) · High Contrast Ink Verified',
        compressionWarning: 'WhatsApp standard compression detected (downsampled from source camera). Text remains 96% legible.',
        extractedPrescriber: 'Dr. Alok Mehta, DM (Cardiology) · Apollo Hospitals, Delhi',
        extractedMeds: ['Telma-H (Telmisartan 40mg + HCTZ 12.5mg)', 'Rosuvas 10 (Rosuvastatin 10mg)', 'Ecosprin 75 (Aspirin 75mg)'],
        confidence: 96.8,
        safetyFlag: 'Safety Notice: Cross-referenced with active Dolo 650 and Combiflam. Review for potential duplicate paracetamol.',
        actionSampleId: 'sample-cardio',
      },
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');

  const handleSendSimulatedScript = (type: 'cardio' | 'respiratory' | 'pediatric') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let docTitle = 'Prescription_DrMehta.jpg';
    let sampleId = 'sample-cardio';
    let prescriber = 'Dr. Alok Mehta · Apollo Hospitals';
    let meds = ['Telma-H (Telmisartan 40mg + HCTZ 12.5mg)', 'Rosuvas 10'];

    if (type === 'respiratory') {
      docTitle = 'Rx_DrEvelynVance.jpg';
      sampleId = 'sample-respiratory';
      prescriber = 'Dr. Evelyn Vance · Metro Health';
      meds = ['Azithromycin 250mg Z-Pak', 'Benzonatate 100mg'];
    } else if (type === 'pediatric') {
      docTitle = 'Augmentin_Pediatric_Rx.jpg';
      sampleId = 'sample-pediatric';
      prescriber = 'Dr. Sarah Jenkins · Children’s Memorial';
      meds = ['Augmentin 400mg/5mL oral suspension'];
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: time,
      docTitle,
      text: `Sent ${docTitle} from hospital OPD counter.`,
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        timestamp: time,
        text: 'Document parsed successfully with FHIR R4 bounding grid!',
        botPayload: {
          qualityCheck: 'Image Resolution Verified: 300 DPI · Clean Letterhead',
          extractedPrescriber: prescriber,
          extractedMeds: meds,
          confidence: 95.4,
          actionSampleId: sampleId,
        },
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Educational Context & Ingest Trigger (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17483A] dark:text-teal-400 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp-First Ingestion</span>
          </div>

          <h3 className="text-sm font-bold text-[#1B2A22] dark:text-white tracking-tight">The Frictionless Patient Intake Flow</h3>
          <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
            In India, over 70% of digital medical exchanges occur over WhatsApp. Patients take a photo of doctor handwriting or forward lab PDFs without opening a portal.
          </p>

          <div className="pt-3 border-t border-[#C9A24B]/20 dark:border-slate-800 space-y-2 text-xs text-[#3D5A4C] dark:text-slate-400">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4D3B] dark:text-teal-400 shrink-0 mt-0.5" />
              <span>Detects image compression loss and advises sending as uncompressed document</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4D3B] dark:text-teal-400 shrink-0 mt-0.5" />
              <span>Multimodal Vision AI returns itemized pills and confidence scores in 2 seconds</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4D3B] dark:text-teal-400 shrink-0 mt-0.5" />
              <span>Machine extracts, patient confirms before committing to permanent health timeline</span>
            </div>
          </div>
        </div>

        {/* Quick Test Presets */}
        <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl p-4 space-y-2.5 shadow-sm">
          <h4 className="text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3]">Simulate Incoming WhatsApp Documents</h4>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleSendSimulatedScript('cardio')}
              className="w-full text-left px-3 py-2 bg-white dark:bg-slate-950 hover:bg-[#F3EBD3] dark:hover:bg-slate-850 border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg text-xs transition-colors flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-bold text-[#1B2A22] dark:text-slate-200">Apollo Cardiology Script</p>
                <p className="text-[11px] text-[#3D5A4C] dark:text-slate-400 font-medium">Telma-H + Rosuvas 10</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#3D5A4C] dark:text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => handleSendSimulatedScript('respiratory')}
              className="w-full text-left px-3 py-2 bg-white dark:bg-slate-950 hover:bg-[#F3EBD3] dark:hover:bg-slate-850 border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg text-xs transition-colors flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-bold text-[#1B2A22] dark:text-slate-200">Acute Respiratory Prescription</p>
                <p className="text-[11px] text-[#3D5A4C] dark:text-slate-400 font-medium">Azithromycin + Benzonatate</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#3D5A4C] dark:text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => handleSendSimulatedScript('pediatric')}
              className="w-full text-left px-3 py-2 bg-white dark:bg-slate-950 hover:bg-[#F3EBD3] dark:hover:bg-slate-850 border border-[#C9A24B]/30 dark:border-slate-800 rounded-lg text-xs transition-colors flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-bold text-[#1B2A22] dark:text-slate-200">Pediatric Suspension Script</p>
                <p className="text-[11px] text-[#3D5A4C] dark:text-slate-400 font-medium">Augmentin 400mg/5mL oral susp</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#3D5A4C] dark:text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: WhatsApp Interactive Phone Chat Canvas (8 cols) */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-[#C9A24B]/35 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
        {/* WhatsApp Chat Header */}
        <div className="bg-[#17483A] dark:bg-emerald-950/80 border-b border-[#2D6A4F]/40 dark:border-emerald-900/60 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-white text-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white tracking-tight">MediScript Health Assistant</h4>
                <ShieldCheck className="w-3.5 h-3.5 text-[#7BC96F] dark:text-emerald-400" />
              </div>
              <p className="text-[11px] text-[#C5E99B] dark:text-emerald-300/80">Verified Healthcare Ingestion Service</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#C5E99B] dark:text-emerald-400/80 font-bold">DPDP Act 2023 Compliant</span>
        </div>

        {/* Chat Stream Viewport */}
        <div className="p-5 space-y-4 max-h-[520px] overflow-y-auto bg-[#F3EBD3]/35 dark:bg-slate-950/90 font-sans">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-[#17483A] dark:bg-emerald-900/40 border border-[#2D6A4F]/60 dark:border-emerald-800/60 text-white dark:text-emerald-100 rounded-tr-none shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-[#C9A24B]/30 dark:border-slate-800 text-[#1B2A22] dark:text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                {msg.docTitle && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-black/10 dark:bg-black/20 border border-black/10 dark:border-white/10 text-xs font-mono font-bold">
                    <FileText className="w-4 h-4 text-[#1E4D3B] dark:text-emerald-400" />
                    <span>{msg.docTitle}</span>
                  </div>
                )}

                {msg.text && <p className="font-medium">{msg.text}</p>}

                {msg.botPayload && (
                  <div className="space-y-3 pt-2 border-t border-[#C9A24B]/20 dark:border-slate-800">
                    {/* Quality inspection */}
                    <div className="bg-[#FAF6EA] dark:bg-slate-950/80 rounded-lg p-2.5 space-y-1 font-mono text-[11px] text-[#3D5A4C] dark:text-slate-400 border border-[#C9A24B]/30 dark:border-slate-800">
                      <p className="text-[#17483A] dark:text-teal-400 font-bold">{msg.botPayload.qualityCheck}</p>
                      {msg.botPayload.compressionWarning && (
                        <p className="text-amber-800 dark:text-amber-400/90 text-[10px] font-bold">{msg.botPayload.compressionWarning}</p>
                      )}
                    </div>

                    {/* Extracted overview */}
                    <div className="space-y-1.5">
                      <p className="text-[#3D5A4C] dark:text-slate-400 font-bold">
                        Prescriber: <span className="text-[#1B2A22] dark:text-white font-bold">{msg.botPayload.extractedPrescriber}</span>
                      </p>
                      <p className="text-[#3D5A4C] dark:text-slate-400 font-bold">Extracted Medicines:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-[#1B2A22] dark:text-slate-300 pl-1">
                        {msg.botPayload.extractedMeds.map((m, idx) => (
                          <li key={idx} className="font-mono text-[11px] font-medium">
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {msg.botPayload.safetyFlag && (
                      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg p-2 text-rose-900 dark:text-rose-300 text-[11px] flex items-start gap-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span>{msg.botPayload.safetyFlag}</span>
                      </div>
                    )}

                    {/* One-tap review button */}
                    <button
                      type="button"
                      onClick={() => onLoadScriptToStudio(msg.botPayload!.actionSampleId)}
                      className="w-full py-2 px-3 bg-[#17483A] dark:bg-[#3FA796] hover:bg-[#2D6A4F] dark:hover:bg-[#4CB8A4] text-white dark:text-[#0E2A21] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B8E986] dark:text-[#0E2A21]" />
                      <span>Review in OCR Inspector (Machine Extracts, Human Confirms)</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[10px] text-[#3D5A4C] dark:text-slate-500 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'user' && <Check className="w-3 h-3 text-[#1E4D3B] dark:text-emerald-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="bg-[#FAF6EA] dark:bg-slate-900 border-t border-[#C9A24B]/30 dark:border-slate-800 p-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type message or paste medical script notes..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputPrompt.trim()) {
                const userMsg: ChatMessage = {
                  id: `msg-${Date.now()}`,
                  sender: 'user',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  text: inputPrompt,
                };
                setMessages((prev) => [...prev, userMsg]);
                setInputPrompt('');
              }
            }}
            className="flex-1 bg-white dark:bg-slate-950 border border-[#C9A24B]/35 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-[#1B2A22] dark:text-white placeholder:text-[#3D5A4C]/60 focus:outline-none focus:border-[#2D6A4F] dark:focus:border-teal-500"
          />
          <button
            type="button"
            onClick={() => {
              if (inputPrompt.trim()) {
                const userMsg: ChatMessage = {
                  id: `msg-${Date.now()}`,
                  sender: 'user',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  text: inputPrompt,
                };
                setMessages((prev) => [...prev, userMsg]);
                setInputPrompt('');
              }
            }}
            className="p-2 rounded-lg bg-[#17483A] dark:bg-[#3FA796] hover:bg-[#2D6A4F] text-white dark:text-[#0E2A21] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
