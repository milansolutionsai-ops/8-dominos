import React, { useEffect, useRef } from 'react';
import { Text, Pressable, StyleSheet, Platform, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  Easing,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Check, Plus } from 'lucide-react-native';
import { DominoPips } from './DominoPips';
import { colors, fonts, type, radius, spacing, elevation, motion } from '@/constants/theme';

interface DominoTileProps {
  title: string;
  activity: string;
  completed: boolean;
  onToggle: () => void;
  /** Tapping an unset pillar routes to its setup instead of toggling. */
  onSetup?: () => void;
  index: number;
  /** Which way this tile leans on the board. Its topple must follow it. */
  leanLeft: boolean;
  /** True when a neighbour just completed — drives the chain topple. */
  bumped?: boolean;
  /** Changing number triggers a topple — used by the board for the Perfect Day wave. */
  toppleSignal?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** A felled domino stays felled. This is the angle it rests at. */
const REST_ANGLE = 3.5;

export function DominoTile({
  title,
  activity,
  completed,
  onToggle,
  onSetup,
  index,
  leanLeft,
  bumped,
  toppleSignal,
}: DominoTileProps) {
  const reduceMotion = useReducedMotion();
  const hasActivity = !!activity;
  const pipCount = index + 1; // Body = 1 … Soul = 8

  // Dominoes fall the way they lean. Every tile used to rotate negative while
  // the board alternated its lean, so half of them toppled against themselves.
  const dir = leanLeft ? -1 : 1;
  const rest = completed ? dir * REST_ANGLE : 0;

  const fill = useSharedValue(completed ? 1 : 0);
  const press = useSharedValue(1);
  const topple = useSharedValue(rest);
  const mounted = useRef(false);

  const knock = (deg: number, settleTo: number) => {
    topple.value = withTiming(
      settleTo + deg,
      // Ease-out: the strike is the fast part. Reanimated's default
      // inOut(quad) starts slow, which reads as a wobble, not a hit.
      { duration: 110, easing: Easing.out(Easing.quad) },
      () => {
        topple.value = withSpring(settleTo, motion.springChain);
      }
    );
  };

  useEffect(() => {
    fill.value = withTiming(completed ? 1 : 0, { duration: motion.durationBase });

    // Skip the first run: the effect fires on mount, so every already-complete
    // tile used to topple on each board mount, tab return and date change.
    if (!mounted.current) {
      mounted.current = true;
      topple.value = rest;
      return;
    }
    if (reduceMotion) {
      topple.value = rest;
      return;
    }
    knock(completed ? dir * 9 : dir * -4, rest);
  }, [completed]);

  useEffect(() => {
    if (bumped && !reduceMotion) knock(dir * 5, rest); // sympathetic chain topple
  }, [bumped]);

  useEffect(() => {
    if (toppleSignal && !reduceMotion) knock(dir * 11, rest); // Perfect Day wave
  }, [toppleSignal]);

  // Transform lives on the shadow wrapper and the animated border on the inner
  // tile, because the tile clips (overflow:'hidden' -> masksToBounds on iOS)
  // and a clipping layer throws away its own shadow.
  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${topple.value}deg` }, { scale: press.value }],
  }));

  const tileStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(fill.value, [0, 1], [colors.surfaceAlt, colors.surface]),
    borderColor: interpolateColor(fill.value, [0, 1], [colors.borderStrong, colors.border]),
  }));

  const handlePressIn = () => {
    if (!reduceMotion) press.value = withTiming(0.97, { duration: 80 });
  };
  const handlePressOut = () => {
    if (!reduceMotion) press.value = withSpring(1, motion.springSnappy);
  };

  const handlePress = () => {
    // Fire-and-forget: awaiting the haptic gated the visual state change
    // behind an async native call, so the tile always moved last.
    if (Platform.OS !== 'web') {
      // A toggle is a selection, not a task outcome. Success notification is
      // reserved for the perfect-day moment so the two don't collide.
      Haptics.selectionAsync().catch(() => {});
    }
    onToggle();
  };

  // Unset pillar. Tappable, because a board of eight dead slabs with the only
  // way out buried in Settings was the app's worst dead end.
  if (!hasActivity) {
    return (
      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.duration(360).delay(index * 55)}
        style={styles.container}
      >
        <Pressable
          style={({ pressed }) => [styles.tile, styles.tileEmpty, pressed && styles.pressed]}
          onPress={onSetup}
          disabled={!onSetup}
          accessibilityRole="button"
          accessibilityLabel={`Set your ${title} domino`}
          accessibilityHint="Opens the activity setup"
        >
          <View style={styles.pipCap}>
            <DominoPips count={pipCount} color={colors.textMuted} size={28} />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.content}>
            <Text style={[styles.pillarLabel, styles.pillarLabelMuted]}>{title}</Text>
            <Text style={styles.emptyText}>Set your {title.toLowerCase()} domino</Text>
          </View>
          <Plus size={20} color={colors.textMuted} strokeWidth={2.5} />
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(360).delay(index * 55)}
      style={styles.container}
    >
      <AnimatedPressable
        style={[styles.shadowWrap, wrapStyle, completed ? styles.shadowDone : elevation.sm]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="checkbox"
        accessibilityLabel={`${title}. ${activity}`}
        accessibilityState={{ checked: completed }}
        accessibilityHint={completed ? 'Marks this domino as not done' : 'Marks this domino done'}
      >
        <Animated.View style={[styles.tile, tileStyle]}>
          {/* Left half of the domino: the pip face (pillar identity). */}
          <View style={styles.pipCap}>
            <DominoPips
              count={pipCount}
              color={completed ? colors.accent : colors.accentBright}
              size={28}
            />
          </View>

          {/* Divider down the middle — the domino line. */}
          <View
            style={[styles.divider, { backgroundColor: completed ? colors.border : colors.borderStrong }]}
          />

          {/* Right half: the habit. */}
          <View style={styles.content}>
            <Text
              style={[styles.pillarLabel, completed ? styles.pillarLabelMuted : styles.pillarLabelOn]}
              maxFontSizeMultiplier={1.4}
            >
              {title}
            </Text>
            <Text
              style={[styles.activityText, completed ? styles.activityDone : styles.activityTodo]}
              numberOfLines={2}
              maxFontSizeMultiplier={1.4}
            >
              {activity}
            </Text>
          </View>

          <View style={[styles.mark, completed ? styles.markDone : styles.markTodo]}>
            {completed ? <Check size={15} color={colors.onAccent} strokeWidth={3.5} /> : null}
          </View>
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  /**
   * Carries the shadow and the transform. Must NOT clip: `overflow:'hidden'`
   * sets masksToBounds on iOS, which discards the layer's own shadow. Needs an
   * opaque fill + matching radius so iOS can derive a correct shadow path.
   */
  shadowWrap: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    // Pivot on the base edge. The default centre origin made the topple read
    // as a shiver rather than a domino going over.
    transformOrigin: 'bottom center',
  },
  shadowDone: {},
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    minHeight: 88,
    overflow: 'hidden',
  },
  tileEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    minHeight: 88,
  },
  pressed: { opacity: 0.85 },
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
    paddingRight: spacing.sm,
  },
  pillarLabel: {
    ...type.label,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  pillarLabelOn: { color: colors.textSecondary },
  pillarLabelMuted: { color: colors.textMuted },
  activityText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
  },
  // The thing still to do is the loud one. Completed tiles recede: the board
  // is a chain that falls, not a wall that lights up.
  activityTodo: { color: colors.textPrimary },
  activityDone: { color: colors.textMuted },
  mark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markTodo: {
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  markDone: {
    backgroundColor: colors.accent,
  },
  emptyText: {
    ...type.body,
    color: colors.textMuted,
  },
});
