import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Share2 } from 'lucide-react-native';
import { ShareWeekData } from '@/components/ShareWeekCard';
import { SharePreviewSheet, ShareCardPayload } from '@/components/share/SharePreviewSheet';
import { ShareNudgeCard } from '@/components/share/ShareNudgeCard';
import { DominoPips } from '@/components/DominoPips';
import { useDominos } from '@/hooks/useDominos';
import { useShareNudges } from '@/hooks/useShareNudges';
import { DateUtils } from '@/utils/dateUtils';
import { DAY_NAMES } from '@/types/domino';
import MoodTrendChart from '@/components/MoodTrendChart';
import { StorageService } from '@/utils/storage';
import { StatsService } from '@/utils/stats';
import { weeklyMessage } from '@/utils/motivation';
import { colors, fonts, type, spacing, radius, elevation } from '@/constants/theme';

const CHART_H = 132;
const BAR_W = 22;

export default function WeeklyScreen() {
  const insets = useSafeAreaInsets();
  const { dominos, loading, refreshDominos } = useDominos();
  const [weekMoods, setWeekMoods] = useState<any[]>([]);
  const [preview, setPreview] = useState<ShareCardPayload | null>(null);
  const { weekNudgeVisible, resolveWeekNudge } = useShareNudges();

  const weekStart = useMemo(() => DateUtils.startOfWeek(new Date()), []);

  const loadWeekMoods = useCallback(async () => {
    const iso = weekStart.toISOString().split('T')[0];
    const moods = await StorageService.getWeekMoods(iso);
    // Label by the record's own date, not its array position: a gap used to
    // shift every subsequent label.
    setWeekMoods(
      moods.map((m, index) => ({ ...m, dayLabel: DAY_NAMES[index % 7] }))
    );
  }, [weekStart]);

  useFocusEffect(
    useCallback(() => {
      refreshDominos();
      loadWeekMoods();
    }, [loadWeekMoods])
  );

  const summary = useMemo(
    () => StatsService.summarizeWeek(dominos, weekStart),
    [dominos, weekStart]
  );
  const streak = useMemo(() => StatsService.calculateStats(dominos).currentStreak, [dominos]);
  const target = dominos.length || 8;
  const motivation = weeklyMessage(summary.percentage);

  const shareData: ShareWeekData = {
    dateRange: summary.dateRange,
    percentage: summary.percentage,
    daysCounted: summary.daysCounted,
    partial: summary.partial,
    perfectDays: summary.perfectDays,
    streak,
    pillars: summary.pillars,
  };

  const openShare = () => setPreview({ kind: 'week', data: shareData });

  const barColor = (score: number) => {
    const pct = (score / target) * 100;
    if (pct >= 100) return colors.scoreFull;
    if (pct >= 75) return colors.scoreHigh;
    if (pct >= 50) return colors.scoreMid;
    return colors.scoreLow;
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={[styles.skeleton, { width: 200, height: 32 }]} />
          <View style={[styles.skeleton, { width: 150, height: 28, marginTop: spacing.sm }]} />
        </View>
        <View style={[styles.skeleton, styles.skeletonCard]} />
        <View style={[styles.skeleton, styles.skeletonCard]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weekly Overview</Text>
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>{summary.dateRange}</Text>
          </View>
        </View>

        {/* The one hero stat for this screen. */}
        <View style={styles.card}>
          <Text style={[styles.hero, { color: barColor(summary.percentage / 100 * target) }]}>
            {summary.percentage}%
          </Text>
          <Text style={styles.heroLabel}>
            {summary.partial
              ? `of your week so far (${summary.daysCounted} ${summary.daysCounted === 1 ? 'day' : 'days'} in)`
              : 'of your week'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{summary.completed}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{summary.activeDays}</Text>
              <Text style={styles.statLabel}>Active days</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{summary.perfectDays}</Text>
              <Text style={styles.statLabel}>Perfect days</Text>
            </View>
          </View>
        </View>

        {weekNudgeVisible(summary.percentage) && (
          <ShareNudgeCard
            percentage={summary.percentage}
            perfectDays={summary.perfectDays}
            onShare={() => {
              resolveWeekNudge();
              openShare();
            }}
            onDismiss={resolveWeekNudge}
          />
        )}

        <Pressable
          style={({ pressed }) => [styles.shareButton, pressed && styles.pressed]}
          onPress={openShare}
          accessibilityRole="button"
          accessibilityLabel="Share my week"
        >
          <Share2 size={18} color={colors.onAccent} strokeWidth={2.5} />
          <Text style={styles.shareButtonText}>Share my week</Text>
        </Pressable>

        {/* Daily breakdown. Bars are thin with a surface gap, not bordered
            blocks, and days that have not happened render as empty slots
            rather than zeros. */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Breakdown</Text>
          <View style={styles.chart}>
            {summary.dailyScores.map((score, i) => {
              const isToday = i === summary.daysCounted - 1 && summary.partial;
              const future = score === null;
              const h = future ? 0 : Math.max((score / target) * (CHART_H - 26), 3);

              return (
                <View key={i} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    {future ? (
                      <View style={styles.barFuture} />
                    ) : (
                      <>
                        <Text style={styles.barScore}>{score}</Text>
                        <View style={[styles.bar, { height: h, backgroundColor: barColor(score!) }]} />
                      </>
                    )}
                  </View>
                  <Text style={[styles.barLabel, isToday && styles.barLabelToday]}>
                    {DAY_NAMES[i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <MoodTrendChart data={weekMoods} />

        {/* Per-pillar: the only genuinely different cut of the same week. */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Dominos</Text>
          <View style={styles.pillarHeaderRow}>
            <View style={styles.pillarNameCol} />
            {DAY_NAMES.map((d) => (
              <Text key={d} style={styles.pillarDayHead}>{d[0]}</Text>
            ))}
          </View>
          {dominos.map((domino, index) => (
            <View key={domino.id} style={styles.pillarRow}>
              <View style={styles.pillarNameCol}>
                <DominoPips count={index + 1} color={colors.accentBright} size={13} />
                <Text style={styles.pillarName} numberOfLines={1}>{domino.title}</Text>
              </View>
              {DAY_NAMES.map((_, dayIndex) => {
                const date = DateUtils.addDays(weekStart, dayIndex);
                const weekKey = DateUtils.getWeekKeyForDate(date);
                const dayOfWeek = DateUtils.getDayOfWeek(date);
                const done = domino.completionStatus[weekKey]?.[dayOfWeek] || false;
                const future = dayIndex >= summary.daysCounted;
                return (
                  <View
                    key={dayIndex}
                    style={[styles.pillarDot, done && styles.pillarDotOn, future && styles.pillarDotFuture]}
                  />
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>{motivation.title}</Text>
          <Text style={styles.motivationMessage}>{motivation.message}</Text>
        </View>
      </ScrollView>

      <SharePreviewSheet payload={preview} onClose={() => setPreview(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxxl },

  skeleton: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  skeletonCard: {
    height: 180,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...type.h1,
    color: colors.textPrimary,
  },
  weekBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  weekBadgeText: {
    ...type.caption,
    color: colors.textSecondary,
  },

  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...elevation.md,
  },
  cardTitle: {
    ...type.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  hero: {
    ...type.hero,
    textAlign: 'center',
  },
  heroLabel: {
    ...type.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
  statValue: {
    ...type.stat,
    color: colors.textPrimary,
  },
  statLabel: {
    ...type.label,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    minHeight: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
  },
  shareButtonText: {
    ...type.bodyStrong,
    color: colors.onAccent,
  },
  pressed: { opacity: 0.85 },

  chart: {
    height: CHART_H,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barCol: { flex: 1, alignItems: 'center' },
  barTrack: {
    height: CHART_H - 22,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: BAR_W,
    borderTopLeftRadius: radius.sm / 2,
    borderTopRightRadius: radius.sm / 2,
  },
  barFuture: {
    width: BAR_W,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.surfaceMuted,
  },
  barScore: {
    ...type.labelSm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  barLabel: {
    ...type.label,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  barLabelToday: {
    color: colors.accentBright,
  },

  pillarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  pillarNameCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pillarName: {
    ...type.bodySmStrong,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  pillarDayHead: {
    ...type.micro,
    color: colors.textMuted,
    width: 20,
    textAlign: 'center',
  },
  pillarDot: {
    width: 10,
    height: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  pillarDotOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accentBright,
  },
  pillarDotFuture: {
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },

  motivationCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
  },
  motivationTitle: {
    ...type.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  motivationMessage: {
    ...type.body,
    color: colors.textSecondary,
  },
});
