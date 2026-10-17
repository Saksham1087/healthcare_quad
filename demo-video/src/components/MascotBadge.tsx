import React from 'react';
import { useCurrentFrame } from 'remotion';
import { BotanicalColors, Typography } from './BotanicalTheme';

export interface MascotBadgeProps {
  size?: number;
  expression?: 'happy' | 'thinking' | 'celebrating' | 'speaking';
  withStethoscope?: boolean;
  glow?: boolean;
  speechText?: string;
  style?: React.CSSProperties;
}

export const MascotBadge: React.FC<MascotBadgeProps> = ({
  size = 140,
  expression = 'happy',
  withStethoscope = true,
  glow = true,
  speechText,
  style,
}) => {
  const frame = useCurrentFrame();
  const time = frame / 30;

  // Breathing animation (subtle scale & chest rise)
  const breath = Math.sin(time * 2.8) * 0.035;
  const bobY = Math.sin(time * 2.8) * 4;
  const leafSway = Math.sin(time * 3.5) * 6; // degrees

  // Blink logic: every ~3.5 seconds (105 frames), blink for 5 frames
  const blinkCycle = frame % 105;
  const isBlinking = blinkCycle > 100;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      {/* Optional Speech Bubble */}
      {speechText && (
        <div
          style={{
            position: 'absolute',
            top: -48,
            backgroundColor: BotanicalColors.agedParchment,
            color: '#163E32',
            padding: '6px 14px',
            borderRadius: 16,
            fontFamily: Typography.fontFamilySans,
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            border: `1.5px solid ${BotanicalColors.goldLeaf}`,
            zIndex: 10,
            animation: 'none',
          }}
        >
          {speechText}
          {/* Speech Bubble Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `6px solid ${BotanicalColors.agedParchment}`,
            }}
          />
        </div>
      )}

      {/* Mascot SVG Container */}
      <div
        style={{
          width: size,
          height: size,
          transform: `translateY(${bobY}px) scale(${1 + breath})`,
          transformOrigin: 'bottom center',
          filter: glow
            ? `drop-shadow(0 10px 25px rgba(63, 167, 150, 0.45)) drop-shadow(0 0 15px rgba(123, 201, 111, 0.3))`
            : 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Gradients for BulbaCare Mascot */}
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#55C2B1" />
              <stop offset="60%" stopColor="#3FA796" />
              <stop offset="100%" stopColor="#1E5C51" />
            </linearGradient>

            <linearGradient id="bulbGrad" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#3B8A31" />
              <stop offset="50%" stopColor="#7BC96F" />
              <stop offset="100%" stopColor="#A8EC9F" />
            </linearGradient>

            <linearGradient id="stethGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E86B60" />
              <stop offset="100%" stopColor="#D9483B" />
            </linearGradient>

            <linearGradient id="goldCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D77F" />
              <stop offset="100%" stopColor="#C9A24B" />
            </linearGradient>

            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Botanical Sprout / Seed Bulb on Back */}
          <g
            style={{
              transform: `rotate(${leafSway}deg)`,
              transformOrigin: '100px 90px',
            }}
          >
            {/* Outer Bulb Petals */}
            <path
              d="M 100 25 C 65 50 60 95 100 115 C 140 95 135 50 100 25 Z"
              fill="url(#bulbGrad)"
              stroke="#2A6323"
              strokeWidth="2.5"
            />
            {/* Inner Sprout Leaf highlight */}
            <path
              d="M 100 35 C 80 55 82 85 100 102 C 118 85 120 55 100 35 Z"
              fill="#92E086"
              opacity="0.85"
            />
            {/* Sprout Tip Gold Bud */}
            <circle
              cx="100"
              cy="25"
              r="6"
              fill="url(#goldCapGrad)"
              stroke="#A67B25"
              strokeWidth="1.5"
            />
          </g>

          {/* Bulbasaur Body */}
          {/* Back Feet */}
          <ellipse cx="65" cy="155" rx="16" ry="12" fill="#246155" />
          <ellipse cx="135" cy="155" rx="16" ry="12" fill="#246155" />

          {/* Main Round Body */}
          <path
            d="M 52 135 C 42 105 60 75 100 75 C 140 75 158 105 148 135 C 142 162 58 162 52 135 Z"
            fill="url(#bodyGrad)"
            stroke="#1D4F44"
            strokeWidth="3"
          />

          {/* Forehead Ears / Nubs */}
          <polygon
            points="68,82 56,60 78,72"
            fill="#3FA796"
            stroke="#1D4F44"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="132,82 144,60 122,72"
            fill="#3FA796"
            stroke="#1D4F44"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Botanical Teal Body Patches */}
          <path
            d="M 72 100 C 68 96 66 106 70 108 C 75 110 76 102 72 100 Z"
            fill="#236054"
          />
          <path
            d="M 126 102 C 122 98 120 108 125 110 C 130 112 130 105 126 102 Z"
            fill="#236054"
          />
          <path
            d="M 98 84 C 95 80 105 80 102 85 C 99 87 97 86 98 84 Z"
            fill="#236054"
          />

          {/* Eyes */}
          {isBlinking ? (
            // Blinking curved lines
            <g stroke="#0E2A21" strokeWidth="3" strokeLinecap="round">
              <path d="M 72 110 Q 82 115 90 110" fill="none" />
              <path d="M 110 110 Q 118 115 128 110" fill="none" />
            </g>
          ) : (
            // Big Expressive Red/Wine Eyes with Catchlights
            <g>
              {/* Left Eye */}
              <ellipse cx="80" cy="108" rx="10" ry="13" fill="#D9483B" />
              <ellipse cx="81" cy="109" rx="8" ry="11" fill="#99261B" />
              {/* Catchlight */}
              <circle cx="78" cy="104" r="3.5" fill="#FFFFFF" />
              <circle cx="83" cy="112" r="1.5" fill="#FFFFFF" />

              {/* Right Eye */}
              <ellipse cx="120" cy="108" rx="10" ry="13" fill="#D9483B" />
              <ellipse cx="119" cy="109" rx="8" ry="11" fill="#99261B" />
              {/* Catchlight */}
              <circle cx="118" cy="104" r="3.5" fill="#FFFFFF" />
              <circle cx="123" cy="112" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Cute Nostril Dots */}
          <circle cx="96" cy="115" r="1.2" fill="#1B4239" />
          <circle cx="104" cy="115" r="1.2" fill="#1B4239" />

          {/* Smiling Mouth */}
          <path
            d={
              expression === 'speaking'
                ? 'M 92 122 Q 100 134 108 122 Q 100 126 92 122 Z'
                : 'M 93 122 Q 100 129 107 122'
            }
            fill={expression === 'speaking' ? '#D9483B' : 'none'}
            stroke="#143D34"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Front Paws / Claws */}
          <ellipse cx="80" cy="154" rx="13" ry="9" fill="#3AA090" stroke="#1D4F44" strokeWidth="2" />
          <ellipse cx="120" cy="154" rx="13" ry="9" fill="#3AA090" stroke="#1D4F44" strokeWidth="2" />
          {/* White Claw points */}
          <polygon points="75,158 77,163 79,158" fill="#F3EBD3" />
          <polygon points="81,158 83,163 85,158" fill="#F3EBD3" />
          <polygon points="115,158 117,163 119,158" fill="#F3EBD3" />
          <polygon points="121,158 123,163 125,158" fill="#F3EBD3" />

          {/* Clinical Stethoscope */}
          {withStethoscope && (
            <g>
              {/* Red Tube Loop around neck */}
              <path
                d="M 68 125 C 68 148 132 148 132 125"
                fill="none"
                stroke="url(#stethGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Hanging chest piece connector */}
              <path
                d="M 100 142 L 100 152"
                stroke="url(#stethGrad)"
                strokeWidth="3.5"
              />
              {/* Gold Chest Piece / Bell with Medical Cross */}
              <circle
                cx="100"
                cy="158"
                r="10"
                fill="url(#goldCapGrad)"
                stroke="#8C6517"
                strokeWidth="1.5"
              />
              <circle cx="100" cy="158" r="6.5" fill="#FAF6ED" />
              {/* Tiny Green Medical Cross */}
              <rect x="98.5" y="154" width="3" height="8" rx="1" fill="#3FA796" />
              <rect x="96" y="156.5" width="8" height="3" rx="1" fill="#3FA796" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
