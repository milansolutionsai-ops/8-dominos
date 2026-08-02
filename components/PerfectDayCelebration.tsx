import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radius, spacing } from '@/constants/theme';

interface PerfectDayCelebrationProps {
  trigger: boolean;
  streak?: number;
  onComplete?: () => void;
}

/**
 * Perfect Day = the app's achievement-unlocked moment.
 *
 * Gold treatment (the score ramp's 8/8 colour), a ring pulsing out behind the
 * badge, and layered haptics — Success on impact, a heavier thud just after —
 * so it lands like an unlock rather than a toast. The board's chain-topple wave
 * runs underneath and carries the motion.
 */
export function PerfectDayCelebration({ trigger, streak = 0, onComplete }: PerfectDayCelebrationProps) {
  const reduceMotion = useReducedMotion();
  const badgeScale = useRef(new Animated.Value(0.6)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;

    badgeScale.setValue(reduceMotion ? 1 : 0.6);
    badgeOpacity.setValue(0);
    pulse.setValue(0);
    glow.setValue(0);

    let thud: ReturnType<typeof setTimeout> | undefined;
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      // The second, heavier beat is what sells "unlocked".
      thud = setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      }, 180);
    }

    const anim = Animated.sequence([
      Animated.parallel([
        Animated.spring(badgeScale, { toValue: 1, friction: 5.5, tension: 140, useNativeDriver: true }),
        Animated.timing(badgeOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 1, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ...(reduceMotion
          ? []
          : [
              Animated.timing(pulse, {
                toValue: 1,
                duration: 900,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
            ]),
      ]),
      Animated.delay(1900),
      Animated.parallel([
        Animated.timing(badgeOpacity, { toValue: 0, duration: 420, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
    ]);

    anim.start(() => onComplete?.());

    return () => {
      anim.stop();
      if (thud) clearTimeout(thud);
    };
  }, [trigger]);

  if (!trigger) return null;

  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.6] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.32] });
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.2] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.55, 0] });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
      <Animated.View style={[styles.pulseRing, { opacity: pulseOpacity, transform: [{ scale: pulseScale }] }]} />

      <Animated.View style={[styles.badge, { opacity: badgeOpacity, transform: [{ scale: badgeScale }] }]}>
        <Text style={styles.kicker}>ACHIEVEMENT UNLOCKED</Text>
        <Text style={styles.title}>Perfect Day</Text>
        <Text style={styles.subtitle}>
          All 8 dominos{streak > 0 ? ` · ${streak} day streak` : ''}
        </Text>
      </Animated.View>
    </View>
  );
}

const GLOW = 300;
const RING = 180;

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
    backgroundColor: colors.scoreFull,
  },
  pulseRing: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 3,
    borderColor: colors.scoreFull,
  },
  badge: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.scoreFull,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: colors.scoreFull,
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.extrabold,
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },
});
