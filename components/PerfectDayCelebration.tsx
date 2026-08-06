import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform, Modal, Pressable } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, type, radius, spacing } from '@/constants/theme';

interface PerfectDayCelebrationProps {
  visible: boolean;
  streak?: number;
  onShare: () => void;
  onDismiss: () => void;
}

/**
 * Perfect Day = the app's achievement-unlocked moment, and its only real share
 * moment.
 *
 * It used to be pointerEvents="none" and auto-dismiss after 3.4s, so the peak
 * of the whole product was something the user could not touch, hold, or act on.
 * It now holds until he decides, and carries the share action — the one instant
 * a man who just closed all eight actually wants to show someone.
 *
 * Wrapped in a Modal because it renders inside the tab screen, so as a
 * persistent overlay it would otherwise sit under the tab bar and let him
 * navigate away mid-celebration.
 */
export function PerfectDayCelebration({ visible, streak = 0, onShare, onDismiss }: PerfectDayCelebrationProps) {
  const reduceMotion = useReducedMotion();
  const badgeScale = useRef(new Animated.Value(0.6)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

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

    // Entrance only. No exit timer: the moment holds until he acts on it.
    const anim = Animated.parallel([
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
    ]);

    anim.start();

    return () => {
      anim.stop();
      if (thud) clearTimeout(thud);
    };
  }, [visible, reduceMotion]);

  if (!visible) return null;

  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.6] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.32] });
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.2] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.55, 0] });

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onDismiss}>
      <View style={styles.container} accessibilityViewIsModal>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onDismiss}
          accessibilityLabel="Dismiss celebration"
        />

        <Animated.View
          style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}
          pointerEvents="none"
        />
        <Animated.View
          style={[styles.pulseRing, { opacity: pulseOpacity, transform: [{ scale: pulseScale }] }]}
          pointerEvents="none"
        />

        <Animated.View style={[styles.badge, { opacity: badgeOpacity, transform: [{ scale: badgeScale }] }]}>
          <Text style={styles.kicker}>ACHIEVEMENT UNLOCKED</Text>
          <Text style={styles.title}>Perfect Day</Text>
          <Text style={styles.subtitle}>
            All 8 dominos{streak > 0 ? ` · ${streak} day streak` : ''}
          </Text>

          <Pressable
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel="Share this day"
          >
            <Share2 size={18} color={colors.textInverse} strokeWidth={2.5} />
            <Text style={styles.primaryText}>Share this day</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Not now"
          >
            <Text style={styles.secondaryText}>Not now</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const GLOW = 300;
const RING = 180;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
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
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    alignItems: 'center',
    minWidth: 280,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: colors.scoreFull,
    marginBottom: spacing.xs + 2,
  },
  title: {
    ...type.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...type.caption,
    color: colors.textSecondary,
    marginTop: 3,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    alignSelf: 'stretch',
    minHeight: 48,
    marginTop: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.scoreFull,
  },
  primaryText: {
    ...type.bodyStrong,
    color: colors.textInverse,
  },
  secondary: {
    alignSelf: 'stretch',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  secondaryText: {
    ...type.bodySmStrong,
    color: colors.textSecondary,
  },
  pressed: { opacity: 0.85 },
});
