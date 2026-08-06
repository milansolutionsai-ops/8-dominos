import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { colors, type, spacing, radius } from '@/constants/theme';

interface ShareNudgeCardProps {
  percentage: number;
  perfectDays: number;
  onShare: () => void;
  onDismiss: () => void;
}

/**
 * The end-of-week prompt. An inline card, never a popup, and never on a bad
 * week — see useShareNudges for the visibility rules.
 */
export function ShareNudgeCard({ percentage, perfectDays, onShare, onDismiss }: ShareNudgeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <Text style={styles.title}>Your week is in.</Text>
        <Text style={styles.detail}>
          {percentage}%
          {perfectDays > 0
            ? `  ·  ${perfectDays} perfect ${perfectDays === 1 ? 'day' : 'days'}`
            : ''}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel="Share my week"
      >
        <Text style={styles.ctaText}>Share it</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.dismiss, pressed && styles.pressed]}
        onPress={onDismiss}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Dismiss. This won’t be shown again this week."
      >
        <X size={16} color={colors.textMuted} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  body: { flex: 1 },
  title: {
    ...type.bodyStrong,
    color: colors.textPrimary,
  },
  detail: {
    ...type.caption,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  cta: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  ctaText: {
    ...type.bodySmStrong,
    color: colors.onAccent,
  },
  dismiss: {
    width: 32,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
});
