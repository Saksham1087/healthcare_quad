import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import {
  BotanicalColors,
  BotanicalGradients,
  Typography,
  DeviceFrame,
  WaveformVisualizer,
  SubtitleOverlay,
  StatCalloutCard,
  MascotBadge,
} from './components';

export const ShowcasePreview: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: BotanicalGradients.heroBackground,
        fontFamily: Typography.fontFamilySans,
        color: BotanicalColors.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 50,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Radial Glows */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(63, 167, 150, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 162, 75, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 24,
              border: `1px solid ${BotanicalColors.borderGold}`,
              backgroundColor: 'rgba(14, 42, 33, 0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontFamily: Typography.fontFamilySerif,
              letterSpacing: '1px',
              color: BotanicalColors.goldLeafGlow,
            }}
          >
            <span>🌿</span>
            <span>MEDISCRIPT CLINICAL ARCHITECTURE</span>
          </div>

          <span
            style={{
              fontSize: 13,
              color: BotanicalColors.textMuted,
              fontFamily: Typography.fontFamilyMono,
            }}
          >
            1920×1080 @ 30 FPS • Remotion Engine
          </span>
        </div>

        {/* Audio Waveform in Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'rgba(7, 23, 18, 0.6)',
            padding: '4px 16px',
            borderRadius: 30,
            border: `1px solid ${BotanicalColors.borderTeal}`,
          }}
        >
          <span style={{ fontSize: 11, color: BotanicalColors.bulbaTealLight, fontWeight: 700, letterSpacing: '1px' }}>
            AUDIO ACTIVE
          </span>
          <WaveformVisualizer barCount={18} height={24} barWidth={3} gap={3} variant="teal" />
        </div>
      </div>

      {/* Main Center Stage: Devices and Cards Grid */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 60,
          zIndex: 20,
          marginTop: -30,
        }}
      >
        {/* Left Side: Stat Callout & Mascot */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 30,
            alignItems: 'center',
          }}
        >
          <StatCalloutCard
            metric="2.4 Hours"
            label="Daily Documentation Burnout"
            description="Reclaimed per physician per shift with zero transcription fatigue."
            trend="84% Efficiency Gain"
            trendPositive={true}
            badgeText="ACT 1 REVELATION"
            variant="gold"
            tiltX={10}
            tiltY={-8}
            scale={0.92}
          />

          <MascotBadge
            size={130}
            expression="happy"
            withStethoscope={true}
            speechText="BulbaCare AI Ready! 🌱"
          />
        </div>

        {/* Center: 3D Perspective MacBook Frame */}
        <div>
          <DeviceFrame
            type="macbook"
            scale={0.72}
            rotateX={6}
            rotateY={-5}
            title="mediscript.care — Ambient Clinical Intelligence"
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #0A1C16 0%, #163E32 100%)',
                display: 'flex',
                flexDirection: 'column',
                padding: 24,
                boxSizing: 'border-box',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: Typography.fontFamilySerif,
                      color: BotanicalColors.agedParchment,
                      fontSize: 18,
                    }}
                  >
                    Patient Encounter: Eleanor Vance (68F)
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: BotanicalColors.textMuted }}>
                    Room 4B • Chief Complaint: Atrial Fibrillation Follow-up
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: 'rgba(63, 167, 150, 0.2)',
                    border: `1px solid ${BotanicalColors.bulbaTeal}`,
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: 11,
                    color: BotanicalColors.bulbaTealLight,
                    fontWeight: 700,
                  }}
                >
                  LIVE AMBIENT STREAM
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: 16,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(7, 23, 18, 0.6)',
                    borderRadius: 12,
                    padding: 14,
                    border: '1px solid rgba(63, 167, 150, 0.2)',
                  }}
                >
                  <div style={{ fontSize: 11, color: BotanicalColors.goldLeaf, fontWeight: 700, marginBottom: 8 }}>
                    EXTRACTED SOAP NOTE DRAFT
                  </div>
                  <div style={{ fontSize: 11, color: BotanicalColors.textSecondary, lineHeight: 1.5 }}>
                    <strong>Subjective:</strong> Patient reports mild palpitations in the evening, denies dyspnea or chest pain.<br />
                    <strong>Objective:</strong> BP 128/82, HR 74 irregular rhythm. ECG confirms rate-controlled Afib.<br />
                    <strong>Assessment:</strong> Stable persistent atrial fibrillation on Apixaban 5mg BID.
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(7, 23, 18, 0.6)',
                    borderRadius: 12,
                    padding: 14,
                    border: '1px solid rgba(201, 162, 75, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: BotanicalColors.bulbaTealLight, fontWeight: 700, marginBottom: 8 }}>
                      FHIR R4 INTEGRATION
                    </div>
                    <div style={{ fontSize: 10, fontFamily: Typography.fontFamilyMono, color: BotanicalColors.leafGreenLight }}>
                      {`{\n  "resourceType": "MedicationRequest",\n  "status": "active",\n  "intent": "order",\n  "confidence": 0.998\n}`}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(63, 167, 150, 0.15)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ fontSize: 10, color: BotanicalColors.agedParchment }}>Gemini 2.5 Flash Verified</span>
                    <span style={{ fontSize: 12 }}>🛡️</span>
                  </div>
                </div>
              </div>
            </div>
          </DeviceFrame>
        </div>

        {/* Right Side: iPhone Mobile Companion */}
        <div>
          <DeviceFrame
            type="iphone"
            scale={0.62}
            rotateX={4}
            rotateY={8}
            rotateZ={-2}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, #0A1C16 0%, #112F25 100%)',
                padding: '60px 18px 24px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: BotanicalColors.goldLeaf, fontWeight: 700, letterSpacing: '1px' }}>
                  BULBACARE POCKET
                </div>
                <h4 style={{ margin: '6px 0 12px', fontSize: 18, color: BotanicalColors.agedParchment, fontFamily: Typography.fontFamilySerif }}>
                  Audio Consult
                </h4>
                <div
                  style={{
                    backgroundColor: 'rgba(22, 62, 50, 0.8)',
                    borderRadius: 14,
                    padding: 12,
                    border: '1px solid rgba(63, 167, 150, 0.3)',
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontSize: 10, color: BotanicalColors.textMuted, marginBottom: 4 }}>RECORDING STATUS</div>
                  <div style={{ fontSize: 13, color: BotanicalColors.leafGreenLight, fontWeight: 600 }}>00:03:42 • 44.1kHz Hi-Fi</div>
                  <div style={{ marginTop: 8 }}>
                    <WaveformVisualizer barCount={20} height={28} barWidth={2.5} gap={2.5} variant="leaf" />
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(201, 162, 75, 0.15)',
                  border: `1px solid ${BotanicalColors.goldLeaf}`,
                  borderRadius: 12,
                  padding: 10,
                  textAlign: 'center',
                  fontSize: 12,
                  color: BotanicalColors.goldLeafGlow,
                  fontWeight: 600,
                }}
              >
                Instant EHR Sync Active ⚡
              </div>
            </div>
          </DeviceFrame>
        </div>
      </div>

      {/* Bottom Subtitle Overlay Demo */}
      <SubtitleOverlay
        badge="ACT 1 : THE BURNOUT CRISIS"
        speaker="Dr. Julian Vance, MD"
        text="Doctors spend over two hours in electronic medical records for every single hour of patient care."
        highlightWordIndex={Math.floor((frame / 18) % 15)}
        variant="darkBotanical"
      />
    </AbsoluteFill>
  );
};
