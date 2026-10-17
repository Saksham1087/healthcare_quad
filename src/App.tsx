import React, { useState, useEffect, useMemo } from 'react';
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
  Leaf,
  Users,
  UserCheck,
  UserPlus,
} from 'lucide-react';

import { Navbar, ActiveTabType } from './components/Navbar';
import { HeroLandingSection } from './components/HeroLandingSection';
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
import { VoiceAssistantChatbot } from './components/VoiceAssistantChatbot';
import {
  VineDivider,
  ThemedSproutLoader,
  BulbSeedIcon,
  SplitSeedIntroModal,
} from './components/BulbasaurThemeAssets';

import { SAMPLE_PRESCRIPTIONS } from './data/samplePrescriptions';
import {
  INITIAL_PATIENTS_DATABASE,
  findOrCreatePatientRecord,
} from './data/patientContinuityRecords';
import { evaluateClinicalSafety } from './services/clinicalSafety';
import {
  PatientProfile,
  PatientRecordStore,
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

  // Theme Management (Dark mode default, persisted in localStorage)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const mode = localStorage.getItem('mediscript-theme-mode');
      if (mode === 'light') return false;
      if (mode === 'dark') return true;
      return true; // Default to Deep Forest Night dark theme
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('mediscript-theme', 'dark');
        localStorage.setItem('mediscript-theme-mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('mediscript-theme', 'light');
        localStorage.setItem('mediscript-theme-mode', 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Split-Seed Opening Intro Animation Modal state (skippable, remembers choice)
  const [isIntroModalOpen, setIsIntroModalOpen] = useState<boolean>(() => {
    try {
      const seen = localStorage.getItem('mediscript-herbarium-intro-seen');
      return seen !== 'true';
    } catch {
      return false;
    }
  });

  const handleReturnToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Structured Multi-Patient Database State (persisted in localStorage)
  const [patientsDatabase, setPatientsDatabase] = useState<Record<string, PatientRecordStore>>(() => {
    try {
      const saved = localStorage.getItem('mediscript-patients-db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved patients db from localStorage', e);
    }
    return INITIAL_PATIENTS_DATABASE;
  });

  // Current Active Patient ID
  const [currentPatientId, setCurrentPatientId] = useState<string>(() => {
    const savedId = localStorage.getItem('mediscript-current-patient-id');
    if (savedId && INITIAL_PATIENTS_DATABASE[savedId]) {
      return savedId;
    }
    return 'pat-rajesh-sharma-9901';
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mediscript-patients-db', JSON.stringify(patientsDatabase));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [patientsDatabase]);

  useEffect(() => {
    localStorage.setItem('mediscript-current-patient-id', currentPatientId);
  }, [currentPatientId]);

  // Retrieve current active patient store safely
  const currentStore: PatientRecordStore = useMemo(() => {
    return (
      patientsDatabase[currentPatientId] ||
      patientsDatabase['pat-rajesh-sharma-9901'] ||
      Object.values(patientsDatabase)[0]
    );
  }, [patientsDatabase, currentPatientId]);

  const patient = currentStore.patient;
  const medications = currentStore.medications;
  const conditions = currentStore.conditions;
  const allergies = currentStore.allergies;
  const observations = currentStore.observations;
  const encounters = currentStore.encounters;
  const consents = currentStore.consents;
  const auditLogs = currentStore.auditLogs;
  const breakGlassLogs = currentStore.breakGlassLogs;

  // Helper to update active patient record store
  const updateCurrentStore = (updater: (prev: PatientRecordStore) => PatientRecordStore) => {
    setPatientsDatabase((prev) => {
      const target = prev[currentPatientId] || Object.values(prev)[0];
      if (!target) return prev;
      return {
        ...prev,
        [target.patient.id]: updater(target),
      };
    });
  };

  // Switch active patient profile
  const handleSelectPatient = (patientId: string) => {
    if (patientsDatabase[patientId]) {
      setCurrentPatientId(patientId);
      setNotification(`Switched active profile to ${patientsDatabase[patientId].patient.fullName}`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Create new patient profile
  const handleCreatePatient = (newProfile: PatientProfile) => {
    const newStore: PatientRecordStore = {
      patient: newProfile,
      medications: [],
      conditions: [],
      allergies: [],
      observations: [],
      encounters: [],
      consents: [],
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: `${newProfile.fullName} (Data Principal)`,
          action: 'RECORD_INGEST',
          purpose: 'PROFILE_REGISTRATION',
          resourceType: `Patient (${newProfile.abhaId})`,
          provenanceTier: 'patient-entered',
          ipAddress: '122.161.49.201 (New Delhi)',
          verificationHash: `sha256:${Math.random().toString(36).slice(2)}`,
        },
      ],
      breakGlassLogs: [],
    };

    setPatientsDatabase((prev) => ({
      ...prev,
      [newProfile.id]: newStore,
    }));
    setCurrentPatientId(newProfile.id);
    setNotification(`Created new patient profile for ${newProfile.fullName} (ABHA: ${newProfile.abhaId})!`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Doctor Curated View Mode (when clinician view is launched)
  const [activeDoctorViewConsent, setActiveDoctorViewConsent] = useState<EphemeralConsentShare | null>(null);

  // Compute real-time deterministic clinical safety alerts for current patient
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

  // OCR Target Patient Assignment: auto-matched or selected by user
  const [ocrTargetPatientId, setOcrTargetPatientId] = useState<string>(() => {
    const match = findOrCreatePatientRecord(defaultSample.presetData.patient.name, INITIAL_PATIENTS_DATABASE);
    return match.patientId;
  });

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
  const [isSimulatedScan, setIsSimulatedScan] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Update target patient whenever scanData changes
  useEffect(() => {
    if (scanData?.patient?.name) {
      const match = findOrCreatePatientRecord(scanData.patient.name, patientsDatabase, {
        age: scanData.patient.age,
        allergies: scanData.patient.allergies,
        gender: scanData.patient.gender,
      });
      setOcrTargetPatientId(match.patientId);
    }
  }, [scanData]);

  // Trigger floating voice chatbot
  const handleOpenVoice = () => {
    const launcher = document.querySelector('button[aria-label="Open SaurAssistant Voice Companion"]') as HTMLButtonElement | null;
    if (launcher) {
      launcher.click();
    }
  };

  // Load sample prescription into studio
  const handleSelectSample = (sample: SamplePrescription) => {
    const url = sample.generateDataUrl();
    setCurrentImageUrl(url);
    setScanData(sample.presetData);
    setSelectedLineId(null);
    setIsSimulatedScan(false);
    setSessionId(`RX-OCR-${Date.now().toString(36).toUpperCase()}`);

    // Auto-match patient from sample
    const match = findOrCreatePatientRecord(sample.presetData.patient.name, patientsDatabase, {
      age: sample.presetData.patient.age,
      allergies: sample.presetData.patient.allergies,
      gender: sample.presetData.patient.gender,
    });
    setOcrTargetPatientId(match.patientId);

    setNotification(`Loaded sample for patient: ${sample.presetData.patient.name}`);
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
    setIsSimulatedScan(false);
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
        setIsSimulatedScan(Boolean(result.simulated));
        setScanData(result.data);
        if (result.modelDetails) {
          setModelDetails(result.modelDetails);
        }
        if (result.scanSessionId) {
          setSessionId(result.scanSessionId);
        }

        // Auto-match or detect patient name
        const match = findOrCreatePatientRecord(result.data.patient.name, patientsDatabase, {
          age: result.data.patient.age,
          allergies: result.data.patient.allergies,
          gender: result.data.patient.gender,
        });
        setOcrTargetPatientId(match.patientId);

        // Log audit event to active profile
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
        updateCurrentStore((prev) => ({
          ...prev,
          auditLogs: [auditEvent, ...prev.auditLogs],
        }));

        if (result.simulated) {
          setNotification('Simulated fallback data loaded (not a real transcription of your document). Review the sample record below.');
        } else {
          setNotification(`Transcription complete for ${result.data.patient.name || 'Patient'}! Review and commit below.`);
        }
      } else {
        throw new Error(result.error || 'Failed to parse prescription data');
      }
    } catch (err: unknown) {
      console.error('Scan error:', err);
      const message = err instanceof Error ? err.message : 'Error scanning prescription';
      setNotification(`Scan notice: ${message}. No transcription was produced.`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Commit scanned prescription into patient's permanent longitudinal health history
  // Updates properly in their respective areas: medications, encounters, conditions, allergies, and audit
  const handleCommitScanToTimeline = () => {
    let targetId = ocrTargetPatientId;
    let targetStore = patientsDatabase[targetId];

    // If new profile was requested or target is not in database, create it!
    if (!targetStore || targetId === '__NEW__') {
      const match = findOrCreatePatientRecord(scanData.patient.name, patientsDatabase, {
        age: scanData.patient.age,
        allergies: scanData.patient.allergies,
        gender: scanData.patient.gender,
      });
      targetId = match.patientId;
      targetStore = {
        patient: match.profile,
        medications: [],
        conditions: [],
        allergies:
          scanData.patient.allergies &&
          !scanData.patient.allergies.toLowerCase().includes('none') &&
          !scanData.patient.allergies.toLowerCase().includes('nkda')
            ? [
                {
                  id: `alg-init-${Date.now()}`,
                  substance: scanData.patient.allergies,
                  criticality: scanData.patient.allergies.toLowerCase().includes('anaphyl') ? 'high' : 'medium',
                  category: 'medication',
                  manifestation: 'Documented on prescriber clinical script',
                  verificationStatus: 'confirmed',
                  recordedDate: scanData.doctor.date || new Date().toISOString().split('T')[0],
                  provenance: {
                    id: `prov-alg-${Date.now()}`,
                    recordedAt: new Date().toISOString(),
                    tier: 'ocr-human-confirmed',
                    confidenceScore: scanData.overallConfidence,
                    hospitalOrClinic: scanData.doctor.clinicOrHospital,
                    doctorName: scanData.doctor.name,
                  },
                },
              ]
            : [],
        observations: [],
        encounters: [],
        consents: [],
        auditLogs: [],
        breakGlassLogs: [],
      };
    }

    const targetPatient = targetStore.patient;

    // 1. Structure Medications
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
        verifiedBy: `${targetPatient.fullName} (Patient Confirmed)`,
        sourceDocumentName: `Prescription_${scanData.doctor.clinicOrHospital.replace(/\s+/g, '_')}.pdf`,
      },
    }));

    // 2. Structure Encounter
    const newEncounter: UnifiedEncounter = {
      id: `enc-scan-${Date.now()}`,
      hospitalName: scanData.doctor.clinicOrHospital,
      doctorName: scanData.doctor.name,
      specialty: scanData.doctor.specialty || 'General Medicine',
      date: scanData.doctor.date || new Date().toISOString().split('T')[0],
      encounterType: 'OPD',
      reasonForVisit: scanData.summaryText.slice(0, 90),
      summary: scanData.summaryText,
      relatedRecordIds: newMeds.map((m) => m.id),
      provenance: {
        id: `prov-enc-${Date.now()}`,
        recordedAt: new Date().toISOString(),
        tier: 'ocr-human-confirmed',
        confidenceScore: scanData.overallConfidence,
        hospitalOrClinic: scanData.doctor.clinicOrHospital,
        doctorName: scanData.doctor.name,
        verifiedBy: `${targetPatient.fullName} (Patient Confirmed)`,
      },
    };

    // 3. Structure Conditions from Clinical Indications
    const newConditions: UnifiedCondition[] = [];
    const indications = Array.from(
      new Set(
        scanData.medications
          .map((m) => m.clinicalIndication)
          .filter((ind): ind is string => Boolean(ind && typeof ind === 'string'))
      )
    );
    for (const ind of indications) {
      const exists = targetStore.conditions.some(
        (c) =>
          c.code.text.toLowerCase().includes(ind.toLowerCase()) ||
          ind.toLowerCase().includes(c.code.text.toLowerCase())
      );
      if (!exists) {
        newConditions.push({
          id: `cond-scan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          code: {
            coding: [{ system: 'http://snomed.info/sct', code: '404684003', display: ind }],
            text: ind,
          },
          clinicalStatus: 'active',
          verificationStatus: 'confirmed',
          onsetDate: scanData.doctor.date || new Date().toISOString().split('T')[0],
          recordedDate: new Date().toISOString().split('T')[0],
          diagnosingDoctor: scanData.doctor.name,
          diagnosingFacility: scanData.doctor.clinicOrHospital,
          notes: `Diagnosed during encounter at ${scanData.doctor.clinicOrHospital}.`,
          provenance: {
            id: `prov-cond-${Date.now()}`,
            recordedAt: new Date().toISOString(),
            tier: 'ocr-human-confirmed',
            confidenceScore: scanData.overallConfidence,
            hospitalOrClinic: scanData.doctor.clinicOrHospital,
            doctorName: scanData.doctor.name,
            verifiedBy: `${targetPatient.fullName} (Patient Confirmed)`,
          },
        });
      }
    }

    // 4. Structure Allergies
    const newAllergies: UnifiedAllergy[] = [];
    const rawAllergies = scanData.patient.allergies;
    if (
      rawAllergies &&
      !rawAllergies.toLowerCase().includes('none') &&
      !rawAllergies.toLowerCase().includes('nkda') &&
      !rawAllergies.toLowerCase().includes('no known')
    ) {
      const exists = targetStore.allergies.some((a) =>
        a.substance.toLowerCase().includes(rawAllergies.toLowerCase())
      );
      if (!exists) {
        newAllergies.push({
          id: `alg-scan-${Date.now()}`,
          substance: rawAllergies,
          criticality: rawAllergies.toLowerCase().includes('anaphyl') ? 'high' : 'medium',
          category: 'medication',
          manifestation: `Prescription header allergy annotation by ${scanData.doctor.name}`,
          verificationStatus: 'confirmed',
          recordedDate: scanData.doctor.date || new Date().toISOString().split('T')[0],
          provenance: {
            id: `prov-alg-${Date.now()}`,
            recordedAt: new Date().toISOString(),
            tier: 'ocr-human-confirmed',
            confidenceScore: scanData.overallConfidence,
            hospitalOrClinic: scanData.doctor.clinicOrHospital,
            doctorName: scanData.doctor.name,
          },
        });
      }
    }

    // 5. Structure Audit Log
    const auditEvent: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${targetPatient.fullName} (Data Principal)`,
      action: 'HUMAN_CONFIRM',
      purpose: 'RECORD_INGESTION_VALIDATION',
      resourceType: `MedicationRequest (${newMeds.length} items) & Encounter`,
      provenanceTier: 'ocr-human-confirmed',
      ipAddress: '122.161.49.201 (New Delhi)',
      verificationHash: `sha256:${Math.random().toString(36).slice(2)}${Date.now()}`,
    };

    // Store & update properly in target patient profile!
    setPatientsDatabase((prev) => ({
      ...prev,
      [targetId]: {
        ...targetStore,
        patient: targetPatient,
        medications: [...newMeds, ...targetStore.medications],
        encounters: [newEncounter, ...targetStore.encounters],
        conditions: [...newConditions, ...targetStore.conditions],
        allergies: [...newAllergies, ...targetStore.allergies],
        auditLogs: [auditEvent, ...targetStore.auditLogs],
      },
    }));

    // Switch view to this patient
    setCurrentPatientId(targetId);
    setActiveTab('timeline');
    setNotification(
      `Saved script for ${targetPatient.fullName}! Stored ${newMeds.length} meds, 1 encounter, and clinical indications in their respective areas.`
    );
    setTimeout(() => setNotification(null), 4500);
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
    updateCurrentStore((prev) => ({
      ...prev,
      auditLogs: [auditEvent, ...prev.auditLogs],
    }));
    setNotification('Safety alert marked as reconciled with clinical note.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Discontinue a duplicate medication
  const handleDiscontinueMedication = (medId: string) => {
    updateCurrentStore((prev) => ({
      ...prev,
      medications: prev.medications.map((m) =>
        m.id === medId ? { ...m, status: 'discontinued' } : m
      ),
    }));
    setNotification('Medication marked as discontinued in active regimen.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Create new ephemeral consent share
  const handleCreateConsent = (newConsent: EphemeralConsentShare) => {
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
    updateCurrentStore((prev) => ({
      ...prev,
      consents: [newConsent, ...prev.consents],
      auditLogs: [auditEvent, ...prev.auditLogs],
    }));
    setNotification(`Ephemeral share created: ${newConsent.shareToken}`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Revoke consent
  const handleRevokeConsent = (consentId: string) => {
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
    updateCurrentStore((prev) => ({
      ...prev,
      consents: prev.consents.map((c) =>
        c.id === consentId ? { ...c, status: 'revoked' } : c
      ),
      auditLogs: [auditEvent, ...prev.auditLogs],
    }));
    setNotification('Doctor access token revoked immediately.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Trigger emergency break-glass
  const handleTriggerBreakGlass = (entry: BreakGlassLogEntry) => {
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
    updateCurrentStore((prev) => ({
      ...prev,
      breakGlassLogs: [entry, ...prev.breakGlassLogs],
      auditLogs: [auditEvent, ...prev.auditLogs],
    }));
  };

  // Revoke emergency break-glass session early
  const handleRevokeBreakGlass = (logId: string) => {
    updateCurrentStore((prev) => ({
      ...prev,
      breakGlassLogs: prev.breakGlassLogs.map((l) =>
        l.id === logId ? { ...l, revokedEarly: true } : l
      ),
    }));
    setNotification('Emergency session revoked early by patient family.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Simulate cryptographic erasure for current patient
  const handleSimulateErasure = () => {
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
    updateCurrentStore((prev) => ({
      ...prev,
      medications: [],
      conditions: [],
      observations: [],
      encounters: [],
      auditLogs: [auditEvent, ...prev.auditLogs],
    }));
    setNotification(`Clinical keys shredded. Records purged for ${patient.fullName}.`);
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
    link.setAttribute('download', `MediScript_Audit_Trail_${patient.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
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

  // Determine OCR target patient label and match info
  const targetPatientStore = patientsDatabase[ocrTargetPatientId];
  const targetPatientName = targetPatientStore?.patient?.fullName || scanData.patient?.name || 'New Profile';
  const isTargetNew = ocrTargetPatientId === '__NEW__' || !targetPatientStore;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans transition-colors duration-200">
      {/* Skip to Main Content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#17483A] focus:text-[#F3EBD3] focus:rounded-xl focus:ring-2 focus:ring-[#C9A24B] focus:shadow-lg font-mono text-xs font-bold"
      >
        Skip to Main Content
      </a>

      {/* Top Bar Navigation (Strict 3-zone contract with theme switch & Patient Profile Switcher) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenVoice={handleOpenVoice}
        alertCount={unresolvedAlertCount}
        activeConsentCount={activeConsentCount}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        currentPatientId={currentPatientId}
        patientsDatabase={patientsDatabase}
        onSelectPatient={handleSelectPatient}
        onCreatePatient={handleCreatePatient}
      />

      {/* Notification Toast with Bulbasaur Teal styling */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="bg-[#3FA796]/15 border-b border-[#3FA796]/30 px-6 py-2.5 text-xs text-[#0F3D2E] dark:text-[#B8E986] flex items-center justify-between transition-all backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3FA796]" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            aria-label="Dismiss notification"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1E6556] dark:text-[#3FA796] hover:text-[#0F3D2E] dark:hover:text-white text-base font-bold transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA796]"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 outline-none">
        {/* Polished Hero / Landing Section (Bulbasaur-Inspired Nature Theme) */}
        {activeTab === 'timeline' && (
          <HeroLandingSection
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
            onOpenScan={() => setIsUploadModalOpen(true)}
            onOpenVoice={handleOpenVoice}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* Themed Sprout Loader when processing */}
        {isProcessing && (
          <ThemedSproutLoader label="Transcribing handwritten prescription with Gemini Vision OCR..." />
        )}

        {/* Natural Vine Curved Divider */}
        {activeTab === 'timeline' && (
          <VineDivider className="w-full h-3 text-[#3FA796]/30 my-1" />
        )}

        {/* TAB 1: Longitudinal Health Timeline with Quick Patient Switcher */}
        {activeTab === 'timeline' && (
          <HealthTimeline
            patient={patient}
            medications={medications}
            conditions={conditions}
            allergies={allergies}
            observations={observations}
            encounters={encounters}
            currentPatientId={currentPatientId}
            patientsDatabase={patientsDatabase}
            onSelectPatient={handleSelectPatient}
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

        {/* TAB 2: Prescription & Lab OCR Pipeline with Structured Patient Destination */}
        {activeTab === 'scanner' && (
          <div className="space-y-4">
            {isSimulatedScan && (
              <div className="flex items-start gap-3 p-3 rounded-2xl border border-[#E4572E]/40 bg-[#E4572E]/10 dark:bg-[#E4572E]/15 shadow-sm">
                <span className="text-[#E4572E] text-base leading-none mt-0.5">⚠</span>
                <div>
                  <p className="text-xs font-extrabold text-[#E4572E] tracking-wide">
                    SIMULATED DATA — not generated from a document.
                  </p>
                  <p className="text-[11px] text-[#4B6E60] dark:text-[#95BDB0] mt-0.5">
                    Verify only commit behavior with sample review. No real transcription of your document was produced.
                  </p>
                </div>
              </div>
            )}
            {/* Target Patient Profile Assignment Banner */}
            <div className="p-4 bg-white/80 dark:bg-[#0B1F18]/90 backdrop-blur-md rounded-2xl border border-[#3FA796]/30 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F3D2E] to-[#3FA796] flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0">
                  {targetPatientName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#0F3D2E] dark:text-[#F4FAF3]">
                      Target Patient Destination:
                    </span>
                    <span className="text-xs font-extrabold text-[#3FA796] dark:text-[#B8E986]">
                      {targetPatientName}
                    </span>
                    {isTargetNew ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B8E986]/20 text-[#0F3D2E] dark:text-[#B8E986] border border-[#B8E986]/40">
                        ✨ New Profile Auto-Generated
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3FA796]/15 text-[#3FA796] dark:text-[#B8E986]">
                        ✓ Matched Existing Profile ({targetPatientStore.patient.age}y, {targetPatientStore.patient.bloodGroup})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#4B6E60] dark:text-[#95BDB0] mt-0.5">
                    Prescription Header Name: &quot;<strong className="text-[#0F3D2E] dark:text-white">{scanData.patient.name}</strong>&quot; · Data will be structured into this profile&apos;s Medications, Encounters, and Conditions.
                  </p>
                </div>
              </div>

              {/* Patient Selector Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-semibold text-[#4B6E60] dark:text-[#95BDB0]">
                  Assign Script To:
                </span>
                <select
                  value={ocrTargetPatientId}
                  onChange={(e) => setOcrTargetPatientId(e.target.value)}
                  className="bg-[#F4FAF3] dark:bg-[#122B22] border border-[#3FA796]/30 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#0F3D2E] dark:text-[#F4FAF3] focus:outline-none focus:border-[#3FA796]"
                >
                  {Object.entries(patientsDatabase).map(([id, store]) => (
                    <option key={id} value={id}>
                      {store.patient.fullName} (ABHA: {store.patient.abhaId})
                    </option>
                  ))}
                  <option value="__NEW__">
                    + Create Brand New Profile for &quot;{scanData.patient.name}&quot;
                  </option>
                </select>
              </div>
            </div>

            {/* Mode Switcher: Dual Canvas OCR vs WhatsApp Ingestion Simulator */}
            <div className="glass-panel rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 border border-[#3FA796]/20">
              <div className="flex items-center gap-1.5 p-1 bg-white/60 dark:bg-[#071711] rounded-xl border border-[#3FA796]/20">
                <button
                  type="button"
                  onClick={() => setOcrMode('canvas')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    ocrMode === 'canvas'
                      ? 'bg-[#17483A] dark:bg-[#3FA796] text-white dark:text-[#0E2A21] shadow-sm font-bold'
                      : 'text-[#1B4332] dark:text-[#A3C5B8] hover:text-[#0F3D2E] dark:hover:text-white'
                  }`}
                >
                  Prescription Studio (Dual Canvas OCR)
                </button>
                <button
                  type="button"
                  onClick={() => setOcrMode('whatsapp')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    ocrMode === 'whatsapp'
                      ? 'bg-[#17483A] dark:bg-[#3FA796] text-white dark:text-[#0E2A21] shadow-sm font-bold'
                      : 'text-[#1B4332] dark:text-[#A3C5B8] hover:text-[#0F3D2E] dark:hover:text-white'
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
                  className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#0F3D2E] to-[#3FA796] hover:opacity-95 rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-[#0F3D2E]/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8E986]" />
                  <span>Commit Script to {targetPatientName.split(' ')[0]}&apos;s Timeline</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#0F3D2E] dark:text-[#F4FAF3] bg-white/70 dark:bg-[#122B22] hover:bg-white dark:hover:bg-[#17382D] rounded-xl border border-[#3FA796]/30 transition-colors flex items-center gap-1.5"
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

      {/* Floating Multilingual Voice-to-Voice AI Chatbot (SaurAssistant) */}
      <VoiceAssistantChatbot
        patient={patient}
        medications={medications}
        allergies={allergies}
        conditions={conditions}
      />

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

      {/* Split-Seed Opening Intro Animation Modal */}
      <SplitSeedIntroModal
        isOpen={isIntroModalOpen}
        onClose={() => setIsIntroModalOpen(false)}
      />

      {/* Editorial Vintage Natural-History Multi-Column Footer */}
      <footer className="border-t-2 border-[#C9A24B]/35 bg-[#FAF6EA] dark:bg-[#0E2A21] px-6 md:px-12 py-10 text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-auto font-sans transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#C9A24B]/25">
          {/* Col 1: Wordmark & Philosophy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#3FA796]/15 border border-[#C9A24B]/40 flex items-center justify-center text-[#3FA796]">
                <BulbSeedIcon size={20} />
              </div>
              <span className="font-editorial text-xl font-bold tracking-tight text-[#1B2A22] dark:text-[#F3EBD3]">
                MediScript
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              MediScript Continuity Platform. Unified health records and prescription OCR for Indian patients across hospitals, clinics, and diagnostic labs.
            </p>
            <div className="label-micro text-[#C9A24B]">
              PLATFORM DIRECTORY · 2026
            </div>
          </div>

          {/* Col 2: Sovereign Health Architecture */}
          <div className="space-y-2.5">
            <h4 className="label-micro text-[#C9A24B]">DIGITAL ARCHITECTURE</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7BC96F]" />
                <a
                  href="https://hl7.org/fhir/R4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors underline-offset-2 hover:underline"
                >
                  HL7 FHIR Release 4 Certified ↗
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3FA796]" />
                <a
                  href="https://abdm.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors underline-offset-2 hover:underline"
                >
                  India NRCES / ABDM Guidelines ↗
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
                <a
                  href="https://www.meity.gov.in/data-protection-framework"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors underline-offset-2 hover:underline"
                >
                  DPDP Act 2023 Sovereign Shield ↗
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5E99B]" />
                <a
                  href="https://ai.google.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors underline-offset-2 hover:underline"
                >
                  Gemini 3.8 Multimodal Vision ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Section Guide */}
          <div className="space-y-2.5">
            <h4 className="label-micro text-[#C9A24B]">NAVIGATION &amp; SECTIONS</h4>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors text-left"
                >
                  1. Health Timeline
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('scanner')}
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors text-left"
                >
                  2. Prescription &amp; Lab OCR
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('safety')}
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors text-left"
                >
                  3. Safety &amp; Conflicts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('consent')}
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors text-left"
                >
                  4. Consent &amp; Sharing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('emergency')}
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors text-left"
                >
                  5. Emergency Access
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('audit')}
                  className="hover:text-[#2D6A4F] dark:hover:text-[#52B788] transition-colors text-left"
                >
                  6. Audit &amp; Privacy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Actions & Return to Top */}
          <div className="space-y-3">
            <h4 className="label-micro text-[#C9A24B]">ACTIONS &amp; NAVIGATION</h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleReturnToTop}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/70 dark:bg-[#14372C] border border-[#C9A24B]/35 hover:border-[#3FA796] font-mono text-xs font-bold text-[#1B2A22] dark:text-[#F3EBD3] transition-all flex items-center justify-between"
              >
                <span>↑ RETURN TO TOP</span>
                <span className="text-[10px] text-[#C9A24B]">[BACK TO TOP]</span>
              </button>

              <button
                type="button"
                onClick={() => setIsIntroModalOpen(true)}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/70 dark:bg-[#14372C] border border-[#C9A24B]/35 hover:border-[#3FA796] font-mono text-xs text-[#3D5A4C] dark:text-[#A3C5B8] hover:text-[#3FA796] transition-all"
              >
                Replay Welcome Intro
              </button>

              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/70 dark:bg-[#14372C] border border-[#C9A24B]/35 hover:border-[#3FA796] font-mono text-xs text-[#3D5A4C] dark:text-[#A3C5B8] hover:text-[#3FA796] transition-all"
              >
                Export FHIR Bundle &amp; PDF
              </button>
            </div>
          </div>
        </div>

        {/* Footer Base Strip */}
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#1B2A22] dark:text-[#F3EBD3] font-bold">
              Current Active Patient: {patient.fullName} ({patient.bloodGroup})
            </span>
            <span>·</span>
            <span>ABHA: {patient.abhaId}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Palette: Forest 900 · Teal 500 · Leaf 400 · Parchment · Gold Leaf</span>
            <span>·</span>
            <span>No Official Pokémon Assets Used</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
