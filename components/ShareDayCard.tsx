import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { DominoPips } from './DominoPips';

export interface ShareDayPillar {
  title: string;
  completed: boolean;
}

export interface ShareDayData {
  dateLabel: string;
  score: number;
  total: number;
  streak: number;
  pillars: ShareDayPillar[];
}

function scoreColor(score: number, total: number): string {
  const pct = total > 0 ? (score / total) * 100 : 0;
  if (pct >= 100) return colors.scoreFull;
  if (pct >= 75) return colors.scoreHigh;
  if (pct >= 50) return colors.scoreMid;
  return colors.scoreLow;
}

/**
 * Share-ready summary of a single day. Captured to PNG (react-native-view-shot)
 * and pushed to the native share sheet.
 *
 * Shows completion BY PILLAR only — never the user's activity text, which is
 * personal ("called mom", "therapy") and shouldn't leave the device in an image
 * that gets posted.
 */
export const ShareDayCard = forwardRef<View, { data: ShareDayData }>(({ data }, ref) => {
  const perfect = data.score >= data.total;
  const color = scoreColor(data.score, data.total);

  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      <Text style={styles.kicker}>8 DOMINOS</Text>
      <Text style={styles.heading}>My Day</Text>
      <Text style={styles.range}>{data.dateLabel}</Text>

      <View style={styles.scoreBlock}>
        <Text style={[styles.score, { color }]}>
          {data.score}<Text style={styles.scoreTotal}>/{data.total}</Text>
        </Text>
        <Text style={styles.scoreLabel}>
          {perfect ? 'perfect day — all eight down' : 'dominos down today'}
        </Text>
      </View>

      {/* The chain: completed pillars lit, the rest dimmed. */}
      <View style={styles.chain}>
        {data.pillars.map((pillar, i) => (
          <View key={pillar.title} style={styles.chainItem}>
            <View style={[styles.chainTile, pillar.completed ? styles.chainTileOn : styles.chainTileOff]}>
              <DominoPips
                count={i + 1}
                color={pillar.completed ? colors.onAccent : colors.textMuted}
                size={14}
              />
            </View>
            <Text
              style={[styles.chainLabel, pillar.completed && styles.chainLabelOn]}
              numberOfLines={1}
            >
              {pillar.title}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <View style={styles.streak}>
          <Flame size={15} color={data.streak > 0 ? colors.warning : colors.textMuted} strokeWidth={2.5} />
          <Text style={styles.streakText}>
            {data.streak} day streak
          </Text>
        </View>
        <Text style={styles.url}>8dominos.com</Text>
      </View>
    </View>
  );
});

ShareDayCard.displayName = 'ShareDayCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.xl,
    width: 360,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 3,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: fonts.extrabold,
    fontSize: 30,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    letterSpacing: -0.8,
  },
  range: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  scoreBlock: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  score: {
    fontFamily: fonts.extrabold,
    fontSize: 64,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  scoreTotal: {
    fontFamily: fonts.medium,
    fontSize: 26,
    color: colors.textMuted,
  },
  scoreLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: -2,
  },
  chain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  chainItem: {
    alignItems: 'center',
    width: 36,
  },
  chainTile: {
    width: 28,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chainTileOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accentBright,
  },
  chainTileOff: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  chainLabel: {
    fontFamily: fonts.medium,
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 5,
  },
  chainLabelOn: {
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  url: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.accent,
    letterSpacing: 0.3,
  },
});
