import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { TrendingUp, Minus, TrendingDown, Share2 } from 'lucide-react-native';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ShareWeekCard, ShareWeekData } from '@/components/ShareWeekCard';
import { DominoPips } from '@/components/DominoPips';
import { useDominos } from '@/hooks/useDominos';
import { DateUtils } from '@/utils/dateUtils';
import { DAY_NAMES, Domino, DayOfWeek } from '@/types/domino';
import MoodTrendChart from '@/components/MoodTrendChart';
import { StorageService } from '@/utils/storage';
import { colors, fonts, elevation } from '@/constants/theme';

interface WeeklyOverviewProps {
  dominos: Domino[];
  weekData: Record<DayOfWeek, Record<string, boolean>>;
  currentDate: Date;
}

export default function WeeklyScreen() {
  const insets = useSafeAreaInsets();
  const { dominos, loading, refreshDominos } = useDominos();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    return startOfWeek;
  });
  const [weekMoods, setWeekMoods] = useState<any[]>([]);

  React.useEffect(() => {
    loadWeekMoods();
  }, [currentWeekStart]);

  const loadWeekMoods = async () => {
    const moods = await StorageService.getWeekMoods(currentWeekStart.toISOString().split('T')[0]);
    const formattedMoods = moods.map((m, index) => ({
      ...m,
      dayLabel: DAY_NAMES[index],
    }));
    setWeekMoods(formattedMoods);
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshDominos();
      loadWeekMoods();
    }, [])
  );

  const calculateWeeklyScore = () => {
    const weekKey = DateUtils.getWeekKeyForDate(new Date());
    return dominos.reduce((score, domino) => {
      const weekCompletion = domino.completionStatus[weekKey];
      if (!weekCompletion) return score;

      return score + Object.values(weekCompletion).filter(Boolean).length;
    }, 0);
  };

  const calculateDailyScore = (dayIndex: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const date = DateUtils.addDays(startOfWeek, dayIndex);
    const weekKey = DateUtils.getWeekKeyForDate(date);
    const dayOfWeek = DateUtils.getDayOfWeek(date);

    return dominos.reduce((score, domino) => {
      const completed = domino.completionStatus[weekKey]?.[dayOfWeek] || false;
      return score + (completed ? 1 : 0);
    }, 0);
  };

  const calculateTodayScore = () => {
    const today = new Date();
    const weekKey = DateUtils.getWeekKeyForDate(today);
    const dayOfWeek = DateUtils.getDayOfWeek(today);

    return dominos.reduce((score, domino) => {
      const completed = domino.completionStatus[weekKey]?.[dayOfWeek] || false;
      return score + (completed ? 1 : 0);
    }, 0);
  };

  const calculateWeekStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    let completedDays = 0;
    let missedDays = 0;
    let perfectDays = 0;

    for (let i = 0; i < 7; i++) {
      const date = DateUtils.addDays(startOfWeek, i);
      const weekKey = DateUtils.getWeekKeyForDate(date);
      const dayOfWeek = DateUtils.getDayOfWeek(date);

      let dayCompletions = 0;
      dominos.forEach(domino => {
        if (domino.completionStatus[weekKey]?.[dayOfWeek]) {
          dayCompletions++;
        }
      });

      if (dayCompletions > 0) {
        completedDays++;
      } else {
        missedDays++;
      }

      if (dayCompletions === dominos.length && dominos.length > 0) {
        perfectDays++;
      }
    }

    return { completedDays, missedDays, perfectDays };
  };

  const getWeekDateRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const endOfWeek = DateUtils.addDays(startOfWeek, 6);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startMonth = monthNames[startOfWeek.getMonth()];
    const endMonth = monthNames[endOfWeek.getMonth()];

    return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
  };

  const weeklyScore = calculateWeeklyScore();
  const todayScore = calculateTodayScore();
  const weekStats = calculateWeekStats();
  const totalPossible = dominos.length * 7;
  const weeklyPercentage = totalPossible > 0 ? Math.round((weeklyScore / totalPossible) * 100) : 0;

  const shareRef = useRef<View>(null);

  const getBestDomino = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    let best = '';
    let bestCount = 0;
    dominos.forEach(domino => {
      let count = 0;
      for (let i = 0; i < 7; i++) {
        const date = DateUtils.addDays(startOfWeek, i);
        const weekKey = DateUtils.getWeekKeyForDate(date);
        const dayOfWeek = DateUtils.getDayOfWeek(date);
        if (domino.completionStatus[weekKey]?.[dayOfWeek]) count++;
      }
      if (count > bestCount) {
        bestCount = count;
        best = domino.title;
      }
    });
    return best;
  };

  const shareData: ShareWeekData = {
    dateRange: getWeekDateRange(),
    percentage: weeklyPercentage,
    weekScore: weeklyScore,
    totalPossible,
    perfectDays: weekStats.perfectDays,
    bestDomino: getBestDomino(),
  };

  const handleShare = async () => {
    try {
      const uri = await captureRef(shareRef, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Error sharing week:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loading}>
          {/* Loading placeholder */}
        </View>
      </View>
    );
  }

  const getTrendIcon = () => {
    if (weeklyPercentage >= 75) {
      return <TrendingUp size={32} color={colors.scoreFull} strokeWidth={3} />;
    } else if (weeklyPercentage >= 50) {
      return <Minus size={32} color={colors.scoreMid} strokeWidth={3} />;
    } else {
      return <TrendingDown size={32} color={colors.scoreLow} strokeWidth={3} />;
    }
  };

  const getMotivationalContent = () => {
    if (weeklyPercentage === 100) {
      return {
        title: '🔥 Perfect Week!',
        message: 'Incredible discipline and commitment! You\'ve dominated every single day.',
      };
    } else if (weeklyPercentage >= 75) {
      return {
        title: '💪 Strong Performance!',
        message: 'Solid week of progress. Keep this momentum going next week!',
      };
    } else if (weeklyPercentage >= 50) {
      return {
        title: '⚡ Keep Building!',
        message: 'Halfway there! You\'re building a foundation for greatness.',
      };
    } else {
      return {
        title: '🎯 Let\'s Level Up!',
        message: 'Every champion started somewhere. Your consistency wins the race.',
      };
    }
  };

  const getBarColor = (percentage: number) => {
    if (percentage === 100) return colors.scoreFull;
    if (percentage >= 75) return colors.scoreHigh;
    if (percentage >= 50) return colors.scoreMid;
    return colors.scoreLow;
  };

  const getDayBarHeight = (dayIndex: number) => {
    const dayScore = calculateDailyScore(dayIndex);
    const maxScore = dominos.length || 8;
    const percentage = (dayScore / maxScore) * 100;
    return Math.max((percentage / 100) * 120, 20);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Weekly Overview</Text>
          </View>
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>{getWeekDateRange()}</Text>
          </View>
        </View>

        <ScoreDisplay
          dailyScore={todayScore}
          totalDaily={dominos.length}
          weeklyScore={weeklyScore}
          totalWeekly={dominos.length * 7}
          showWeekly={true}
        />

        <View style={styles.performanceCard}>
          <View style={styles.performanceHeader}>
            {getTrendIcon()}
            <Text style={styles.percentageText}>{weeklyPercentage}%</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>{weekStats.completedDays}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Missed</Text>
              <Text style={styles.statValue}>{weekStats.missedDays}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Perfect Days</Text>
              <Text style={styles.statValue}>{weekStats.perfectDays}</Text>
            </View>
          </View>
        </View>

        <ShareWeekCard ref={shareRef} data={shareData} />
        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.85}>
          <Share2 size={18} color={colors.onAccent} />
          <Text style={styles.shareButtonText}>Share my week</Text>
        </TouchableOpacity>

        <View style={styles.heatmapCardContainer}>
          <View style={styles.heatmapCard}>
            <Text style={styles.heatmapTitle}>Daily Breakdown</Text>
            <View style={styles.heatmapContainer}>
              {DAY_NAMES.map((dayName, index) => {
                const dayScore = calculateDailyScore(index);
                const maxScore = dominos.length || 8;
                const percentage = (dayScore / maxScore) * 100;
                const barHeight = getDayBarHeight(index);

                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                const date = DateUtils.addDays(startOfWeek, index);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <View key={index} style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: getBarColor(percentage),
                          borderWidth: isToday ? 3 : 2,
                        },
                      ]}
                    >
                      <Text style={styles.barScore}>{dayScore}</Text>
                    </View>
                    <Text style={styles.barLabel}>{dayName}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <MoodTrendChart data={weekMoods} />
        <View style={styles.weekGrid}>
          {DAY_NAMES.map((dayName, index) => {
            const dayScore = calculateDailyScore(index);
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1);
            const date = DateUtils.addDays(startOfWeek, index);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <View
                key={dayName}
                style={[
                  styles.dayCard,
                  isToday && styles.todayCard,
                ]}
              >
                <Text style={[styles.dayName, isToday && styles.todayText]}>
                  {dayName}
                </Text>
                <Text style={styles.dayDate}>
                  {date.getDate()}
                </Text>
                <View style={styles.dayScore}>
                  <Text style={[styles.scoreText, isToday && styles.todayText]}>
                    {dayScore}/8
                  </Text>
                </View>
                <View style={styles.dotsGrid}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.miniDot,
                        i < dayScore && styles.completedDot,
                      ]}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.dominosList}>
          <Text style={styles.dominosTitle}>Your Dominos</Text>
          {dominos.map((domino, index) => (
            <View key={domino.id} style={styles.dominoRow}>
              <View style={styles.dominoPipCap}>
                <DominoPips count={index + 1} color={colors.accentBright} size={30} />
              </View>
              <Text style={styles.dominoTitle}>{domino.title}</Text>
              <View style={styles.dominoProgress}>
                {DAY_NAMES.map((_, dayIndex) => {
                  const date = DateUtils.addDays(currentWeekStart, dayIndex);
                  const weekKey = DateUtils.getWeekKeyForDate(date);
                  const dayOfWeek = DateUtils.getDayOfWeek(date);
                  const completed = domino.completionStatus[weekKey]?.[dayOfWeek] || false;

                  return (
                    <View
                      key={dayIndex}
                      style={[
                        styles.progressDot,
                        completed && styles.progressDotCompleted,
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>{getMotivationalContent().title}</Text>
          <Text style={styles.motivationMessage}>{getMotivationalContent().message}</Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTop: {
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.textPrimary,
  },
  weekBadge: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  weekBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.textMuted,
  },
  performanceCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginVertical: 12,
    ...elevation.md,
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  percentageText: {
    fontFamily: fonts.bold,
    fontSize: 48,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  statLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  heatmapCardContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  heatmapCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    ...elevation.md,
  },
  heatmapTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  heatmapContainer: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '80%',
    minHeight: 20,
    borderRadius: 8,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  barScore: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.onAccent,
  },
  barLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  dayCard: {
    width: '13%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  todayCard: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    borderWidth: 1,
  },
  dayName: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 4,
  },
  todayText: {
    color: colors.onAccent,
  },
  dayDate: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dayScore: {
    marginBottom: 4,
  },
  scoreText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: colors.textMuted,
  },
  dotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceMuted,
    margin: 1,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  completedDot: {
    backgroundColor: colors.accent,
  },
  dominosList: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  dominosTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  dominoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.md,
  },
  dominoPipCap: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dominoTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  dominoProgress: {
    flexDirection: 'row',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceMuted,
    marginLeft: 4,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  progressDotCompleted: {
    backgroundColor: colors.accent,
  },
  motivationCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 20,
    ...elevation.md,
  },
  motivationTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  motivationMessage: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.accent,
  },
  shareButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.onAccent,
  },
  spacer: {
    height: 40,
  },
});