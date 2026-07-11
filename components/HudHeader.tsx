import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Flame, Share2, Calendar } from 'lucide-react-native';
import { DateUtils } from '@/utils/dateUtils';
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

function motivation(score: number): string {
  if (score >= 8) return 'Perfect day. All dominos down.';
  if (score >= 6) return 'Strong momentum. Keep going.';
  if (score >= 4) return 'Halfway there.';
  if (score >= 1) return 'Good start. Stack your wins.';
  return 'Tap a domino to start the chain.';
}

interface HudHeaderProps {
  currentDate: Date;
  onDateChange: (d: Date) => void;
  dailyScore: number;
  totalDaily: number;
  streak: number;
}

export function HudHeader({ currentDate, onDateChange, dailyScore, totalDaily, streak }: HudHeaderProps) {
  const router = useRouter();
  const pct = totalDaily > 0 ? (dailyScore / totalDaily) * 100 : 0;
  const color = scoreColor(pct);
  const offset = CIRC - (pct / 100) * CIRC;
  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <View style={styles.band}>
      {/* Day navigation strip */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={() => onDateChange(DateUtils.addDays(currentDate, -1))} hitSlop={8}>
          <ChevronLeft size={22} color={colors.textSecondary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.dateWrap}>
          <Text style={styles.date}>{DateUtils.formatDate(currentDate)}</Text>
          {isToday && <Text style={styles.todayPill}>TODAY</Text>}
        </View>
        <TouchableOpacity style={styles.navBtn} onPress={() => onDateChange(DateUtils.addDays(currentDate, 1))} hitSlop={8}>
          <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Stats row: ring · motivation · streak · share */}
      <View style={styles.statsRow}>
        <View style={styles.ringWrap}>
          <Svg width={RING} height={RING}>
            <Circle cx={RING / 2} cy={RING / 2} r={R} stroke={colors.surfaceMuted} strokeWidth={STROKE} fill="none" />
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={R}
              stroke={color}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
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

        <Text style={styles.motivation} numberOfLines={2}>{motivation(dailyScore)}</Text>

        <View style={styles.streakChip}>
          <Flame size={18} color={streak > 0 ? colors.warning : colors.textMuted} strokeWidth={2.5} />
          <Text style={[styles.streakNum, { color: streak > 0 ? colors.textPrimary : colors.textMuted }]}>{streak}</Text>
        </View>

        {Platform.OS !== 'web' && (
          <TouchableOpacity style={styles.shareBtn} onPress={() => router.navigate('/weekly')} hitSlop={8}>
            <Share2 size={18} color={colors.onAccent} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>

      {!isToday && (
        <TouchableOpacity style={styles.jump} onPress={() => onDateChange(new Date())}>
          <Calendar size={14} color={colors.accent} strokeWidth={2.5} />
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
  },
  todayPill: {
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
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  jump: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: 8,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  jumpText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.accent,
  },
});
