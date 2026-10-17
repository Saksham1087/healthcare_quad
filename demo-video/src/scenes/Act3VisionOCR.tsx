import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BotanicalColors,
  BotanicalGradients,
  Typography,
  SubtitleOverlay,
  SubtitleCue,
} from '../components';

const ACT3_CUES: SubtitleCue[] = [
  {
    startFrame: 15,
    endFrame: 280,
    text: 'Behind its artisanal surface lies deep multimodal vision intelligence.',
    speaker: 'NARRATOR',
  },
  {
    startFrame: 280,
    endFrame: 540,
    text: 'Spatial coordinate grounding parses cursive handwriting into FHIR-grade clinical entities.',
    speaker: 'NARRATOR',
  },
  {
    startFrame: 540,
    endFrame: 800,
    text: 'Instant bidirectional drug-drug interaction audits and penicillin allergy verification before ingestion.',
    speaker: 'NARRATOR',
  },
];

export const Act3VisionOCR: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scanning laser line animation
  const scanProgress = (frame % 150) / 150;
  const scanY = scanProgress * 420;

  // Bounding box reveal springs
  const box1Spring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12 } });
  const box2Spring = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 12 } });
  const box3Spring = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 12 } });

  // Safety alerts trigger at frame 150
  const alertSpring = spring({
    frame: Math.max(0, frame - 160),
    fps,
    config: { damping: 10, mass: 0.8, stiffness: 120 },
  });
  const alertScale = interpolate(alertSpring, [0, 1], [0.88, 1]);
  const alertOpacity = interpolate(alertSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: BotanicalGradients.heroBackground,
        fontFamily: Typography.fontFamilySans,
        color: BotanicalColors.textPrimary,
        overflow: 'hidden',
      }}
    >
      {/* Voiceover */}
      <Audio src={staticFile('audio/act3_ocr_safety.mp3')} volume={1} />

      {/* Main Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '36px 80px 75px',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                borderRadius: 20,
                backgroundColor: 'rgba(201, 162, 75, 0.18)',
                border: '1px solid rgba(201, 162, 75, 0.45)',
                color: BotanicalColors.goldLeafGlow,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: BotanicalColors.goldLeaf,
                  boxShadow: '0 0 10px #C9A24B',
                }}
              />
              Act III — Spatial Vision OCR & Clinical Safety
            </div>

            <h1
              style={{
                fontFamily: Typography.fontFamilySerif,
                fontSize: 44,
                fontWeight: 700,
                margin: 0,
                background: 'linear-gradient(135deg, #FAF6ED 0%, #F3EBD3 60%, #C9A24B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Multimodal Vision & Deterministic Guardrails
            </h1>
          </div>

          <div
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              backgroundColor: 'rgba(14, 42, 33, 0.85)',
              border: `1px solid ${BotanicalColors.borderTeal}`,
              color: BotanicalColors.bulbaTealLight,
              fontFamily: Typography.fontFamilyMono,
              fontSize: 12,
            }}
          >
            GEMINI VISION 1000×1000 GRID • FHIR R4 ENTITY
          </div>
        </div>

        {/* Center: Split Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 40,
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          {/* Left: Vintage Doctor Prescription Paper */}
          <div
            style={{
              backgroundColor: '#FAF6ED',
              borderRadius: 14,
              height: 430,
              padding: 20,
              boxSizing: 'border-box',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 0 40px rgba(196, 172, 120, 0.25)',
              border: '2px solid #E4D6B4',
              color: '#2A3630',
              overflow: 'hidden',
            }}
          >
            {/* Laser Scan Bar */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: scanY,
                height: 3,
                background: 'linear-gradient(90deg, transparent 0%, #3FA796 30%, #55C2B1 50%, #3FA796 70%, transparent 100%)',
                boxShadow: '0 0 15px #3FA796, 0 0 25px rgba(63,167,150,0.5)',
                zIndex: 25,
              }}
            />

            {/* Prescription Header */}
            <div style={{ borderBottom: '2px solid #3FA796', paddingBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: Typography.fontFamilySerif, fontSize: 17, color: '#0E2A21' }}>
                  DR. A. K. BANERJEE, MD (Cardiology)
                </h3>
                <div style={{ fontSize: 11, color: '#6A7E74' }}>
                  Apex Superspeciality Clinic, Mumbai • Reg #MH-20491
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3FA796' }}>
                PATIENT: Rajesh Sharma (58M)
              </div>
            </div>

            {/* Bounding Box 1 */}
            <div
              style={{
                marginTop: 16,
                padding: '6px 10px',
                border: '2px dashed #3FA796',
                borderRadius: 8,
                backgroundColor: 'rgba(63, 167, 150, 0.08)',
                opacity: box1Spring,
                transform: `scale(${interpolate(box1Spring, [0, 1], [0.95, 1])})`,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: -9,
                  right: 8,
                  backgroundColor: '#3FA796',
                  color: '#FFF',
                  fontSize: 9,
                  padding: '2px 5px',
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                99.4% CONFIDENCE [y:120, x:240]
              </span>
              <div style={{ fontFamily: 'cursive', fontSize: 16, color: '#1A332B' }}>
                Rx: Clinical Evaluation & Longitudinal Regimen
              </div>
            </div>

            {/* Bounding Box 2: Metformin */}
            <div
              style={{
                marginTop: 14,
                padding: '8px 12px',
                border: '2px solid #257064',
                borderRadius: 8,
                backgroundColor: 'rgba(37, 112, 100, 0.1)',
                opacity: box2Spring,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: -9,
                  right: 8,
                  backgroundColor: '#257064',
                  color: '#FFF',
                  fontSize: 9,
                  padding: '2px 5px',
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                GROUNDED: METFORMIN [500mg, BD]
              </span>
              <div style={{ fontFamily: 'cursive', fontSize: 18, color: '#163E32' }}>
                1. Tab Metformin 500 mg — 1 tab BD Post-Cena
              </div>
              <div style={{ fontSize: 10, color: '#3FA796', marginTop: 3, fontWeight: 600 }}>
                ✓ Mapped to RxNorm #6809 • Oral Antidiabetic Biguanide
              </div>
            </div>

            {/* Bounding Box 3: Amoxicillin */}
            <div
              style={{
                marginTop: 14,
                padding: '8px 12px',
                border: '2px solid #D9483B',
                borderRadius: 8,
                backgroundColor: 'rgba(217, 72, 59, 0.12)',
                opacity: box3Spring,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: -9,
                  right: 8,
                  backgroundColor: '#D9483B',
                  color: '#FFF',
                  fontSize: 9,
                  padding: '2px 5px',
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                HAZARD DETECTED: AMOXICILLIN
              </span>
              <div style={{ fontFamily: 'cursive', fontSize: 18, color: '#8A1B14' }}>
                2. Tab Amoxicillin 500 mg — 1 tab TDS × 5 days
              </div>
              <div style={{ fontSize: 10, color: '#D9483B', marginTop: 3, fontWeight: 700 }}>
                ⚠️ CROSS-REACTIVE PENICILLIN ANAPHYLAXIS RISK
              </div>
            </div>
          </div>

          {/* Right: Safety Alerts */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              opacity: alertOpacity,
              transform: `scale(${alertScale})`,
            }}
          >
            {/* Allergy Intercept */}
            <div
              style={{
                backgroundColor: 'rgba(217, 72, 59, 0.2)',
                border: '2px solid #D9483B',
                borderRadius: 14,
                padding: 18,
                boxShadow: '0 10px 25px rgba(217, 72, 59, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>🛑</span>
                <h4 style={{ margin: 0, fontSize: 16, color: BotanicalColors.coralLight, fontWeight: 800 }}>
                  CRITICAL ALLERGY INTERCEPT
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: BotanicalColors.textPrimary, lineHeight: 1.45 }}>
                Patient <strong>Rajesh Sharma</strong> has a confirmed allergy to <strong>Penicillin</strong>. Prescribed <strong>Amoxicillin</strong> shares beta-lactam cross-reactivity and is automatically blocked.
              </p>
            </div>

            {/* DDI Card */}
            <div
              style={{
                backgroundColor: 'rgba(201, 162, 75, 0.16)',
                border: '1.5px solid #C9A24B',
                borderRadius: 14,
                padding: 18,
                boxShadow: '0 10px 25px rgba(201, 162, 75, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <h4 style={{ margin: 0, fontSize: 16, color: BotanicalColors.goldLeafGlow, fontWeight: 800 }}>
                  BIDIRECTIONAL DDI SAFETY VERIFIED
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: BotanicalColors.textPrimary, lineHeight: 1.45 }}>
                Verified order-independent interaction matrix for <strong>Metformin</strong> vs <strong>Telmisartan</strong>. Renal function safeguards automatically injected into patient instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Non-intrusive floating cinema subtitle pill */}
        <SubtitleOverlay cues={ACT3_CUES} />
      </div>
    </AbsoluteFill>
  );
};
