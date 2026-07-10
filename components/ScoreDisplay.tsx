import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, withSpring } from 'react-native-reanimated';
import { colors, fonts, radius, spacing, elevation } from '@/constants/theme';

interface ScoreDisplayProps {
  dailyScore: number;
  totalDaily: number;
  weeklyScore: number;
  totalWeekly: number;
  showWeekly?: boolean;
}

const PROGRESS_SIZE = 100;
const PROGRESS_STROKE_WIDTH = 10;
const PROGRESS_CENTER = PROGRESS_SIZE / 2;
const PROGRESS_RADIUS = (PROGRESS_SIZE - PROGRESS_STROKE_WIDTH) / 2;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

function getScoreColor(percentage: number): string {
  if (percentage === 100) return colors.scoreFull;
  if (percentage >= 75) return colors.scoreHigh;
  if (percentage >= 50) return colors.scoreMid;
  return colors.scoreLow;
}

function getMotivationalMessage(score: number): string {
  if (score === 8) return 'Perfect day. All dominos down.';
  if (score >= 6) return 'Great progress. Keep going.';
  if (score >= 4) return 'Halfway there.';
  if (score >= 1) return 'Good start. Stack those wins.';
  return 'Start stacking your wins.';
}

export function ScoreDisplay({
  dailyScore,
  totalDaily,
  weeklyScore,
  totalWeekly,
  showWeekly = false
}: ScoreDisplayProps) {
  const dailyPercentage = (dailyScore / totalDaily) * 100;
  const weeklyPercentage = showWeekly ? (weeklyScore / totalWeekly) * 100 : 0;
  const dailyDashOffset = PROGRESS_CIRCUMFERENCE - (dailyPercentage / 100) * PROGRESS_CIRCUMFERENCE;
  const weeklyDashOffset = PROGRESS_CIRCUMFERENCE - (weeklyPercentage / 100) * PROGRESS_CIRCUMFERENCE;
  const dailyColor = getScoreColor(dailyPercentage);
  const weeklyColor = getScoreColor(weeklyPercentage);

  const scaleAnim = useSharedValue(1);
  const prevScoreRef = useRef(dailyScore);

  useEffect(() => {
    if (dailyScore !== prevScoreRef.current) {
      scaleAnim.value = withTiming(1.15, { duration: 150 }, () => {
        scaleAnim.value = withSpring(1, { damping: 10, mass: 1, stiffness: 100 });
      });
      prevScoreRef.current = dailyScore;
    }
  }, [dailyScore, scaleAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.scoreItem}>
        <View style={styles.circularProgressContainer}>
          <Svg width={PROGRESS_SIZE} height={PROGRESS_SIZE}>
            <Circle
              cx={PROGRESS_CENTER}
              cy={PROGRESS_CENTER}
              r={PROGRESS_RADIUS}
              stroke={colors.border}
              strokeWidth={PROGRESS_STROKE_WIDTH}
              fill="none"
            />
            <Circle
              cx={PROGRESS_CENTER}
              cy={PROGRESS_CENTER}
              r={PROGRESS_RADIUS}
              stroke={dailyColor}
              strokeWidth={PROGRESS_STROKE_WIDTH}
              fill="none"
              strokeDasharray={PROGRESS_CIRCUMFERENCE}
              strokeDashoffset={dailyDashOffset}
              strokeLinecap="round"
              rotation={-90}
              origin={`${PROGRESS_CENTER},${PROGRESS_CENTER}`}
            />
          </Svg>
          <Animated.View style={[styles.scoreTextWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={[styles.scoreNumber, { color: dailyColor }]}>
              {dailyScore}
            </Text>
            <Text style={styles.scoreTotal}>/{totalDaily}</Text>
          </Animated.View>
        </View>
        <Text style={styles.circleLabel}>Today</Text>
      </View>

      {showWeekly && (
        <View style={styles.scoreItem}>
          <View style={styles.circularProgressContainer}>
            <Svg width={PROGRESS_SIZE} height={PROGRESS_SIZE}>
              <Circle
                cx={PROGRESS_CENTER}
                cy={PROGRESS_CENTER}
                r={PROGRESS_RADIUS}
                stroke={colors.border}
                strokeWidth={PROGRESS_STROKE_WIDTH}
                fill="none"
              />
              <Circle
                cx={PROGRESS_CENTER}
                cy={PROGRESS_CENTER}
                r={PROGRESS_RADIUS}
                stroke={weeklyColor}
                strokeWidth={PROGRESS_STROKE_WIDTH}
                fill="none"
                strokeDasharray={PROGRESS_CIRCUMFERENCE}
                strokeDashoffset={weeklyDashOffset}
                strokeLinecap="round"
                rotation={-90}
                origin={`${PROGRESS_CENTER},${PROGRESS_CENTER}`}
              />
            </Svg>
            <View style={styles.scoreTextWrapper}>
              <Text style={[styles.scoreNumber, { color: weeklyColor }]}>
                {weeklyScore}
              </Text>
              <Text style={styles.scoreTotal}>/{totalWeekly}</Text>
            </View>
          </View>
          <Text style={styles.circleLabel}>This Week</Text>
        </View>
      )}

      <View style={styles.motivationalSection}>
        <Text style={styles.motivationalText}>
          {getMotivationalMessage(dailyScore)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.md,
  },
  scoreItem: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  circularProgressContainer: {
    width: PROGRESS_SIZE,
    height: PROGRESS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  scoreTextWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  scoreTotal: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.textMuted,
  },
  circleLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  motivationalSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
    marginTop: spacing.lg,
  },
  motivationalText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
