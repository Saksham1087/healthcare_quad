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
  StatCalloutCard,
  SubtitleOverlay,
  SubtitleCue,
} from '../components';

const ACT1_CUES: SubtitleCue[] = [
  {
    startFrame: 15,
    endFrame: 320,
    text: 'Millions of patients across India walk into clinics clutching frayed paper prescriptions and lost histories.',
    speaker: 'NARRATOR',
  },
  {
    startFrame: 320,
    endFrame: 640,
    text: 'Doctors make therapeutic decisions in the dark—blind to past allergic reactions and cursive scripts.',
    speaker: 'NARRATOR',
  },
  {
    startFrame: 640,
    endFrame: 960,
    text: 'Vulnerable to preventable drug interactions, the longitudinal patient journey is fundamentally broken.',
    speaker: 'NARRATOR',
  },
];

export const Act1Crisis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for the header
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);
  const headerY = interpolate(headerSpring, [0, 1], [-30, 0]);

  // Subtle background zoom
  const bgScale = interpolate(frame, [0, 1050], [1, 1.06]);

  return (
    <AbsoluteFill
      style={{
        background: BotanicalGradients.heroBackground,
        fontFamily: Typography.fontFamilySans,
        color: BotanicalColors.textPrimary,
        overflow: 'hidden',
      }}
    >
      {/* Background Animated Gradient & Distress Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 25%, rgba(217, 72, 59, 0.12) 0%, transparent 60%)',
          transform: `scale(${bgScale})`,
          pointerEvents: 'none',
        }}
      />

      {/* Decorative Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(201, 162, 75, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(201, 162, 75, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          opacity: 0.7,
        }}
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile('audio/act1_crisis.mp3')} volume={1} />

      {/* Main Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '45px 80px 75px',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: 20,
        }}
      >
        {/* Top Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
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
                backgroundColor: 'rgba(217, 72, 59, 0.18)',
                border: '1px solid rgba(217, 72, 59, 0.45)',
                color: BotanicalColors.coralLight,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: BotanicalColors.coral,
                  boxShadow: '0 0 10px #D9483B',
                }}
              />
              Act I — Clinical Discontinuity
            </div>

            <h1
              style={{
                fontFamily: Typography.fontFamilySerif,
                fontSize: 50,
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.15,
                background: 'linear-gradient(135deg, #FAF6ED 0%, #F3EBD3 60%, #C9A24B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              The Crisis of Fragmented Healthcare
            </h1>
            <p
              style={{
                margin: '10px 0 0',
                fontSize: 20,
                color: BotanicalColors.textSecondary,
                maxWidth: 860,
                lineHeight: 1.4,
              }}
            >
              Millions of outpatient consultations in India operate in total diagnostic darkness—fraught with illegible cursive prescriptions and severed clinical continuity.
            </p>
          </div>

          <div
            style={{
              textAlign: 'right',
              fontFamily: Typography.fontFamilyMono,
              fontSize: 13,
              color: BotanicalColors.goldLeaf,
              letterSpacing: '0.08em',
              padding: '8px 16px',
              borderRadius: 12,
              border: `1px solid ${BotanicalColors.borderGold}`,
              backgroundColor: 'rgba(14, 42, 33, 0.75)',
            }}
          >
            NATIONAL HEALTH AUDIT
            <div style={{ color: BotanicalColors.textMuted, fontSize: 11, marginTop: 3 }}>
              OPD RETENTION ANALYSIS
            </div>
          </div>
        </div>

        {/* Center: 3D Stat Callout Cards Grid - Elevated for high visibility */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 36,
            marginTop: 20,
          }}
        >
          <StatCalloutCard
            metric="70%"
            label="Historical Dependency"
            description="Of all outpatient diagnostic decisions rely critically on past prescription records."
            badgeText="DIAGNOSTIC ACCURACY"
            variant="coral"
            tiltX={6}
            tiltY={-8}
            delay={20}
          />

          <StatCalloutCard
            metric="68%"
            label="Longitudinal Record Loss"
            description="Of chronic disease patients lose historical treatment data within 18 months of care."
            badgeText="CONTINUITY BREACH"
            variant="coral"
            tiltX={-4}
            tiltY={-4}
            delay={45}
          />

          <StatCalloutCard
            metric="#1"
            label="Preventable Hazard"
            description="Undetected drug-drug interactions and penicillin cross-reactivity in uncoordinated OPDs."
            badgeText="CLINICAL RISK"
            variant="gold"
            tiltX={-8}
            tiltY={6}
            delay={70}
          />
        </div>

        {/* Non-intrusive floating cinema subtitle pill */}
        <SubtitleOverlay cues={ACT1_CUES} />
      </div>
    </AbsoluteFill>
  );
};
