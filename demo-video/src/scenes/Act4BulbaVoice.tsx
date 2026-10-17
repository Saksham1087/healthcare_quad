import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  BotanicalColors,
  BotanicalGradients,
  Typography,
  DeviceFrame,
  WaveformVisualizer,
  MascotBadge,
  SubtitleOverlay,
  SubtitleCue,
} from '../components';

const ACT4_CUES: SubtitleCue[] = [
  {
    startFrame: 15,
    endFrame: 690,
    text: "Healthcare is personal, and in India, conversational voice in one's native language is paramount.",
    speaker: 'NARRATOR',
    badge: 'TRILINGUAL COMPANION',
  },
  {
    startFrame: 699,
    endFrame: 890,
    text: 'बल्बाकेयर, क्या मैं अपनी ब्लड प्रेशर की दवा खाने के तुरंत बाद ले सकता हूँ?',
    speaker: 'RAJESH (PATIENT)',
    badge: 'VOICE IN • हिन्दी',
  },
  {
    startFrame: 903,
    endFrame: 1160,
    text: 'हाँ राजेश जी, आपकी टेलमिसार्टन 40 मिलीग्राम भोजन के तुरंत बाद लेना बिल्कुल सुरक्षित है।',
    speaker: 'BULBACARE AI',
    badge: 'VAULT GROUNDED • हिन्दी',
  },
  {
    startFrame: 1182,
    endFrame: 1350,
    text: 'आणि मला डोकेदुखीसाठी काही वेगळं औषध घ्यावं लागेल का?',
    speaker: 'RAJESH (PATIENT)',
    badge: 'VOICE IN • मराठी',
  },
  {
    startFrame: 1363,
    endFrame: 1640,
    text: 'कृपया डॉक्टरांच्या सल्ल्याशिवाय आयबुप्रोफेन घेऊ नका, कारण ते तुमच्या बीपीच्या गोळ्यांवर परिणाम करू शकते।',
    speaker: 'BULBACARE AI',
    badge: 'SAFETY ALERT • मराठी',
  },
];

export const Act4BulbaVoice: React.FC = () => {
  const frame = useCurrentFrame();

  const isPatientSpeaking = (frame >= 699 && frame < 903) || (frame >= 1182 && frame < 1363);
  const isBulbaSpeaking = (frame >= 903 && frame < 1182) || frame >= 1363;

  let activeLanguage = 'English';
  if (frame >= 699 && frame < 1182) {
    activeLanguage = 'हिन्दी (Hindi)';
  } else if (frame >= 1182) {
    activeLanguage = 'मराठी (Marathi)';
  }

  return (
    <AbsoluteFill
      style={{
        background: BotanicalGradients.heroBackground,
        fontFamily: Typography.fontFamilySans,
        color: BotanicalColors.textPrimary,
        overflow: 'hidden',
      }}
    >
      {/* Audio Sequences for Dialogue Cues */}
      <Sequence from={15}>
        <Audio src={staticFile('audio/act4_voice_intro.mp3')} volume={1} />
      </Sequence>
      <Sequence from={699}>
        <Audio src={staticFile('audio/act4_patient_hindi.mp3')} volume={1} />
      </Sequence>
      <Sequence from={903}>
        <Audio src={staticFile('audio/act4_bulba_hindi.mp3')} volume={1} />
      </Sequence>
      <Sequence from={1182}>
        <Audio src={staticFile('audio/act4_patient_marathi.mp3')} volume={1} />
      </Sequence>
      <Sequence from={1363}>
        <Audio src={staticFile('audio/act4_bulba_marathi.mp3')} volume={1} />
      </Sequence>

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
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
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
                  backgroundColor: BotanicalColors.leafGreen,
                  boxShadow: '0 0 10px #7BC96F',
                }}
              />
              Act IV — Live Trilingual Voice-to-Voice AI
            </div>

            <h1
              style={{
                fontFamily: Typography.fontFamilySerif,
                fontSize: 44,
                fontWeight: 700,
                margin: 0,
                background: 'linear-gradient(135deg, #FAF6ED 0%, #7BC96F 60%, #3FA796 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              BulbaCare: The Voice Health Companion
            </h1>
          </div>

          {/* Active Language & Barge-In Indicator */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                backgroundColor: 'rgba(22, 62, 50, 0.85)',
                border: `1.5px solid ${BotanicalColors.borderTeal}`,
                color: BotanicalColors.bulbaTealLight,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              🌐 Language: <span style={{ color: BotanicalColors.goldLeaf }}>{activeLanguage}</span>
            </div>

            <div
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                backgroundColor: 'rgba(14, 42, 33, 0.85)',
                border: `1.5px solid ${BotanicalColors.borderGold}`,
                color: BotanicalColors.goldLeafGlow,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              ⚡ Instant Barge-In Active
            </div>
          </div>
        </div>

        {/* Center: Split View (Patient Mobile on Left, BulbaCare Companion on Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr',
            gap: 40,
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          {/* Left: Patient Mobile App with Live Soundwave */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DeviceFrame
              type="iphone"
              scale={0.54}
              rotateY={6}
              rotateX={2}
              translateY={-20}
              title="BulbaCare Mobile"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0E2A21',
                  color: '#F3EBD3',
                  padding: 22,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {/* Mobile Top Header */}
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: '#C9A24B', fontWeight: 700 }}>
                    VAULT: RAJESH SHARMA
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>
                    Voice Companion
                  </div>
                </div>

                {/* Patient Speaking Waveform Circle */}
                <div
                  style={{
                    width: 170,
                    height: 170,
                    borderRadius: '50%',
                    backgroundColor: isPatientSpeaking ? 'rgba(217, 72, 59, 0.2)' : 'rgba(63, 167, 150, 0.15)',
                    border: `2px solid ${isPatientSpeaking ? '#D9483B' : '#3FA796'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isPatientSpeaking ? '0 0 30px rgba(217, 72, 59, 0.4)' : 'none',
                  }}
                >
                  <WaveformVisualizer
                    active={isPatientSpeaking}
                    barCount={18}
                    height={38}
                    variant={isPatientSpeaking ? 'coral' : 'teal'}
                  />
                </div>

                {/* Mobile Status Tag */}
                <div
                  style={{
                    padding: '6px 16px',
                    borderRadius: 20,
                    backgroundColor: 'rgba(22, 62, 50, 0.8)',
                    fontSize: 11,
                    color: isPatientSpeaking ? '#E86B60' : '#8EAA9E',
                    fontWeight: 600,
                  }}
                >
                  {isPatientSpeaking ? '🎙️ Listening to Patient...' : '🟢 Ready for Voice Input'}
                </div>
              </div>
            </DeviceFrame>
          </div>

          {/* Right: BulbaCare AI Mascot & Clinical Grounding Panel */}
          <div
            style={{
              backgroundColor: 'rgba(22, 62, 50, 0.75)',
              borderRadius: 20,
              border: `1.5px solid ${isBulbaSpeaking ? BotanicalColors.leafGreen : BotanicalColors.borderTeal}`,
              padding: 26,
              boxShadow: isBulbaSpeaking ? '0 0 40px rgba(123, 201, 111, 0.35)' : '0 20px 50px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transform: 'translateY(-15px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <MascotBadge
                size={125}
                expression={isBulbaSpeaking ? 'speaking' : 'happy'}
                withStethoscope={true}
                glow={isBulbaSpeaking}
                speechText={isBulbaSpeaking ? 'Speaking...' : undefined}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: BotanicalColors.goldLeaf }}>
                  AI CLINICAL GUARDIAN
                </div>
                <h3 style={{ margin: '4px 0 6px', fontSize: 22, color: BotanicalColors.textPrimary }}>
                  BulbaCare Trilingual Core
                </h3>
                <div style={{ fontSize: 12, color: BotanicalColors.textSecondary, lineHeight: 1.45 }}>
                  Synthesized direct audio output. Zero markdown formatting. Pure auditory clinical clarity grounded in verified patient prescriptions.
                </div>
              </div>
            </div>

            {/* BulbaCare Spoken Frequency Visualizer */}
            <div
              style={{
                backgroundColor: 'rgba(14, 42, 33, 0.9)',
                borderRadius: 12,
                padding: '14px 18px',
                border: '1px solid rgba(63, 167, 150, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, fontWeight: 700, color: BotanicalColors.leafGreenLight }}>
                <span>AUDITORY SPECTRUM FREQUENCY</span>
                <span>{isBulbaSpeaking ? '24kHz NEURAL AUDIO STREAM' : 'STANDBY'}</span>
              </div>
              <WaveformVisualizer
                active={isBulbaSpeaking}
                barCount={44}
                height={48}
                variant="leaf"
              />
            </div>
          </div>
        </div>

        {/* Non-intrusive floating cinema subtitle pill */}
        <SubtitleOverlay cues={ACT4_CUES} />
      </div>
    </AbsoluteFill>
  );
};
