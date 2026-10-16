/**
 * FHIR R4 & Healthcare Continuity Platform Types
 * Compliant with HL7 FHIR Release 4 and India NRCES / ABDM Guidelines
 */

export type VerificationTier =
  | 'provider-verified'    // Tier 3: Signed by hospital EMR or ABDM HIP bridge
  | 'ocr-human-confirmed'  // Tier 2: AI parsed, patient or caregiver verified against image
  | 'ocr-unconfirmed'      // Tier 1: AI parsed, awaiting human review
  | 'patient-entered';     // Tier 1: Self-reported without source scan

export type RecordCategory =
  | 'medication'
  | 'condition'
  | 'allergy'
  | 'diagnostic-report'
  | 'observation'
  | 'encounter';

export interface ProvenanceMeta {
  id: string;
  recordedAt: string;
  tier: VerificationTier;
  confidenceScore: number; // 0 - 100
  sourceDocumentId?: string;
  sourceDocumentName?: string;
  sourceDocumentUrl?: string;
  sourceThumbnailUrl?: string;
  sourceBoundingBox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in 0-1000 scale
  aiExtractorModel?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  hospitalOrClinic: string;
  doctorName?: string;
  rawSourceSnippet?: string;
}

export interface FHIRCoding {
  system: string;
  code: string;
  display: string;
}

export interface FHIRCodeableConcept {
  coding: FHIRCoding[];
  text: string;
}

export interface UnifiedMedication {
  id: string;
  brandName: string;
  genericName: string;
  activeIngredients: {
    name: string;
    strengthMg: number;
    unit: string;
  }[];
  dosageForm: string;
  strength: string;
  sig: string;
  sigTranslated: string;
  timing: 'morning' | 'noon' | 'night' | 'bid' | 'tid' | 'qid' | 'prn' | 'stat';
  relationToFood: 'before_food' | 'after_food' | 'with_food' | 'anytime';
  status: 'active' | 'completed' | 'discontinued' | 'flagged-conflict';
  prescribedDate: string;
  prescribingDoctor: string;
  prescribingFacility: string;
  refillsRemaining: number;
  provenance: ProvenanceMeta;
  therapeuticClass: string;
  rxNormCui?: string;
  snomedCode?: string;
}

export interface UnifiedCondition {
  id: string;
  code: FHIRCodeableConcept;
  clinicalStatus: 'active' | 'recurrence' | 'relapse' | 'inactive' | 'remission' | 'resolved';
  verificationStatus: 'confirmed' | 'unconfirmed' | 'provisional' | 'differential';
  onsetDate: string;
  recordedDate: string;
  diagnosingDoctor: string;
  diagnosingFacility: string;
  notes?: string;
  provenance: ProvenanceMeta;
}

export interface UnifiedAllergy {
  id: string;
  substance: string;
  criticality: 'high' | 'medium' | 'low';
  category: 'medication' | 'food' | 'environment' | 'biologic';
  manifestation: string; // e.g. "Anaphylaxis, Angioedema, Rash"
  verificationStatus: 'confirmed' | 'unconfirmed';
  recordedDate: string;
  provenance: ProvenanceMeta;
}

export interface UnifiedLabObservation {
  id: string;
  testName: string;
  loincCode: string;
  value: number;
  unit: string;
  referenceRange: {
    low: number;
    high: number;
    text: string;
  };
  interpretation: 'normal' | 'high' | 'critical-high' | 'low' | 'critical-low';
  effectiveDate: string;
  performer: string; // e.g. "Dr. Lal PathLabs, Delhi"
  panelName: string; // e.g. "Comprehensive Metabolic Panel"
  provenance: ProvenanceMeta;
}

export interface UnifiedEncounter {
  id: string;
  hospitalName: string;
  doctorName: string;
  specialty: string;
  date: string;
  reasonForVisit: string;
  encounterType: 'OPD' | 'IPD' | 'EMERGENCY' | 'TELECONSULT';
  summary: string;
  relatedRecordIds: string[];
  documentUrl?: string;
  provenance: ProvenanceMeta;
}

export interface PatientProfile {
  id: string;
  abhaId: string; // Indian Ayushman Bharat Health Account ID (e.g. 91-8492-3810-4491)
  abhaAddress: string; // e.g. rajesh.sharma@abdm
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    alternatePhone?: string;
  };
  city: string;
  state: string;
}

export interface ClinicalSafetyAlert {
  id: string;
  severity: 'critical' | 'major' | 'moderate' | 'info';
  type: 'duplicate-ingredient' | 'allergy-conflict' | 'drug-drug-interaction' | 'dosage-ceiling' | 'food-interaction';
  title: string;
  description: string;
  involvedMedications: string[];
  clinicalRationale: string;
  recommendedAction: string;
  detectedAt: string;
  isResolved?: boolean;
  resolutionNote?: string;
}

export interface EphemeralConsentShare {
  id: string;
  shareToken: string;
  createdAt: string;
  expiresAt: string;
  purpose: 'TREATMENT' | 'SECOND_OPINION' | 'EMERGENCY' | 'INSURANCE_VERIFICATION';
  sharedWithLabel: string; // e.g. "Dr. Anand (Cardiology Consult)"
  pinRequired: boolean;
  pinCode?: string;
  allowedRecordIds: string[]; // Granular record IDs
  status: 'active' | 'expired' | 'revoked';
  accessCount: number;
  lastAccessedAt?: string;
}

export interface BreakGlassLogEntry {
  id: string;
  timestamp: string;
  responderName: string;
  responderRole: string; // e.g. "Emergency Department Attending"
  medicalRegistrationNumber: string; // NMC / State Medical Council reg
  hospitalFacility: string;
  justification: string;
  ipAddress: string;
  location: string;
  alertDispatchedTo: string[]; // Phone numbers alerted via SMS / WhatsApp
  sessionDurationMinutes: number;
  revokedEarly?: boolean;
}

export interface AuditTrailEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: 'RECORD_INGEST' | 'HUMAN_CONFIRM' | 'CONSENT_GRANTED' | 'CONSENT_REVOKED' | 'RECORD_VIEW' | 'BREAK_GLASS_ACCESS' | 'DATA_EXPORT' | 'ERASURE_REQUESTED';
  purpose: string;
  resourceType: string;
  resourceId?: string;
  provenanceTier?: VerificationTier;
  ipAddress: string;
  verificationHash: string;
}
