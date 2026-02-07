import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { TrendingUp, Minus, TrendingDown } from 'lucide-react-native';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { useDominos } from '@/hooks/useDominos';
import { DateUtils } from '@/utils/dateUtils';
import { DAY_NAMES, Domino, DayOfWeek } from '@/types/domino';
import MoodTrendChart from '@/components/MoodTrendChart';
import { StorageService } from '@/utils/storage';

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
      return <TrendingUp size={32} color="#10b981" strokeWidth={3} />;
    } else if (weeklyPercentage >= 50) {
      return <Minus size={32} color="#f59e0b" strokeWidth={3} />;
    } else {
      return <TrendingDown size={32} color="#ef4444" strokeWidth={3} />;
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
    if (percentage === 100) return '#10b981';
    if (percentage >= 75) return '#fedd14';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
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
              <Text style={styles.dominoNumber}>{index + 1}</Text>
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
    backgroundColor: '#fffbea',
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
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
  },
  weekBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  weekBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  performanceCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 20,
    marginVertical: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#000000',
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
    backgroundColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  heatmapCardContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  heatmapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  heatmapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
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
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  barScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
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
    backgroundColor: '#fffbea',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#000000',
  },
  todayCard: {
    backgroundColor: '#fedd14',
    borderColor: '#000000',
    borderWidth: 1,
  },
  dayName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  todayText: {
    color: '#000000',
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  dayScore: {
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
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
    backgroundColor: '#fffbea',
    margin: 1,
    borderWidth: 0.5,
    borderColor: '#000000',
  },
  completedDot: {
    backgroundColor: '#000000',
  },
  dominosList: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  dominosTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  dominoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  dominoNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    backgroundColor: '#fedd14',
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  dominoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  dominoProgress: {
    flexDirection: 'row',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fffbea',
    marginLeft: 4,
    borderWidth: 0.5,
    borderColor: '#000000',
  },
  progressDotCompleted: {
    backgroundColor: '#fedd14',
  },
  motivationCard: {
    backgroundColor: '#fedd14',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  motivationMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
  },
  spacer: {
    height: 40,
  },
});