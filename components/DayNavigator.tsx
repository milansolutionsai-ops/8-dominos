import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { DateUtils } from '@/utils/dateUtils';
import { colors, fonts, radius, spacing, elevation } from '@/constants/theme';

interface DayNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function DayNavigator({ currentDate, onDateChange }: DayNavigatorProps) {
  const goToPreviousDay = () => {
    onDateChange(DateUtils.addDays(currentDate, -1));
  };

  const goToNextDay = () => {
    onDateChange(DateUtils.addDays(currentDate, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFuture = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.navButton} onPress={goToPreviousDay}>
          <ChevronLeft size={24} color={colors.textPrimary} strokeWidth={3} />
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {DateUtils.formatDate(currentDate)}
          </Text>
          <View style={styles.badgeContainer}>
            {isToday(currentDate) && (
              <Text style={styles.todayLabel}>Today</Text>
            )}
            {isFuture(currentDate) && (
              <Text style={styles.futureLabel}>Future</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.navButton} onPress={goToNextDay}>
          <ChevronRight size={24} color={colors.textPrimary} strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {!isToday(currentDate) && (
        <TouchableOpacity style={styles.jumpButton} onPress={goToToday}>
          <Calendar size={18} color={colors.accent} strokeWidth={3} />
          <Text style={styles.jumpButtonText}>Jump to Today</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    minWidth: 52,
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.sm,
  },
  dateContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  todayLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.onAccent,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    letterSpacing: 0.3,
  },
  futureLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    letterSpacing: 0.3,
  },
  jumpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
  },
  jumpButtonText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.accent,
  },
});
