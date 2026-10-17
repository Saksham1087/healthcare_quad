# MediScript Remotion Demo Video Architecture

High-production 3-minute+ SaaS hackathon presentation video for MediScript — ambient clinical AI scribe with FHIR R4 interoperability and BulbaCare botanical identity.

## Resolution & Canvas
- **Resolution**: 1920 × 1080 (Full HD 16:9)
- **Framerate**: 30 FPS
- **Total Duration**: 5,400 frames (3:00 minutes) / 6,300 frames (3:30 extended)

---

## Botanical Design System Tokens (`src/components/BotanicalTheme.ts`)

| Token | Hex / Value | Purpose |
| :--- | :--- | :--- |
| `forestDark` | `#0E2A21` | Deep clinical obsidian forest background |
| `darkForest` | `#163E32` | Elevated surface / card background |
| `forestMid` | `#1C4A3C` | Container borders and gradients |
| `bulbaTeal` | `#3FA796` | Primary brand accent & ambient active glow |
| `bulbaTealLight` | `#55C2B1` | Vibrant UI badges and highlights |
| `leafGreen` | `#7BC96F` | Positive metrics, verified FHIR resources |
| `leafGreenLight` | `#9DE393` | Telemetry text, active waveforms |
| `agedParchment` | `#F3EBD3` | Primary text & classical medical scrolls |
| `coral` | `#D9483B` | Emergency alerts, clinical discrepancies, burnout stats |
| `goldLeaf` | `#C9A24B` | ROI borders, hackathon trophies, glowing accents |
| `goldLeafGlow` | `#E5C068` | Metric highlights, spotlight cards |

---

## Reusable Botanical Component Library (`src/components/`)

### 1. `DeviceFrame.tsx`
- **MacBook Frame**: 3D perspective aluminium laptop chassis with camera indicator, window controls, URL badge, and inner viewport for screencasts.
- **iPhone Frame**: Titanium curved mobile chassis with Dynamic Island, pill notch, and home indicator.
- **Props**: `type ('macbook' | 'iphone')`, `scale`, `rotateX`, `rotateY`, `rotateZ`, `translateY`, `glassReflection`, `title`.

### 2. `WaveformVisualizer.tsx`
- Dynamic audio spectrum frequency bars driven by Remotion `useCurrentFrame()` and multi-harmonic sine/cosine wave generators.
- Features Gaussian bell curves for authentic sound-desk EQ visualization.
- **Variants**: `'teal' | 'gold' | 'coral' | 'leaf'`.

### 3. `SubtitleOverlay.tsx`
- Vintage parchment & dark botanical lower-third banner.
- Spring physics entry animation with word-by-word dynamic karaoke highlights.
- Includes speaker tags, botanical badges, and decorative gold leaf corner brackets.

### 4. `StatCalloutCard.tsx`
- 3D tilting metric showcase with gold/teal/coral borders and radial backglow.
- Interactive floating animation, counter reveals, and ROI trend indicators.

### 5. `MascotBadge.tsx`
- Vector SVG of BulbaCare clinical botanical companion with stethoscope and back sprout.
- Remotion harmonic breathing animation, eyelid blinks, and optional speech bubbles.

---

## Development & Rendering Commands

```bash
# Preview interactive timeline in Remotion Studio
npm start

# Type check
npm run lint (or npx tsc --noEmit)

# Bundle check
npm run build (or npx remotion bundle)

# Render full video
npm run render

# Render test frame still
npx remotion still ComponentShowcase out/test-still.png --frame=60
```
