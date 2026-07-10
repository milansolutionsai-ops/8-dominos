import { Platform, TextStyle, ViewStyle } from 'react-native';

/**
 * 8 Dominos design system — single source of truth for color, type, spacing, motion.
 *
 * Palette is derived from the live brand at https://8dominos.com
 *   brand blue #046BD2 · hover #045CB4 · navy #0D1F4F · slate #1E293B/#334155
 *   cream #F7F3EA · light-blue tint #F0F5FA · ink #111111 · font Poppins
 *
 * WORKING DIRECTION: navy-dark surface + brand-blue accent (premium, game-first,
 * on-brand, masculine). Light vs dark and the exact final values are the Claude
 * design pass's call — swap the values in `palette` below and everything re-skins.
 * Components must never hardcode a hex; always read from here.
 */

// Raw brand colors (from 8dominos.com Elementor globals)
export const brand = {
  blue: '#046BD2',
  blueDark: '#045CB4',
  blueTint: '#3F73C8',
  navy: '#0D1F4F',
  slate800: '#1E293B',
  slate700: '#334155',
  cream: '#F7F3EA',
  blueBgTint: '#F0F5FA',
  ink: '#111111',
  white: '#FFFFFF',
} as const;

// Semantic tokens — everything in the app references these, not raw brand/hex.
export const colors = {
  // surfaces
  bg: '#0A1327', // deep navy-black base
  surface: '#111E38', // cards / tiles
  surfaceAlt: brand.navy, // #0D1F4F elevated / headers
  surfaceMuted: '#0E1830',

  // lines / borders
  border: '#22314F',
  borderStrong: '#33456B',

  // text
  textPrimary: '#F4F7FC',
  textSecondary: '#B4C0D8',
  textMuted: '#7C89A6',
  textInverse: brand.navy, // dark text on light/accent surfaces

  // brand accent
  accent: brand.blue, // #046BD2 hero
  accentPressed: brand.blueDark,
  accentSoft: 'rgba(4,107,210,0.14)', // tinted fills
  onAccent: brand.white,

  // states
  success: '#22C55E',
  warning: '#F5A623',
  danger: '#F0524B',

  // score ramp (was traffic-light; now brand-anchored)
  scoreFull: '#22C55E',
  scoreHigh: brand.blue,
  scoreMid: '#F5A623',
  scoreLow: '#7C89A6',

  // scrims / overlays
  overlay: 'rgba(4,9,20,0.66)',
  transparent: 'transparent',
} as const;

// Per-pillar signature tints (subtle; accent stays the system hero).
// Order matches the 8 dominoes: Body, Health, Happiness, Love, Work, Wealth, Spirituality, Soul.
export const pillarTints = [
  '#046BD2', '#22C55E', '#F5A623', '#EC5A96',
  '#3F73C8', '#D4A017', '#8B7BE8', '#5AC8D8',
] as const;

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

// Type scale (Poppins). Size-specific tracking per apple-design typography rules:
// large text gets negative tracking, body near zero.
export const type = {
  display: { fontFamily: fonts.bold, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  h1: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.semibold, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.1 },
  bodyLg: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 25, letterSpacing: 0 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  caption: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, letterSpacing: 0.1 },
  label: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
} satisfies Record<string, TextStyle>;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

// Motion tokens (apple-design springs: critically damped default; bounce only on
// momentum-driven interactions). Consumed by Reanimated withSpring/withTiming.
export const motion = {
  springDefault: { damping: 26, stiffness: 240, mass: 1 }, // response ~0.35s, no overshoot
  springSnappy: { damping: 22, stiffness: 320, mass: 1 },
  springBouncy: { damping: 15, stiffness: 220, mass: 1 }, // for flick/release moments
  durationFast: 120,
  durationBase: 220,
  durationSlow: 360,
} as const;

// Cross-platform elevation presets.
export const elevation = {
  sm: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 6 },
    android: { elevation: 3 },
    default: {},
  }) as ViewStyle,
  md: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.32, shadowRadius: 14 },
    android: { elevation: 8 },
    default: {},
  }) as ViewStyle,
  accentGlow: Platform.select({
    ios: { shadowColor: brand.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 16 },
    android: { elevation: 10 },
    default: {},
  }) as ViewStyle,
} as const;

export const theme = { brand, colors, pillarTints, fonts, type, spacing, radius, motion, elevation };
export default theme;
