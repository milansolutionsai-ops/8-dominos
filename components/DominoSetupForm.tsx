import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Save, Settings } from 'lucide-react-native';
import { Domino, DayOfWeek, DAYS_OF_WEEK, DAY_NAMES, FULL_DAY_NAMES, PILLAR_HINTS } from '@/types/domino';
import { DominoPips } from './DominoPips';
import { colors, fonts, radius, spacing, elevation } from '@/constants/theme';
import { ACTIVITY_MAX_CHARS } from '@/constants/shareCard';

/**
 * "What can you do to invest in your BODY (Physically) on Tuesday?"
 * Falls back gracefully if a pillar title isn't in the hint map.
 */
function activityPrompt(title: string, day: DayOfWeek): string {
  const fullDay = FULL_DAY_NAMES[DAYS_OF_WEEK.indexOf(day)];
  const hint = PILLAR_HINTS[title.toLowerCase()];
  const pillar = hint ? `${title.toUpperCase()} (${hint})` : title.toUpperCase();
  return `What can you do to invest in your ${pillar} on ${fullDay}?`;
}

interface DominoSetupFormProps {
  dominos: Domino[];
  onSave: (dominos: Domino[]) => void;
  onReset: () => void;
  onResetWeek?: () => void;
  liveUpdate?: boolean;
}

export function DominoSetupForm({ dominos, onSave, onReset, onResetWeek, liveUpdate = false }: DominoSetupFormProps) {
  const [editedDominos, setEditedDominos] = useState<Domino[]>(dominos);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [hasChanges, setHasChanges] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const updateDominoActivity = (dominoId: string, day: DayOfWeek, activity: string) => {
    const updated = editedDominos.map(domino =>
      domino.id === dominoId
        ? { ...domino, activities: { ...domino.activities, [day]: activity } }
        : domino
    );
    setEditedDominos(updated);
    setHasChanges(true);

    if (liveUpdate) {
      onSave(updated);
    }
  };

  const handleSave = () => {
    onSave(editedDominos);
    setHasChanges(false);
    Alert.alert('Success', 'Your domino activities have been saved!');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Activities',
      'Are you sure you want to reset all domino activities? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            onReset();
            setHasChanges(false);
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Settings size={20} color={colors.onAccent} />
          <Text style={styles.headerTitle}>Edit Your Dominos</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Save activities"
            accessibilityState={{ disabled: !hasChanges }}
          >
            <Save size={14} color={colors.onAccent} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dayTabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScrollView}
        >
          {DAYS_OF_WEEK.map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayTab,
                selectedDay === day && styles.activeDayTab,
              ]}
              onPress={() => setSelectedDay(day)}
              accessibilityRole="tab"
              accessibilityLabel={FULL_DAY_NAMES[index]}
              accessibilityState={{ selected: selectedDay === day }}
            >
              <Text style={[
                styles.dayTabText,
                selectedDay === day && styles.activeDayTabText,
              ]}>
                {DAY_NAMES[index]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {editedDominos.map((domino, index) => (
          <View key={domino.id} style={styles.dominoForm}>
            <View style={styles.dominoHeader}>
              <View style={styles.dominoNumber}>
                <DominoPips count={index + 1} color={colors.onAccent} size={13} />
              </View>
              <Text style={styles.dominoTitle}>{domino.title}</Text>
            </View>

            <TextInput
              style={[styles.activityInput, focusedId === domino.id && styles.activityInputFocused]}
              placeholder={activityPrompt(domino.title, selectedDay)}
              value={domino.activities[selectedDay]}
              onChangeText={(text: string) => updateDominoActivity(domino.id, selectedDay, text)}
              onFocus={() => setFocusedId(domino.id)}
              onBlur={() => setFocusedId(null)}
              multiline
              numberOfLines={2}
              maxLength={ACTIVITY_MAX_CHARS}
              placeholderTextColor={colors.textMuted}
              accessibilityLabel={`${domino.title} activity for ${FULL_DAY_NAMES[DAYS_OF_WEEK.indexOf(selectedDay)]}`}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.accent,
    borderBottomWidth: 1,
    borderBottomColor: colors.accentPressed,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.onAccent,
    marginLeft: spacing.sm,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm,
    width: 40,
    height: 40,
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  saveButtonDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  dayTabs: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  tabsScrollView: {
    flexGrow: 0,
  },
  tabsContainer: {
    paddingHorizontal: spacing.lg,
  },
  dayTab: {
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeDayTab: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayTabText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textMuted,
  },
  activeDayTabText: {
    color: colors.onAccent,
  },
  formContainer: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  dominoForm: {
    backgroundColor: colors.surfaceMuted,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.sm,
  },
  dominoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dominoNumber: {
    backgroundColor: colors.accent,
    borderRadius: 4,
    // Domino-proportioned, and tall enough for the pip face, which renders
    // `size * 2 + 1`.
    width: 18,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  dominoNumberText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.onAccent,
  },
  dominoTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  activityInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    backgroundColor: colors.bg,
    minHeight: 84,
    textAlignVertical: 'top',
  },
  activityInputFocused: {
    borderWidth: 2,
    borderColor: colors.accentBright,
    backgroundColor: colors.accentSoft,
  },
});
