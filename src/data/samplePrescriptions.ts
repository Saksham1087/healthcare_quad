import { SamplePrescription } from '../types/prescription';

/**
 * Generates an SVG Data URL of a medical prescription pad with authentic cursive doctor script,
 * Rx symbol, watermark lines, and signature.
 */
function createPrescriptionSvg(config: {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  rxNumber: string;
  date: string;
  patientName: string;
  patientAge: string;
  allergies: string;
  medicationLines: string[];
  sigLines: string[];
  refillText: string;
  doctorName: string;
  doctorLicense: string;
  inkColor: string;
  hasWatermark?: boolean;
}): string {
  const {
    clinicName,
    clinicAddress,
    clinicPhone,
    rxNumber,
    date,
    patientName,
    patientAge,
    allergies,
    medicationLines,
    sigLines,
    refillText,
    doctorName,
    doctorLicense,
    inkColor,
  } = config;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#faf8f2;font-family:'Segoe UI',Arial,sans-serif;">
    <defs>
      <!-- Paper grain & security pattern -->
      <pattern id="sec-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
        <text x="30" y="30" font-size="8" fill="#e2dac9" font-family="sans-serif" text-anchor="middle" transform="rotate(-30 30 30)" opacity="0.65">Rx SECURITY SECURE SCRIPT</text>
      </pattern>
      <linearGradient id="paper-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fbf9f4"/>
        <stop offset="50%" stop-color="#f6f2e8"/>
        <stop offset="100%" stop-color="#eee7d8"/>
      </linearGradient>
      <!-- Shadow filter -->
      <filter id="ink-blur" x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur stdDeviation="0.2" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Background paper -->
    <rect width="800" height="1100" fill="url(#paper-grad)"/>
    <rect width="800" height="1100" fill="url(#sec-pattern)"/>

    <!-- Subtle border & perimeter rule -->
    <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#d5c8b0" stroke-width="1.5"/>
    <rect x="29" y="29" width="742" height="1042" fill="none" stroke="#e6decb" stroke-width="0.8"/>

    <!-- Clinic Header Printed -->
    <g transform="translate(60, 65)">
      <circle cx="28" cy="28" r="24" fill="none" stroke="#2b4b6f" stroke-width="2"/>
      <path d="M 28 14 L 28 42 M 14 28 L 42 28" stroke="#2b4b6f" stroke-width="4" stroke-linecap="round"/>
      <text x="70" y="24" font-size="20" font-weight="700" fill="#1e3a5f" letter-spacing="0.5">${clinicName}</text>
      <text x="70" y="42" font-size="12" fill="#556980">${clinicAddress} · Tel: ${clinicPhone}</text>
    </g>

    <line x1="60" y1="130" x2="740" y2="130" stroke="#1e3a5f" stroke-width="2"/>

    <!-- Patient Header Box -->
    <g transform="translate(60, 145)">
      <!-- Printed labels -->
      <text x="0" y="24" font-size="13" font-weight="600" fill="#445566">PATIENT NAME:</text>
      <line x1="110" y1="28" x2="480" y2="28" stroke="#c0b5a0" stroke-width="1"/>
      <text x="500" y="24" font-size="13" font-weight="600" fill="#445566">AGE:</text>
      <line x1="540" y1="28" x2="680" y2="28" stroke="#c0b5a0" stroke-width="1"/>

      <text x="0" y="60" font-size="13" font-weight="600" fill="#445566">DATE OF ISSUE:</text>
      <line x1="110" y1="64" x2="320" y2="64" stroke="#c0b5a0" stroke-width="1"/>
      <text x="340" y="60" font-size="13" font-weight="600" fill="#b03030">ALLERGIES:</text>
      <line x1="420" y1="64" x2="680" y2="64" stroke="#c0b5a0" stroke-width="1"/>

      <!-- Handwritten cursive patient values in ${inkColor} -->
      <g filter="url(#ink-blur)" fill="${inkColor}" font-family="'Brush Script MT', 'Dancing Script', 'Caveat', 'Segoe Script', cursive" font-size="28" font-style="italic">
        <text x="120" y="22" transform="rotate(-1.5 120 22)">${patientName}</text>
        <text x="555" y="22" transform="rotate(-1 555 22)">${patientAge}</text>
        <text x="120" y="58" transform="rotate(-1 120 58)">${date}</text>
        <text x="430" y="58" font-weight="bold" fill="#a01515" transform="rotate(-1.5 430 58)">${allergies}</text>
      </g>
    </g>

    <line x1="60" y1="230" x2="740" y2="230" stroke="#d5c8b0" stroke-width="1"/>

    <!-- Large Rx Symbol -->
    <g transform="translate(60, 260)">
      <text x="0" y="60" font-size="70" font-family="'Times New Roman', serif" font-weight="bold" font-style="italic" fill="#2b4b6f" opacity="0.85">℞</text>
    </g>

    <!-- Faint ruling lines for doctor handwriting area -->
    <g stroke="#e2d8c4" stroke-dasharray="2,2" stroke-width="0.8">
      <line x1="140" y1="330" x2="720" y2="330"/>
      <line x1="140" y1="410" x2="720" y2="410"/>
      <line x1="140" y1="490" x2="720" y2="490"/>
      <line x1="140" y1="570" x2="720" y2="570"/>
      <line x1="140" y1="650" x2="720" y2="650"/>
      <line x1="140" y1="730" x2="720" y2="730"/>
    </g>

    <!-- Handwritten Medical Content -->
    <g filter="url(#ink-blur)" fill="${inkColor}" font-family="'Brush Script MT', 'Dancing Script', 'Caveat', 'Segoe Script', cursive" font-style="italic">
      <!-- Medication 1 -->
      <text x="145" y="325" font-size="34" font-weight="bold" transform="rotate(-0.8 145 325)">${medicationLines[0] || ''}</text>
      <text x="175" y="395" font-size="29" transform="rotate(-0.5 175 395)">${sigLines[0] || ''}</text>

      <!-- Medication 2 (if present) -->
      ${
        medicationLines[1]
          ? `<text x="145" y="505" font-size="33" font-weight="bold" transform="rotate(-1.2 145 505)">${medicationLines[1]}</text>
             <text x="175" y="575" font-size="28" transform="rotate(-0.6 175 575)">${sigLines[1] || ''}</text>`
          : ''
      }

      <!-- Refill & Dispense Notation -->
      <text x="145" y="670" font-size="26" transform="rotate(-1 145 670)">${refillText}</text>
    </g>

    <!-- Footer Security & Signature Zone -->
    <line x1="60" y1="770" x2="740" y2="770" stroke="#1e3a5f" stroke-width="1.5"/>

    <g transform="translate(60, 790)">
      <!-- Checkboxes -->
      <rect x="0" y="10" width="14" height="14" fill="none" stroke="#445566" stroke-width="1.2"/>
      <text x="22" y="22" font-size="11" fill="#445566">DISPENSE AS WRITTEN</text>

      <rect x="180" y="10" width="14" height="14" fill="none" stroke="#445566" stroke-width="1.2"/>
      <text x="202" y="22" font-size="11" fill="#445566">GENERIC SUBSTITUTION PERMITTED</text>
      <!-- Checkmark -->
      <path d="M 183 17 L 187 21 L 195 12" fill="none" stroke="${inkColor}" stroke-width="2.5" stroke-linecap="round"/>

      <!-- Prescriber Signature Line -->
      <text x="440" y="90" font-size="11" fill="#445566" text-anchor="middle">PHYSICIAN SIGNATURE</text>
      <line x1="320" y1="75" x2="560" y2="75" stroke="#445566" stroke-width="1"/>

      <!-- Flourish cursive signature -->
      <g filter="url(#ink-blur)" fill="${inkColor}">
        <path d="M 335 70 Q 370 20 400 60 T 450 35 T 520 70 M 360 45 Q 480 30 545 40" fill="none" stroke="${inkColor}" stroke-width="2.2" stroke-linecap="round"/>
        <text x="365" y="66" font-family="'Brush Script MT', cursive" font-size="28" font-style="italic">${doctorName}</text>
      </g>

      <!-- DEA & License -->
      <text x="0" y="95" font-size="11" fill="#778899">LIC #: ${doctorLicense}</text>
      <text x="0" y="112" font-size="11" fill="#778899">SECURITY RX SCRIPT ID: ${rxNumber}</text>
    </g>

    <!-- Hospital Official Seal Stamp -->
    <g transform="translate(610, 830) rotate(-12)" opacity="0.65">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#992222" stroke-width="2.5" stroke-dasharray="4,2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#992222" stroke-width="1"/>
      <text x="50" y="38" font-size="8.5" font-weight="bold" fill="#992222" text-anchor="middle">CERTIFIED PRESCRIBER</text>
      <text x="50" y="54" font-size="10" font-weight="bold" fill="#992222" text-anchor="middle">METRO HEALTH</text>
      <text x="50" y="68" font-size="8" fill="#992222" text-anchor="middle">VALIDATED</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PRESCRIPTIONS: SamplePrescription[] = [
  {
    id: 'sample-respiratory',
    title: 'Dr. Evelyn Vance - Acute Respiratory Script',
    subtitle: 'Internal Medicine · Azithromycin 250mg & Benzonatate 100mg',
    category: 'Respiratory / Infection',
    imagePreviewUrl: '',
    generateDataUrl: () =>
      createPrescriptionSvg({
        clinicName: 'Metropolitan Health Center',
        clinicAddress: '742 Evergreen Medical Plaza, Suite 400, New York',
        clinicPhone: '(555) 839-2041',
        rxNumber: 'RX-2026-94812-NY',
        date: '10/14/2026',
        patientName: 'Robert C. Martinez',
        patientAge: '48 y/o',
        allergies: 'Penicillin (Rash)',
        medicationLines: [
          'Azithromycin 250mg tabs #6 (Z-Pak)',
          'Benzonatate 100mg caps #20',
        ],
        sigLines: [
          'Sig: 2 tab stat, then 1 tab qd x 4d',
          'Sig: 1 cap PO TID prn persistent cough',
        ],
        refillText: 'Refills: 0 for Azithromycin / 1 for Benzonatate',
        doctorName: 'Dr. Evelyn Vance, MD',
        doctorLicense: 'MD-849204-NY · DEA: BV-9382104',
        inkColor: '#123962',
      }),
    presetData: {
      overallConfidence: 94.8,
      confidenceBreakdown: {
        doctorHeader: 98.2,
        patientInfo: 96.5,
        medications: 93.4,
        instructionsSig: 92.1,
        signatureStamp: 97.0,
      },
      ocrQualityAssessment: {
        legibility: 'Moderate',
        handwritingStyle: 'Doctor Cursive Clinical Shorthand',
        inkCondition: 'High-contrast Blue Ballpoint Ink on Prescriber Pad',
        backgroundNoise: 'Prescription Security Watermark (Void/Copy Pantograph)',
        recommendation: 'Legible clinical script. Dispense after standard pharmacist identity check.',
      },
      doctor: {
        name: 'Dr. Evelyn Vance, MD',
        specialty: 'Internal Medicine & Infectious Diseases',
        clinicOrHospital: 'Metropolitan Health Center',
        address: '742 Evergreen Medical Plaza, Suite 400',
        phone: '(555) 839-2041',
        licenseNumber: 'MD-849204-NY',
        deaNumber: 'BV-9382104',
        date: '2026-10-14',
        signatureDetected: true,
      },
      patient: {
        name: 'Robert C. Martinez',
        age: '48 y/o',
        dob: '1978-04-12',
        gender: 'Male',
        weight: '82 kg',
        allergies: 'Penicillin (Mild Rash)',
        address: '148 Elmwood Terrace, Apt 3B',
      },
      medications: [
        {
          id: 'med-1',
          brandName: 'Zithromax',
          genericName: 'Azithromycin',
          dosageStrength: '250 mg',
          form: 'Oral Tablet',
          route: 'Oral (PO)',
          frequency: 'Daily (Z-Pak protocol)',
          sigRaw: 'Sig: 2 tab stat, then 1 tab qd x 4d',
          sigTranslated: 'Take 2 tablets (500mg) immediately on Day 1, then 1 tablet (250mg) once daily on Days 2 through 5.',
          quantity: '#6 Tablets (Z-Pak blister card)',
          duration: '5 Days',
          refills: '0 (Zero)',
          clinicalIndication: 'Acute Bacterial Sinusitis / Bronchial Exacerbation',
          safetyWarnings: [
            'May be taken with or without food; take with meals if nausea occurs.',
            'Report any sudden heart palpitations or severe diarrhea immediately.',
            'Do not take aluminum- or magnesium-containing antacids within 2 hours.',
          ],
          confidence: 96.2,
          pharmacistAlerts: [
            'Alternative selected due to documented Penicillin allergy.',
          ],
        },
        {
          id: 'med-2',
          brandName: 'Tessalon Perles',
          genericName: 'Benzonatate',
          dosageStrength: '100 mg',
          form: 'Liquid-filled Perle Capsule',
          route: 'Oral (PO)',
          frequency: 'Three times daily as needed for cough',
          sigRaw: 'Sig: 1 cap PO TID prn cough',
          sigTranslated: 'Swallow 1 capsule whole by mouth three times daily as needed for persistent cough. Do NOT chew or crush.',
          quantity: '#20 Capsules',
          duration: '7 Days',
          refills: '1 Refill',
          clinicalIndication: 'Symptomatic Relief of Non-Productive Cough',
          safetyWarnings: [
            'WARNING: Must be swallowed whole. Chewing or sucking capsule causes rapid oropharyngeal numbness and fatal choking risk in young children.',
            'Keep strictly out of reach of children.',
          ],
          confidence: 91.5,
          pharmacistAlerts: [
            'Counsel patient strictly to swallow whole without chewing.',
          ],
        },
      ],
      transcriptionLines: [
        {
          id: 'line-1',
          lineNumber: 1,
          rawHandwrittenText: 'Metropolitan Health Center - Dr. E. Vance MD',
          normalizedMedicalText: 'Metropolitan Health Center - Dr. Evelyn Vance, MD',
          box2d: [60, 60, 130, 930],
          confidence: 98.4,
          category: 'doctor_header',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-2',
          lineNumber: 2,
          rawHandwrittenText: 'Pt: Robt Martinez Age: 48 Date: 10/14/26',
          normalizedMedicalText: 'Patient: Robert Martinez, Age: 48, Date: October 14, 2026',
          box2d: [145, 60, 210, 910],
          confidence: 97.1,
          category: 'patient_info',
          alternatives: ['Rob Martinez', 'Robert C Martinez'],
          uncertainTokens: [],
        },
        {
          id: 'line-3',
          lineNumber: 3,
          rawHandwrittenText: 'Allergies: Penicillin (Rash)',
          normalizedMedicalText: 'Allergies: Penicillin (Skin Rash)',
          box2d: [205, 340, 255, 680],
          confidence: 95.8,
          category: 'patient_info',
          alternatives: ['PCN rash'],
          uncertainTokens: [],
        },
        {
          id: 'line-4',
          lineNumber: 4,
          rawHandwrittenText: 'Rx: Azithromycin 250mg tabs #6 (Z-Pak)',
          normalizedMedicalText: 'Rx: Azithromycin 250 mg tablets, Dispense: #6 (Z-Pak)',
          box2d: [290, 140, 355, 880],
          confidence: 96.5,
          category: 'rx_medication',
          alternatives: ['Azithromycin 250 mg tab'],
          uncertainTokens: [],
        },
        {
          id: 'line-5',
          lineNumber: 5,
          rawHandwrittenText: 'Sig: 2 tab stat, then 1 tab qd x 4d',
          normalizedMedicalText: 'Sig: 2 tablets stat, then 1 tablet daily for 4 days',
          box2d: [365, 170, 425, 890],
          confidence: 94.2,
          category: 'sig_instructions',
          alternatives: ['2 tab stat then 1 tab qd'],
          uncertainTokens: [],
        },
        {
          id: 'line-6',
          lineNumber: 6,
          rawHandwrittenText: 'Rx: Benzonatate 100mg caps #20',
          normalizedMedicalText: 'Rx: Benzonatate 100 mg capsules (Tessalon Perles), Quantity: 20',
          box2d: [470, 140, 535, 870],
          confidence: 92.4,
          category: 'rx_medication',
          alternatives: ['Benzonatate 100mg'],
          uncertainTokens: ['caps'],
        },
        {
          id: 'line-7',
          lineNumber: 7,
          rawHandwrittenText: 'Sig: 1 cap PO TID prn persistent cough',
          normalizedMedicalText: 'Sig: 1 capsule by mouth three times daily as needed for persistent cough (Do not chew)',
          box2d: [545, 170, 605, 920],
          confidence: 90.8,
          category: 'sig_instructions',
          alternatives: ['1 cap po tid prn'],
          uncertainTokens: ['persistent'],
        },
        {
          id: 'line-8',
          lineNumber: 8,
          rawHandwrittenText: 'Refills: 0 for Azithromycin / 1 for Benzonatate',
          normalizedMedicalText: 'Refills: 0 for Azithromycin / 1 Refill for Benzonatate',
          box2d: [640, 140, 700, 840],
          confidence: 95.0,
          category: 'rx_medication',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-9',
          lineNumber: 9,
          rawHandwrittenText: 'Dr. Evelyn Vance, MD [Signature Verified]',
          normalizedMedicalText: 'Physician Signature: Dr. Evelyn Vance, MD',
          box2d: [780, 320, 890, 600],
          confidence: 97.6,
          category: 'signature_stamp',
          alternatives: [],
          uncertainTokens: [],
        },
      ],
      criticalAlerts: [
        'Documented Penicillin allergy: Prescriber appropriately chose Azithromycin (Macrolide class) without cross-reactivity.',
        'Benzonatate Counseling Alert: Choking hazard if capsule is bitten or chewed. Ensure patient counseling flag is highlighted.',
      ],
      summaryText:
        'Valid electronic/scanned prescription for Robert Martinez (48yo) issued by Dr. Evelyn Vance. Prescribed 5-day Z-Pak (Azithromycin 250mg) and Benzonatate 100mg for symptomatic acute respiratory infection. Allergy to penicillin confirmed and safely avoided.',
    },
  },
  {
    id: 'sample-cardio',
    title: 'Dr. Marcus Sterling - Cardiovascular Therapy',
    subtitle: 'Cardiology · Lisinopril 20mg & Atorvastatin 40mg',
    category: 'Cardiovascular / Lipid',
    imagePreviewUrl: '',
    generateDataUrl: () =>
      createPrescriptionSvg({
        clinicName: 'St. Jude Heart & Vascular Institute',
        clinicAddress: '1200 St. Jude Boulevard, Building B, Chicago, IL',
        clinicPhone: '(312) 555-0199',
        rxNumber: 'RX-CARDIO-88310',
        date: '10/12/2026',
        patientName: 'Eleanor Chen',
        patientAge: '62 y/o',
        allergies: 'NKDA (No Known Drug Allergies)',
        medicationLines: [
          'Lisinopril 20mg tab #30 (thirty)',
          'Atorvastatin 40mg tab #30 (thirty)',
        ],
        sigLines: [
          'Sig: 1 tab PO qam with water',
          'Sig: 1 tab PO qhs (bedtime)',
        ],
        refillText: 'Refills: 3 (three) times / BP check in 3 mos',
        doctorName: 'Dr. Marcus Sterling, MD, FACC',
        doctorLicense: 'IL-394821-B · DEA: MS-4829103',
        inkColor: '#1a1f2c',
      }),
    presetData: {
      overallConfidence: 96.4,
      confidenceBreakdown: {
        doctorHeader: 99.1,
        patientInfo: 98.0,
        medications: 95.8,
        instructionsSig: 94.6,
        signatureStamp: 98.5,
      },
      ocrQualityAssessment: {
        legibility: 'High',
        handwritingStyle: 'Rapid Clinical Print-Cursive Hybrid',
        inkCondition: 'Jet Black Gel Ink, High Contrast, Crisp Strokes',
        backgroundNoise: 'Clean Medical Paper, Minimal Artifacts',
        recommendation: 'Excellent legibility. All dosage units and Sig directions verified.',
      },
      doctor: {
        name: 'Dr. Marcus Sterling, MD, FACC',
        specialty: 'Cardiovascular Disease & Hypertension',
        clinicOrHospital: 'St. Jude Heart & Vascular Institute',
        address: '1200 St. Jude Boulevard, Building B, Chicago, IL',
        phone: '(312) 555-0199',
        licenseNumber: 'IL-394821-B',
        deaNumber: 'MS-4829103',
        date: '2026-10-12',
        signatureDetected: true,
      },
      patient: {
        name: 'Eleanor Chen',
        age: '62 y/o',
        dob: '1964-07-28',
        gender: 'Female',
        weight: '68 kg',
        allergies: 'No Known Drug Allergies (NKDA)',
        address: '420 Lake Shore Drive, Apt 11',
      },
      medications: [
        {
          id: 'med-cardio-1',
          brandName: 'Prinivil / Zestril',
          genericName: 'Lisinopril',
          dosageStrength: '20 mg',
          form: 'Oral Tablet',
          route: 'Oral (PO)',
          frequency: 'Once daily in the morning',
          sigRaw: 'Sig: 1 tab PO qam with water',
          sigTranslated: 'Take 1 tablet (20mg) by mouth every morning with a full glass of water.',
          quantity: '#30 Tablets',
          duration: '30 Days',
          refills: '3 Refills',
          clinicalIndication: 'Essential Hypertension / Renal Microvascular Protection',
          safetyWarnings: [
            'Do not use salt substitutes containing potassium without consulting prescriber.',
            'Report sudden swelling of the lips, face, or tongue immediately (angioedema risk).',
            'May cause dry persistent cough; inform physician if uncomfortable.',
          ],
          confidence: 96.8,
          pharmacistAlerts: ['Electrolyte panel (potassium and serum creatinine) recommended in 3 months.'],
        },
        {
          id: 'med-cardio-2',
          brandName: 'Lipitor',
          genericName: 'Atorvastatin Calcium',
          dosageStrength: '40 mg',
          form: 'Oral Tablet',
          route: 'Oral (PO)',
          frequency: 'Once daily at bedtime',
          sigRaw: 'Sig: 1 tab PO qhs (bedtime)',
          sigTranslated: 'Take 1 tablet (40mg) by mouth once daily at bedtime.',
          quantity: '#30 Tablets',
          duration: '30 Days',
          refills: '3 Refills',
          clinicalIndication: 'Hypercholesterolemia / ASCVD Risk Reduction',
          safetyWarnings: [
            'Avoid excessive consumption of grapefruit or grapefruit juice.',
            'Report unexplained muscle ache, tenderness, or weakness immediately.',
          ],
          confidence: 95.4,
          pharmacistAlerts: ['High-intensity statin therapy; baseline liver enzyme check logged.'],
        },
      ],
      transcriptionLines: [
        {
          id: 'line-c1',
          lineNumber: 1,
          rawHandwrittenText: 'St. Jude Heart & Vascular Institute - Dr. M. Sterling',
          normalizedMedicalText: 'St. Jude Heart & Vascular Institute - Dr. Marcus Sterling, MD',
          box2d: [60, 60, 130, 930],
          confidence: 99.1,
          category: 'doctor_header',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-c2',
          lineNumber: 2,
          rawHandwrittenText: 'Pt: Eleanor Chen Age: 62 Date: 10/12/26',
          normalizedMedicalText: 'Patient: Eleanor Chen, Age: 62, Date: October 12, 2026',
          box2d: [145, 60, 210, 910],
          confidence: 98.0,
          category: 'patient_info',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-c3',
          lineNumber: 3,
          rawHandwrittenText: 'Allergies: NKDA',
          normalizedMedicalText: 'Allergies: No Known Drug Allergies (NKDA)',
          box2d: [205, 340, 255, 680],
          confidence: 97.4,
          category: 'patient_info',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-c4',
          lineNumber: 4,
          rawHandwrittenText: 'Rx: Lisinopril 20mg tab #30 (thirty)',
          normalizedMedicalText: 'Rx: Lisinopril 20 mg tablet, Dispense: #30 (thirty)',
          box2d: [290, 140, 355, 880],
          confidence: 96.8,
          category: 'rx_medication',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-c5',
          lineNumber: 5,
          rawHandwrittenText: 'Sig: 1 tab PO qam with water',
          normalizedMedicalText: 'Sig: 1 tablet by mouth every morning with water',
          box2d: [365, 170, 425, 890],
          confidence: 95.9,
          category: 'sig_instructions',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-c6',
          lineNumber: 6,
          rawHandwrittenText: 'Rx: Atorvastatin 40mg tab #30 (thirty)',
          normalizedMedicalText: 'Rx: Atorvastatin 40 mg tablet, Dispense: #30 (thirty)',
          box2d: [470, 140, 535, 870],
          confidence: 95.4,
          category: 'rx_medication',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-c7',
          lineNumber: 7,
          rawHandwrittenText: 'Sig: 1 tab PO qhs (bedtime)',
          normalizedMedicalText: 'Sig: 1 tablet by mouth every night at bedtime',
          box2d: [545, 170, 605, 920],
          confidence: 94.6,
          category: 'sig_instructions',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-c8',
          lineNumber: 8,
          rawHandwrittenText: 'Refills: 3 (three) times / BP check in 3 mos',
          normalizedMedicalText: 'Refills: 3 / Prescriber Note: BP re-evaluation in 3 months',
          box2d: [640, 140, 700, 840],
          confidence: 96.1,
          category: 'rx_medication',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-c9',
          lineNumber: 9,
          rawHandwrittenText: 'Dr. Marcus Sterling [Signature Verified]',
          normalizedMedicalText: 'Physician Signature: Dr. Marcus Sterling, MD, FACC',
          box2d: [780, 320, 890, 600],
          confidence: 98.5,
          category: 'signature_stamp',
          alternatives: [],
          uncertainTokens: [],
        },
      ],
      criticalAlerts: [
        'Concurrent ACE inhibitor and Statin therapy: Common, synergistically indicated for cardiovascular protection. No pharmacokinetic clash.',
      ],
      summaryText:
        'Clean, unambiguous cardiovascular maintenance prescription for Eleanor Chen (62yo) by Dr. Marcus Sterling. Lisinopril 20mg daily for blood pressure control and Atorvastatin 40mg at bedtime for lipid reduction. 3 refills authorized.',
    },
  },
  {
    id: 'sample-pediatric',
    title: 'Dr. Sarah Jenkins - Pediatric Dosing Script',
    subtitle: 'Pediatrics · Augmentin 400mg/5mL oral suspension',
    category: 'Pediatrics / Antibiotic',
    imagePreviewUrl: '',
    generateDataUrl: () =>
      createPrescriptionSvg({
        clinicName: "Children's Memorial Pediatric Care",
        clinicAddress: '500 Blossom Hill Road, Austin, TX 78704',
        clinicPhone: '(512) 555-8321',
        rxNumber: 'RX-PED-04921',
        date: '10/15/2026',
        patientName: 'Lucas Diaz (wt: 21 kg)',
        patientAge: '6 yrs',
        allergies: 'No Known Drug Allergies',
        medicationLines: [
          'Augmentin 400mg/57mg per 5mL oral susp',
          'Dispense: 100 mL bottle (reconstituted)',
        ],
        sigLines: [
          'Sig: Give 5.5 mL PO BID with meals x 10d',
          'Shake well before each dose. Keep refrigerated.',
        ],
        refillText: 'Refills: 0 (Zero) / Discard remaining after 10 days',
        doctorName: 'Dr. Sarah Jenkins, MD, FAAP',
        doctorLicense: 'TX-PED-84920 · DEA: SJ-8392014',
        inkColor: '#1d3557',
      }),
    presetData: {
      overallConfidence: 95.2,
      confidenceBreakdown: {
        doctorHeader: 98.7,
        patientInfo: 97.4,
        medications: 94.1,
        instructionsSig: 93.8,
        signatureStamp: 97.9,
      },
      ocrQualityAssessment: {
        legibility: 'High',
        handwritingStyle: 'Neat Pediatric Clinical Script',
        inkCondition: 'Navy Blue Fountain Ink, High Contrast',
        backgroundNoise: 'Pastel Security Border',
        recommendation: 'Weight-based calculation explicitly verified (45mg/kg/day standard pediatric otitis media target).',
      },
      doctor: {
        name: 'Dr. Sarah Jenkins, MD, FAAP',
        specialty: 'Pediatric Medicine',
        clinicOrHospital: "Children's Memorial Pediatric Care",
        address: '500 Blossom Hill Road, Austin, TX 78704',
        phone: '(512) 555-8321',
        licenseNumber: 'TX-PED-84920',
        deaNumber: 'SJ-8392014',
        date: '2026-10-15',
        signatureDetected: true,
      },
      patient: {
        name: 'Lucas Diaz',
        age: '6 y/o',
        dob: '2020-03-14',
        gender: 'Male',
        weight: '21 kg',
        allergies: 'No Known Drug Allergies',
        address: '812 South Congress Ave, Austin, TX',
      },
      medications: [
        {
          id: 'med-ped-1',
          brandName: 'Augmentin',
          genericName: 'Amoxicillin and Clavulanate Potassium',
          dosageStrength: '400 mg / 57 mg per 5 mL',
          form: 'Oral Powder for Suspension',
          route: 'Oral (PO)',
          frequency: 'Twice daily (every 12 hours) with meals',
          sigRaw: 'Sig: Give 5.5 mL PO BID with meals x 10d',
          sigTranslated: 'Give 5.5 mL by mouth twice daily (every 12 hours) at start of a meal for 10 days. Shake well before using.',
          quantity: '100 mL bottle',
          duration: '10 Days',
          refills: '0 (Zero)',
          clinicalIndication: 'Acute Otitis Media (Pediatric Middle Ear Infection)',
          safetyWarnings: [
            'Administer at the start of a meal to minimize gastrointestinal discomfort and enhance clavulanate absorption.',
            'Store reconstituted suspension in refrigerator (2°C to 8°C). Discard any unused portion after 10 days.',
            'Use calibrated oral dosing syringe; do not use standard kitchen teaspoons.',
          ],
          confidence: 95.8,
          pharmacistAlerts: [
            'Weight verified: 21 kg. Total amoxicillin daily dose = 880 mg/day (~42 mg/kg/day), appropriate for pediatric otitis media.',
          ],
        },
      ],
      transcriptionLines: [
        {
          id: 'line-p1',
          lineNumber: 1,
          rawHandwrittenText: "Children's Memorial Pediatric Care - Dr. S. Jenkins MD",
          normalizedMedicalText: "Children's Memorial Pediatric Care - Dr. Sarah Jenkins, MD, FAAP",
          box2d: [60, 60, 130, 930],
          confidence: 98.7,
          category: 'doctor_header',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-p2',
          lineNumber: 2,
          rawHandwrittenText: 'Pt: Lucas Diaz (wt: 21 kg) Age: 6 yrs Date: 10/15/26',
          normalizedMedicalText: 'Patient: Lucas Diaz (Weight: 21 kg), Age: 6 years, Date: October 15, 2026',
          box2d: [145, 60, 210, 910],
          confidence: 97.4,
          category: 'patient_info',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-p3',
          lineNumber: 3,
          rawHandwrittenText: 'Allergies: No Known Drug Allergies',
          normalizedMedicalText: 'Allergies: No Known Drug Allergies (NKDA)',
          box2d: [205, 340, 255, 680],
          confidence: 96.5,
          category: 'patient_info',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-p4',
          lineNumber: 4,
          rawHandwrittenText: 'Rx: Augmentin 400mg/57mg per 5mL oral susp',
          normalizedMedicalText: 'Rx: Augmentin 400 mg / 57 mg per 5 mL oral suspension',
          box2d: [290, 140, 355, 880],
          confidence: 95.8,
          category: 'rx_medication',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-p5',
          lineNumber: 5,
          rawHandwrittenText: 'Dispense: 100 mL bottle (reconstituted)',
          normalizedMedicalText: 'Dispense: 100 mL bottle for reconstitution',
          box2d: [365, 140, 425, 820],
          confidence: 94.6,
          category: 'rx_medication',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-p6',
          lineNumber: 6,
          rawHandwrittenText: 'Sig: Give 5.5 mL PO BID with meals x 10d',
          normalizedMedicalText: 'Sig: Give 5.5 mL by mouth twice daily with meals for 10 days',
          box2d: [470, 140, 535, 870],
          confidence: 93.8,
          category: 'sig_instructions',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-p7',
          lineNumber: 7,
          rawHandwrittenText: 'Shake well before each dose. Keep refrigerated.',
          normalizedMedicalText: 'Auxiliary Sig: Shake well before each dose. Keep refrigerated.',
          box2d: [545, 170, 605, 920],
          confidence: 94.2,
          category: 'sig_instructions',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-p8',
          lineNumber: 8,
          rawHandwrittenText: 'Refills: 0 (Zero) / Discard remaining after 10 days',
          normalizedMedicalText: 'Refills: 0 (Zero) / Instruction: Discard remainder after 10 days',
          box2d: [640, 140, 700, 840],
          confidence: 96.0,
          category: 'rx_medication',
          alternatives: [],
          uncertainTokens: [],
        },
        {
          id: 'line-p9',
          lineNumber: 9,
          rawHandwrittenText: 'Dr. Sarah Jenkins, MD [Signature Verified]',
          normalizedMedicalText: 'Physician Signature: Dr. Sarah Jenkins, MD, FAAP',
          box2d: [780, 320, 890, 600],
          confidence: 97.9,
          category: 'signature_stamp',
          alternatives: [],
          uncertainTokens: [],
        },
      ],
      criticalAlerts: [
        'Pediatric dosing verified: Lucas Diaz (21 kg) prescribed 5.5 mL BID of 400mg/5mL = 880 mg amoxicillin/day = 41.9 mg/kg/day (Guideline target 40-45 mg/kg/day). Dosing is clinically exact.',
      ],
      summaryText:
        'Pediatric prescription for Lucas Diaz (6yo, 21kg) issued by Dr. Sarah Jenkins. Augmentin 400mg/5mL oral suspension, 5.5mL twice daily with meals for 10 days. Weight-adjusted dosage verified by clinical pharmacology bounds.',
    },
  },
];
