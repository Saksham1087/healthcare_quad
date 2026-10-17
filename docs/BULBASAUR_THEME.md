# Vintage Botanical Bulbasaur Design System 🌿✨

This document outlines the visual identity, design tokens, component architecture, and accessibility standards of the **Vintage Botanical Bulbasaur** theme implemented in MediScript.

---

## 1. Design Concept & Metaphor

Modern clinical software often feels sterile, cold, and stressful to patients navigating illness. The **Vintage Botanical Bulbasaur** aesthetic reimagines medical continuity through the lens of a **19th-century botanical apothecary and herbarium**. 

Like Bulbasaur carrying a nurturing seed bulb on its back that blossoms alongside its journey, MediScript treats each patient's medical history as an evolving, vital organism to be cared for, protected, and nurtured.

---

## 2. Color Palette & Design Tokens

The palette pairs warm, aged parchment backgrounds with deep herbal greens, vibrant foliage, and apothecary gold accents:

| Token Name | Hex Code | Semantic Role |
|---|---|---|
| **Parchment Base** | `#FAF6EA` | Primary background, clean parchment surface |
| **Forest Night** | `#14372C` | Dark mode surface, header backgrounds, botanical frames |
| **Deep Moss** | `#0E2A21` | High-contrast overlays, modal backgrounds, canvas backdrop |
| **Herbal Emerald** | `#2D6A4F` | Primary brand action color, active buttons, healthy badges |
| **Vitality Mint** | `#52B788` | Success indicators, high confidence scores, active status |
| **Medicinal Gold** | `#C9A24B` | Flourish borders, seal stamps, decorative corner accents |
| **Apothecary Amber**| `#D97706` | Caution flags, moderate interaction warnings, refill notices |
| **Warning Berry** | `#991B1B` | Anaphylaxis allergy alerts, contraindications, critical flags |

### CSS Variables (`src/index.css`)
```css
:root {
  --color-parchment: #FAF6EA;
  --color-forest: #14372C;
  --color-moss: #0E2A21;
  --color-emerald: #2D6A4F;
  --color-vitality: #52B788;
  --color-gold: #C9A24B;
}
```

---

## 3. Typography Hierarchy

MediScript combines classical serif headlines with ultra-legible modern sans-serif body typography:

1. **Display & Headings**: `Cinzel Decorative`, `Cinzel`, serif styling for page titles, hero headers, and herbarium stamps.
2. **Clinical Data & Body**: `Plus Jakarta Sans`, system sans-serif for drug names, dosages, Latin Sigs, and timestamps.
3. **Devanagari Vernacular**: High-legibility Indian typography rendering Devanagari script for Hindi and Marathi voice transcripts.

---

## 4. Key Botanical UI Components (`src/components/BulbasaurThemeAssets.tsx`)

### A. Split-Seed Opening Modal (`SplitSeedIntroModal`)
- **Visuals**: Two curved organic seed pod halves adorned with gold botanical filigree and corner flourishes.
- **Interaction**: Users click `"ENTER HERBARIUM"`; the halves split along an organic curved axis to reveal the patient portal.
- **Persistence**: Choice is saved in `localStorage.getItem('mediscript-herbarium-intro-seen')`.
- **Accessibility**: Includes immediate "Skip Intro" option and detects `prefers-reduced-motion` media queries.

### B. Animated Sprout Loader (`ThemedSproutLoader`)
- Replaces generic circular spinners with an organic seedling sprouting from fertile earth with rhythmic pulse animations.

### C. Botanical Badges & Seal Stamps
- Herbarium-style clinical cards with fine 1px gold borders (`border-[#C9A24B]/40`).
- Gilded corner accents representing historical apothecary labels.

---

## 5. Accessibility & Motion Guidelines

1. **Contrast Ratios**: All text meets WCAG AA standards (minimum 4.5:1 for body text, 3:1 for large headers). Text on dark forest backgrounds uses `#FAF6EA` or `#E5D9C5`.
2. **Reduced Motion**:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .seed-pod-animation,
     .sprout-pulse {
       animation: none !important;
       transition: none !important;
     }
   }
   ```
3. **Screen Readers**: All botanical decorative SVG illustrations carry `aria-hidden="true"`, ensuring screen readers focus strictly on clinical data.
