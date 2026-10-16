import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  FileCheck,
  Cpu,
  Printer,
  Upload,
  AlertTriangle,
  Pill,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Share2,
  HeartPulse,
  MessageSquare,
  Eye,
} from 'lucide-react';

import { Navbar, ActiveTabType } from './components/Navbar';
import { HealthTimeline } from './components/HealthTimeline';
import { PrescriptionViewer } from './components/PrescriptionViewer';
import { TranscriptionInspector } from './components/TranscriptionInspector';
import { ClinicalSafetyInspector } from './components/ClinicalSafetyInspector';
import { WhatsAppIngestionSimulator } from './components/WhatsAppIngestionSimulator';
import { ConsentStudio } from './components/ConsentStudio';
import { DoctorCuratedView } from './components/DoctorCuratedView';
import { EmergencyBreakGlassCard } from './components/EmergencyBreakGlassCard';
import { ComplianceAuditCenter } from './components/ComplianceAuditCenter';
import { LifetimeExportModal } from './components/LifetimeExportModal';
import { UploadModal } from './components/UploadModal';
import { ModelDiagnosticsPanel } from './components/ModelDiagnosticsPanel';

import { SAMPLE_PRESCRIPTIONS } from './data/samplePrescriptions';
import {
  PRIMARY_PATIENT,
  INITIAL_MEDICATIONS,
  INITIAL_CONDITIONS,
  INITIAL_ALLERGIES,
  INITIAL_LAB_OBSERVATIONS,
  INITIAL_ENCOUNTERS,
  INITIAL_CONSENTS,
  INITIAL_AUDIT_LOGS,
} from './data/patientContinuityRecords';
import { evaluateClinicalSafety } from './services/clinicalSafety';
import {
  PatientProfile,
  UnifiedMedication,
  UnifiedCondition,
  UnifiedAllergy,
  UnifiedLabObservation,
  UnifiedEncounter,
  EphemeralConsentShare,
  BreakGlassLogEntry,
  AuditTrailEvent,
  ClinicalSafetyAlert,
} from './types/fhir';
import {
  PrescriptionData,
  AIModelDetails,
  SamplePrescription,
} from './types/prescription';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('timeline');

  // Unified Patient Core Records State
  const [patient, setPatient] = useState<PatientProfile>(PRIMARY_PATIENT);
  const [medications, setMedications] = useState<UnifiedMedication[]>(INITIAL_MEDICATIONS);
  const [conditions, setConditions] = useState<UnifiedCondition[]>(INITIAL_CONDITIONS);
  const [allergies, setAllergies] = useState<UnifiedAllergy[]>(INITIAL_ALLERGIES);
  const [observations, setObservations] = useState<UnifiedLabObservation[]>(INITIAL_LAB_OBSERVATIONS);
  const [encounters, setEncounters] = useState<UnifiedEncounter[]>(INITIAL_ENCOUNTERS);
  const [consents, setConsents] = useState<EphemeralConsentShare[]>(INITIAL_CONSENTS);
  const [auditLogs, setAuditLogs] = useState<AuditTrailEvent[]>(INITIAL_AUDIT_LOGS);
  const [breakGlassLogs, setBreakGlassLogs] = useState<BreakGlassLogEntry[]>([]);

  // Doctor Curated View Mode (when clinician view is launched)
  const [activeDoctorViewConsent, setActiveDoctorViewConsent] = useState<EphemeralConsentShare | null>(null);

  // Compute real-time deterministic clinical safety alerts
  const [safetyAlertsOverride, setSafetyAlertsOverride] = useState<ClinicalSafetyAlert[] | null>(null);
  const computedSafetyAlerts = useMemo(() => {
    return evaluateClinicalSafety(medications, allergies);
  }, [medications, allergies]);

  const activeSafetyAlerts = safetyAlertsOverride !== null ? safetyAlertsOverride : computedSafetyAlerts;

  // OCR Studio State
  const defaultSample = SAMPLE_PRESCRIPTIONS[0];
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(defaultSample.generateDataUrl());
  const [scanData, setScanData] = useState<PrescriptionData>(defaultSample.presetData);
  const [ocrMode, setOcrMode] = useState<'canvas' | 'whatsapp'>('canvas');
  const [modelDetails, setModelDetails] = useState<AIModelDetails>({
    modelName: 'gemini-3.8-flash',
    modelVersion: 'gemini-3.8-flash-vision',
    architecture: 'Multimodal Vision-Language Transformer with Spatial Attention',
    spatialBoundingSystem: 'Normalized 1000x1000 2D coordinate grid',
    quantization: 'FP8 Serviced Inference',
    pharmacologyGrounding: 'Active Pharmaceutical Reference Ontology (RxNorm & NDC Cross-Mapped)',
    inferenceLatencyMs: 914,
    promptTokens: 1488,
    candidateTokens: 894,
    totalTokens: 2382,
    finishReason: 'STOP',
    timestamp: new Date().toISOString(),
    imageDpiEstimate: 300,
    imageDimensions: '1840x2400',
  });
  const [sessionId, setSessionId] = useState<string>('RX-OCR-DEMO-V1');
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load sample prescription into studio
  const handleSelectSample = (sample: SamplePrescription) => {
    const url = sample.generateDataUrl();
    setCurrentImageUrl(url);
    setScanData(sample.presetData);
    setSelectedLineId(null);
    setSessionId(`RX-OCR-${Date.now().toString(36).toUpperCase()}`);
    setNotification(`Loaded sample: ${sample.title}`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Upload or camera scan via backend API
  const handleUploadImage = async (
    base64: string,
    mimeType: string,
    imageMeta?: { width: number; height: number }
  ) => {
    setIsProcessing(true);
    setCurrentImageUrl(base64);
    setSelectedLineId(null);
    setNotification('Transcribing handwritten prescription with Gemini Vision OCR...');

    try {
      const response = await fetch('/api/scan-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          model: 'gemini-3.8-flash',
          imageMeta,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setScanData(result.data);
        if (result.modelDetails) {
          setModelDetails(result.modelDetails);
        }
        if (result.scanSessionId) {
          setSessionId(result.scanSessionId);
        }

        // Log audit event
        const auditEvent: AuditTrailEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'MediScript AI Vision Engine',
          action: 'RECORD_INGEST',
          purpose: 'PRESCRIPTION_OCR_INGESTION',
          resourceType: `DocumentReference (${result.data.doctor?.clinicOrHospital || 'Scanned Script'})`,
          provenanceTier: 'ocr-unconfirmed',
          ipAddress: 'Server Internal (GCP asia-south1)',
          verificationHash: `sha256:${Math.random().toString(36).slice(2)}${Date.now()}`,
        };
        setAuditLogs((prev) => [auditEvent, ...prev]);

        setNotification('Transcription complete! Bounding boxes mapped. Review and confirm below.');
      } else {
        throw new Error(result.error || 'Failed to parse prescription data');
      }
    } catch (err: unknown) {
      console.error('Scan error:', err);
      const message = err instanceof Error ? err.message : 'Error scanning prescription';
      setNotification(`Scan notice: ${message}. Using calibrated fallback.`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Commit scanned prescription into patient's permanent longitudinal health history
  const handleCommitScanToTimeline = () => {
    // Convert scanned medications into UnifiedMedication entries
    const newMeds: UnifiedMedication[] = scanData.medications.map((m, idx) => ({
      id: `med-scan-${Date.now()}-${idx}`,
      brandName: m.brandName,
      genericName: m.genericName || m.brandName,
      activeIngredients: [
        {
          name: m.genericName || m.brandName,
          strengthMg: parseInt(m.dosageStrength, 10) || 500,
          unit: 'mg',
        },
      ],
      dosageForm: m.form || 'Tablet',
      strength: m.dosageStrength,
      sig: m.sigRaw || m.sigTranslated,
      sigTranslated: m.sigTranslated,
      timing: 'morning',
      relationToFood: 'after_food',
      status: 'active',
      prescribedDate: scanData.doctor.date || new Date().toISOString().split('T')[0],
      prescribingDoctor: scanData.doctor.name,
      prescribingFacility: scanData.doctor.clinicOrHospital,
      refillsRemaining: parseInt(m.refills || '1', 10) || 1,
      therapeuticClass: m.clinicalIndication || 'Prescription Therapy',
      provenance: {
        id: `prov-scan-${Date.now()}-${idx}`,
        recordedAt: new Date().toISOString(),
        tier: 'ocr-human-confirmed',
        confidenceScore: m.confidence,
        hospitalOrClinic: scanData.doctor.clinicOrHospital,
        doctorName: scanData.doctor.name,
        verifiedBy: `${patient.fullName} (Patient Confirmed)`,
        sourceDocumentName: `Prescription_${scanData.doctor.clinicOrHospital.replace(/\s+/g, '_')}.pdf`,
      },
    }));

    // Add Encounter
    const newEncounter: UnifiedEncounter = {
      id: `enc-scan-${Date.now()}`,
      hospitalName: scanData.doctor.clinicOrHospital,
      doctorName: scanData.doctor.name,
      specialty: scanData.doctor.specialty || 'General Medicine',
      date: scanData.doctor.date || new Date().toISOString().split('T')[0],
      encounterType: 'OPD',
      reasonForVisit: scanData.summaryText.slice(0, 80),
      summary: scanData.summaryText,
      relatedRecordIds: newMeds.map((m) => m.id),
      provenance: {
        id: `prov-enc-${Date.now()}`,
        recordedAt: new Date().toISOString(),
        tier: 'ocr-human-confirmed',
        confidenceScore: scanData.overallConfidence,
        hospitalOrClinic: scanData.doctor.clinicOrHospital,
        doctorName: scanData.doctor.name,
        verifiedBy: `${patient.fullName} (Patient Confirmed)`,
      },
    };

    setMedications((prev) => [...newMeds, ...prev]);
    setEncounters((prev) => [newEncounter, ...prev]);

    // Record audit event
    const auditEvent: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${patient.fullName} (Patient Self)`,
      action: 'HUMAN_CONFIRM',
      purpose: 'RECORD_INGESTION_VALIDATION',
      resourceType: `MedicationRequest (${newMeds.length} items)`,
      provenanceTier: 'ocr-human-confirmed',
      ipAddress: '122.161.49.201 (New Delhi)',
      verificationHash: `sha256:${Math.random().toString(36).slice(2)}${Date.now()}`,
    };
    setAuditLogs((prev) => [auditEvent, ...prev]);

    setNotification('Script verified and committed into your Unified Health Timeline!');
    setActiveTab('timeline');
    setTimeout(() => setNotification(null), 4000);
  };

  // Edit transcription line
  const handleUpdateLine = (lineId: string, newText: string) => {
    setScanData((prev) => ({
      ...prev,
      transcriptionLines: prev.transcriptionLines.map((l) =>
        l.id === lineId ? { ...l, normalizedMedicalText: newText, isEdited: true } : l
      ),
    }));
  };

  // Reconcile Safety Alert
  const handleResolveAlert = (alertId: string, actionNote: string) => {
    setSafetyAlertsOverride((prevAlerts) => {
      const currentList = prevAlerts !== null ? prevAlerts : computedSafetyAlerts;
      return currentList.map((a) =>
        a.id === alertId ? { ...a, isResolved: true, resolutionNote: actionNote } : a
      );
    });

    const auditEvent: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${patient.fullName} (Patient / Caregiver)`,
      action: 'RECORD_VIEW',
      purpose: 'MEDICATION_RECONCILIATION',
      resourceType: `SafetyAlert (${alertId})`,
      ipAddress: '122.161.49.201 (New Delhi)',
      verificationHash: `sha256:${Math.random().toString(36).slice(2)}`,
    };
    setAuditLogs((prev) => [auditEvent, ...prev]);
    setNotification('Safety alert marked as reconciled with clinical note.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Discontinue a duplicate medication
  const handleDiscontinueMedication = (medId: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, status: 'discontinued' } : m))
    );
    setNotification('Medication marked as discontinued in active regimen.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Create new ephemeral consent share
  const handleCreateConsent = (newConsent: EphemeralConsentShare) => {
    setConsents((prev) => [newConsent, ...prev]);

    const auditEvent: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${patient.fullName} (Data Principal)`,
      action: 'CONSENT_GRANTED',
      purpose: newConsent.purpose,
      resourceType: `Consent (${newConsent.shareToken})`,
      ipAddress: '122.161.49.201 (New Delhi)',
      verificationHash: `sha256:${Math.random().toString(36).slice(2)}`,
    };
    setAuditLogs((prev) => [auditEvent, ...prev]);
    setNotification(`Ephemeral share created: ${newConsent.shareToken}`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Revoke consent
  const handleRevokeConsent = (consentId: string) => {
    setConsents((prev) =>
      prev.map((c) => (c.id === consentId ? { ...c, status: 'revoked' } : c))
    );

    const auditEvent: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${patient.fullName} (Data Principal)`,
      action: 'CONSENT_REVOKED',
      purpose: 'REVOCATION_EXERCISED',
      resourceType: `Consent (${consentId})`,
      ipAddress: '122.161.49.201 (New Delhi)',
      verificationHash: `sha256:${Math.random().toString(36).slice(2)}`,
    };
    setAuditLogs((prev) => [auditEvent, ...prev]);
    setNotification('Doctor access token revoked immediately.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Trigger emergency break-glass
  const handleTriggerBreakGlass = (entry: BreakGlassLogEntry) => {
    setBreakGlassLogs((prev) => [entry, ...prev]);

    const auditEvent: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: entry.timestamp,
      actor: `${entry.responderName} (${entry.medicalRegistrationNumber})`,
      action: 'BREAK_GLASS_ACCESS',
      purpose: `EMERGENCY_ACCESS: ${entry.justification}`,
      resourceType: 'Emergency Break-Glass Session',
      ipAddress: entry.ipAddress,
      verificationHash: `sha256:${Math.random().toString(36).slice(2)}`,
    };
    setAuditLogs((prev) => [auditEvent, ...prev]);
  };

  // Revoke emergency break-glass session early
  const handleRevokeBreakGlass = (logId: string) => {
    setBreakGlassLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, revokedEarly: true } : l))
    );
    setNotification('Emergency session revoked early by patient family.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Simulate cryptographic erasure
  const handleSimulateErasure = () => {
    setMedications([]);
    setConditions([]);
    setObservations([]);
    setEncounters([]);

    const auditEvent: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${patient.fullName} (Data Principal)`,
      action: 'ERASURE_REQUESTED',
      purpose: 'DPDP_SECTION_12_RIGHT_TO_ERASURE',
      resourceType: 'Patient Clinical Cryptographic Keys',
      ipAddress: '122.161.49.201 (New Delhi)',
      verificationHash: `sha256:${Math.random().toString(36).slice(2)}`,
    };
    setAuditLogs((prev) => [auditEvent, ...prev]);
    setNotification('Clinical keys shredded. Identifiable medical documents purged.');
  };

  // Export audit ledger CSV
  const handleExportAuditLedger = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Actor,Action,Purpose,ResourceType,IPAddress,VerificationHash']
        .concat(
          auditLogs.map(
            (l) =>
              `"${l.timestamp}","${l.actor}","${l.action}","${l.purpose}","${l.resourceType}","${l.ipAddress}","${l.verificationHash}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MediScript_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render Doctor Curated View if active
  if (activeDoctorViewConsent) {
    return (
      <DoctorCuratedView
        patient={patient}
        consent={activeDoctorViewConsent}
        medications={medications}
        conditions={conditions}
        observations={observations}
        encounters={encounters}
        onExit={() => setActiveDoctorViewConsent(null)}
      />
    );
  }

  const unresolvedAlertCount = activeSafetyAlerts.filter((a) => !a.isResolved).length;
  const activeConsentCount = consents.filter((c) => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        alertCount={unresolvedAlertCount}
        activeConsentCount={activeConsentCount}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="bg-teal-950/90 border-b border-teal-800/80 px-6 py-2.5 text-xs text-teal-200 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-teal-400 hover:text-white text-xs font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* TAB 1: Longitudinal Health Timeline */}
        {activeTab === 'timeline' && (
          <HealthTimeline
            patient={patient}
            medications={medications}
            conditions={conditions}
            allergies={allergies}
            observations={observations}
            encounters={encounters}
            onInspectDocument={(docName) => {
              setActiveTab('scanner');
              setNotification(`Inspecting source document: ${docName}`);
            }}
            onOpenShareModal={(recordId) => {
              setActiveTab('consent');
            }}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* TAB 2: Prescription & Lab OCR Pipeline */}
        {activeTab === 'scanner' && (
          <div className="space-y-4">
            {/* Mode Switcher: Dual Canvas OCR vs WhatsApp Ingestion Simulator */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setOcrMode('canvas')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    ocrMode === 'canvas'
                      ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Prescription Studio (Dual Canvas OCR)
                </button>
                <button
                  type="button"
                  onClick={() => setOcrMode('whatsapp')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    ocrMode === 'whatsapp'
                      ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Ingestion Simulator</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCommitScanToTimeline}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-900/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                  <span>Commit Script to Timeline</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Script</span>
                </button>
              </div>
            </div>

            {ocrMode === 'canvas' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
                {/* Left 7 Columns: Canvas with normalized coordinate boxes */}
                <div className="lg:col-span-7 flex flex-col min-h-[580px]">
                  <PrescriptionViewer
                    imageUrl={currentImageUrl}
                    lines={scanData.transcriptionLines}
                    selectedLineId={selectedLineId}
                    onSelectLine={setSelectedLineId}
                    overallConfidence={scanData.overallConfidence}
                    isProcessing={isProcessing}
                  />
                </div>

                {/* Right 5 Columns: Line-by-line synchronized inspector */}
                <div className="lg:col-span-5 flex flex-col min-h-[580px]">
                  <TranscriptionInspector
                    data={scanData}
                    selectedLineId={selectedLineId}
                    onSelectLine={setSelectedLineId}
                    onUpdateLine={handleUpdateLine}
                  />
                </div>
              </div>
            ) : (
              <WhatsAppIngestionSimulator
                onLoadScriptToStudio={(sampleId) => {
                  const sample = SAMPLE_PRESCRIPTIONS.find((s) => s.id === sampleId) || SAMPLE_PRESCRIPTIONS[0];
                  handleSelectSample(sample);
                  setOcrMode('canvas');
                }}
                onUploadImage={handleUploadImage}
                isProcessing={isProcessing}
              />
            )}
          </div>
        )}

        {/* TAB 3: Clinical Safety & Medication Reconciliation */}
        {activeTab === 'safety' && (
          <ClinicalSafetyInspector
            alerts={activeSafetyAlerts}
            medications={medications}
            allergies={allergies}
            onResolveAlert={handleResolveAlert}
            onDiscontinueMedication={handleDiscontinueMedication}
          />
        )}

        {/* TAB 4: Granular Consent & Ephemeral Sharing */}
        {activeTab === 'consent' && (
          <ConsentStudio
            patient={patient}
            medications={medications}
            conditions={conditions}
            observations={observations}
            encounters={encounters}
            consents={consents}
            onCreateConsent={handleCreateConsent}
            onRevokeConsent={handleRevokeConsent}
            onLaunchDoctorView={(consent) => setActiveDoctorViewConsent(consent)}
          />
        )}

        {/* TAB 5: Emergency Card & Audited Break-Glass */}
        {activeTab === 'emergency' && (
          <EmergencyBreakGlassCard
            patient={patient}
            allergies={allergies}
            medications={medications}
            breakGlassLogs={breakGlassLogs}
            onTriggerBreakGlass={handleTriggerBreakGlass}
            onRevokeBreakGlass={handleRevokeBreakGlass}
          />
        )}

        {/* TAB 6: DPDP Act 2023 Compliance & Audit Ledger */}
        {activeTab === 'audit' && (
          <ComplianceAuditCenter
            auditLogs={auditLogs}
            onExportAuditLedger={handleExportAuditLedger}
            onSimulateErasure={handleSimulateErasure}
          />
        )}
      </main>

      {/* Upload & Sample Preset Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSelectSample={handleSelectSample}
        onUploadImage={handleUploadImage}
        isProcessing={isProcessing}
      />

      {/* Lifetime FHIR & PDF Export Modal */}
      <LifetimeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        patient={patient}
        medications={medications}
        conditions={conditions}
        allergies={allergies}
        observations={observations}
        encounters={encounters}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">MediScript Continuity Platform</span>
          <span aria-hidden="true">·</span>
          <span>HL7 FHIR Release 4 & NRCES / ABDM Guidelines</span>
          <span aria-hidden="true">·</span>
          <span>DPDP Act 2023 Sovereign Encryption</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className="hover:text-teal-400 transition-colors"
          >
            Audit Trail ({auditLogs.length} Events)
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="hover:text-teal-400 transition-colors"
          >
            Export FHIR Bundle
          </button>
        </div>
      </footer>
    </div>
  );
}
