import React from 'react';
import { Composition } from 'remotion';
import { MainDemoVideo } from './MainDemoVideo';
import { ShowcasePreview } from './ShowcasePreview';

export const RemotionRoot: React.FC = () => {
  const FPS = 30;
  // Total 6 Acts Duration: 1050 + 900 + 900 + 1700 + 1100 + 650 = 6,300 frames (210s / 3:30)
  const TOTAL_DURATION_FRAMES = 6300;

  return (
    <>
      {/* Primary 3-Minute+ Hackathon Demo Launch Video */}
      <Composition
        id="MediScriptDemo"
        component={MainDemoVideo}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Quick Component Showcase (10s) */}
      <Composition
        id="ComponentShowcase"
        component={ShowcasePreview}
        durationInFrames={300}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
