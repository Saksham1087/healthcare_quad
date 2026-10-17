import React, { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop());
          setCameraStream(null);
        }
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, cameraStream, onClose]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[#3FA796]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3FA796]/20 bg-white/40 dark:bg-[#071711]/40">
          <div>
            <h3
              id="upload-modal-title"
              className="text-base font-bold text-[#1B2A22] dark:text-[#F4FAF3] tracking-tight flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#2D6A4F] dark:text-[#3FA796]" aria-hidden="true" />
              <span>Select or Upload Medical Prescription</span>
            </h3>
            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
              Choose an authentic doctor cursive script sample or scan a prescription paper
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#3D5A4C] dark:text-[#A3C5B8] hover:text-rose-600 rounded-xl hover:bg-[#F3EBD3]/60 dark:hover:bg-[#122B22] transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2.5 bg-[#F3EBD3]/50 dark:bg-[#071711]/60 border-b border-[#3FA796]/15">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('samples');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'samples'
                ? 'bg-[#17483A] dark:bg-[#3FA796] text-white dark:text-[#0E2A21] shadow-sm font-bold'
                : 'text-[#1B4332] dark:text-[#A3C5B8] hover:text-[#0F3D2E] dark:hover:text-white'
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
            className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-[#17483A] dark:bg-[#3FA796] text-white dark:text-[#0E2A21] shadow-sm font-bold'
                : 'text-[#1B4332] dark:text-[#A3C5B8] hover:text-[#0F3D2E] dark:hover:text-white'
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
            className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'camera'
                ? 'bg-[#17483A] dark:bg-[#3FA796] text-white dark:text-[#0E2A21] shadow-sm font-bold'
                : 'text-[#1B4332] dark:text-[#A3C5B8] hover:text-[#0F3D2E] dark:hover:text-white'
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
              <span className="text-xs font-medium text-[#3D5A4C] dark:text-[#A3C5B8] block mb-2">
                Click any real clinical prescription pad to load into the OCR Inspector:
              </span>
              {SAMPLE_PRESCRIPTIONS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-[#122B22]/70 border border-[#3FA796]/20 hover:border-[#3FA796] hover:bg-white dark:hover:bg-[#17382D] transition-all cursor-pointer group flex items-start justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#2D6A4F]/15 border border-[#2D6A4F]/30 flex items-center justify-center text-[#1E4D3B] dark:text-[#52B788] shrink-0 mt-0.5 group-hover:scale-105 transition-transform font-bold">
                      {sample.presetData.patient.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#1B2A22] dark:text-[#F4FAF3] group-hover:text-[#2D6A4F] dark:group-hover:text-[#3FA796] transition-colors">
                          {sample.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2D6A4F]/15 text-[#1E4D3B] dark:text-[#B8E986] border border-[#2D6A4F]/25 font-semibold">
                          {sample.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-1 leading-relaxed">
                        {sample.subtitle}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-[#3D5A4C] dark:text-[#A3C5B8]">
                        <span className="font-semibold text-[#1B2A22] dark:text-[#F4FAF3]">
                          Patient: {sample.presetData.patient.name} ({sample.presetData.patient.age})
                        </span>
                        <span>•</span>
                        <span>Confidence: {sample.presetData.overallConfidence}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="min-h-[44px] px-3.5 py-2 text-xs font-bold text-white dark:text-[#0E2A21] bg-[#17483A] dark:bg-[#3FA796] hover:bg-[#2D6A4F] dark:hover:bg-[#4CB8A4] rounded-xl transition-colors whitespace-nowrap shrink-0 mt-1 shadow-sm flex items-center justify-center"
                  >
                    Load Script
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#2D6A4F]/30 dark:border-[#3FA796]/30 rounded-2xl bg-white/40 dark:bg-[#071711]/40 hover:bg-white/70 dark:hover:bg-[#071711]/70 transition-colors text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#2D6A4F]/15 border border-[#2D6A4F]/30 flex items-center justify-center text-[#1E4D3B] dark:text-[#52B788] mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-[#1B2A22] dark:text-[#F4FAF3]">Upload Handwritten Prescription</h4>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] max-w-sm mt-1 mb-4">
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
                className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-white dark:text-[#0E2A21] bg-[#17483A] dark:bg-[#3FA796] hover:bg-[#2D6A4F] dark:hover:bg-[#4CB8A4] rounded-xl transition-all shadow-md shadow-[#17483A]/20 flex items-center justify-center"
              >
                Browse Image File
              </button>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="flex flex-col items-center">
              {cameraError ? (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 text-center w-full">
                  <p className="font-semibold mb-1">Camera Access Issue</p>
                  <p>{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-3 min-h-[44px] px-4 py-2 bg-rose-900 text-white rounded-xl font-medium hover:bg-rose-800 inline-flex items-center justify-center"
                  >
                    Retry Camera
                  </button>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#3FA796]/30 shadow-inner">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder crosshairs overlay */}
                    <div className="absolute inset-8 border-2 border-dashed border-[#3FA796]/60 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between text-[10px] font-mono text-[#B8E986] uppercase">
                        <span>Align Prescription Paper</span>
                        <span>1080p Lens</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#B8E986] text-center">
                        Keep steady &amp; ensure good lighting
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="min-h-[44px] px-6 py-2.5 bg-[#17483A] dark:bg-[#3FA796] hover:bg-[#2D6A4F] dark:hover:bg-[#4CB8A4] text-white dark:text-[#0E2A21] font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#17483A]/25"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture &amp; Transcribe</span>
                    </button>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="min-h-[44px] px-4 py-2.5 bg-white dark:bg-[#122B22] hover:bg-[#FAF6EA] dark:hover:bg-[#17382D] text-[#1B2A22] dark:text-[#F4FAF3] rounded-xl text-xs flex items-center gap-1.5 border border-[#C9A24B]/35 dark:border-[#3FA796]/30 font-semibold"
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
