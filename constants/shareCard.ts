import { Platform, PixelRatio } from 'react-native';

/**
 * Geometry for the shareable cards.
 *
 * These are a bespoke export canvas, not a UI scale, which is why they live
 * beside `theme.ts` rather than inside it. Colour and type still come from the
 * theme; only the canvas maths is here. Nothing in a share card may hardcode a
 * number that isn't derived from this file.
 *
 * ## Why a unit function and not `transform: [{ scale }]`
 *
 * `react-native-view-shot@4` has no `pixelRatio` option — output resolution is
 * purely the captured view's point size multiplied by the device scale. And its
 * `width`/`height` options mean different things per platform: points on iOS
 * (fed to UIGraphicsBeginImageContextWithOptions, so passing 1080 upsamples to
 * a blurry 3240px), pixels on Android.
 *
 * Scaling with a transform doesn't work either: Android's `view.draw(canvas)`
 * ignores the captured view's own transform, iOS's `drawViewHierarchyInRect`
 * applies it, and html2canvas handles it unreliably. So instead we design
 * against a fixed logical canvas and multiply every number through `u()`. The
 * host renders at whatever point size lands on exactly 1080x1920 for this
 * device's scale. Text and vector borders stay crisp because they rasterise at
 * the final resolution either way.
 */

/** Target export, 9:16 — native for Stories, downscales cleanly everywhere else. */
export const EXPORT_W = 1080;
export const EXPORT_H = 1920;

/** The canvas every share-card style is authored against. */
export const CANVAS_W = 360;
export const CANVAS_H = 640;

/**
 * Design-point -> device-point multiplier. 1 on web, where html2canvas takes an
 * explicit scale instead.
 */
export const CARD_UNIT =
  Platform.OS === 'web' ? 1 : EXPORT_W / PixelRatio.get() / CANVAS_W;

/** Scale a design-point value onto this device. */
export const u = (n: number) => n * CARD_UNIT;

/** Point size the capture host must render at to yield EXPORT_W x EXPORT_H. */
export const HOST_W = CANVAS_W * CARD_UNIT;
export const HOST_H = CANVAS_H * CARD_UNIT;

/** html2canvas multiplier for the web path. */
export const WEB_CAPTURE_SCALE = EXPORT_W / CANVAS_W;

/**
 * Layout, in design-points on the 360x640 canvas.
 *
 * The fixed blocks sum to 630 of 640, and the 10pt remainder lives in a
 * `flex: 1` spacer above the footer rule. That spacer is load-bearing: Poppins
 * line metrics differ by a few points across iOS, Android and react-native-web,
 * and the spacer is where that drift goes instead of overflowing the canvas.
 */
export const card = {
  padH: 28,
  padTop: 48,
  padBottom: 46,

  brandRowH: 16,
  heroH: 74,
  heroLabelH: 18,
  gapAfterBrand: 22,
  gapAfterHero: 22,
  gapAfterRule: 18,
  gapBeforeFooter: 14,
  footerH: 22,

  rowH: 36,
  rowGap: 4,

  /** Sized off the worst case: SPIRITUALITY at 10pt semibold + tracking ~72pt. */
  pillarCol: 74,
  pipW: 22,
  pipSize: 15,
  colGap: 10,

  /** Week card: 7 day dots at 6pt with 4pt gaps. */
  dotSize: 6,
  dotGap: 4,
} as const;

/** Content width available inside the horizontal padding. */
export const CONTENT_W = CANVAS_W - card.padH * 2; // 304

/**
 * Width left for a day card's activity text after the pip and pillar columns.
 * At 12pt Poppins Medium (~0.52em average advance) this is roughly 30
 * characters, which is why the setup input caps entry at 34.
 */
export const ACTIVITY_W =
  CONTENT_W - card.pipW - card.colGap - card.pillarCol - card.colGap; // 188

/** Matches ACTIVITY_W. Enforced on the setup form so habits are authored to fit. */
export const ACTIVITY_MAX_CHARS = 34;
