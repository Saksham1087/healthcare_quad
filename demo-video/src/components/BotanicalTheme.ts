// Botanical Theme Tokens for MediScript Demo Video
export const BotanicalColors = {
  // Primary Palette
  forestDark: '#0E2A21',
  darkForest: '#163E32',
  forestMid: '#1C4A3C',
  bulbaTeal: '#3FA796',
  bulbaTealLight: '#55C2B1',
  leafGreen: '#7BC96F',
  leafGreenLight: '#9DE393',
  agedParchment: '#F3EBD3',
  parchmentLight: '#FAF6ED',
  parchmentDark: '#E4D6B4',
  coral: '#D9483B',
  coralLight: '#E86B60',
  goldLeaf: '#C9A24B',
  goldLeafGlow: '#E5C068',

  // UI Accents
  white: '#FFFFFF',
  textPrimary: '#F3EBD3',
  textSecondary: '#C8DEC9',
  textMuted: '#8EAA9E',
  borderDark: '#235948',
  borderGold: 'rgba(201, 162, 75, 0.45)',
  borderTeal: 'rgba(63, 167, 150, 0.4)',
  
  // Shadows & Overlays
  shadowDeep: '0 25px 60px -15px rgba(5, 18, 14, 0.85)',
  shadowGlowTeal: '0 0 40px rgba(63, 167, 150, 0.35)',
  shadowGlowGold: '0 0 35px rgba(201, 162, 75, 0.35)',
  glassBgDark: 'rgba(14, 42, 33, 0.82)',
  glassBgParchment: 'rgba(243, 235, 211, 0.92)',
} as const;

export const BotanicalGradients = {
  heroBackground: 'radial-gradient(ellipse at 50% 25%, #1D5344 0%, #0E2A21 65%, #071712 100%)',
  forestVignette: 'radial-gradient(circle at center, rgba(22, 62, 50, 0) 50%, rgba(7, 23, 18, 0.85) 100%)',
  cardSurface: 'linear-gradient(145deg, rgba(22, 62, 50, 0.85) 0%, rgba(14, 42, 33, 0.95) 100%)',
  goldAccent: 'linear-gradient(135deg, #E5C068 0%, #C9A24B 50%, #9C7728 100%)',
  tealAccent: 'linear-gradient(135deg, #55C2B1 0%, #3FA796 50%, #257064 100%)',
  leafAccent: 'linear-gradient(135deg, #9DE393 0%, #7BC96F 50%, #4D9142 100%)',
  coralAccent: 'linear-gradient(135deg, #E86B60 0%, #D9483B 50%, #A52B20 100%)',
  parchmentCard: 'linear-gradient(180deg, #FAF6ED 0%, #F3EBD3 100%)',
} as const;

export const Typography = {
  fontFamilySerif: '"Cinzel", "Playfair Display", "Georgia", "Times New Roman", serif',
  fontFamilySans: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", Roboto, sans-serif',
  fontFamilyMono: '"JetBrains Mono", "Fira Code", monospace',
} as const;
