import React from 'react';
import { BotanicalColors } from './BotanicalTheme';

export interface DeviceFrameProps {
  type: 'macbook' | 'iphone';
  children?: React.ReactNode;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  translateY?: number;
  glassReflection?: boolean;
  title?: string;
  style?: React.CSSProperties;
  screenStyle?: React.CSSProperties;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  type,
  children,
  scale = 1,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  translateY = 0,
  glassReflection = true,
  title = 'mediscript.care — Clinical AI Workspace',
  style,
  screenStyle,
}) => {
  const transformStyle: React.CSSProperties = {
    transform: `perspective(1200px) translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.1s ease-out',
    ...style,
  };

  if (type === 'iphone') {
    return (
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          ...transformStyle,
        }}
      >
        {/* Outer Phone Chassis */}
        <div
          style={{
            width: 420,
            height: 860,
            backgroundColor: '#1E2421',
            borderRadius: 54,
            padding: 12,
            boxShadow: `
              0 30px 80px -15px rgba(0, 0, 0, 0.85),
              0 0 0 1px rgba(255, 255, 255, 0.12),
              inset 0 0 0 2px #323E37,
              0 0 35px rgba(63, 167, 150, 0.2)
            `,
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {/* Side Buttons (Simulated) */}
          <div
            style={{
              position: 'absolute',
              left: -4,
              top: 130,
              width: 4,
              height: 48,
              backgroundColor: '#2A3630',
              borderRadius: '2px 0 0 2px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -4,
              top: 195,
              width: 4,
              height: 48,
              backgroundColor: '#2A3630',
              borderRadius: '2px 0 0 2px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -4,
              top: 160,
              width: 4,
              height: 70,
              backgroundColor: '#2A3630',
              borderRadius: '0 2px 2px 0',
            }}
          />

          {/* Screen Display Bezel */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#071510',
              borderRadius: 44,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'inset 0 0 0 2px rgba(0, 0, 0, 0.9)',
              ...screenStyle,
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 125,
                height: 32,
                backgroundColor: '#000000',
                borderRadius: 20,
                zIndex: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 12,
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#0B1713',
                  border: '1px solid #1A2E27',
                }}
              />
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(63, 167, 150, 0.4)',
                }}
              />
            </div>

            {/* Screen Content */}
            <div
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {children}
            </div>

            {/* Home Indicator Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 140,
                height: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                borderRadius: 3,
                zIndex: 40,
                pointerEvents: 'none',
              }}
            />

            {/* Glass Sheen */}
            {glassReflection && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.01) 40%, transparent 60%)',
                  pointerEvents: 'none',
                  zIndex: 35,
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // MacBook Frame
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...transformStyle,
      }}
    >
      {/* Laptop Lid / Screen */}
      <div
        style={{
          width: 1040,
          height: 650,
          backgroundColor: '#1B211E',
          borderRadius: '20px 20px 4px 4px',
          padding: '14px 14px 18px 14px',
          boxShadow: `
            0 35px 90px -20px rgba(4, 15, 11, 0.95),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.25)
          `,
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Camera & Mic Dot */}
        <div
          style={{
            position: 'absolute',
            top: 5,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 30,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#080F0C',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
          <div
            style={{
              width: 3,
              height: 3,
              borderRadius: '50%',
              backgroundColor: '#3FA796',
              opacity: 0.8,
            }}
          />
        </div>

        {/* Display Glass Area */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#071510',
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.8)',
            ...screenStyle,
          }}
        >
          {/* Subtle Browser / App Header bar */}
          <div
            style={{
              height: 34,
              backgroundColor: '#0E2A21',
              borderBottom: '1px solid rgba(63, 167, 150, 0.25)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              gap: 8,
              zIndex: 30,
              flexShrink: 0,
            }}
          >
            {/* Window control traffic lights */}
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#D9483B' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#C9A24B' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#7BC96F' }} />
            </div>

            {/* Address / Title Bar */}
            <div
              style={{
                flex: 1,
                maxWidth: 420,
                margin: '0 auto',
                backgroundColor: 'rgba(7, 23, 18, 0.65)',
                border: '1px solid rgba(63, 167, 150, 0.2)',
                borderRadius: 6,
                padding: '3px 12px',
                fontSize: 11,
                color: BotanicalColors.textSecondary,
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span style={{ color: BotanicalColors.bulbaTeal, fontSize: 10 }}>🔒</span>
              <span style={{ letterSpacing: '0.2px' }}>{title}</span>
            </div>
          </div>

          {/* Viewport for UI Screencast / Interactive App */}
          <div
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {children}
          </div>

          {/* High-end Specular Screen Reflection */}
          {glassReflection && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(125deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 35%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 35,
              }}
            />
          )}
        </div>
      </div>

      {/* Laptop Base & Chin */}
      <div
        style={{
          width: 1180,
          height: 18,
          backgroundColor: '#27312C',
          borderRadius: '2px 2px 14px 14px',
          background: 'linear-gradient(180deg, #37443E 0%, #1D2521 100%)',
          boxShadow: `
            0 25px 45px -10px rgba(0, 0, 0, 0.9),
            inset 0 1px 1px rgba(255, 255, 255, 0.3)
          `,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Thumb Notch Indent */}
        <div
          style={{
            width: 140,
            height: 6,
            backgroundColor: '#18201C',
            borderRadius: '0 0 6px 6px',
            border: '1px solid rgba(0,0,0,0.5)',
            borderTop: 'none',
          }}
        />
      </div>
    </div>
  );
};
