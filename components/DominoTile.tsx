import React, { useEffect } from 'react';
import { Text, Pressable, StyleSheet, Platform, View } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, gradients, fonts, radius, spacing, elevation, motion } from '@/constants/theme';

interface DominoTileProps {
  title: string;
  activity: string;
  completed: boolean;
  onToggle: () => void;
  index: number;
  /** True when the tile immediately before this one was just completed — drives the chain nudge. */
  bumped?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DominoTile({ title, activity, completed, onToggle, index, bumped }: DominoTileProps) {
  const reduceMotion = useReducedMotion();
  const hasActivity = !!activity;

  const fill = useSharedValue(completed ? 1 : 0); // 0 = incomplete, 1 = complete
  const scale = useSharedValue(1);
  const press = useSharedValue(1);
  const nudge = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(completed ? 1 : 0, { duration: motion.durationBase });
    if (reduceMotion) return;
    if (completed) {
      scale.value = withSequence(withTiming(0.96, { duration: 90 }), withSpring(1, motion.springBouncy));
    } else {
      scale.value = withTiming(1, { duration: motion.durationFast });
    }
  }, [completed]);

  // Chain reaction: when the previous tile completes, this one topples slightly.
  useEffect(() => {
    if (bumped && !reduceMotion) {
      nudge.value = withSequence(withTiming(-4, { duration: 90 }), withSpring(0, motion.springChain));
    }
  }, [bumped]);

  const tileStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(fill.value, [0, 1], [colors.border, colors.accentBright]),
    transform: [{ scale: scale.value * press.value }, { translateY: nudge.value }],
  }));

  const gradientStyle = useAnimatedStyle(() => ({ opacity: fill.value }));

  const handlePressIn = () => {
    if (!reduceMotion) press.value = withTiming(0.97, { duration: 80 });
  };
  const handlePressOut = () => {
    press.value = withSpring(1, motion.springSnappy);
  };

  const handlePress = async () => {
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

  // Empty pillar (no activity set): non-interactive disabled treatment.
  if (!hasActivity) {
    return (
      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.duration(360).delay(index * 55)}
        style={styles.container}
      >
        <View style={[styles.tile, styles.tileEmpty]}>
          <Text style={[styles.pillarLabel, { color: colors.textMuted, opacity: 0.55 }]}>{title}</Text>
          <Text style={styles.emptyText}>No activity set</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(360).delay(index * 55)}
      style={styles.container}
    >
      <AnimatedPressable
        style={[styles.tile, tileStyle, completed ? elevation.accentGlow : elevation.sm]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Blue gradient fill fades in on completion. */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.gradientWrap, gradientStyle]} pointerEvents="none">
          <LinearGradient
            colors={gradients.tileComplete}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

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

        <Text
          style={[styles.activityText, { color: contentColor, opacity: completed ? 1 : 0.9 }]}
          numberOfLines={2}
        >
          {activity}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: 6,
  },
  tile: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 90,
    overflow: 'hidden',
  },
  tileEmpty: {
    backgroundColor: colors.surfaceMuted,
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  gradientWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
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
    borderRadius: radius.sm,
    padding: 3,
  },
  activityText: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    lineHeight: 24,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
