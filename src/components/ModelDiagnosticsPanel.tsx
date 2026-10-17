import React from 'react';
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Clock,
  Sparkles,
  Scale,
  Hash,
} from 'lucide-react';
import { AIModelDetails, ConfidenceBreakdown, OCRQualityAssessment } from '../types/prescription';

interface ModelDiagnosticsProps {
  modelDetails: AIModelDetails;
  confidenceBreakdown: ConfidenceBreakdown;
  overallConfidence: number;
  ocrQuality: OCRQualityAssessment;
  sessionId: string;
}

export const ModelDiagnosticsPanel: React.FC<ModelDiagnosticsProps> = ({
  modelDetails,
  confidenceBreakdown,
  overallConfidence,
  ocrQuality,
  sessionId,
}) => {
  const categories = [
    { label: 'Prescriber & Clinic Header', score: confidenceBreakdown.doctorHeader },
    { label: 'Patient Record & Allergies', score: confidenceBreakdown.patientInfo },
    { label: 'Medication Names & Strengths', score: confidenceBreakdown.medications },
    { label: 'Latin Sig & Patient Instructions', score: confidenceBreakdown.instructionsSig },
    { label: 'Physician Signature & Stamp', score: confidenceBreakdown.signatureStamp },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Model Profile & Core Architecture */}
      <div className="p-6 rounded-xl bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C9A24B]/20 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2D6A4F]/15 border border-[#2D6A4F]/30 flex items-center justify-center text-[#1E4D3B] dark:text-[#52B788]">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#1B2A22] dark:text-white tracking-tight">
                  {modelDetails.modelName}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#2D6A4F]/15 text-[#1E4D3B] dark:text-[#B8E986] border border-[#2D6A4F]/25 font-bold">
                  Multimodal Vision OCR
                </span>
              </div>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
                {modelDetails.architecture}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-[#3D5A4C] dark:text-slate-400 block font-bold">
              OCR Session Identifier
            </span>
            <span className="font-mono text-xs text-[#17483A] dark:text-cyan-300 font-bold bg-white dark:bg-slate-950 px-2.5 py-1 rounded border border-[#C9A24B]/30 dark:border-slate-800 inline-block mt-0.5">
              {sessionId}
            </span>
          </div>
        </div>

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-3.5 rounded-lg bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-[#3D5A4C] dark:text-slate-400 mb-1 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Inference Latency</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#1B2A22] dark:text-white tabular-nums">
              {modelDetails.inferenceLatencyMs}
              <span className="text-xs text-[#3D5A4C] dark:text-slate-400 ml-1 font-sans">ms</span>
            </div>
            <div className="text-[11px] text-[#1E4D3B] dark:text-emerald-400 font-bold mt-1">
              End-to-end roundtrip
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-[#3D5A4C] dark:text-slate-400 mb-1 font-bold">
              <Layers className="w-3.5 h-3.5 text-[#1E4D3B] dark:text-cyan-400" />
              <span>Vision Token Input</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#1B2A22] dark:text-white tabular-nums">
              {modelDetails.promptTokens.toLocaleString()}
              <span className="text-xs text-[#3D5A4C] dark:text-slate-400 ml-1 font-sans">tokens</span>
            </div>
            <div className="text-[11px] text-[#3D5A4C] dark:text-slate-400 mt-1 font-medium">
              Image patches + instructions
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-[#3D5A4C] dark:text-slate-400 mb-1 font-bold">
              <FileCode2 className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
              <span>Transcription Output</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#1B2A22] dark:text-white tabular-nums">
              {modelDetails.candidateTokens.toLocaleString()}
              <span className="text-xs text-[#3D5A4C] dark:text-slate-400 ml-1 font-sans">tokens</span>
            </div>
            <div className="text-[11px] text-[#3D5A4C] dark:text-slate-400 mt-1 font-medium">
              Structured JSON schema
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-[#071711] border border-[#C9A24B]/30 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-[#3D5A4C] dark:text-slate-400 mb-1 font-bold">
              <Activity className="w-3.5 h-3.5 text-[#1E4D3B] dark:text-emerald-400" />
              <span>Overall Confidence</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#1E4D3B] dark:text-emerald-400 tabular-nums">
              {overallConfidence.toFixed(1)}%
            </div>
            <div className="text-[11px] text-[#2D6A4F] dark:text-emerald-300 font-bold mt-1">
              Weighted line average
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Breakdown by Document Zone */}
      <div className="p-6 rounded-xl bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 shadow-sm">
        <h4 className="text-sm font-bold text-[#1B2A22] dark:text-white tracking-tight uppercase tracking-wider mb-4 flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#1E4D3B] dark:text-cyan-400" />
          <span>OCR Confidence Distribution by Document Segment</span>
        </h4>

        <div className="space-y-3.5">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#1B2A22] dark:text-slate-300 font-semibold">{cat.label}</span>
                <span
                  className={`font-mono font-bold tabular-nums ${
                    cat.score >= 95
                      ? 'text-[#1E4D3B] dark:text-emerald-400'
                      : cat.score >= 90
                      ? 'text-[#2D6A4F] dark:text-cyan-400'
                      : 'text-amber-800 dark:text-amber-400'
                  }`}
                >
                  {cat.score.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EFE6CD] dark:bg-slate-950 overflow-hidden border border-[#C9A24B]/20 dark:border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.score >= 95
                      ? 'bg-gradient-to-r from-[#17483A] to-[#2D6A4F] dark:from-emerald-500 dark:to-cyan-400'
                      : cat.score >= 90
                      ? 'bg-gradient-to-r from-[#2D6A4F] to-[#52B788] dark:from-cyan-500 dark:to-amber-400'
                      : 'bg-amber-600 dark:bg-amber-500'
                  }`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optical & Document Quality Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document Physical Quality */}
        <div className="p-5 rounded-xl bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 shadow-sm">
          <h4 className="text-sm font-bold text-[#1B2A22] dark:text-white tracking-tight mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1E4D3B] dark:text-emerald-400" />
            <span>Optical Input Quality Diagnostics</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#C9A24B]/20 dark:border-slate-800">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Handwriting Legibility:</span>
              <span className="font-bold text-[#1B2A22] dark:text-white">{ocrQuality.legibility}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#C9A24B]/20 dark:border-slate-800">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Script Style:</span>
              <span className="font-bold text-[#1B2A22] dark:text-white">{ocrQuality.handwritingStyle}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#C9A24B]/20 dark:border-slate-800">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Ink Contrast &amp; Color:</span>
              <span className="font-bold text-[#1B2A22] dark:text-white">{ocrQuality.inkCondition}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#C9A24B]/20 dark:border-slate-800">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Background Noise &amp; Watermark:</span>
              <span className="font-bold text-[#1B2A22] dark:text-white">{ocrQuality.backgroundNoise}</span>
            </div>
            <div className="pt-2">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-bold block mb-1">Clinical Pharmacist Recommendation:</span>
              <p className="p-2.5 rounded bg-white dark:bg-slate-950 border border-[#C9A24B]/30 dark:border-slate-800 text-[#1B2A22] dark:text-slate-300 text-xs leading-relaxed shadow-sm">
                {ocrQuality.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* OCR Coordinate Engine & Grounding Metadata */}
        <div className="p-5 rounded-xl bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 shadow-sm">
          <h4 className="text-sm font-bold text-[#1B2A22] dark:text-white tracking-tight mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1E4D3B] dark:text-cyan-400" />
            <span>Spatial Engine &amp; Pharmaceutical Grounding</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#C9A24B]/20 dark:border-slate-800">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Coordinate Normalization:</span>
              <span className="font-mono text-[#17483A] dark:text-cyan-300 font-bold">{modelDetails.spatialBoundingSystem}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#C9A24B]/20 dark:border-slate-800">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Ontology Knowledge Base:</span>
              <span className="font-bold text-[#1B2A22] dark:text-white">{modelDetails.pharmacologyGrounding}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#C9A24B]/20 dark:border-slate-800">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Precision Servicing:</span>
              <span className="font-mono text-[#1B2A22] dark:text-white font-bold">{modelDetails.quantization}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#C9A24B]/20 dark:border-slate-800">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Scan Resolution / DPI:</span>
              <span className="font-mono text-[#1B2A22] dark:text-white font-bold">~{modelDetails.imageDpiEstimate} DPI ({modelDetails.imageDimensions})</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#C9A24B]/20 dark:border-slate-800">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Model Termination Flag:</span>
              <span className="font-mono text-[#1E4D3B] dark:text-emerald-400 font-bold">{modelDetails.finishReason}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#3D5A4C] dark:text-slate-400 font-medium">Inference Timestamp:</span>
              <span className="font-mono text-[#1B2A22] dark:text-slate-300 font-bold">{new Date(modelDetails.timestamp).toLocaleTimeString()} UTC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
