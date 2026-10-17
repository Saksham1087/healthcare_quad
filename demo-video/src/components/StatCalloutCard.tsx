import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { BotanicalColors, Typography } from './BotanicalTheme';

export interface StatCalloutCardProps {
  metric: string;
  label: string;
  description?: string;
  trend?: string;
  trendPositive?: boolean;
  icon?: string;
  badgeText?: string;
  variant?: 'gold' | 'teal' | 'coral';
  tiltX?: number;
  tiltY?: number;
  scale?: number;
  delay?: number;
  style?: React.CSSProperties;
}

export const StatCalloutCard: React.FC<StatCalloutCardProps> = ({
  metric,
  label,
  description,
  trend,
  trendPositive = true,
  icon,
  badgeText,
  variant = 'gold',
  tiltX = 8,
  tiltY = -6,
  scale = 1,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - delay);

  // Entrance spring
  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: {
      damping: 12,
      mass: 0.6,
      stiffness: 110,
    },
  });

  // Floating gentle oscillation
  const time = relFrame / 30;
  const floatY = Math.sin(time * 2) * 5;
  const dynamicTiltX = tiltX + Math.sin(time * 1.8) * 2;
  const dynamicTiltY = tiltY + Math.cos(time * 1.5) * 2;

  const cardScale = interpolate(enterProgress, [0, 1], [0.8, 1]) * scale;
  const opacity = interpolate(enterProgress, [0, 0.5, 1], [0, 0.95, 1]);

  const colorConfig = {
    gold: {
      border: 'rgba(201, 162, 75, 0.7)',
      borderGradient: 'linear-gradient(135deg, #E5C068, #C9A24B, rgba(201,162,75,0.2))',
      glow: 'rgba(201, 162, 75, 0.35)',
      badgeBg: 'rgba(201, 162, 75, 0.2)',
      badgeText: BotanicalColors.goldLeafGlow,
      metricColor: BotanicalColors.goldLeafGlow,
    },
    teal: {
      border: 'rgba(63, 167, 150, 0.7)',
      borderGradient: 'linear-gradient(135deg, #55C2B1, #3FA796, rgba(63,167,150,0.2))',
      glow: 'rgba(63, 167, 150, 0.35)',
      badgeBg: 'rgba(63, 167, 150, 0.2)',
      badgeText: BotanicalColors.bulbaTealLight,
      metricColor: BotanicalColors.bulbaTealLight,
    },
    coral: {
      border: 'rgba(217, 72, 59, 0.7)',
      borderGradient: 'linear-gradient(135deg, #E86B60, #D9483B, rgba(217,72,59,0.2))',
      glow: 'rgba(217, 72, 59, 0.35)',
      badgeBg: 'rgba(217, 72, 59, 0.2)',
      badgeText: BotanicalColors.coralLight,
      metricColor: BotanicalColors.coralLight,
    },
  }[variant];

  return (
    <div
      style={{
        perspective: 1000,
        display: 'inline-block',
        opacity,
        transform: `translateY(${floatY}px)`,
        ...style,
      }}
    >
      <div
        style={{
          transform: `rotateX(${dynamicTiltX}deg) rotateY(${dynamicTiltY}deg) scale(${cardScale})`,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(145deg, rgba(22, 62, 50, 0.92) 0%, rgba(14, 42, 33, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: '28px 32px',
          border: `1.5px solid ${colorConfig.border}`,
          boxShadow: `0 25px 60px -10px rgba(3, 14, 10, 0.85), 0 0 35px ${colorConfig.glow}`,
          position: 'relative',
          overflow: 'hidden',
          minWidth: 320,
          maxWidth: 420,
          boxSizing: 'border-box',
        }}
      >
        {/* Top Glow Ray */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 1,
            background: colorConfig.borderGradient,
            boxShadow: `0 0 15px ${colorConfig.glow}`,
          }}
        />

        {/* Card Header: Icon & Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          {icon ? (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: 'rgba(7, 23, 18, 0.8)',
                border: `1px solid ${colorConfig.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              {icon}
            </div>
          ) : (
            <div
              style={{
                fontSize: 22,
              }}
            >
              🌿
            </div>
          )}

          {badgeText && (
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                backgroundColor: colorConfig.badgeBg,
                color: colorConfig.badgeText,
                fontFamily: Typography.fontFamilySans,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '1px',
                border: `1px solid ${colorConfig.border}`,
                boxShadow: `0 0 10px ${colorConfig.glow}`,
              }}
            >
              {badgeText}
            </span>
          )}
        </div>

        {/* Big Metric Value */}
        <div
          style={{
            fontFamily: Typography.fontFamilySerif,
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.1,
            color: colorConfig.metricColor,
            textShadow: `0 0 25px ${colorConfig.glow}`,
            marginBottom: 8,
            letterSpacing: '-1px',
          }}
        >
          {metric}
        </div>

        {/* Metric Label */}
        <div
          style={{
            fontFamily: Typography.fontFamilySans,
            fontSize: 16,
            fontWeight: 600,
            color: BotanicalColors.textPrimary,
            lineHeight: 1.35,
            marginBottom: description || trend ? 12 : 0,
          }}
        >
          {label}
        </div>

        {/* Optional Description */}
        {description && (
          <div
            style={{
              fontFamily: Typography.fontFamilySans,
              fontSize: 13,
              color: BotanicalColors.textSecondary,
              lineHeight: 1.4,
              marginBottom: trend ? 10 : 0,
            }}
          >
            {description}
          </div>
        )}

        {/* Optional Trend Tag */}
        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: Typography.fontFamilySans,
              color: trendPositive ? BotanicalColors.leafGreen : BotanicalColors.coralLight,
              backgroundColor: trendPositive
                ? 'rgba(123, 201, 111, 0.15)'
                : 'rgba(217, 72, 59, 0.15)',
              padding: '3px 8px',
              borderRadius: 6,
            }}
          >
            <span>{trendPositive ? '↗' : '↘'}</span>
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};
