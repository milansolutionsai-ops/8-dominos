import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { DateUtils } from '@/utils/dateUtils';

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
          <ChevronLeft size={24} color="#000000" strokeWidth={3} />
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
          <ChevronRight size={24} color="#000000" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {!isToday(currentDate) && (
        <TouchableOpacity style={styles.jumpButton} onPress={goToToday}>
          <Calendar size={18} color="#666666" strokeWidth={3} />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fffbea',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  navButton: {
    backgroundColor: '#fedd14',
    borderRadius: 16,
    padding: 14,
    minWidth: 52,
    minHeight: 52,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
    backgroundColor: '#fedd14',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
    letterSpacing: 0.3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  futureLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
    letterSpacing: 0.3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jumpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(254, 221, 20, 0.2)',
    borderWidth: 1,
    borderColor: '#fedd14',
    borderRadius: 12,
  },
  jumpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
});