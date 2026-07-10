import React, { useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolateColor,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radius, spacing, elevation, motion } from '@/constants/theme';

interface DominoTileProps {
  title: string;
  activity: string;
  completed: boolean;
  onToggle: () => void;
  index: number;
  /** True when the tile immediately before this one was just completed — drives the chain nudge. */
  bumped?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function DominoTile({ title, activity, completed, onToggle, index, bumped }: DominoTileProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(completed ? 1 : 0); // 0 = incomplete, 1 = complete
  const scale = useSharedValue(1);
  const nudge = useSharedValue(0);

  // Animate the fill + a spring pop whenever completion changes.
  useEffect(() => {
    progress.value = withTiming(completed ? 1 : 0, { duration: motion.durationBase });
    if (reduceMotion) return;
    if (completed) {
      scale.value = withSequence(
        withTiming(0.97, { duration: 80 }),
        withSpring(1, motion.springBouncy)
      );
    } else {
      scale.value = withTiming(1, { duration: motion.durationFast });
    }
  }, [completed]);

  // Chain reaction: when the previous tile completes, this one topples slightly.
  useEffect(() => {
    if (bumped && !reduceMotion) {
      nudge.value = withSequence(
        withTiming(-4, { duration: 90 }),
        withSpring(0, motion.springBouncy)
      );
    }
  }, [bumped]);

  const animatedTileStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surface, colors.accent]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.border, colors.accent]),
    transform: [{ scale: scale.value }, { translateY: nudge.value }],
  }));

  const handleToggle = async () => {
    try {
      if (Platform.OS !== 'web') {
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

  const contentColor = completed ? colors.onAccent : colors.textPrimary;

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(360).delay(index * 55)}
      style={styles.container}
    >
      <AnimatedTouchable
        style={[styles.tile, animatedTileStyle, completed ? elevation.accentGlow : elevation.sm]}
        onPress={handleToggle}
        activeOpacity={0.85}
      >
        <Animated.View style={styles.header}>
          <Text style={[styles.pillarLabel, { color: contentColor, opacity: completed ? 0.85 : 0.55 }]}>
            {title}
          </Text>
          {completed && (
            <Animated.View style={styles.checkIcon}>
              <Check size={18} color={colors.onAccent} strokeWidth={3} />
            </Animated.View>
          )}
        </Animated.View>

        <Text
          style={[styles.activityText, { color: contentColor, opacity: completed ? 1 : 0.9 }]}
          numberOfLines={2}
        >
          {activity || 'No activity set'}
        </Text>
      </AnimatedTouchable>
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
