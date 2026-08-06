import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Share2 } from 'lucide-react-native';
import { DominoBoard } from '@/components/DominoBoard';
import { HudHeader } from '@/components/HudHeader';
import { ShareDayData } from '@/components/ShareDayCard';
import { SharePreviewSheet, ShareCardPayload } from '@/components/share/SharePreviewSheet';
import DailyJournal from '@/components/DailyJournal';
import { PerfectDayCelebration } from '@/components/PerfectDayCelebration';
import { useDominos } from '@/hooks/useDominos';
import { useShareNudges } from '@/hooks/useShareNudges';
import { DateUtils } from '@/utils/dateUtils';
import { soundEffects } from '@/utils/soundEffects';
import MoodCheckIn from '@/components/MoodCheckIn';
import { StorageService } from '@/utils/storage';
import { StatsService } from '@/utils/stats';
import { colors, type, spacing, radius } from '@/constants/theme';

/**
 * One overlay at a time. iOS silently drops a Modal presented while another is
 * dismissing, so going celebration -> preview needs an explicit gap.
 */
type Overlay =
  | { kind: 'none' }
  | { kind: 'celebration' }
  | { kind: 'preview'; payload: ShareCardPayload };

const MODAL_HANDOFF_MS = 350;

export default function DailyScreen() {
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [overlay, setOverlay] = useState<Overlay>({ kind: 'none' });
  const { dominos, loading, toggleCompletion, refreshDominos } = useDominos();
  const { ready: nudgesReady, dayAlreadyResolved, resolveDay } = useShareNudges();
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

  const isToday = currentDate.toDateString() === new Date().toDateString();

  useEffect(() => {
    if (!nudgesReady) return;
    const dailyScore = calculateDailyScore();
    const target = dominos.length || 8;

    // Only celebrate today, only once per calendar day. Without the persisted
    // guard a cold start on an already-perfect day re-fired the whole thing,
    // because previousScoreRef starts at 0.
    if (
      dailyScore === target &&
      previousScoreRef.current < target &&
      isToday &&
      !dayAlreadyResolved()
    ) {
      // Haptics for this moment are owned by PerfectDayCelebration (Success +
      // a delayed Heavy) so the beats stay in sync with the animation.
      setOverlay({ kind: 'celebration' });
      soundEffects.playPerfect();
    }

    previousScoreRef.current = dailyScore;
  }, [dominos, nudgesReady, isToday, dayAlreadyResolved]);

  const buildDayPayload = useCallback((): ShareCardPayload => {
    const data: ShareDayData = {
      dateLabel: DateUtils.formatDate(currentDate),
      score: calculateDailyScore(),
      total: dominos.length || 8,
      streak: StatsService.calculateStats(dominos).currentStreak,
      pillars: dominos.map((domino) => ({
        title: domino.title,
        activity: getCurrentDayActivity(domino),
        completed: getDominoCompletion(domino),
      })),
    };
    return { kind: 'day', data };
  }, [currentDate, dominos]);

  const shareFromCelebration = () => {
    resolveDay();
    setOverlay({ kind: 'none' });
    setTimeout(() => setOverlay({ kind: 'preview', payload: buildDayPayload() }), MODAL_HANDOFF_MS);
  };

  const dismissCelebration = () => {
    resolveDay();
    setOverlay({ kind: 'none' });
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
          totalDaily={dominos.length || 8}
          streak={streak}
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

        {/* Replaces the unlabelled 38x38 icon that used to sit in the HUD
            firing an irreversible action. Quiet, labelled, and only offered
            once there is something worth showing. */}
        {dailyScore > 0 && currentDate <= new Date() && (
          <Pressable
            style={({ pressed }) => [styles.ghostShare, pressed && styles.pressed]}
            onPress={() => setOverlay({ kind: 'preview', payload: buildDayPayload() })}
            accessibilityRole="button"
            accessibilityLabel="Share this day"
          >
            <Share2 size={16} color={colors.textMuted} strokeWidth={2.5} />
            <Text style={styles.ghostShareText}>Share this day</Text>
          </Pressable>
        )}

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
        visible={overlay.kind === 'celebration'}
        streak={streak}
        onShare={shareFromCelebration}
        onDismiss={dismissCelebration}
      />

      <SharePreviewSheet
        payload={overlay.kind === 'preview' ? overlay.payload : null}
        onClose={() => setOverlay({ kind: 'none' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    // The share sheet's capture host is positioned at left:-10000; without this
    // it extends the page bounds on web and the layout crops oddly.
    overflow: 'hidden',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostShare: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostShareText: {
    ...type.bodySmStrong,
    color: colors.textSecondary,
  },
  pressed: { opacity: 0.85 },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionLabel: {
    ...type.label,
    letterSpacing: 1,
    color: colors.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
  },
});
