import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  FileText,
  X,
  Sparkles,
  Check,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS } from '../data/samplePrescriptions';
import { SamplePrescription } from '../types/prescription';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SamplePrescription) => void;
  onUploadImage: (base64: string, mimeType: string, meta?: { width: number; height: number }) => void;
  isProcessing: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
  onUploadImage,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<'samples' | 'upload' | 'camera'>('samples');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onload = () => {
        onUploadImage(result, file.type, { width: img.width, height: img.height });
        onClose();
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Camera Handlers
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: unknown) {
      console.error('Camera error:', err);
      const message = err instanceof Error ? err.message : 'Unable to access camera';
      setCameraError(message);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    stopCamera();
    onUploadImage(dataUrl, 'image/jpeg', { width: canvas.width, height: canvas.height });
    onClose();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Select or Upload Medical Prescription</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose an authentic doctor cursive script sample or scan your own prescription paper
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 bg-slate-950/50 border-b border-slate-800">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('samples');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'samples'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Clinical Script Presets (1-Click)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'upload'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File (JPG/PNG)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              startCamera();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'camera'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Capture</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <span className="text-xs font-medium text-slate-400 block mb-2">
                Click any real clinical prescription pad to load and examine OCR bounding boxes:
              </span>
              {SAMPLE_PRESCRIPTIONS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all cursor-pointer group flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {sample.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {sample.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {sample.subtitle}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span>Patient: {sample.presetData.patient.name}</span>
                        <span>•</span>
                        <span>Confidence: {sample.presetData.overallConfidence}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 rounded-lg group-hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 mt-1"
                  >
                    Load Script
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/50 hover:bg-slate-950/80 transition-colors text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Upload Handwritten Prescription</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                Drag and drop a photo or scan of a prescription pad, or select an image file from your device (PNG, JPG, WebP)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-all shadow-md shadow-cyan-950"
              >
                Browse Image File
              </button>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="flex flex-col items-center">
              {cameraError ? (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 text-center w-full">
                  <p className="font-semibold mb-1">Camera Access Issue</p>
                  <p>{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-3 px-3 py-1.5 bg-rose-900 text-white rounded font-medium hover:bg-rose-800"
                  >
                    Retry Camera
                  </button>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-inner">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder crosshairs overlay */}
                    <div className="absolute inset-8 border-2 border-dashed border-cyan-400/60 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between text-[10px] font-mono text-cyan-300 uppercase">
                        <span>Align Prescription Paper</span>
                        <span>1080p Lens</span>
                      </div>
                      <div className="text-[10px] font-mono text-cyan-300 text-center">
                        Keep steady & ensure good desk lighting
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-cyan-950"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture & Transcribe</span>
                    </button>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
