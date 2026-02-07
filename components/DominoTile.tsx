import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import { soundEffects } from '@/utils/soundEffects';
import * as Haptics from 'expo-haptics';

interface DominoTileProps {
  title: string;
  activity: string;
  completed: boolean;
  onToggle: () => void;
  index: number;
}

export function DominoTile({ title, activity, completed, onToggle, index }: DominoTileProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleToggle = async () => {
    try {
      if (Platform.OS !== 'web') {
        // Differentiated haptics: Success pulse for ON, light tap for OFF
        if (!completed) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      console.error('Error with haptics:', error);
    }

    onToggle();
  };

  useEffect(() => {
    if (completed) {
      // Subtle "pop" animation: scale down slightly, then spring back
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.97,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset smoothly
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [completed]);

  // Softer yellow for better text contrast
  const completedBgColor = '#f5d80a'; // Muted/warm yellow
  const incompleteBgColor = '#fffbea';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.tile,
          {
            backgroundColor: completed ? completedBgColor : incompleteBgColor,
            shadowColor: completed ? '#d4a800' : '#000000',
            shadowOpacity: completed ? 0.25 : 0.12,
          },
        ]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        {/* Header: Pillar Name + Checkmark */}
        <View style={styles.header}>
          <Text style={styles.pillarLabel}>{title}</Text>
          {completed && (
            <View style={styles.checkIcon}>
              <Check size={18} color="#000000" strokeWidth={3} />
            </View>
          )}
        </View>

        {/* Activity: Primary text */}
        <Text
          style={[
            styles.activityText,
            {
              color: '#000000',
              opacity: completed ? 1 : 0.85,
            },
          ]}
          numberOfLines={2}
        >
          {activity || 'No activity set'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  tile: {
    backgroundColor: '#fffbea',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#000000',
    minHeight: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pillarLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#000000',
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  checkIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 3,
  },
  activityText: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    color: '#000000',
  },
});