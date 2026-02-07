import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Save, RotateCcw, Settings, Calendar } from 'lucide-react-native';
import { Domino, DayOfWeek, DAYS_OF_WEEK, DAY_NAMES } from '@/types/domino';

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
          <Settings size={20} color="#000000" />
          <Text style={styles.headerTitle}>Edit Your Dominos</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Save size={14} color="#000000" />
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
                <Text style={styles.dominoNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.dominoTitle}>{domino.title}</Text>
            </View>

            <TextInput
              style={styles.activityInput}
              placeholder={`Enter ${domino.title.toLowerCase()} activity for ${DAY_NAMES[DAYS_OF_WEEK.indexOf(selectedDay)]}`}
              value={domino.activities[selectedDay]}
              onChangeText={(text: string) => updateDominoActivity(domino.id, selectedDay, text)}
              multiline
              numberOfLines={2}
              placeholderTextColor="#999"
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
    backgroundColor: '#fffbea',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fedd14',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffbea',
    borderRadius: 8,
    padding: 8,
    width: 40,
    height: 40,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: '#000000',
  },
  saveButton: {
    backgroundColor: '#10b981', // Green for save
  },
  saveButtonDisabled: {
    backgroundColor: '#e5e7eb',
    borderColor: '#9ca3af',
  },
  dayTabs: {
    backgroundColor: '#fffbea',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingVertical: 12,
  },
  tabsScrollView: {
    flexGrow: 0,
  },
  tabsContainer: {
    paddingHorizontal: 16,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  activeDayTab: {
    backgroundColor: '#fedd14',
  },
  dayTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
  },
  activeDayTabText: {
    color: '#000000',
  },
  formContainer: {
    flex: 1,
    paddingTop: 16,
  },
  dominoForm: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 3,
  },
  dominoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dominoNumber: {
    backgroundColor: '#fedd14',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  dominoNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
  dominoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  activityInput: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    backgroundColor: '#f9fafb',
    minHeight: 60,
    textAlignVertical: 'top',
  },
});