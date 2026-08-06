import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { u, HOST_W, HOST_H, card } from '@/constants/shareCard';

interface ShareCardFrameProps {
  /** Right-hand side of the brand row: a date, or a week range. */
  meta: string;
  /** The big number: "7" or "76%". */
  heroValue: string;
  /** Small suffix rendered next to it, e.g. "/8". Omit for percentages. */
  heroSuffix?: string;
  heroColor: string;
  heroLabel: string;
  heroLabelColor?: string;
  /** The eight pillar rows. */
  children: React.ReactNode;
  footerLeft: React.ReactNode;
}

/**
 * The shared 9:16 canvas both share cards render into.
 *
 * Full-bleed navy with no inner border or radius on purpose: the old cards drew
 * their own accent frame, which double-framed once the image sat inside a
 * social post. The frame here is the image.
 *
 * Deliberately contains no LinearGradient. If an iOS capture ever comes back
 * blank we retry with `useRenderInContext`, which cannot rasterise a
 * CAGradientLayer — so the cards must stay gradient-free.
 */
export const ShareCardFrame = forwardRef<View, ShareCardFrameProps>(
  ({ meta, heroValue, heroSuffix, heroColor, heroLabel, heroLabelColor, children, footerLeft }, ref) => (
    <View ref={ref} collapsable={false} style={styles.canvas}>
      <View style={styles.brandRow}>
        <Text style={styles.kicker}>8 DOMINOS</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>

      <View style={styles.hero}>
        <Text style={[styles.heroValue, { color: heroColor }]} numberOfLines={1}>
          {heroValue}
          {heroSuffix ? <Text style={styles.heroSuffix}>{heroSuffix}</Text> : null}
        </Text>
      </View>
      <Text
        style={[styles.heroLabel, heroLabelColor ? { color: heroLabelColor } : null]}
        numberOfLines={1}
      >
        {heroLabel}
      </Text>

      <View style={styles.rule} />

      <View style={styles.rows}>{children}</View>

      {/* Absorbs cross-platform font-metric drift so the canvas never overflows. */}
      <View style={styles.spacer} />

      <View style={styles.rule} />
      <View style={styles.footer}>
        {footerLeft}
        <Text style={styles.url}>8dominos.com</Text>
      </View>
    </View>
  )
);

ShareCardFrame.displayName = 'ShareCardFrame';

const styles = StyleSheet.create({
  canvas: {
    width: HOST_W,
    height: HOST_H,
    backgroundColor: colors.bg,
    paddingHorizontal: u(card.padH),
    paddingTop: u(card.padTop),
    paddingBottom: u(card.padBottom),
  },
  brandRow: {
    height: u(card.brandRowH),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: u(card.gapAfterBrand),
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: u(11),
    letterSpacing: u(3),
    color: colors.accentBright,
    textTransform: 'uppercase',
  },
  meta: {
    fontFamily: fonts.medium,
    fontSize: u(11),
    color: colors.textMuted,
  },
  hero: {
    height: u(card.heroH),
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroValue: {
    fontFamily: fonts.extrabold,
    fontSize: u(68),
    lineHeight: u(74),
    letterSpacing: u(-2.5),
    fontVariant: ['tabular-nums'],
  },
  heroSuffix: {
    fontFamily: fonts.medium,
    fontSize: u(26),
    color: colors.textMuted,
  },
  heroLabel: {
    height: u(card.heroLabelH),
    fontFamily: fonts.semibold,
    fontSize: u(13),
    letterSpacing: u(0.2),
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: u(card.gapAfterHero),
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  rows: {
    marginTop: u(card.gapAfterRule),
    gap: u(card.rowGap),
  },
  spacer: {
    flex: 1,
    minHeight: u(card.gapBeforeFooter),
  },
  footer: {
    height: u(card.footerH),
    marginTop: u(card.gapBeforeFooter),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  url: {
    fontFamily: fonts.semibold,
    fontSize: u(11),
    letterSpacing: u(0.3),
    color: colors.accentBright,
  },
});
