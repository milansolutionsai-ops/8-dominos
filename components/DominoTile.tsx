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
import * as Haptics from 'expo-haptics';
import { DominoPips } from './DominoPips';
import { colors, gradients, fonts, radius, spacing, elevation, motion } from '@/constants/theme';

interface DominoTileProps {
  title: string;
  activity: string;
  completed: boolean;
  onToggle: () => void;
  index: number;
  /** True when a neighbour just completed — drives the chain topple. */
  bumped?: boolean;
  /** Changing number triggers a topple — used by the board for the Perfect Day wave. */
  toppleSignal?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DominoTile({ title, activity, completed, onToggle, index, bumped, toppleSignal }: DominoTileProps) {
  const reduceMotion = useReducedMotion();
  const hasActivity = !!activity;
  const pipCount = index + 1; // Body = 1 … Soul = 8

  const fill = useSharedValue(completed ? 1 : 0);
  const press = useSharedValue(1);
  const topple = useSharedValue(0); // rotation in degrees

  const knock = (deg: number) => {
    topple.value = withSequence(
      withTiming(deg, { duration: 110 }),
      withSpring(0, motion.springChain)
    );
  };

  useEffect(() => {
    fill.value = withTiming(completed ? 1 : 0, { duration: motion.durationBase });
    if (reduceMotion) return;
    knock(completed ? -9 : -4); // complete = a real topple; un-complete = light nudge
  }, [completed]);

  useEffect(() => {
    if (bumped && !reduceMotion) knock(-5); // sympathetic chain topple
  }, [bumped]);

  useEffect(() => {
    if (toppleSignal && !reduceMotion) knock(-11); // Perfect Day wave
  }, [toppleSignal]);

  const tileStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(fill.value, [0, 1], [colors.border, colors.accentBright]),
    transform: [{ rotate: `${topple.value}deg` }, { scale: press.value }],
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
        if (!completed) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        else await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('Error with haptics:', error);
    }
    onToggle();
  };

  const contentColor = completed ? colors.onAccent : colors.textPrimary;
  const pipColor = completed ? colors.onAccent : colors.textMuted;
  const dividerColor = completed ? 'rgba(255,255,255,0.45)' : colors.border;

  // Empty pillar (no activity set): non-interactive, ghosted.
  if (!hasActivity) {
    return (
      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.duration(360).delay(index * 55)}
        style={styles.container}
      >
        <View style={[styles.tile, styles.tileEmpty]}>
          <View style={styles.pipCap}>
            <DominoPips count={pipCount} color={colors.textMuted} size={26} />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.content}>
            <Text style={[styles.pillarLabel, { color: colors.textMuted, opacity: 0.55 }]}>{title}</Text>
            <Text style={styles.emptyText}>No activity set</Text>
          </View>
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
        {/* Lit blue gradient fades in on completion (the "domino lights up"). */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.gradientWrap, gradientStyle]} pointerEvents="none">
          <LinearGradient colors={gradients.tileComplete} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        </Animated.View>

        {/* Left half of the domino: the pip face (pillar identity). */}
        <View style={styles.pipCap}>
          <DominoPips count={pipCount} color={pipColor} size={28} />
        </View>

        {/* Divider down the middle — the domino line. */}
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

        {/* Right half: the habit. */}
        <View style={styles.content}>
          <Text style={[styles.pillarLabel, { color: contentColor, opacity: completed ? 0.85 : 0.55 }]}>
            {title}
          </Text>
          <Text style={[styles.activityText, { color: contentColor, opacity: completed ? 1 : 0.92 }]} numberOfLines={2}>
            {activity}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 88,
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
  pipCap: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth * 3,
    alignSelf: 'stretch',
    marginVertical: 6,
    marginHorizontal: spacing.sm,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  pillarLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  activityText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
