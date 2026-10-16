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
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {modelDetails.modelName}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  Multimodal Vision OCR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {modelDetails.architecture}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
              OCR Session Identifier
            </span>
            <span className="font-mono text-xs text-cyan-300 font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block mt-0.5">
              {sessionId}
            </span>
          </div>
        </div>

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Inference Latency</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {modelDetails.inferenceLatencyMs}
              <span className="text-xs text-slate-400 ml-1 font-sans">ms</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              End-to-end roundtrip
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Vision Token Input</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {modelDetails.promptTokens.toLocaleString()}
              <span className="text-xs text-slate-400 ml-1 font-sans">tokens</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Image patches + instructions
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Transcription Output</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {modelDetails.candidateTokens.toLocaleString()}
              <span className="text-xs text-slate-400 ml-1 font-sans">tokens</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Structured JSON schema
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Overall Confidence</span>
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
              {overallConfidence.toFixed(1)}%
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-1">
              Weighted line average
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Breakdown by Document Zone */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
        <h4 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider mb-4 flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>OCR Confidence Distribution by Document Segment</span>
        </h4>

        <div className="space-y-3.5">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{cat.label}</span>
                <span
                  className={`font-mono font-bold tabular-nums ${
                    cat.score >= 95
                      ? 'text-emerald-400'
                      : cat.score >= 90
                      ? 'text-cyan-400'
                      : 'text-amber-400'
                  }`}
                >
                  {cat.score.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.score >= 95
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      : cat.score >= 90
                      ? 'bg-gradient-to-r from-cyan-500 to-amber-400'
                      : 'bg-amber-500'
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
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-sm font-bold text-white tracking-tight mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Optical Input Quality Diagnostics</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Handwriting Legibility:</span>
              <span className="font-semibold text-white">{ocrQuality.legibility}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Script Style:</span>
              <span className="font-semibold text-white">{ocrQuality.handwritingStyle}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Ink Contrast & Color:</span>
              <span className="font-semibold text-white">{ocrQuality.inkCondition}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Background Noise & Watermark:</span>
              <span className="font-semibold text-white">{ocrQuality.backgroundNoise}</span>
            </div>
            <div className="pt-2">
              <span className="text-slate-400 block mb-1">Clinical Pharmacist Recommendation:</span>
              <p className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                {ocrQuality.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* OCR Coordinate Engine & Grounding Metadata */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-sm font-bold text-white tracking-tight mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Spatial Engine & Pharmaceutical Grounding</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Coordinate Normalization:</span>
              <span className="font-mono text-cyan-300 font-semibold">{modelDetails.spatialBoundingSystem}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Ontology Knowledge Base:</span>
              <span className="font-semibold text-white">{modelDetails.pharmacologyGrounding}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Precision Servicing:</span>
              <span className="font-mono text-white">{modelDetails.quantization}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Scan Resolution / DPI:</span>
              <span className="font-mono text-white">~{modelDetails.imageDpiEstimate} DPI ({modelDetails.imageDimensions})</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Model Termination Flag:</span>
              <span className="font-mono text-emerald-400 font-bold">{modelDetails.finishReason}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Inference Timestamp:</span>
              <span className="font-mono text-slate-300">{new Date(modelDetails.timestamp).toLocaleTimeString()} UTC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
