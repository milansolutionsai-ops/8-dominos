import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radius, spacing, elevation } from '@/constants/theme';

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

  // Text/icon color adapts to the tile surface: light on the dark incomplete
  // surface, on-accent on the blue completed fill.
  const contentColor = completed ? colors.onAccent : colors.textPrimary;

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
            backgroundColor: completed ? colors.accent : colors.surface,
            borderColor: completed ? colors.accent : colors.border,
          },
          completed ? elevation.accentGlow : elevation.sm,
        ]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        {/* Header: Pillar Name + Checkmark */}
        <View style={styles.header}>
          <Text style={[styles.pillarLabel, { color: contentColor, opacity: completed ? 0.85 : 0.55 }]}>
            {title}
          </Text>
          {completed && (
            <View style={styles.checkIcon}>
              <Check size={18} color={colors.onAccent} strokeWidth={3} />
            </View>
          )}
        </View>

        {/* Activity: Primary text */}
        <Text
          style={[
            styles.activityText,
            {
              color: contentColor,
              opacity: completed ? 1 : 0.9,
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
    marginHorizontal: spacing.lg,
    marginVertical: 6,
  },
  tile: {
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: 18,
    borderWidth: 1,
    minHeight: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pillarLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  checkIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 10,
    padding: 3,
  },
  activityText: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    lineHeight: 24,
  },
});
