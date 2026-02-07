import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { DominoTile } from '@/components/DominoTile';
import { DayNavigator } from '@/components/DayNavigator';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import DailyJournal from '@/components/DailyJournal';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';
import { useDominos } from '@/hooks/useDominos';
import { DateUtils } from '@/utils/dateUtils';
import { soundEffects } from '@/utils/soundEffects';
import MoodCheckIn from '@/components/MoodCheckIn';
import { StorageService } from '@/utils/storage';

export default function DailyScreen() {
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showConfetti, setShowConfetti] = useState(false);
  const { dominos, loading, toggleCompletion, refreshDominos } = useDominos();
  const previousScoreRef = useRef<number>(0);
  const [morningMood, setMorningMood] = useState<number | null>(null);
  const [eveningMood, setEveningMood] = useState<number | null>(null);

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
      // Only play standard "pop" if it's not the 8th (last) one.
      // The 8th one's celebration sound is handled in the useEffect below.
      if (currentScore < 7) {
        await soundEffects.playComplete();
      }
    } else {
      await soundEffects.playToggle();
    }

    await toggleCompletion(dominoId, weekKey, dayOfWeek, nextStatus);
  };

  const calculateDailyScore = () => {
    return dominos.reduce((score, domino) => {
      return score + (getDominoCompletion(domino) ? 1 : 0);
    }, 0);
  };

  const calculateWeeklyScore = () => {
    const weekKey = DateUtils.getWeekKeyForDate(currentDate);
    return dominos.reduce((score, domino) => {
      const weekCompletion = domino.completionStatus[weekKey];
      if (!weekCompletion) return score;

      return score + Object.values(weekCompletion).filter(Boolean).length;
    }, 0);
  };

  useEffect(() => {
    const dailyScore = calculateDailyScore();

    if (dailyScore === 8 && previousScoreRef.current < 8) {
      setShowConfetti(true);
      soundEffects.playPerfect();

      if (Platform.OS !== 'web') {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {
          // Haptics not available
        }
      }

      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    previousScoreRef.current = dailyScore;
  }, [dominos]);

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
  const weeklyScore = calculateWeeklyScore();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
      >
        <DayNavigator
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />

        <ScoreDisplay
          dailyScore={dailyScore}
          totalDaily={8}
          weeklyScore={weeklyScore}
          totalWeekly={56}
        />

        <DailyJournal currentDate={currentDate.toISOString().split('T')[0]} />

        <MoodCheckIn
          period="evening"
          savedMood={eveningMood}
          onSave={(mood) => handleSaveMood('evening', mood)}
        />

        {dominos.map((domino, index) => (
          <DominoTile
            key={domino.id}
            title={domino.title}
            activity={getCurrentDayActivity(domino)}
            completed={getDominoCompletion(domino)}
            onToggle={() => handleToggleCompletion(domino.id)}
            index={index}
          />
        ))}
      </ScrollView>

      <ConfettiCelebration
        trigger={showConfetti}
        onComplete={() => console.log('Confetti done')}
      />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});