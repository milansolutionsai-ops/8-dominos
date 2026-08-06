import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { motion } from '@/constants/theme';
import { ChevronLeft, ChevronRight, Flame, Calendar } from 'lucide-react-native';
import { DateUtils } from '@/utils/dateUtils';
import { dailyMessage } from '@/utils/motivation';
import { colors, fonts, radius, spacing } from '@/constants/theme';

const RING = 60;
const STROKE = 7;
const R = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

function scoreColor(pct: number): string {
  if (pct >= 100) return colors.scoreFull;
  if (pct >= 75) return colors.scoreHigh;
  if (pct >= 50) return colors.scoreMid;
  return colors.scoreLow;
}

interface HudHeaderProps {
  currentDate: Date;
  onDateChange: (d: Date) => void;
  dailyScore: number;
  totalDaily: number;
  streak: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function HudHeader({ currentDate, onDateChange, dailyScore, totalDaily, streak }: HudHeaderProps) {
  const reduceMotion = useReducedMotion();
  const pct = totalDaily > 0 ? (dailyScore / totalDaily) * 100 : 0;
  const color = scoreColor(pct);
  const isToday = currentDate.toDateString() === new Date().toDateString();

  // The ring is the payoff for every tap on the board, and it used to snap.
  // motion.springDefault was documented as "ring settle" and had no consumer.
  const progress = useSharedValue(pct);
  useEffect(() => {
    progress.value = reduceMotion ? pct : withSpring(pct, motion.springDefault);
  }, [pct, reduceMotion]);

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRC - (progress.value / 100) * CIRC,
  }));

  return (
    <View style={styles.band}>
      {/* Day navigation strip */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => onDateChange(DateUtils.addDays(currentDate, -1))}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Previous day"
        >
          <ChevronLeft size={22} color={colors.textSecondary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.dateWrap}>
          {/* Shrinks rather than wrapping: the full date plus the pill overflows
              a 390pt header, which used to break TODAY across two lines. */}
          <Text style={styles.date} numberOfLines={1} maxFontSizeMultiplier={1.3}>
            {DateUtils.formatDate(currentDate)}
          </Text>
          {isToday && <Text style={styles.todayPill} maxFontSizeMultiplier={1.2}>TODAY</Text>}
        </View>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => onDateChange(DateUtils.addDays(currentDate, 1))}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Next day"
        >
          <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Stats row: ring · motivation · streak · share */}
      <View style={styles.statsRow}>
        <View style={styles.ringWrap}>
          <Svg width={RING} height={RING}>
            <Circle cx={RING / 2} cy={RING / 2} r={R} stroke={colors.surfaceMuted} strokeWidth={STROKE} fill="none" />
            <AnimatedCircle
              cx={RING / 2}
              cy={RING / 2}
              r={R}
              stroke={color}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRC}
              animatedProps={ringProps}
              strokeLinecap="round"
              rotation={-90}
              origin={`${RING / 2},${RING / 2}`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={[styles.ringNum, { color }]}>{dailyScore}</Text>
            <Text style={styles.ringTotal}>/{totalDaily}</Text>
          </View>
        </View>

        <Text style={styles.motivation} numberOfLines={2}>{dailyMessage(dailyScore, totalDaily)}</Text>

        <View style={styles.streakChip}>
          <Flame size={18} color={streak > 0 ? colors.warning : colors.textMuted} strokeWidth={2.5} />
          <Text style={[styles.streakNum, { color: streak > 0 ? colors.textPrimary : colors.textMuted }]}>{streak}</Text>
        </View>

      </View>

      {!isToday && (
        <TouchableOpacity
          style={styles.jump}
          onPress={() => onDateChange(new Date())}
          accessibilityRole="button"
          accessibilityLabel="Jump to today"
        >
          <Calendar size={14} color={colors.accentBright} strokeWidth={2.5} />
          <Text style={styles.jumpText}>Jump to Today</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  dateWrap: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  date: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  todayPill: {
    flexShrink: 0,
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.onAccent,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ringWrap: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ringNum: {
    fontFamily: fonts.bold,
    fontSize: 22,
    fontVariant: ['tabular-nums'],
  },
  ringTotal: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  motivation: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  streakNum: {
    fontFamily: fonts.bold,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
  jump: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    marginTop: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  jumpText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    // accent (#0062FF) is only 3.46:1 as text; accentBright clears AA.
    color: colors.accentBright,
  },
});
