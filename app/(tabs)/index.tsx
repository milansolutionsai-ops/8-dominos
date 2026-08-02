import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { shareCard } from '@/utils/shareCard';
import { DominoBoard } from '@/components/DominoBoard';
import { HudHeader } from '@/components/HudHeader';
import { ShareDayCard } from '@/components/ShareDayCard';
import DailyJournal from '@/components/DailyJournal';
import { PerfectDayCelebration } from '@/components/PerfectDayCelebration';
import { useDominos } from '@/hooks/useDominos';
import { DateUtils } from '@/utils/dateUtils';
import { soundEffects } from '@/utils/soundEffects';
import MoodCheckIn from '@/components/MoodCheckIn';
import { StorageService } from '@/utils/storage';
import { StatsService } from '@/utils/stats';
import { colors, fonts, spacing } from '@/constants/theme';

export default function DailyScreen() {
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showConfetti, setShowConfetti] = useState(false);
  const { dominos, loading, toggleCompletion, refreshDominos } = useDominos();
  const previousScoreRef = useRef<number>(0);
  const [morningMood, setMorningMood] = useState<number | null>(null);
  const [eveningMood, setEveningMood] = useState<number | null>(null);
  const [justCompletedIndex, setJustCompletedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadMoods();
  }, [currentDate]);

  const loadMoods = async () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const morning = await StorageService.getMood(dateStr, 'morning');
    const evening = await StorageService.getMood(dateStr, 'evening');
    setMorningMood(morning);
    setEveningMood(evening);
  };

  const handleSaveMood = async (period: 'morning' | 'evening', mood: number) => {
    const dateStr = currentDate.toISOString().split('T')[0];
    await StorageService.saveMood(dateStr, period, mood);
    if (period === 'morning') setMorningMood(mood);
    else setEveningMood(mood);
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshDominos();
    }, [])
  );

  const getCurrentDayActivity = (domino: any) => {
    const dayOfWeek = DateUtils.getDayOfWeek(currentDate);
    return domino.activities[dayOfWeek] || '';
  };

  const getDominoCompletion = (domino: any) => {
    const weekKey = DateUtils.getWeekKeyForDate(currentDate);
    const dayOfWeek = DateUtils.getDayOfWeek(currentDate);
    return domino.completionStatus[weekKey]?.[dayOfWeek] || false;
  };

  const handleToggleCompletion = async (dominoId: string) => {
    const weekKey = DateUtils.getWeekKeyForDate(currentDate);
    const dayOfWeek = DateUtils.getDayOfWeek(currentDate);
    const domino = dominos.find(d => d.id === dominoId);
    const currentStatus = getDominoCompletion(domino);
    const nextStatus = !currentStatus;

    if (nextStatus) {
      const currentScore = calculateDailyScore();
      if (currentScore < 7) {
        await soundEffects.playComplete();
      }
      // Trigger the chain reaction: the next tile topples.
      const idx = dominos.findIndex(d => d.id === dominoId);
      setJustCompletedIndex(idx);
      setTimeout(() => setJustCompletedIndex(null), 400);
    } else {
      await soundEffects.playUncomplete();
    }

    await toggleCompletion(dominoId, weekKey, dayOfWeek, nextStatus);
  };

  const calculateDailyScore = () => {
    return dominos.reduce((score, domino) => {
      return score + (getDominoCompletion(domino) ? 1 : 0);
    }, 0);
  };

  useEffect(() => {
    const dailyScore = calculateDailyScore();

    if (dailyScore === 8 && previousScoreRef.current < 8) {
      // Haptics for this moment are owned by PerfectDayCelebration (Success +
      // a delayed Heavy) so the beats stay in sync with the animation.
      setShowConfetti(true);
      soundEffects.playPerfect();

      // Update the ref BEFORE the early return, otherwise it keeps its pre-8
      // value and the celebration re-fires on the next re-render at 8/8.
      previousScoreRef.current = dailyScore;

      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3400);

      return () => clearTimeout(timer);
    }

    previousScoreRef.current = dailyScore;
  }, [dominos]);

  const shareDayRef = useRef<View>(null);

  const handleShareDay = () => shareCard(shareDayRef, '8dominos-my-day.png');

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loading}>
          {/* Loading placeholder */}
        </View>
      </View>
    );
  }

  const dailyScore = calculateDailyScore();
  const streak = StatsService.calculateStats(dominos).currentStreak;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
      >
        <HudHeader
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          dailyScore={dailyScore}
          totalDaily={8}
          streak={streak}
          onShare={handleShareDay}
        />

        {/* Game board leads: the 8 dominoes as a chain */}
        <DominoBoard
          items={dominos.map((domino) => ({
            id: domino.id,
            title: domino.title,
            activity: getCurrentDayActivity(domino),
            completed: getDominoCompletion(domino),
          }))}
          onToggle={handleToggleCompletion}
          justCompletedIndex={justCompletedIndex}
        />

        {/* Secondary: reflection + mood, below the board */}
        <Text style={styles.sectionLabel}>REFLECTION</Text>

        <MoodCheckIn
          period="morning"
          savedMood={morningMood}
          onSave={(mood) => handleSaveMood('morning', mood)}
        />

        <MoodCheckIn
          period="evening"
          savedMood={eveningMood}
          onSave={(mood) => handleSaveMood('evening', mood)}
        />

        <DailyJournal currentDate={currentDate.toISOString().split('T')[0]} />
      </ScrollView>

      <PerfectDayCelebration
        trigger={showConfetti}
        streak={streak}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Off-screen capture target for "Share my day" — laid out but never seen. */}
      <View style={styles.captureHost} pointerEvents="none">
        <ShareDayCard
          ref={shareDayRef}
          data={{
            dateLabel: DateUtils.formatDate(currentDate),
            score: dailyScore,
            total: 8,
            streak,
            pillars: dominos.map((domino) => ({
              title: domino.title,
              completed: getDominoCompletion(domino),
            })),
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    // Clips the off-screen capture host below; without this it extends the
    // page bounds on web and the layout scrolls/crops oddly.
    overflow: 'hidden',
  },
  captureHost: {
    position: 'absolute',
    left: -10000,
    top: 0,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
  },
});
