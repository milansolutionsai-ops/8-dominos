import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, withSpring } from 'react-native-reanimated';

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
  if (percentage === 100) return '#10b981';
  if (percentage >= 75) return '#fedd14';
  if (percentage >= 50) return '#f59e0b';
  return '#ef4444';
}

function getMotivationalMessage(score: number): string {
  if (score === 8) return '🔥 Perfect Day! All dominos down!';
  if (score >= 6) return '💪 Great progress! Keep going!';
  if (score >= 4) return '⚡ Halfway there!';
  if (score >= 1) return '🎯 Good start! Stack those Ws!';
  return '👊 Start stacking your wins!';
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
              stroke="#fffbea"
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
                stroke="#fffbea"
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
    backgroundColor: '#fedd14',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreItem: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circularProgressContainer: {
    width: PROGRESS_SIZE,
    height: PROGRESS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  scoreTextWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  scoreTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    opacity: 0.6,
  },
  circleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  motivationalSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 16,
    marginTop: 16,
  },
  motivationalText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 24,
  },
});