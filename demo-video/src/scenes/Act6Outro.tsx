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
  MascotBadge,
  SubtitleOverlay,
  SubtitleCue,
} from '../components';

const ACT6_CUES: SubtitleCue[] = [
  {
    startFrame: 15,
    endFrame: 260,
    text: 'Bridging traditional clinical practice with state-of-the-art sovereign AI.',
    speaker: 'NARRATOR',
  },
  {
    startFrame: 260,
    endFrame: 540,
    text: 'MediScript restores continuity, dignity, and safety to every prescription. Built for India, ready for the world.',
    speaker: 'NARRATOR',
  },
];

export const Act6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  const scale = interpolate(enterSpring, [0, 1], [0.88, 1]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

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
      <Audio src={staticFile('audio/act6_outro.mp3')} volume={1} />

      {/* Decorative Radial Blooms */}
      <div
        style={{
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(63, 167, 150, 0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

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
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Outro Brand Title Card */}
        <div
          style={{
            opacity,
            transform: `scale(${scale}) translateY(-10px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 15,
          }}
        >
          <MascotBadge
            size={160}
            expression="celebrating"
            withStethoscope={true}
            glow={true}
            speechText="Built for India, Ready for the World! 🌿"
          />

          <h1
            style={{
              fontFamily: Typography.fontFamilySerif,
              fontSize: 56,
              fontWeight: 800,
              margin: '14px 0 8px',
              background: 'linear-gradient(135deg, #FAF6ED 0%, #F3EBD3 40%, #C9A24B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            MediScript 🌿
          </h1>

          <p
            style={{
              fontSize: 22,
              color: BotanicalColors.textSecondary,
              maxWidth: 780,
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Longitudinal Healthcare Continuity Platform & Trilingual Voice Health Companion
          </p>

          {/* Hackathon Features Badges */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 22,
            }}
          >
            <div
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                backgroundColor: 'rgba(22, 62, 50, 0.85)',
                border: `1.5px solid ${BotanicalColors.borderTeal}`,
                color: BotanicalColors.bulbaTealLight,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              🌿 Vintage Botanical Aesthetic
            </div>

            <div
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                backgroundColor: 'rgba(22, 62, 50, 0.85)',
                border: `1.5px solid ${BotanicalColors.borderGold}`,
                color: BotanicalColors.goldLeafGlow,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              🎙️ Trilingual Spoken AI (EN, हिन्दी, मराठी)
            </div>

            <div
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                backgroundColor: 'rgba(22, 62, 50, 0.85)',
                border: '1.5px solid rgba(123, 201, 111, 0.5)',
                color: BotanicalColors.leafGreenLight,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              🛡️ ABDM M1–M3 & DPDP Key Shredding
            </div>
          </div>

          {/* GitHub Repo Callout */}
          <div
            style={{
              marginTop: 22,
              fontFamily: Typography.fontFamilyMono,
              fontSize: 15,
              color: BotanicalColors.goldLeaf,
              padding: '8px 20px',
              borderRadius: 14,
              backgroundColor: 'rgba(14, 42, 33, 0.9)',
              border: '1px solid rgba(201, 162, 75, 0.4)',
            }}
          >
            📦 github.com/Saksham1087/healthcare_quad
          </div>
        </div>

        {/* Non-intrusive floating cinema subtitle pill */}
        <SubtitleOverlay cues={ACT6_CUES} />
      </div>
    </AbsoluteFill>
  );
};
