import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  Act1Crisis,
  Act2Herbarium,
  Act3VisionOCR,
  Act4BulbaVoice,
  Act5ConsentDPDP,
  Act6Outro,
} from './scenes';

export const MainDemoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Background music volume automation with smooth fade-in and outro swell
  // Baseline ducked volume is 0.18, swelling to 0.35 at the end
  const bgVolume = interpolate(
    frame,
    [0, 60, 5800, 6200, 6300],
    [0.05, 0.18, 0.22, 0.35, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#071712' }}>
      {/* Background Ambient Acoustic Bed */}
      <Audio src={staticFile('audio/bg_music.mp3')} volume={bgVolume} />

      {/* Sequential Series of Acts */}
      <Series>
        {/* Act 1: The Crisis (35s / 1050 frames) */}
        <Series.Sequence durationInFrames={1050}>
          <Act1Crisis />
        </Series.Sequence>

        {/* Act 2: The Herbarium Sanctuary & Multi-Vaults (30s / 900 frames) */}
        <Series.Sequence durationInFrames={900}>
          <Act2Herbarium />
        </Series.Sequence>

        {/* Act 3: Spatial Vision OCR & Clinical Safety (30s / 900 frames) */}
        <Series.Sequence durationInFrames={900}>
          <Act3VisionOCR />
        </Series.Sequence>

        {/* Act 4: BulbaCare Live Trilingual Voice-to-Voice AI (56.7s / 1700 frames) */}
        <Series.Sequence durationInFrames={1700}>
          <Act4BulbaVoice />
        </Series.Sequence>

        {/* Act 5: Consent Studio, ABDM M1-M3 & DPDP Shredding (36.7s / 1100 frames) */}
        <Series.Sequence durationInFrames={1100}>
          <Act5ConsentDPDP />
        </Series.Sequence>

        {/* Act 6: Grand Outro & Hackathon Showcase (21.7s / 650 frames) */}
        <Series.Sequence durationInFrames={650}>
          <Act6Outro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
