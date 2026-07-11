import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { colors, fonts, radius, spacing, elevation } from '@/constants/theme';

interface ConfettiCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
}

/**
 * Perfect Day celebration — a soft accent glow blooms behind a branded badge,
 * then fades. Deliberately restrained (no confetti); the chain-topple wave on
 * the board carries the motion.
 */
export function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const reduceMotion = useReducedMotion();
  const badgeScale = useRef(new Animated.Value(0.6)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;
    badgeScale.setValue(reduceMotion ? 1 : 0.6);
    badgeOpacity.setValue(0);
    glow.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(badgeScale, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
        Animated.timing(badgeOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 1, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.delay(1700),
      Animated.parallel([
        Animated.timing(badgeOpacity, { toValue: 0, duration: 420, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
    ]).start(() => onComplete?.());
  }, [trigger]);

  if (!trigger) return null;

  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.7] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
      <Animated.View
        style={[styles.badge, elevation.accentGlow, { opacity: badgeOpacity, transform: [{ scale: badgeScale }] }]}
      >
        <Text style={styles.badgeTitle}>Perfect Day</Text>
        <Text style={styles.badgeSubtitle}>All 8 dominos down</Text>
      </Animated.View>
    </View>
  );
}

const GLOW = 300;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  glow: {
    position: 'absolute',
    width: GLOW,
    height: GLOW,
    borderRadius: GLOW / 2,
    backgroundColor: colors.accentBright,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  badgeTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.onAccent,
    letterSpacing: -0.3,
  },
  badgeSubtitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.onAccent,
    opacity: 0.85,
    marginTop: 2,
  },
});
