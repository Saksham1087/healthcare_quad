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
  DeviceFrame,
  MascotBadge,
  SubtitleOverlay,
  SubtitleCue,
} from '../components';

const ACT2_CUES: SubtitleCue[] = [
  {
    startFrame: 15,
    endFrame: 300,
    text: 'Meet MediScript: inspired by 19th-century botanical guides to unify fragmented health records.',
    speaker: 'NARRATOR',
  },
  {
    startFrame: 300,
    endFrame: 560,
    text: 'An editorial vintage sanctuary engineered for multi-generational Indian families with sovereign partitions.',
    speaker: 'NARRATOR',
  },
  {
    startFrame: 560,
    endFrame: 840,
    text: 'Isolated vaults for Rajesh, Sunita, and Aarav with zero cross-patient data bleed.',
    speaker: 'NARRATOR',
  },
];

export const Act2Herbarium: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Seed split entrance animation
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 100 },
  });

  const macbookRotateY = interpolate(frame, [0, 900], [-6, 6]);
  const macbookRotateX = interpolate(frame, [0, 900], [4, 1]);
  const macbookScale = interpolate(enterSpring, [0, 1], [0.85, 0.93]);

  // Night garden switch simulation at frame 420
  const isNightGarden = frame > 420;

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
      <Audio src={staticFile('audio/act2_herbarium.mp3')} volume={1} />

      {/* Background Decorative Rings */}
      <div
        style={{
          position: 'absolute',
          top: '46%',
          left: '50%',
          width: 1100,
          height: 1100,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '1px dashed rgba(63, 167, 150, 0.2)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Content Area */}
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
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                borderRadius: 20,
                backgroundColor: 'rgba(63, 167, 150, 0.18)',
                border: '1px solid rgba(63, 167, 150, 0.45)',
                color: BotanicalColors.bulbaTealLight,
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
                  backgroundColor: BotanicalColors.bulbaTeal,
                  boxShadow: '0 0 10px #3FA796',
                }}
              />
              Act II — Botanical Interface & Multi-Vaults
            </div>

            <h1
              style={{
                fontFamily: Typography.fontFamilySerif,
                fontSize: 44,
                fontWeight: 700,
                margin: 0,
                background: 'linear-gradient(135deg, #FAF6ED 0%, #F3EBD3 60%, #7BC96F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              The Editorial Vintage Sanctuary
            </h1>
          </div>

          {/* Mode Pill & Family Vault Badges */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                backgroundColor: isNightGarden ? 'rgba(7, 23, 18, 0.9)' : 'rgba(243, 235, 211, 0.92)',
                color: isNightGarden ? BotanicalColors.goldLeaf : '#1C4A3C',
                border: `1.5px solid ${isNightGarden ? BotanicalColors.borderGold : BotanicalColors.borderTeal}`,
                fontWeight: 700,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              <span>{isNightGarden ? '🌙 Night Garden' : '🌿 Aged Parchment'}</span>
            </div>

            <div
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                backgroundColor: 'rgba(22, 62, 50, 0.85)',
                border: `1px solid ${BotanicalColors.borderGold}`,
                color: BotanicalColors.textPrimary,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Vault: <strong style={{ color: BotanicalColors.goldLeaf }}>Rajesh Sharma (58M)</strong>
            </div>
          </div>
        </div>

        {/* Center: MacBook Device Frame - Elevated with translateY to leave bottom clear */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            marginTop: 10,
          }}
        >
          <DeviceFrame
            type="macbook"
            scale={macbookScale}
            rotateX={macbookRotateX}
            rotateY={macbookRotateY}
            translateY={-35}
            title="MediScript — Botanical Health Sanctuary (Family Vaults)"
          >
            {/* Inner Mockup UI */}
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: isNightGarden ? '#0B1C16' : '#F3EBD3',
                color: isNightGarden ? '#F3EBD3' : '#163E32',
                padding: 22,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {/* App Topbar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 10,
                  borderBottom: `1px solid ${isNightGarden ? 'rgba(201,162,75,0.3)' : 'rgba(22,62,50,0.2)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#3FA796',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: 14,
                    }}
                  >
                    🌿
                  </div>
                  <span style={{ fontFamily: Typography.fontFamilySerif, fontSize: 18, fontWeight: 700 }}>
                    MediScript Herbarium
                  </span>
                </div>

                {/* Patient Profile Tabs */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 14,
                      backgroundColor: '#3FA796',
                      color: '#FFF',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    ✓ Rajesh (Patriarch)
                  </span>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 14,
                      backgroundColor: 'rgba(63,167,150,0.15)',
                      color: isNightGarden ? '#A2D5C6' : '#1C4A3C',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Sunita Sharma (54F)
                  </span>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 14,
                      backgroundColor: 'rgba(63,167,150,0.15)',
                      color: isNightGarden ? '#A2D5C6' : '#1C4A3C',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Aarav Sharma (12M)
                  </span>
                </div>
              </div>

              {/* Patient Profile Card & Specimen Plates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 14, flex: 1 }}>
                <div
                  style={{
                    backgroundColor: isNightGarden ? 'rgba(22,62,50,0.6)' : '#FAF6ED',
                    borderRadius: 10,
                    padding: 14,
                    border: '1px solid rgba(201,162,75,0.3)',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#C9A24B', letterSpacing: '0.08em' }}>
                    SPECIMEN DOSSIER #4092
                  </div>
                  <h3 style={{ margin: '4px 0', fontSize: 16 }}>Rajesh Sharma</h3>
                  <div style={{ fontSize: 11, opacity: 0.85, lineHeight: 1.5 }}>
                    • Type 2 Diabetes Mellitus (HbA1c: 7.8%)<br />
                    • Stage-2 Essential Hypertension<br />
                    • Confirmed Penicillin Allergy (Anaphylaxis)
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: isNightGarden ? 'rgba(22,62,50,0.6)' : '#FAF6ED',
                    borderRadius: 10,
                    padding: 14,
                    border: '1px solid rgba(63,167,150,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#3FA796', letterSpacing: '0.08em' }}>
                    ACTIVE VAULT THERAPIES
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <div style={{ padding: '6px 10px', borderRadius: 8, backgroundColor: 'rgba(63,167,150,0.15)', fontSize: 11 }}>
                      💊 <strong>Metformin 500mg</strong> (BD Post-Cena)
                    </div>
                    <div style={{ padding: '6px 10px', borderRadius: 8, backgroundColor: 'rgba(63,167,150,0.15)', fontSize: 11 }}>
                      💊 <strong>Telmisartan 40mg</strong> (OD Mane)
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#C9A24B', marginTop: 8 }}>
                    ⚡ DPDP Sovereign Key: <code>0x7e8b...41a9</code> (AES-256 Partitioned)
                  </div>
                </div>
              </div>
            </div>
          </DeviceFrame>

          {/* Floating BulbaCare Mascot Badge - Positioned comfortably to the right */}
          <div
            style={{
              position: 'absolute',
              right: 25,
              bottom: 20,
              zIndex: 20,
            }}
          >
            <MascotBadge
              size={130}
              expression="happy"
              speechText="Welcome to your Vault!"
              withStethoscope={true}
              glow={true}
            />
          </div>
        </div>

        {/* Non-intrusive floating cinema subtitle pill */}
        <SubtitleOverlay cues={ACT2_CUES} />
      </div>
    </AbsoluteFill>
  );
};
