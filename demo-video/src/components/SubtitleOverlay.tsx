import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { BotanicalColors, Typography } from './BotanicalTheme';

export interface SubtitleCue {
  text: string;
  startFrame: number;
  endFrame: number;
  speaker?: string;
  badge?: string;
}

export interface SubtitleOverlayProps {
  text?: string;
  speaker?: string;
  badge?: string;
  cues?: SubtitleCue[];
  variant?: 'darkBotanical' | 'vintageParchment';
  startFrame?: number;
  highlightWordIndex?: number;
  style?: React.CSSProperties;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  text,
  speaker,
  badge = 'CLINICAL NARRATIVE',
  cues,
  variant = 'darkBotanical',
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If cues are provided, determine the active cue
  let displayText = text || '';
  let displaySpeaker = speaker;
  let displayBadge = badge;

  if (cues && cues.length > 0) {
    const activeCue = cues.find((c) => frame >= c.startFrame && frame <= c.endFrame);
    if (activeCue) {
      displayText = activeCue.text;
      displaySpeaker = activeCue.speaker || displaySpeaker;
      displayBadge = activeCue.badge || displayBadge;
    } else {
      // If outside cue ranges, find closest or return null if far
      const firstCue = cues[0];
      const lastCue = cues[cues.length - 1];
      if (frame < firstCue.startFrame) {
        return null;
      }
      if (frame > lastCue.endFrame + 30) {
        return null;
      }
      displayText = lastCue.text;
    }
  }

  if (!displayText) {
    return null;
  }

  // Smooth entrance / transition
  const relFrame = Math.max(0, frame - startFrame);
  const enterSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 140 },
  });

  const translateY = interpolate(enterSpring, [0, 1], [15, 0]);
  const opacity = interpolate(enterSpring, [0, 0.4, 1], [0, 0.95, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        zIndex: 60,
        maxWidth: 1040,
        width: 'auto',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          background: 'rgba(7, 23, 18, 0.72)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(201, 162, 75, 0.35)',
          borderRadius: 24,
          padding: '8px 24px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(63, 167, 150, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {/* Compact Speaker / Badge Pill */}
        {(displaySpeaker || displayBadge) && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              borderRadius: 12,
              backgroundColor: 'rgba(63, 167, 150, 0.22)',
              border: '1px solid rgba(63, 167, 150, 0.45)',
              color: BotanicalColors.bulbaTealLight,
              fontSize: 11,
              fontFamily: Typography.fontFamilyMono,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: BotanicalColors.goldLeaf,
              }}
            />
            {displaySpeaker || displayBadge}
          </div>
        )}

        {/* Dynamic Spoken Text */}
        <div
          style={{
            fontFamily: Typography.fontFamilySans,
            fontSize: 18,
            fontWeight: 500,
            color: '#FAF6ED',
            lineHeight: 1.35,
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.9)',
            textAlign: 'center',
          }}
        >
          {displayText}
        </div>
      </div>
    </div>
  );
};
