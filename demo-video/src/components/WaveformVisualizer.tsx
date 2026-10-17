import React from 'react';
import { useCurrentFrame } from 'remotion';
import { BotanicalColors } from './BotanicalTheme';

export interface WaveformVisualizerProps {
  barCount?: number;
  active?: boolean;
  height?: number;
  barWidth?: number;
  gap?: number;
  sensitivity?: number;
  variant?: 'teal' | 'gold' | 'coral' | 'leaf';
  glow?: boolean;
  style?: React.CSSProperties;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  barCount = 36,
  active = true,
  height = 56,
  barWidth = 4,
  gap = 4,
  sensitivity = 1.0,
  variant = 'teal',
  glow = true,
  style,
}) => {
  const frame = useCurrentFrame();

  const colorMap = {
    teal: {
      primary: BotanicalColors.bulbaTeal,
      secondary: BotanicalColors.bulbaTealLight,
      glow: 'rgba(63, 167, 150, 0.45)',
    },
    gold: {
      primary: BotanicalColors.goldLeaf,
      secondary: BotanicalColors.goldLeafGlow,
      glow: 'rgba(201, 162, 75, 0.45)',
    },
    coral: {
      primary: BotanicalColors.coral,
      secondary: BotanicalColors.coralLight,
      glow: 'rgba(217, 72, 59, 0.45)',
    },
    leaf: {
      primary: BotanicalColors.leafGreen,
      secondary: BotanicalColors.leafGreenLight,
      glow: 'rgba(123, 201, 111, 0.45)',
    },
  }[variant];

  const centerIndex = barCount / 2;
  const time = frame / 30;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: height + 10,
        gap,
        padding: '0 8px',
        ...style,
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        // Distance from center normalized (-1 to 1)
        const distFromCenter = (i - centerIndex) / centerIndex;
        // Gaussian bell curve envelope to create professional audio EQ shape
        const bell = Math.exp(-distFromCenter * distFromCenter * 2.2);

        // Multiple harmonic frequencies
        const h1 = Math.sin(time * 6.5 + i * 0.45);
        const h2 = Math.cos(time * 10.2 - i * 0.32);
        const h3 = Math.sin(time * 15.8 + i * 0.75);
        const pulse = Math.abs(h1 * 0.45 + h2 * 0.35 + h3 * 0.2);

        const currentBarHeight = active
          ? Math.max(6, pulse * height * bell * sensitivity + 4)
          : 4;

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: currentBarHeight,
              borderRadius: barWidth / 2,
              background: `linear-gradient(180deg, ${colorMap.secondary} 0%, ${colorMap.primary} 100%)`,
              boxShadow:
                glow && active
                  ? `0 0 10px ${colorMap.glow}, 0 0 2px ${colorMap.secondary}`
                  : 'none',
              transition: 'height 0.05s ease-out',
            }}
          />
        );
      })}
    </div>
  );
};
