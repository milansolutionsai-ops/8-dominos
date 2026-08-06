import { Platform, TextStyle, ViewStyle } from 'react-native';

/**
 * 8 Dominos design system — single source of truth for color, type, spacing, motion.
 *
 * Palette is the refined navy-dark direction, aligned to the live brand at
 * https://8dominos.com (launched):
 *   logo blue #0062FF (the app's accent) · site content blue #3F73C8
 *   navy #0D1F4F (shared with the site) · slate #1E293B/#334155 · font Poppins
 *
 * Note: the site is light-themed, so it uses the softer #3F73C8 on white. The
 * app is navy-dark, where that reads muddy — so the logo blue #0062FF is the
 * accent here. Navy is identical across both.
 *
 * Direction: navy surface + brand-blue accent (premium, game-first, on-brand).
 * A light "daytime" theme can ship later as a one-file variant. Components must
 * never hardcode a hex; always read from here.
 */

// Raw brand colors (from 8dominos.com Elementor globals) — unchanged.
export const brand = {
  blue: '#0062FF',
  blueDark: '#0052D6',
  blueTint: '#3D82FF',
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
  bg: '#060D1C', // app canvas, deepest layer
  surface: '#0E1A31', // cards, incomplete tiles, sheets
  surfaceAlt: '#13233F', // headers, tab bar, elevated
  surfaceMuted: '#0A1428', // inset wells, empty dots, tracks

  // lines / borders
  border: '#1E2E4C',
  borderStrong: '#2C4066',

  // text
  textPrimary: '#F5F8FD',
  textSecondary: '#AEBCD6',
  textMuted: '#74839F',
  textInverse: '#0D1F4F', // text on light / accent fills

  // brand accent
  accent: '#0062FF', // brand hero — official 8dominos electric blue
  accentBright: '#3D82FF', // rings, glows, large fills on dark
  accentPressed: '#0052D6',
  accentSoft: 'rgba(0,98,255,0.16)', // tinted fills, selected chips
  onAccent: '#FFFFFF',

  // states
  success: '#2FBF71',
  warning: '#F0B429',
  danger: '#EF5A54',

  // Score ramp (brand-anchored blue luminance; gold crown at 8/8).
  //
  // Tuned for contrast and step separation, both measured against `surface`:
  //   low  4.96:1 (was 2.08 — failed every gate, and it is the state a
  //        struggling user sees most: ring stroke, big numeral, trend icon)
  //   mid  3.55:1 (graphics + large-text gate is 3:1; only ever used at 18pt+)
  //   high 6.99:1
  // Adjacent steps are >= 30 deltaE apart (mid/high used to be 9.4, i.e. a
  // 5-day and a 7-day rendered as the same blue).
  scoreLow: '#7889B0', // 0-3
  scoreMid: '#2F6BE0', // 4-5
  scoreHigh: '#66A6FF', // 6-7
  scoreFull: '#F0B429', // 8, perfect (gold)

  // scrims / overlays
  overlay: 'rgba(3,7,16,0.7)',
  transparent: 'transparent',
} as const;

// Completed-tile gradient (135deg). Consumed via expo-linear-gradient.
export const gradients = {
  tileComplete: ['#3D82FF', '#0062FF'] as const,
} as const;

// Per-pillar signature tints (order = Body…Soul; subtle, system blue stays hero).
export const pillarTints = [
  '#2E8BEF', '#37C871', '#F0B429', '#EC6A9C',
  '#5B8DEF', '#C9A227', '#9A86F0', '#57C6DC',
] as const;

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  /** Display weight — matches the headings on 8dominos.com. */
  extrabold: 'Poppins_800ExtraBold',
} as const;

/**
 * Type scale (Poppins). Size-specific tracking: large text negative, body near zero.
 *
 * Every text style in the app must come from here. The scale went unused for a
 * whole batch because it was missing the sizes the screens actually needed
 * (14, 16, 11, 10, 20, 32, 48), so components hand-rolled `fontFamily` +
 * `fontSize` instead. Those steps now exist. If a new size is needed, add it
 * here rather than inlining it.
 *
 * Never pair `fontWeight` with these — Poppins is a static family, so iOS
 * ignores the weight and Android may synthesise a fake bold over a real one.
 * Pick the right `fonts.*` face instead.
 */
export const type = {
  // Stat numerals. Tabular so counters don't jitter as digits change.
  hero: { fontFamily: fonts.extrabold, fontSize: 48, lineHeight: 54, letterSpacing: -1.6, fontVariant: ['tabular-nums'] },
  statLg: { fontFamily: fonts.extrabold, fontSize: 32, lineHeight: 38, letterSpacing: -0.8, fontVariant: ['tabular-nums'] },
  stat: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, letterSpacing: -0.2, fontVariant: ['tabular-nums'] },

  // Headings.
  display: { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 40, letterSpacing: -0.8 },
  h1: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  h2: { fontFamily: fonts.semibold, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.1 },
  h4: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, letterSpacing: -0.1 },

  // Body.
  bodyLg: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 25, letterSpacing: 0 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  bodySm: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  bodySmStrong: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, letterSpacing: 0 },

  // Support.
  caption: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, letterSpacing: 0.1 },
  label: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
  labelSm: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 15, letterSpacing: 0.4 },
  /** Floor. Nothing in the app may be smaller than this. */
  micro: { fontFamily: fonts.semibold, fontSize: 10, lineHeight: 14, letterSpacing: 0.5 },
} satisfies Record<string, TextStyle>;

// Apply to HUD/score numerals so counters don't jitter as digits change.
export const tabularNums: TextStyle = { fontVariant: ['tabular-nums'] };

/**
 * 4pt scale. There is deliberately no `20` step: the screens that used a raw
 * 20 were mixing a 20pt gutter against the board's 16pt one, which left a 4pt
 * misalignment down the Daily screen. Gutters and card padding are both `lg`.
 */
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
  springDefault: { damping: 26, stiffness: 240, mass: 1 }, // transitions + ring settle
  springSnappy: { damping: 22, stiffness: 320, mass: 1 }, // button / check pop
  springBouncy: { damping: 15, stiffness: 220, mass: 1 }, // tile pop
  springChain: { damping: 18, stiffness: 260, mass: 1 }, // domino-chain cascade
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
    ios: { shadowColor: colors.accent, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 16 },
    android: { elevation: 10 },
    default: {},
  }) as ViewStyle,
} as const;

export const theme = { brand, colors, gradients, pillarTints, fonts, type, tabularNums, spacing, radius, motion, elevation };
export default theme;
