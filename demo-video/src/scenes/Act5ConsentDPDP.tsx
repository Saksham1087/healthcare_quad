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

const ACT5_CUES: SubtitleCue[] = [
  {
    startFrame: 15,
    endFrame: 330,
    text: "Data sovereignty is non-negotiable: MediScript strictly enforces ABDM M1-M3 and India's DPDP Act 2023.",
    speaker: 'NARRATOR',
  },
  {
    startFrame: 330,
    endFrame: 680,
    text: 'Patients grant time-bounded PIN consent, while emergency Break-Glass unlocks care under immutable audit.',
    speaker: 'NARRATOR',
  },
  {
    startFrame: 680,
    endFrame: 1010,
    text: 'Under DPDP Section 12, the right to erasure executes true irreversible cryptographic key shredding.',
    speaker: 'NARRATOR',
  },
];

export const Act5ConsentDPDP: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isShreddingPhase = frame > 700;

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
      <Audio src={staticFile('audio/act5_consent_dpdp.mp3')} volume={1} />

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
              Act V — ABDM Milestones M1–M3 & DPDP Sovereignty
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
              Consent Studio & Cryptographic Shredding
            </h1>
          </div>

          <div
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              backgroundColor: 'rgba(14, 42, 33, 0.85)',
              border: `1px solid ${BotanicalColors.borderGold}`,
              color: BotanicalColors.goldLeaf,
              fontFamily: Typography.fontFamilyMono,
              fontSize: 12,
            }}
          >
            DPDP ACT 2023 SEC 12 • ABDM M1-M3 COMPLIANT
          </div>
        </div>

        {/* Center: 3 Pillar Panels - Elevated layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
            marginTop: 10,
          }}
        >
          {/* Card 1: Time-Bounded PIN Sharing */}
          <div
            style={{
              backgroundColor: 'rgba(22, 62, 50, 0.75)',
              border: `1.5px solid ${BotanicalColors.borderTeal}`,
              borderRadius: 18,
              padding: 22,
              boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 380,
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: BotanicalColors.bulbaTealLight, letterSpacing: '0.08em' }}>
                DOCTOR CURATED VIEW
              </div>
              <h3 style={{ margin: '6px 0 10px', fontSize: 19, color: BotanicalColors.textPrimary }}>
                Granular Time-Bounded PIN
              </h3>
              <p style={{ fontSize: 13, color: BotanicalColors.textSecondary, lineHeight: 1.45 }}>
                Doctors receive zero permanent access. Clinical shares auto-expire in 15 minutes, instantly locking sessions upon timeout.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(14, 42, 33, 0.9)',
                borderRadius: 12,
                padding: '14px',
                textAlign: 'center',
                border: '1px dashed rgba(63, 167, 150, 0.4)',
              }}
            >
              <div style={{ fontSize: 11, color: BotanicalColors.textMuted }}>ONE-TIME DOCTOR ACCESS PIN</div>
              <div
                style={{
                  fontFamily: Typography.fontFamilyMono,
                  fontSize: 30,
                  fontWeight: 800,
                  color: BotanicalColors.goldLeaf,
                  letterSpacing: '0.22em',
                  margin: '4px 0',
                }}
              >
                784 921
              </div>
              <div style={{ fontSize: 11, color: BotanicalColors.leafGreenLight }}>
                ⏱️ Valid for 14m 42s • Ephemeral Session
              </div>
            </div>
          </div>

          {/* Card 2: Emergency Break-Glass Protocol */}
          <div
            style={{
              backgroundColor: 'rgba(22, 62, 50, 0.75)',
              border: '1.5px solid rgba(217, 72, 59, 0.5)',
              borderRadius: 18,
              padding: 22,
              boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 380,
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: BotanicalColors.coralLight, letterSpacing: '0.08em' }}>
                EMERGENCY OVERRIDE
              </div>
              <h3 style={{ margin: '6px 0 10px', fontSize: 19, color: BotanicalColors.textPrimary }}>
                Break-Glass Protocol
              </h3>
              <p style={{ fontSize: 13, color: BotanicalColors.textSecondary, lineHeight: 1.45 }}>
                In critical trauma conditions, credentialed ER physicians bypass standard PIN prompts. Automatically logged with immutable cryptographic proof.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(217, 72, 59, 0.15)',
                borderRadius: 12,
                padding: '12px',
                border: '1px solid rgba(217, 72, 59, 0.4)',
              }}
            >
              <div style={{ fontSize: 11, color: '#E86B60', fontWeight: 700 }}>
                🚨 IMMUTABLE AUDIT LOG ENTRY
              </div>
              <div style={{ fontFamily: Typography.fontFamilyMono, fontSize: 11, color: BotanicalColors.textPrimary, marginTop: 4 }}>
                ACTOR: Dr. S. Rao (Apollo ER)<br />
                REASON: Acute Coronary Syndrome<br />
                HASH: sha256:d8a9...b104
              </div>
            </div>
          </div>

          {/* Card 3: DPDP Cryptographic Shredding */}
          <div
            style={{
              backgroundColor: isShreddingPhase ? 'rgba(30, 20, 15, 0.85)' : 'rgba(22, 62, 50, 0.75)',
              border: `1.5px solid ${isShreddingPhase ? BotanicalColors.coral : BotanicalColors.borderGold}`,
              borderRadius: 18,
              padding: 22,
              boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 380,
              transition: 'all 0.3s ease',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: BotanicalColors.goldLeaf, letterSpacing: '0.08em' }}>
                DPDP SECTION 12
              </div>
              <h3 style={{ margin: '6px 0 10px', fontSize: 19, color: BotanicalColors.textPrimary }}>
                Right to Erasure & Shredding
              </h3>
              <p style={{ fontSize: 13, color: BotanicalColors.textSecondary, lineHeight: 1.45 }}>
                Patients maintain absolute sovereign ownership. Initiating erasure permanently shreds AES-256 keys, rendering copies mathematical noise.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(14, 42, 33, 0.95)',
                borderRadius: 12,
                padding: '12px',
                border: '1px solid rgba(201, 162, 75, 0.4)',
              }}
            >
              <div style={{ fontSize: 11, color: BotanicalColors.goldLeaf, fontWeight: 700 }}>
                {isShreddingPhase ? '🔥 CRYPTOGRAPHIC SHREDDING ACTIVE' : '🔒 SOVEREIGN KEY STATUS'}
              </div>
              <div style={{ fontFamily: Typography.fontFamilyMono, fontSize: 11, color: isShreddingPhase ? '#E86B60' : BotanicalColors.leafGreenLight, marginTop: 4 }}>
                {isShreddingPhase
                  ? 'KEY: [PURGED & ZEROED OUT]\nSTATUS: IRREVERSIBLE PURGE COMPLETE'
                  : 'KEY: 0x7e8b91a... (256-bit GCM)\nINTEGRITY: DPDP VALIDATED'}
              </div>
            </div>
          </div>
        </div>

        {/* Non-intrusive floating cinema subtitle pill */}
        <SubtitleOverlay cues={ACT5_CUES} />
      </div>
    </AbsoluteFill>
  );
};
