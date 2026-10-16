export interface ConfidenceBreakdown {
  doctorHeader: number;
  patientInfo: number;
  medications: number;
  instructionsSig: number;
  signatureStamp: number;
}

export interface OCRQualityAssessment {
  legibility: 'High' | 'Moderate' | 'Challenging';
  handwritingStyle: string;
  inkCondition: string;
  backgroundNoise: string;
  recommendation: string;
}

export interface PrescriberInfo {
  name: string;
  specialty?: string;
  clinicOrHospital: string;
  address?: string;
  phone?: string;
  licenseNumber?: string;
  deaNumber?: string;
  date: string;
  signatureDetected: boolean;
}

export interface PatientInfo {
  name: string;
  age?: string;
  dob?: string;
  gender?: string;
  weight?: string;
  allergies?: string;
  address?: string;
}

export interface MedicationItem {
  id: string;
  brandName: string;
  genericName?: string;
  dosageStrength: string;
  form?: string;
  route?: string;
  frequency?: string;
  sigRaw?: string;
  sigTranslated: string;
  quantity?: string;
  duration?: string;
  refills?: string;
  clinicalIndication?: string;
  safetyWarnings?: string[];
  confidence: number;
  pharmacistAlerts?: string[];
  isVerified?: boolean;
}

export type LineCategory =
  | 'doctor_header'
  | 'patient_info'
  | 'rx_medication'
  | 'sig_instructions'
  | 'signature_stamp'
  | 'footer';

export interface TranscriptionLine {
  id: string;
  lineNumber: number;
  rawHandwrittenText: string;
  normalizedMedicalText: string;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in 0-1000 scale
  confidence: number;
  category: LineCategory;
  alternatives?: string[];
  uncertainTokens?: string[];
  isEdited?: boolean;
}

export interface PrescriptionData {
  overallConfidence: number;
  confidenceBreakdown: ConfidenceBreakdown;
  ocrQualityAssessment: OCRQualityAssessment;
  doctor: PrescriberInfo;
  patient: PatientInfo;
  medications: MedicationItem[];
  transcriptionLines: TranscriptionLine[];
  criticalAlerts: string[];
  summaryText: string;
}

export interface AIModelDetails {
  modelName: string;
  modelVersion: string;
  architecture: string;
  spatialBoundingSystem: string;
  quantization: string;
  pharmacologyGrounding: string;
  inferenceLatencyMs: number;
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
  finishReason: string;
  timestamp: string;
  imageDpiEstimate: number;
  imageDimensions: string;
}

export interface ScanResult {
  success: boolean;
  data: PrescriptionData;
  modelDetails: AIModelDetails;
  scanSessionId: string;
}

export interface SamplePrescription {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imagePreviewUrl: string;
  generateDataUrl: () => string;
  presetData: PrescriptionData;
}
