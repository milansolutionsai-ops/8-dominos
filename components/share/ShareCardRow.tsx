import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { DominoPips } from '../DominoPips';
import { u, card } from '@/constants/shareCard';

interface ShareCardRowProps {
  /** 1-8. Drives the pip face, which is the pillar's identity. */
  pipCount: number;
  title: string;
  /** Lit pip tile and brighter text. */
  active: boolean;
  /** Right-hand payload: the habit text on the day card, dots on the week card. */
  children: React.ReactNode;
}

/**
 * One pillar row. All eight always render, on both cards, whatever the score —
 * the chain of eight is the brand, and a card that only shows what went well is
 * the decorative-graphic problem the week card used to have.
 */
export function ShareCardRow({ pipCount, title, active, children }: ShareCardRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.pip, active ? styles.pipOn : styles.pipOff]}>
        <DominoPips
          count={pipCount}
          color={active ? colors.onAccent : colors.textMuted}
          size={u(card.pipSize)}
        />
      </View>
      <Text style={[styles.title, active ? styles.titleOn : styles.titleOff]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.payload}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: u(card.rowH),
    flexDirection: 'row',
    alignItems: 'center',
  },
  pip: {
    width: u(card.pipW),
    height: u(card.pipH),
    borderRadius: u(3),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: u(card.colGap),
  },
  pipOn: {
    backgroundColor: colors.accent,
  },
  pipOff: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  title: {
    width: u(card.pillarCol),
    marginRight: u(card.colGap),
    fontFamily: fonts.semibold,
    fontSize: u(10),
    letterSpacing: u(0.8),
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  titleOn: { color: colors.textPrimary },
  titleOff: { color: colors.textMuted },
  payload: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
