import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius, spacing } from '@/constants/theme';

export interface ShareWeekData {
  dateRange: string;
  percentage: number;
  weekScore: number;
  totalPossible: number;
  perfectDays: number;
  bestDomino: string;
}

/**
 * Branded, share-ready summary of the user's week. Rendered on the Weekly
 * screen and captured to an image (react-native-view-shot) for the native
 * share sheet — doubles as marketing when a client shares it.
 */
export const ShareWeekCard = forwardRef<View, { data: ShareWeekData }>(({ data }, ref) => {
  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      <Text style={styles.kicker}>8 DOMINOS</Text>
      <Text style={styles.heading}>My Week</Text>
      <Text style={styles.range}>{data.dateRange}</Text>

      <View style={styles.percentBlock}>
        <Text style={styles.percent}>{data.percentage}%</Text>
        <Text style={styles.percentLabel}>dominos completed</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{data.weekScore}/{data.totalPossible}</Text>
          <Text style={styles.statLabel}>Habits</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{data.perfectDays}</Text>
          <Text style={styles.statLabel}>Perfect days</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue} numberOfLines={1}>{data.bestDomino || '—'}</Text>
          <Text style={styles.statLabel}>Top pillar</Text>
        </View>
      </View>

      <Text style={styles.footer}>Body · Health · Happiness · Love · Work · Wealth · Spirituality · Soul</Text>
    </View>
  );
});

ShareWeekCard.displayName = 'ShareWeekCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 3,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    letterSpacing: -0.5,
  },
  range: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  percentBlock: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  percent: {
    fontFamily: fonts.bold,
    fontSize: 64,
    color: colors.accent,
    letterSpacing: -2,
  },
  percentLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: -4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    paddingHorizontal: 4,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  footer: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    letterSpacing: 0.3,
  },
});
